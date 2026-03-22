using Communication.Requests.SendResetOtp.Interfaces;
using Communication.Responses.API.Interfaces;

namespace ReactRack.UseCases.Auth.Interfaces.SendResetOtp
{
    public interface ISendResetOtpUseCase
    {
        Task<IAPIResponse> ExecuteAsync(ISendResetOtpRequest request, CancellationToken cancellationToken);
    }
}
