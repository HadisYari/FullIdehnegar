using EndPoints.Areas.Admin.Models;
using EndPoints.Infrastructure;
using Idehnegar.Core.Entities;
using Idehnegar.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EndPoints.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Policy = AdminPolicies.Panel)]
[Route("admin")]
public sealed class DashboardController : Controller
{
    private readonly IRepositoryProvider _provider;

    public DashboardController(IRepositoryProvider provider)
    {
        _provider = provider;
    }

    [HttpGet("")]
    [HttpGet("dashboard")]
    public async Task<IActionResult> Index(CancellationToken cancellationToken)
    {
        var projects = await _provider.For<PortfolioProject>().GetAllAsync(cancellationToken);
        var services = await _provider.For<Service>().CountAsync(cancellationToken);
        var testimonials = await _provider.For<Testimonial>().CountAsync(cancellationToken);
        var clients = await _provider.For<Client>().CountAsync(cancellationToken);
        var messages = await _provider.For<ContactMessage>().Query()
            .OrderByDescending(message => message.CreatedAtUtc)
            .Take(6)
            .ToListAsync(cancellationToken);
        var unread = await _provider.For<ContactMessage>().Query()
            .CountAsync(message => !message.IsArchived, cancellationToken);
        var pendingOrders = await _provider.For<StoreOrder>().Query()
            .CountAsync(order => order.Status == "pending", cancellationToken);

        var model = new AdminDashboardModel
        {
            Projects = projects.Count,
            DraftProjects = projects.Count(project => !project.IsPublished),
            Services = services,
            Testimonials = testimonials,
            Clients = clients,
            UnreadMessages = unread,
            PendingOrders = pendingOrders,
            LastContentUpdateUtc = projects
                .Select(project => project.UpdatedAtUtc ?? project.CreatedAtUtc)
                .DefaultIfEmpty()
                .Max(),
            LatestMessages = messages.Select(message => new AdminMessagePreview
            {
                Id = message.Id,
                Name = message.Name,
                Subject = string.IsNullOrWhiteSpace(message.Subject) ? "بدون موضوع" : message.Subject,
                CreatedAtUtc = message.CreatedAtUtc,
                IsArchived = message.IsArchived,
            }).ToList(),
        };

        return View(model);
    }
}
