namespace Communication.Responses.Auth.Interfaces
{
    public interface IAuthResponse
    {
        bool Success { get; }
        string Message { get; }
        Guid? Id { get; }
        string? Name { get; }
        string? Email { get; }
    }
}
