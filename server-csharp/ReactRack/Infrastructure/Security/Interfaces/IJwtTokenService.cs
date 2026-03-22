using ReactRack.Entities;

namespace ReactRack.Infrastructure.Security.Interfaces
{
    public interface IJwtTokenService
    {
        string Generate(User user);
    }
}
