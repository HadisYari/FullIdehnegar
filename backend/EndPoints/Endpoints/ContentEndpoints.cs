using System.Text.Json;
using EndPoints.Core.Abstractions;
using EndPoints.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EndPoints.Endpoints;

/// <summary>
/// Public, read-only CMS endpoints consumed by the Next.js site.
/// All routes are versioned and return JSON; management writes stay behind Admin.
/// </summary>
[ApiController]
[Produces("application/json")]
[Route("api/v1")]
public sealed class ContentEndpoints(IGenericService<ContentEntry> content) : ControllerBase
{
    [HttpGet("content")]
    [ProducesResponseType(typeof(IReadOnlyList<ContentEntryResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<ContentEntryResponse>>> List(
        [FromQuery] string locale = "fa",
        [FromQuery] string? type = null,
        [FromQuery] int limit = 200,
        CancellationToken cancellationToken = default)
    {
        if (!IsSupportedLocale(locale)) return BadRequest(new { message = "locale must be 'fa' or 'en'." });
        limit = Math.Clamp(limit, 1, 500);

        var query = content.Query()
            .Where(x => x.IsPublished && (type == null || x.ContentType == type))
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.ContentKey)
            .Take(limit);

        var entries = await query.ToListAsync(cancellationToken);
        return Ok(entries.Select(x => ContentEntryResponse.From(x, locale)).ToArray());
    }

    [HttpGet("content/{key}")]
    [ProducesResponseType(typeof(ContentEntryResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ContentEntryResponse>> GetByKey(
        string key,
        [FromQuery] string locale = "fa",
        CancellationToken cancellationToken = default)
    {
        if (!IsSupportedLocale(locale)) return BadRequest(new { message = "locale must be 'fa' or 'en'." });

        var entry = await content.FirstOrDefaultAsync(
            x => x.ContentKey == key && x.IsPublished,
            cancellationToken);
        return entry is null ? NotFound() : Ok(ContentEntryResponse.From(entry, locale));
    }

    [HttpGet("pages/{key}")]
    [ProducesResponseType(typeof(ContentEntryResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ContentEntryResponse>> GetPage(
        string key,
        [FromQuery] string locale = "fa",
        CancellationToken cancellationToken = default)
    {
        if (!IsSupportedLocale(locale)) return BadRequest(new { message = "locale must be 'fa' or 'en'." });
        var entry = await content.FirstOrDefaultAsync(
            x => x.ContentKey == $"page:{key}" && x.IsPublished,
            cancellationToken);
        return entry is null ? NotFound() : Ok(ContentEntryResponse.From(entry, locale));
    }

    [HttpGet("portfolio")]
    [ProducesResponseType(typeof(IReadOnlyList<ContentEntryResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<ContentEntryResponse>>> Portfolio(
        [FromQuery] string locale = "fa",
        [FromQuery] bool? featured = null,
        [FromQuery] int limit = 100,
        CancellationToken cancellationToken = default)
    {
        if (!IsSupportedLocale(locale)) return BadRequest(new { message = "locale must be 'fa' or 'en'." });
        limit = Math.Clamp(limit, 1, 300);
        var query = content.Query().Where(x => x.IsPublished && x.ContentType == "portfolio");
        if (featured.HasValue) query = query.Where(x => x.IsFeatured == featured.Value);
        var entries = await query.OrderBy(x => x.SortOrder).ThenBy(x => x.ContentKey)
            .Take(limit).ToListAsync(cancellationToken);
        return Ok(entries.Select(x => ContentEntryResponse.From(x, locale)).ToArray());
    }

    [HttpGet("portfolio/{slug}")]
    [ProducesResponseType(typeof(ContentEntryResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ContentEntryResponse>> PortfolioItem(
        string slug,
        [FromQuery] string locale = "fa",
        CancellationToken cancellationToken = default)
    {
        if (!IsSupportedLocale(locale)) return BadRequest(new { message = "locale must be 'fa' or 'en'." });
        var entry = await content.FirstOrDefaultAsync(
            x => x.ContentType == "portfolio" && x.IsPublished &&
                 (x.Slug == slug || x.SlugFa == slug || x.SlugEn == slug),
            cancellationToken);
        return entry is null ? NotFound() : Ok(ContentEntryResponse.From(entry, locale));
    }

    [HttpGet("site")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Site(
        [FromQuery] string locale = "fa",
        CancellationToken cancellationToken = default)
    {
        if (!IsSupportedLocale(locale)) return BadRequest(new { message = "locale must be 'fa' or 'en'." });

        var rows = await content.Query().Where(x => x.IsPublished).ToListAsync(cancellationToken);
        var dictionary = rows.FirstOrDefault(x => x.ContentKey == "site:dictionary");
        var settings = rows.FirstOrDefault(x => x.ContentKey == "site:settings");
        var testimonials = rows.Where(x => x.ContentType == "testimonial")
            .OrderBy(x => x.SortOrder)
            .Select(x => ContentEntryResponse.From(x, locale))
            .ToArray();

        return Ok(new
        {
            locale,
            dictionary = dictionary is null ? null : ContentEntryResponse.From(dictionary, locale).Data,
            settings = settings is null ? null : ContentEntryResponse.From(settings, locale).Data,
            testimonials
        });
    }

    private static bool IsSupportedLocale(string locale) => locale is "fa" or "en";
}

/// <summary>Consistent locale-resolved response for CMS and SEO fields.</summary>
public sealed record ContentEntryResponse(
    int Id,
    string Key,
    string Type,
    string? Slug,
    string? Title,
    string? Summary,
    string? Body,
    string? MetaTitle,
    string? MetaDescription,
    string? Keywords,
    string? CanonicalUrl,
    string? OpenGraphTitle,
    string? OpenGraphDescription,
    string? ImagePath,
    string? ImageAlt,
    bool IsPublished,
    bool IsFeatured,
    int SortOrder,
    JsonElement Data,
    JsonElement Shared,
    DateTime UpdatedAtUtc)
{
    public static ContentEntryResponse From(ContentEntry entry, string locale)
    {
        var isFa = locale == "fa";
        return new ContentEntryResponse(
            entry.Id,
            entry.ContentKey,
            entry.ContentType,
            isFa ? entry.SlugFa ?? entry.Slug : entry.SlugEn ?? entry.Slug,
            isFa ? entry.TitleFa : entry.TitleEn,
            isFa ? entry.SummaryFa : entry.SummaryEn,
            isFa ? entry.BodyFa : entry.BodyEn,
            isFa ? entry.MetaTitleFa : entry.MetaTitleEn,
            isFa ? entry.MetaDescriptionFa : entry.MetaDescriptionEn,
            isFa ? entry.KeywordsFa : entry.KeywordsEn,
            isFa ? entry.CanonicalUrlFa : entry.CanonicalUrlEn,
            isFa ? entry.OpenGraphTitleFa : entry.OpenGraphTitleEn,
            isFa ? entry.OpenGraphDescriptionFa : entry.OpenGraphDescriptionEn,
            entry.ImagePath,
            isFa ? entry.ImageAltFa : entry.ImageAltEn,
            entry.IsPublished,
            entry.IsFeatured,
            entry.SortOrder,
            ParseJson(isFa ? entry.DataFaJson : entry.DataEnJson),
            ParseJson(entry.SharedJson),
            entry.UpdatedAtUtc ?? entry.CreatedAtUtc);
    }

    private static JsonElement ParseJson(string json)
    {
        try
        {
            using var document = JsonDocument.Parse(string.IsNullOrWhiteSpace(json) ? "{}" : json);
            return document.RootElement.Clone();
        }
        catch (JsonException)
        {
            using var document = JsonDocument.Parse("{}");
            return document.RootElement.Clone();
        }
    }
}
