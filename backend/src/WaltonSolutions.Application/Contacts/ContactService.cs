using System.Net;
using Microsoft.Extensions.Logging;
using WaltonSolutions.Application.Common.Interfaces;
using WaltonSolutions.Domain.Entities;

namespace WaltonSolutions.Application.Contacts;

public class ContactService : IContactService
{
    private readonly IApplicationDbContext _db;
    private readonly IEmailSender _emailSender;
    private readonly ILogger<ContactService> _logger;

    public ContactService(
        IApplicationDbContext db,
        IEmailSender emailSender,
        ILogger<ContactService> logger)
    {
        _db = db;
        _emailSender = emailSender;
        _logger = logger;
    }

    public async Task<ContactSubmissionResult> SubmitAsync(
        ContactSubmissionRequest request,
        CancellationToken cancellationToken = default)
    {
        var submission = new ContactSubmission
        {
            Name = request.Name.Trim(),
            Email = request.Email.Trim(),
            Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim(),
            Company = string.IsNullOrWhiteSpace(request.Company) ? null : request.Company.Trim(),
            PackageInterest = request.PackageInterest,
            Message = request.Message.Trim()
        };

        _db.ContactSubmissions.Add(submission);
        await _db.SaveChangesAsync(cancellationToken);

        bool emailSent;
        try
        {
            emailSent = await _emailSender.SendAsync(
                subject: $"New enquiry from {submission.Name} ({submission.PackageInterest})",
                htmlBody: BuildEmailBody(submission),
                replyToEmail: submission.Email,
                replyToName: submission.Name,
                cancellationToken: cancellationToken);
        }
        catch (Exception ex)
        {
            // Never fail the request because email delivery failed; the record is
            // persisted and can be recovered/retried later.
            _logger.LogError(ex, "Failed to send contact notification email for {SubmissionId}", submission.Id);
            emailSent = false;
        }

        if (emailSent && !submission.EmailSent)
        {
            submission.EmailSent = true;
            await _db.SaveChangesAsync(cancellationToken);
        }

        return new ContactSubmissionResult { Id = submission.Id, EmailSent = emailSent };
    }

    private static string BuildEmailBody(ContactSubmission s)
    {
        string Encode(string? value) => WebUtility.HtmlEncode(value ?? "—");

        return $"""
            <h2>New Walton Solutions enquiry</h2>
            <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
              <tr><td style="padding:4px 12px;font-weight:bold">Name</td><td style="padding:4px 12px">{Encode(s.Name)}</td></tr>
              <tr><td style="padding:4px 12px;font-weight:bold">Email</td><td style="padding:4px 12px">{Encode(s.Email)}</td></tr>
              <tr><td style="padding:4px 12px;font-weight:bold">Phone</td><td style="padding:4px 12px">{Encode(s.Phone)}</td></tr>
              <tr><td style="padding:4px 12px;font-weight:bold">Company</td><td style="padding:4px 12px">{Encode(s.Company)}</td></tr>
              <tr><td style="padding:4px 12px;font-weight:bold">Package</td><td style="padding:4px 12px">{Encode(s.PackageInterest.ToString())}</td></tr>
              <tr><td style="padding:4px 12px;font-weight:bold;vertical-align:top">Message</td><td style="padding:4px 12px;white-space:pre-wrap">{Encode(s.Message)}</td></tr>
              <tr><td style="padding:4px 12px;font-weight:bold">Received</td><td style="padding:4px 12px">{s.CreatedAt:u}</td></tr>
            </table>
            """;
    }
}
