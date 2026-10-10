namespace Idehnegar.Core.Contracts;

/// <summary>One block of a page (copy + optional repeated items). Mirrors <c>PageSection</c>.</summary>
public sealed class PageSectionDto
{
    public string Key { get; set; } = string.Empty;

    public LocalizedText? Eyebrow { get; set; }

    public LocalizedText? Title { get; set; }

    public LocalizedText? Subtitle { get; set; }

    public LocalizedText? Body { get; set; }

    public IReadOnlyList<PageSectionItemDto> Items { get; set; } = Array.Empty<PageSectionItemDto>();
}

/// <summary>One repeated item of a page block (bullet, card or link card).</summary>
public sealed class PageSectionItemDto
{
    public string? Icon { get; set; }

    public LocalizedText Title { get; set; } = new(string.Empty, string.Empty);

    public LocalizedText? Description { get; set; }

    public string? Href { get; set; }
}
