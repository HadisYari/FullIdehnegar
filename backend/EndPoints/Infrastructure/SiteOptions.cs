namespace EndPoints.Infrastructure;

/// <summary>Section "Site" in appsettings — SEO and caching knobs.</summary>
public sealed class SiteOptions
{
    public const string SectionName = "Site";

    /// <summary>Absolute public origin, used for canonical/sitemap/JSON-LD URLs.</summary>
    public string CanonicalBaseUrl { get; set; } = "https://idehnegar.co";

    /// <summary>Browser/CDN cache lifetime (seconds) of the public content endpoints.</summary>
    public int ContentCacheSeconds { get; set; } = 60;

    /// <summary>
    /// Next.js endpoint that invalidates cached pages after a save in the panel,
    /// e.g. https://idehnegar.co/api/revalidate . Empty disables the notification.
    /// </summary>
    public string RevalidateUrl { get; set; } = string.Empty;

    /// <summary>Shared secret required by POST /api/public/revalidate.</summary>
    public string RevalidateSecret { get; set; } = string.Empty;
}

/// <summary>
/// Section "Admin" — SMTP and session knobs plus the seed of the first panel
/// account. The accounts themselves live in the <c>Users</c> table of the
/// database: <c>Admin:DefaultUsername</c> / <c>Admin:DefaultPassword</c> only
/// create that first administrator row while the table is still empty.
/// </summary>
public sealed class AdminOptions
{
    public const string SectionName = "Admin";

    /// <summary>Legacy name of the first administrator (kept for older deployments).</summary>
    public string Username { get; set; } = "admin";

    /// <summary>
    /// کلید قدیمی رمز مدیر: قبلاً هش SHA-256 بود، اما پروژه از آن به‌عنوان متن
    /// ساده استفاده می‌کرد؛ اکنون فقط به‌عنوان مقدار جانشین برای
    /// <c>Admin:DefaultPassword</c> خوانده می‌شود.
    /// </summary>
    public string PasswordSha256 { get; set; } = string.Empty;

    /// <summary>نام کاربری اولین مدیر (وقتی جدول Users خالی است).</summary>
    public string DefaultUsername { get; set; } = "admin";

    /// <summary>رمز عبور اولین مدیر — همان‌طور که در جدول Users ذخیره می‌شود، متن ساده.</summary>
    public string DefaultPassword { get; set; } = string.Empty;

    /// <summary>نام نمایشی اولین مدیر.</summary>
    public string DefaultName { get; set; } = "مدیر سایت";

    public int SessionHours { get; set; } = 8;

    /// <summary>Optional SMTP relay for contact messages; when empty the panel only stores them.</summary>
    public string ToEmail { get; set; } = string.Empty;

    public string SmtpHost { get; set; } = string.Empty;

    public int SmtpPort { get; set; } = 587;

    public bool SmtpUseSsl { get; set; }

    public string SmtpUser { get; set; } = string.Empty;

    public string SmtpPassword { get; set; } = string.Empty;
}
