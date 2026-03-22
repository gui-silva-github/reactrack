using Communication.Requests.ResetPassword.Interfaces;

namespace Communication.Requests.ResetPassword
{
    public sealed record ResetPasswordRequest(string Email, string Otp, string NewPassword) : IResetPasswordRequest { }
}
