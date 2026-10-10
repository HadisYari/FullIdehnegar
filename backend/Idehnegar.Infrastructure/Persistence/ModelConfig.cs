using Idehnegar.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Idehnegar.Infrastructure.Persistence;

/// <summary>
/// Explicit model configuration: table names (all in dbo), primary keys,
/// indexes for the lookups the public API performs, and the long text columns.
/// </summary>
public static class ModelConfig
{
    public static void Apply(ModelBuilder modelBuilder)
    {
        ConfigureSite(modelBuilder);
        ConfigurePortfolio(modelBuilder);
        ConfigureHome(modelBuilder);
        ConfigurePages(modelBuilder);
        ConfigureStore(modelBuilder);
        ConfigureInquiries(modelBuilder);
    }

    private static void ConfigureSite(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SiteSetting>(entity =>
        {
            entity.ToTable("SiteSettings");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Domain).HasMaxLength(120).IsRequired();
            entity.Property(e => e.SiteUrl).HasMaxLength(250).IsRequired();
            entity.Property(e => e.NameFa).HasMaxLength(200).IsRequired();
            entity.Property(e => e.NameEn).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(200).IsRequired();
            entity.Property(e => e.PhonesJson).HasColumnType("nvarchar(max)");
            entity.Property(e => e.SocialJson).HasColumnType("nvarchar(max)");
            entity.Property(e => e.StatsJson).HasColumnType("nvarchar(max)");
        });
    }

    private static void ConfigurePortfolio(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PortfolioCategory>(entity =>
        {
            entity.ToTable("PortfolioCategories");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Slug).HasMaxLength(120).IsRequired();
            entity.Property(e => e.NameFa).HasMaxLength(200).IsRequired();
            entity.Property(e => e.NameEn).HasMaxLength(200).IsRequired();
            entity.HasIndex(e => e.Slug).IsUnique().HasDatabaseName("UX_PortfolioCategories_Slug");
            entity.HasIndex(e => new { e.IsPublished, e.SortOrder }).HasDatabaseName("IX_PortfolioCategories_Published_Sort");
        });

        modelBuilder.Entity<PortfolioProject>(entity =>
        {
            entity.ToTable("PortfolioProjects");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Slug).HasMaxLength(180).IsRequired();
            entity.Property(e => e.TitleFa).HasMaxLength(300).IsRequired();
            entity.Property(e => e.SummaryFa).HasMaxLength(600).IsRequired();
            entity.Property(e => e.Category).HasMaxLength(120).IsRequired();
            entity.Property(e => e.Image).HasMaxLength(500);
            entity.Property(e => e.GalleryJson).HasColumnType("nvarchar(max)");
            entity.Property(e => e.TagsJson).HasColumnType("nvarchar(max)");
            entity.Property(e => e.FeaturesJson).HasColumnType("nvarchar(max)");
            entity.Property(e => e.StatsJson).HasColumnType("nvarchar(max)");

            // The front end routes project pages by slug, so slugs stay unique.
            entity.HasIndex(e => e.Slug).IsUnique().HasDatabaseName("UX_PortfolioProjects_Slug");
            entity.HasIndex(e => new { e.IsPublished, e.SortOrder }).HasDatabaseName("IX_PortfolioProjects_Published_Sort");
            entity.HasIndex(e => e.Category).HasDatabaseName("IX_PortfolioProjects_Category");
            entity.HasIndex(e => e.Featured).HasDatabaseName("IX_PortfolioProjects_Featured");

            // Category is kept as a soft reference (the slug string), exactly like
            // the front-end data model, so content can be imported without FK churn.
        });
    }

    private static void ConfigureHome(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<HomeServiceCard>(entity =>
        {
            entity.ToTable("HomeServiceCards");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Code).HasMaxLength(40).IsRequired();
            entity.Property(e => e.TitleFa).HasMaxLength(300).IsRequired();
            entity.Property(e => e.TitleEn).HasMaxLength(300).IsRequired();
            entity.Property(e => e.DescriptionFa).HasMaxLength(1000).IsRequired();
            entity.Property(e => e.DescriptionEn).HasMaxLength(1000).IsRequired();
            entity.Property(e => e.TagsJson).HasColumnType("nvarchar(max)");
            entity.HasIndex(e => new { e.IsPublished, e.SortOrder }).HasDatabaseName("IX_HomeServiceCards_Published_Sort");
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.ToTable("Services");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TitleFa).HasMaxLength(300).IsRequired();
            entity.Property(e => e.TitleEn).HasMaxLength(300).IsRequired();
            entity.Property(e => e.DescriptionFa).HasMaxLength(1000).IsRequired();
            entity.Property(e => e.HighlightsFaJson).HasColumnType("nvarchar(max)");
            entity.Property(e => e.HighlightsEnJson).HasColumnType("nvarchar(max)");
            entity.HasIndex(e => new { e.IsPublished, e.SortOrder }).HasDatabaseName("IX_Services_Published_Sort");
        });

        modelBuilder.Entity<ProcessStep>(entity =>
        {
            entity.ToTable("ProcessSteps");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TitleFa).HasMaxLength(300).IsRequired();
            entity.Property(e => e.TitleEn).HasMaxLength(300).IsRequired();
            entity.Property(e => e.DescriptionFa).HasMaxLength(2000).IsRequired();
            entity.Property(e => e.DeliverablesFaJson).HasColumnType("nvarchar(max)");
            entity.Property(e => e.DeliverablesEnJson).HasColumnType("nvarchar(max)");
            entity.HasIndex(e => new { e.IsPublished, e.SortOrder }).HasDatabaseName("IX_ProcessSteps_Published_Sort");
        });

        modelBuilder.Entity<Client>(entity =>
        {
            entity.ToTable("Clients");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.NameFa).HasMaxLength(300).IsRequired();
            entity.Property(e => e.NameEn).HasMaxLength(300).IsRequired();
            entity.HasIndex(e => new { e.IsPublished, e.SortOrder }).HasDatabaseName("IX_Clients_Published_Sort");
        });

        modelBuilder.Entity<Testimonial>(entity =>
        {
            entity.ToTable("Testimonials");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.NameFa).HasMaxLength(300).IsRequired();
            entity.Property(e => e.QuoteFa).HasMaxLength(2000).IsRequired();
            entity.HasIndex(e => new { e.IsPublished, e.SortOrder }).HasDatabaseName("IX_Testimonials_Published_Sort");
        });
    }

    private static void ConfigurePages(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PageMeta>(entity =>
        {
            entity.ToTable("PageMetas");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PageKey).HasMaxLength(80).IsRequired();
            entity.Property(e => e.Path).HasMaxLength(200).IsRequired();
            entity.Property(e => e.TitleFa).HasMaxLength(220).IsRequired();
            entity.Property(e => e.DescriptionFa).HasMaxLength(400).IsRequired();
            entity.Property(e => e.ChangeFrequency).HasMaxLength(20).IsRequired();
            entity.Property(e => e.Priority).HasPrecision(4, 2);
            entity.HasIndex(e => e.PageKey).IsUnique().HasDatabaseName("UX_PageMetas_PageKey");
        });

        modelBuilder.Entity<Milestone>(entity =>
        {
            entity.ToTable("Milestones");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Year).HasMaxLength(20).IsRequired();
            entity.Property(e => e.TitleFa).HasMaxLength(300).IsRequired();
            entity.HasIndex(e => new { e.IsPublished, e.SortOrder }).HasDatabaseName("IX_Milestones_Published_Sort");
        });

        modelBuilder.Entity<TeamDiscipline>(entity =>
        {
            entity.ToTable("TeamDisciplines");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.RoleEn).HasMaxLength(200).IsRequired();
            entity.Property(e => e.LabelFa).HasMaxLength(200).IsRequired();
            entity.HasIndex(e => new { e.IsPublished, e.SortOrder }).HasDatabaseName("IX_TeamDisciplines_Published_Sort");
        });

        modelBuilder.Entity<FaqItem>(entity =>
        {
            entity.ToTable("FaqItems");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.QuestionFa).HasMaxLength(500).IsRequired();
            entity.Property(e => e.AnswerFa).HasMaxLength(4000).IsRequired();
            entity.HasIndex(e => new { e.IsPublished, e.SortOrder }).HasDatabaseName("IX_FaqItems_Published_Sort");
        });

        modelBuilder.Entity<InquiryType>(entity =>
        {
            entity.ToTable("InquiryTypes");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Code).HasMaxLength(80).IsRequired();
            entity.Property(e => e.LabelFa).HasMaxLength(300).IsRequired();
            entity.HasIndex(e => e.Code).IsUnique().HasDatabaseName("UX_InquiryTypes_Code");
        });
    }

    private static void ConfigureStore(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<StoreTemplate>(entity =>
        {
            entity.ToTable("StoreTemplates");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Code).HasMaxLength(60).IsRequired();
            entity.Property(e => e.Name).HasMaxLength(300).IsRequired();
            entity.Property(e => e.Category).HasMaxLength(30).IsRequired();
            entity.Property(e => e.PlanName).HasMaxLength(300).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.PriceMonthly).HasPrecision(18, 2);
            entity.Property(e => e.PriceYearly).HasPrecision(18, 2);
            entity.Property(e => e.FeaturesJson).HasColumnType("nvarchar(max)");
            entity.Property(e => e.DesktopScreensJson).HasColumnType("nvarchar(max)");
            entity.Property(e => e.MobileScreensJson).HasColumnType("nvarchar(max)");
            entity.HasIndex(e => e.Code).IsUnique().HasDatabaseName("UX_StoreTemplates_Code");
            entity.HasIndex(e => new { e.IsPublished, e.Category, e.SortOrder }).HasDatabaseName("IX_StoreTemplates_Published_Category");
        });

        modelBuilder.Entity<StorePlan>(entity =>
        {
            entity.ToTable("StorePlans");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Code).HasMaxLength(60).IsRequired();
            entity.Property(e => e.Name).HasMaxLength(300).IsRequired();
            entity.Property(e => e.MonthlyPrice).HasPrecision(18, 2);
            entity.Property(e => e.YearlyPrice).HasPrecision(18, 2);
            entity.Property(e => e.FeaturesJson).HasColumnType("nvarchar(max)");
            entity.Property(e => e.LimitationsJson).HasColumnType("nvarchar(max)");
            entity.HasIndex(e => e.Code).IsUnique().HasDatabaseName("UX_StorePlans_Code");
        });

        modelBuilder.Entity<AppDownloadLink>(entity =>
        {
            entity.ToTable("AppDownloadLinks");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TitleFa).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Href).HasMaxLength(1000).IsRequired();
            entity.HasIndex(e => new { e.IsPublished, e.SortOrder }).HasDatabaseName("IX_AppDownloadLinks_Published_Sort");
        });
    }

    private static void ConfigureInquiries(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ContactMessage>(entity =>
        {
            entity.ToTable("ContactMessages");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Phone).HasMaxLength(60).IsRequired();
            entity.Property(e => e.Message).HasMaxLength(8000).IsRequired();
            entity.Property(e => e.Locale).HasMaxLength(10).IsRequired();
            entity.HasIndex(e => e.CreatedAtUtc).IsDescending().HasDatabaseName("IX_ContactMessages_Created");
            entity.HasIndex(e => e.IsArchived).HasDatabaseName("IX_ContactMessages_Archived");
        });

        modelBuilder.Entity<StoreOrder>(entity =>
        {
            entity.ToTable("StoreOrders");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FullName).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Mobile).HasMaxLength(60).IsRequired();
            entity.Property(e => e.BillingCycle).HasMaxLength(20).IsRequired();
            entity.Property(e => e.Gateway).HasMaxLength(30).IsRequired();
            entity.Property(e => e.Status).HasMaxLength(20).IsRequired();
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.HasIndex(e => e.CreatedAtUtc).IsDescending().HasDatabaseName("IX_StoreOrders_Created");
            entity.HasIndex(e => e.Status).HasDatabaseName("IX_StoreOrders_Status");
        });
    }
}
