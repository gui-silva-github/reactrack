using Communication.Requests.VerifyAccount.Interfaces;

namespace Communication.Requests.VerifyAccount
{
    public sealed record VerifyAccountRequest(string Otp) : IVerifyAccountRequest { }
}
