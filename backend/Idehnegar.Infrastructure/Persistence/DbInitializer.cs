using Idehnegar.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Idehnegar.Infrastructure.Persistence;

/// <summary>
/// Creates the database (migrations when present, otherwise EnsureCreated) and
/// inserts the initial content extracted from the front end.
/// </summary>
public static class DbInitializer
{
    public static async Task InitializeAsync(AppDbContext db, ILogger logger, CancellationToken cancellationToken = default)
    {
        var strategy = db.Database.CreateExecutionStrategy();

        await strategy.ExecuteAsync(async () =>
        {
            if (db.Database.GetMigrations().Any())
            {
                logger.LogInformation("Applying EF Core migrations…");
                await db.Database.MigrateAsync(cancellationToken);
            }
            else
            {
                logger.LogInformation("No migrations found — creating the schema with EnsureCreated.");
                await db.Database.EnsureCreatedAsync(cancellationToken);
            }

            await SeedAsync(db, logger, cancellationToken);
        });
    }

    private static async Task SeedAsync(AppDbContext db, ILogger logger, CancellationToken cancellationToken)
    {
        var data = SeedDataset.Load();

        // Tables added after the first release are seeded on their own (when empty),
        // so databases that already hold the rest of the content still receive them.
        if (!await db.HomeServiceCards.AnyAsync(cancellationToken) && data.HomeServiceCards.Count > 0)
        {
            db.HomeServiceCards.AddRange(data.HomeServiceCards);
            await db.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Seeded {Count} home service cards.", data.HomeServiceCards.Count);
        }

        if (await db.SiteSettings.AnyAsync(cancellationToken))
        {
            return;
        }
        if (data.SiteSettings.Count == 0)
        {
            logger.LogWarning("Seed file is missing or empty — the database was created without content.");
            return;
        }

        db.SiteSettings.AddRange(data.SiteSettings);
        db.PageMetas.AddRange(data.PageMetas);
        db.PortfolioCategories.AddRange(data.PortfolioCategories);
        db.PortfolioProjects.AddRange(data.PortfolioProjects);
        db.Services.AddRange(data.Services);
        db.ProcessSteps.AddRange(data.ProcessSteps);
        db.Clients.AddRange(data.Clients);
        db.Testimonials.AddRange(data.Testimonials);
        db.Milestones.AddRange(data.Milestones);
        db.TeamDisciplines.AddRange(data.TeamDisciplines);
        db.FaqItems.AddRange(data.FaqItems);
        db.InquiryTypes.AddRange(data.InquiryTypes);
        db.StoreTemplates.AddRange(data.StoreTemplates);
        db.StorePlans.AddRange(data.StorePlans);
        db.AppDownloadLinks.AddRange(data.AppDownloadLinks);

        await db.SaveChangesAsync(cancellationToken);

        logger.LogInformation(
            "Seeded {Projects} projects, {Pages} pages and {Services} services from the front-end content.",
            data.PortfolioProjects.Count,
            data.PageMetas.Count,
            data.Services.Count);
    }
}
