namespace Communication.Responses.API.Interfaces
{
    public interface IAPIResponse
    {
        bool Success { get; }
        string Message { get; }
    }
}
