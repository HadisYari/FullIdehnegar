using System.Security.Cryptography;
using System.Text;

namespace EndPoints.Infrastructure;

/// <summary>
/// Password hashing for the admin account. The hash lives in configuration
/// (exactly like the front end's ADMIN_PASSWORD_HASH) so no credential is ever
/// stored in the content database.
/// </summary>
public static class PasswordHasher
{
    public static string Sha256Hex(string input)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    /// <summary>Constant-time comparison of a candidate password against the stored hash.</summary>
    public static bool Verify(string password, string expectedHash)
    {
        if (string.IsNullOrWhiteSpace(expectedHash))
        {
            return false;
        }

        var candidate = Encoding.ASCII.GetBytes(Sha256Hex(password));
        var expected = Encoding.ASCII.GetBytes(expectedHash.Trim().ToLowerInvariant());

        return candidate.Length == expected.Length && CryptographicOperations.FixedTimeEquals(candidate, expected);
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
