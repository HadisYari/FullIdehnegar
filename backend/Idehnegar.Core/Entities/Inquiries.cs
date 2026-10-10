using System.ComponentModel.DataAnnotations;

namespace Idehnegar.Core.Entities;

/// <summary>Download button of the /gold-app landing page.</summary>
public class AppDownloadLink : ContentEntity
{
    [MaxLength(200)]
    public string TitleFa { get; set; } = string.Empty;

    [MaxLength(200)]
    public string TitleEn { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? CaptionFa { get; set; }

    [MaxLength(200)]
    public string? CaptionEn { get; set; }

    [MaxLength(1000)]
    public string Href { get; set; } = "#";

    /// <summary>Emoji or icon rendered inside the button.</summary>
    [MaxLength(10)]
    public string? Emoji { get; set; }

    /// <summary>tailwind color variant: bazaar | direct | anchor.</summary>
    [MaxLength(30)]
    public string? Variant { get; set; }
}

/// <summary>A submission of the contact form (was <c>src/data/messages.json</c>).</summary>
public class ContactMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(60)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Subject { get; set; }

    [MaxLength(8000)]
    public string Message { get; set; } = string.Empty;

    /// <summary>Inquiry type code chosen on the form, when provided.</summary>
    [MaxLength(80)]
    public string? InquiryType { get; set; }

    [MaxLength(10)]
    public string Locale { get; set; } = "fa";

    /// <summary>Requester IP, useful when triaging spam.</summary>
    [MaxLength(64)]
    public string? SourceIp { get; set; }

    public bool EmailSent { get; set; }

    public bool IsArchived { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
