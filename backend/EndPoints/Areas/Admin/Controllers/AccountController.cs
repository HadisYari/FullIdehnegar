using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using EndPoints.Infrastructure;
using Idehnegar.Core.Entities;
using Idehnegar.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace EndPoints.Areas.Admin.Controllers;

public sealed class LoginViewModel
{
    [Required(ErrorMessage = "نام کاربری را وارد کنید.")]
    [MaxLength(60)]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "رمز عبور را وارد کنید.")]
    [DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "کد امنیتی تصویر را وارد کنید.")]
    [MaxLength(10)]
    public string Captcha { get; set; } = string.Empty;

    public bool RememberMe { get; set; }

    public string? ReturnUrl { get; set; }
}

/// <summary>
/// ورود/خروج پنل مدیریت. اعتبار کاربران از جدول <c>Users</c> دیتابیس خوانده
/// می‌شود (نام کاربری + رمز عبور متن‌ساده)، نقش ذخیره‌شده همان Role Claimی است
/// که <c>[Authorize(Policy = AdminPolicies.Panel)]</c> کنترلرهای پنل بررسی می‌کند،
/// و کپچای عددی پیش از هر تلاش اعتبارسنجی می‌شود.
/// </summary>
[Area("Admin")]
[Route("admin/account")]
[AllowAnonymous]
public sealed class AccountController : Controller
{
    private const string EmptyUsersMessage =
        "هنوز هیچ حساب فعالی در جدول Users ثبت نشده است، بنابراین ورود امکان‌پذیر نیست. "
        + "اولین مدیر به‌صورت خودکار از روی Admin:DefaultUsername و Admin:DefaultPassword در appsettings ساخته می‌شود.";

    private readonly IRepositoryProvider _provider;
    private readonly AdminOptions _options;
    private readonly ILogger<AccountController> _logger;

    public AccountController(
        IRepositoryProvider provider,
        IOptions<AdminOptions> options,
        ILogger<AccountController> logger)
    {
        _provider = provider;
        _options = options.Value;
        _logger = logger;
    }

    [HttpGet("login")]
    public async Task<IActionResult> Login(string? next, string? returnUrl, CancellationToken cancellationToken)
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            return RedirectToAction("Index", "Dashboard", new { area = "Admin" });
        }

        ViewData["PanelNotConfigured"] = await NoUserCanSignInAsync(cancellationToken) ? EmptyUsersMessage : null;

        // کد تازه برای تصویری که در همین صفحه نمایش داده می‌شود.
        Captcha.Create(HttpContext);

        // middleware احراز هویت آدرس را با ReturnUrl برمی‌گرداند؛ هر دو نام پذیرفته می‌شوند.
        return View(new LoginViewModel { ReturnUrl = next ?? returnUrl });
    }

    /// <summary>تصویر کپچای عددی؛ کد تازه را در Session می‌نویسد.</summary>
    [HttpGet("captcha")]
    public IActionResult CaptchaImage()
    {
        var code = Captcha.Create(HttpContext);

        Response.Headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0";
        Response.Headers["Pragma"] = "no-cache";

        return Content(Captcha.Svg(code), "image/svg+xml");
    }

    [HttpPost("login")]
    [ValidateAntiForgeryToken]
    [EnableRateLimiting(PublicRateLimiting.LoginPolicy)]
    public async Task<IActionResult> Login(LoginViewModel model, CancellationToken cancellationToken)
    {
        // کپچا اول از همه بررسی می‌شود: هم از رمز محافظت می‌کند و هم جلوی
        // هر تلاش بی‌فایده به دیتابیس را می‌گیرد.
        if (!Captcha.Validate(HttpContext, model.Captcha))
        {
            ModelState.AddModelError(nameof(model.Captcha), "کد امنیتی تصویر اشتباه یا منقضی شده است.");
        }

        if (!ModelState.IsValid)
        {
            ViewData["PanelNotConfigured"] = await NoUserCanSignInAsync(cancellationToken) ? EmptyUsersMessage : null;
            return View(model);
        }

        var username = model.Username.Trim();
        var users = _provider.For<User>();

        // ورود فقط از دیتابیس: کاربر از جدول Users خوانده می‌شود.
        var user = await users.QueryTracked()
            .FirstOrDefaultAsync(item => item.Username == username, cancellationToken);

        var passwordMatches = user is not null && PlainTextPassword.Matches(model.Password, user.Password);
        var accountIsActive = user is { IsPublished: true };

        if (!passwordMatches || !accountIsActive)
        {
            // Slow down brute force a little; rate limiting covers the rest.
            await Task.Delay(700, cancellationToken);
            _logger.LogWarning("Failed admin login attempt for {Username} from {Ip}", username, HttpContext.Connection.RemoteIpAddress);
            ModelState.AddModelError(string.Empty, "نام کاربری یا رمز عبور اشتباه است.");
            return View(model);
        }

        // نقش باید با policyهای پنل هماهنگ باشد؛ نقش‌های ناشناس اجازهٔ ورود ندارند.
        if (!UserRoles.CanEnterPanel(user.Role))
        {
            await Task.Delay(700, cancellationToken);
            _logger.LogWarning("Account {Username} with role {Role} is not allowed into the panel", user.Username, user.Role);
            ModelState.AddModelError(string.Empty, "این حساب اجازهٔ ورود به پنل مدیریت را ندارد.");
            return View(model);
        }

        var role = UserRoles.Normalize(user.Role);
        var displayName = string.IsNullOrWhiteSpace(user.FullName) ? user.Username : user.FullName;

        var identity = new ClaimsIdentity(
            new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, displayName),
                new Claim(ClaimTypes.GivenName, user.Username),
                // همین Claim است که [Authorize(Policy = AdminPolicies.Panel)] را راضی می‌کند.
                new Claim(ClaimTypes.Role, role),
            },
            CookieAuthenticationDefaults.AuthenticationScheme);

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(identity),
            new AuthenticationProperties
            {
                IsPersistent = model.RememberMe,
                ExpiresUtc = DateTimeOffset.UtcNow.AddHours(Math.Clamp(_options.SessionHours, 1, 72)),
            });

        // ثبت آخرین ورود موفق (ستون‌های فنی جدول کاربران).
        user.LastLoginAtUtc = DateTime.UtcNow;
        user.UpdatedAtUtc = DateTime.UtcNow;
        users.Update(user);
        await users.SaveChangesAsync(cancellationToken);

        return RedirectLocal(model.ReturnUrl);
    }

    [HttpPost("logout")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction(nameof(Login));
    }

    /// <summary>مقصد <c>AccessDeniedPath</c>: کاربر وارد شده است اما نقشش اجازهٔ آن بخش را ندارد.</summary>
    [HttpGet("denied")]
    public IActionResult AccessDenied() => View();

    /// <summary>
    /// آیا هیچ حساب فعالی وجود ندارد که بتواند وارد شود؟ (برای پیام هشدار صفحهٔ ورود)
    /// </summary>
    private async Task<bool> NoUserCanSignInAsync(CancellationToken cancellationToken)
    {
        try
        {
            var active = await _provider.For<User>().Query()
                .Where(item => item.IsPublished)
                .Select(item => item.Role)
                .ToListAsync(cancellationToken);

            return !active.Any(UserRoles.CanEnterPanel);
        }
        catch (Exception exception)
        {
            // مثلاً پیش از اجرای مایگریشن: صفحهٔ ورود باید بالاخره رندر شود.
            _logger.LogWarning(exception, "Users could not be read while rendering the login page.");
            return false;
        }
    }

    private IActionResult RedirectLocal(string? next)
    {
        var safe = !string.IsNullOrWhiteSpace(next) && next.StartsWith("/", StringComparison.Ordinal) && !next.StartsWith("//", StringComparison.Ordinal);
        return safe ? LocalRedirect(next!) : RedirectToAction("Index", "Dashboard", new { area = "Admin" });
    }
}
