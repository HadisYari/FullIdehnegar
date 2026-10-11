using System.Security.Cryptography;
using System.Text;

namespace EndPoints.Infrastructure;

/// <summary>
/// مقایسهٔ رمزهای پنل. رمز در جدول <c>Users</c> به‌صورت متن ساده ذخیره می‌شود
/// (به‌خواستهٔ پروژه، بدون هش)، اما خودِ مقایسه با زمان ثابت انجام می‌گیرد تا
/// کسی نتواند با کرنومتر رمز را حرف‌به‌حرف حدس بزند.
/// </summary>
public static class PlainTextPassword
{
    /// <summary>مقایسهٔ زمان-ثابت رمز واردشده با مقدار ذخیره‌شده.</summary>
    public static bool Matches(string? candidate, string? stored)
    {
        if (string.IsNullOrEmpty(stored))
        {
            return false;
        }

        var left = Encoding.UTF8.GetBytes(stored);
        var right = Encoding.UTF8.GetBytes(candidate ?? string.Empty);

        return CryptographicOperations.FixedTimeEquals(left, right);
    }
}

/// <summary>
/// Mirrors the front-end <c>slugify()</c> so the slugs stored in SQL Server stay
/// compatible with the existing portfolio URLs (Persian letters are preserved).
/// </summary>
public static class Slugifier
{
    public static string Slugify(string? input, string fallback = "item")
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return fallback;
        }

        var builder = new StringBuilder(input.Trim().ToLowerInvariant());
        for (var i = builder.Length - 1; i >= 0; i--)
        {
            var c = builder[i];
            var isAllowed = char.IsLetterOrDigit(c) || c == '-' || c == ' ' || c is >= '\u0600' and <= '\u06FF';
            if (!isAllowed)
            {
                builder.Remove(i, 1);
            }
        }

        var slug = builder.ToString()
            .Replace(' ', '-')
            .Replace("--", "-")
            .Trim('-');

        return string.IsNullOrWhiteSpace(slug) ? fallback : slug;
    }
}
