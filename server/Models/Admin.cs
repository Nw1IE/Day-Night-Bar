namespace server.Models
{
    public class Admin
    {
        public int Id { get; set; }
        public string PasscodeHash { get; set; } = string.Empty;
    }
}