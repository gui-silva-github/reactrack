using Communication.Requests.ResetPassword;
using Exceptions.NotFound;
using Exceptions.Unauthorized;
using Exceptions.Validation;
using ReactRack.Tests.TestDoubles;
using ReactRack.UseCases.Auth.ResetPassword;
using Xunit;

namespace ReactRack.Tests.UseCases.Auth;

public sealed class ResetPasswordUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_WhenFieldsAreMissing_ShouldThrowValidationException()
    {
        var repository = new InMemoryUserRepository();
        var useCase = new ResetPasswordUseCase(repository);

        await Assert.ThrowsAsync<ValidationReactRackException>(() =>
            useCase.ExecuteAsync(new ResetPasswordRequest("", "", ""), CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenUserDoesNotExist_ShouldThrowNotFoundException()
    {
        var repository = new InMemoryUserRepository();
        var useCase = new ResetPasswordUseCase(repository);

        await Assert.ThrowsAsync<NotFoundReactRackException>(() =>
            useCase.ExecuteAsync(
                new ResetPasswordRequest("unknown@reactrack.dev", "123456", "new-password"),
                CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenOtpIsInvalid_ShouldThrowUnauthorizedException()
    {
        var user = new ReactRack.Entities.User
        {
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("old-password"),
            ResetOtp = "123456",
            ResetOtpExpireAt = DateTimeOffset.UtcNow.AddMinutes(10)
        };

        var repository = new InMemoryUserRepository([user]);
        var useCase = new ResetPasswordUseCase(repository);

        await Assert.ThrowsAsync<UnauthorizedReactRackException>(() =>
            useCase.ExecuteAsync(
                new ResetPasswordRequest("gui@reactrack.dev", "654321", "new-password"),
                CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenOtpIsExpired_ShouldThrowUnauthorizedException()
    {
        var user = new ReactRack.Entities.User
        {
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("old-password"),
            ResetOtp = "123456",
            ResetOtpExpireAt = DateTimeOffset.UtcNow.AddMinutes(-2)
        };

        var repository = new InMemoryUserRepository([user]);
        var useCase = new ResetPasswordUseCase(repository);

        await Assert.ThrowsAsync<UnauthorizedReactRackException>(() =>
            useCase.ExecuteAsync(
                new ResetPasswordRequest("gui@reactrack.dev", "123456", "new-password"),
                CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenRequestIsValid_ShouldResetPasswordAndClearOtp()
    {
        var user = new ReactRack.Entities.User
        {
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("old-password"),
            ResetOtp = "123456",
            ResetOtpExpireAt = DateTimeOffset.UtcNow.AddMinutes(10)
        };

        var repository = new InMemoryUserRepository([user]);
        var useCase = new ResetPasswordUseCase(repository);

        var response = await useCase.ExecuteAsync(
            new ResetPasswordRequest("gui@reactrack.dev", "123456", "new-password"),
            CancellationToken.None);

        Assert.True(response.Success);
        Assert.Equal("Senha redefinida com sucesso.", response.Message);
        Assert.True(BCrypt.Net.BCrypt.Verify("new-password", user.PasswordHash));
        Assert.Equal(string.Empty, user.ResetOtp);
        Assert.Null(user.ResetOtpExpireAt);
    }
}
