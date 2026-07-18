namespace WaltonSolutions.Infrastructure.Email;

/// <summary>
/// SMTP configuration bound from the "Email" section of appsettings / environment
/// variables. Works with any SMTP provider (Gmail SMTP, SendGrid, Azure
/// Communication Services SMTP, Brevo, etc.).
/// </summary>
public class EmailSettings
{
    public const string SectionName = "Email";

    /// <summary>When false, emails are logged instead of sent (safe local default).</summary>
    public bool Enabled { get; set; }

    public string Host { get; set; } = string.Empty;

    public int Port { get; set; } = 587;

    public bool UseStartTls { get; set; } = true;

    public string Username { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    /// <summary>The "From" address shown on outgoing mail.</summary>
    public string FromEmail { get; set; } = string.Empty;

    public string FromName { get; set; } = "Walton Solutions Website";

    /// <summary>Where contact-form notifications are delivered.</summary>
    public string ToEmail { get; set; } = string.Empty;
}
