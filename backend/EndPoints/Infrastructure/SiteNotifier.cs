using System.Net.Http.Json;
using Microsoft.Extensions.Options;

namespace EndPoints.Infrastructure;

/// <summary>Authorization policy name used by every admin controller.</summary>
public static class AdminPolicies
{
    public const string Panel = "IdehnegarAdminPanel";
}

/// <summary>
/// Notifies the Next.js front end that content changed so its ISR cache is
/// refreshed immediately after a save in the panel. Silently ignores a missing
/// or unreachable hook — publishing must never fail because of the caller.
/// </summary>
public sealed class SiteNotifier
{
    private readonly HttpClient _http;
    private readonly SiteOptions _options;
    private readonly ILogger<SiteNotifier> _logger;

    public SiteNotifier(HttpClient http, IOptions<SiteOptions> options, ILogger<SiteNotifier> logger)
    {
        _http = http;
        _options = options.Value;
        _logger = logger;
    }

    public async Task RevalidateAsync(IEnumerable<string> tags, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_options.RevalidateUrl))
        {
            return;
        }

        var distinct = tags.Where(tag => !string.IsNullOrWhiteSpace(tag)).Distinct().ToList();
        if (distinct.Count == 0)
        {
            return;
        }

        try
        {
            using var timeout = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            timeout.CancelAfter(TimeSpan.FromSeconds(5));

            var response = await _http.PostAsJsonAsync(
                _options.RevalidateUrl,
                new { secret = _options.RevalidateSecret, tags = distinct },
                timeout.Token);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Front-end revalidation answered {Status} for tags {Tags}", (int)response.StatusCode, string.Join(',', distinct));
            }
        }
        catch (Exception exception)
        {
            _logger.LogWarning(exception, "Front-end revalidation could not be reached");
        }
    }
}
