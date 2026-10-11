using System.Text.Json.Serialization;

namespace Idehnegar.Core.Contracts;

/// <summary>
/// Bilingual scalar rendered by the front end as <c>{ fa, en }</c>.
/// </summary>
public sealed record LocalizedText(string Fa, string En);

/// <summary>Bilingual list of short strings, e.g. service highlights per locale.</summary>
public sealed record LocalizedList(IReadOnlyList<string> Fa, IReadOnlyList<string> En);

public sealed record SiteStatsDto(int Clients, int Projects, int YearsActive, int Awards);

public sealed record SocialLinksDto(string? Telegram, string? LinkedIn, string? Instagram);

/// <summary>Payload of <c>GET /api/public/settings</c>.</summary>
public sealed class SiteSettingsDto
{
    public string Domain { get; set; } = "idehnegar.co";
    public string SiteUrl { get; set; } = "https://idehnegar.co";
    public LocalizedText Name { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText ShortName { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Tagline { get; set; } = new(string.Empty, string.Empty);
    public int FoundedJalali { get; set; }
    public int FoundedGregorian { get; set; }
    public string Email { get; set; } = string.Empty;
    public IReadOnlyList<string> Phones { get; set; } = Array.Empty<string>();
    public string? Telegram { get; set; }

    /// <summary>
    /// Explicit wire name: System.Text.Json would camel-case <c>WhatsApp</c> to
    /// <c>whatsApp</c>, while the front end (<c>src/lib/cms.ts</c>) reads <c>whatsapp</c>.
    /// </summary>
    [JsonPropertyName("whatsapp")]
    public string? WhatsApp { get; set; }
    public LocalizedText Address { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Hours { get; set; } = new(string.Empty, string.Empty);
    public string? MapEmbedSrc { get; set; }
    public SocialLinksDto Social { get; set; } = new(null, null, null);
    public SiteStatsDto Stats { get; set; } = new(0, 0, 0, 0);
    public string? DefaultOgImage { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
}

/// <summary>Payload of <c>GET /api/public/pages/{key}</c> — everything generateMetadata() needs.</summary>
public sealed class PageMetaDto
{
    public string PageKey { get; set; } = string.Empty;
    public string Path { get; set; } = "/";
    public LocalizedText Title { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Description { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Keywords { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Eyebrow { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Heading { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Subheading { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText CtaPrimary { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText CtaSecondary { get; set; } = new(string.Empty, string.Empty);
    public string? OgImage { get; set; }
    public bool NoIndex { get; set; }
    public string ChangeFrequency { get; set; } = "monthly";
    public decimal Priority { get; set; } = 0.8m;
    public DateTime? UpdatedAtUtc { get; set; }
}

/// <summary>Mirrors the shape of <c>src/lib/categories.ts</c>.</summary>
public sealed class PortfolioCategoryDto
{
    public string Slug { get; set; } = string.Empty;
    public string Fa { get; set; } = string.Empty;
    public string En { get; set; } = string.Empty;
}

/// <summary>Mirrors a feature entry of <c>PortfolioItem.features</c>.</summary>
public sealed class ProjectFeatureDto
{
    public LocalizedText Title { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Description { get; set; } = new(string.Empty, string.Empty);
}

/// <summary>Mirrors a <c>PortfolioItem.stats</c> entry.</summary>
public sealed class ProjectStatDto
{
    public LocalizedText Label { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Value { get; set; } = new(string.Empty, string.Empty);
    public string? IconPath { get; set; }
    public string? Color { get; set; }
}

public sealed class LabeledImageDto
{
    public LocalizedText Label { get; set; } = new(string.Empty, string.Empty);
    public string Src { get; set; } = string.Empty;
}

/// <summary>
/// Mirrors the <c>PortfolioItem</c> interface of <c>src/lib/portfolio.ts</c> one
/// to one, so the front end can consume it without a translation layer.
/// </summary>
public sealed class PortfolioProjectDto
{
    public string Slug { get; set; } = string.Empty;
    public LocalizedText Title { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Summary { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Description { get; set; } = new(string.Empty, string.Empty);
    public string Category { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public LocalizedText ImageAlt { get; set; } = new(string.Empty, string.Empty);
    public bool Featured { get; set; }
    public string? DesktopScreenshot { get; set; }
    public string? MobileScreenshot { get; set; }
    public IReadOnlyList<string> Gallery { get; set; } = Array.Empty<string>();
    public IReadOnlyList<ProjectFeatureDto> Features { get; set; } = Array.Empty<ProjectFeatureDto>();
    public IReadOnlyList<ProjectStatDto> Stats { get; set; } = Array.Empty<ProjectStatDto>();
    public LocalizedText? Challenge { get; set; }
    public LocalizedText? Solution { get; set; }
    public LocalizedText Client { get; set; } = new(string.Empty, string.Empty);
    public int Year { get; set; }
    public IReadOnlyList<string> Tags { get; set; } = Array.Empty<string>();
    public string? Link { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }
}

public sealed class ServiceDto
{
    public Guid Id { get; set; }
    public string? Icon { get; set; }
    public LocalizedText Title { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Desc { get; set; } = new(string.Empty, string.Empty);
    public LocalizedList Highlights { get; set; } = new(Array.Empty<string>(), Array.Empty<string>());
    public int VisualIndex { get; set; }
}

/// <summary>One card of the home services grid (<c>services-section.tsx</c>).</summary>
public sealed class HomeServiceCardDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public LocalizedText Title { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Desc { get; set; } = new(string.Empty, string.Empty);
    public string? Color { get; set; }
    public string? SoftColor { get; set; }
    public string? GlowColor { get; set; }
    public LocalizedText? FeatureTitle { get; set; }
    public LocalizedText? FeatureValue { get; set; }
    public string? Progress { get; set; }
    public IReadOnlyList<string> Tags { get; set; } = Array.Empty<string>();
}

public sealed class ProcessStepDto
{
    public Guid Id { get; set; }
    public string? Icon { get; set; }
    public string? Color { get; set; }
    public string? Accent { get; set; }
    public LocalizedText Title { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Duration { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Desc { get; set; } = new(string.Empty, string.Empty);
    public LocalizedList Deliverables { get; set; } = new(Array.Empty<string>(), Array.Empty<string>());
}

public sealed class ClientLogoDto
{
    public Guid Id { get; set; }
    public LocalizedText Name { get; set; } = new(string.Empty, string.Empty);
    public string? Monogram { get; set; }
    public string? LogoUrl { get; set; }
}

public sealed class TestimonialDto
{
    public Guid Id { get; set; }
    public LocalizedText Name { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Quote { get; set; } = new(string.Empty, string.Empty);
}

public sealed class MilestoneDto
{
    public string Year { get; set; } = string.Empty;
    public LocalizedText Title { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Desc { get; set; } = new(string.Empty, string.Empty);
    public string? Glow { get; set; }
    public string? Gradient { get; set; }
}

/// <summary>Role tile of the about page (role = English, label = Persian).</summary>
public sealed class TeamRoleDto
{
    public string Role { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string? Span { get; set; }
    public string? Bg { get; set; }
}

public sealed class FaqDto
{
    public Guid Id { get; set; }
    public LocalizedText Question { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Answer { get; set; } = new(string.Empty, string.Empty);
}

public sealed class InquiryTypeDto
{
    public string Id { get; set; } = string.Empty;
    public LocalizedText Label { get; set; } = new(string.Empty, string.Empty);
    public string? Icon { get; set; }
}

public sealed class AppDownloadLinkDto
{
    public LocalizedText Title { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Caption { get; set; } = new(string.Empty, string.Empty);
    public string Href { get; set; } = "#";
    public string? Emoji { get; set; }
    public string? Variant { get; set; }
}

/// <summary>Sitemap row consumed by <c>src/app/sitemap.ts</c>.</summary>
public sealed class SitemapEntryDto
{
    public string Path { get; set; } = "/";
    public DateTime? LastModified { get; set; }
    public string ChangeFrequency { get; set; } = "monthly";
    public decimal Priority { get; set; } = 0.5m;

    /// <summary>Mirrors <c>PageMeta.NoIndex</c> so the front end can filter again defensively.</summary>
    public bool NoIndex { get; set; }
}

/// <summary>
/// Single round-trip payload used by the layout: everything the shared and home
/// sections need, so the front end does not fan out dozens of fetches.
/// </summary>
public sealed class SiteBootstrapDto
{
    public SiteSettingsDto Settings { get; set; } = new();
    public IReadOnlyDictionary<string, PageMetaDto> Pages { get; set; } = new Dictionary<string, PageMetaDto>();
    public IReadOnlyList<PortfolioCategoryDto> Categories { get; set; } = Array.Empty<PortfolioCategoryDto>();
    public IReadOnlyList<PortfolioProjectDto> FeaturedProjects { get; set; } = Array.Empty<PortfolioProjectDto>();
    public IReadOnlyList<ServiceDto> Services { get; set; } = Array.Empty<ServiceDto>();
    public IReadOnlyList<HomeServiceCardDto> HomeServiceCards { get; set; } = Array.Empty<HomeServiceCardDto>();
    public IReadOnlyList<ProcessStepDto> ProcessSteps { get; set; } = Array.Empty<ProcessStepDto>();
    public IReadOnlyList<ClientLogoDto> Clients { get; set; } = Array.Empty<ClientLogoDto>();
    public IReadOnlyList<TestimonialDto> Testimonials { get; set; } = Array.Empty<TestimonialDto>();
    public IReadOnlyList<MilestoneDto> Milestones { get; set; } = Array.Empty<MilestoneDto>();
    public IReadOnlyList<TeamRoleDto> Team { get; set; } = Array.Empty<TeamRoleDto>();
    public IReadOnlyList<FaqDto> Faqs { get; set; } = Array.Empty<FaqDto>();
    public IReadOnlyList<InquiryTypeDto> InquiryTypes { get; set; } = Array.Empty<InquiryTypeDto>();
    public IReadOnlyList<StoreTemplateDto> StoreTemplates { get; set; } = Array.Empty<StoreTemplateDto>();
    public IReadOnlyList<AppDownloadLinkDto> AppDownloadLinks { get; set; } = Array.Empty<AppDownloadLinkDto>();
    public DateTime GeneratedAtUtc { get; set; } = DateTime.UtcNow;
}

public sealed class StoreTemplateDto
{
    public string Id { get; set; } = string.Empty;
    public LocalizedText Name { get; set; } = new(string.Empty, string.Empty);
    public string Category { get; set; } = "warehouse";
    public LocalizedText Tag { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText PlanName { get; set; } = new(string.Empty, string.Empty);
    public decimal PriceMonthly { get; set; }
    public decimal PriceYearly { get; set; }
    public LocalizedText DiscountBadge { get; set; } = new(string.Empty, string.Empty);
    public LocalizedText Desc { get; set; } = new(string.Empty, string.Empty);
    public LocalizedList Features { get; set; } = new(Array.Empty<string>(), Array.Empty<string>());
    public IReadOnlyList<LabeledImageDto> DesktopScreens { get; set; } = Array.Empty<LabeledImageDto>();
    public IReadOnlyList<LabeledImageDto> MobileScreens { get; set; } = Array.Empty<LabeledImageDto>();
}
