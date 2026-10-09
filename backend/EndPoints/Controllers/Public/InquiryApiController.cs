using Idehnegar.Core.Entities;
using Idehnegar.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using EndPoints.Infrastructure;

namespace EndPoints.Controllers.Public;

/// <summary>Body of POST /api/public/contact — the fields of the front-end form.</summary>
public sealed class ContactRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Subject { get; set; }
    public string Message { get; set; } = string.Empty;

    /// <summary>Project type code selected on the contact page.</summary>
    public string? InquiryType { get; set; }

    public string Locale { get; set; } = "fa";

    /// <summary>Honeypot: real users never see this field, bots always fill it.</summary>
    public string? Company { get; set; }
}

/// <summary>Body of POST /api/public/store-orders — the store-builder checkout intent.</summary>
public sealed class StoreOrderRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public string? StoreName { get; set; }
    public string? Domain { get; set; }
    public string? TemplateId { get; set; }
    public string? Plan { get; set; }
    public string Cycle { get; set; } = "yearly";
    public decimal Amount { get; set; }
    public string Gateway { get; set; } = "shaparak";
    public bool RulesAccepted { get; set; }
    public string Locale { get; set; } = "fa";
    public string? Company { get; set; }
}

/// <summary>Write endpoints of the public API (contact form + checkout intent).</summary>
[ApiController]
[Route("api/public")]
[Produces("application/json")]
public sealed class InquiryApiController : ControllerBase
{
    private readonly IRepositoryProvider _provider;
    private readonly IMailSender _mail;
    private readonly ILogger<InquiryApiController> _logger;

    public InquiryApiController(IRepositoryProvider provider, IMailSender mail, ILogger<InquiryApiController> logger)
    {
        _provider = provider;
        _mail = mail;
        _logger = logger;
    }

    [HttpPost("contact")]
    [EnableRateLimiting(PublicRateLimiting.Policy)]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    public async Task<IActionResult> Contact([FromBody] ContactRequest request, CancellationToken cancellationToken)
    {
        // Spam trap: pretend success so bots do not adapt.
        if (!string.IsNullOrWhiteSpace(request.Company))
        {
            return Accepted();
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var name = (request.Name ?? string.Empty).Trim();
        var email = (request.Email ?? string.Empty).Trim();
        var phone = (request.Phone ?? string.Empty).Trim();
        var message = (request.Message ?? string.Empty).Trim();

        if (name.Length is 0 or > 200 || message.Length is 0 or > 5000 || phone.Length is 0 or > 60)
        {
            return ValidationProblem("نام، تلفن و توضیحات پروژه الزامی و محدود به طول مجاز است.");
        }

        if (email.Length == 0 || email.Length > 200 || !email.Contains('@'))
        {
            return ValidationProblem("ایمیل وارد شده معتبر نیست.");
        }

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();

        var entity = new ContactMessage
        {
            Name = name,
            Email = email,
            Phone = phone,
            Subject = Trim(request.Subject, 300),
            Message = message,
            InquiryType = Trim(request.InquiryType, 80),
            Locale = request.Locale is "en" ? "en" : "fa",
            SourceIp = ip is not null && ip.Length <= 64 ? ip : null,
            CreatedAtUtc = DateTime.UtcNow,
        };

        try
        {
            entity.EmailSent = await _mail.SendContactAsync(entity, cancellationToken);
        }
        catch (Exception exception)
        {
            // A failing mail relay must never lose the lead.
            _logger.LogWarning(exception, "Contact mail could not be sent");
        }

        var repo = _provider.For<ContactMessage>();
        await repo.AddAsync(entity, cancellationToken);
        await repo.SaveChangesAsync(cancellationToken);

        return Accepted(new { ok = true, id = entity.Id, emailSent = entity.EmailSent });
    }

    [HttpPost("store-orders")]
    [EnableRateLimiting(PublicRateLimiting.Policy)]
    public async Task<IActionResult> StoreOrder([FromBody] StoreOrderRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        if (!request.RulesAccepted || string.IsNullOrWhiteSpace(request.FullName) || string.IsNullOrWhiteSpace(request.Mobile))
        {
            return ValidationProblem("نام، شماره تماس و پذیرش قوانین الزامی است.");
        }

        var order = new StoreOrder
        {
            FullName = request.FullName.Trim(),
            Mobile = request.Mobile.Trim(),
            StoreName = Trim(request.StoreName, 200),
            DesiredDomain = Trim(request.Domain, 200),
            TemplateCode = Trim(request.TemplateId, 60),
            PlanName = Trim(request.Plan, 300),
            BillingCycle = request.Cycle == "monthly" ? "monthly" : "yearly",
            Amount = request.Amount < 0 ? 0 : request.Amount,
            Gateway = request.Gateway is "zarinpal" ? "zarinpal" : "shaparak",
            Status = "pending",
            Locale = request.Locale is "en" ? "en" : "fa",
            CreatedAtUtc = DateTime.UtcNow,
        };

        var repo = _provider.For<StoreOrder>();
        await repo.AddAsync(order, cancellationToken);
        await repo.SaveChangesAsync(cancellationToken);

        // The gateway handshake is owned by the payment provider; the panel keeps
        // the intent so sales can follow up and mark the subscription as paid.
        return Accepted(new
        {
            ok = true,
            id = order.Id,
            reference = order.Id.ToString("N")[..10].ToUpperInvariant(),
            status = order.Status,
        });
    }

    private static string? Trim(string? value, int max)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var trimmed = value.Trim();
        return trimmed.Length <= max ? trimmed : trimmed[..max];
    }
}
