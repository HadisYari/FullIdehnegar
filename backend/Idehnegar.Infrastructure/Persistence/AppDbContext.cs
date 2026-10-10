using Idehnegar.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Idehnegar.Infrastructure.Persistence;

/// <summary>
/// SQL Server context for the idea-negar corporate site. Every table lives in
/// the <c>dbo</c> schema and is named after the entity it stores.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    /// <summary>Company facts behind site-config (single row).</summary>
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();

    /// <summary>Per-route SEO metadata + hero copy.</summary>
    public DbSet<PageMeta> PageMetas => Set<PageMeta>();

    public DbSet<PortfolioCategory> PortfolioCategories => Set<PortfolioCategory>();

    public DbSet<PortfolioProject> PortfolioProjects => Set<PortfolioProject>();

    public DbSet<Service> Services => Set<Service>();
    /// <summary>Cards of the home services grid (separate from the services page).</summary>
    public DbSet<HomeServiceCard> HomeServiceCards => Set<HomeServiceCard>();
    /// <summary>About page: section copy and the item tables of its blocks.</summary>
    public DbSet<AboutSection> AboutSections => Set<AboutSection>();
    public DbSet<CoreValue> CoreValues => Set<CoreValue>();
    public DbSet<Certification> Certifications => Set<Certification>();
    public DbSet<LifecycleStep> LifecycleSteps => Set<LifecycleStep>();
    public DbSet<PhilosophyPrinciple> PhilosophyPrinciples => Set<PhilosophyPrinciple>();
    public DbSet<TechStackGroup> TechStackGroups => Set<TechStackGroup>();
    public DbSet<AboutStat> AboutStats => Set<AboutStat>();
    /// <summary>Copy and repeated items of page blocks (hero, cards, bullet lists).</summary>
    public DbSet<PageSection> PageSections => Set<PageSection>();

    public DbSet<ProcessStep> ProcessSteps => Set<ProcessStep>();

    public DbSet<Client> Clients => Set<Client>();

    public DbSet<Testimonial> Testimonials => Set<Testimonial>();

    public DbSet<Milestone> Milestones => Set<Milestone>();

    public DbSet<TeamDiscipline> TeamDisciplines => Set<TeamDiscipline>();

    public DbSet<FaqItem> FaqItems => Set<FaqItem>();

    public DbSet<InquiryType> InquiryTypes => Set<InquiryType>();

    public DbSet<StoreTemplate> StoreTemplates => Set<StoreTemplate>();

    public DbSet<StorePlan> StorePlans => Set<StorePlan>();

    public DbSet<AppDownloadLink> AppDownloadLinks => Set<AppDownloadLink>();

    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();

    public DbSet<StoreOrder> StoreOrders => Set<StoreOrder>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // All tables, indexes and constraints are created in the default dbo schema.
        modelBuilder.HasDefaultSchema("dbo");

        ModelConfig.Apply(modelBuilder);
    }
}
