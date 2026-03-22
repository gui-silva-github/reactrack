using Communication.Requests.VerifyAccount.Interfaces;
using Communication.Responses.API;
using Communication.Responses.API.Interfaces;
using ReactRack.Infrastructure.Repositories.Interfaces;
using ReactRack.UseCases.Auth.Interfaces.VerifyAccount;
using Exceptions.Validation;
using Exceptions.Unauthorized;
using Exceptions.NotFound;

namespace ReactRack.UseCases.Auth.VerifyAccount
{
    public sealed class VerifyAccountUseCase(IUserRepository userRepository) : IVerifyAccountUseCase
    {
        public async Task<IAPIResponse> ExecuteAsync(
        Guid userId,
        IVerifyAccountRequest request,
        CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Otp))
            {
                throw new ValidationReactRackException("OTP obrigatória.");
            }

            var user = await userRepository.FindByIdAsync(userId, cancellationToken)
                ?? throw new NotFoundReactRackException("Usuário não encontrado.");

            if (user.VerifyOtp != request.Otp)
            {
                throw new UnauthorizedReactRackException("OTP inválida.");
            }

            if (!user.VerifyOtpExpireAt.HasValue || user.VerifyOtpExpireAt < DateTimeOffset.UtcNow)
            {
                throw new UnauthorizedReactRackException("OTP expirada.");
            }

            user.IsAccountVerified = true;
            user.VerifyOtp = string.Empty;
            user.VerifyOtpExpireAt = null;

            await userRepository.UpdateAsync(user, cancellationToken);
            return new APIResponse(true, "Conta verificada com sucesso.");
        }
    }
}
