using Communication.Requests.SendResetOtp.Interfaces;
using Communication.Responses.API;
using Communication.Responses.API.Interfaces;
using ReactRack.Infrastructure.Email.Interfaces;
using ReactRack.Infrastructure.Repositories.Interfaces;
using ReactRack.UseCases.Auth.Interfaces.SendResetOtp;
using Exceptions.Validation;
using Exceptions.NotFound;

namespace ReactRack.UseCases.Auth.SendResetOtp
{
    public sealed class SendResetOtpUseCase(IUserRepository userRepository,
        IEmailSender emailSender): ISendResetOtpUseCase
    {
        public async Task<IAPIResponse> ExecuteAsync(ISendResetOtpRequest request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                throw new ValidationReactRackException("Email é obrigatório.");
            }

            var user = await userRepository.FindByEmailAsync(request.Email, cancellationToken)
                ?? throw new NotFoundReactRackException("Usuário não encontrado.");

            user.ResetOtp = Random.Shared.Next(100000, 999999).ToString();
            user.ResetOtpExpireAt = DateTimeOffset.UtcNow.AddMinutes(15);
            await userRepository.UpdateAsync(user, cancellationToken);
            await emailSender.SendAsync(
                user.Email,
                "Reactrack - Código para redefinir senha",
                BuildResetEmailBody(user.Email, user.ResetOtp),
                cancellationToken);

            return new APIResponse(true, "Código para redefinição enviado para o seu e-mail.");
        }

        private static string BuildResetEmailBody(string email, string otp)
        {
            const string template = """
                <!DOCTYPE html>
                <html>
                <head>
                  <title>Redefinição de Senha</title>
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
                  <style>
                    body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; background: #E5E5E5; }
                    table, td { border-collapse: collapse; }
                    .container { width: 100%; max-width: 500px; margin: 70px 0; background: #fff; }
                    .main-content { padding: 48px 30px 40px; color: #000; }
                    .otp-box { width: 100%; background: #22D172; padding: 10px 0; color: #fff; font-size: 14px; text-align: center; font-weight: bold; border-radius: 7px; }
                  </style>
                </head>
                <body>
                  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
                    <tr><td valign="top" align="center">
                      <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
                        <tr><td class="main-content">
                          <table width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr><td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;">Redefinição de senha</td></tr>
                            <tr><td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">Recebemos uma solicitação para redefinir a senha da conta: <span style="color: #4C83EE;">{{email}}</span>.</td></tr>
                            <tr><td style="padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;">Use o código OTP abaixo para redefinir a senha.</td></tr>
                            <tr><td style="padding: 0 0 24px;"><p class="otp-box">{{otp}}</p></td></tr>
                            <tr><td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">Este código expira em 15 minutos.</td></tr>
                          </table>
                        </td></tr>
                      </table>
                    </td></tr>
                  </table>
                </body>
                </html>
                """;
            return template.Replace("{{email}}", email).Replace("{{otp}}", otp);
        }
    }
}
