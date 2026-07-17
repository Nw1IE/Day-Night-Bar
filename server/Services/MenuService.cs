using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using server.Data;
using server.Models;

namespace server.Properties.Services
{
    public class MenuService(AppDbContext db, ILogger<MenuService> logger)
    {
        public async Task<List<Menu>> GetAllAsync()
        {
            try
            {
                return await db.Menus.ToListAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "(метод в MenuService - GetAllAsync)");
                throw;
            }
        }

        public async Task<Menu?> GetByIdAsync(int id)
        {
            try 
            { 
                return await db.Menus.FindAsync(id);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"(метод в MenuService - GetByIdAsync)");
                throw;
            }
        }

        public async Task<Menu> CreateAsync(Menu item)
        {
            try
            {
                db.Menus.Add(item);
                await db.SaveChangesAsync();
                return item;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "(метод в MenuService - CreateAsync)"); 
                throw;
            }
        }

        public async Task UpdateAsync(Menu item)
        {
            try
            {
                db.Entry(item).State = EntityState.Modified;
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"(метод в MenuService - UpdateAsync)");
                throw;
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var item = await db.Menus.FindAsync(id);
                if (item != null)
                {
                    db.Menus.Remove(item);
                    await db.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"(метод в MenuService - DeleteAsync)");
                throw;
            }
        }
    }
}
