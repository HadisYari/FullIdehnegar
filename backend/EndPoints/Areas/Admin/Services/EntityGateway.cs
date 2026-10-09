using Idehnegar.Core.Entities;
using Idehnegar.Core.Repositories;

namespace EndPoints.Areas.Admin.Services;

/// <summary>
/// Data access contract used by the generic admin screens. Every content entity
/// gets one through the generic repository, so no per-entity admin service is
/// needed.
/// </summary>
public interface IEntityGateway
{
    Type ClrType { get; }

    Task<List<object>> ListAsync(CancellationToken cancellationToken = default);

    Task<object?> FindAsync(Guid id, CancellationToken cancellationToken = default);

    object Create();

    Task SaveAsync(object entity, CancellationToken cancellationToken = default);

    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);

    Task TogglePublishAsync(Guid id, CancellationToken cancellationToken = default);

    Task MoveAsync(Guid id, bool upwards, CancellationToken cancellationToken = default);
}

public sealed class EntityGateway<TEntity> : IEntityGateway where TEntity : ContentEntity, new()
{
    private readonly IGenericRepository<TEntity> _repository;

    public EntityGateway(IGenericRepository<TEntity> repository)
    {
        _repository = repository;
    }

    public Type ClrType => typeof(TEntity);

    public async Task<List<object>> ListAsync(CancellationToken cancellationToken = default)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        return items
            .OrderBy(entity => entity.SortOrder)
            .ThenBy(entity => entity.CreatedAtUtc)
            .Select(entity => (object)entity)
            .ToList();
    }

    public async Task<object?> FindAsync(Guid id, CancellationToken cancellationToken = default) =>
        await _repository.FindAsync(entity => entity.Id == id, cancellationToken);

    public object Create() => new TEntity { Id = Guid.NewGuid(), CreatedAtUtc = DateTime.UtcNow, IsPublished = true };

    public async Task SaveAsync(object entity, CancellationToken cancellationToken = default)
    {
        var typed = (TEntity)entity;
        typed.UpdatedAtUtc = DateTime.UtcNow;

        var exists = await _repository.AnyAsync(item => item.Id == typed.Id, cancellationToken);
        if (exists)
        {
            _repository.Update(typed);
        }
        else
        {
            await _repository.AddAsync(typed, cancellationToken);
        }

        await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repository.FindAsync(item => item.Id == id, cancellationToken);
        if (entity is null)
        {
            return;
        }

        _repository.Remove(entity);
        await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task TogglePublishAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repository.FindAsync(item => item.Id == id, cancellationToken);
        if (entity is null)
        {
            return;
        }

        entity.IsPublished = !entity.IsPublished;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        _repository.Update(entity);
        await _repository.SaveChangesAsync(cancellationToken);
    }

    /// <summary>Swaps the order of two rows — the panel exposes this as ↑ / ↓.</summary>
    public async Task MoveAsync(Guid id, bool upwards, CancellationToken cancellationToken = default)
    {
        var all = await _repository.GetAllAsync(cancellationToken);
        var ordered = all
            .OrderBy(entity => entity.SortOrder)
            .ThenBy(entity => entity.Id)
            .ToList();

        var index = ordered.FindIndex(entity => entity.Id == id);
        var neighbour = upwards ? index - 1 : index + 1;

        if (index < 0 || neighbour < 0 || neighbour >= ordered.Count)
        {
            return;
        }

        (ordered[index].SortOrder, ordered[neighbour].SortOrder) = (ordered[neighbour].SortOrder, ordered[index].SortOrder);

        _repository.Update(ordered[index]);
        _repository.Update(ordered[neighbour]);
        await _repository.SaveChangesAsync(cancellationToken);
    }
}
