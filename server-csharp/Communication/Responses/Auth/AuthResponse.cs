using Communication.Responses.Auth.Interfaces;

namespace Communication.Responses.Auth
{
    public sealed record AuthResponse(bool Success, string Message, Guid? Id = null, string? Name = null, string? Email = null) : IAuthResponse { }
}
