using Microsoft.AspNetCore.Mvc;

namespace WaltonSolutions.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    /// <summary>Simple liveness probe used by Azure App Service / load balancers.</summary>
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "healthy", timestamp = DateTimeOffset.UtcNow });
}
