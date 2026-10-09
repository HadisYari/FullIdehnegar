using System.Linq.Expressions;
using Idehnegar.Core.Repositories;
using Idehnegar.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Idehnegar.Infrastructure.Repositories;

/// <summary>
/// The single repository implementation behind every content table. Reads are
/// no-tracking by default (the public API is read heavy); the admin panel opts
/// into tracked queries when it needs to edit a row.
/// </summary>
public sealed class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
{
    private readonly DbContext _db;

    public GenericRepository(AppDbContext db)
    {
        _db = db;
    }

    private DbSet<TEntity> Set => _db.Set<TEntity>();

    public IQueryable<TEntity> Query() => Set.AsNoTracking();

    public IQueryable<TEntity> QueryTracked() => Set;

    public async Task<IReadOnlyList<TEntity>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await Set.AsNoTracking().ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<TEntity>> WhereAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default) =>
        await Set.AsNoTracking().Where(predicate).ToListAsync(cancellationToken);

    public async Task<TEntity?> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default) =>
        await Set.AsNoTracking().FirstOrDefaultAsync(predicate, cancellationToken);

    public async Task<TEntity?> GetAsync(Guid id, CancellationToken cancellationToken = default) =>
        await Set.FindAsync(new object[] { id }, cancellationToken);

    public async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default) =>
        await Set.AnyAsync(predicate, cancellationToken);

    public async Task<int> CountAsync(CancellationToken cancellationToken = default) =>
        await Set.CountAsync(cancellationToken);

    public async Task AddAsync(TEntity entity, CancellationToken cancellationToken = default) =>
        await Set.AddAsync(entity, cancellationToken);

    public void Update(TEntity entity) => Set.Update(entity);

    public void Remove(TEntity entity) => Set.Remove(entity);

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        _db.SaveChangesAsync(cancellationToken);
}
