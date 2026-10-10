using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Idehnegar.Core.Entities;

/// <summary>
/// Editable copy of an about-page block (eyebrow, heading, subtitle). The key is
/// one of <c>values</c>, <c>certifications</c>, <c>lifecycle</c>, <c>philosophy</c>
/// or <c>tech-stack</c>; each block's items live in their own table below.
/// </summary>
public class AboutSection : ContentEntity
{
    [MaxLength(40)]
    public string Key { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? EyebrowFa { get; set; }

    [MaxLength(200)]
    public string? EyebrowEn { get; set; }

    [MaxLength(300)]
    public string TitleFa { get; set; } = string.Empty;

    [MaxLength(300)]
    public string TitleEn { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? SubtitleFa { get; set; }

    [MaxLength(1000)]
    public string? SubtitleEn { get; set; }
}

/// <summary>A company value card of the about page ("Our Values").</summary>
public class CoreValue : ContentEntity
{
    /// <summary>SVG path (the <c>d</c> attribute) of the card icon, 24×24 viewBox.</summary>
    [MaxLength(1000)]
    public string? IconPath { get; set; }

    [MaxLength(300)]
    public string TitleFa { get; set; } = string.Empty;

    [MaxLength(300)]
    public string TitleEn { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string DescriptionFa { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string DescriptionEn { get; set; } = string.Empty;
}

/// <summary>A certification / award tile of the about page.</summary>
public class Certification : ContentEntity
{
    /// <summary>Emoji shown on the tile.</summary>
    [MaxLength(20)]
    public string? Icon { get; set; }

    [MaxLength(300)]
    public string TitleFa { get; set; } = string.Empty;

    [MaxLength(300)]
    public string TitleEn { get; set; } = string.Empty;

    [MaxLength(400)]
    public string OrganizationFa { get; set; } = string.Empty;

    [MaxLength(400)]
    public string OrganizationEn { get; set; } = string.Empty;

    /// <summary>Tailwind gradient classes, e.g. <c>from-blue-500/10 to-cyan-500/10</c>.</summary>
    [MaxLength(200)]
    public string? ColorClass { get; set; }

    /// <summary>Tailwind hover border class, e.g. <c>hover:border-blue-400</c>.</summary>
    [MaxLength(120)]
    public string? BorderClass { get; set; }
}

/// <summary>One step of the development lifecycle (pipeline) of the about page.</summary>
public class LifecycleStep : ContentEntity
{
    /// <summary>Step number label, e.g. <c>01</c>.</summary>
    [MaxLength(10)]
    public string NumberLabel { get; set; } = string.Empty;

    [MaxLength(200)]
    public string NameFa { get; set; } = string.Empty;

    [MaxLength(200)]
    public string NameEn { get; set; } = string.Empty;

    [MaxLength(500)]
    public string DescriptionFa { get; set; } = string.Empty;

    [MaxLength(500)]
    public string DescriptionEn { get; set; } = string.Empty;
}

/// <summary>An engineering principle card ("Our Engineering Culture").</summary>
public class PhilosophyPrinciple : ContentEntity
{
    /// <summary>lucide-react icon name (Layers, ShieldCheck, GitMerge, Workflow …).</summary>
    [MaxLength(40)]
    public string? IconName { get; set; }

    [MaxLength(200)]
    public string TagFa { get; set; } = string.Empty;

    [MaxLength(200)]
    public string TagEn { get; set; } = string.Empty;

    [MaxLength(300)]
    public string TitleFa { get; set; } = string.Empty;

    [MaxLength(300)]
    public string TitleEn { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string DescriptionFa { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string DescriptionEn { get; set; } = string.Empty;

    /// <summary>Optional code line shown at the bottom of the card.</summary>
    [MaxLength(300)]
    public string? CodeSnippet { get; set; }
}

/// <summary>A labelled group of technologies ("Our Tech Stack").</summary>
public class TechStackGroup : ContentEntity
{
    [MaxLength(120)]
    public string LabelFa { get; set; } = string.Empty;

    [MaxLength(120)]
    public string LabelEn { get; set; } = string.Empty;

    /// <summary>JSON array of technology names (the same names in both languages).</summary>
    public string? ItemsJson { get; set; }

    [NotMapped]
    public List<string> Items
    {
        get => Idehnegar.Core.Json.JsonList.ReadStrings(ItemsJson);
        set => ItemsJson = Idehnegar.Core.Json.JsonList.Write(value);
    }
}

/// <summary>A headline counter of the about page (years, projects, clients …).</summary>
public class AboutStat : ContentEntity
{
    public int Value { get; set; }

    /// <summary>Text after the number, e.g. <c>+</c>.</summary>
    [MaxLength(10)]
    public string? Suffix { get; set; }

    [MaxLength(120)]
    public string LabelFa { get; set; } = string.Empty;

    [MaxLength(120)]
    public string LabelEn { get; set; } = string.Empty;

    /// <summary>Emoji shown above the number.</summary>
    [MaxLength(20)]
    public string? Icon { get; set; }
}
