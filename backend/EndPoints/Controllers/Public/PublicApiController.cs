using Idehnegar.Core.Contracts;
using Idehnegar.Core.Entities;
using Idehnegar.Core.Repositories;
using Idehnegar.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EndPoints.Infrastructure;

namespace EndPoints.Controllers.Public;

/// <summary>
/// Base class of the read-only endpoints the Next.js front end consumes.
/// Everything goes through the generic repository — there is no per-entity
/// service layer to maintain.
/// </summary>
public abstract class PublicApiControllerBase : ControllerBase
{
    private readonly IRepositoryProvider _provider;

    protected PublicApiControllerBase(IRepositoryProvider provider)
    {
        _provider = provider;
    }

    protected IGenericRepository<T> Repo<T>() where T : class => _provider.For<T>();
}

/// <summary>Company facts, page SEO records and the combined bootstrap payload.</summary>
[ApiController]
[Route("api/public")]
[Produces("application/json")]
[PublicCache]
public sealed class SiteApiController : PublicApiControllerBase
{
    public SiteApiController(IRepositoryProvider provider)
        : base(provider)
    {
    }

    /// <summary>Replaces <c>src/lib/site-config.ts</c>.</summary>
    [HttpGet("settings")]
    [ProducesResponseType(typeof(SiteSettingsDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<SiteSettingsDto>> Settings(CancellationToken cancellationToken)
    {
        var setting = await Repo<SiteSetting>().Query().FirstOrDefaultAsync(cancellationToken);
        return setting is null ? new SiteSettingsDto() : setting.ToSettingsDto();
    }

    /// <summary>All published page meta records keyed by route.</summary>
    [HttpGet("pages")]
    public async Task<ActionResult<IReadOnlyDictionary<string, PageMetaDto>>> Pages(CancellationToken cancellationToken)
    {
        var pages = await Repo<PageMeta>().Query()
            .Where(page => page.IsPublished)
            .OrderBy(page => page.SortOrder)
            .ToListAsync(cancellationToken);

        var map = new Dictionary<string, PageMetaDto>(StringComparer.OrdinalIgnoreCase);
        foreach (var page in pages)
        {
            map[page.PageKey] = page.ToDto();
        }

        return map;
    }

    [HttpGet("pages/{key}")]
    public async Task<ActionResult<PageMetaDto>> Page(string key, CancellationToken cancellationToken)
    {
        var page = await Repo<PageMeta>().Query()
            .FirstOrDefaultAsync(item => item.IsPublished && item.PageKey == key, cancellationToken);

        if (page is null)
        {
            return NotFound();
        }

        return page.ToDto();
    }

    /// <summary>
    /// One request for the whole site shell + home sections. The front end uses
    /// it for the layout, while the section endpoints below stay available for
    /// page level fetching and ISR tag revalidation.
    /// </summary>
    [HttpGet("bootstrap")]
    public async Task<ActionResult<SiteBootstrapDto>> Bootstrap([FromQuery] int featuredTake = 8, CancellationToken cancellationToken = default)
    {
        var settings = await Repo<SiteSetting>().Query().FirstOrDefaultAsync(cancellationToken);
        var pages = await Repo<PageMeta>().Query()
            .Where(page => page.IsPublished)
            .OrderBy(page => page.SortOrder)
            .ToListAsync(cancellationToken);
        var categories = await Repo<PortfolioCategory>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var projects = await Repo<PortfolioProject>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var services = await Repo<Service>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var homeServiceCards = await Repo<HomeServiceCard>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var steps = await Repo<ProcessStep>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var clients = await Repo<Client>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var testimonials = await Repo<Testimonial>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var milestones = await Repo<Milestone>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var team = await Repo<TeamDiscipline>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var faqs = await Repo<FaqItem>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var inquiryTypes = await Repo<InquiryType>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var templates = await Repo<StoreTemplate>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var plans = await Repo<StorePlan>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var downloads = await Repo<AppDownloadLink>().Query().Published().Ordered().ToListAsync(cancellationToken);

        var take = Math.Clamp(featuredTake, 1, 24);
        var featured = projects.Where(project => project.Featured).Concat(projects).Take(take).ToList();

        var pageMap = new Dictionary<string, PageMetaDto>(StringComparer.OrdinalIgnoreCase);
        foreach (var page in pages)
        {
            pageMap[page.PageKey] = page.ToDto();
        }

        return new SiteBootstrapDto
        {
            Settings = settings is null ? new SiteSettingsDto() : settings.ToSettingsDto(),
            Pages = pageMap,
            Categories = categories.Select(category => category.ToDto()).ToList(),
            FeaturedProjects = featured.Select(project => project.ToDto()).ToList(),
            Services = services.Select(service => service.ToDto()).ToList(),
            HomeServiceCards = homeServiceCards.Select(card => card.ToDto()).ToList(),
            ProcessSteps = steps.Select(step => step.ToDto()).ToList(),
            Clients = clients.Select(client => client.ToDto()).ToList(),
            Testimonials = testimonials.Select(testimonial => testimonial.ToDto()).ToList(),
            Milestones = milestones.Select(milestone => milestone.ToDto()).ToList(),
            Team = team.Select(member => member.ToDto()).ToList(),
            Faqs = faqs.Select(faq => faq.ToDto()).ToList(),
            InquiryTypes = inquiryTypes.Select(type => type.ToDto()).ToList(),
            StoreTemplates = templates.Select(template => template.ToDto()).ToList(),
            StorePlans = plans.Select(plan => plan.ToDto()).ToList(),
            AppDownloadLinks = downloads.Select(download => download.ToDto()).ToList(),
            GeneratedAtUtc = DateTime.UtcNow,
        };
    }

    /// <summary>Feeds <c>src/app/sitemap.ts</c> — pages plus every live project.</summary>
    [HttpGet("sitemap")]
    public async Task<ActionResult<IReadOnlyList<SitemapEntryDto>>> Sitemap(CancellationToken cancellationToken)
    {
        var pages = await Repo<PageMeta>().Query()
            .Where(page => page.IsPublished && !page.NoIndex)
            .OrderBy(page => page.SortOrder)
            .ToListAsync(cancellationToken);

        var projects = await Repo<PortfolioProject>().Query()
            .Where(project => project.IsPublished)
            .OrderBy(project => project.SortOrder)
            .ToListAsync(cancellationToken);

        var entries = pages.Select(page => page.ToSitemapEntry())
            .Concat(projects.Select(project => project.ToSitemapEntry()))
            .ToList();

        return entries;
    }

    [HttpGet("health")]
    [PublicCache(0, 0)]
    public async Task<IActionResult> Health(CancellationToken cancellationToken)
    {
        var canConnect = await Repo<PortfolioProject>().Query().AnyAsync(_ => true, cancellationToken);
        return Ok(new
        {
            status = canConnect ? "ok" : "degraded",
            database = canConnect ? "connected" : "unreachable",
            utc = DateTime.UtcNow,
        });
    }
}

/// <summary>Portfolio list, filters and the project detail page.</summary>
[ApiController]
[Route("api/public")]
[Produces("application/json")]
[PublicCache]
public sealed class PortfolioApiController : PublicApiControllerBase
{
    public PortfolioApiController(IRepositoryProvider provider)
        : base(provider)
    {
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IReadOnlyList<PortfolioCategoryDto>>> Categories(CancellationToken cancellationToken)
    {
        var categories = await Repo<PortfolioCategory>().Query().Published().Ordered().ToListAsync(cancellationToken);
        return categories.Select(category => category.ToDto()).ToList();
    }

    [HttpGet("portfolio")]
    public async Task<ActionResult<IReadOnlyList<PortfolioProjectDto>>> Projects(
        [FromQuery] string? category,
        [FromQuery] bool? featured,
        [FromQuery] int take = 0,
        CancellationToken cancellationToken = default)
    {
        var query = Repo<PortfolioProject>().Query().Published();

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(project => project.Category == category);
        }

        if (featured.HasValue)
        {
            query = query.Where(project => project.Featured == featured.Value);
        }

        var items = await query
            .OrderBy(project => project.SortOrder)
            .ThenByDescending(project => project.Year)
            .ToListAsync(cancellationToken);

        // Featured projects float to the top of the home preview, like the
        // previous file-based implementation did.
        var ordered = items.Where(project => project.Featured).Concat(items.Where(project => !project.Featured)).ToList();
        var limited = take > 0 ? ordered.Take(Math.Clamp(take, 1, 100)).ToList() : ordered;

        return limited.Select(project => project.ToDto()).ToList();
    }

    [HttpGet("portfolio/{slug}")]
    [ProducesResponseType(typeof(PortfolioProjectDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PortfolioProjectDto>> Project(string slug, CancellationToken cancellationToken)
    {
        var project = await Repo<PortfolioProject>().Query()
            .FirstOrDefaultAsync(item => item.IsPublished && item.Slug == slug, cancellationToken);

        if (project is null)
        {
            return NotFound();
        }

        return project.ToDto();
    }

    /// <summary>Related projects for the detail page (same category first).</summary>
    [HttpGet("portfolio/{slug}/related")]
    public async Task<ActionResult<IReadOnlyList<PortfolioProjectDto>>> Related(
        string slug,
        [FromQuery] int take = 3,
        CancellationToken cancellationToken = default)
    {
        var current = await Repo<PortfolioProject>().Query()
            .FirstOrDefaultAsync(item => item.Slug == slug, cancellationToken);

        var items = await Repo<PortfolioProject>().Query()
            .Published()
            .Where(project => project.Slug != slug)
            .ToListAsync(cancellationToken);

        if (current is null)
        {
            return Array.Empty<PortfolioProjectDto>();
        }

        var related = items
            .Where(project => project.Category == current.Category)
            .Concat(items.Where(project => project.Category != current.Category))
            .Take(Math.Clamp(take, 1, 12))
            .Select(project => project.ToDto())
            .ToList();

        return related;
    }
}

/// <summary>Section payloads (home, about, contact, store builder, gold app).</summary>
[ApiController]
[Route("api/public")]
[Produces("application/json")]
[PublicCache]
public sealed class SectionsApiController : PublicApiControllerBase
{
    public SectionsApiController(IRepositoryProvider provider)
        : base(provider)
    {
    }

    [HttpGet("services")]
    public async Task<ActionResult<IReadOnlyList<ServiceDto>>> Services(CancellationToken cancellationToken)
    {
        var items = await Repo<Service>().Query().Published().Ordered().ToListAsync(cancellationToken);
        return items.Select(service => service.ToDto()).ToList();
    }

    [HttpGet("home-services")]
    public async Task<ActionResult<IReadOnlyList<HomeServiceCardDto>>> HomeServices(CancellationToken cancellationToken)
    {
        var items = await Repo<HomeServiceCard>().Query().Published().Ordered().ToListAsync(cancellationToken);
        return items.Select(card => card.ToDto()).ToList();
    }

    /// <summary>Every block of the about page in one response (keeps the page to a single request).</summary>
    [HttpGet("about-content")]
    public async Task<ActionResult<AboutContentDto>> AboutContent(CancellationToken cancellationToken)
    {
        var sections = await Repo<AboutSection>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var values = await Repo<CoreValue>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var certifications = await Repo<Certification>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var lifecycle = await Repo<LifecycleStep>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var philosophy = await Repo<PhilosophyPrinciple>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var techStack = await Repo<TechStackGroup>().Query().Published().Ordered().ToListAsync(cancellationToken);
        var stats = await Repo<AboutStat>().Query().Published().Ordered().ToListAsync(cancellationToken);

        return new AboutContentDto
        {
            Sections = sections.Select(section => section.ToDto()).ToList(),
            CoreValues = values.Select(value => value.ToDto()).ToList(),
            Certifications = certifications.Select(item => item.ToDto()).ToList(),
            LifecycleSteps = lifecycle.Select(step => step.ToDto()).ToList(),
            PhilosophyPrinciples = philosophy.Select(item => item.ToDto()).ToList(),
            TechStackGroups = techStack.Select(group => group.ToDto()).ToList(),
            Stats = stats.Select(stat => stat.ToDto()).ToList(),
        };
    }

    [HttpGet("process-steps")]
    public async Task<ActionResult<IReadOnlyList<ProcessStepDto>>> ProcessSteps(CancellationToken cancellationToken)
    {
        var items = await Repo<ProcessStep>().Query().Published().Ordered().ToListAsync(cancellationToken);
        return items.Select(step => step.ToDto()).ToList();
    }

    [HttpGet("clients")]
    public async Task<ActionResult<IReadOnlyList<ClientLogoDto>>> Clients(CancellationToken cancellationToken)
    {
        var items = await Repo<Client>().Query().Published().Ordered().ToListAsync(cancellationToken);
        return items.Select(client => client.ToDto()).ToList();
    }

    [HttpGet("testimonials")]
    public async Task<ActionResult<IReadOnlyList<TestimonialDto>>> Testimonials(CancellationToken cancellationToken)
    {
        var items = await Repo<Testimonial>().Query().Published().Ordered().ToListAsync(cancellationToken);
        return items.Select(testimonial => testimonial.ToDto()).ToList();
    }

    [HttpGet("milestones")]
    public async Task<ActionResult<IReadOnlyList<MilestoneDto>>> Milestones(CancellationToken cancellationToken)
    {
        var items = await Repo<Milestone>().Query().Published().Ordered().ToListAsync(cancellationToken);
        return items.Select(milestone => milestone.ToDto()).ToList();
    }

    [HttpGet("team")]
    public async Task<ActionResult<IReadOnlyList<TeamRoleDto>>> Team(CancellationToken cancellationToken)
    {
        var items = await Repo<TeamDiscipline>().Query().Published().Ordered().ToListAsync(cancellationToken);
        return items.Select(member => member.ToDto()).ToList();
    }

    [HttpGet("faqs")]
    public async Task<ActionResult<IReadOnlyList<FaqDto>>> Faqs(CancellationToken cancellationToken)
    {
        var items = await Repo<FaqItem>().Query().Published().Ordered().ToListAsync(cancellationToken);
        return items.Select(faq => faq.ToDto()).ToList();
    }

    [HttpGet("inquiry-types")]
    public async Task<ActionResult<IReadOnlyList<InquiryTypeDto>>> InquiryTypes(CancellationToken cancellationToken)
    {
        var items = await Repo<InquiryType>().Query().Published().Ordered().ToListAsync(cancellationToken);
        return items.Select(type => type.ToDto()).ToList();
    }

    [HttpGet("store-templates")]
    public async Task<ActionResult<IReadOnlyList<StoreTemplateDto>>> StoreTemplates(
        [FromQuery] string? category,
        CancellationToken cancellationToken)
    {
        var query = Repo<StoreTemplate>().Query().Published();

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(template => template.Category == category);
        }

        var items = await query.OrderBy(template => template.SortOrder).ToListAsync(cancellationToken);
        return items.Select(template => template.ToDto()).ToList();
    }

    [HttpGet("store-plans")]
    public async Task<ActionResult<IReadOnlyList<StorePlanDto>>> StorePlans(CancellationToken cancellationToken)
    {
        var items = await Repo<StorePlan>().Query().Published().Ordered().ToListAsync(cancellationToken);
        return items.Select(plan => plan.ToDto()).ToList();
    }

    [HttpGet("app-download-links")]
    public async Task<ActionResult<IReadOnlyList<AppDownloadLinkDto>>> AppDownloadLinks(CancellationToken cancellationToken)
    {
        var items = await Repo<AppDownloadLink>().Query().Published().Ordered().ToListAsync(cancellationToken);
        return items.Select(link => link.ToDto()).ToList();
    }
}
