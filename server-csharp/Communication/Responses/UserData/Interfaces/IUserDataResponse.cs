namespace Communication.Responses.UserData.Interfaces
{
    public interface IUserDataResponse
    {
        bool Success {  get; }
        UserDataPayload UserData { get; }
    }

    public sealed record UserDataPayload(Guid Id, string Name, string Email, bool IsAccountVerified);
}
