using System.ComponentModel.DataAnnotations;
using EndPoints.Core.Entities;

namespace EndPoints.Areas.Admin.Models;

public sealed class ContentFormModel
{
    public int Id { get; set; }

    [Required, StringLength(180)]
    [RegularExpression("^[a-zA-Z0-9][a-zA-Z0-9:._-]*$", ErrorMessage = "کلید فقط می‌تواند شامل حروف انگلیسی، عدد و : . _ - باشد.")]
    public string ContentKey { get; set; } = string.Empty;

    [Required, StringLength(40)]
    [RegularExpression("^[a-zA-Z0-9_-]+$", ErrorMessage = "نوع محتوا معتبر نیست.")]
    public string ContentType { get; set; } = "page";

    [StringLength(180)] public string? Slug { get; set; }
    [StringLength(180)] public string? SlugFa { get; set; }
    [StringLength(180)] public string? SlugEn { get; set; }
    [StringLength(250)] public string? TitleFa { get; set; }
    [StringLength(250)] public string? TitleEn { get; set; }
    [StringLength(1000)] public string? SummaryFa { get; set; }
    [StringLength(1000)] public string? SummaryEn { get; set; }
    public string? BodyFa { get; set; }
    public string? BodyEn { get; set; }

    [StringLength(250)] public string? MetaTitleFa { get; set; }
    [StringLength(250)] public string? MetaTitleEn { get; set; }
    [StringLength(500)] public string? MetaDescriptionFa { get; set; }
    [StringLength(500)] public string? MetaDescriptionEn { get; set; }
    [StringLength(500)] public string? KeywordsFa { get; set; }
    [StringLength(500)] public string? KeywordsEn { get; set; }
    [StringLength(512)] public string? CanonicalUrlFa { get; set; }
    [StringLength(512)] public string? CanonicalUrlEn { get; set; }
    [StringLength(250)] public string? OpenGraphTitleFa { get; set; }
    [StringLength(250)] public string? OpenGraphTitleEn { get; set; }
    [StringLength(500)] public string? OpenGraphDescriptionFa { get; set; }
    [StringLength(500)] public string? OpenGraphDescriptionEn { get; set; }
    [StringLength(512)] public string? ImagePath { get; set; }
    [StringLength(250)] public string? ImageAltFa { get; set; }
    [StringLength(250)] public string? ImageAltEn { get; set; }

    public string DataFaJson { get; set; } = "{}";
    public string DataEnJson { get; set; } = "{}";
    public string SharedJson { get; set; } = "{}";
    public bool IsPublished { get; set; } = true;
    public bool IsFeatured { get; set; }
    public int SortOrder { get; set; }

    public static ContentFormModel From(ContentEntry entry) => new()
    {
        Id = entry.Id,
        ContentKey = entry.ContentKey,
        ContentType = entry.ContentType,
        Slug = entry.Slug,
        SlugFa = entry.SlugFa,
        SlugEn = entry.SlugEn,
        TitleFa = entry.TitleFa,
        TitleEn = entry.TitleEn,
        SummaryFa = entry.SummaryFa,
        SummaryEn = entry.SummaryEn,
        BodyFa = entry.BodyFa,
        BodyEn = entry.BodyEn,
        MetaTitleFa = entry.MetaTitleFa,
        MetaTitleEn = entry.MetaTitleEn,
        MetaDescriptionFa = entry.MetaDescriptionFa,
        MetaDescriptionEn = entry.MetaDescriptionEn,
        KeywordsFa = entry.KeywordsFa,
        KeywordsEn = entry.KeywordsEn,
        CanonicalUrlFa = entry.CanonicalUrlFa,
        CanonicalUrlEn = entry.CanonicalUrlEn,
        OpenGraphTitleFa = entry.OpenGraphTitleFa,
        OpenGraphTitleEn = entry.OpenGraphTitleEn,
        OpenGraphDescriptionFa = entry.OpenGraphDescriptionFa,
        OpenGraphDescriptionEn = entry.OpenGraphDescriptionEn,
        ImagePath = entry.ImagePath,
        ImageAltFa = entry.ImageAltFa,
        ImageAltEn = entry.ImageAltEn,
        DataFaJson = entry.DataFaJson,
        DataEnJson = entry.DataEnJson,
        SharedJson = entry.SharedJson,
        IsPublished = entry.IsPublished,
        IsFeatured = entry.IsFeatured,
        SortOrder = entry.SortOrder
    };

    public void ApplyTo(ContentEntry entry)
    {
        entry.ContentKey = ContentKey.Trim().ToLowerInvariant();
        entry.ContentType = ContentType.Trim().ToLowerInvariant();
        entry.Slug = BlankToNull(Slug);
        entry.SlugFa = BlankToNull(SlugFa);
        entry.SlugEn = BlankToNull(SlugEn);
        entry.TitleFa = BlankToNull(TitleFa);
        entry.TitleEn = BlankToNull(TitleEn);
        entry.SummaryFa = BlankToNull(SummaryFa);
        entry.SummaryEn = BlankToNull(SummaryEn);
        entry.BodyFa = BlankToNull(BodyFa);
        entry.BodyEn = BlankToNull(BodyEn);
        entry.MetaTitleFa = BlankToNull(MetaTitleFa);
        entry.MetaTitleEn = BlankToNull(MetaTitleEn);
        entry.MetaDescriptionFa = BlankToNull(MetaDescriptionFa);
        entry.MetaDescriptionEn = BlankToNull(MetaDescriptionEn);
        entry.KeywordsFa = BlankToNull(KeywordsFa);
        entry.KeywordsEn = BlankToNull(KeywordsEn);
        entry.CanonicalUrlFa = BlankToNull(CanonicalUrlFa);
        entry.CanonicalUrlEn = BlankToNull(CanonicalUrlEn);
        entry.OpenGraphTitleFa = BlankToNull(OpenGraphTitleFa);
        entry.OpenGraphTitleEn = BlankToNull(OpenGraphTitleEn);
        entry.OpenGraphDescriptionFa = BlankToNull(OpenGraphDescriptionFa);
        entry.OpenGraphDescriptionEn = BlankToNull(OpenGraphDescriptionEn);
        entry.ImagePath = BlankToNull(ImagePath);
        entry.ImageAltFa = BlankToNull(ImageAltFa);
        entry.ImageAltEn = BlankToNull(ImageAltEn);
        entry.DataFaJson = DataFaJson;
        entry.DataEnJson = DataEnJson;
        entry.SharedJson = SharedJson;
        entry.IsPublished = IsPublished;
        entry.IsFeatured = IsFeatured;
        entry.SortOrder = SortOrder;
    }

    private static string? BlankToNull(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}

public sealed record ContentListViewModel(IReadOnlyList<ContentEntry> Entries, string? TypeFilter);
