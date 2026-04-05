using ReactRack.Entities;
using ReactRack.Infrastructure.Repositories.Interfaces;

namespace ReactRack.Tests.TestDoubles;

internal sealed class InMemoryUserRepository : IUserRepository
{
    private readonly List<User> _users = [];

    public User? LastCreatedUser { get; private set; }

    public InMemoryUserRepository(IEnumerable<User>? seed = null)
    {
        if (seed is not null)
        {
            _users.AddRange(seed);
        }
    }

    public Task<User?> FindByIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = _users.FirstOrDefault(u => u.Id == userId);
        return Task.FromResult(user);
    }

    public Task<User?> FindByEmailAsync(string email, CancellationToken cancellationToken)
    {
        var normalized = email.Trim().ToLowerInvariant();
        var user = _users.FirstOrDefault(u => u.Email == normalized);
        return Task.FromResult(user);
    }

    public Task CreateAsync(User user, CancellationToken cancellationToken)
    {
        _users.Add(user);
        LastCreatedUser = user;
        return Task.CompletedTask;
    }

    public Task UpdateAsync(User user, CancellationToken cancellationToken)
    {
        var index = _users.FindIndex(u => u.Id == user.Id);
        if (index >= 0)
        {
            _users[index] = user;
        }
        return Task.CompletedTask;
    }
}
