using System.ComponentModel.DataAnnotations;
using WaltonSolutions.Domain.Enums;

namespace WaltonSolutions.Application.Contacts;

/// <summary>Incoming payload from the marketing site contact form.</summary>
public class ContactSubmissionRequest
{
    [Required]
    [StringLength(120, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(200)]
    public string Email { get; set; } = string.Empty;

    [Phone]
    [StringLength(40)]
    public string? Phone { get; set; }

    [StringLength(160)]
    public string? Company { get; set; }

    public PackageInterest PackageInterest { get; set; } = PackageInterest.Unspecified;

    [Required]
    [StringLength(4000, MinimumLength = 5)]
    public string Message { get; set; } = string.Empty;
}
