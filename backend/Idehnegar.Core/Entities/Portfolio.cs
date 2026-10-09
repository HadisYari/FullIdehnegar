using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Idehnegar.Core.Json;
using Idehnegar.Core.ValueObjects;

namespace Idehnegar.Core.Entities;

/// <summary>Mirrors <c>src/lib/categories.ts</c> — powers the portfolio filter and category labels.</summary>
public class PortfolioCategory : ContentEntity
{
    [MaxLength(120)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(200)]
    public string NameFa { get; set; } = string.Empty;

    [MaxLength(200)]
    public string NameEn { get; set; } = string.Empty;
}

/// <summary>
/// One row = one portfolio page. Every block of the project template
/// (gallery, features, stats, tags) lives in this row as JSON, which keeps the
/// database at a single table for the whole portfolio section.
/// </summary>
public class PortfolioProject : ContentEntity
{
    [MaxLength(180)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(300)]
    public string TitleFa { get; set; } = string.Empty;

    [MaxLength(300)]
    public string TitleEn { get; set; } = string.Empty;

    [MaxLength(600)]
    public string SummaryFa { get; set; } = string.Empty;

    [MaxLength(600)]
    public string SummaryEn { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string? DescriptionFa { get; set; }

    [MaxLength(4000)]
    public string? DescriptionEn { get; set; }

    /// <summary><see cref="PortfolioCategory.Slug"/></summary>
    [MaxLength(120)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Image { get; set; }

    [MaxLength(500)]
    public string? DesktopScreenshot { get; set; }

    [MaxLength(500)]
    public string? MobileScreenshot { get; set; }

    /// <summary>JSON array of image paths.</summary>
    public string? GalleryJson { get; set; }

    /// <summary>JSON array of "Budget Management" style tech labels.</summary>
    public string? TagsJson { get; set; }

    /// <summary>JSON array of <see cref="ProjectFeature"/>.</summary>
    public string? FeaturesJson { get; set; }

    /// <summary>JSON array of <see cref="ProjectStat"/>.</summary>
    public string? StatsJson { get; set; }

    [MaxLength(4000)]
    public string? ChallengeFa { get; set; }

    [MaxLength(4000)]
    public string? ChallengeEn { get; set; }

    [MaxLength(4000)]
    public string? SolutionFa { get; set; }

    [MaxLength(4000)]
    public string? SolutionEn { get; set; }

    [MaxLength(300)]
    public string? ClientFa { get; set; }

    [MaxLength(300)]
    public string? ClientEn { get; set; }

    /// <summary>Jalali year, exactly as stored in portfolio.json.</summary>
    public int Year { get; set; }

    [MaxLength(500)]
    public string? Link { get; set; }

    /// <summary>Shows the project in the home preview / featured rail.</summary>
    public bool Featured { get; set; }

    [NotMapped]
    public List<string> Gallery
    {
        get => JsonList.Read<string>(GalleryJson);
        set => GalleryJson = JsonList.Write(value);
    }

    [NotMapped]
    public List<string> Tags
    {
        get => JsonList.Read<string>(TagsJson);
        set => TagsJson = JsonList.Write(value);
    }

    [NotMapped]
    public List<ProjectFeature> Features
    {
        get => JsonList.Read<ProjectFeature>(FeaturesJson);
        set => FeaturesJson = JsonList.Write(value);
    }

    [NotMapped]
    public List<ProjectStat> Stats
    {
        get => JsonList.Read<ProjectStat>(StatsJson);
        set => StatsJson = JsonList.Write(value);
    }
}
