using Communication.Responses.API.Interfaces;

namespace Communication.Responses.API
{
    public sealed record APIResponse(bool Success, string Message) : IAPIResponse { }
}
