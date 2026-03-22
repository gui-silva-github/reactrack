using Communication.Requests.Login.Interfaces;

namespace Communication.Requests.Login
{
    public sealed record LoginRequest(string Email, string Password) : ILoginRequest { }
}
