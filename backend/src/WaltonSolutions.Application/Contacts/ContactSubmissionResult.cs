namespace WaltonSolutions.Application.Contacts;

public class ContactSubmissionResult
{
    public Guid Id { get; init; }

    /// <summary>True when the notification email was accepted by the transport.</summary>
    public bool EmailSent { get; init; }
}
