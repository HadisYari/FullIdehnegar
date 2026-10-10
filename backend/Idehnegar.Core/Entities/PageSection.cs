using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Idehnegar.Core.Entities;

/// <summary>
/// Copy and repeated items of one block of a page (hero, cards, bullet lists …). The
/// front end used to hard-code these blocks. <c>PageKey</c> + <c>SectionKey</c> identify
/// the block; the items live in <c>ItemsJson</c> (same pattern as portfolio features).
/// </summary>
public class PageSection : ContentEntity
{
    /// <summary>Page the block belongs to: <c>home</c>, <c>about</c>, <c>gold-app</c> …</summary>
    [MaxLength(40)]
    public string PageKey { get; set; } = string.Empty;

    /// <summary>Block key inside the page, e.g. <c>hero</c> or <c>manifesto</c>.</summary>
    [MaxLength(60)]
    public string SectionKey { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? EyebrowFa { get; set; }

    [MaxLength(200)]
    public string? EyebrowEn { get; set; }

    [MaxLength(300)]
    public string? TitleFa { get; set; }

    [MaxLength(300)]
    public string? TitleEn { get; set; }

    [MaxLength(1000)]
    public string? SubtitleFa { get; set; }

    [MaxLength(1000)]
    public string? SubtitleEn { get; set; }

    [MaxLength(2000)]
    public string? BodyFa { get; set; }

    [MaxLength(2000)]
    public string? BodyEn { get; set; }

    /// <summary>JSON array of <see cref="PageSectionItem"/>.</summary>
    public string? ItemsJson { get; set; }

    [NotMapped]
    public List<PageSectionItem> Items
    {
        get => Idehnegar.Core.Json.JsonList.Read<PageSectionItem>(ItemsJson);
        set => ItemsJson = Idehnegar.Core.Json.JsonList.Write(value);
    }
}

/// <summary>
/// One repeated item of a page block: a bullet (title only), a card (title + description)
/// or a link card (title + description + href). Bilingual; <c>Icon</c> is optional.
/// </summary>
public class PageSectionItem
{
    public string? Icon { get; set; }

    public string TitleFa { get; set; } = string.Empty;

    public string TitleEn { get; set; } = string.Empty;

    public string DescriptionFa { get; set; } = string.Empty;

    public string DescriptionEn { get; set; } = string.Empty;

    public string? Href { get; set; }
}
