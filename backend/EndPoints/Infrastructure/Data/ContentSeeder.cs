using System.Text.Json;
using EndPoints.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace EndPoints.Infrastructure.Data;

/// <summary>
/// Inserts the checked-in static-content export only when its stable key is
/// absent. Re-running startup therefore never creates duplicate seed rows and
/// never overwrites edits made in the admin panel.
/// </summary>
public sealed class ContentSeeder(IWebHostEnvironment environment, ILogger<ContentSeeder> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNameCaseInsensitive = true
    };

    public async Task SeedMissingAsync(AppDbContext db, CancellationToken cancellationToken = default)
    {
        var path = Path.Combine(environment.ContentRootPath, "Seed", "site-content.seed.json");
        if (!File.Exists(path))
        {
            logger.LogInformation("No static CMS seed file found at {SeedPath}; skipping content seed.", path);
            return;
        }

        await using var stream = File.OpenRead(path);
        var seeds = await JsonSerializer.DeserializeAsync<List<ContentSeedItem>>(stream, JsonOptions, cancellationToken)
                    ?? [];
        if (seeds.Count == 0) return;

        var keys = seeds.Select(x => x.ContentKey).Where(x => !string.IsNullOrWhiteSpace(x)).Distinct().ToArray();
        var existing = await db.ContentEntries.Where(x => keys.Contains(x.ContentKey))
            .Select(x => x.ContentKey).ToListAsync(cancellationToken);
        var seen = existing.ToHashSet(StringComparer.OrdinalIgnoreCase);
        var newItems = new List<ContentEntry>();
        foreach (var seed in seeds)
        {
            if (string.IsNullOrWhiteSpace(seed.ContentKey) || !seen.Add(seed.ContentKey.Trim())) continue;
            newItems.Add(ToEntity(seed));
        }

        if (newItems.Count == 0)
        {
            logger.LogInformation("CMS seed is already applied; no records inserted.");
            return;
        }

        await db.ContentEntries.AddRangeAsync(newItems, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Inserted {SeedCount} initial CMS records (existing records were left unchanged).", newItems.Count);
    }

    private static ContentEntry ToEntity(ContentSeedItem seed) => new()
    {
        ContentKey = seed.ContentKey.Trim(),
        ContentType = seed.ContentType.Trim().ToLowerInvariant(),
        Slug = seed.Slug,
        SlugFa = seed.SlugFa,
        SlugEn = seed.SlugEn,
        TitleFa = seed.TitleFa,
        TitleEn = seed.TitleEn,
        SummaryFa = seed.SummaryFa,
        SummaryEn = seed.SummaryEn,
        BodyFa = seed.BodyFa,
        BodyEn = seed.BodyEn,
        MetaTitleFa = seed.MetaTitleFa,
        MetaTitleEn = seed.MetaTitleEn,
        MetaDescriptionFa = seed.MetaDescriptionFa,
        MetaDescriptionEn = seed.MetaDescriptionEn,
        KeywordsFa = seed.KeywordsFa,
        KeywordsEn = seed.KeywordsEn,
        CanonicalUrlFa = seed.CanonicalUrlFa,
        CanonicalUrlEn = seed.CanonicalUrlEn,
        OpenGraphTitleFa = seed.OpenGraphTitleFa,
        OpenGraphTitleEn = seed.OpenGraphTitleEn,
        OpenGraphDescriptionFa = seed.OpenGraphDescriptionFa,
        OpenGraphDescriptionEn = seed.OpenGraphDescriptionEn,
        ImagePath = seed.ImagePath,
        ImageAltFa = seed.ImageAltFa,
        ImageAltEn = seed.ImageAltEn,
        DataFaJson = JsonOrEmpty(seed.DataFa),
        DataEnJson = JsonOrEmpty(seed.DataEn),
        SharedJson = JsonOrEmpty(seed.Shared),
        IsPublished = seed.IsPublished,
        IsFeatured = seed.IsFeatured,
        SortOrder = seed.SortOrder,
        CreatedAtUtc = DateTime.UtcNow
    };

    private static string JsonOrEmpty(JsonElement? value)
    {
        if (!value.HasValue || value.Value.ValueKind is JsonValueKind.Null or JsonValueKind.Undefined)
            return "{}";
        return value.Value.GetRawText();
    }

    private sealed class ContentSeedItem
    {
        public string ContentKey { get; init; } = string.Empty;
        public string ContentType { get; init; } = "page";
        public string? Slug { get; init; }
        public string? SlugFa { get; init; }
        public string? SlugEn { get; init; }
        public string? TitleFa { get; init; }
        public string? TitleEn { get; init; }
        public string? SummaryFa { get; init; }
        public string? SummaryEn { get; init; }
        public string? BodyFa { get; init; }
        public string? BodyEn { get; init; }
        public string? MetaTitleFa { get; init; }
        public string? MetaTitleEn { get; init; }
        public string? MetaDescriptionFa { get; init; }
        public string? MetaDescriptionEn { get; init; }
        public string? KeywordsFa { get; init; }
        public string? KeywordsEn { get; init; }
        public string? CanonicalUrlFa { get; init; }
        public string? CanonicalUrlEn { get; init; }
        public string? OpenGraphTitleFa { get; init; }
        public string? OpenGraphTitleEn { get; init; }
        public string? OpenGraphDescriptionFa { get; init; }
        public string? OpenGraphDescriptionEn { get; init; }
        public string? ImagePath { get; init; }
        public string? ImageAltFa { get; init; }
        public string? ImageAltEn { get; init; }
        public JsonElement? DataFa { get; init; }
        public JsonElement? DataEn { get; init; }
        public JsonElement? Shared { get; init; }
        public bool IsPublished { get; init; } = true;
        public bool IsFeatured { get; init; }
        public int SortOrder { get; init; }
    }
}
