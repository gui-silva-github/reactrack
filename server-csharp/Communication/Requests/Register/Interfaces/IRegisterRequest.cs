namespace Communication.Requests.Register.Interfaces
{
    public interface IRegisterRequest
    {
        string Name { get; }
        string Email { get; }
        string Password { get; }
    }
}
