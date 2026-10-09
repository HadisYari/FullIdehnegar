using System.Security.Cryptography;
using System.Text;

namespace EndPoints.Infrastructure.Auth;

/// <summary>Validates an admin account against environment-backed PBKDF2 credentials.</summary>
public sealed class AdminPasswordVerifier(IConfiguration configuration)
{
    public bool IsValid(string username, string password)
    {
        var configuredUsername = configuration["Admin:Username"];
        var encodedHash = configuration["Admin:PasswordHash"];
        if (string.IsNullOrWhiteSpace(configuredUsername) || string.IsNullOrWhiteSpace(encodedHash))
            return false;

        var userMatches = CryptographicOperations.FixedTimeEquals(
            SHA256.HashData(Encoding.UTF8.GetBytes(username)),
            SHA256.HashData(Encoding.UTF8.GetBytes(configuredUsername)));
        if (!TryVerifyPbkdf2(password, encodedHash, out var passwordMatches)) return false;
        return userMatches && passwordMatches;
    }

    private static bool TryVerifyPbkdf2(string password, string encoded, out bool matches)
    {
        matches = false;
        var parts = encoded.Split('$', StringSplitOptions.None);
        if (parts.Length != 4 || parts[0] != "pbkdf2-sha256" ||
            !int.TryParse(parts[1], out var iterations) || iterations is < 100_000 or > 1_000_000)
            return false;

        try
        {
            var salt = Convert.FromBase64String(parts[2]);
            var expected = Convert.FromBase64String(parts[3]);
            if (salt.Length < 16 || expected.Length != 32) return false;
            var actual = Rfc2898DeriveBytes.Pbkdf2(
                password, salt, iterations, HashAlgorithmName.SHA256, expected.Length);
            matches = CryptographicOperations.FixedTimeEquals(actual, expected);
            CryptographicOperations.ZeroMemory(actual);
            return true;
        }
        catch (FormatException)
        {
            return false;
        }
    }
}
