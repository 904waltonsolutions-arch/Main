using Microsoft.EntityFrameworkCore;
using WaltonSolutions.Application.Common.Interfaces;
using WaltonSolutions.Domain.Entities;

namespace WaltonSolutions.Application.Tests;

/// <summary>In-memory DbContext used to exercise the application layer.</summary>
public class TestDbContext : DbContext, IApplicationDbContext
{
    public TestDbContext(DbContextOptions<TestDbContext> options) : base(options)
    {
    }

    public DbSet<ContactSubmission> ContactSubmissions => Set<ContactSubmission>();
}
