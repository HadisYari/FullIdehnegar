using Microsoft.Extensions.Configuration;

namespace Idehnegar.Infrastructure.Persistence;

/// <summary>
/// مقادیر configuration که برای ساخت «اولین حساب مدیر» استفاده می‌شوند.
/// ورود به پنل دیگر با configuration انجام نمی‌شود و همه‌چیز از جدول
/// <c>Users</c> خوانده می‌شود؛ این تنظیمات فقط برای پر کردن آن جدول در اولین
/// اجرا (وقتی جدول خالی است) به کار می‌روند تا مدیر هیچ‌وقت بیرون از پنل نماند.
/// </summary>
public static class AdminSeedSettings
{
    public static string Username(IConfiguration configuration) =>
        First(configuration["Admin:DefaultUsername"], configuration["Admin:Username"], "admin");

    /// <summary>
    /// رمز پیش‌فرض مدیر. مقدار جدید <c>Admin:DefaultPassword</c> است و برای
    /// نصب‌های قدیمی‌تر مقدار <c>Admin:PasswordSha256</c> خوانده می‌شود
    /// (کلید قدیمی همیشه متن سادهٔ رمز را نگه می‌داشت).
    /// </summary>
    public static string Password(IConfiguration configuration) =>
        First(configuration["Admin:DefaultPassword"], configuration["Admin:PasswordSha256"], string.Empty);

    public static string FullName(IConfiguration configuration) =>
        First(configuration["Admin:DefaultName"], "مدیر سایت");

    private static string First(params string?[] candidates) =>
        candidates.FirstOrDefault(value => !string.IsNullOrWhiteSpace(value))?.Trim() ?? string.Empty;
}
