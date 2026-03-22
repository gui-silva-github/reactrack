namespace Exceptions.ReactRack
{
    public abstract class ReactRackException(string message, int statusCode) : System.Exception(message)
    {
        public int StatusCode { get; } = statusCode;
    }
}
