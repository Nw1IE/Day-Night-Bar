namespace server.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime BookingTime { get; set; }
        public int GuestsCount { get; set; }
        public bool IsConfirmed { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
