using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
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

            using var mailMessage = new MailMessage
            {
                From = new MailAddress(_smtpOptions.FromEmail, _smtpOptions.FromName, System.Text.Encoding.UTF8),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true,
                BodyEncoding = System.Text.Encoding.UTF8,
                SubjectEncoding = System.Text.Encoding.UTF8
            };
            mailMessage.To.Add(new MailAddress(toEmail));

            using var smtpClient = new SmtpClient(_smtpOptions.Host, _smtpOptions.Port)
            {
                EnableSsl = _smtpOptions.EnableSsl,
                Credentials = new NetworkCredential(_smtpOptions.Username, _smtpOptions.Password)
            };

            try
            {
                cancellationToken.ThrowIfCancellationRequested();
                await smtpClient.SendMailAsync(mailMessage, cancellationToken);
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
