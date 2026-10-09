namespace EndPoints.Core.Entities;

/// <summary>A message submitted through the public website contact form.</summary>
public sealed class ContactSubmission
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Locale { get; set; } = "fa";
    public DateTime CreatedAtUtc { get; set; }
    public bool IsRead { get; set; }
}
