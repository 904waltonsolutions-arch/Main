namespace WaltonSolutions.Application.Common.Interfaces;

public interface IEmailSender
{
    /// <summary>
    /// Sends a plain-text/HTML email. Returns true when the message was accepted
    /// by the mail transport, false when sending was skipped or failed.
    /// </summary>
    Task<bool> SendAsync(
        string subject,
        string htmlBody,
        string? replyToEmail = null,
        string? replyToName = null,
        CancellationToken cancellationToken = default);
}
