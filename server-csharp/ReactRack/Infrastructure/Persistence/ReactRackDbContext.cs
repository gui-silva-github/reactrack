using Microsoft.EntityFrameworkCore;
using ReactRack.Entities;

namespace ReactRack.Infrastructure.Persistence
{
    public sealed class ReactRackDbContext(DbContextOptions<ReactRackDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(u => u.Id);

                entity.Property(user => user.Name).HasMaxLength(120).IsRequired();
                entity.Property(user => user.Email).HasMaxLength(200).IsRequired();
                entity.Property(user => user.PasswordHash).HasMaxLength(300).IsRequired();
                entity.Property(user => user.VerifyOtp).HasMaxLength(12);
                entity.Property(user => user.ResetOtp).HasMaxLength(12);

                entity.HasIndex(user => user.Email).IsUnique(); 
            });
        }
    }
}
