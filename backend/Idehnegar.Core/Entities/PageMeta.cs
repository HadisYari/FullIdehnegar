using System.ComponentModel.DataAnnotations;

namespace Idehnegar.Core.Entities;

/// <summary>
/// One row per front-end route. Feeds <c>generateMetadata()</c> (title,
/// description, keywords, OG image, robots) and the sitemap, so page SEO can
/// be edited from the admin panel without rebuilding the site.
/// </summary>
public class PageMeta : ContentEntity
{
    /// <summary>Route key used by the front-end: home, about, services, portfolio, contact…</summary>
    [MaxLength(80)]
    public string PageKey { get; set; } = string.Empty;

    /// <summary>Persian path (English path is the same prefixed with /en).</summary>
    [MaxLength(200)]
    public string Path { get; set; } = "/";

    [MaxLength(220)]
    public string TitleFa { get; set; } = string.Empty;

    [MaxLength(220)]
    public string TitleEn { get; set; } = string.Empty;

    /// <summary>Meta description — keep under 160 chars for search snippets.</summary>
    [MaxLength(400)]
    public string DescriptionFa { get; set; } = string.Empty;

    [MaxLength(400)]
    public string DescriptionEn { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? KeywordsFa { get; set; }

    [MaxLength(500)]
    public string? KeywordsEn { get; set; }

    /// <summary>Hero copy of the page (the small label above the title).</summary>
    [MaxLength(200)]
    public string? EyebrowFa { get; set; }

    [MaxLength(200)]
    public string? EyebrowEn { get; set; }

    [MaxLength(300)]
    public string? HeadingFa { get; set; }

    [MaxLength(300)]
    public string? HeadingEn { get; set; }

    [MaxLength(1000)]
    public string? SubheadingFa { get; set; }

    [MaxLength(1000)]
    public string? SubheadingEn { get; set; }

    [MaxLength(150)]
    public string? CtaPrimaryFa { get; set; }

    [MaxLength(150)]
    public string? CtaPrimaryEn { get; set; }

    [MaxLength(150)]
    public string? CtaSecondaryFa { get; set; }

    [MaxLength(150)]
    public string? CtaSecondaryEn { get; set; }

    [MaxLength(500)]
    public string? OgImage { get; set; }

    /// <summary>When true the page is served with <c>noindex, nofollow</c> and left out of the sitemap.</summary>
    public bool NoIndex { get; set; }

    [MaxLength(20)]
    public string ChangeFrequency { get; set; } = "monthly";

    /// <summary>&lt;url&gt;&lt;priority&gt;</summary>
    public decimal Priority { get; set; } = 0.8m;
}
