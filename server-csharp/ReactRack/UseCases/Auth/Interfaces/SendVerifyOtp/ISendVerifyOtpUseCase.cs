using Communication.Responses.API.Interfaces;

namespace ReactRack.UseCases.Auth.Interfaces.SendVerifyOtp
{
    public interface ISendVerifyOtpUseCase
    {
        Task<IAPIResponse> ExecuteAsync(Guid userId, CancellationToken cancellationToken);
    }
}
