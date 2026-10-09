using System.Reflection;
using System.Text.Json;
using Idehnegar.Core.Entities;
using Idehnegar.Core.Json;

namespace Idehnegar.Infrastructure.Persistence;

/// <summary>
/// The initial content of every table. It is generated from the front end data
/// files (see <c>backend/tools/generate-seed.mjs</c>) and shipped as an
/// embedded resource so the database is usable the first time it is created.
/// </summary>
public sealed class SeedDataset
{
    public List<SiteSetting> SiteSettings { get; set; } = new();
    public List<PageMeta> PageMetas { get; set; } = new();
    public List<PortfolioCategory> PortfolioCategories { get; set; } = new();
    public List<PortfolioProject> PortfolioProjects { get; set; } = new();
    public List<Service> Services { get; set; } = new();
    public List<ProcessStep> ProcessSteps { get; set; } = new();
    public List<Client> Clients { get; set; } = new();
    public List<Testimonial> Testimonials { get; set; } = new();
    public List<Milestone> Milestones { get; set; } = new();
    public List<TeamDiscipline> TeamDisciplines { get; set; } = new();
    public List<FaqItem> FaqItems { get; set; } = new();
    public List<InquiryType> InquiryTypes { get; set; } = new();
    public List<StoreTemplate> StoreTemplates { get; set; } = new();
    public List<StorePlan> StorePlans { get; set; } = new();
    public List<AppDownloadLink> AppDownloadLinks { get; set; } = new();

    public static SeedDataset Load()
    {
        var assembly = typeof(SeedDataset).Assembly;
        var resourceName = assembly.GetManifestResourceNames()
            .FirstOrDefault(name => name.EndsWith("SeedData.seed.json", StringComparison.OrdinalIgnoreCase));

        if (resourceName is null)
        {
            return new SeedDataset();
        }

        using var stream = assembly.GetManifestResourceStream(resourceName);
        if (stream is null)
        {
            return new SeedDataset();
        }

        using var reader = new StreamReader(stream);
        var json = reader.ReadToEnd();
        return JsonSerializer.Deserialize<SeedDataset>(json, JsonList.Options) ?? new SeedDataset();
    }
}
