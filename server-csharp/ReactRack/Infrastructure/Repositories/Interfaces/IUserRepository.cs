using ReactRack.Entities;

namespace ReactRack.Infrastructure.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> FindByIdAsync(Guid userId, CancellationToken cancellationToken);
        Task<User?> FindByEmailAsync(string email, CancellationToken cancellationToken);
        Task CreateAsync(User user, CancellationToken cancellationToken);
        Task UpdateAsync(User user, CancellationToken cancellationToken);
    }
}
