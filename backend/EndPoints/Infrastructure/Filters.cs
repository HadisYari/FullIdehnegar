using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Net.Http.Headers;

namespace EndPoints.Infrastructure;

/// <summary>
/// Marks a public read endpoint as cacheable. Content is rendered by Next.js
/// with ISR, so a short shared cache plus a long stale window is the right mix
/// for both performance and freshness (SEO crawlers always get a 200).
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class PublicCacheAttribute : Attribute, IActionFilter
{
    private readonly int _maxAge;
    private readonly int _sharedMaxAge;

    public PublicCacheAttribute()
        : this(60, 600)
    {
    }

    public PublicCacheAttribute(int maxAge, int sharedMaxAge)
    {
        _maxAge = maxAge;
        _sharedMaxAge = sharedMaxAge;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
    }

    public void OnResultExecuted(ResultExecutedContext context)
    {
    }

    public void OnResultExecuting(ResultExecutingContext context)
    {
        var headers = context.HttpContext.Response.Headers;
        headers[HeaderNames.CacheControl] = $"public, max-age={_maxAge}, s-maxage={_sharedMaxAge}, stale-while-revalidate=3600, stale-if-error=86400";
        headers[HeaderNames.Vary] = "Accept-Encoding";
        // Structured data and sitemaps are machine consumed: keep them out of the index.
        headers[HeaderNames.XRobotsTag] = "noindex, nofollow";
    }
}

/// <summary>
/// Baseline security/SEO headers. The admin area is additionally hidden from
/// search engines, exactly like the front-end robots.txt already promises.
/// </summary>
public static class SecurityHeadersExtensions
{
    public static IApplicationBuilder UseIdehnegarSecurityHeaders(this IApplicationBuilder app) =>
        app.Use(async (context, next) =>
        {
            var headers = context.Response.Headers;
            headers[HeaderNames.XContentTypeOptions] = "nosniff";
            headers[HeaderNames.ReferrerPolicy] = "strict-origin-when-cross-origin";
            headers[HeaderNames.PermissionsPolicy] = "camera=(), microphone=(), geolocation=(self), interest-cohort=()";

            var path = context.Request.Path.Value ?? string.Empty;
            if (path.StartsWith("/admin", StringComparison.OrdinalIgnoreCase))
            {
                headers[HeaderNames.XRobotsTag] = "noindex, nofollow";
                headers[HeaderNames.XFrameOptions] = "SAMEORIGIN";
            }

            await next();
        });
}
