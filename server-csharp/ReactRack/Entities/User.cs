namespace ReactRack.Entities
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        public bool IsAccountVerified { get; set; }
        public string VerifyOtp { get; set; } = string.Empty;
        public DateTimeOffset? VerifyOtpExpireAt { get; set; }
        public string ResetOtp { get; set; } = string.Empty;
        public DateTimeOffset? ResetOtpExpireAt { get; set; }
    }
}
