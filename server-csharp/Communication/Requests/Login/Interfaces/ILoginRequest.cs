namespace Communication.Requests.Login.Interfaces
{
    public interface ILoginRequest
    {
        public string Email { get; }
        public string Password { get; }
    }
}
