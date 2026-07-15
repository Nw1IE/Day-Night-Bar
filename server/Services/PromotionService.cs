using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Properties.Services
{
    public class PromotionService(AppDbContext db)
    {
        public async Task<List<Promotion>> GetActiveAsync() =>
            await db.Promotions
                .Where(p => p.StartDate <= DateTime.UtcNow && p.EndDate > DateTime.UtcNow)
                .OrderBy(p => p.EndDate)
                .ToListAsync();

        public async Task<List<Promotion>> GetAllAsync() =>
            await db.Promotions
                .OrderByDescending(p => p.StartDate)
                .ToListAsync();

        public async Task<Promotion?> GetByIdAsync(int id) =>
            await db.Promotions.FindAsync(id);

        public async Task<Promotion> CreateAsync(string name, string desc, DateTime startDate, DateTime endDate)
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

        public async Task UpdateAsync(Promotion promo)
        {
            db.Entry(promo).State = EntityState.Modified;
            await db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var promo = await db.Promotions.FindAsync(id);
            if (promo != null)
            {
                db.Promotions.Remove(promo);
                await db.SaveChangesAsync();
            }
        }
    }
}