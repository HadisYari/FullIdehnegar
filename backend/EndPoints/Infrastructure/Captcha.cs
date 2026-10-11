using System.Security.Cryptography;
using System.Text;

namespace EndPoints.Infrastructure;

/// <summary>
/// کپچای عددی صفحهٔ ورود پنل. کد در Session (سمت سرور) نگه داشته می‌شود و اولین
/// تلاش — موفق یا ناموفق — آن را مصرف می‌کند، پس قابل استفادهٔ مجدد نیست.
/// تصویر یک SVG کوچک است: بدون System.Drawing (که روی Linux پشتیبانی نمی‌شود)،
/// بدون فایل تصویری و بدون سرویس بیرونی.
/// </summary>
public static class Captcha
{
    /// <summary>کلید کد کپچا در Session.</summary>
    public const string SessionKey = "IdehnegarAdminCaptcha";

    /// <summary>تعداد رقم‌های کپچا.</summary>
    public const int Digits = 4;

    private static readonly string[] Palette =
    {
        "#6d5bd0", "#1f7a8c", "#8a6a1f", "#a03e5a", "#2f6f4f", "#3f4a94",
    };

    /// <summary>یک کد تازه برای همین Session می‌سازد و برمی‌گرداند.</summary>
    public static string Create(HttpContext context)
    {
        var builder = new StringBuilder(Digits);
        for (var index = 0; index < Digits; index++)
        {
            builder.Append((char)('0' + RandomNumberGenerator.GetInt32(10)));
        }

        var code = builder.ToString();
        context.Session.SetString(SessionKey, code);
        return code;
    }

    /// <summary>
    /// پاسخ کاربر را با کد ذخیره‌شده مقایسه می‌کند و کد را مصرف (حذف) می‌کند.
    /// اگر کدی در Session نباشد (مثلاً صفحه دوباره لود شده است) نتیجه false است.
    /// </summary>
    public static bool Validate(HttpContext context, string? answer)
    {
        var expected = context.Session.GetString(SessionKey);
        context.Session.Remove(SessionKey);

        if (string.IsNullOrEmpty(expected) || string.IsNullOrWhiteSpace(answer))
        {
            return false;
        }

        // صفحه‌کلید فارسی «۱» و «١» می‌فرستد؛ هر دو به رقم لاتین تبدیل می‌شوند.
        var candidate = NormalizeDigits(answer.Trim());

        return candidate.Length == expected.Length
            && CryptographicOperations.FixedTimeEquals(
                Encoding.ASCII.GetBytes(expected),
                Encoding.ASCII.GetBytes(candidate));
    }

    /// <summary>کد را به‌صورت یک تصویر SVG مستقل (۱۷۰×۶۰) رندر می‌کند.</summary>
    public static string Svg(string code)
    {
        const int width = 170;
        const int height = 60;
        var builder = new StringBuilder();

        builder.Append("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"").Append(width)
            .Append("\" height=\"").Append(height)
            .Append("\" viewBox=\"0 0 ").Append(width).Append(' ').Append(height)
            .Append("\" role=\"img\" aria-label=\"کد امنیتی\">");
        builder.Append("<rect width=\"100%\" height=\"100%\" rx=\"10\" fill=\"#fbfbfe\" stroke=\"#e3e3ef\"/>");

        // خطوط و نقطه‌های نویز تا خواندن خودکار تصویر سخت شود.
        for (var index = 0; index < 6; index++)
        {
            builder.Append("<path d=\"M").Append(RandomNumberGenerator.GetInt32(width)).Append(' ')
                .Append(RandomNumberGenerator.GetInt32(height)).Append(" L")
                .Append(RandomNumberGenerator.GetInt32(width)).Append(' ')
                .Append(RandomNumberGenerator.GetInt32(height))
                .Append("\" stroke=\"").Append(Palette[RandomNumberGenerator.GetInt32(Palette.Length)])
                .Append("\" stroke-width=\"1\" opacity=\"0.35\" fill=\"none\"/>");
        }

        for (var index = 0; index < 18; index++)
        {
            builder.Append("<circle cx=\"").Append(RandomNumberGenerator.GetInt32(width))
                .Append("\" cy=\"").Append(RandomNumberGenerator.GetInt32(height))
                .Append("\" r=\"1.4\" fill=\"#c9c9d6\" opacity=\"0.7\"/>");
        }

        for (var index = 0; index < code.Length; index++)
        {
            var x = 24 + (index * 34) + RandomNumberGenerator.GetInt32(-4, 5);
            var y = 42 + RandomNumberGenerator.GetInt32(-4, 5);
            var angle = RandomNumberGenerator.GetInt32(-16, 17);

            builder.Append("<text x=\"").Append(x).Append("\" y=\"").Append(y)
                .Append("\" transform=\"rotate(").Append(angle).Append(' ').Append(x).Append(' ').Append(y)
                .Append(")\" font-family=\"Tahoma, Verdana, sans-serif\" font-size=\"30\" font-weight=\"700\" fill=\"")
                .Append(Palette[RandomNumberGenerator.GetInt32(Palette.Length)])
                .Append("\">").Append(code[index]).Append("</text>");
        }

        builder.Append("</svg>");
        return builder.ToString();
    }

    private static string NormalizeDigits(string input)
    {
        var builder = new StringBuilder(input.Length);
        foreach (var character in input)
        {
            builder.Append(character switch
            {
                >= '\u06F0' and <= '\u06F9' => (char)(character - '\u06F0' + '0'), // ۰..۹
                >= '\u0660' and <= '\u0669' => (char)(character - '\u0660' + '0'), // ٠..٩
                _ => character,
            });
        }

        return builder.ToString();
    }
}
