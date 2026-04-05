using Exceptions.Validation;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using ReactRack.Infrastructure.Email;
using ReactRack.Infrastructure.Settings.Smtp;
using Xunit;

namespace ReactRack.Tests.Infrastructure.Email;

public sealed class SmtpEmailSenderTests
{
    [Fact]
    public async Task SendAsync_WhenRecipientIsEmpty_ShouldThrowValidationException()
    {
        var options = Options.Create(new SmtpOptions
        {
            Host = "smtp-relay.brevo.com",
            Username = "user",
            Password = "pass",
            FromEmail = "from@reactrack.dev"
        });
        var sender = new SmtpEmailSender(options, new NullLogger<SmtpEmailSender>());

        await Assert.ThrowsAsync<ValidationReactRackException>(() =>
            sender.SendAsync("", "subject", "<p>body</p>", CancellationToken.None));
    }
}
