using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Idehnegar.Core.Entities;

/// <summary>Chapter of the "our journey through time" timeline on the about page.</summary>
public class Milestone : ContentEntity
{
    /// <summary>Jalali year label, e.g. ۱۴۰۳.</summary>
    [MaxLength(20)]
    public string Year { get; set; } = string.Empty;

    [MaxLength(300)]
    public string TitleFa { get; set; } = string.Empty;

    [MaxLength(300)]
    public string TitleEn { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string DescriptionFa { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string DescriptionEn { get; set; } = string.Empty;

    /// <summary>Border/shadow utility classes of the card glow.</summary>
    [MaxLength(200)]
    public string? Glow { get; set; }

    /// <summary>Gradient utility classes of the card header.</summary>
    [MaxLength(200)]
    public string? Gradient { get; set; }
}

/// <summary>A role in the "team constellation" bento grid of the about page.</summary>
public class TeamDiscipline : ContentEntity
{
    /// <summary>English role, rendered as the <c>role</c> field in the front end.</summary>
    [MaxLength(200)]
    public string RoleEn { get; set; } = string.Empty;

    /// <summary>Persian role, rendered as the <c>label</c> field in the front end.</summary>
    [MaxLength(200)]
    public string LabelFa { get; set; } = string.Empty;

    /// <summary>Bento span, e.g. <c>sm:col-span-2</c>.</summary>
    [MaxLength(60)]
    public string? Span { get; set; }

    /// <summary>Background/border/text utility classes.</summary>
    [MaxLength(300)]
    public string? Background { get; set; }
}

/// <summary>Frequently asked question shown under the contact form.</summary>
public class FaqItem : ContentEntity
{
    [MaxLength(500)]
    public string QuestionFa { get; set; } = string.Empty;

    [MaxLength(500)]
    public string QuestionEn { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string AnswerFa { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string AnswerEn { get; set; } = string.Empty;
}

/// <summary>The project-type chips of the contact form (web, portal, ecommerce…).</summary>
public class InquiryType : ContentEntity
{
    [MaxLength(80)]
    public string Code { get; set; } = string.Empty;

    [MaxLength(300)]
    public string LabelFa { get; set; } = string.Empty;

    [MaxLength(300)]
    public string LabelEn { get; set; } = string.Empty;

    /// <summary>lucide-react icon name.</summary>
    [MaxLength(60)]
    public string? Icon { get; set; }
}

/// <summary>Storefront template card of the /store-builder page.</summary>
public class StoreTemplate : ContentEntity
{
    /// <summary>Stable id used in the payment URL (wh-1, light-1 …).</summary>
    [MaxLength(60)]
    public string Code { get; set; } = string.Empty;

    [MaxLength(300)]
    public string Name { get; set; } = string.Empty;

    /// <summary>warehouse | light — the switcher on top of the page.</summary>
    [MaxLength(30)]
    public string Category { get; set; } = "warehouse";

    [MaxLength(300)]
    public string? Tag { get; set; }

    [MaxLength(300)]
    public string PlanName { get; set; } = string.Empty;

    /// <summary>Monthly price in Toman.</summary>
    public decimal PriceMonthly { get; set; }

    /// <summary>Yearly price in Toman (already discounted).</summary>
    public decimal PriceYearly { get; set; }

    [MaxLength(120)]
    public string? DiscountBadge { get; set; }

    [MaxLength(2000)]
    public string? Description { get; set; }

    public string? FeaturesJson { get; set; }

    public string? DesktopScreensJson { get; set; }

    public string? MobileScreensJson { get; set; }

    [NotMapped]
    public List<string> Features
    {
        get => Idehnegar.Core.Json.JsonList.ReadStrings(FeaturesJson);
        set => FeaturesJson = Idehnegar.Core.Json.JsonList.Write(value);
    }

    [NotMapped]
    public List<Idehnegar.Core.ValueObjects.LabeledImage> DesktopScreens
    {
        get => Idehnegar.Core.Json.JsonList.Read<Idehnegar.Core.ValueObjects.LabeledImage>(DesktopScreensJson);
        set => DesktopScreensJson = Idehnegar.Core.Json.JsonList.Write(value);
    }

    [NotMapped]
    public List<Idehnegar.Core.ValueObjects.LabeledImage> MobileScreens
    {
        get => Idehnegar.Core.Json.JsonList.Read<Idehnegar.Core.ValueObjects.LabeledImage>(MobileScreensJson);
        set => MobileScreensJson = Idehnegar.Core.Json.JsonList.Write(value);
    }
}

/// <summary>A subscription tier offered on the /payment page.</summary>
public class StorePlan : ContentEntity
{
    [MaxLength(60)]
    public string Code { get; set; } = string.Empty;

    [MaxLength(300)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Badge { get; set; }

    [MaxLength(500)]
    public string? Tagline { get; set; }

    public bool IsPopular { get; set; }

    public decimal MonthlyPrice { get; set; }

    public decimal YearlyPrice { get; set; }

    [MaxLength(200)]
    public string? SetupTime { get; set; }

    public string? FeaturesJson { get; set; }

    public string? LimitationsJson { get; set; }

    [NotMapped]
    public List<string> Features
    {
        get => Idehnegar.Core.Json.JsonList.ReadStrings(FeaturesJson);
        set => FeaturesJson = Idehnegar.Core.Json.JsonList.Write(value);
    }

    [NotMapped]
    public List<string> Limitations
    {
        get => Idehnegar.Core.Json.JsonList.ReadStrings(LimitationsJson);
        set => LimitationsJson = Idehnegar.Core.Json.JsonList.Write(value);
    }
}
