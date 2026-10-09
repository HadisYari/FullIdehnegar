using System.Linq.Expressions;

namespace Idehnegar.Core.Repositories;

/// <summary>
/// One repository for every content table. The public API and the admin panel
/// both talk to this interface, so no per-entity service classes are needed —
/// entity-specific behaviour (ordering, publishing, lookups) is expressed with
/// expressions at the call site.
/// </summary>
public interface IGenericRepository<TEntity> where TEntity : class
{
    /// <summary>Read-only queryable (no-tracking) for composable public queries.</summary>
    IQueryable<TEntity> Query();

    IQueryable<TEntity> QueryTracked();

    Task<IReadOnlyList<TEntity>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TEntity>> WhereAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default);

    Task<TEntity?> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);

    Task<TEntity?> GetAsync(Guid id, CancellationToken cancellationToken = default);

    Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);

    Task<int> CountAsync(CancellationToken cancellationToken = default);

    Task AddAsync(TEntity entity, CancellationToken cancellationToken = default);

    void Update(TEntity entity);

    void Remove(TEntity entity);

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
