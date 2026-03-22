namespace Communication.Requests.ValidateResetOtp.Interfaces
{
    public interface IValidateResetOtpRequest
    {
        string Email { get; }
        string Otp { get; }
    }
}
