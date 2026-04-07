using System.Net;
using Communication.Requests.Register.Interfaces;
using Communication.Responses.Auth.Interfaces;
using ReactRack.Infrastructure.Email.Interfaces;
using ReactRack.Infrastructure.Repositories.Interfaces;
using ReactRack.UseCases.Auth.Interfaces.Register;
using Exceptions.Validation;
using Exceptions.Conflict;
using Communication.Responses.Auth;

namespace ReactRack.UseCases.Auth.Register
{
    public sealed class RegisterUseCase(IUserRepository userRepository, IEmailSender emailSender) : IRegisterUseCase
    {
        public async Task<IAuthResponse> ExecuteAsync(IRegisterRequest request, CancellationToken cancellationToken)
        {
           if (string.IsNullOrWhiteSpace(request.Name) ||
           string.IsNullOrWhiteSpace(request.Email) ||
           string.IsNullOrWhiteSpace(request.Password))
            {
                throw new ValidationReactRackException("Estão faltando detalhes.");
            }

            var existingUser = await userRepository.FindByEmailAsync(request.Email, cancellationToken);
            if (existingUser != null)
            {
                throw new ConflictReactRackException("Usuário já existe.");
            }

            var user = new ReactRack.Entities.User
            {
                Name = request.Name.Trim(),
                Email = request.Email.Trim().ToLowerInvariant(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            };

            await userRepository.CreateAsync(user, cancellationToken);

            var safeEmail = WebUtility.HtmlEncode(user.Email);
            await emailSender.SendAsync(
                user.Email,
                "Bem Vindo ao ReactRack",
                $"<p>Bem Vindo ao ReactRack, sua conta foi criada com o email: {safeEmail}</p>",
                cancellationToken);

            return new AuthResponse(true, "Cadastro realizado com sucesso!", user.Id, user.Name, user.Email);
        }
    }
}
