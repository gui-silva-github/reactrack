using Communication.Responses.API;
using Communication.Responses.API.Interfaces;
using ReactRack.Infrastructure.Email.Interfaces;
using ReactRack.Infrastructure.Repositories.Interfaces;
using Exceptions.NotFound;
using Exceptions.Validation;
using ReactRack.UseCases.Auth.Interfaces.SendVerifyOtp;

namespace ReactRack.UseCases.Auth.SendVerifyOtp
{
    public sealed class SendVerifyOtpUseCase(IUserRepository userRepository, IEmailSender emailSender) : ISendVerifyOtpUseCase
    {
        public async Task<IAPIResponse> ExecuteAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = await userRepository.FindByIdAsync(userId, cancellationToken)
                ?? throw new NotFoundReactRackException("Usuário não encontrado.");

            if (user.IsAccountVerified)
            {
                throw new ValidationReactRackException("Conta já verificada.");
            }

            user.VerifyOtp = Random.Shared.Next(100000, 999999).ToString();
            user.VerifyOtpExpireAt = DateTimeOffset.UtcNow.AddHours(24);

            await userRepository.UpdateAsync(user, cancellationToken);
            await emailSender.SendAsync(
                user.Email,
                "Reactrack - Código de verificação",
                BuildVerifyEmailBody(user.Email, user.VerifyOtp),
                cancellationToken);

            return new APIResponse(true, "Código de verificação enviado para o seu email.");
        }

        private static string BuildVerifyEmailBody(string email, string otp)
        {
            const string template = """
                <!DOCTYPE html>
                <html>
                <head>
                  <title>Verificação de Conta</title>
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
                            <tr><td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;">Verifique sua conta no ReactRack</td></tr>
                            <tr><td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">Você está a um passo de confirmar sua conta para este e-mail: <span style="color: #4C83EE;">{{email}}</span>.</td></tr>
                            <tr><td style="padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;">Use o código OTP abaixo para verificar sua conta.</td></tr>
                            <tr><td style="padding: 0 0 24px;"><p class="otp-box">{{otp}}</p></td></tr>
                            <tr><td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">Este código expira em 24 horas.</td></tr>
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
