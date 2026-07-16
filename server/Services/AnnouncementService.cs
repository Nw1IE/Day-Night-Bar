using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Properties.Services
{
    public class AnnouncementService(AppDbContext db)
    {
        public async Task<Announcement?> GetCurrentAsync() =>
            await db.Announcements
                .OrderByDescending(a => a.UpdatedAt)
                .FirstOrDefaultAsync();

        public async Task<Announcement?> GetByIdAsync(int id) =>
            await db.Announcements.FindAsync(id);

        public async Task<Announcement> CreateAsync(string text)
        {
            var announcement = new Announcement
            {
                Text = text,
                UpdatedAt = DateTime.UtcNow
            };
            db.Announcements.Add(announcement);
            await db.SaveChangesAsync();
            return announcement;
        }

        public async Task UpdateAsync(Announcement announcement)
        {
            db.Entry(announcement).State = EntityState.Modified;
            await db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var announcement = await db.Announcements.FindAsync(id);
            if (announcement != null)
            {
                db.Announcements.Remove(announcement);
                await db.SaveChangesAsync();
            }
        }
    }
}
