using System.ComponentModel.DataAnnotations;

namespace Idehnegar.Core.Entities;

/// <summary>
/// یک حساب کاربری پنل مدیریت. این جدول (به‌جای configuration) منبع ورود به
/// پنل است: نام کاربری، رمز عبور، نام و نقش.
/// رمز عبور — بر اساس نیاز این پروژه — به‌صورت متن ساده و بدون هش ذخیره می‌شود،
/// بنابراین مدیر می‌تواند آن را در همان صفحهٔ کاربران پنل ببیند و ویرایش کند.
/// <see cref="ContentEntity.IsPublished"/> برای این جدول یعنی «این حساب اجازهٔ ورود دارد».
/// </summary>
public class User : ContentEntity
{
    [MaxLength(60)]
    public string Username { get; set; } = string.Empty;

    /// <summary>رمز عبور به‌صورت متن ساده (بدون هش) — مطابق خواستهٔ پروژه.</summary>
    [MaxLength(200)]
    public string Password { get; set; } = string.Empty;

    /// <summary>نام و نام خانوادگی که در نوار بالای پنل نمایش داده می‌شود.</summary>
    [MaxLength(200)]
    public string FullName { get; set; } = string.Empty;

    /// <summary>یکی از مقادیر <see cref="UserRoles"/>؛ همان چیزی که به‌عنوان Role Claim صادر می‌شود.</summary>
    [MaxLength(40)]
    public string Role { get; set; } = UserRoles.Administrator;

    /// <summary>آخرین ورود موفق (UTC) — فقط برای نمایش در فهرست کاربران.</summary>
    public DateTime? LastLoginAtUtc { get; set; }
}

/// <summary>
/// نقش‌های پنل. این ثابت‌ها هم در ورود (Role Claim) و هم در policyهای
/// <c>AdminPolicies</c> و هم در فهرست کاربران پنل استفاده می‌شوند تا نقش کاربر
/// و <c>[Authorize(Policy = …)]</c> کنترلرها همیشه با هم هماهنگ باشند.
/// </summary>
public static class UserRoles
{
    /// <summary>مدیر ارشد: دسترسی کامل، از جمله مدیریت کاربران.</summary>
    public const string Administrator = "Administrator";

    /// <summary>کاربر محتوا: فقط بخش محتوا و صندوق پیام‌ها.</summary>
    public const string Editor = "Editor";

    public static readonly string[] All = { Administrator, Editor };

    /// <summary>آیا این نقش اجازهٔ ورود به پنل (/admin) را دارد؟</summary>
    public static bool CanEnterPanel(string? role) =>
        string.Equals(role, Administrator, StringComparison.OrdinalIgnoreCase)
        || string.Equals(role, Editor, StringComparison.OrdinalIgnoreCase);

    /// <summary>آیا این نقش اجازهٔ دیدن صفحهٔ کاربران را دارد؟</summary>
    public static bool CanManageUsers(string? role) =>
        string.Equals(role, Administrator, StringComparison.OrdinalIgnoreCase);

    /// <summary>نقش ذخیره‌شده را به نام استاندارد تبدیل می‌کند (بدون حساسیت به بزرگی/کوچکی حروف).</summary>
    public static string Normalize(string? role)
    {
        if (string.Equals(role?.Trim(), Administrator, StringComparison.OrdinalIgnoreCase))
        {
            return Administrator;
        }

        // نقش خالی یا ناشناس کم‌ترین سطح دسترسی را می‌گیرد.
        return Editor;
    }

    /// <summary>عنوان فارسی نقش، برای نمایش در پنل.</summary>
    public static string Label(string? role) => string.Equals(role, Administrator, StringComparison.OrdinalIgnoreCase)
        ? "مدیر ارشد"
        : string.Equals(role, Editor, StringComparison.OrdinalIgnoreCase)
            ? "کاربر محتوا"
            : (string.IsNullOrWhiteSpace(role) ? "—" : role);
}
