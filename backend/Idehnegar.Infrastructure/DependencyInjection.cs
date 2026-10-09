using Idehnegar.Core.Repositories;
using Idehnegar.Infrastructure.Persistence;
using Idehnegar.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Idehnegar.Infrastructure;

public static class DependencyInjection
{
    /// <summary>
    /// Registers the SQL Server context (dbo schema), the generic repository and
    /// the migration/seed pipeline.
    /// </summary>
    public static IServiceCollection AddIdehnegarInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("IdehnegarDb")
            ?? throw new InvalidOperationException(
                "ConnectionStrings:IdehnegarDb is not configured. Add the SQL Server connection string to appsettings.Development.json.");

        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseSqlServer(connectionString, sql =>
            {
                // The initializer wraps its work in an execution strategy, so the
                // transient-fault retry is enabled explicitly here.
                sql.EnableRetryOnFailure();
                sql.MigrationsHistoryTable("__EFMigrationsHistory", "dbo");
            });
        });

        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IRepositoryProvider, RepositoryProvider>();

        return services;
    }

    /// <summary>Runs migrations (or creates the schema) and seeds the content.</summary>
    public static Task InitializeDatabaseAsync(this IServiceProvider services, ILogger logger, CancellationToken cancellationToken = default)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        return DbInitializer.InitializeAsync(db, logger, cancellationToken);
    }
}
