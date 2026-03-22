using Communication.Requests.VerifyAccount.Interfaces;
using Communication.Responses.API.Interfaces;

namespace ReactRack.UseCases.Auth.Interfaces.VerifyAccount
{
    public interface IVerifyAccountUseCase
    {
        Task<IAPIResponse> ExecuteAsync(Guid userId, IVerifyAccountRequest request, CancellationToken cancellationToken);
    }
}
