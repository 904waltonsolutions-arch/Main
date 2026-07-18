namespace WaltonSolutions.Application.Contacts;

public interface IContactService
{
    Task<ContactSubmissionResult> SubmitAsync(
        ContactSubmissionRequest request,
        CancellationToken cancellationToken = default);
}
