using Communication.Requests.Login;
using Exceptions.Unauthorized;
using Exceptions.Validation;
using ReactRack.Tests.TestDoubles;
using ReactRack.UseCases.Auth.Login;
using Xunit;

namespace ReactRack.Tests.UseCases.Auth;

public sealed class LoginUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_WhenFieldsAreMissing_ShouldThrowValidationException()
    {
        var repository = new InMemoryUserRepository();
        var useCase = new LoginUseCase(repository);
        var request = new LoginRequest("", "");

        await Assert.ThrowsAsync<ValidationReactRackException>(() =>
            useCase.ExecuteAsync(request, CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenCredentialsAreInvalid_ShouldThrowUnauthorizedException()
    {
        var existingUser = new ReactRack.Entities.User
        {
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("correct-password")
        };

        var repository = new InMemoryUserRepository([existingUser]);
        var useCase = new LoginUseCase(repository);
        var request = new LoginRequest("gui@reactrack.dev", "wrong-password");

        await Assert.ThrowsAsync<UnauthorizedReactRackException>(() =>
            useCase.ExecuteAsync(request, CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenCredentialsAreValid_ShouldReturnSuccessResponse()
    {
        var userId = Guid.NewGuid();
        var existingUser = new ReactRack.Entities.User
        {
            Id = userId,
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("valid-password")
        };

        var repository = new InMemoryUserRepository([existingUser]);
        var useCase = new LoginUseCase(repository);
        var request = new LoginRequest("gui@reactrack.dev", "valid-password");

        var response = await useCase.ExecuteAsync(request, CancellationToken.None);

        Assert.True(response.Success);
        Assert.Equal(userId, response.Id);
        Assert.Equal("gui@reactrack.dev", response.Email);
        Assert.Equal("Gui", response.Name);
    }
}
