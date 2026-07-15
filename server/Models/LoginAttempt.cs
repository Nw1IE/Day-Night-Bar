namespace server.Models
{
    public class LoginAttempt
    {
        public int Id { get; set; }
        public string IpAddress { get; set; } = string.Empty;
        public int FailedCount { get; set; }
        public DateTime LastAttempt { get; set; }
    }
}
