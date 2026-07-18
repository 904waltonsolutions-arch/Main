using Microsoft.EntityFrameworkCore;
using WaltonSolutions.Domain.Entities;

namespace WaltonSolutions.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<ContactSubmission> ContactSubmissions { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
