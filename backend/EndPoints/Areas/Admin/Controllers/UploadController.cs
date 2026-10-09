using EndPoints.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EndPoints.Areas.Admin.Controllers;

/// <summary>
/// Image endpoint used by the panel's FileUploader component
/// (<c>wwwroot/Panel/custome/js/file-uploader.js</c>). Files land in
/// <c>wwwroot/uploads/&lt;folder&gt;/&lt;yyyy&gt;&lt;mm&gt;/</c> and are served with a
/// one-year immutable cache header.
/// </summary>
[Area("Admin")]
[Authorize(Policy = AdminPolicies.Panel)]
[Route("admin/upload")]
public sealed class UploadController : Controller
{
    private static readonly Dictionary<string, string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        [".jpg"] = "image/jpeg",
        [".jpeg"] = "image/jpeg",
        [".png"] = "image/png",
        [".webp"] = "image/webp",
        [".svg"] = "image/svg+xml",
        [".avif"] = "image/avif",
    };

    private const long MaxBytes = 6L * 1024 * 1024;

    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<UploadController> _logger;

    public UploadController(IWebHostEnvironment environment, ILogger<UploadController> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    [HttpPost("UploadImage")]
    [RequestSizeLimit(MaxBytes + 1024 * 1024)]
    public async Task<IActionResult> UploadImage(IFormFile? file, [FromQuery] string folder = "portfolio", CancellationToken cancellationToken = default)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(new { success = false, message = "فایلی ارسال نشده است." });
        }

        if (file.Length > MaxBytes)
        {
            return BadRequest(new { success = false, message = "حجم تصویر نباید بیشتر از ۶ مگابایت باشد." });
        }

        var extension = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(extension) || !AllowedExtensions.TryGetValue(extension, out var contentType))
        {
            return BadRequest(new { success = false, message = "فقط JPG، PNG، WEBP، AVIF یا SVG مجاز است." });
        }

        if (!string.IsNullOrEmpty(file.ContentType) && !string.Equals(file.ContentType, contentType, StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { success = false, message = "نوع فایل با پسوند آن همخوانی ندارد." });
        }

        // Only a known, single-word folder name may be used → no path traversal.
        var safeFolder = folder.Length is > 0 and <= 30 && folder.All(char.IsLetter) ? folder.ToLowerInvariant() : "portfolio";
        var now = DateTime.UtcNow;
        var relativeDirectory = Path.Combine("uploads", safeFolder, now.ToString("yyyyMM"));
        var targetDirectory = Path.Combine(_environment.WebRootPath, relativeDirectory);
        Directory.CreateDirectory(targetDirectory);

        var nameOnly = Path.GetFileNameWithoutExtension(file.FileName);
        var slug = new string(nameOnly.Where(character => char.IsLetterOrDigit(character) || character is '-' or '_').ToArray())
            .ToLowerInvariant();
        if (slug.Length == 0)
        {
            slug = "media";
        }

        if (slug.Length > 60)
        {
            slug = slug[..60];
        }

        var fileName = $"{slug}-{Guid.NewGuid().ToString("N")[..8]}{extension.ToLowerInvariant()}";
        var targetPath = Path.Combine(targetDirectory, fileName);

        await using (var stream = System.IO.File.Create(targetPath))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        var publicPath = "/" + Path.Combine(relativeDirectory, fileName).Replace('\\', '/');
        _logger.LogInformation("Uploaded {Path} ({Bytes} bytes)", publicPath, file.Length);

        return Ok(new { success = true, filePath = publicPath, size = file.Length });
    }
}
