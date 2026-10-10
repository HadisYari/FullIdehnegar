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

    private static List<AdminFieldSpec> Fields() => new();

    /// <summary>
    /// Eyebrow, heading and subheading of a page are read by the home page only. The other
    /// pages keep their visible copy in the front end, so the panel offers these fields
    /// for the home page (and for a new row, before its page key is chosen) only.
    /// </summary>
    private static bool ShowsHeroCopy(object row) =>
        row is not PageMeta page || string.IsNullOrEmpty(page.PageKey) || page.PageKey == "home";

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
                .AddField(AdminFieldExtensions.Code("Slug", "آدرس صفحه (slug)", help: "در آخر آدرس صفحه استفاده می‌شود؛ خالی بگذارید تا از عنوان ساخته شود."))
                .AddField(AdminFieldExtensions.Select("Category", "دسته‌بندی", "portfolio-categories", required: true))
                .AddPair("Title", "عنوان (فارسی)", "Title (English)", required: true, maxLength: 300)
                .AddPair("Summary", "خلاصه (فارسی)", "Summary (English)", AdminFieldKind.Textarea, maxLength: 600)
                .AddLongPair("Description", "توضیح کامل (فارسی)", "Full description (English)")
                .AddField(AdminFieldExtensions.Image("Image", "تصویر شاخص", "مسیر /images/… یا فایل آپلودی."))
                .AddField(AdminFieldExtensions.Image("DesktopScreenshot", "اسکرین‌شات دسکتاپ"))
                .AddField(AdminFieldExtensions.Image("MobileScreenshot", "اسکرین‌شات موبایل"))
                .AddField(AdminFieldExtensions.Lines("GalleryJson", "گالری تصاویر", "یک مسیر در هر خط."))
                .AddField(AdminFieldExtensions.Tags("TagsJson", "فناوری‌ها / برچسب‌ها"))
                .AddPair("Client", "کارفرما (فارسی)", "Client (English)", maxLength: 300)
                .AddField(AdminFieldExtensions.Number("Year", "سال اجرا (شمسی)"))
                .AddField(AdminFieldExtensions.Text("Link", "لینک سایت پروژه", maxLength: 500, help: "https://…"))
                .AddField(AdminFieldExtensions.Check("Featured", "نمایش در ویترین صفحه اصلی"))
                .AddLongPair("Challenge", "چالش پروژه (فارسی)", "The challenge (English)", 4000)
                .AddLongPair("Solution", "راه‌حل ما (فارسی)", "Our solution (English)", 4000)
                .AddField(AdminFieldExtensions.Repeater("FeaturesJson", "ویژگی‌های کلیدی", new[]
                {
                    new AdminRepeaterColumn("TitleFa", "عنوان (فارسی)"),
                    new AdminRepeaterColumn("TitleEn", "Title (EN)"),
                    new AdminRepeaterColumn("DescriptionFa", "توضیح (فارسی)", AdminFieldKind.Textarea, 1000),
                    new AdminRepeaterColumn("DescriptionEn", "Description (EN)", AdminFieldKind.Textarea, 1000),
                }))
                .AddField(AdminFieldExtensions.Repeater("StatsJson", "آمار پروژه", new[]
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
                .AddField(AdminFieldExtensions.Code("Slug", "کلید (slug)", help: "در آدرس و فیلتر دسته‌ها استفاده می‌شود."))
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
                .AddField(AdminFieldExtensions.Text("Icon", "نام آیکون", help: "نام آیکون lucide-react مثل Globe یا Server."))
                .AddPair("Title", "عنوان (فارسی)", "Title (English)", required: true, maxLength: 300)
                .AddPair("Description", "توضیح کارت (فارسی)", "Card description (English)", AdminFieldKind.Textarea, maxLength: 1000)
                .AddField(AdminFieldExtensions.Long("HighlightsFaJson", "ویژگی‌ها در صفحه خدمات (فارسی)", 4000, "هر خط یک مورد."))
                .AddField(AdminFieldExtensions.Long("HighlightsEnJson", "Service page highlights (English)", 4000, "One bullet per line."))
                .AddField(AdminFieldExtensions.Number("VisualIndex", "شماره نمای بصری", help: "۰ تا ۵ — انیمیشن سمت راست هر کارت."))
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "HomeServiceCard",
            TitleFa = "کارت‌های خدمات صفحه اصلی",
            SingularFa = "کارت خدمت",
            Icon = "ti ti-layout-cards",
            Group = "صفحه اصلی",
            RevalidateTags = new[] { "home" },
            Gateway = sp => new EntityGateway<HomeServiceCard>(sp.GetRequiredService<IGenericRepository<HomeServiceCard>>()),
            Columns = Columns(
                Column("Code", "کد", maxWidth: 120),
                Column("TitleFa", "عنوان"),
                Column("SortOrder", "ترتیب", maxWidth: 80),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddField(AdminFieldExtensions.Text("Code", "کد کارت", required: true, maxLength: 40, help: "مثل EXP // 01"))
                .AddField(AdminFieldExtensions.Text("IconName", "نام آیکون", maxLength: 40, help: "مثل Sparkles، Cpu، Zap، Code2، Layers، Globe، Compass یا Maximize2."))
                .AddPair("Title", "عنوان (فارسی)", "Title (English)", required: true, maxLength: 300)
                .AddPair("Description", "توضیح کارت (فارسی)", "Card description (English)", AdminFieldKind.Textarea, maxLength: 1000)
                .AddField(AdminFieldExtensions.Text("Color", "رنگ اصلی (hex)", maxLength: 20))
                .AddField(AdminFieldExtensions.Text("SoftColor", "رنگ زمینهٔ آیکون (hex)", maxLength: 20))
                .AddField(AdminFieldExtensions.Text("GlowColor", "رنگ هاله (CSS)", maxLength: 60))
                .AddPair("FeatureTitle", "عنوان KPI (فارسی)", "KPI title (English)", maxLength: 200)
                .AddPair("FeatureValue", "مقدار KPI (فارسی)", "KPI value (English)", maxLength: 100)
                .AddField(AdminFieldExtensions.Text("Progress", "عرض نوار پیشرفت", maxLength: 10, help: "مثل 92%"))
                .AddField(AdminFieldExtensions.Tags("TagsJson", "برچسب‌های فناوری"))
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "AboutSection",
            TitleFa = "بخش‌های متنی صفحه درباره ما",
            SingularFa = "بخش",
            Icon = "ti ti-layout-navbar",
            Group = "درباره ما",
            RevalidateTags = new[] { "about" },
            Gateway = sp => new EntityGateway<AboutSection>(sp.GetRequiredService<IGenericRepository<AboutSection>>()),
            Columns = Columns(
                Column("Key", "کلید"),
                Column("TitleFa", "عنوان"),
                Column("SortOrder", "ترتیب", maxWidth: 80),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddField(AdminFieldExtensions.Text("Key", "کلید بخش", required: true, maxLength: 40, help: "یکی از: values، certifications، lifecycle، philosophy، tech-stack"))
                .AddPair("Eyebrow", "برچسب بالای عنوان (فارسی)", "Eyebrow (English)", maxLength: 200)
                .AddPair("Title", "عنوان بخش (فارسی)", "Section title (English)", required: true, maxLength: 300)
                .AddPair("Subtitle", "زیرعنوان (فارسی)", "Subtitle (English)", AdminFieldKind.Textarea, maxLength: 1000)
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "CoreValue",
            TitleFa = "ارزش‌های ما",
            SingularFa = "ارزش",
            Icon = "ti ti-diamond",
            Group = "درباره ما",
            RevalidateTags = new[] { "about" },
            Gateway = sp => new EntityGateway<CoreValue>(sp.GetRequiredService<IGenericRepository<CoreValue>>()),
            Columns = Columns(
                Column("TitleFa", "عنوان"),
                Column("SortOrder", "ترتیب", maxWidth: 80),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddField(AdminFieldExtensions.Text("IconPath", "مسیر SVG آیکون (مقدار d)", maxLength: 1000, help: "فقط مقدار attribute d یک path با viewBox ۲۴×۲۴."))
                .AddPair("Title", "عنوان (فارسی)", "Title (English)", required: true, maxLength: 300)
                .AddPair("Description", "توضیح (فارسی)", "Description (English)", AdminFieldKind.Textarea, maxLength: 1000)
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "Certification",
            TitleFa = "تاییدیه‌ها و جوایز",
            SingularFa = "تاییدیه",
            Icon = "ti ti-certificate",
            Group = "درباره ما",
            RevalidateTags = new[] { "about" },
            Gateway = sp => new EntityGateway<Certification>(sp.GetRequiredService<IGenericRepository<Certification>>()),
            Columns = Columns(
                Column("Icon", "آیکون", maxWidth: 80),
                Column("TitleFa", "عنوان"),
                Column("SortOrder", "ترتیب", maxWidth: 80),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddField(AdminFieldExtensions.Text("Icon", "ایموجی آیکون", maxLength: 20))
                .AddPair("Title", "عنوان (فارسی)", "Title (English)", required: true, maxLength: 300)
                .AddPair("Organization", "صادرکننده (فارسی)", "Issuer (English)", required: true, maxLength: 400)
                .AddField(AdminFieldExtensions.Text("ColorClass", "کلاس گرادیان (Tailwind)", maxLength: 200, help: "مثل from-blue-500/10 to-cyan-500/10"))
                .AddField(AdminFieldExtensions.Text("BorderClass", "کلاس حاشیه هاور (Tailwind)", maxLength: 120, help: "مثل hover:border-blue-400"))
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "LifecycleStep",
            TitleFa = "مراحل توسعه و تحویل",
            SingularFa = "مرحله",
            Icon = "ti ti-timeline",
            Group = "درباره ما",
            RevalidateTags = new[] { "about" },
            Gateway = sp => new EntityGateway<LifecycleStep>(sp.GetRequiredService<IGenericRepository<LifecycleStep>>()),
            Columns = Columns(
                Column("NumberLabel", "شماره", maxWidth: 80),
                Column("NameFa", "عنوان"),
                Column("SortOrder", "ترتیب", maxWidth: 80),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddField(AdminFieldExtensions.Text("NumberLabel", "شماره مرحله", required: true, maxLength: 10, help: "مثل 01"))
                .AddPair("Name", "نام مرحله (فارسی)", "Step name (English)", required: true, maxLength: 200)
                .AddPair("Description", "توضیح (فارسی)", "Description (English)", AdminFieldKind.Textarea, required: true, maxLength: 500)
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "PhilosophyPrinciple",
            TitleFa = "اصول مهندسی ما",
            SingularFa = "اصل",
            Icon = "ti ti-code",
            Group = "درباره ما",
            RevalidateTags = new[] { "about" },
            Gateway = sp => new EntityGateway<PhilosophyPrinciple>(sp.GetRequiredService<IGenericRepository<PhilosophyPrinciple>>()),
            Columns = Columns(
                Column("TitleFa", "عنوان"),
                Column("IconName", "آیکون", maxWidth: 120),
                Column("SortOrder", "ترتیب", maxWidth: 80),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddField(AdminFieldExtensions.Text("IconName", "نام آیکون", maxLength: 40, help: "مثل Layers، ShieldCheck، GitMerge یا Workflow."))
                .AddPair("Tag", "برچسب (فارسی)", "Tag (English)", required: true, maxLength: 200)
                .AddPair("Title", "عنوان (فارسی)", "Title (English)", required: true, maxLength: 300)
                .AddPair("Description", "توضیح (فارسی)", "Description (English)", AdminFieldKind.Textarea, required: true, maxLength: 1000)
                .AddField(AdminFieldExtensions.Text("CodeSnippet", "خط کد (اختیاری)", maxLength: 300))
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "TechStackGroup",
            TitleFa = "گروه‌های فناوری",
            SingularFa = "گروه",
            Icon = "ti ti-stack-2",
            Group = "درباره ما",
            RevalidateTags = new[] { "about" },
            Gateway = sp => new EntityGateway<TechStackGroup>(sp.GetRequiredService<IGenericRepository<TechStackGroup>>()),
            Columns = Columns(
                Column("LabelFa", "گروه"),
                Column("SortOrder", "ترتیب", maxWidth: 80),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddPair("Label", "نام گروه (فارسی)", "Group name (English)", required: true, maxLength: 120)
                .AddField(AdminFieldExtensions.Tags("ItemsJson", "فناوری‌های این گروه"))
                .AddPublish(),
        },

        new AdminEntityDefinition
        {
            RouteName = "AboutStat",
            TitleFa = "آمار صفحه درباره ما",
            SingularFa = "آمار",
            Icon = "ti ti-chart-bar",
            Group = "درباره ما",
            RevalidateTags = new[] { "about" },
            Gateway = sp => new EntityGateway<AboutStat>(sp.GetRequiredService<IGenericRepository<AboutStat>>()),
            Columns = Columns(
                Column("Icon", "آیکون", maxWidth: 80),
                Column("LabelFa", "برچسب"),
                Column("Value", "مقدار", maxWidth: 100),
                Column("SortOrder", "ترتیب", maxWidth: 80),
                Column("IsPublished", "منتشر", isBool: true, maxWidth: 70)),
            Fields = Fields()
                .AddField(AdminFieldExtensions.Number("Value", "عدد", required: true))
                .AddField(AdminFieldExtensions.Text("Suffix", "پسوند عدد", maxLength: 10, help: "مثل +"))
                .AddPair("Label", "برچسب (فارسی)", "Label (English)", required: true, maxLength: 120)
                .AddField(AdminFieldExtensions.Text("Icon", "ایموجی", maxLength: 20))
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
                .AddField(AdminFieldExtensions.Long("DeliverablesFaJson", "خروجی‌ها (فارسی)", 2000, "هر خط یک آیتم."))
                .AddField(AdminFieldExtensions.Long("DeliverablesEnJson", "Deliverables (English)", 2000))
                .AddField(AdminFieldExtensions.Text("Icon", "آیکون", maxLength: 60))
                .AddField(AdminFieldExtensions.Text("Color", "کلاس گرادیان", maxLength: 200, help: "مثل from-blue-500 to-cyan-500"))
                .AddField(AdminFieldExtensions.Text("Accent", "رنگ تأکیدی", maxLength: 20, help: "کد هگز مثل #3b82f6"))
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
                .AddField(AdminFieldExtensions.Text("Monogram", "حروف نشان", maxLength: 10, help: "مثل GOV — داخل بج نمایش داده می‌شود."))
                .AddField(AdminFieldExtensions.Image("LogoUrl", "لوگو (اختیاری)"))
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
                .AddField(AdminFieldExtensions.Text("Year", "سال (شمسی)", required: true, maxLength: 20))
                .AddPair("Title", "عنوان (فارسی)", "Title (English)", required: true, maxLength: 300)
                .AddPair("Description", "توضیح (فارسی)", "Description (English)", AdminFieldKind.Textarea, maxLength: 2000)
                .AddField(AdminFieldExtensions.Text("Glow", "کلاس نور کارت", maxLength: 200))
                .AddField(AdminFieldExtensions.Text("Gradient", "کلاس گرادیان", maxLength: 200))
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
                .AddField(AdminFieldExtensions.Text("LabelFa", "عنوان فارسی", required: true, maxLength: 200))
                .AddField(AdminFieldExtensions.Text("RoleEn", "Role (English)", required: true, maxLength: 200))
                .AddField(AdminFieldExtensions.Text("Span", "پهنای کارت", maxLength: 60, help: "sm:col-span-1 یا sm:col-span-2"))
                .AddField(AdminFieldExtensions.Text("Background", "کلاس رنگی", maxLength: 300))
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
                .AddField(AdminFieldExtensions.Code("Code", "کلید (code)", help: "مثل web یا portal — در فرم تماس استفاده می‌شود."))
                .AddPair("Label", "برچسب (فارسی)", "Label (English)", required: true, maxLength: 300)
                .AddField(AdminFieldExtensions.Text("Icon", "نام آیکون", maxLength: 60))
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
                .AddField(AdminFieldExtensions.Code("Code", "کد قالب", help: "مثل wh-1 — در آدرس صفحه پرداخت استفاده می‌شود."))
                .AddField(AdminFieldExtensions.Text("Name", "نام قالب", required: true, maxLength: 300))
                .AddField(AdminFieldExtensions.Select("Category", "دسته قالب", "store-template-category", required: true))
                .AddField(AdminFieldExtensions.Text("Tag", "برچسب کوتاه", maxLength: 300))
                .AddField(AdminFieldExtensions.Text("PlanName", "نام پلن", required: true, maxLength: 300))
                .AddField(AdminFieldExtensions.Money("PriceMonthly", "قیمت ماهانه (تومان)"))
                .AddField(AdminFieldExtensions.Money("PriceYearly", "قیمت سالانه (تومان)"))
                .AddField(AdminFieldExtensions.Text("DiscountBadge", "برچسب تخفیف", maxLength: 120))
                .AddField(AdminFieldExtensions.Long("Description", "توضیح قالب", 2000))
                .AddField(AdminFieldExtensions.Lines("FeaturesJson", "امکانات", "هر خط یک امکان."))
                .AddField(AdminFieldExtensions.Repeater("DesktopScreensJson", "پیش‌نمایش دسکتاپ", new[]
                {
                    new AdminRepeaterColumn("Label", "برچسب صفحه"),
                    new AdminRepeaterColumn("Src", "مسیر تصویر", AdminFieldKind.Image, 500),
                }))
                .AddField(AdminFieldExtensions.Repeater("MobileScreensJson", "پیش‌نمایش موبایل", new[]
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
                .AddField(AdminFieldExtensions.Code("Code", "کد پلن", help: "مثل retail-smart"))
                .AddField(AdminFieldExtensions.Text("Name", "نام پلن", required: true, maxLength: 300))
                .AddField(AdminFieldExtensions.Text("Badge", "برچسب", maxLength: 200))
                .AddField(AdminFieldExtensions.Long("Tagline", "زیرعنوان", 500))
                .AddField(AdminFieldExtensions.Money("MonthlyPrice", "قیمت ماهانه (تومان)"))
                .AddField(AdminFieldExtensions.Money("YearlyPrice", "قیمت سالانه (تومان)"))
                .AddField(AdminFieldExtensions.Text("SetupTime", "زمان راه‌اندازی", maxLength: 200))
                .AddField(AdminFieldExtensions.Check("IsPopular", "پلن پیشنهادی"))
                .AddField(AdminFieldExtensions.Lines("FeaturesJson", "امکانات", "هر خط یک مورد."))
                .AddField(AdminFieldExtensions.Lines("LimitationsJson", "محدودیت‌ها", "هر خط یک مورد."))
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
                .AddField(AdminFieldExtensions.Text("Href", "آدرس دانلود", required: true, maxLength: 1000))
                .AddField(AdminFieldExtensions.Text("Emoji", "ایموجی", maxLength: 10))
                .AddField(AdminFieldExtensions.Select("Variant", "استایل دکمه", "download-variant"))
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
                .AddField(AdminFieldExtensions.Text("PageKey", "کلید صفحه", required: true, maxLength: 80, help: "home, about, services, portfolio, contact, store-builder, gold-app, payment"))
                .AddField(AdminFieldExtensions.Text("Path", "مسیر (برای فارسی)", required: true, maxLength: 200, help: "مثل /about — نسخه انگلیسی خودکار /en افزوده می‌شود."))
                .AddPair("Title", "عنوان سئو (فارسی)", "SEO title (English)", maxLength: 220)
                .AddPair("Description", "توضیح متا (فارسی)", "Meta description (English)", AdminFieldKind.Textarea)
                .AddPair("Keywords", "کلمات کلیدی (فارسی)", "Keywords (English)", maxLength: 500)
                .AddPair("Eyebrow", "برچسب بالای تیتر", "Hero eyebrow", maxLength: 200, showWhen: ShowsHeroCopy)
                .AddPair("Heading", "تیتر اصلی صفحه", "Hero heading", maxLength: 300, showWhen: ShowsHeroCopy)
                .AddPair("Subheading", "زیرتیتر صفحه", "Hero subheading", AdminFieldKind.Textarea, showWhen: ShowsHeroCopy)
                .AddPair("CtaPrimary", "متن دکمه اصلی", "Primary CTA", maxLength: 150)
                .AddPair("CtaSecondary", "متن دکمه دوم", "Secondary CTA", maxLength: 150)
                .AddField(AdminFieldExtensions.Image("OgImage", "تصویر اشتراک‌گذاری (OG)"))
                .AddField(AdminFieldExtensions.Select("ChangeFrequency", "دوره تغییر (sitemap)", "change-frequency"))
                .AddField(AdminFieldExtensions.Money("Priority", "اولویت (۰ تا ۱)"))
                .AddField(AdminFieldExtensions.Check("NoIndex", "noindex — خارج از ایندکس و سایت‌مپ"))
                .AddPublish(),
        },
    };
}

/// <summary>
/// Helper extensions for constructing field definitions fluently.
/// </summary>
public static class AdminFieldExtensions
{
    public static AdminFieldSpec Field(
        string property,
        string label,
        AdminFieldKind kind = AdminFieldKind.Text,
        bool required = false,
        int maxLength = 500,
        string? help = null,
        string column = "col-12 col-lg-6",
        string? optionsKey = null,
        AdminRepeaterColumn[]? columns = null,
        Func<object, bool>? showWhen = null) => new()
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
            ShowWhen = showWhen,
        };

    public static AdminFieldSpec Text(string property, string label, bool required = false, int maxLength = 300, string? help = null) =>
        Field(property, label, AdminFieldKind.Text, required, maxLength, help);

    public static AdminFieldSpec Long(string property, string label, int maxLength = 2000, string? help = null, bool required = false) =>
        Field(property, label, AdminFieldKind.Textarea, required, maxLength, help, "col-12");

    public static AdminFieldSpec Number(string property, string label, bool required = false, string? help = null) =>
        Field(property, label, AdminFieldKind.Number, required, 20, help, "col-12 col-lg-3");

    public static AdminFieldSpec Money(string property, string label, string? help = null) =>
        Field(property, label, AdminFieldKind.Decimal, false, 20, help, "col-12 col-lg-4");

    public static AdminFieldSpec Check(string property, string label, string? help = null) =>
        Field(property, label, AdminFieldKind.Checkbox, false, 0, help, "col-12 col-lg-3");

    public static AdminFieldSpec Image(string property, string label, string? help = null) =>
        Field(property, label, AdminFieldKind.Image, false, 500, help, "col-12 col-lg-6");

    public static AdminFieldSpec Code(string property, string label, bool required = true, string? help = null) =>
        Field(property, label, AdminFieldKind.Code, required, 180, help, "col-12 col-lg-4");

    public static AdminFieldSpec Select(string property, string label, string optionsKey, bool required = false) =>
        Field(property, label, AdminFieldKind.Select, required, 200, null, "col-12 col-lg-4", optionsKey);

    public static AdminFieldSpec Lines(string property, string label, string? help = null) =>
        Field(property, label, AdminFieldKind.LineList, false, 8000, help, "col-12 col-lg-6");

    public static AdminFieldSpec Tags(string property, string label) =>
        Field(property, label, AdminFieldKind.TagList, false, 2000, "با کاما از هم جدا کنید.", "col-12");

    public static AdminFieldSpec Repeater(string property, string label, AdminRepeaterColumn[] columns, string? help = null) =>
        Field(property, label, AdminFieldKind.Repeater, false, 32000, help, "col-12", columns: columns);

    public static List<AdminFieldSpec> AddField(this List<AdminFieldSpec> fields, AdminFieldSpec field)
    {
        fields.Add(field);
        return fields;
    }

    public static List<AdminFieldSpec> AddPair(
        this List<AdminFieldSpec> fields,
        string property,
        string labelFa,
        string labelEn,
        AdminFieldKind kind = AdminFieldKind.Text,
        bool required = false,
        int maxLength = 300,
        Func<object, bool>? showWhen = null)
    {
        fields.Add(Field(property + "Fa", labelFa, kind, required, maxLength, showWhen: showWhen));
        fields.Add(Field(property + "En", labelEn, kind, required, maxLength, showWhen: showWhen));
        return fields;
    }

    public static List<AdminFieldSpec> AddLongPair(this List<AdminFieldSpec> fields, string property, string labelFa, string labelEn, int maxLength = 4000)
    {
        fields.Add(Long(property + "Fa", labelFa, maxLength));
        fields.Add(Long(property + "En", labelEn, maxLength));
        return fields;
    }

    public static List<AdminFieldSpec> AddPublish(this List<AdminFieldSpec> fields)
    {
        fields.Add(Number("SortOrder", "ترتیب نمایش", help: "عدد کوچک‌تر ابتدا نمایش داده می‌شود."));
        fields.Add(Check("IsPublished", "منتشر شده", "بدون تیک = مخفی از سایت"));
        return fields;
    }
}