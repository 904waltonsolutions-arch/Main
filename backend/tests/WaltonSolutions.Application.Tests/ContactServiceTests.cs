using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using WaltonSolutions.Application.Common.Interfaces;
using WaltonSolutions.Application.Contacts;
using WaltonSolutions.Domain.Enums;
using Xunit;

namespace WaltonSolutions.Application.Tests;

public class ContactServiceTests
{
    private static TestDbContext NewDb() =>
        new(new DbContextOptionsBuilder<TestDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);

    private sealed class FakeEmailSender : IEmailSender
    {
        public bool ShouldSucceed { get; init; } = true;
        public int Calls { get; private set; }

        public Task<bool> SendAsync(string subject, string htmlBody, string? replyToEmail = null,
            string? replyToName = null, CancellationToken cancellationToken = default)
        {
            Calls++;
            return Task.FromResult(ShouldSucceed);
        }
    }

    [Fact]
    public async Task SubmitAsync_persists_submission_and_sends_email()
    {
        using var db = NewDb();
        var email = new FakeEmailSender { ShouldSucceed = true };
        var service = new ContactService(db, email, NullLogger<ContactService>.Instance);

        var request = new ContactSubmissionRequest
        {
            Name = "  Jane Doe  ",
            Email = "jane@example.com",
            PackageInterest = PackageInterest.BusinessApp,
            Message = "I would like a quote."
        };

        var result = await service.SubmitAsync(request);

        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.True(result.EmailSent);
        Assert.Equal(1, email.Calls);

        var saved = await db.ContactSubmissions.SingleAsync();
        Assert.Equal("Jane Doe", saved.Name); // trimmed
        Assert.True(saved.EmailSent);
        Assert.Equal(PackageInterest.BusinessApp, saved.PackageInterest);
    }

    [Fact]
    public async Task SubmitAsync_still_persists_when_email_fails()
    {
        using var db = NewDb();
        var email = new FakeEmailSender { ShouldSucceed = false };
        var service = new ContactService(db, email, NullLogger<ContactService>.Instance);

        var result = await service.SubmitAsync(new ContactSubmissionRequest
        {
            Name = "John",
            Email = "john@example.com",
            Message = "Hello there"
        });

        Assert.False(result.EmailSent);
        var saved = await db.ContactSubmissions.SingleAsync();
        Assert.False(saved.EmailSent);
        Assert.Equal("John", saved.Name);
    }
}
