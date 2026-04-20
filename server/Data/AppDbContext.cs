using Microsoft.EntityFrameworkCore;
using server.Models;
using System.Data.Common;

namespace server.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Admin> Admins => Set<Admin>();
        public DbSet<BannedIp> BannedIps => Set<BannedIp>();
    }
}
