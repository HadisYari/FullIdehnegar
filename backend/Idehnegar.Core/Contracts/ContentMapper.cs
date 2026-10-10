using Idehnegar.Core.Entities;
using Idehnegar.Core.Json;
using Idehnegar.Core.ValueObjects;

namespace Idehnegar.Core.Contracts;

/// <summary>
/// Entity → public contract mapping. Centralised here so the API controllers stay
/// thin and the JSON columns are expanded in exactly one place.
/// </summary>
public static class ContentMapper
{
    private static LocalizedText Text(string? fa, string? en) => new(fa ?? string.Empty, en ?? fa ?? string.Empty);

    private static string? FirstNonEmpty(string? first, string? second) =>
        string.IsNullOrWhiteSpace(first) ? second : first;

    public static SiteSettingsDto ToSettingsDto(this SiteSetting setting)
    {
        var phones = setting.Phones;
        var social = setting.Social
            .Where(item => !string.IsNullOrWhiteSpace(item.Key))
            .ToDictionary(item => item.Key, item => item.Value, StringComparer.OrdinalIgnoreCase);
        var stats = setting.Stats
            .Where(item => !string.IsNullOrWhiteSpace(item.Key))
            .ToDictionary(
                item => item.Key,
                item => int.TryParse(item.Value, out var value) ? value : 0,
                StringComparer.OrdinalIgnoreCase);

        return new SiteSettingsDto
        {
            Domain = setting.Domain,
            SiteUrl = setting.SiteUrl.TrimEnd('/'),
            Name = Text(setting.NameFa, setting.NameEn),
            ShortName = Text(setting.ShortNameFa, setting.ShortNameEn),
            Tagline = Text(setting.TaglineFa, setting.TaglineEn),
            FoundedJalali = setting.FoundedJalali,
            FoundedGregorian = setting.FoundedGregorian,
            Email = setting.Email,
            Phones = phones,
            Telegram = setting.TelegramId,
            WhatsApp = setting.WhatsAppNumber,
            Address = Text(setting.AddressFa, setting.AddressEn),
            Hours = Text(setting.HoursFa, setting.HoursEn),
            MapEmbedSrc = setting.MapEmbedSrc,
            Social = new SocialLinksDto(
                GetValue(social, "telegram"),
                GetValue(social, "linkedin"),
                GetValue(social, "instagram")),
            Stats = new SiteStatsDto(
                stats.GetValueOrDefault("clients"),
                stats.GetValueOrDefault("projects"),
                stats.GetValueOrDefault("yearsActive"),
                stats.GetValueOrDefault("awards")),
            DefaultOgImage = setting.DefaultOgImage,
            UpdatedAtUtc = setting.UpdatedAtUtc,
        };
    }

    public static PageMetaDto ToDto(this PageMeta page) => new()
    {
        PageKey = page.PageKey,
        Path = page.Path,
        Title = Text(page.TitleFa, page.TitleEn),
        Description = Text(page.DescriptionFa, page.DescriptionEn),
        Keywords = Text(page.KeywordsFa, page.KeywordsEn),
        Eyebrow = Text(page.EyebrowFa, page.EyebrowEn),
        Heading = Text(page.HeadingFa, page.HeadingEn),
        Subheading = Text(page.SubheadingFa, page.SubheadingEn),
        CtaPrimary = Text(page.CtaPrimaryFa, page.CtaPrimaryEn),
        CtaSecondary = Text(page.CtaSecondaryFa, page.CtaSecondaryEn),
        OgImage = page.OgImage,
        NoIndex = page.NoIndex,
        ChangeFrequency = page.ChangeFrequency,
        Priority = page.Priority,
        UpdatedAtUtc = page.UpdatedAtUtc ?? page.CreatedAtUtc,
    };

    public static PortfolioCategoryDto ToDto(this PortfolioCategory category) => new()
    {
        Slug = category.Slug,
        Fa = category.NameFa,
        En = category.NameEn,
    };

    public static PortfolioProjectDto ToDto(this PortfolioProject project)
    {
        var titleFa = project.TitleFa;
        var titleEn = FirstNonEmpty(project.TitleEn, titleFa) ?? string.Empty;

        return new PortfolioProjectDto
        {
            Slug = project.Slug,
            Title = new LocalizedText(titleFa, titleEn),
            Summary = Text(project.SummaryFa, project.SummaryEn),
            Description = Text(project.DescriptionFa, project.DescriptionEn),
            Category = project.Category,
            Image = project.Image ?? string.Empty,
            // Alt text is derived instead of stored: it always describes the project.
            ImageAlt = new LocalizedText(
                $"{titleFa}{(string.IsNullOrWhiteSpace(project.ClientFa) ? string.Empty : $" — {project.ClientFa}")}",
                $"{titleEn}{(string.IsNullOrWhiteSpace(project.ClientEn) ? string.Empty : $" — {project.ClientEn}")}"),
            Featured = project.Featured,
            DesktopScreenshot = project.DesktopScreenshot,
            MobileScreenshot = project.MobileScreenshot,
            Gallery = project.Gallery,
            Tags = project.Tags,
            Features = project.Features.Select(ToDto).ToList(),
            Stats = project.Stats.Select(ToDto).ToList(),
            Challenge = HasBoth(project.ChallengeFa, project.ChallengeEn)
                ? Text(project.ChallengeFa, project.ChallengeEn)
                : null,
            Solution = HasBoth(project.SolutionFa, project.SolutionEn)
                ? Text(project.SolutionFa, project.SolutionEn)
                : null,
            Client = Text(project.ClientFa, project.ClientEn),
            Year = project.Year,
            Link = string.IsNullOrWhiteSpace(project.Link) ? null : project.Link,
            UpdatedAtUtc = project.UpdatedAtUtc ?? project.CreatedAtUtc,
        };
    }

    private static string? GetValue(IReadOnlyDictionary<string, string> map, string key) =>
        map.TryGetValue(key, out var value) && !string.IsNullOrWhiteSpace(value) ? value : null;

    private static bool HasBoth(string? fa, string? en) =>
        !string.IsNullOrWhiteSpace(fa) || !string.IsNullOrWhiteSpace(en);

    private static ProjectFeatureDto ToDto(ProjectFeature feature) => new()
    {
        Title = Text(feature.TitleFa, feature.TitleEn),
        Description = Text(feature.DescriptionFa, feature.DescriptionEn),
    };

    private static ProjectStatDto ToDto(ProjectStat stat) => new()
    {
        Label = Text(stat.LabelFa, stat.LabelEn),
        Value = Text(stat.ValueFa, stat.ValueEn),
        IconPath = stat.IconPath,
        Color = stat.Color,
    };

    private static LabeledImageDto ToDto(LabeledImage image) => new()
    {
        Label = image.Label,
        Src = image.Src,
    };

    public static ServiceDto ToDto(this Service service) => new()
    {
        Id = service.Id,
        Icon = service.Icon,
        Title = Text(service.TitleFa, service.TitleEn),
        Desc = Text(service.DescriptionFa, service.DescriptionEn),
        Highlights = new LocalizedList(service.HighlightsFa, service.HighlightsEn),
        VisualIndex = service.VisualIndex,
    };

    public static HomeServiceCardDto ToDto(this HomeServiceCard card) => new()
    {
        Id = card.Id,
        Code = card.Code,
        Icon = card.IconName,
        Title = Text(card.TitleFa, card.TitleEn),
        Desc = Text(card.DescriptionFa, card.DescriptionEn),
        Color = card.Color,
        SoftColor = card.SoftColor,
        GlowColor = card.GlowColor,
        FeatureTitle = card.FeatureTitleFa is null && card.FeatureTitleEn is null
            ? null
            : Text(card.FeatureTitleFa, card.FeatureTitleEn),
        FeatureValue = card.FeatureValueFa is null && card.FeatureValueEn is null
            ? null
            : Text(card.FeatureValueFa, card.FeatureValueEn),
        Progress = card.Progress,
        Tags = card.Tags,
    };

    public static ProcessStepDto ToDto(this ProcessStep step) => new()
    {
        Id = step.Id,
        Icon = step.Icon,
        Color = step.Color,
        Accent = step.Accent,
        Title = Text(step.TitleFa, step.TitleEn),
        Duration = Text(step.DurationFa, step.DurationEn),
        Desc = Text(step.DescriptionFa, step.DescriptionEn),
        Deliverables = new LocalizedList(step.DeliverablesFa, step.DeliverablesEn),
    };

    public static ClientLogoDto ToDto(this Client client) => new()
    {
        Id = client.Id,
        Name = Text(client.NameFa, client.NameEn),
        Monogram = client.Monogram,
        LogoUrl = client.LogoUrl,
    };

    public static TestimonialDto ToDto(this Testimonial testimonial) => new()
    {
        Id = testimonial.Id,
        Name = Text(testimonial.NameFa, testimonial.NameEn),
        Quote = Text(testimonial.QuoteFa, testimonial.QuoteEn),
    };

    public static MilestoneDto ToDto(this Milestone milestone) => new()
    {
        Year = milestone.Year,
        Title = Text(milestone.TitleFa, milestone.TitleEn),
        Desc = Text(milestone.DescriptionFa, milestone.DescriptionEn),
        Glow = milestone.Glow,
        Gradient = milestone.Gradient,
    };

    public static TeamRoleDto ToDto(this TeamDiscipline member) => new()
    {
        Role = member.RoleEn,
        Label = member.LabelFa,
        Span = member.Span,
        Bg = member.Background,
    };

    public static FaqDto ToDto(this FaqItem faq) => new()
    {
        Id = faq.Id,
        Question = Text(faq.QuestionFa, faq.QuestionEn),
        Answer = Text(faq.AnswerFa, faq.AnswerEn),
    };

    public static InquiryTypeDto ToDto(this InquiryType type) => new()
    {
        Id = type.Code,
        Label = Text(type.LabelFa, type.LabelEn),
        Icon = type.Icon,
    };

    public static StoreTemplateDto ToDto(this StoreTemplate template) => new()
    {
        Id = template.Code,
        Name = template.Name,
        Category = template.Category,
        Tag = template.Tag,
        PlanName = template.PlanName,
        PriceMonthly = template.PriceMonthly,
        PriceYearly = template.PriceYearly,
        DiscountBadge = template.DiscountBadge,
        Desc = template.Description,
        Features = template.Features,
        DesktopScreens = template.DesktopScreens.Select(ToDto).ToList(),
        MobileScreens = template.MobileScreens.Select(ToDto).ToList(),
    };

    public static StorePlanDto ToDto(this StorePlan plan) => new()
    {
        Id = plan.Code,
        Name = plan.Name,
        Badge = plan.Badge,
        Tagline = plan.Tagline,
        IsPopular = plan.IsPopular,
        MonthlyPrice = plan.MonthlyPrice,
        YearlyPrice = plan.YearlyPrice,
        SetupTime = plan.SetupTime,
        Features = plan.Features,
        Limitations = plan.Limitations,
    };

    public static AppDownloadLinkDto ToDto(this AppDownloadLink link) => new()
    {
        Title = Text(link.TitleFa, link.TitleEn),
        Caption = Text(link.CaptionFa, link.CaptionEn),
        Href = link.Href,
        Emoji = link.Emoji,
        Variant = link.Variant,
    };

    public static SitemapEntryDto ToSitemapEntry(this PageMeta page) => new()
    {
        Path = page.Path,
        LastModified = page.UpdatedAtUtc ?? page.CreatedAtUtc,
        ChangeFrequency = page.ChangeFrequency,
        Priority = page.Priority,
    };

    public static SitemapEntryDto ToSitemapEntry(this PortfolioProject project) => new()
    {
        Path = $"/portfolio/{project.Slug}",
        LastModified = project.UpdatedAtUtc ?? project.CreatedAtUtc,
        ChangeFrequency = "yearly",
        Priority = 0.6m,
    };
}
