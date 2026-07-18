using Microsoft.AspNetCore.Mvc;
using WaltonSolutions.Application.Contacts;

namespace WaltonSolutions.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactController(IContactService contactService)
    {
        _contactService = contactService;
    }

    /// <summary>Submit a contact / quote request from the marketing site.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(ContactSubmissionResult), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Submit(
        [FromBody] ContactSubmissionRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var result = await _contactService.SubmitAsync(request, cancellationToken);
        return CreatedAtAction(nameof(Submit), new { id = result.Id }, result);
    }
}
