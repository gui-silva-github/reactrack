using Communication.Requests.Login.Interfaces;
using Communication.Responses.Auth.Interfaces;
using ReactRack.Infrastructure.Repositories.Interfaces;
using ReactRack.UseCases.Auth.Interfaces.Login;
using Exceptions.Validation;
using Exceptions.Unauthorized;
using Communication.Responses.Auth;

namespace ReactRack.UseCases.Auth.Login
{
    public sealed class LoginUseCase(IUserRepository userRepository) : ILoginUseCase
    {
        public async Task<IAuthResponse> ExecuteAsync(ILoginRequest request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                throw new ValidationReactRackException("E-mail e senha são necessários.");
            }

            var user = await userRepository.FindByEmailAsync(request.Email, cancellationToken);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedReactRackException("Usuário e/ou senha estão incorretos.");
            }

            return new AuthResponse(true, "Login realizado com sucesso.", user.Id, user.Name, user.Email);
        }
    }
}
