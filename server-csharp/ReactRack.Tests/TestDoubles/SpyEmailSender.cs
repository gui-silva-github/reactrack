using ReactRack.Infrastructure.Email.Interfaces;

namespace ReactRack.Tests.TestDoubles;

internal sealed class SpyEmailSender : IEmailSender
{
    public int CallCount { get; private set; }
    public string? LastToEmail { get; private set; }
    public string? LastSubject { get; private set; }
    public string? LastHtmlBody { get; private set; }

    public Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken cancellationToken)
    {
        CallCount++;
        LastToEmail = toEmail;
        LastSubject = subject;
        LastHtmlBody = htmlBody;
        return Task.CompletedTask;
    }
}
