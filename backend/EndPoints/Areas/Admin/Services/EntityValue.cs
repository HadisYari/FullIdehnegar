using System.Globalization;
using System.Reflection;
using System.Text;
using System.Text.Json;
using EndPoints.Areas.Admin.Models;

namespace EndPoints.Areas.Admin.Services;

/// <summary>
/// Reflection helpers that read/write entity properties by name. This is what
/// lets a single controller and a single Razor form serve every content table.
/// </summary>
public static class EntityValue
{
    private static PropertyInfo? Find(Type type, string name) =>
        type.GetProperty(name, BindingFlagsPublicInstance | BindingFlags.IgnoreCase);

    private const BindingFlags BindingFlagsPublicInstance = BindingFlags.Public | BindingFlags.Instance;

    public static object? Get(object entity, string property)
    {
        var info = Find(entity.GetType(), property);
        return info is null || !info.CanRead ? null : info.GetValue(entity);
    }

    /// <summary>Reads a property as the text used inside an input element.</summary>
    public static string GetText(object entity, string property)
    {
        var value = Get(entity, property);
        return value switch
        {
            null => string.Empty,
            string text => text,
            bool flag => flag ? "true" : "false",
            DateTime date => date.ToString("yyyy-MM-dd'T'HH:mm", CultureInfo.InvariantCulture),
            decimal number => number.ToString(CultureInfo.InvariantCulture),
            double number => number.ToString(CultureInfo.InvariantCulture),
            float number => number.ToString(CultureInfo.InvariantCulture),
            int number => number.ToString(CultureInfo.InvariantCulture),
            long number => number.ToString(CultureInfo.InvariantCulture),
            short number => number.ToString(CultureInfo.InvariantCulture),
            Guid guid => guid.ToString(),
            IEnumerable<object> items => string.Join('\n', items),
            _ => Convert.ToString(value, CultureInfo.InvariantCulture) ?? string.Empty,
        };
    }

    public static bool Set(object entity, string property, string? raw, AdminFieldKind kind, out string? error)
    {
        error = null;
        var info = Find(entity.GetType(), property);
        if (info is null)
        {
            error = $"ویژگی «{property}» روی این موجودیت وجود ندارد.";
            return false;
        }

        if (!info.CanWrite)
        {
            error = $"ویژگی «{property}» قابل نوشتن نیست.";
            return false;
        }

        var type = Nullable.GetUnderlyingType(info.PropertyType) ?? info.PropertyType;
        var text = (raw ?? string.Empty).Trim();

        try
        {
            if (type == typeof(bool))
            {
                info.SetValue(entity, text is "true" or "on" or "1" or "yes" or "checked");
                return true;
            }

            if (text.Length == 0)
            {
                // Reference types and nullable value types fall back to "no value".
                var empty = type == typeof(string) || Nullable.GetUnderlyingType(info.PropertyType) is not null
                    ? null
                    : Activator.CreateInstance(type);
                info.SetValue(entity, empty);
                return true;
            }

            if (type == typeof(string))
            {
                info.SetValue(entity, kind is AdminFieldKind.Slug or AdminFieldKind.Code ? NormalizeCode(text) : text);
                return true;
            }

            if (type == typeof(int))
            {
                info.SetValue(entity, ParseInt(text));
                return true;
            }

            if (type == typeof(decimal))
            {
                info.SetValue(entity, ParseDecimal(text));
                return true;
            }

            if (type == typeof(DateTime))
            {
                info.SetValue(entity, DateTime.TryParse(text, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date) ? date : DateTime.UtcNow);
                return true;
            }

            if (type == typeof(Guid))
            {
                info.SetValue(entity, Guid.TryParse(text, out var guid) ? guid : Guid.Empty);
                return true;
            }

            error = $"نوع داده‌ای «{type.Name}» پشتیبانی نمی‌شود.";
            return false;
        }
        catch (Exception exception) when (exception is FormatException or InvalidCastException or OverflowException)
        {
            error = $"مقدار «{info.Name}» معتبر نیست.";
            return false;
        }
    }

    /// <summary>Persian/Arabic digits + thousand separators are accepted everywhere.</summary>
    public static string NormalizeDigits(string input)
    {
        if (string.IsNullOrEmpty(input))
        {
            return input;
        }

        var builder = new StringBuilder(input.Length);
        foreach (var c in input)
        {
            switch (c)
            {
                case >= '۰' and <= '۹':
                    builder.Append((char)('0' + (c - '۰')));
                    break;
                case >= '٠' and <= '٩':
                    builder.Append((char)('0' + (c - '٠')));
                    break;
                case '،' or '٫':
                    builder.Append('.');
                    break;
                case ',' or ' ' or '\u00a0' or '٬':
                    // thousand separators typed by the Persian keyboard
                    break;
                case '-':
                    builder.Append('-');
                    break;
                default:
                    builder.Append(c);
                    break;
            }
        }

        return builder.ToString();
    }

    public static int ParseInt(string input)
    {
        var normalized = NormalizeDigits(input);
        return int.TryParse(normalized, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value)
            ? value
            : 0;
    }

    public static decimal ParseDecimal(string input)
    {
        var normalized = NormalizeDigits(input);
        return decimal.TryParse(normalized, NumberStyles.Float, CultureInfo.InvariantCulture, out var value)
            ? value
            : 0m;
    }

    public static string NormalizeCode(string input)
    {
        // Persian letters are kept, everything else follows the front-end slugify().
        var builder = new StringBuilder(input.ToLowerInvariant().Trim().Replace(' ', '-'));
        for (var i = builder.Length - 1; i >= 0; i--)
        {
            var c = builder[i];
            var keep = char.IsLetterOrDigit(c) || c == '-' || c is >= '؀' and <= 'ۿ';
            if (!keep)
            {
                builder.Remove(i, 1);
            }
        }

        var code = builder.ToString().Replace("--", "-").Trim('-');
        return code.Length == 0 ? input.Trim() : code;
    }

    /// <summary>
    /// Turns the raw textarea of a list/repeater field into the compact JSON that
    /// is stored in the column. Invalid JSON produces an error message instead of
    /// silently dropping content.
    /// </summary>
    public static bool TryNormalizeJson(string? raw, out string? json, out string? error)
    {
        json = null;
        error = null;
        var text = (raw ?? string.Empty).Trim();

        if (text.Length == 0)
        {
            return true;
        }

        if (text.StartsWith('['))
        {
            try
            {
                using var document = JsonDocument.Parse(text);
                if (document.RootElement.ValueKind != JsonValueKind.Array)
                {
                    error = "مقدار این فیلد باید یک آرایه JSON باشد.";
                    return false;
                }

                json = document.RootElement.GetRawText();
                return true;
            }
            catch (JsonException)
            {
                error = "ساختار JSON این فیلد معتبر نیست.";
                return false;
            }
        }

        var lines = text
            .Split('\n')
            .Select(line => line.Trim().TrimStart('-', '•', ' '))
            .Where(line => line.Length > 0)
            .ToList();

        json = lines.Count == 0 ? null : JsonSerializer.Serialize(lines, new JsonSerializerOptions(JsonSerializerDefaults.Web));
        return true;
    }

    /// <summary>Reads a JSON column back into the line-based editor content.</summary>
    public static string JsonToLines(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return string.Empty;
        }

        try
        {
            using var document = JsonDocument.Parse(json);
            if (document.RootElement.ValueKind != JsonValueKind.Array)
            {
                return json;
            }

            var lines = new List<string>();
            foreach (var element in document.RootElement.EnumerateArray())
            {
                lines.Add(element.ValueKind == JsonValueKind.String ? element.GetString() ?? string.Empty : element.GetRawText());
            }

            return string.Join('\n', lines);
        }
        catch (JsonException)
        {
            return json;
        }
    }

    /// <summary>Comma separated view of a JSON string array (tag inputs).</summary>
    public static string JsonToTags(string? json) =>
        string.Join(", ", JsonToLines(json).Split('\n', StringSplitOptions.RemoveEmptyEntries));
}
