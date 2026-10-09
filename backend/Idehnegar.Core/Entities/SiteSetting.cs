using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Idehnegar.Core.Entities;

/// <summary>
/// The single row behind <c>src/lib/site-config.ts</c> — company identity,
/// contact channels and headline figures. Used by the header, footer, contact
/// page, JSON-LD blocks and canonical/sitemap URLs.
/// </summary>
public class SiteSetting
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(120)]
    public string Domain { get; set; } = "idehnegar.co";

    /// <summary>Absolute site URL without trailing slash — powers canonical, OG and sitemap URLs.</summary>
    [MaxLength(250)]
    public string SiteUrl { get; set; } = "https://idehnegar.co";

    [MaxLength(200)]
    public string NameFa { get; set; } = "پیشگامان ایده‌نگار";

    [MaxLength(200)]
    public string NameEn { get; set; } = "Idehnegar Pioneers";

    [MaxLength(100)]
    public string ShortNameFa { get; set; } = "ایده‌نگار";

    [MaxLength(100)]
    public string ShortNameEn { get; set; } = "Idehnegar";

    [MaxLength(300)]
    public string TaglineFa { get; set; } = string.Empty;

    [MaxLength(300)]
    public string TaglineEn { get; set; } = string.Empty;

    public int FoundedJalali { get; set; } = 1389;

    public int FoundedGregorian { get; set; } = 2010;

    [MaxLength(200)]
    public string Email { get; set; } = "info@idehnegar.co";

    /// <summary>JSON array of phone numbers (first item is the primary line).</summary>
    public string? PhonesJson { get; set; }

    [MaxLength(60)]
    public string? TelegramId { get; set; }

    [MaxLength(60)]
    public string? WhatsAppNumber { get; set; }

    [MaxLength(500)]
    public string? AddressFa { get; set; }

    [MaxLength(500)]
    public string? AddressEn { get; set; }

    [MaxLength(250)]
    public string? HoursFa { get; set; }

    [MaxLength(250)]
    public string? HoursEn { get; set; }

    [MaxLength(1000)]
    public string? MapEmbedSrc { get; set; }

    /// <summary>JSON object with telegram / linkedin / instagram profile URLs.</summary>
    public string? SocialJson { get; set; }

    /// <summary>JSON object with clients / projects / yearsActive / awards counters.</summary>
    public string? StatsJson { get; set; }

    /// <summary>Default social preview image for pages without their own OG image.</summary>
    [MaxLength(500)]
    public string? DefaultOgImage { get; set; }

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    [NotMapped]
    public List<string> Phones
    {
        get => Idehnegar.Core.Json.JsonList.ReadStrings(PhonesJson);
        set => PhonesJson = Idehnegar.Core.Json.JsonList.Write(value);
    }

    /// <summary>telegram / linkedin / instagram profile URLs.</summary>
    [NotMapped]
    public List<Idehnegar.Core.ValueObjects.NamedValue> Social
    {
        get => Idehnegar.Core.Json.JsonList.Read<Idehnegar.Core.ValueObjects.NamedValue>(SocialJson);
        set => SocialJson = Idehnegar.Core.Json.JsonList.Write(value);
    }

    /// <summary>clients / projects / yearsActive / awards counters.</summary>
    [NotMapped]
    public List<Idehnegar.Core.ValueObjects.NamedValue> Stats
    {
        get => Idehnegar.Core.Json.JsonList.Read<Idehnegar.Core.ValueObjects.NamedValue>(StatsJson);
        set => StatsJson = Idehnegar.Core.Json.JsonList.Write(value);
    }
}
