using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

namespace EndPoints.Infrastructure;

/// <summary>
/// Protects the public write endpoints (contact form) and the panel login from
/// spam/brute force, without any external dependency.
/// </summary>
public static class PublicRateLimiting
{
    public const string Policy = "public-write";

    /// <summary>سیاست جداگانهٔ صفحهٔ ورود پنل: تلاش‌های ناموفق ورود.</summary>
    public const string LoginPolicy = "admin-login";

    public static IServiceCollection AddPublicRateLimiting(this IServiceCollection services) =>
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.AddPolicy(Policy, httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 8,
                        Window = TimeSpan.FromMinutes(5),
                        QueueLimit = 0,
                        AutoReplenishment = true,
                    }));

            // ورود پنل: هر IP می‌تواند تا ۱۲ تلاش در ۵ دقیقه داشته باشد؛ کپچا و
            // تأخیر ۷۰۰ میلی‌ثانیه‌ای هم سر جای خودشان هستند.
            options.AddPolicy(LoginPolicy, httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: "login:" + (httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous"),
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 12,
                        Window = TimeSpan.FromMinutes(5),
                        QueueLimit = 0,
                        AutoReplenishment = true,
                    }));

            options.OnRejected = async (context, cancellationToken) =>
            {
                var response = context.HttpContext.Response;
                var path = context.HttpContext.Request.Path.Value ?? string.Empty;

                // APIها JSON می‌گیرند؛ فرم‌های HTML (از جمله فرم ورود) یک پیام ساده.
                if (path.StartsWith("/api", StringComparison.OrdinalIgnoreCase))
                {
                    response.ContentType = "application/json";
                    await response.WriteAsJsonAsync(
                        new { error = "too-many-requests", message = "درخواست‌ها زیاد شده است؛ چند دقیقه دیگر دوباره تلاش کنید." },
                        cancellationToken);
                    return;
                }

                response.ContentType = "text/html; charset=utf-8";
                await response.WriteAsync(
                    "<!doctype html><html lang=\"fa\" dir=\"rtl\"><head><meta charset=\"utf-8\">"
                    + "<title>تعداد درخواست‌ها زیاد است</title></head>"
                    + "<body style=\"font-family:Tahoma,sans-serif;padding:2.5rem;text-align:center\">"
                    + "<h3>تعداد تلاش‌های شما زیاد شده است</h3>"
                    + "<p>چند دقیقه دیگر دوباره تلاش کنید.</p>"
                    + "<p><a href=\"/admin/account/login\">بازگشت به صفحهٔ ورود</a></p>"
                    + "</body></html>",
                    cancellationToken);
            };
        });
}
