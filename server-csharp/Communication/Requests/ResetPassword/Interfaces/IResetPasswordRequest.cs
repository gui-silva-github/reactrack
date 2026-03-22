namespace Communication.Requests.ResetPassword.Interfaces
{
    public interface IResetPasswordRequest
    {
        string Email { get; }
        string Otp { get; }
        string NewPassword { get; }
    }
}
