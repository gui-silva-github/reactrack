using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactRack.UseCases.User.Interfaces;
using Exceptions.Unauthorized;

namespace ReactRack.Controllers
{
    [ApiController]
    [Route("user")]
    public sealed class UserController(IGetUserDataUseCase getUserDataUseCase) : ControllerBase
    {
        [Authorize]
        [HttpGet("data")]
        public async Task<IActionResult> GetData(CancellationToken cancellationToken)
        {
            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(idClaim, out var userId))
            {
                throw new UnauthorizedReactRackException("Não autorizado");
            }

            var response = await getUserDataUseCase.ExecuteAsync(userId, cancellationToken);
            return Ok(response);
        }
    }
}
