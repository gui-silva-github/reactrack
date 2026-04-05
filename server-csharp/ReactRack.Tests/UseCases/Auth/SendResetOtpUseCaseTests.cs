using Communication.Requests.SendResetOtp;
using Exceptions.NotFound;
using Exceptions.Validation;
using ReactRack.Tests.TestDoubles;
using ReactRack.UseCases.Auth.SendResetOtp;
using Xunit;

namespace ReactRack.Tests.UseCases.Auth;

public sealed class SendResetOtpUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_WhenEmailIsMissing_ShouldThrowValidationException()
    {
        var repository = new InMemoryUserRepository();
        var emailSender = new SpyEmailSender();
        var useCase = new SendResetOtpUseCase(repository, emailSender);
        var request = new SendResetOtpRequest("");

        await Assert.ThrowsAsync<ValidationReactRackException>(() =>
            useCase.ExecuteAsync(request, CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenUserDoesNotExist_ShouldThrowNotFoundException()
    {
        var repository = new InMemoryUserRepository();
        var emailSender = new SpyEmailSender();
        var useCase = new SendResetOtpUseCase(repository, emailSender);
        var request = new SendResetOtpRequest("unknown@reactrack.dev");

        await Assert.ThrowsAsync<NotFoundReactRackException>(() =>
            useCase.ExecuteAsync(request, CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenUserExists_ShouldReturnSuccessAndSendEmail()
    {
        var user = new ReactRack.Entities.User
        {
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
        };

        var repository = new InMemoryUserRepository([user]);
        var emailSender = new SpyEmailSender();
        var useCase = new SendResetOtpUseCase(repository, emailSender);
        var request = new SendResetOtpRequest("gui@reactrack.dev");

        var response = await useCase.ExecuteAsync(request, CancellationToken.None);

        Assert.True(response.Success);
        Assert.Equal("Código para redefinição enviado para o seu e-mail.", response.Message);
        Assert.Equal(1, emailSender.CallCount);
        Assert.Equal("gui@reactrack.dev", emailSender.LastToEmail);
    }

    [Fact]
    public async Task ExecuteAsync_WhenUserExists_ShouldGenerateSixDigitOtp()
    {
        var user = new ReactRack.Entities.User
        {
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
        };

        var repository = new InMemoryUserRepository([user]);
        var emailSender = new SpyEmailSender();
        var useCase = new SendResetOtpUseCase(repository, emailSender);

        await useCase.ExecuteAsync(new SendResetOtpRequest("gui@reactrack.dev"), CancellationToken.None);

        Assert.Matches("^[0-9]{6}$", user.ResetOtp);
    }

    [Fact]
    public async Task ExecuteAsync_WhenUserExists_ShouldSetOtpExpirationAround15Minutes()
    {
        var user = new ReactRack.Entities.User
        {
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
        };

        var repository = new InMemoryUserRepository([user]);
        var emailSender = new SpyEmailSender();
        var useCase = new SendResetOtpUseCase(repository, emailSender);
        var before = DateTimeOffset.UtcNow;

        await useCase.ExecuteAsync(new SendResetOtpRequest("gui@reactrack.dev"), CancellationToken.None);

        var after = DateTimeOffset.UtcNow;
        Assert.True(user.ResetOtpExpireAt.HasValue);
        Assert.InRange(user.ResetOtpExpireAt!.Value, before.AddMinutes(14), after.AddMinutes(16));
    }
}
