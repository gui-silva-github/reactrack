using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactRack.Infrastructure.Security.Interfaces;
using ReactRack.UseCases.Auth.Interfaces.Register;
using ReactRack.UseCases.Auth.Interfaces.Login;
using ReactRack.UseCases.Auth.Interfaces.SendVerifyOtp;
using ReactRack.UseCases.Auth.Interfaces.VerifyAccount;
using ReactRack.UseCases.Auth.Interfaces.SendResetOtp;
using ReactRack.UseCases.Auth.Interfaces.ResetPassword;
using ReactRack.UseCases.Auth.Interfaces.ValidateResetOtp;
using Communication.Requests.Register;
using Communication.Requests.Login;
using Communication.Requests.ResetPassword;
using Communication.Requests.ValidateResetOtp;
using Communication.Requests.SendResetOtp;
using Communication.Requests.VerifyAccount;
using Communication.Responses.API;
using Exceptions.Unauthorized;

namespace ReactRack.Controllers
{
    [ApiController]
    [Route("auth")]
    public sealed class AuthController(
        IRegisterUseCase registerUseCase,
        ILoginUseCase loginUseCase,
        ISendVerifyOtpUseCase sendVerifyOtpUseCase,
        IVerifyAccountUseCase verifyAccountUseCase,
        ISendResetOtpUseCase sendResetOtpUseCase,
        IValidateResetOtpUseCase validateResetOtpUseCase,
        IResetPasswordUseCase resetPasswordUseCase,
        IJwtTokenService jwtTokenService
    ): ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
        {
            var response = await registerUseCase.ExecuteAsync(request, cancellationToken);
            IssueAuthCookie(response);
            return StatusCode(StatusCodes.Status201Created, response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
        {
            var response = await loginUseCase.ExecuteAsync(request, cancellationToken);
            IssueAuthCookie(response);
            return Ok(response);
        }

        [Authorize]
        [HttpGet("is-auth")]
        public IActionResult IsAuthenticated()
        {
            return Ok(new APIResponse(true, "Usuário autenticado."));
        }

        [Authorize]
        [HttpPost("send-verify-otp")]
        public async Task<IActionResult> SendVerifyOtp(CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var response = await sendVerifyOtpUseCase.ExecuteAsync(userId, cancellationToken);
            return Ok(response);
        }

        [Authorize]
        [HttpPost("verify-account")]
        public async Task<IActionResult> VerifyAccount([FromBody] VerifyAccountRequest request, CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var response = await verifyAccountUseCase.ExecuteAsync(userId, request, cancellationToken);
            return Ok(response);
        }

        [HttpPost("send-reset-otp")]
        public async Task<IActionResult> SendResetOtp([FromBody] SendResetOtpRequest request, CancellationToken cancellationToken)
        {
            var response = await sendResetOtpUseCase.ExecuteAsync(request, cancellationToken);
            return Ok(response);
        }

        [HttpPost("validate-reset-otp")]
        public async Task<IActionResult> ValidateResetOtp([FromBody] ValidateResetOtpRequest request, CancellationToken cancellationToken)
        {
            var response = await validateResetOtpUseCase.ExecuteAsync(request, cancellationToken);
            return Ok(response);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request, CancellationToken cancellationToken)
        {
            var response = await resetPasswordUseCase.ExecuteAsync(request, cancellationToken);
            return Ok(response);
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("token", BuildCookieOptions(HttpContext));
            return Ok(new APIResponse(true, "Deslogado com sucesso."));
        }

        private Guid GetCurrentUserId()
        {
            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(idClaim, out var userId))
            {
                throw new UnauthorizedReactRackException("Não autorizado.");
            }

            return userId;
        }

        private void IssueAuthCookie(Communication.Responses.Auth.Interfaces.IAuthResponse response)
        {
            if (!response.Id.HasValue || string.IsNullOrWhiteSpace(response.Name) || string.IsNullOrWhiteSpace(response.Email))
            {
                throw new UnauthorizedReactRackException("Não foi possível gerar token.");
            }

            var token = jwtTokenService.Generate(new ReactRack.Entities.User
            {
                Id = response.Id.Value,
                Name = response.Name,
                Email = response.Email,
            });
            Response.Cookies.Append("token", token, BuildCookieOptions(HttpContext));
        }

        private static CookieOptions BuildCookieOptions(HttpContext httpContext)
        {
            var isHttps = httpContext.Request.IsHttps;

            return new CookieOptions
            {
                HttpOnly = true,
                Secure = isHttps,
                SameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            };
        }
    }
}
