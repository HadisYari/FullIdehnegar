using System.Text.Json.Serialization;
using EndPoints.Infrastructure;
using Idehnegar.Infrastructure;
using Idehnegar.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// `dotnet run -- hash-password <plain>` prints the Admin:PasswordSha256 value.
if (args.Length >= 2 && string.Equals(args[0], "hash-password", StringComparison.OrdinalIgnoreCase))
{
    Console.WriteLine(PasswordHasher.Sha256Hex(args[1]));
    return;
}

// ── Configuration ───────────────────────────────────────────────────────────
builder.Services.Configure<SiteOptions>(builder.Configuration.GetSection(SiteOptions.SectionName));
builder.Services.Configure<AdminOptions>(builder.Configuration.GetSection(AdminOptions.SectionName));

builder.Services.AddIdehnegarInfrastructure(builder.Configuration);

// The mail relay is optional: SmtpMailSender no-ops until Admin:SmtpHost is set.
builder.Services.AddScoped<IMailSender, SmtpMailSender>();
// Typed client: talks to the Next.js /api/revalidate route after a save.
builder.Services.AddHttpClient<SiteNotifier>();

// Panel metadata: one descriptor per content table drives list + form rendering.
builder.Services.AddSingleton<EndPoints.Areas.Admin.Services.AdminRegistry>();

builder.Services
    .AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        // camelCase JSON matches the TypeScript interfaces of the front end.
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.NumberHandling = JsonNumberHandling.AllowReadingFromString;
    });

// The admin panel posts AJAX requests, so the antiforgery token travels in a header.
builder.Services.AddAntiforgery(options => options.HeaderName = "RequestVerificationToken");

builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/admin/account/login";
        options.AccessDeniedPath = "/admin/account/login";
        options.Cookie.Name = "IdehnegarAdmin";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        options.SlidingExpiration = true;
        options.ExpireTimeSpan = TimeSpan.FromHours(
            Math.Clamp(builder.Configuration.GetValue("Admin:SessionHours", 8), 1, 72));
    });

builder.Services.AddAuthorization(options =>
    options.AddPolicy(AdminPolicies.Panel, policy => policy.RequireAuthenticatedUser()));

builder.Services.AddPublicRateLimiting();

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { "application/json", "text/css", "application/javascript" });
});

var frontendOrigins = builder.Configuration.GetSection("Site:FrontendOrigins").Get<string[]>()
    ?? Array.Empty<string>();

builder.Services.AddCors(options => options.AddPolicy("frontend", policy =>
{
    policy.WithExposedHeaders("Cache-Control");

    if (frontendOrigins.Length > 0)
    {
        policy.WithOrigins(frontendOrigins.Where(origin => !string.IsNullOrWhiteSpace(origin)).ToArray())
            .WithMethods("GET", "POST", "OPTIONS")
            .WithHeaders("Content-Type", "X-Revalidate-Secret")
            .MaxAge(600);
    }
    else
    {
        // No explicit allow-list (local development): the public API is read-only
        // and anonymous, so any origin may read it.
        policy.AllowAnyOrigin().WithMethods("GET", "POST").WithHeaders("Content-Type");
    }
}));

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    // The site runs behind Nginx, so the real client IP drives rate limiting.
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

var app = builder.Build();

// ── Database: migrations (or first run schema) + content seeding ────────────
if (app.Configuration.GetValue("Site:MigrateOnStartup", true))
{
    var logger = app.Services.GetRequiredService<ILoggerFactory>().CreateLogger("Database");
    try
    {
        await app.Services.InitializeDatabaseAsync(logger);
    }
    catch (Exception exception)
    {
        logger.LogError(exception, "Database initialisation failed — the site still starts so the API can be probed.");
    }
}

// ── Pipeline ────────────────────────────────────────────────────────────────
app.UseForwardedHeaders();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseStatusCodePagesWithReExecute("/Home/StatusCode", "?code={0}");
app.UseHttpsRedirection();
app.UseResponseCompression();
app.UseIdehnegarSecurityHeaders();

// Uploaded media (portfolio screenshots) and the admin panel assets.
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = context =>
    {
        if (context.Context.Request.Path.StartsWithSegments("/uploads"))
        {
            // Images are immutable (file names carry a random suffix) → long cache.
            context.Context.Response.Headers[Microsoft.Net.Http.Headers.HeaderNames.CacheControl] =
                "public, max-age=31536000, immutable";
        }
    },
});

app.UseRouting();
app.UseCors("frontend");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
