using Communication.Responses.UserData.Interfaces;

namespace Communication.Responses.UserData
{
    public sealed record UserDataResponse(bool Success, UserDataPayload UserData) : IUserDataResponse { }
}
