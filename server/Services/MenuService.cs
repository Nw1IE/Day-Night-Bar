using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Properties.Services
{
    public class MenuService(AppDbContext db)
    {
        public async Task<List<Menu>> GetAllAsync() => await db.Menus.ToListAsync();

        public async Task<Menu?> GetByIdAsync(int id) => await db.Menus.FindAsync(id);

        public async Task<Menu> CreateAsync(Menu item)
        {
            db.Menus.Add(item);
            await db.SaveChangesAsync();
            return item;
        }

        public async Task UpdateAsync(Menu item)
        {
            db.Entry(item).State = EntityState.Modified;
            await db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var item = await db.Menus.FindAsync(id);
            if (item != null)
            {
                db.Menus.Remove(item);
                await db.SaveChangesAsync();
            }
        }
    }
}
