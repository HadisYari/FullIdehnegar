using EndPoints.Areas.Admin.Models;
using EndPoints.Areas.Admin.Services;
using EndPoints.Infrastructure;
using Idehnegar.Core.Entities;
using Idehnegar.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EndPoints.Areas.Admin.Controllers;

/// <summary>
/// The single row behind the site-wide company facts (formerly site-config.ts).
/// Reuses the generic form renderer, so the markup stays consistent with the
/// rest of the panel.
/// </summary>
[Area("Admin")]
[Authorize(Policy = AdminPolicies.Panel)]
[Route("admin/site-settings")]
public sealed class SiteSettingsController : Controller
{
    private static readonly AdminFieldSpec[] FormFields =
    {
        new() { Property = "SiteUrl", Label = "آدرس کامل سایت", Required = true, MaxLength = 250, Help = "برای canonical، sitemap و JSON-LD استفاده می‌شود؛ بدون / انتهایی.", Column = "col-12 col-lg-6" },
        new() { Property = "Domain", Label = "دامنه", MaxLength = 120, Column = "col-12 col-lg-6" },
        new() { Property = "NameFa", Label = "نام شرکت (فارسی)", Required = true, MaxLength = 200 },
        new() { Property = "NameEn", Label = "Company name (English)", Required = true, MaxLength = 200 },
        new() { Property = "ShortNameFa", Label = "نام کوتاه (فارسی)", MaxLength = 100 },
        new() { Property = "ShortNameEn", Label = "Short name (English)", MaxLength = 100 },
        new() { Property = "TaglineFa", Label = "شعار (فارسی)", MaxLength = 300 },
        new() { Property = "TaglineEn", Label = "Tagline (English)", MaxLength = 300 },
        new() { Property = "FoundedJalali", Label = "سال تأسیس (شمسی)", Kind = AdminFieldKind.Number, Column = "col-12 col-lg-3" },
        new() { Property = "FoundedGregorian", Label = "سال تأسیس (میلادی)", Kind = AdminFieldKind.Number, Column = "col-12 col-lg-3" },
        new() { Property = "Email", Label = "ایمیل", Kind = AdminFieldKind.Text, Required = true, MaxLength = 200 },
        new() { Property = "TelegramId", Label = "آیدی تلگرام", MaxLength = 60 },
        new() { Property = "WhatsAppNumber", Label = "شماره واتس‌اپ", MaxLength = 60, Help = "با پیش‌شماره کشور، بدون +." },
        new() { Property = "AddressFa", Label = "آدرس (فارسی)", Kind = AdminFieldKind.Textarea, MaxLength = 500 },
        new() { Property = "AddressEn", Label = "Address (English)", Kind = AdminFieldKind.Textarea, MaxLength = 500 },
        new() { Property = "HoursFa", Label = "ساعات کاری (فارسی)", MaxLength = 250 },
        new() { Property = "HoursEn", Label = "Working hours (English)", MaxLength = 250 },
        new() { Property = "MapEmbedSrc", Label = "آدرس iframe نقشه", MaxLength = 1000, Column = "col-12" },
        new() { Property = "PhonesJson", Label = "شماره‌های تلفن", Kind = AdminFieldKind.LineList, MaxLength = 8000, Help = "هر خط یک شماره؛ شماره اول به‌عنوان تلفن اصلی سایت استفاده می‌شود." },
        new() { Property = "SocialJson", Label = "شبکه‌های اجتماعی (JSON)", Kind = AdminFieldKind.Repeater, MaxLength = 32000, Columns = new[] { new AdminRepeaterColumn("key", "کلید (مثل telegram)"), new AdminRepeaterColumn("value", "آدرس کامل") }, Help = "کلیدهای مصرفی: telegram ، linkedin ، instagram" },
        new() { Property = "StatsJson", Label = "آمار سایت (JSON)", Kind = AdminFieldKind.Repeater, MaxLength = 32000, Columns = new[] { new AdminRepeaterColumn("key", "کلید (مثل clients)"), new AdminRepeaterColumn("value", "مقدار عددی") }, Help = "کلیدهای مصرفی: clients ، projects ، yearsActive ، awards" },
        new() { Property = "DefaultOgImage", Label = "تصویر پیش‌فرض اشتراک‌گذاری", Kind = AdminFieldKind.Image, MaxLength = 500 },
    };

    private readonly IRepositoryProvider _provider;
    private readonly SiteNotifier _notifier;

    public SiteSettingsController(IRepositoryProvider provider, SiteNotifier notifier)
    {
        _provider = provider;
        _notifier = notifier;
    }

    [HttpGet("")]
    public async Task<IActionResult> Index(CancellationToken cancellationToken) =>
        Render(await LoadAsync(cancellationToken));

    [HttpPost("save")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Save(CancellationToken cancellationToken)
    {
        var repo = _provider.For<SiteSetting>();
        var setting = await repo.Query().FirstOrDefaultAsync(cancellationToken) ?? new SiteSetting();

        var errors = AdminFormBinder.Bind(FormFields, setting, Request.Form);
        if (errors.Count > 0)
        {
            foreach (var error in errors)
            {
                ModelState.AddModelError(string.Empty, error);
            }

            return Render(setting);
        }

        setting.UpdatedAtUtc = DateTime.UtcNow;

        if (setting.Id == Guid.Empty)
        {
            await repo.AddAsync(setting, cancellationToken);
        }
        else
        {
            repo.Update(setting);
        }

        await repo.SaveChangesAsync(cancellationToken);
        await _notifier.RevalidateAsync(new[] { "settings", "pages", "home", "sitemap" }, cancellationToken);

        TempData["Admin:Flash"] = "تنظیمات سایت ذخیره شد.";
        return RedirectToAction(nameof(Index));
    }

    private async Task<SiteSetting> LoadAsync(CancellationToken cancellationToken)
    {
        var repo = _provider.For<SiteSetting>();
        return await repo.Query().FirstOrDefaultAsync(cancellationToken) ?? new SiteSetting();
    }

    private IActionResult Render(SiteSetting setting)
    {
        var model = AdminFormBinder.Build(
            "SiteSettings",
            "تنظیمات سایت و اطلاعات شرکت",
            setting.Id == Guid.Empty,
            setting.Id == Guid.Empty ? null : setting.Id,
            FormFields,
            setting);

        ViewData["SaveUrl"] = "/admin/site-settings/save";
        ViewData["BackUrl"] = "/admin";
        return View("~/Areas/Admin/Views/Content/Form.cshtml", model);
    }
}
