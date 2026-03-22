using Communication.Requests.ValidateResetOtp.Interfaces;
using Communication.Responses.API;
using Communication.Responses.API.Interfaces;
using ReactRack.Infrastructure.Repositories.Interfaces;
using ReactRack.UseCases.Auth.Interfaces.ValidateResetOtp;
using Exceptions.Validation;
using Exceptions.NotFound;
using Exceptions.Unauthorized;

namespace ReactRack.UseCases.Auth.ValidateResetOtp
{
    public sealed class ValidateResetOtpUseCase(IUserRepository userRepository) : IValidateResetOtpUseCase
    {
        public async Task<IAPIResponse> ExecuteAsync(IValidateResetOtpRequest request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Otp))
            {
                throw new ValidationReactRackException("E-mail e OTP são obrigatórios.");
            }

            var user = await userRepository.FindByEmailAsync(request.Email, cancellationToken)
                ?? throw new NotFoundReactRackException("Usuário não encontrado.");

            if (user.ResetOtp != request.Otp)
            {
                throw new UnauthorizedReactRackException("OTP inválida.");
            }

            if (!user.ResetOtpExpireAt.HasValue || user.ResetOtpExpireAt < DateTimeOffset.UtcNow)
            {
                throw new UnauthorizedReactRackException("OTP expirada.");
            }

            return new APIResponse(true, "OTP válida. Informe a nova senha.");
        }
    }
}
