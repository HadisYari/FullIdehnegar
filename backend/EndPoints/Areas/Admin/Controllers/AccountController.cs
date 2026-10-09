using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using EndPoints.Infrastructure;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

    public bool RememberMe { get; set; }

    public string? ReturnUrl { get; set; }
}

[Area("Admin")]
[Route("admin/account")]
[AllowAnonymous]
public sealed class AccountController : Controller
{
    private readonly AdminOptions _options;
    private readonly ILogger<AccountController> _logger;

    public AccountController(IOptions<AdminOptions> options, ILogger<AccountController> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    [HttpGet("login")]
    public IActionResult Login(string? next)
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            return RedirectToAction("Index", "Dashboard", new { area = "Admin" });
        }

        ViewData["PanelNotConfigured"] = string.IsNullOrWhiteSpace(_options.PasswordSha256)
            && string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("IDEHNEGAR_ADMIN_PASSWORD"));

        return View(new LoginViewModel { ReturnUrl = next });
    }

    [HttpPost("login")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(LoginViewModel model, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return View(model);
        }

        // The password is never stored in the database: the panel accepts the
        // SHA-256 hash configured in appsettings (or IDEHNEGAR_ADMIN_PASSWORD in dev).
        var expected = _options.PasswordSha256;
        var environmentPassword = Environment.GetEnvironmentVariable("IDEHNEGAR_ADMIN_PASSWORD");
        var usernameMatches = string.Equals(model.Username.Trim(), _options.Username, StringComparison.Ordinal);

        var passwordMatches = !string.IsNullOrWhiteSpace(expected)
            ? PasswordHasher.Verify(model.Password, expected)
            : !string.IsNullOrWhiteSpace(environmentPassword) && model.Password == environmentPassword;

        if (!usernameMatches || !passwordMatches)
        {
            // Slow down brute force a little; rate limiting covers the rest.
            await Task.Delay(700, cancellationToken);
            _logger.LogWarning("Failed admin login attempt for {Username} from {Ip}", model.Username, HttpContext.Connection.RemoteIpAddress);
            ModelState.AddModelError(string.Empty, "نام کاربری یا رمز عبور اشتباه است.");
            return View(model);
        }

        var identity = new ClaimsIdentity(
            new[]
            {
                new Claim(ClaimTypes.NameIdentifier, _options.Username),
                new Claim(ClaimTypes.Name, _options.Username),
                new Claim(ClaimTypes.Role, "Administrator"),
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

        return RedirectLocal(model.ReturnUrl);
    }

    [HttpPost("logout")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction(nameof(Login));
    }

    private IActionResult RedirectLocal(string? next)
    {
        var safe = !string.IsNullOrWhiteSpace(next) && next.StartsWith('/', StringComparison.Ordinal) && !next.StartsWith("//", StringComparison.Ordinal);
        return safe ? LocalRedirect(next!) : RedirectToAction("Index", "Dashboard", new { area = "Admin" });
    }
}
