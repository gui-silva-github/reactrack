using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using ReactRack.Infrastructure.Email.Interfaces;
using ReactRack.Infrastructure.Settings.Smtp;
using Exceptions.Validation;
using Exceptions.InternalServer;

namespace ReactRack.Infrastructure.Email
{
    public sealed class SmtpEmailSender(
        IOptions<SmtpOptions> smtpOptions,
        ILogger<SmtpEmailSender> logger
    ) : IEmailSender
    {
        private readonly SmtpOptions _smtpOptions = smtpOptions.Value;

        public async Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(toEmail))
            {
                throw new ValidationReactRackException("Email do destinatário é obrigatório.");
            }

            ValidateConfiguration();

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_smtpOptions.FromName, _smtpOptions.FromEmail));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = htmlBody };

            try
            {
                cancellationToken.ThrowIfCancellationRequested();
                using var client = new SmtpClient();
                if (_smtpOptions.SkipCertificateValidation)
                {
                    client.ServerCertificateValidationCallback = (_, _, _, _) => true;
                }

                var socketOptions = _smtpOptions.EnableSsl
                    ? SecureSocketOptions.StartTls
                    : SecureSocketOptions.None;

                await client.ConnectAsync(_smtpOptions.Host, _smtpOptions.Port, socketOptions, cancellationToken);
                await client.AuthenticateAsync(_smtpOptions.Username, _smtpOptions.Password, cancellationToken);
                await client.SendAsync(message, cancellationToken);
                await client.DisconnectAsync(true, cancellationToken);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Falha ao enviar email para {ToEmail}", toEmail);
                throw new InternalServerReactRackException("Não foi possível enviar email no momento.");
            }
        }

        private void ValidateConfiguration()
        {
            if (string.IsNullOrWhiteSpace(_smtpOptions.Host) ||
                string.IsNullOrWhiteSpace(_smtpOptions.Username) ||
                string.IsNullOrWhiteSpace(_smtpOptions.Password) ||
                string.IsNullOrWhiteSpace(_smtpOptions.FromEmail))
            {
                throw new InternalServerReactRackException("Configuração SMTP inválida. Verifique a seção Smtp no appsettings.");
            }
        }
    }
}
