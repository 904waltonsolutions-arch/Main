using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WaltonSolutions.Domain.Entities;

namespace WaltonSolutions.Infrastructure.Persistence.Configurations;

public class ContactSubmissionConfiguration : IEntityTypeConfiguration<ContactSubmission>
{
    public void Configure(EntityTypeBuilder<ContactSubmission> builder)
    {
        builder.ToTable("ContactSubmissions");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name).IsRequired().HasMaxLength(120);
        builder.Property(x => x.Email).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Phone).HasMaxLength(40);
        builder.Property(x => x.Company).HasMaxLength(160);
        builder.Property(x => x.Message).IsRequired().HasMaxLength(4000);
        builder.Property(x => x.PackageInterest).HasConversion<string>().HasMaxLength(40);
        builder.Property(x => x.CreatedAt).IsRequired();

        builder.HasIndex(x => x.CreatedAt);
        builder.HasIndex(x => x.Email);
    }
}
