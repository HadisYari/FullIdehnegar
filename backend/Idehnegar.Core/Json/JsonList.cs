using System.Text.Json;
using System.Text.Json.Serialization;

namespace Idehnegar.Core.Json;

/// <summary>
/// Helpers for the JSON columns of the content tables (tags, gallery, features,
/// stats, highlights, deliverables …). Everything is stored as text inside the
/// owning row so that one table can hold a whole page worth of items.
/// </summary>
public static class JsonList
{
    /// <summary>Options shared by seeding, persistence and the public API.</summary>
    public static readonly JsonSerializerOptions Options = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        NumberHandling = JsonNumberHandling.AllowReadingFromString,
        ReadCommentHandling = JsonCommentHandling.Skip,
        AllowTrailingCommas = true,
    };

    public static List<string> ReadStrings(string? json) => Read<string>(json);

    public static List<T> Read<T>(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return new List<T>();
        }

        try
        {
            return JsonSerializer.Deserialize<List<T>>(json, Options) ?? new List<T>();
        }
        catch (JsonException)
        {
            // A hand-edited value in the admin panel must never take the site down.
            return new List<T>();
        }
    }

    public static string? Write<T>(IEnumerable<T>? items)
    {
        var list = items as IList<T> ?? items?.ToList() ?? new List<T>();
        return list.Count == 0 ? null : JsonSerializer.Serialize(list, Options);
    }

    public static string? WriteMap(IEnumerable<KeyValuePair<string, string>>? map)
    {
        var items = map?.ToList() ?? new List<KeyValuePair<string, string>>();
        return items.Count == 0
            ? null
            : JsonSerializer.Serialize(items.ToDictionary(pair => pair.Key, pair => pair.Value, StringComparer.Ordinal), Options);
    }

    public static string? WriteCounters(IEnumerable<KeyValuePair<string, int>>? map)
    {
        var items = map?.ToList() ?? new List<KeyValuePair<string, int>>();
        return items.Count == 0
            ? null
            : JsonSerializer.Serialize(items.ToDictionary(pair => pair.Key, pair => pair.Value, StringComparer.Ordinal), Options);
    }

    public static Dictionary<string, string> ReadMap(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        }

        try
        {
            var map = JsonSerializer.Deserialize<Dictionary<string, string>>(json, Options);
            return map is null
                ? new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
                : new Dictionary<string, string>(map, StringComparer.OrdinalIgnoreCase);
        }
        catch (JsonException)
        {
            return new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        }
    }

    public static Dictionary<string, int> ReadCounters(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        }

        try
        {
            var map = JsonSerializer.Deserialize<Dictionary<string, int>>(json, Options);
            return map is null
                ? new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
                : new Dictionary<string, int>(map, StringComparer.OrdinalIgnoreCase);
        }
        catch (JsonException)
        {
            return new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        }
    }

    /// <summary>
    /// Accepts either a JSON array or a newline separated list coming from the
    /// admin panel and always returns a compact JSON array (or null when empty).
    /// </summary>
    public static string? NormalizeLineList(string? input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return null;
        }

        var text = input.Trim();
        if (text.StartsWith('['))
        {
            var parsed = ReadStrings(text);
            return parsed.Count == 0 ? null : Write(parsed);
        }

        var lines = text
            .Split('\n')
            .Select(line => line.Trim())
            .Where(line => line.Length > 0)
            .ToList();

        return lines.Count == 0 ? null : Write(lines);
    }

    /// <summary>Same as <see cref="NormalizeLineList"/> but for comma separated input.</summary>
    public static string? NormalizeTagList(string? input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return null;
        }

        var text = input.Trim();
        if (text.StartsWith('['))
        {
            return NormalizeLineList(text);
        }

        var tags = text
            .Split(new[] { ',', '\n' }, StringSplitOptions.RemoveEmptyEntries)
            .Select(tag => tag.Trim())
            .Where(tag => tag.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        return tags.Count == 0 ? null : Write(tags);
    }
}
