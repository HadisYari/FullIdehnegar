using System.Text.Json;
using EndPoints.Areas.Admin.Models;
using EndPoints.Core.Abstractions;
using EndPoints.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EndPoints.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin")]
public sealed class ContentController(IGenericService<ContentEntry> content) : Controller
{
    public async Task<IActionResult> Index(string? type, CancellationToken cancellationToken)
    {
        var query = content.Query();
        if (!string.IsNullOrWhiteSpace(type)) query = query.Where(x => x.ContentType == type);
        var rows = await query.OrderBy(x => x.ContentType).ThenBy(x => x.SortOrder)
            .ThenBy(x => x.ContentKey).ToListAsync(cancellationToken);
        return View(new ContentListViewModel(rows, type));
    }

    [HttpGet]
    public async Task<IActionResult> Edit(int? id, CancellationToken cancellationToken)
    {
        if (id is null)
        {
            ViewData["Title"] = "محتوای جدید";
            return View(new ContentFormModel());
        }

        var entry = await content.GetByIdAsync(id.Value, cancellationToken);
        if (entry is null) return NotFound();
        ViewData["Title"] = $"ویرایش {entry.ContentKey}";
        return View(ContentFormModel.From(entry));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Save(ContentFormModel model, CancellationToken cancellationToken)
    {
        if (TryNormalizeJson(model.DataFaJson, nameof(model.DataFaJson), out var faJson)) model.DataFaJson = faJson;
        if (TryNormalizeJson(model.DataEnJson, nameof(model.DataEnJson), out var enJson)) model.DataEnJson = enJson;
        if (TryNormalizeJson(model.SharedJson, nameof(model.SharedJson), out var sharedJson)) model.SharedJson = sharedJson;

        if (model.SortOrder < 0)
            ModelState.AddModelError(nameof(model.SortOrder), "ترتیب نمایش نمی‌تواند منفی باشد.");

        if (ModelState.IsValid)
        {
            var normalizedKey = model.ContentKey.Trim().ToLowerInvariant();
            var duplicate = await content.Query().AnyAsync(
                x => x.ContentKey == normalizedKey && x.Id != model.Id,
                cancellationToken);
            if (duplicate) ModelState.AddModelError(nameof(model.ContentKey), "این کلید قبلاً ثبت شده است.");
        }

        if (!ModelState.IsValid)
        {
            ViewData["Title"] = model.Id == 0 ? "محتوای جدید" : "ویرایش محتوا";
            return View("Edit", model);
        }

        ContentEntry entity;
        if (model.Id > 0)
        {
            var existing = await content.GetByIdAsync(model.Id, cancellationToken);
            if (existing is null) return NotFound();
            entity = existing;
        }
        else
        {
            entity = new ContentEntry();
            await content.AddAsync(entity, cancellationToken);
        }

        model.ApplyTo(entity);
        await content.SaveChangesAsync(cancellationToken);
        TempData["Success"] = "محتوا ذخیره شد.";
        return RedirectToAction(nameof(Edit), new { id = entity.Id });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var entity = await content.GetByIdAsync(id, cancellationToken);
        if (entity is null) return NotFound();
        content.Remove(entity);
        await content.SaveChangesAsync(cancellationToken);
        TempData["Success"] = "محتوا حذف شد.";
        return RedirectToAction(nameof(Index));
    }

    private bool TryNormalizeJson(string? input, string propertyName, out string normalized)
    {
        normalized = "{}";
        if (string.IsNullOrWhiteSpace(input)) return true;
        if (input.Length > 1_000_000)
        {
            ModelState.AddModelError(propertyName, "هر فیلد JSON حداکثر می‌تواند یک مگابایت باشد.");
            return false;
        }

        try
        {
            using var document = JsonDocument.Parse(input);
            if (document.RootElement.ValueKind is not (JsonValueKind.Object or JsonValueKind.Array))
            {
                ModelState.AddModelError(propertyName, "مقدار باید یک شیء یا آرایه JSON باشد.");
                return false;
            }
            normalized = document.RootElement.GetRawText();
            return true;
        }
        catch (JsonException)
        {
            ModelState.AddModelError(propertyName, "JSON معتبر نیست.");
            return false;
        }
    }
}
