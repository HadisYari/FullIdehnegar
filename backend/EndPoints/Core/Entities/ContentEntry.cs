namespace EndPoints.Core.Entities;

/// <summary>
/// A single CMS document. Localized fields are edited together and the JSON
/// payloads keep page-specific data flexible without adding a table per section.
/// </summary>
public sealed class ContentEntry
{
    public int Id { get; set; }

    public string ContentKey { get; set; } = string.Empty;
    public string ContentType { get; set; } = "page";

    // Slug is shared by the current portfolio routes; localized variants allow
    // future SEO-friendly route changes without changing the schema.
    public string? Slug { get; set; }
    public string? SlugFa { get; set; }
    public string? SlugEn { get; set; }

    public string? TitleFa { get; set; }
    public string? TitleEn { get; set; }
    public string? SummaryFa { get; set; }
    public string? SummaryEn { get; set; }
    public string? BodyFa { get; set; }
    public string? BodyEn { get; set; }

    public string? MetaTitleFa { get; set; }
    public string? MetaTitleEn { get; set; }
    public string? MetaDescriptionFa { get; set; }
    public string? MetaDescriptionEn { get; set; }
    public string? KeywordsFa { get; set; }
    public string? KeywordsEn { get; set; }
    public string? CanonicalUrlFa { get; set; }
    public string? CanonicalUrlEn { get; set; }
    public string? OpenGraphTitleFa { get; set; }
    public string? OpenGraphTitleEn { get; set; }
    public string? OpenGraphDescriptionFa { get; set; }
    public string? OpenGraphDescriptionEn { get; set; }

    public string? ImagePath { get; set; }
    public string? ImageAltFa { get; set; }
    public string? ImageAltEn { get; set; }

    /// <summary>Per-locale page/project data, stored as valid JSON objects.</summary>
    public string DataFaJson { get; set; } = "{}";
    public string DataEnJson { get; set; } = "{}";

    /// <summary>Locale-independent data (for example a bilingual portfolio record).</summary>
    public string SharedJson { get; set; } = "{}";

    public bool IsPublished { get; set; } = true;
    public bool IsFeatured { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }
}
