using Communication.Requests.Register;
using Exceptions.Conflict;
using Exceptions.Validation;
using ReactRack.Tests.TestDoubles;
using ReactRack.UseCases.Auth.Register;
using Xunit;

namespace ReactRack.Tests.UseCases.Auth;

public sealed class RegisterUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_WhenFieldsAreMissing_ShouldThrowValidationException()
    {
        var repository = new InMemoryUserRepository();
        var useCase = new RegisterUseCase(repository);
        var request = new RegisterRequest("", "   ", "");

        await Assert.ThrowsAsync<ValidationReactRackException>(() =>
            useCase.ExecuteAsync(request, CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenUserAlreadyExists_ShouldThrowConflictException()
    {
        var existingUser = new ReactRack.Entities.User
        {
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
        };

        var repository = new InMemoryUserRepository([existingUser]);
        var useCase = new RegisterUseCase(repository);
        var request = new RegisterRequest("Gui Silva", "gui@reactrack.dev", "123456");

        await Assert.ThrowsAsync<ConflictReactRackException>(() =>
            useCase.ExecuteAsync(request, CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenRequestIsValid_ShouldCreateUserAndReturnSuccess()
    {
        var repository = new InMemoryUserRepository();
        var useCase = new RegisterUseCase(repository);
        var request = new RegisterRequest("  Gui Silva  ", "GUI@REACTRACK.DEV", "123456");

        var response = await useCase.ExecuteAsync(request, CancellationToken.None);

        Assert.True(response.Success);
        Assert.Equal("Cadastro realizado com sucesso!", response.Message);
        Assert.NotNull(repository.LastCreatedUser);
        Assert.Equal("Gui Silva", repository.LastCreatedUser!.Name);
        Assert.Equal("gui@reactrack.dev", repository.LastCreatedUser.Email);
        Assert.True(BCrypt.Net.BCrypt.Verify("123456", repository.LastCreatedUser.PasswordHash));
    }
}
