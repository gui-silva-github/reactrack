using Communication.Requests.ValidateResetOtp;
using Exceptions.NotFound;
using Exceptions.Unauthorized;
using Exceptions.Validation;
using ReactRack.Tests.TestDoubles;
using ReactRack.UseCases.Auth.ValidateResetOtp;
using Xunit;

namespace ReactRack.Tests.UseCases.Auth;

public sealed class ValidateResetOtpUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_WhenFieldsAreMissing_ShouldThrowValidationException()
    {
        var repository = new InMemoryUserRepository();
        var useCase = new ValidateResetOtpUseCase(repository);

        await Assert.ThrowsAsync<ValidationReactRackException>(() =>
            useCase.ExecuteAsync(new ValidateResetOtpRequest("", ""), CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenUserDoesNotExist_ShouldThrowNotFoundException()
    {
        var repository = new InMemoryUserRepository();
        var useCase = new ValidateResetOtpUseCase(repository);

        await Assert.ThrowsAsync<NotFoundReactRackException>(() =>
            useCase.ExecuteAsync(new ValidateResetOtpRequest("unknown@reactrack.dev", "123456"), CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenOtpIsDifferent_ShouldThrowUnauthorizedException()
    {
        var user = new ReactRack.Entities.User
        {
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            ResetOtp = "123456",
            ResetOtpExpireAt = DateTimeOffset.UtcNow.AddMinutes(10)
        };

        var repository = new InMemoryUserRepository([user]);
        var useCase = new ValidateResetOtpUseCase(repository);

        await Assert.ThrowsAsync<UnauthorizedReactRackException>(() =>
            useCase.ExecuteAsync(new ValidateResetOtpRequest("gui@reactrack.dev", "654321"), CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenOtpIsExpired_ShouldThrowUnauthorizedException()
    {
        var user = new ReactRack.Entities.User
        {
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            ResetOtp = "123456",
            ResetOtpExpireAt = DateTimeOffset.UtcNow.AddMinutes(-1)
        };

        var repository = new InMemoryUserRepository([user]);
        var useCase = new ValidateResetOtpUseCase(repository);

        await Assert.ThrowsAsync<UnauthorizedReactRackException>(() =>
            useCase.ExecuteAsync(new ValidateResetOtpRequest("gui@reactrack.dev", "123456"), CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenOtpIsValid_ShouldReturnSuccess()
    {
        var user = new ReactRack.Entities.User
        {
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            ResetOtp = "123456",
            ResetOtpExpireAt = DateTimeOffset.UtcNow.AddMinutes(10)
        };

        var repository = new InMemoryUserRepository([user]);
        var useCase = new ValidateResetOtpUseCase(repository);

        var response = await useCase.ExecuteAsync(
            new ValidateResetOtpRequest("gui@reactrack.dev", "123456"),
            CancellationToken.None);

        Assert.True(response.Success);
        Assert.Equal("OTP válida. Informe a nova senha.", response.Message);
    }
}
