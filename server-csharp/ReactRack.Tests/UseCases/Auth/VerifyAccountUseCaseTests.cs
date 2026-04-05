using Communication.Requests.VerifyAccount;
using Exceptions.NotFound;
using Exceptions.Unauthorized;
using Exceptions.Validation;
using ReactRack.Tests.TestDoubles;
using ReactRack.UseCases.Auth.VerifyAccount;
using Xunit;

namespace ReactRack.Tests.UseCases.Auth;

public sealed class VerifyAccountUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_WhenOtpIsMissing_ShouldThrowValidationException()
    {
        var repository = new InMemoryUserRepository();
        var useCase = new VerifyAccountUseCase(repository);

        await Assert.ThrowsAsync<ValidationReactRackException>(() =>
            useCase.ExecuteAsync(Guid.NewGuid(), new VerifyAccountRequest(""), CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenUserDoesNotExist_ShouldThrowNotFoundException()
    {
        var repository = new InMemoryUserRepository();
        var useCase = new VerifyAccountUseCase(repository);

        await Assert.ThrowsAsync<NotFoundReactRackException>(() =>
            useCase.ExecuteAsync(Guid.NewGuid(), new VerifyAccountRequest("123456"), CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenOtpIsInvalid_ShouldThrowUnauthorizedException()
    {
        var user = new ReactRack.Entities.User
        {
            Id = Guid.NewGuid(),
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            VerifyOtp = "123456",
            VerifyOtpExpireAt = DateTimeOffset.UtcNow.AddMinutes(10)
        };

        var repository = new InMemoryUserRepository([user]);
        var useCase = new VerifyAccountUseCase(repository);

        await Assert.ThrowsAsync<UnauthorizedReactRackException>(() =>
            useCase.ExecuteAsync(user.Id, new VerifyAccountRequest("654321"), CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenOtpIsValid_ShouldVerifyAccountAndClearOtp()
    {
        var user = new ReactRack.Entities.User
        {
            Id = Guid.NewGuid(),
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            VerifyOtp = "123456",
            VerifyOtpExpireAt = DateTimeOffset.UtcNow.AddMinutes(10),
            IsAccountVerified = false
        };

        var repository = new InMemoryUserRepository([user]);
        var useCase = new VerifyAccountUseCase(repository);

        var response = await useCase.ExecuteAsync(user.Id, new VerifyAccountRequest("123456"), CancellationToken.None);

        Assert.True(response.Success);
        Assert.Equal("Conta verificada com sucesso.", response.Message);
        Assert.True(user.IsAccountVerified);
        Assert.Equal(string.Empty, user.VerifyOtp);
        Assert.Null(user.VerifyOtpExpireAt);
    }
}
