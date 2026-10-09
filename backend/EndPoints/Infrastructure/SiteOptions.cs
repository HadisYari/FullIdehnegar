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

/// <summary>Section "Admin" — the single account allowed into the content panel.</summary>
public sealed class AdminOptions
{
    public const string SectionName = "Admin";

    public string Username { get; set; } = "admin";

    /// <summary>SHA-256 hex of the password (generate with: dotnet run -- hash &lt;password&gt;).</summary>
    public string PasswordSha256 { get; set; } = string.Empty;

    public int SessionHours { get; set; } = 8;

    /// <summary>Optional SMTP relay for contact messages; when empty the panel only stores them.</summary>
    public string ToEmail { get; set; } = string.Empty;

    public string SmtpHost { get; set; } = string.Empty;

    public int SmtpPort { get; set; } = 587;

    public bool SmtpUseSsl { get; set; }

    public string SmtpUser { get; set; } = string.Empty;

    public string SmtpPassword { get; set; } = string.Empty;
}
