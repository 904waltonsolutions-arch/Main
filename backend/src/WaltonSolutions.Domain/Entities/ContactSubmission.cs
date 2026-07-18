using WaltonSolutions.Domain.Enums;

namespace WaltonSolutions.Domain.Entities;

/// <summary>
/// A contact/quote request submitted through the marketing site.
/// </summary>
public class ContactSubmission
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? Company { get; set; }

    public PackageInterest PackageInterest { get; set; } = PackageInterest.Unspecified;

    public string Message { get; set; } = string.Empty;

    /// <summary>UTC timestamp the submission was received.</summary>
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    /// <summary>True once the notification email has been dispatched.</summary>
    public bool EmailSent { get; set; }
}
