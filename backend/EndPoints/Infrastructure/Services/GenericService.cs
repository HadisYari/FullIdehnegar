using System.Linq.Expressions;
using EndPoints.Core.Abstractions;
using EndPoints.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EndPoints.Infrastructure.Services;

public sealed class GenericService<TEntity>(AppDbContext dbContext) : IGenericService<TEntity>
    where TEntity : class
{
    private readonly DbSet<TEntity> _set = dbContext.Set<TEntity>();

    public IQueryable<TEntity> Query(bool asNoTracking = true) =>
        asNoTracking ? _set.AsNoTracking() : _set;

    public Task<TEntity?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        _set.FindAsync([id], cancellationToken).AsTask();

    public Task<TEntity?> FirstOrDefaultAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default) =>
        _set.FirstOrDefaultAsync(predicate, cancellationToken);

    public Task AddAsync(TEntity entity, CancellationToken cancellationToken = default) =>
        _set.AddAsync(entity, cancellationToken).AsTask();

    public void Update(TEntity entity) => _set.Update(entity);

    public void Remove(TEntity entity) => _set.Remove(entity);

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        dbContext.SaveChangesAsync(cancellationToken);
}
