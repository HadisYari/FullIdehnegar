using EndPoints.Areas.Admin.Models;
using Idehnegar.Core.Entities;
using Idehnegar.Core.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace EndPoints.Areas.Admin.Services;

/// <summary>
/// Describes every content table once: which columns are shown in the list,
/// which fields are editable and how each field behaves. The generic
/// <c>ContentController</c> + <c>Content/Form.cshtml</c> then render the whole
/// CRUD UI for all entities, so adding a field never means writing a controller.
/// </summary>
public sealed class AdminRegistry
{
    private readonly List<AdminEntityDefinition> _definitions;
    private readonly Dictionary<string, AdminEntityDefinition> _byRoute = new(StringComparer.OrdinalIgnoreCase);

    public AdminRegistry()
    {
        _definitions = BuildDefinitions();
        foreach (var definition in _definitions)
        {
            _byRoute[definition.RouteName] = definition;
        }
    }

    public IReadOnlyList<AdminEntityDefinition> All => _definitions;

    public IEnumerable<IGrouping<string, AdminEntityDefinition>> Groups =>
        _definitions.GroupBy(definition => definition.Group).OrderBy(group => group.Key);

    public AdminEntityDefinition? Find(string? routeName) =>
        routeName is null ? null : _byRoute.GetValueOrDefault(routeName);

    // ───────────────────────────────── field helpers ─────────────────────────────────
    private static AdminFieldSpec Field(
        string property,
        string label,
        AdminFieldKind kind = AdminFieldKind.Text,
        bool required = false,
        int maxLength = 500,
        string? help = null,
        string column = "col-12 col-lg-6",
        string? optionsKey = null,
        AdminRepeaterColumn[]? columns = null) => new()
        {
            Property = property,
            Label = label,
            Kind = kind,
            Required = required,
            MaxLength = maxLength,
            Help = help,
            Column = column,
            OptionsKey = optionsKey,
            Columns = columns,
        };

    private static AdminFieldSpec Text(string property, string label, bool required = false, int maxLength = 300, string? help = null) =>
        Field(property, label, AdminFieldKind.Text, required, maxLength, help);

    private static AdminFieldSpec Long(string property, string label, int maxLength = 2000, string? help = null, bool required = false) =>
        Field(property, label, AdminFieldKind.Textarea, required, maxLength, help, "col-12");

    private static AdminFieldSpec Number(string property, string label, bool required = false, string? help = null) =>
        Field(property, label, AdminFieldKind.Number, required, 20, help, "col-12 col-lg-3");

    private static AdminFieldSpec Money(string property, string label, string? help = null) =>
        Field(property, label, AdminFieldKind.Decimal, false, 20, help, "col-12 col-lg-4");

    private static AdminFieldSpec Check(string property, string label, string? help = null) =>
        Field(property, label, AdminFieldKind.Checkbox, false, 0, help, "col-12 col-lg-3");

    private static AdminFieldSpec Image(string property, string label, string? help = null) =>
        Field(property, label, AdminFieldKind.Image, false, 500, help, "col-12 col-lg-6");

    private static AdminFieldSpec Code(string property, string label, bool required = true, string? help = null) =>
        Field(property, label, AdminFieldKind.Code, required, 180, help, "col-12 col-lg-4");

    private static AdminFieldSpec Select(string property, string label, string optionsKey, bool required = false) =>
        Field(property, label, AdminFieldKind.Select, required, 200, null, "col-12 col-lg-4", optionsKey);

    private static AdminFieldSpec Lines(string property, string label, string? help = null) =>
        Field(property, label, AdminFieldKind.LineList, false, 8000, help, "col-12 col-lg-6");

    private static AdminFieldSpec Tags(string property, string label) =>
        Field(property, label, AdminFieldKind.TagList, false, 2000, "با کاما از هم جدا کنید.", "col-12");

    private static AdminFieldSpec Repeater(string property, string label, AdminRepeaterColumn[] columns, string? help = null) =>
        Field(property, label, AdminFieldKind.Repeater, false, 32000, help, "col-12", columns: columns);

    private static List<AdminFieldSpec> Fields() => new();

    private static List<AdminFieldSpec> AddField(this List<AdminFieldSpec> fields, AdminFieldSpec field)
    {
        fields.Add(field);
        return fields;
    }

    private static List<AdminFieldSpec> AddPair(
        this List<AdminFieldSpec> fields,
        string property,
        string labelFa,
        string labelEn,
        AdminFieldKind kind = AdminFieldKind.Text,
        bool required = false,
        int maxLength = 300)
    {
        fields.Add(Field(property + "Fa", labelFa, kind, required, maxLength));
        fields.Add(Field(property + "En", labelEn, kind, required, maxLength));
        return fields;
    }

    private static List<AdminFieldSpec> AddLongPair(this List<AdminFieldSpec> fields, string property, string labelFa, string labelEn, int maxLength = 4000)
    {
        fields.Add(Long(property + "Fa", labelFa, maxLength));
        fields.Add(Long(property + "En", labelEn, maxLength));
        return fields;
    }

    private static List<AdminFieldSpec> AddPublish(this List<AdminFieldSpec> fields)
    {
        fields.Add(Number("SortOrder", "ترتیب نمایش", help: "عدد کوچک‌تر ابتدا نمایش داده می‌شود."));
        fields.Add(Check("IsPublished", "منتشر شده", "بدون تیک = مخفی از سایت"));
        return fields;
    }

    private static AdminColumnSpec Column(string property, string label, bool isImage = false, bool isBool = false, int maxWidth = 0) =>
        new() { Property = property, Label = label, IsImage = isImage, IsBool = isBool, MaxWidth = maxWidth };

    private static List<AdminColumnSpec> Columns(params AdminColumnSpec[] items) => items.ToList();

    // ───────────────────────────────── the definitions ─────────────────────────────────
    private static List<AdminEntityDefinition> BuildDefinitions() => new()
    {
        new AdminEntityDefinition
        {
            RouteName = "PortfolioProject",
            TitleFa = "نمونه‌کارها",
            SingularFa = "پروژه",
            Icon = "ti ti-briefcase",
            Group = "نمونه‌کارها",
            SlugSource = "TitleFa",
            SlugTarget = "Slug",
            RevalidateTags = new[] { "portfolio", "home", "sitemap" },
            Gateway = sp => new EntityGateway<PortfolioProject>(sp.GetRequiredService<IGenericRepository<PortfolioProject>>()),
            Columns = Columns(
                Column("Image", "تصویر", isImage: true, maxWidth: 70),
                Column("TitleFa", "عنوان"),
                Column("ClientFa", "کارفرما"),
                Column("Category", "دسته", maxWidth: 150),
                Column("Year", "سال", maxWidth: 70),
                Column("Featured", "ویژه", isBool: true, maxWidth: 70),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddField(Code("Slug", "آدرس صفحه (slug)", help: "در آخر آدرس صفحه استفاده می‌شود؛ خالی بگذارید تا از عنوان ساخته شود."))
                .AddField(Select("Category", "دسته‌بندی", "portfolio-categories", required: true))
                .AddPair("Title", "عنوان (فارسی)", "Title (English)", required: true, maxLength: 300)
                .AddPair("Summary", "خلاصه (فارسی)", "Summary (English)", AdminFieldKind.Textarea, maxLength: 600)
                .AddLongPair("Description", "توضیح کامل (فارسی)", "Full description (English)")
                .AddField(Image("Image", "تصویر شاخص", "مسیر /images/… یا فایل آپلودی."))
                .AddField(Image("DesktopScreenshot", "اسکرین‌شات دسکتاپ"))
                .AddField(Image("MobileScreenshot", "اسکرین‌شات موبایل"))
                .AddField(Lines("GalleryJson", "گالری تصاویر", "یک مسیر در هر خط."))
                .AddField(Tags("TagsJson", "فناوری‌ها / برچسب‌ها"))
                .AddPair("Client", "کارفرما (فارسی)", "Client (English)", maxLength: 300)
                .AddField(Number("Year", "سال اجرا (شمسی)"))
                .AddField(Text("Link", "لینک سایت پروژه", maxLength: 500, help: "https://…"))
                .AddField(Check("Featured", "نمایش در ویترین صفحه اصلی"))
                .AddLongPair("Challenge", "چالش پروژه (فارسی)", "The challenge (English)", 4000)
                .AddLongPair("Solution", "راه‌حل ما (فارسی)", "Our solution (English)", 4000)
                .AddField(Repeater("FeaturesJson", "ویژگی‌های کلیدی", new[]
                {
                    new AdminRepeaterColumn("TitleFa", "عنوان (فارسی)"),
                    new AdminRepeaterColumn("TitleEn", "Title (EN)"),
                    new AdminRepeaterColumn("DescriptionFa", "توضیح (فارسی)", AdminFieldKind.Textarea, 1000),
                    new AdminRepeaterColumn("DescriptionEn", "Description (EN)", AdminFieldKind.Textarea, 1000),
                }))
                .AddField(Repeater("StatsJson", "آمار پروژه", new[]
                {
                    new AdminRepeaterColumn("LabelFa", "برچسب (فارسی)"),
                    new AdminRepeaterColumn("LabelEn", "Label (EN)"),
                    new AdminRepeaterColumn("ValueFa", "مقدار (فارسی)"),
                    new AdminRepeaterColumn("ValueEn", "Value (EN)"),
                    new AdminRepeaterColumn("IconPath", "مسیر آیکون (SVG path)"),
                    new AdminRepeaterColumn("Color", "رنگ"),
                }))
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "PortfolioCategory",
            SearchProperty = "NameFa",
            TitleFa = "دسته‌بندی نمونه‌کارها",
            SingularFa = "دسته‌بندی",
            Icon = "ti ti-category",
            Group = "نمونه‌کارها",
            SlugSource = "NameFa",
            SlugTarget = "Slug",
            RevalidateTags = new[] { "portfolio", "sitemap" },
            Gateway = sp => new EntityGateway<PortfolioCategory>(sp.GetRequiredService<IGenericRepository<PortfolioCategory>>()),
            Columns = Columns(
                Column("Slug", "slug", maxWidth: 200),
                Column("NameFa", "نام فارسی"),
                Column("NameEn", "نام انگلیسی"),
                Column("SortOrder", "ترتیب", maxWidth: 80),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddField(Code("Slug", "کلید (slug)", help: "در آدرس و فیلتر دسته‌ها استفاده می‌شود."))
                .AddPair("Name", "نام (فارسی)", "Name (English)", required: true, maxLength: 200)
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "Service",
            TitleFa = "خدمات",
            SingularFa = "خدمت",
            Icon = "ti ti-tool",
            Group = "صفحه اصلی",
            RevalidateTags = new[] { "home", "services" },
            Gateway = sp => new EntityGateway<Service>(sp.GetRequiredService<IGenericRepository<Service>>()),
            Columns = Columns(
                Column("Icon", "آیکون", maxWidth: 120),
                Column("TitleFa", "عنوان"),
                Column("VisualIndex", "نمای بصری", maxWidth: 100),
                Column("SortOrder", "ترتیب", maxWidth: 80),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddField(Text("Icon", "نام آیکون", help: "نام آیکون lucide-react مثل Globe یا Server."))
                .AddPair("Title", "عنوان (فارسی)", "Title (English)", required: true, maxLength: 300)
                .AddPair("Description", "توضیح کارت (فارسی)", "Card description (English)", AdminFieldKind.Textarea, maxLength: 1000)
                .AddField(Long("HighlightsFaJson", "ویژگی‌ها در صفحه خدمات (فارسی)", 4000, "هر خط یک مورد."))
                .AddField(Long("HighlightsEnJson", "Service page highlights (English)", 4000, "One bullet per line."))
                .AddField(Number("VisualIndex", "شماره نمای بصری", help: "۰ تا ۵ — انیمیشن سمت راست هر کارت."))
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "ProcessStep",
            TitleFa = "مراحل اجرای پروژه",
            SingularFa = "مرحله",
            Icon = "ti ti-transform",
            Group = "صفحه اصلی",
            RevalidateTags = new[] { "home" },
            Gateway = sp => new EntityGateway<ProcessStep>(sp.GetRequiredService<IGenericRepository<ProcessStep>>()),
            Columns = Columns(
                Column("SortOrder", "مرحله", maxWidth: 80),
                Column("TitleFa", "عنوان"),
                Column("DurationFa", "زمان", maxWidth: 140),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddPair("Title", "عنوان (فارسی)", "Title (English)", required: true, maxLength: 300)
                .AddPair("Duration", "مدت زمان (فارسی)", "Duration (English)", maxLength: 120)
                .AddPair("Description", "توضیح (فارسی)", "Description (English)", AdminFieldKind.Textarea, maxLength: 2000)
                .AddField(Long("DeliverablesFaJson", "خروجی‌ها (فارسی)", 2000, "هر خط یک آیتم."))
                .AddField(Long("DeliverablesEnJson", "Deliverables (English)", 2000))
                .AddField(Text("Icon", "آیکون", maxLength: 60))
                .AddField(Text("Color", "کلاس گرادیان", maxLength: 200, help: "مثل from-blue-500 to-cyan-500"))
                .AddField(Text("Accent", "رنگ تأکیدی", maxLength: 20, help: "کد هگز مثل #3b82f6"))
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "Client",
            SearchProperty = "NameFa",
            TitleFa = "مشتریان و کارفرمایان",
            SingularFa = "مشتری",
            Icon = "ti ti-building-bank",
            Group = "صفحه اصلی",
            RevalidateTags = new[] { "home" },
            Gateway = sp => new EntityGateway<Client>(sp.GetRequiredService<IGenericRepository<Client>>()),
            Columns = Columns(
                Column("Monogram", "نشان", maxWidth: 90),
                Column("NameFa", "نام (فارسی)"),
                Column("NameEn", "Name (English)"),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddPair("Name", "نام (فارسی)", "Name (English)", required: true, maxLength: 300)
                .AddField(Text("Monogram", "حروف نشان", maxLength: 10, help: "مثل GOV — داخل بج نمایش داده می‌شود."))
                .AddField(Image("LogoUrl", "لوگو (اختیاری)"))
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "Testimonial",
            SearchProperty = "NameFa",
            TitleFa = "نظرات مشتریان",
            SingularFa = "نظر",
            Icon = "ti ti-message-2",
            Group = "صفحه اصلی",
            RevalidateTags = new[] { "home" },
            Gateway = sp => new EntityGateway<Testimonial>(sp.GetRequiredService<IGenericRepository<Testimonial>>()),
            Columns = Columns(
                Column("NameFa", "مشتری"),
                Column("QuoteFa", "متن نظر", maxWidth: 380),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddPair("Name", "نام سازمان (فارسی)", "Organization (English)", required: true, maxLength: 300)
                .AddPair("Quote", "متن نظر (فارسی)", "Quote (English)", AdminFieldKind.Textarea, maxLength: 2000)
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "Milestone",
            TitleFa = "تایم‌لاین درباره ما",
            SingularFa = "ایستگاه زمانی",
            Icon = "ti ti-timeline",
            Group = "درباره ما",
            RevalidateTags = new[] { "about" },
            Gateway = sp => new EntityGateway<Milestone>(sp.GetRequiredService<IGenericRepository<Milestone>>()),
            Columns = Columns(
                Column("Year", "سال", maxWidth: 80),
                Column("TitleFa", "عنوان"),
                Column("Gradient", "گرادیان", maxWidth: 220),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddField(Text("Year", "سال (شمسی)", required: true, maxLength: 20))
                .AddPair("Title", "عنوان (فارسی)", "Title (English)", required: true, maxLength: 300)
                .AddPair("Description", "توضیح (فارسی)", "Description (English)", AdminFieldKind.Textarea, maxLength: 2000)
                .AddField(Text("Glow", "کلاس نور کارت", maxLength: 200))
                .AddField(Text("Gradient", "کلاس گرادیان", maxLength: 200))
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "TeamDiscipline",
            SearchProperty = "LabelFa",
            TitleFa = "تیم و تخصص‌ها",
            SingularFa = "نقش تیم",
            Icon = "ti ti-users",
            Group = "درباره ما",
            RevalidateTags = new[] { "about" },
            Gateway = sp => new EntityGateway<TeamDiscipline>(sp.GetRequiredService<IGenericRepository<TeamDiscipline>>()),
            Columns = Columns(
                Column("LabelFa", "نقش (فارسی)"),
                Column("RoleEn", "Role (English)"),
                Column("Span", "ستون", maxWidth: 120),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddField(Text("LabelFa", "عنوان فارسی", required: true, maxLength: 200))
                .AddField(Text("RoleEn", "Role (English)", required: true, maxLength: 200))
                .AddField(Text("Span", "پهنای کارت", maxLength: 60, help: "sm:col-span-1 یا sm:col-span-2"))
                .AddField(Text("Background", "کلاس رنگی", maxLength: 300))
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "FaqItem",
            SearchProperty = "QuestionFa",
            TitleFa = "پرسش‌های متداول",
            SingularFa = "پرسش",
            Icon = "ti ti-help-circle",
            Group = "تماس با ما",
            RevalidateTags = new[] { "contact" },
            Gateway = sp => new EntityGateway<FaqItem>(sp.GetRequiredService<IGenericRepository<FaqItem>>()),
            Columns = Columns(
                Column("QuestionFa", "پرسش"),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddPair("Question", "پرسش (فارسی)", "Question (English)", required: true, maxLength: 500)
                .AddPair("Answer", "پاسخ (فارسی)", "Answer (English)", AdminFieldKind.Textarea, maxLength: 4000)
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "InquiryType",
            SearchProperty = "LabelFa",
            TitleFa = "موضوعات درخواست پروژه",
            SingularFa = "موضوع",
            Icon = "ti ti-tags",
            Group = "تماس با ما",
            RevalidateTags = new[] { "contact" },
            Gateway = sp => new EntityGateway<InquiryType>(sp.GetRequiredService<IGenericRepository<InquiryType>>()),
            Columns = Columns(
                Column("Code", "کلید", maxWidth: 140),
                Column("LabelFa", "برچسب"),
                Column("Icon", "آیکون", maxWidth: 140),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddField(Code("Code", "کلید (code)", help: "مثل web یا portal — در فرم تماس استفاده می‌شود."))
                .AddPair("Label", "برچسب (فارسی)", "Label (English)", required: true, maxLength: 300)
                .AddField(Text("Icon", "نام آیکون", maxLength: 60))
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "StoreTemplate",
            SearchProperty = "Name",
            TitleFa = "قالب‌های فروشگاه‌ساز",
            SingularFa = "قالب",
            Icon = "ti ti-layout-grid",
            Group = "فروشگاه‌ساز",
            RevalidateTags = new[] { "store" },
            Gateway = sp => new EntityGateway<StoreTemplate>(sp.GetRequiredService<IGenericRepository<StoreTemplate>>()),
            Columns = Columns(
                Column("Code", "کد", maxWidth: 100),
                Column("Name", "نام قالب"),
                Column("Category", "دسته", maxWidth: 120),
                Column("PriceMonthly", "ماهانه (تومان)", maxWidth: 130),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddField(Code("Code", "کد قالب", help: "مثل wh-1 — در آدرس صفحه پرداخت استفاده می‌شود."))
                .AddField(Text("Name", "نام قالب", required: true, maxLength: 300))
                .AddField(Select("Category", "دسته قالب", "store-template-category", required: true))
                .AddField(Text("Tag", "برچسب کوتاه", maxLength: 300))
                .AddField(Text("PlanName", "نام پلن", required: true, maxLength: 300))
                .AddField(Money("PriceMonthly", "قیمت ماهانه (تومان)"))
                .AddField(Money("PriceYearly", "قیمت سالانه (تومان)"))
                .AddField(Text("DiscountBadge", "برچسب تخفیف", maxLength: 120))
                .AddField(Long("Description", "توضیح قالب", 2000))
                .AddField(Lines("FeaturesJson", "امکانات", "هر خط یک امکان."))
                .AddField(Repeater("DesktopScreensJson", "پیش‌نمایش دسکتاپ", new[]
                {
                    new AdminRepeaterColumn("Label", "برچسب صفحه"),
                    new AdminRepeaterColumn("Src", "مسیر تصویر", AdminFieldKind.Image, 500),
                }))
                .AddField(Repeater("MobileScreensJson", "پیش‌نمایش موبایل", new[]
                {
                    new AdminRepeaterColumn("Label", "برچسب صفحه"),
                    new AdminRepeaterColumn("Src", "مسیر تصویر", AdminFieldKind.Image, 500),
                }))
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "StorePlan",
            SearchProperty = "Name",
            TitleFa = "پلن‌های اشتراک",
            SingularFa = "پلن",
            Icon = "ti ti-credit-card",
            Group = "فروشگاه‌ساز",
            RevalidateTags = new[] { "store", "payment" },
            Gateway = sp => new EntityGateway<StorePlan>(sp.GetRequiredService<IGenericRepository<StorePlan>>()),
            Columns = Columns(
                Column("Code", "کد", maxWidth: 130),
                Column("Name", "نام پلن"),
                Column("MonthlyPrice", "ماهانه", maxWidth: 120),
                Column("YearlyPrice", "سالانه", maxWidth: 120),
                Column("IsPopular", "محبوب", isBool: true, maxWidth: 80),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddField(Code("Code", "کد پلن", help: "مثل retail-smart"))
                .AddField(Text("Name", "نام پلن", required: true, maxLength: 300))
                .AddField(Text("Badge", "برچسب", maxLength: 200))
                .AddField(Long("Tagline", "زیرعنوان", 500))
                .AddField(Money("MonthlyPrice", "قیمت ماهانه (تومان)"))
                .AddField(Money("YearlyPrice", "قیمت سالانه (تومان)"))
                .AddField(Text("SetupTime", "زمان راه‌اندازی", maxLength: 200))
                .AddField(Check("IsPopular", "پلن پیشنهادی"))
                .AddField(Lines("FeaturesJson", "امکانات", "هر خط یک مورد."))
                .AddField(Lines("LimitationsJson", "محدودیت‌ها", "هر خط یک مورد."))
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "AppDownloadLink",
            TitleFa = "لینک‌های دانلود اپ طلا",
            SingularFa = "لینک دانلود",
            Icon = "ti ti-download",
            Group = "اپ طلا",
            RevalidateTags = new[] { "gold-app" },
            Gateway = sp => new EntityGateway<AppDownloadLink>(sp.GetRequiredService<IGenericRepository<AppDownloadLink>>()),
            Columns = Columns(
                Column("TitleFa", "عنوان"),
                Column("Href", "آدرس", maxWidth: 300),
                Column("Variant", "نوع", maxWidth: 110),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddPair("Title", "متن اصلی دکمه", "Button text", required: true, maxLength: 200)
                .AddPair("Caption", "متن بالا (فارسی)", "Caption (English)", maxLength: 200)
                .AddField(Text("Href", "آدرس دانلود", required: true, maxLength: 1000))
                .AddField(Text("Emoji", "ایموجی", maxLength: 10))
                .AddField(Select("Variant", "استایل دکمه", "download-variant"))
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "PageMeta",
            TitleFa = "سئوی صفحات",
            SingularFa = "صفحه",
            Icon = "ti ti-search",
            Group = "تنظیمات",
            Searchable = false,
            RevalidateTags = new[] { "pages", "home", "sitemap" },
            Gateway = sp => new EntityGateway<PageMeta>(sp.GetRequiredService<IGenericRepository<PageMeta>>()),
            Columns = Columns(
                Column("PageKey", "کلید صفحه", maxWidth: 140),
                Column("Path", "مسیر", maxWidth: 180),
                Column("TitleFa", "عنوان سئو"),
                Column("Priority", "اولویت", maxWidth: 80),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddField(Text("PageKey", "کلید صفحه", required: true, maxLength: 80, help: "home, about, services, portfolio, contact, store-builder, gold-app, payment"))
                .AddField(Text("Path", "مسیر (برای فارسی)", required: true, maxLength: 200, help: "مثل /about — نسخه انگلیسی خودکار /en افزوده می‌شود."))
                .AddPair("Title", "عنوان سئو (فارسی)", "SEO title (English)", maxLength: 220)
                .AddPair("Description", "توضیح متا (فارسی)", "Meta description (English)", AdminFieldKind.Textarea, 400)
                .AddPair("Keywords", "کلمات کلیدی (فارسی)", "Keywords (English)", maxLength: 500)
                .AddPair("Eyebrow", "برچسب بالای تیتر", "Hero eyebrow", maxLength: 200)
                .AddPair("Heading", "تیتر اصلی صفحه", "Hero heading", maxLength: 300)
                .AddPair("Subheading", "زیرتیتر صفحه", "Hero subheading", AdminFieldKind.Textarea, 1000)
                .AddPair("CtaPrimary", "متن دکمه اصلی", "Primary CTA", maxLength: 150)
                .AddPair("CtaSecondary", "متن دکمه دوم", "Secondary CTA", maxLength: 150)
                .AddField(Image("OgImage", "تصویر اشتراک‌گذاری (OG)"))
                .AddField(Select("ChangeFrequency", "دوره تغییر (sitemap)", "change-frequency"))
                .AddField(Money("Priority", "اولویت (۰ تا ۱)"))
                .AddField(Check("NoIndex", "noindex — خارج از ایندکس و سایت‌مپ"))
                .AddPublish(),
        },
    };
}
