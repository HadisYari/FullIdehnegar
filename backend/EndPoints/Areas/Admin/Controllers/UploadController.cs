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
/// <remarks>
/// The file is accepted by its extension and by its first bytes (magic number),
/// not by the browser-reported <c>Content-Type</c>. Browsers and operating systems
/// disagree on that header (for example <c>.webp</c> or <c>.avif</c> is often sent as
/// <c>application/octet-stream</c>, and <c>.ico</c> has several MIME names), so an
/// exact MIME comparison rejected perfectly valid images.
/// </remarks>
[Area("Admin")]
[Authorize(Policy = AdminPolicies.Panel)]
[Route("admin/upload")]
public sealed class UploadController : Controller
{
    /// <summary>One list for the whole upload path. Keep it in sync with the accept list in <c>_FileUploader.cshtml</c>.</summary>
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".avif",
        ".svg",
        ".ico",
    };

    private const long MaxBytes = 6L * 1024 * 1024;

    /// <summary>Enough bytes for every signature below, including the SVG root-tag search.</summary>
    private const int HeaderBytes = 4096;

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
        if (string.IsNullOrWhiteSpace(extension) || !AllowedExtensions.Contains(extension))
        {
            return BadRequest(new { success = false, message = "فقط JPG، PNG، GIF، WEBP، AVIF، SVG یا ICO مجاز است." });
        }

        var header = await ReadHeaderAsync(file, cancellationToken);
        if (!HasImageSignature(extension.ToLowerInvariant(), header))
        {
            return BadRequest(new { success = false, message = "محتوای فایل با پسوند آن همخوانی ندارد؛ یک فایل تصویر معتبر انتخاب کنید." });
        }

        // Only a known, single-word folder name may be used → no path traversal.
        var safeFolder = folder.Length is > 0 and <= 30 && folder.All(char.IsLetter) ? folder.ToLowerInvariant() : "portfolio";
        var now = DateTime.UtcNow;
        var relativeDirectory = Path.Combine("uploads", safeFolder, now.ToString("yyyyMM"));
        var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
        var targetDirectory = Path.Combine(webRoot, relativeDirectory);

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

        try
        {
            Directory.CreateDirectory(targetDirectory);

            await using var source = file.OpenReadStream();
            await using var stream = System.IO.File.Create(targetPath);
            await source.CopyToAsync(stream, cancellationToken);
        }
        catch (Exception ex) when (ex is IOException or UnauthorizedAccessException)
        {
            _logger.LogError(ex, "Could not store uploaded image at {Path}", targetPath);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "ذخیره تصویر روی سرور ممکن نشد؛ دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.",
            });
        }

        var publicPath = "/" + Path.Combine(relativeDirectory, fileName).Replace('\\', '/');
        _logger.LogInformation("Uploaded {Path} ({Bytes} bytes)", publicPath, file.Length);

        return Ok(new { success = true, filePath = publicPath, size = file.Length });
    }

    private static async Task<byte[]> ReadHeaderAsync(IFormFile file, CancellationToken cancellationToken)
    {
        var length = (int)Math.Min(HeaderBytes, file.Length);
        var buffer = new byte[length];

        await using var stream = file.OpenReadStream();
        var read = await stream.ReadAtLeastAsync(buffer, length, throwOnEndOfStream: false, cancellationToken);
        return buffer[..read];
    }

    /// <summary>Checks the magic number of the format named by the extension.</summary>
    private static bool HasImageSignature(string extension, ReadOnlySpan<byte> header) => extension switch
    {
        ".jpg" or ".jpeg" => StartsWithBytes(header, [0xFF, 0xD8, 0xFF]),
        ".png" => StartsWithBytes(header, [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
        ".gif" => StartsWithBytes(header, "GIF8"u8),
        ".webp" => StartsWithBytes(header, "RIFF"u8) && header.Length >= 12 && header.Slice(8, 4).SequenceEqual("WEBP"u8),
        ".avif" => header.Length >= 12
            && header.Slice(4, 4).SequenceEqual("ftyp"u8)
            && (header.Slice(8, 4).SequenceEqual("avif"u8) || header.Slice(8, 4).SequenceEqual("avis"u8)),
        ".ico" => StartsWithBytes(header, [0x00, 0x00, 0x01, 0x00]),
        ".svg" => header.Length > 0 && System.Text.Encoding.UTF8.GetString(header).Contains("<svg", StringComparison.OrdinalIgnoreCase),
        _ => false,
    };

    private static bool StartsWithBytes(ReadOnlySpan<byte> data, ReadOnlySpan<byte> signature) =>
        data.Length >= signature.Length && data.Slice(0, signature.Length).SequenceEqual(signature);
}
