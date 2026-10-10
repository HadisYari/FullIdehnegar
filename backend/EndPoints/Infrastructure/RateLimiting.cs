using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

namespace EndPoints.Infrastructure;

/// <summary>
/// Protects the public write endpoints (contact form)
/// from spam, without any external dependency.
/// </summary>
public static class PublicRateLimiting
{
    public const string Policy = "public-write";

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

            options.OnRejected = async (context, cancellationToken) =>
            {
                var response = context.HttpContext.Response;
                response.ContentType = "application/json";
                await response.WriteAsJsonAsync(
                    new { error = "too-many-requests", message = "درخواست‌ها زیاد شده است؛ چند دقیقه دیگر دوباره تلاش کنید." },
                    cancellationToken);
            };
        });
}
