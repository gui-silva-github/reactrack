using Communication.Responses.UserData;
using Communication.Responses.UserData.Interfaces;
using Exceptions.NotFound;
using ReactRack.Infrastructure.Repositories.Interfaces;
using ReactRack.UseCases.User.Interfaces;

namespace ReactRack.UseCases.User
{
    public sealed class GetUserDataUseCase(IUserRepository userRepository) : IGetUserDataUseCase
    {
        public async Task<IUserDataResponse> ExecuteAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = await userRepository.FindByIdAsync(userId, cancellationToken)
                ?? throw new NotFoundReactRackException("Usuário não encontrado.");

            return new UserDataResponse(
                true,
                new UserDataPayload(user.Id, user.Name, user.Email, user.IsAccountVerified));
        }
    }
}
