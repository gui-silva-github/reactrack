using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using ReactRack.Infrastructure.Security;
using ReactRack.Infrastructure.Settings.Jwt;
using Xunit;

namespace ReactRack.Tests.Infrastructure.Security;

public sealed class JwtTokenServiceTests
{
    [Fact]
    public void Generate_WhenCalled_ShouldReturnValidJwtToken()
    {
        var options = Options.Create(new JwtOptions
        {
            SecretKey = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
            Issuer = "ReactRack.Api",
            Audience = "ReactRack.Client"
        });
        var service = new JwtTokenService(options);
        var user = new ReactRack.Entities.User
        {
            Id = Guid.NewGuid(),
            Name = "Gui",
            Email = "gui@reactrack.dev"
        };

        var token = service.Generate(user);

        Assert.False(string.IsNullOrWhiteSpace(token));
        Assert.Equal(3, token.Split('.').Length);
    }

    [Fact]
    public void Generate_WhenCalled_ShouldContainExpectedClaims()
    {
        var options = Options.Create(new JwtOptions
        {
            SecretKey = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
            Issuer = "ReactRack.Api",
            Audience = "ReactRack.Client"
        });
        var service = new JwtTokenService(options);
        var user = new ReactRack.Entities.User
        {
            Id = Guid.NewGuid(),
            Name = "Gui",
            Email = "gui@reactrack.dev"
        };

        var token = service.Generate(user);
        var parsed = new JwtSecurityTokenHandler().ReadJwtToken(token);

        Assert.Equal("ReactRack.Api", parsed.Issuer);
        Assert.Contains(parsed.Audiences, a => a == "ReactRack.Client");
        Assert.Equal(user.Id.ToString(), parsed.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
        Assert.Equal("Gui", parsed.Claims.First(c => c.Type == ClaimTypes.Name).Value);
        Assert.Equal("gui@reactrack.dev", parsed.Claims.First(c => c.Type == ClaimTypes.Email).Value);
    }
}
