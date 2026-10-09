using System.Buffers;
using EndPoints.Areas.Admin.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EndPoints.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin")]
public sealed class UploadController(IWebHostEnvironment environment) : Controller
{
    private const long MaxImageSizeBytes = 8 * 1024 * 1024;

    [HttpPost]
    [RequestSizeLimit(MaxImageSizeBytes + 256 * 1024)]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UploadImage(IFormFile? file, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0) return BadRequest(new { message = "فایلی انتخاب نشده است." });
        if (file.Length > MaxImageSizeBytes) return BadRequest(new { message = "حداکثر حجم تصویر ۸ مگابایت است." });

        var (extension, signatureLength) = await DetectImageTypeAsync(file, cancellationToken);
        if (extension is null) return BadRequest(new { message = "فقط تصاویر معتبر PNG، JPEG و WebP پذیرفته می‌شوند." });

        var folder = Path.Combine(environment.WebRootPath, "uploads", "content");
        Directory.CreateDirectory(folder);
        var fileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(folder, fileName);

        await using (var output = new FileStream(filePath, FileMode.CreateNew, FileAccess.Write, FileShare.None))
        await using (var input = file.OpenReadStream())
        {
            // Copy the original validated image; there is no trust in the browser-provided filename.
            await input.CopyToAsync(output, cancellationToken);
        }

        var publicPath = $"/uploads/content/{fileName}";
        return Ok(new { success = true, filePath = publicPath, url = publicPath, name = fileName, size = file.Length, signatureLength });
    }

    private static async Task<(string? Extension, int SignatureLength)> DetectImageTypeAsync(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        var buffer = ArrayPool<byte>.Shared.Rent(16);
        try
        {
            await using var stream = file.OpenReadStream();
            var count = await stream.ReadAsync(buffer.AsMemory(0, 16), cancellationToken);
            if (count >= 8 && buffer.AsSpan(0, 8).SequenceEqual(new byte[] { 137, 80, 78, 71, 13, 10, 26, 10 }))
                return (".png", 8);
            if (count >= 3 && buffer[0] == 0xFF && buffer[1] == 0xD8 && buffer[2] == 0xFF)
                return (".jpg", 3);
            if (count >= 12 && buffer.AsSpan(0, 4).SequenceEqual("RIFF"u8) && buffer.AsSpan(8, 4).SequenceEqual("WEBP"u8))
                return (".webp", 12);
            return (null, 0);
        }
        finally
        {
            ArrayPool<byte>.Shared.Return(buffer);
        }
    }
}
