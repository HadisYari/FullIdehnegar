using Idehnegar.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
namespace Idehnegar.Infrastructure.Persistence;
/// <summary>
/// Creates the database (migrations when present, otherwise EnsureCreated) and
/// inserts the initial content extracted from the front end.
/// </summary>
public static class DbInitializer
{
    /// <summary>
    /// مایگریشن‌ها را اجرا/ساختار را می‌سازد، محتوا را seed می‌کند و در پایان
    /// مطمئن می‌شود اولین حساب مدیر در جدول <c>Users</c> وجود دارد.
    /// </summary>
    public static async Task InitializeAsync(
        AppDbContext db,
        ILogger logger,
        string? adminUsername = null,
        string? adminPassword = null,
        string? adminFullName = null)
    {
        logger.LogInformation("Database connection: {ConnectionString}", db.Database.GetConnectionString());
        // Warm-up: the very first connection at process start can be slow (instance
        // wake-up, SSPI handshake, …). A single slow attempt must not abort everything.
        for (var attempt = 1; attempt <= 3; attempt++)
        {
            try
            {
                await db.Database.OpenConnectionAsync();
                db.Database.CloseConnection();
                break;
            }
            catch (Exception probeException)
            {
                logger.LogWarning(probeException, "Database connection attempt {Attempt} of 3 failed.", attempt);
                if (attempt < 3)
                {
                    await Task.Delay(TimeSpan.FromSeconds(3));
                }
            }
        }
        var strategy = db.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            // Best-effort schema step. MigrateAsync/EnsureCreated start with an existence
            // check that opens a separate connection to `master`; when that hop fails the
            // actual database is often still perfectly usable — so a failure here must not
            // prevent the content seeding below.
            try
            {
                if (db.Database.GetMigrations().Any())
                {
                    logger.LogInformation("Applying EF Core migrations…");
                    await db.Database.MigrateAsync();
                }
                else
                {
                    logger.LogInformation("No migrations found — creating the schema with EnsureCreated.");
                    await db.Database.EnsureCreatedAsync();
                }
            }
            catch (Exception migrateException)
            {
                logger.LogError(migrateException,
                    "Migration/ensure-created step failed (its existence check connects to 'master'); continuing with content seeding on the existing schema.");
            }
            await SeedAsync(db, logger);

            // جدول کاربران پنل: اولین مدیر از configuration ساخته می‌شود تا
            // دسترسی به پنل پس از خالی‌شدن/ساخت دیتابیس از دست نرود.
            await EnsureDefaultAdminAsync(db, adminUsername, adminPassword, adminFullName, logger);
        });
    }

    /// <summary>
    /// اگر جدول <c>Users</c> خالی باشد، یک حساب مدیر با نقش
    /// <see cref="UserRoles.Administrator"/> می‌سازد. مقادیر خالی نادیده گرفته
    /// می‌شوند و خطا فقط لاگ می‌شود (استارت برنامه هرگز به‌خاطر آن متوقف نمی‌شود).
    /// </summary>
    public static async Task EnsureDefaultAdminAsync(
        AppDbContext db,
        string? username,
        string? password,
        string? fullName,
        ILogger logger)
    {
        try
        {
            if (await db.Users.AnyAsync())
            {
                logger.LogInformation("Users: already has rows — skipping the default administrator seed.");
                return;
            }

            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            {
                logger.LogWarning(
                    "Users is empty and Admin:DefaultUsername / Admin:DefaultPassword are not configured — no one can sign in to the panel yet.");
                return;
            }

            var name = string.IsNullOrWhiteSpace(fullName) ? username.Trim() : fullName.Trim();

            db.Users.Add(new User
            {
                Username = username.Trim(),
                // مطابق خواستهٔ پروژه، رمز به‌صورت متن ساده ذخیره می‌شود.
                Password = password,
                FullName = name,
                Role = UserRoles.Administrator,
                IsPublished = true,
                CreatedAtUtc = DateTime.UtcNow,
            });

            await db.SaveChangesAsync();
            logger.LogInformation(
                "Users: default administrator '{Username}' was created (the table was empty).", username.Trim());
        }
        catch (Exception exception)
        {
            logger.LogWarning(exception, "Users: the default administrator account could not be ensured.");
        }
    }
    private static async Task SeedAsync(AppDbContext db, ILogger logger)
    {
        var data = SeedDataset.Load();
        if (data.SiteSettings.Count == 0 && data.PageMetas.Count == 0)
        {
            logger.LogWarning("Seed file is missing or empty — the database was created without content.");
            return;
        }
        // Every table is seeded on its own when empty, so partially filled databases
        // (manual edits through the admin panel, older releases, interrupted runs)
        // still receive whatever they are missing.
        await SeedTableIfEmptyAsync(db, db.SiteSettings, data.SiteSettings, logger);
        await SeedTableIfEmptyAsync(db, db.PageMetas, data.PageMetas, logger);
        await SeedTableIfEmptyAsync(db, db.PortfolioCategories, data.PortfolioCategories, logger);
        await SeedTableIfEmptyAsync(db, db.PortfolioProjects, data.PortfolioProjects, logger);
        await SeedTableIfEmptyAsync(db, db.Services, data.Services, logger);
        await SeedTableIfEmptyAsync(db, db.HomeServiceCards, data.HomeServiceCards, logger);
        await SeedTableIfEmptyAsync(db, db.ProcessSteps, data.ProcessSteps, logger);
        await SeedTableIfEmptyAsync(db, db.Clients, data.Clients, logger);
        await SeedTableIfEmptyAsync(db, db.Testimonials, data.Testimonials, logger);
        await SeedTableIfEmptyAsync(db, db.Milestones, data.Milestones, logger);
        await SeedTableIfEmptyAsync(db, db.TeamDisciplines, data.TeamDisciplines, logger);
        await SeedTableIfEmptyAsync(db, db.FaqItems, data.FaqItems, logger);
        await SeedTableIfEmptyAsync(db, db.InquiryTypes, data.InquiryTypes, logger);
        await SeedTableIfEmptyAsync(db, db.StoreTemplates, data.StoreTemplates, logger);
        await SeedTableIfEmptyAsync(db, db.AppDownloadLinks, data.AppDownloadLinks, logger);
        await SeedTableIfEmptyAsync(db, db.AboutSections, data.AboutSections, logger);
        await SeedTableIfEmptyAsync(db, db.CoreValues, data.CoreValues, logger);
        await SeedTableIfEmptyAsync(db, db.Certifications, data.Certifications, logger);
        await SeedTableIfEmptyAsync(db, db.LifecycleSteps, data.LifecycleSteps, logger);
        await SeedTableIfEmptyAsync(db, db.PhilosophyPrinciples, data.PhilosophyPrinciples, logger);
        await SeedTableIfEmptyAsync(db, db.TechStackGroups, data.TechStackGroups, logger);
        await SeedTableIfEmptyAsync(db, db.AboutStats, data.AboutStats, logger);
        await SeedTableIfEmptyAsync(db, db.PageSections, data.PageSections, logger);
        logger.LogInformation(
            "Seeded {Projects} projects, {Pages} pages and {Services} services from the front-end content.",
            data.PortfolioProjects.Count,
            data.PageMetas.Count,
            data.Services.Count);
    }
    private static async Task SeedTableIfEmptyAsync<TEntity>(
        AppDbContext db,
        DbSet<TEntity> table,
        List<TEntity> rows,
        ILogger logger
        )
        where TEntity : class
    {
        if (rows.Count == 0)
        {
            return;
        }
        if (await table.AnyAsync())
        {
            logger.LogInformation("{Table}: already has rows — skipping seed.", typeof(TEntity).Name);
            return;
        }
        table.AddRange(rows);
        await db.SaveChangesAsync();
        logger.LogInformation("{Table}: seeded {Count} rows.", typeof(TEntity).Name, rows.Count);
    }

    /// <summary>Runs migrations (or creates the schema) and seeds the content.</summary>
  
}

