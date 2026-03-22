using Communication.Requests.ResetPassword.Interfaces;
using Communication.Responses.API.Interfaces;

namespace ReactRack.UseCases.Auth.Interfaces.ResetPassword
{
    public interface IResetPasswordUseCase
    {
        Task<IAPIResponse> ExecuteAsync(IResetPasswordRequest request, CancellationToken cancellationToken);
    }
}
