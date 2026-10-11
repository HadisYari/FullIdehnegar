using EndPoints.Areas.Admin.Models;
using EndPoints.Infrastructure;
using Idehnegar.Core.Entities;
using Idehnegar.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EndPoints.Areas.Admin.Controllers;

/// <summary>
/// Read-side of the public contact form: messages are curated here (archive,
/// delete) instead of being edited by hand.
/// </summary>
[Area("Admin")]
[Authorize(Policy = AdminPolicies.Panel)]
[Route("admin/inbox")]
public sealed class InboxController : Controller
{
    private readonly IRepositoryProvider _provider;
    private readonly SiteNotifier _notifier;

    public InboxController(IRepositoryProvider provider, SiteNotifier notifier)
    {
        _provider = provider;
        _notifier = notifier;
    }

    [HttpGet("messages")]
    public async Task<IActionResult> Messages([FromQuery] bool archived = false, [FromQuery] string? q = null, CancellationToken cancellationToken = default)
    {
        var query = _provider.For<ContactMessage>().Query().Where(message => message.IsArchived == archived);

        if (!string.IsNullOrWhiteSpace(q))
        {
            var needle = q.Trim();
            query = query.Where(message => message.Name.Contains(needle) || message.Email.Contains(needle) || message.Subject!.Contains(needle));
        }

        var items = await query
            .OrderByDescending(message => message.CreatedAtUtc)
            .Take(200)
            .ToListAsync(cancellationToken);

        ViewData["Kind"] = "messages";
        ViewData["Archived"] = archived;
        ViewData["Query"] = q;
        return View("Index", items.Select(message => new AdminInboxModel
        {
            Id = message.Id,
            Title = message.Name,
            Subtitle = $"{message.Email} · {message.Phone}{(string.IsNullOrWhiteSpace(message.Subject) ? string.Empty : " · " + message.Subject)}",
            Body = message.Message,
            CreatedAtUtc = message.CreatedAtUtc,
            IsArchived = message.IsArchived,
            Status = message.EmailSent ? "ایمیل شد" : "ثبت شد",
        }).ToList());
    }

    [HttpPost("messages/{id:guid}/archive")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ArchiveMessage(string id, [FromQuery] bool archived = true, CancellationToken cancellationToken = default)
    {
        if (!Guid.TryParse(id, out var key))
        {
            return NotFound();
        }

        var repo = _provider.For<ContactMessage>();
        var message = await repo.FindAsync(item => item.Id == key, cancellationToken);
        if (message is null)
        {
            return NotFound();
        }

        message.IsArchived = archived;
        repo.Update(message);
        await repo.SaveChangesAsync(cancellationToken);
        return RedirectToAction(nameof(Messages), new { archived = !archived });
    }

    [HttpPost("messages/{id:guid}/delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteMessage(string id, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(id, out var key))
        {
            return NotFound();
        }

        var repo = _provider.For<ContactMessage>();
        var message = await repo.FindAsync(item => item.Id == key, cancellationToken);
        if (message is not null)
        {
            repo.Remove(message);
            await repo.SaveChangesAsync(cancellationToken);
        }

        return RedirectToAction(nameof(Messages));
    }
}
