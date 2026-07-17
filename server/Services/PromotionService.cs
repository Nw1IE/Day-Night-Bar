using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Properties.Services
{
    public class PromotionService(AppDbContext db, ILogger<AnnouncementService> logger)
    {
        public async Task<List<Promotion>> GetActiveAsync()
        {
            try
            {
                return await db.Promotions
                .Where(p => p.StartDate <= DateTime.UtcNow && p.EndDate > DateTime.UtcNow)
                .OrderBy(p => p.EndDate)
                .ToListAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "(метод в PromotionService - GetActiveAsync)");
                throw;
            }
            
        }

        public async Task<List<Promotion>> GetAllAsync()
        {
            try
            {
                return await db.Promotions
                .OrderByDescending(p => p.StartDate)
                .ToListAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "(метод в PromotionService - GetAllAsync)");
                throw;
            }
        }

        public async Task<Promotion?> GetByIdAsync(int id)
        {
            try
            {
                return await db.Promotions.FindAsync(id);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "(метод в PromotionService - GetByIdAsync)");
                throw;
            }
        }

        public async Task<Promotion> CreateAsync(string name, string desc, DateTime startDate, DateTime endDate)
        {
            try
            {
                var promo = new Promotion
                {
                    Name = name,
                    Description = desc,
                    StartDate = startDate,
                    EndDate = endDate
                };
                db.Promotions.Add(promo);
                await db.SaveChangesAsync();
                return promo;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "(метод в PromotionService - CreateAsync)");
                throw;
            }
        }

        public async Task UpdateAsync(Promotion promo)
        {
            try
            {
                db.Entry(promo).State = EntityState.Modified;
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "(метод в PromotionService - UpdateAsync)");
                throw;
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var promo = await db.Promotions.FindAsync(id);
                if (promo != null)
                {
                    db.Promotions.Remove(promo);
                    await db.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "(метод в PromotionService - DeleteAsync)");
                throw;
            }
        }
    }
}