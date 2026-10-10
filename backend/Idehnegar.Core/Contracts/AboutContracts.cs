namespace Idehnegar.Core.Contracts;

/// <summary>Everything the about page renders from the API, in one response.</summary>
public sealed class AboutContentDto
{
    public IReadOnlyList<AboutSectionDto> Sections { get; set; } = Array.Empty<AboutSectionDto>();
    public IReadOnlyList<CoreValueDto> CoreValues { get; set; } = Array.Empty<CoreValueDto>();
    public IReadOnlyList<CertificationDto> Certifications { get; set; } = Array.Empty<CertificationDto>();
    public IReadOnlyList<LifecycleStepDto> LifecycleSteps { get; set; } = Array.Empty<LifecycleStepDto>();
    public IReadOnlyList<PhilosophyPrincipleDto> PhilosophyPrinciples { get; set; } = Array.Empty<PhilosophyPrincipleDto>();
    public IReadOnlyList<TechStackGroupDto> TechStackGroups { get; set; } = Array.Empty<TechStackGroupDto>();
    public IReadOnlyList<AboutStatDto> Stats { get; set; } = Array.Empty<AboutStatDto>();
}

/// <summary>Section copy of one about block; <c>Key</c> identifies the block.</summary>
public sealed class AboutSectionDto
{
    public string Key { get; set; } = string.Empty;
    public LocalizedText? Eyebrow { get; set; }
    public LocalizedText Title { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText? Subtitle { get; set; }
}

public sealed class CoreValueDto
{
    public Guid Id { get; set; }
    public string? IconPath { get; set; }
    public LocalizedText Title { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Desc { get; set; } = new(string.Empty, string.Empty);
}

public sealed class CertificationDto
{
    public Guid Id { get; set; }
    public string? Icon { get; set; }
    public LocalizedText Title { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Organization { get; set; } = new(string.Empty, string.Empty);
    public string? ColorClass { get; set; }
    public string? BorderClass { get; set; }
}

public sealed class LifecycleStepDto
{
    public Guid Id { get; set; }
    public string Number { get; set; } = string.Empty;
    public LocalizedText Name { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Desc { get; set; } = new(string.Empty, string.Empty);
}

public sealed class PhilosophyPrincipleDto
{
    public Guid Id { get; set; }
    public string? Icon { get; set; }
    public LocalizedText Tag { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Title { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Desc { get; set; } = new(string.Empty, string.Empty);
    public string? CodeSnippet { get; set; }
}

public sealed class TechStackGroupDto
{
    public Guid Id { get; set; }
    public LocalizedText Label { get; set; } = new(string.Empty, string.Empty);
    public IReadOnlyList<string> Items { get; set; } = Array.Empty<string>();
}

public sealed class AboutStatDto
{
    public Guid Id { get; set; }
    public int Value { get; set; }
    public string? Suffix { get; set; }
    public LocalizedText Label { get; set; } = new(string.Empty, string.Empty);
    public string? Icon { get; set; }
}
