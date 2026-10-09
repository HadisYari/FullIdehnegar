using EndPoints.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace EndPoints.Infrastructure.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<ContentEntry> ContentEntries => Set<ContentEntry>();
    public DbSet<ContactSubmission> ContactSubmissions => Set<ContactSubmission>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ContentEntry>(entity =>
        {
            entity.ToTable("tbl_ContentEntries", "dbo");
            entity.HasKey(x => x.Id).HasName("PK_tbl_ContentEntries");
            entity.Property(x => x.Id).UseIdentityColumn(1, 1);
            entity.Property(x => x.ContentKey).HasMaxLength(180).IsRequired();
            entity.Property(x => x.ContentType).HasMaxLength(40).IsRequired();
            entity.HasIndex(x => x.ContentKey).IsUnique().HasDatabaseName("UX_tbl_ContentEntries_ContentKey");
            entity.HasIndex(x => new { x.ContentType, x.IsPublished, x.SortOrder })
                .HasDatabaseName("IX_tbl_ContentEntries_Type_Published_Order");

            entity.Property(x => x.Slug).HasMaxLength(180);
            entity.Property(x => x.SlugFa).HasMaxLength(180);
            entity.Property(x => x.SlugEn).HasMaxLength(180);
            entity.Property(x => x.TitleFa).HasMaxLength(250);
            entity.Property(x => x.TitleEn).HasMaxLength(250);
            entity.Property(x => x.SummaryFa).HasMaxLength(1000);
            entity.Property(x => x.SummaryEn).HasMaxLength(1000);
            entity.Property(x => x.MetaTitleFa).HasMaxLength(250);
            entity.Property(x => x.MetaTitleEn).HasMaxLength(250);
            entity.Property(x => x.MetaDescriptionFa).HasMaxLength(500);
            entity.Property(x => x.MetaDescriptionEn).HasMaxLength(500);
            entity.Property(x => x.KeywordsFa).HasMaxLength(500);
            entity.Property(x => x.KeywordsEn).HasMaxLength(500);
            entity.Property(x => x.CanonicalUrlFa).HasMaxLength(512);
            entity.Property(x => x.CanonicalUrlEn).HasMaxLength(512);
            entity.Property(x => x.OpenGraphTitleFa).HasMaxLength(250);
            entity.Property(x => x.OpenGraphTitleEn).HasMaxLength(250);
            entity.Property(x => x.OpenGraphDescriptionFa).HasMaxLength(500);
            entity.Property(x => x.OpenGraphDescriptionEn).HasMaxLength(500);
            entity.Property(x => x.ImagePath).HasMaxLength(512);
            entity.Property(x => x.ImageAltFa).HasMaxLength(250);
            entity.Property(x => x.ImageAltEn).HasMaxLength(250);
            entity.Property(x => x.DataFaJson).HasColumnType("nvarchar(max)").HasDefaultValue("{}").IsRequired();
            entity.Property(x => x.DataEnJson).HasColumnType("nvarchar(max)").HasDefaultValue("{}").IsRequired();
            entity.Property(x => x.SharedJson).HasColumnType("nvarchar(max)").HasDefaultValue("{}").IsRequired();
            entity.Property(x => x.IsPublished).HasDefaultValue(true);
            entity.Property(x => x.IsFeatured).HasDefaultValue(false);
            entity.Property(x => x.CreatedAtUtc).HasColumnType("datetime2");
            entity.Property(x => x.UpdatedAtUtc).HasColumnType("datetime2");
        });

        modelBuilder.Entity<ContactSubmission>(entity =>
        {
            entity.ToTable("tbl_ContactSubmissions", "dbo");
            entity.HasKey(x => x.Id).HasName("PK_tbl_ContactSubmissions");
            entity.Property(x => x.Id).UseIdentityColumn(1, 1);
            entity.Property(x => x.Name).HasMaxLength(120).IsRequired();
            entity.Property(x => x.Email).HasMaxLength(254).IsRequired();
            entity.Property(x => x.Phone).HasMaxLength(40);
            entity.Property(x => x.Subject).HasMaxLength(200).IsRequired();
            entity.Property(x => x.Message).HasMaxLength(5000).IsRequired();
            entity.Property(x => x.Locale).HasMaxLength(2).IsUnicode(false).IsRequired();
            entity.Property(x => x.CreatedAtUtc).HasColumnType("datetime2");
            entity.Property(x => x.IsRead).HasDefaultValue(false);
            entity.HasIndex(x => new { x.IsRead, x.CreatedAtUtc })
                .HasDatabaseName("IX_tbl_ContactSubmissions_Read_Created");
        });
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        StampAuditDates();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    public override Task<int> SaveChangesAsync(
        bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default)
    {
        StampAuditDates();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    private void StampAuditDates()
    {
        var now = DateTime.UtcNow;
        foreach (var entry in ChangeTracker.Entries<ContentEntry>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAtUtc = now;
                entry.Entity.UpdatedAtUtc = null;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAtUtc = now;
                entry.Property(x => x.CreatedAtUtc).IsModified = false;
            }
        }

        foreach (var entry in ChangeTracker.Entries<ContactSubmission>())
        {
            if (entry.State == EntityState.Added && entry.Entity.CreatedAtUtc == default)
                entry.Entity.CreatedAtUtc = now;
        }
    }
}
