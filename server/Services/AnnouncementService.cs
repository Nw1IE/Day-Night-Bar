using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Properties.Services
{
    public class AnnouncementService(AppDbContext db, ILogger<AnnouncementService> logger)
    {
        public async Task<Announcement?> GetCurrentAsync()
        {
            try
            {
                return await db.Announcements
                .OrderByDescending(a => a.UpdatedAt)
                .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "(метод в AnnouncementService - GetCurrentAsync)");
                throw;
            }
        }

        public async Task<Announcement?> GetByIdAsync(int id)
        {
            try
            {
                return await db.Announcements.FindAsync(id);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "(метод в AnnouncementService - GetByIdAsync)");
                throw;
            }
            
        }

        public async Task<Announcement> CreateAsync(string text)
        {
            try
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
            catch (Exception ex)
            {
                logger.LogError(ex, "(метод в AnnouncementService - CreateAsync)");
                throw;
            }
        }

        public async Task UpdateAsync(Announcement announcement)
        {
            try
            {
                db.Entry(announcement).State = EntityState.Modified;
                await db.SaveChangesAsync();
            }
            catch (Exception ex )
            {
                logger.LogError(ex, "(метод в AnnouncementService - UpdateAsync)");
                throw;
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var announcement = await db.Announcements.FindAsync(id);
                if (announcement != null)
                {
                    db.Announcements.Remove(announcement);
                    await db.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "(метод в AnnouncementService - DeleteAsync)");
                throw;
            }
        }
    }
}
