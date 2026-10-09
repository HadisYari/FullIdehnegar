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
/// Generic CRUD screen for every content table in <see cref="AdminRegistry"/>.
/// Field definitions drive both rendering and binding, so new entities only need
/// a descriptor — no controller, no service.
/// </summary>
[Area("Admin")]
[Authorize(Policy = AdminPolicies.Panel)]
[Route("admin/{entity}")]
public sealed class ContentController : Controller
{
    private const string SuccessKey = "Admin:Flash";

    private readonly AdminRegistry _registry;
    private readonly IRepositoryProvider _provider;
    private readonly SiteNotifier _notifier;
    private readonly ILogger<ContentController> _logger;

    public ContentController(
        AdminRegistry registry,
        IRepositoryProvider provider,
        SiteNotifier notifier,
        ILogger<ContentController> logger)
    {
        _registry = registry;
        _provider = provider;
        _notifier = notifier;
        _logger = logger;
    }

    [HttpGet("")]
    [HttpGet("index")]
    public async Task<IActionResult> Index(string entity, [FromQuery] string? q, CancellationToken cancellationToken)
    {
        var definition = Resolve(entity);
        if (definition is null)
        {
            return NotFound();
        }

        var gateway = Gateway(definition);
        var rows = await gateway.ListAsync(cancellationToken);

        if (!string.IsNullOrWhiteSpace(q))
        {
            var needle = EntityValue.NormalizeDigits(q);
            rows = rows
                .Where(row => EntityValue.GetText(row, definition.SearchProperty)
                    .Contains(needle, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        var model = new AdminIndexModel
        {
            RouteName = definition.RouteName,
            TitleFa = definition.TitleFa,
            SingularFa = definition.SingularFa,
            Icon = definition.Icon,
            Searchable = definition.Searchable,
            Columns = definition.Columns.ToList(),
            Rows = rows.Select(row => new AdminRowModel
            {
                Id = ParseId(EntityValue.GetText(row, "Id")),
                Cells = definition.Columns
                    .Select(column => new AdminCellModel
                    {
                        Label = column.Label,
                        Value = RenderCell(row, column),
                        IsImage = column.IsImage,
                        IsBool = column.IsBool,
                    })
                    .ToList(),
                Title = EntityValue.GetText(row, definition.SearchProperty),
                IsPublished = EntityValue.GetText(row, "IsPublished") == "true",
            }).ToList(),
        };

        return View("~/Areas/Admin/Views/Content/Index.cshtml", model);
    }

    private static Guid ParseId(string? value) => Guid.TryParse(value, out var id) ? id : Guid.Empty;

    /// <summary>JSON list used by the panel DataTables (kept for AdminServices.js).</summary>
    [HttpGet("GetList")]
    public async Task<IActionResult> GetList(string entity, CancellationToken cancellationToken)
    {
        var definition = Resolve(entity);
        if (definition is null)
        {
            return NotFound();
        }

        var rows = await Gateway(definition).ListAsync(cancellationToken);
        var payload = rows.Select(row => new
        {
            id = EntityValue.GetText(row, "Id"),
            title = EntityValue.GetText(row, definition.SearchProperty),
            sortOrder = EntityValue.GetText(row, "SortOrder"),
            published = EntityValue.GetText(row, "IsPublished") == "true",
            updated = EntityValue.GetText(row, "UpdatedAtUtc"),
        }).ToList();

        return Ok(new { success = true, data = payload });
    }

    [HttpGet("create")]
    public IActionResult Create(string entity)
    {
        var definition = Resolve(entity);
        if (definition is null)
        {
            return NotFound();
        }

        return RenderForm(definition, Gateway(definition).Create(), null);
    }

    [HttpGet("{id:guid}/edit")]
    public async Task<IActionResult> Edit(string entity, Guid id, CancellationToken cancellationToken)
    {
        var definition = Resolve(entity);
        if (definition is null)
        {
            return NotFound();
        }

        var row = await Gateway(definition).FindAsync(id, cancellationToken);
        if (row is null)
        {
            return NotFound();
        }

        return RenderForm(definition, row, id);
    }

    [HttpPost("save")]
    [ValidateAntiForgeryToken]
    [RequestFormLimits(MultipartBodyLengthLimit = 10L * 1024 * 1024)]
    public async Task<IActionResult> Save(string entity, [FromForm] Guid? id, CancellationToken cancellationToken)
    {
        var definition = Resolve(entity);
        if (definition is null)
        {
            return NotFound();
        }

        var gateway = Gateway(definition);

        object row;
        if (id is { } existingId && existingId != Guid.Empty)
        {
            row = await gateway.FindAsync(existingId, cancellationToken) ?? gateway.Create();
        }
        else
        {
            row = gateway.Create();
        }

        var errors = AdminFormBinder.Bind(definition.Fields, row, Request.Form);

        // Auto-slug: keeps URLs clean without an extra click in the panel.
        if (definition.SlugTarget is not null && definition.SlugSource is not null
            && string.IsNullOrWhiteSpace(EntityValue.GetText(row, definition.SlugTarget)))
        {
            var source = EntityValue.GetText(row, definition.SlugSource);
            EntityValue.Set(row, definition.SlugTarget, Slugifier.Slugify(source), AdminFieldKind.Code, out _);
        }

        if (errors.Count > 0)
        {
            foreach (var error in errors)
            {
                ModelState.AddModelError(string.Empty, error);
            }

            return RenderForm(definition, row, id);
        }

        await gateway.SaveAsync(row, cancellationToken);
        await _notifier.RevalidateAsync(definition.RevalidateTags, cancellationToken);

        TempData[SuccessKey] = $"{definition.SingularFa} با موفقیت ذخیره شد.";

        if (Request.Form["saveAndClose"] == "1")
        {
            return RedirectToAction(nameof(Index), new { entity });
        }

        var savedId = EntityValue.GetText(row, "Id");
        return RedirectToAction(nameof(Edit), new { entity, id = savedId });
    }

    [HttpPost("{id:guid}/delete")]
    [HttpPost("Delete/{id:guid}")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(string entity, Guid id, CancellationToken cancellationToken)
    {
        var definition = Resolve(entity);
        if (definition is null)
        {
            return NotFound();
        }

        await Gateway(definition).DeleteAsync(id, cancellationToken);
        await _notifier.RevalidateAsync(definition.RevalidateTags, cancellationToken);
        TempData[SuccessKey] = $"{definition.SingularFa} حذف شد.";

        return RedirectToAction(nameof(Index), new { entity });
    }

    [HttpPost("{id:guid}/toggle")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Toggle(string entity, Guid id, CancellationToken cancellationToken)
    {
        var definition = Resolve(entity);
        if (definition is null)
        {
            return NotFound();
        }

        await Gateway(definition).TogglePublishAsync(id, cancellationToken);
        await _notifier.RevalidateAsync(definition.RevalidateTags, cancellationToken);

        return RedirectToAction(nameof(Index), new { entity });
    }

    [HttpPost("{id:guid}/move")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Move(string entity, Guid id, [FromQuery] string direction, CancellationToken cancellationToken)
    {
        var definition = Resolve(entity);
        if (definition is null)
        {
            return NotFound();
        }

        await Gateway(definition).MoveAsync(id, direction != "down", cancellationToken);
        await _notifier.RevalidateAsync(definition.RevalidateTags, cancellationToken);

        return RedirectToAction(nameof(Index), new { entity });
    }

    // ───────────────────────────────── helpers ─────────────────────────────────
    private AdminEntityDefinition? Resolve(string entity) => _registry.Find(entity);

    private IEntityGateway Gateway(AdminEntityDefinition definition) => definition.Gateway(HttpContext.RequestServices);

    private static string RenderCell(object row, AdminColumnSpec column)
    {
        var text = EntityValue.GetText(row, column.Property);
        return column.MaxWidth > 0 && text.Length > column.MaxWidth ? text[..column.MaxWidth] + "…" : text;
    }

    private IActionResult RenderForm(AdminEntityDefinition definition, object row, Guid? id)
    {
        var model = AdminFormBinder.Build(
            definition.RouteName,
            $"{definition.SingularFa} — {(id is null ? "افزودن" : "ویرایش")}",
            id is null,
            id,
            definition.Fields,
            row,
            field => ResolveOptions(field));

        return View("~/Areas/Admin/Views/Content/Form.cshtml", model);
    }

    private List<AdminOption> ResolveOptions(AdminFieldSpec field)
    {
        var options = new List<AdminOption> { new(string.Empty, "— انتخاب نکنید —") };

        switch (field.OptionsKey)
        {
            case "portfolio-categories":
                options.AddRange(_provider.For<PortfolioCategory>().Query()
                    .Where(category => category.IsPublished)
                    .OrderBy(category => category.SortOrder)
                    .AsEnumerable()
                    .Select(category => new AdminOption(category.Slug, $"{category.NameFa} ({category.NameEn})")));
                break;
            case "store-template-category":
                options.Add(new AdminOption("warehouse", "با انبارداری (warehouse)"));
                options.Add(new AdminOption("light", "بدون انبارداری (light)"));
                break;
            case "download-variant":
                options.Add(new AdminOption("bazaar", "سبک بازار (سبز)"));
                options.Add(new AdminOption("direct", "سبک مستقیم (سرمه‌ای)"));
                options.Add(new AdminOption("anchor", "سبک طلایی (لنگر)"));
                break;
            case "change-frequency":
                options.Add(new AdminOption("daily", "daily"));
                options.Add(new AdminOption("weekly", "weekly"));
                options.Add(new AdminOption("monthly", "monthly"));
                options.Add(new AdminOption("yearly", "yearly"));
                break;
        }

        return options;
    }
}
