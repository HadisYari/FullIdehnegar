using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Idehnegar.Core.Entities;

/// <summary>
/// One row = one service shown both on the home "services" grid and on the
/// services page (where <c>HighlightsFa/En</c> render the detail cards).
/// </summary>
public class Service : ContentEntity
{
    /// <summary>Icon identifier picked up by the front end (lucide-react name).</summary>
    [MaxLength(60)]
    public string? Icon { get; set; }

    [MaxLength(300)]
    public string TitleFa { get; set; } = string.Empty;

    [MaxLength(300)]
    public string TitleEn { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string DescriptionFa { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string DescriptionEn { get; set; } = string.Empty;

    /// <summary>JSON array of bullet points (Persian) shown on the services page.</summary>
    public string? HighlightsFaJson { get; set; }

    /// <summary>JSON array of bullet points (English).</summary>
    public string? HighlightsEnJson { get; set; }

    /// <summary>Selects the animated visual of the matching service card.</summary>
    public int VisualIndex { get; set; }

    [NotMapped]
    public List<string> HighlightsFa
    {
        get => Idehnegar.Core.Json.JsonList.ReadStrings(HighlightsFaJson);
        set => HighlightsFaJson = Idehnegar.Core.Json.JsonList.Write(value);
    }

    [NotMapped]
    public List<string> HighlightsEn
    {
        get => Idehnegar.Core.Json.JsonList.ReadStrings(HighlightsEnJson);
        set => HighlightsEnJson = Idehnegar.Core.Json.JsonList.Write(value);
    }
}

/// <summary>One step of the 7-step "from idea to launch" process section.</summary>
public class ProcessStep : ContentEntity
{
    [MaxLength(60)]
    public string? Icon { get; set; }

    /// <summary>Tailwind gradient classes, e.g. <c>from-blue-500 to-cyan-500</c>.</summary>
    [MaxLength(200)]
    public string? Color { get; set; }

    /// <summary>Accent hex used for the glow of the active card.</summary>
    [MaxLength(20)]
    public string? Accent { get; set; }

    [MaxLength(300)]
    public string TitleFa { get; set; } = string.Empty;

    [MaxLength(300)]
    public string TitleEn { get; set; } = string.Empty;

    /// <summary>e.g. "۱ تا ۲ هفته".</summary>
    [MaxLength(120)]
    public string? DurationFa { get; set; }

    [MaxLength(120)]
    public string? DurationEn { get; set; }

    [MaxLength(2000)]
    public string DescriptionFa { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string DescriptionEn { get; set; } = string.Empty;

    public string? DeliverablesFaJson { get; set; }

    public string? DeliverablesEnJson { get; set; }

    [NotMapped]
    public List<string> DeliverablesFa
    {
        get => Idehnegar.Core.Json.JsonList.ReadStrings(DeliverablesFaJson);
        set => DeliverablesFaJson = Idehnegar.Core.Json.JsonList.Write(value);
    }

    [NotMapped]
    public List<string> DeliverablesEn
    {
        get => Idehnegar.Core.Json.JsonList.ReadStrings(DeliverablesEnJson);
        set => DeliverablesEnJson = Idehnegar.Core.Json.JsonList.Write(value);
    }
}

/// <summary>Client logo cell of the "trusted by" marquee on the home page.</summary>
public class Client : ContentEntity
{
    [MaxLength(300)]
    public string NameFa { get; set; } = string.Empty;

    [MaxLength(300)]
    public string NameEn { get; set; } = string.Empty;

    /// <summary>Short monogram rendered inside the badge (GOV, MUN, MED …).</summary>
    [MaxLength(10)]
    public string? Monogram { get; set; }

    /// <summary>Optional real logo; when set the front end prefers it over the monogram.</summary>
    [MaxLength(500)]
    public string? LogoUrl { get; set; }
}

/// <summary>Customer feedback slide (testimonials.json).</summary>
public class Testimonial : ContentEntity
{
    [MaxLength(300)]
    public string NameFa { get; set; } = string.Empty;

    [MaxLength(300)]
    public string NameEn { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string QuoteFa { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string QuoteEn { get; set; } = string.Empty;
}

/// <summary>
/// One card of the home "services" grid (<c>services-section.tsx</c>). These are a
/// marketing layer separate from the six services of the services page: each card
/// carries its code label, colour theme, KPI row and technology chips.
/// </summary>
public class HomeServiceCard : ContentEntity
{
    /// <summary>Monospace code label shown on the card, e.g. <c>EXP // 01</c>.</summary>
    [MaxLength(40)]
    public string Code { get; set; } = string.Empty;

    /// <summary>lucide-react icon name (Sparkles, Cpu, Zap …).</summary>
    [MaxLength(40)]
    public string? IconName { get; set; }

    [MaxLength(300)]
    public string TitleFa { get; set; } = string.Empty;

    [MaxLength(300)]
    public string TitleEn { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string DescriptionFa { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string DescriptionEn { get; set; } = string.Empty;

    /// <summary>Accent colour (hex) of the icon, the KPI value and the progress bar.</summary>
    [MaxLength(20)]
    public string? Color { get; set; }

    /// <summary>Soft background colour (hex) of the icon tile.</summary>
    [MaxLength(20)]
    public string? SoftColor { get; set; }

    /// <summary>CSS colour of the blurred glow behind the card.</summary>
    [MaxLength(60)]
    public string? GlowColor { get; set; }

    [MaxLength(200)]
    public string? FeatureTitleFa { get; set; }

    [MaxLength(200)]
    public string? FeatureTitleEn { get; set; }

    [MaxLength(100)]
    public string? FeatureValueFa { get; set; }

    [MaxLength(100)]
    public string? FeatureValueEn { get; set; }

    /// <summary>Width of the KPI progress bar, e.g. <c>92%</c>.</summary>
    [MaxLength(10)]
    public string? Progress { get; set; }

    /// <summary>JSON array of technology chips shown at the bottom of the card.</summary>
    public string? TagsJson { get; set; }

    [NotMapped]
    public List<string> Tags
    {
        get => Idehnegar.Core.Json.JsonList.ReadStrings(TagsJson);
        set => TagsJson = Idehnegar.Core.Json.JsonList.Write(value);
    }
}
