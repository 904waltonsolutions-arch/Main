using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using WaltonSolutions.Application.Common.Interfaces;

namespace WaltonSolutions.Infrastructure.Email;

/// <summary>
/// SMTP implementation of <see cref="IEmailSender"/> using MailKit. When email is
/// disabled (e.g. local development without credentials) the message is logged and
/// treated as "not sent" so the caller can still succeed.
/// </summary>
public class SmtpEmailSender : IEmailSender
{
    private readonly EmailSettings _settings;
    private readonly ILogger<SmtpEmailSender> _logger;

    public SmtpEmailSender(IOptions<EmailSettings> settings, ILogger<SmtpEmailSender> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<bool> SendAsync(
        string subject,
        string htmlBody,
        string? replyToEmail = null,
        string? replyToName = null,
        CancellationToken cancellationToken = default)
    {
        if (!_settings.Enabled)
        {
            _logger.LogWarning(
                "Email sending is disabled. Would have sent '{Subject}' to {To}.",
                subject, _settings.ToEmail);
            return false;
        }

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
        message.To.Add(MailboxAddress.Parse(_settings.ToEmail));
        message.Subject = subject;

        if (!string.IsNullOrWhiteSpace(replyToEmail))
        {
            message.ReplyTo.Add(new MailboxAddress(replyToName ?? replyToEmail, replyToEmail));
        }

        message.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();

        using var client = new SmtpClient();
        var socketOptions = _settings.UseStartTls
            ? SecureSocketOptions.StartTls
            : SecureSocketOptions.SslOnConnect;

        await client.ConnectAsync(_settings.Host, _settings.Port, socketOptions, cancellationToken);

        if (!string.IsNullOrWhiteSpace(_settings.Username))
        {
            await client.AuthenticateAsync(_settings.Username, _settings.Password, cancellationToken);
        }

        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);

        _logger.LogInformation("Sent contact notification email to {To}.", _settings.ToEmail);
        return true;
    }
}
