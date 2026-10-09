using System.Linq.Expressions;

namespace EndPoints.Core.Abstractions;

/// <summary>
/// Shared data access contract for the small CMS. Business-specific services
/// are intentionally avoided where one generic operation is sufficient.
/// </summary>
public interface IGenericService<TEntity> where TEntity : class
{
    IQueryable<TEntity> Query(bool asNoTracking = true);
    Task<TEntity?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);
    Task AddAsync(TEntity entity, CancellationToken cancellationToken = default);
    void Update(TEntity entity);
    void Remove(TEntity entity);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
