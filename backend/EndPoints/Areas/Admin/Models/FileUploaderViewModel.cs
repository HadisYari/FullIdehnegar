namespace EndPoints.Areas.Admin.Models;

public sealed class FileUploaderViewModel
{
    public string Name { get; init; } = "ImagePath";
    public string Label { get; init; } = "تصویر";
    public string? Value { get; init; }
    public string Accept { get; init; } = ".jpg,.jpeg,.png,.webp";
    public int MaxSizeMB { get; init; } = 8;
    public bool Required { get; init; }
    public string? Hint { get; init; }
}
