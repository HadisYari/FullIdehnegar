using System.Linq.Expressions;
using Idehnegar.Core.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace Idehnegar.Infrastructure.Repositories;

/// <summary>
/// Resolves the generic repository for any entity on demand. This is what keeps
/// the API and the admin panel free of per-entity service classes.
/// </summary>
public interface IRepositoryProvider
{
    IGenericRepository<TEntity> For<TEntity>() where TEntity : class;
}

public sealed class RepositoryProvider : IRepositoryProvider
{
    private readonly IServiceProvider _services;

    public RepositoryProvider(IServiceProvider services)
    {
        _services = services;
    }

    public IGenericRepository<TEntity> For<TEntity>() where TEntity : class =>
        _services.GetRequiredService<IGenericRepository<TEntity>>();
}

/// <summary>Convenience extensions shared by the public API controllers.</summary>
public static class RepositoryExtensions
{
    public static IQueryable<T> Published<T>(this IQueryable<T> source) where T : Idehnegar.Core.Entities.ContentEntity =>
        source.Where(entity => entity.IsPublished);

    public static IQueryable<T> Ordered<T>(this IQueryable<T> source) where T : Idehnegar.Core.Entities.ContentEntity =>
        source.OrderBy(entity => entity.SortOrder).ThenBy(entity => entity.Id);
}
