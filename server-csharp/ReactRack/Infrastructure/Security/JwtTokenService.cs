using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ReactRack.Entities;
using ReactRack.Infrastructure.Security.Interfaces;
using ReactRack.Infrastructure.Settings.Jwt;

namespace ReactRack.Infrastructure.Security
{
    public sealed class JwtTokenService(IOptions<JwtOptions> options) : IJwtTokenService
    {
        private readonly JwtOptions _jwtOptions = options.Value;

        public string Generate(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var signingCredentials = new SigningCredentials(
                JwtSigningKeyFactory.Create(_jwtOptions.SecretKey),
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: signingCredentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
