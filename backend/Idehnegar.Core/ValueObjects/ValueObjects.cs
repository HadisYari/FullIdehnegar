namespace Idehnegar.Core.ValueObjects;

/// <summary>
/// Value objects persisted as JSON inside the owning row (one project row = one
/// portfolio page), so the schema stays as small as the front-end data model.
/// </summary>
public sealed class ProjectFeature
{
    public string TitleFa { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string DescriptionFa { get; set; } = string.Empty;
    public string DescriptionEn { get; set; } = string.Empty;
}

public sealed class ProjectStat
{
    public string LabelFa { get; set; } = string.Empty;
    public string LabelEn { get; set; } = string.Empty;
    public string ValueFa { get; set; } = string.Empty;
    public string ValueEn { get; set; } = string.Empty;
    public string? IconPath { get; set; }
    public string? Color { get; set; }
}

/// <summary>A labelled screenshot, used by the store templates (desktop/mobile).</summary>
public sealed class LabeledImage
{
    public string Label { get; set; } = string.Empty;

    public string LabelEn { get; set; } = string.Empty;
    public string Src { get; set; } = string.Empty;
}

/// <summary>
/// Key/value row used for the small maps of the settings row (social links and
/// headline counters) so they stay in one table instead of two extra ones.
/// </summary>
public sealed class NamedValue
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}
