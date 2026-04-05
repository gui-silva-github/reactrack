using Exceptions.NotFound;
using Exceptions.Validation;
using ReactRack.Tests.TestDoubles;
using ReactRack.UseCases.Auth.SendVerifyOtp;
using Xunit;

namespace ReactRack.Tests.UseCases.Auth;

public sealed class SendVerifyOtpUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_WhenUserDoesNotExist_ShouldThrowNotFoundException()
    {
        var repository = new InMemoryUserRepository();
        var emailSender = new SpyEmailSender();
        var useCase = new SendVerifyOtpUseCase(repository, emailSender);

        await Assert.ThrowsAsync<NotFoundReactRackException>(() =>
            useCase.ExecuteAsync(Guid.NewGuid(), CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenAccountAlreadyVerified_ShouldThrowValidationException()
    {
        var user = new ReactRack.Entities.User
        {
            Id = Guid.NewGuid(),
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            IsAccountVerified = true
        };

        var repository = new InMemoryUserRepository([user]);
        var emailSender = new SpyEmailSender();
        var useCase = new SendVerifyOtpUseCase(repository, emailSender);

        await Assert.ThrowsAsync<ValidationReactRackException>(() =>
            useCase.ExecuteAsync(user.Id, CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenUserIsValid_ShouldReturnSuccessAndSendEmail()
    {
        var user = new ReactRack.Entities.User
        {
            Id = Guid.NewGuid(),
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            IsAccountVerified = false
        };

        var repository = new InMemoryUserRepository([user]);
        var emailSender = new SpyEmailSender();
        var useCase = new SendVerifyOtpUseCase(repository, emailSender);

        var response = await useCase.ExecuteAsync(user.Id, CancellationToken.None);

        Assert.True(response.Success);
        Assert.Equal("Código de verificação enviado para o seu email.", response.Message);
        Assert.Equal(1, emailSender.CallCount);
        Assert.Equal("gui@reactrack.dev", emailSender.LastToEmail);
    }

    [Fact]
    public async Task ExecuteAsync_WhenUserIsValid_ShouldSetOtpAndExpiration()
    {
        var user = new ReactRack.Entities.User
        {
            Id = Guid.NewGuid(),
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
        };

        var repository = new InMemoryUserRepository([user]);
        var emailSender = new SpyEmailSender();
        var useCase = new SendVerifyOtpUseCase(repository, emailSender);
        var before = DateTimeOffset.UtcNow;

        await useCase.ExecuteAsync(user.Id, CancellationToken.None);

        var after = DateTimeOffset.UtcNow;
        Assert.Matches("^[0-9]{6}$", user.VerifyOtp);
        Assert.True(user.VerifyOtpExpireAt.HasValue);
        Assert.InRange(user.VerifyOtpExpireAt!.Value, before.AddHours(23), after.AddHours(25));
    }
}
