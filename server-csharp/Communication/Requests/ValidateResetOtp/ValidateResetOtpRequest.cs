using Communication.Requests.ValidateResetOtp.Interfaces;

namespace Communication.Requests.ValidateResetOtp
{
    public sealed record ValidateResetOtpRequest(string Email, string Otp) : IValidateResetOtpRequest { }
}
