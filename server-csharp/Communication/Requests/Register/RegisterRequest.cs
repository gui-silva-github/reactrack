using Communication.Requests.Register.Interfaces;

namespace Communication.Requests.Register
{
    public sealed record RegisterRequest(string Name, string Email, string Password) : IRegisterRequest { }
}
