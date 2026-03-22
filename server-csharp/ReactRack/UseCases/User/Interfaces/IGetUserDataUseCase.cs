using Communication.Responses.UserData.Interfaces;

namespace ReactRack.UseCases.User.Interfaces
{
    public interface IGetUserDataUseCase
    {
        Task<IUserDataResponse> ExecuteAsync(Guid userId, CancellationToken cancellationToken);
    }
}
