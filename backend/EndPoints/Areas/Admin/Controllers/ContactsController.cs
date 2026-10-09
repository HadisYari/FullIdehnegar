using EndPoints.Areas.Admin.Models;
using EndPoints.Core.Abstractions;
using EndPoints.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EndPoints.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin")]
public sealed class ContactsController(IGenericService<ContactSubmission> submissions) : Controller
{
    public async Task<IActionResult> Index(CancellationToken cancellationToken)
    {
        var messages = await submissions.Query().OrderByDescending(x => x.CreatedAtUtc)
            .Take(500).ToListAsync(cancellationToken);
        return View(new ContactListViewModel(messages));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> MarkRead(int id, CancellationToken cancellationToken)
    {
        var message = await submissions.GetByIdAsync(id, cancellationToken);
        if (message is null) return NotFound();
        message.IsRead = true;
        await submissions.SaveChangesAsync(cancellationToken);
        return RedirectToAction(nameof(Index));
    }
}
