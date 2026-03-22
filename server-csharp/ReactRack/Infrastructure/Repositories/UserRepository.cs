using Microsoft.EntityFrameworkCore;
using ReactRack.Entities;
using ReactRack.Infrastructure.Persistence;
using ReactRack.Infrastructure.Repositories.Interfaces;

namespace ReactRack.Infrastructure.Repositories
{
    public sealed class UserRepository(ReactRackDbContext reactRackDbContext) : IUserRepository
    {
        public async Task<User?> FindByIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            return await reactRackDbContext.Users.FirstOrDefaultAsync(user => user.Id == userId, cancellationToken);
        }

        public async Task<User?> FindByEmailAsync(string email, CancellationToken cancellationToken)
        {
            var sanitizedEmail = email.Trim().ToLowerInvariant();
            return await reactRackDbContext.Users.FirstOrDefaultAsync(user => user.Email == sanitizedEmail, cancellationToken);
        }

        public async Task CreateAsync(User user, CancellationToken cancellationToken)
        {
            await reactRackDbContext.Users.AddAsync(user, cancellationToken);
            await reactRackDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(User user, CancellationToken cancellationToken)
        {
            reactRackDbContext.Users.Update(user);
            await reactRackDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
