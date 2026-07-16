namespace server.Models
{
    public class BannedIp
    {
        public int Id { get; set; }
        public string IpAddress { get; set; } = string.Empty;
        public DateTime BannedUntil { get; set; }
        public string Reason { get; set; } = "Brute-force attempt";
    }
}
