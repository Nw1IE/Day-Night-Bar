using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Properties.Services
{
    public class PromotionService(AppDbContext db)
    {
        public async Task<List<Promotion>> GetActiveAsync() =>
        await db.Promotions
            .Where(p => p.EndDate > DateTime.UtcNow)
            .OrderBy(p => p.EndDate)
            .ToListAsync();

        public async Task<Promotion> CreateAsync(string name, string desc, DateTime endDate)
        {
            var promo = new Promotion { Name = name, Description = desc, EndDate = endDate };
            db.Promotions.Add(promo);
            await db.SaveChangesAsync();
            return promo;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var promo = await db.Promotions.FindAsync(id);
            if (promo == null) return false;

            db.Promotions.Remove(promo);
            await db.SaveChangesAsync();
            return true;
        }
    }
}
