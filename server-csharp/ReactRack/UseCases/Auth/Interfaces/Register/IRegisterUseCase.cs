using Communication.Requests.Register.Interfaces;
using Communication.Responses.Auth.Interfaces;

namespace ReactRack.UseCases.Auth.Interfaces.Register
{
    public interface IRegisterUseCase
    {
        Task<IAuthResponse> ExecuteAsync(IRegisterRequest request, CancellationToken cancellationToken);
    }
}
