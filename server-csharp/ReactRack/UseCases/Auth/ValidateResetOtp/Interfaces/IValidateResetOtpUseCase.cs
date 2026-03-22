using Communication.Requests.ValidateResetOtp.Interfaces;
using Communication.Responses.API.Interfaces;

namespace ReactRack.UseCases.Auth.Interfaces.ValidateResetOtp
{
    public interface IValidateResetOtpUseCase
    {
        Task<IAPIResponse> ExecuteAsync(IValidateResetOtpRequest request, CancellationToken cancellationToken);
    }
}
