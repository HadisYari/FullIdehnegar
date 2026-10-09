using System.Diagnostics;
using EndPoints.Models;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace EndPoints.Controllers;

/// <summary>
/// The backend host serves the public API and the admin panel only; the website
/// itself is rendered by the Next.js front end. This controller therefore has no
/// content pages — just a friendly root plus the two fallback pages the pipeline
/// re-executes.
/// </summary>
public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult Index() => RedirectToAction("Index", "Dashboard", new { area = "Admin" });

    /// <summary>Target of <c>UseExceptionHandler("/Home/Error")</c>.</summary>
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        _logger.LogError("Unhandled exception while serving {Path}", Request.Path);

        return View("Error", new ErrorViewModel
        {
            Code = StatusCodes.Status500InternalServerError,
            Title = "خطای سرور",
            Message = "سرور نتوانست درخواست را کامل کند. موضوع برای تیم فنی ثبت شد؛ لطفاً دوباره تلاش کنید.",
            RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier,
        });
    }

    /// <summary>Target of <c>UseStatusCodePagesWithReExecute("/Home/StatusCode", "?code={0}")</c>.</summary>
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    [ActionName("StatusCode")]
    public IActionResult StatusCodePage(int code)
    {
        var originalPath = HttpContext.Features
    .Get<IStatusCodeReExecuteFeature>()?.OriginalPath;
        // JSON clients (the Next.js data layer) must never receive an HTML error page.
        if (originalPath is not null && originalPath.StartsWith("/api", StringComparison.OrdinalIgnoreCase))
        {
            return new JsonResult(new { error = "not_found", status = code }) { StatusCode = code };
        }

        Response.StatusCode = code;

        return View("Error", new ErrorViewModel
        {
            Code = code,
            Title = code switch
            {
                StatusCodes.Status404NotFound => "صفحه پیدا نشد",
                StatusCodes.Status403Forbidden => "دسترسی مجاز نیست",
                StatusCodes.Status401Unauthorized => "ابتدا وارد شوید",
                _ => "درخواست نامعتبر",
            },
            Message = code switch
            {
                StatusCodes.Status404NotFound => "نشانی که خواسته‌اید در این سرور وجود ندارد؛ ممکن است آدرس عوض شده باشد.",
                StatusCodes.Status401Unauthorized => "برای دیدن این بخش باید در پنل مدیریت وارد شوید.",
                _ => $"کد پاسخ: {code}",
            },
            RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier,
        });
    }
}
