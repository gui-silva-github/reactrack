using Communication.Requests.Login.Interfaces;
using Communication.Responses.Auth.Interfaces;

namespace ReactRack.UseCases.Auth.Interfaces.Login
{
    public interface ILoginUseCase
    {
        Task<IAuthResponse> ExecuteAsync(ILoginRequest request, CancellationToken cancellationToken);
    }
}
