using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace ReactRack.Infrastructure.Security;

internal static class JwtSigningKeyFactory
{
    public static SymmetricSecurityKey Create(string secret)
    {
        if (string.IsNullOrEmpty(secret))
        {
            throw new ArgumentException("JWT não pode ser vazio.", nameof(secret));
        }

        var utf8 = Encoding.UTF8.GetBytes(secret);
        if (utf8.Length >= 16)
        {
            return new SymmetricSecurityKey(utf8);
        }

        var keyBytes = SHA256.HashData(utf8);
        return new SymmetricSecurityKey(keyBytes);
    }
}
