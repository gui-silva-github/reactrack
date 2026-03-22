namespace ReactRack.Infrastructure.Settings.Jwt
{
    public sealed class JwtOptions
    {
        public string SecretKey { get; set; } = "secret-key";
        public string Issuer { get; set; } = "ReactRack.Api";
        public string Audience { get; set; } = "ReactRack.Client";
    }
}
