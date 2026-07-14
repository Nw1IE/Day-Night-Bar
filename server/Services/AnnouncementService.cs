using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Properties.Services
{
    public class AnnouncementService(AppDbContext db)
    {
        public async Task<Announcment?> GetCurrentAsync() =>
            await db.Announcements.FirstOrDefaultAsync();

        public async Task UpdateOrCreateAsync(string message)
        {
            var announcement = await db.Announcements.FirstOrDefaultAsync();

            if (announcement == null)
            {
                db.Announcements.Add(new Announcment
                {
                    Text = message,
                    UpdatedAt = DateTime.UtcNow
                });
            }
            else
            {
                announcement.Text = message;
                announcement.UpdatedAt = DateTime.UtcNow;
            }

            await db.SaveChangesAsync();
        }
    }
}
