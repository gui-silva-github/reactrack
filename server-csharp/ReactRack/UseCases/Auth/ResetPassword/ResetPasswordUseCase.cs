using Communication.Requests.ResetPassword.Interfaces;
using Communication.Responses.API.Interfaces;
using ReactRack.Infrastructure.Repositories.Interfaces;
using ReactRack.UseCases.Auth.Interfaces.ResetPassword;
using Exceptions.Validation;
using Exceptions.NotFound;
using Exceptions.Unauthorized;
using Communication.Responses.API;

namespace ReactRack.UseCases.Auth.ResetPassword
{
    public sealed class ResetPasswordUseCase(IUserRepository userRepository) : IResetPasswordUseCase
    {
        public async Task<IAPIResponse> ExecuteAsync(IResetPasswordRequest request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Otp) ||
            string.IsNullOrWhiteSpace(request.NewPassword))
            {
                throw new ValidationReactRackException("E-mail, OTP e nova senha são obrigatórios.");
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

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.ResetOtp = string.Empty;
            user.ResetOtpExpireAt = null;
            await userRepository.UpdateAsync(user, cancellationToken);

            return new APIResponse(true, "Senha redefinida com sucesso.");
        }
    }
}
