namespace server.Models
{
    public class Announcement
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
    }
}