namespace Idehnegar.Core.Entities;

/// <summary>
/// Columns shared by every editable content row of the site.
/// Keeping them in one base class is what allows a single generic repository
/// and a single generic admin screen to serve every entity.
/// </summary>
public abstract class ContentEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>Ascending order used by the public API when listing items.</summary>
    public int SortOrder { get; set; }

    /// <summary>Unpublished rows are never returned by the public endpoints.</summary>
    public bool IsPublished { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAtUtc { get; set; }
}
