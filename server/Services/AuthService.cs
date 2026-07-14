using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Properties.Services
{
    public class AuthService(AppDbContext db)
    {
        public async Task<bool> VerifyAdminAsync(string passcode)
        {
            var admin = await db.Admins.FirstOrDefaultAsync();
            if (admin == null) return false;

            return BCrypt.Net.BCrypt.Verify(passcode, admin.PasscodeHash);
        }
    }
}
