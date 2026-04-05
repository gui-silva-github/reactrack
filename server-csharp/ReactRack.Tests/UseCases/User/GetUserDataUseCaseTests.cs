using Exceptions.NotFound;
using ReactRack.Tests.TestDoubles;
using ReactRack.UseCases.User;
using Xunit;

namespace ReactRack.Tests.UseCases.User;

public sealed class GetUserDataUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_WhenUserDoesNotExist_ShouldThrowNotFoundException()
    {
        var repository = new InMemoryUserRepository();
        var useCase = new GetUserDataUseCase(repository);

        await Assert.ThrowsAsync<NotFoundReactRackException>(() =>
            useCase.ExecuteAsync(Guid.NewGuid(), CancellationToken.None));
    }

    [Fact]
    public async Task ExecuteAsync_WhenUserExists_ShouldReturnPayload()
    {
        var userId = Guid.NewGuid();
        var existingUser = new ReactRack.Entities.User
        {
            Id = userId,
            Name = "Gui",
            Email = "gui@reactrack.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            IsAccountVerified = true
        };

        var repository = new InMemoryUserRepository([existingUser]);
        var useCase = new GetUserDataUseCase(repository);

        var response = await useCase.ExecuteAsync(userId, CancellationToken.None);

        Assert.True(response.Success);
        Assert.Equal(userId, response.UserData.Id);
        Assert.Equal("Gui", response.UserData.Name);
        Assert.Equal("gui@reactrack.dev", response.UserData.Email);
        Assert.True(response.UserData.IsAccountVerified);
    }
}
