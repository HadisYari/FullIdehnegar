using System.ComponentModel.DataAnnotations;
using EndPoints.Core.Abstractions;
using EndPoints.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace EndPoints.Endpoints;

[ApiController]
[Produces("application/json")]
[Route("api/v1/contact")]
public sealed class ContactEndpoints(IGenericService<ContactSubmission> submissions) : ControllerBase
{
    [HttpPost]
    [EnableRateLimiting("contact")]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> Create(
        [FromBody] ContactRequest request,
        CancellationToken cancellationToken)
    {
        // Honeypot field: quietly accept automated submissions without storing them.
        if (!string.IsNullOrWhiteSpace(request.Website)) return Accepted(new { accepted = true });

        var submission = new ContactSubmission
        {
            Name = request.Name.Trim(),
            Email = request.Email.Trim(),
            Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim(),
            Subject = request.Subject.Trim(),
            Message = request.Message.Trim(),
            Locale = request.Locale,
            CreatedAtUtc = DateTime.UtcNow
        };

        await submissions.AddAsync(submission, cancellationToken);
        await submissions.SaveChangesAsync(cancellationToken);
        return Accepted(new { accepted = true, id = submission.Id });
    }
}

public sealed class ContactRequest
{
    [Required, StringLength(120, MinimumLength = 2)]
    public string Name { get; init; } = string.Empty;

    [Required, EmailAddress, StringLength(254)]
    public string Email { get; init; } = string.Empty;

    [StringLength(40)]
    public string? Phone { get; init; }

    [Required, StringLength(200, MinimumLength = 2)]
    public string Subject { get; init; } = string.Empty;

    [Required, StringLength(5000, MinimumLength = 10)]
    public string Message { get; init; } = string.Empty;

    [Required, RegularExpression("^(fa|en)$")]
    public string Locale { get; init; } = "fa";

    // Hidden field, must remain empty for a real visitor.
    public string? Website { get; init; }
}
