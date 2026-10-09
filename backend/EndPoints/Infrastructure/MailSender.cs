using System.Net;
using System.Net.Mail;
using System.Text;
using Idehnegar.Core.Entities;
using Microsoft.Extensions.Options;

namespace EndPoints.Infrastructure;

/// <summary>Delivers a copy of a contact message to the sales inbox, when configured.</summary>
public interface IMailSender
{
    Task<bool> SendContactAsync(ContactMessage message, CancellationToken cancellationToken = default);
}

/// <summary>
/// Plain SMTP relay implementation — mirrors the optional SMTP support the
/// front end used to have (nodemailer). When <c>Admin:SmtpHost</c> is empty the
/// message is only stored in the database and shown in the panel.
/// </summary>
#pragma warning disable CA5393 // SMTP is opt-in via configuration
#pragma warning disable SYSLIB0008 // SmtpClient is supported for outbound delivery on this host
public sealed class SmtpMailSender : IMailSender
{
    private readonly AdminOptions _options;
    private readonly ILogger<SmtpMailSender> _logger;

    public SmtpMailSender(IOptions<AdminOptions> options, ILogger<SmtpMailSender> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(_options.SmtpHost) && !string.IsNullOrWhiteSpace(_options.ToEmail);

    public async Task<bool> SendContactAsync(ContactMessage message, CancellationToken cancellationToken = default)
    {
        if (!IsConfigured)
        {
            return false;
        }

        var body = new StringBuilder()
            .AppendLine($"نام: {message.Name}")
            .AppendLine($"ایمیل: {message.Email}")
            .AppendLine($"تلفن: {message.Phone}")
            .AppendLine($"موضوع: {message.Subject}")
            .AppendLine($"زبان: {message.Locale}")
            .AppendLine()
            .AppendLine(message.Message)
            .ToString();

        using var mail = new MailMessage
        {
            From = new MailAddress(
                string.IsNullOrWhiteSpace(_options.SmtpUser) ? _options.ToEmail : _options.SmtpUser,
                "Idehnegar Website"),
            Subject = $"[سایت] {message.Subject ?? "پیام جدید از فرم تماس"}",
            Body = body,
            BodyEncoding = Encoding.UTF8,
            IsBodyHtml = false,
        };

        mail.To.Add(_options.ToEmail);
        if (message.Email.Contains('@'))
        {
            mail.ReplyToList.Add(new MailAddress(message.Email, message.Name));
        }

        using var client = new SmtpClient(_options.SmtpHost, _options.SmtpPort)
        {
            EnableSsl = _options.SmtpUseSsl,
        };

        if (!string.IsNullOrWhiteSpace(_options.SmtpUser))
        {
            client.Credentials = new NetworkCredential(_options.SmtpUser, _options.SmtpPassword);
        }

        await client.SendMailAsync(mail, cancellationToken);
        _logger.LogInformation("Contact message {Id} mailed to {To}", message.Id, _options.ToEmail);
        return true;
    }
}
#pragma warning restore SYSLIB0008
#pragma warning restore CA5393

/// <summary>Used when no SMTP relay is configured (development, CI).</summary>
public sealed class NullMailSender : IMailSender
{
    public Task<bool> SendContactAsync(ContactMessage message, CancellationToken cancellationToken = default) =>
        Task.FromResult(false);
}
