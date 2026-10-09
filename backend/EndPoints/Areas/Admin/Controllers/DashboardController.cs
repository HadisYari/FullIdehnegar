using EndPoints.Core.Abstractions;
using EndPoints.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EndPoints.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin")]
public sealed class DashboardController(
    IGenericService<ContentEntry> content,
    IGenericService<ContactSubmission> submissions) : Controller
{
    public async Task<IActionResult> Index(CancellationToken cancellationToken)
    {
        ViewBag.ContentCount = await content.Query().CountAsync(cancellationToken);
        ViewBag.PublishedCount = await content.Query().CountAsync(x => x.IsPublished, cancellationToken);
        ViewBag.PortfolioCount = await content.Query().CountAsync(x => x.ContentType == "portfolio", cancellationToken);
        ViewBag.UnreadMessages = await submissions.Query().CountAsync(x => !x.IsRead, cancellationToken);
        ViewBag.LatestMessages = await submissions.Query()
            .OrderByDescending(x => x.CreatedAtUtc).Take(5).ToListAsync(cancellationToken);
        return View();
    }
}
