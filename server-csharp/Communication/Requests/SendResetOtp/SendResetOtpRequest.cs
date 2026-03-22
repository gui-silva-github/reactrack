using Communication.Requests.SendResetOtp.Interfaces;

namespace Communication.Requests.SendResetOtp
{
    public sealed record SendResetOtpRequest(string Email) : ISendResetOtpRequest { }
}
