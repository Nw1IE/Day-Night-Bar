using Microsoft.EntityFrameworkCore;
using server.Models;
using System.Data.Common;

namespace server.Data
{
    public class AppDbContext : DbContext
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<AppDbContext> _logger;

        public AppDbContext(DbContextOptions<AppDbContext> options,
            IConfiguration configuration,
            ILogger<AppDbContext> logger)
            : base(options)
        {
            _configuration = configuration;
            _logger = logger;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var connectionString = Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING");

                if (string.IsNullOrEmpty(connectionString))
                {
                    _logger.LogError("DATABASE_CONNECTION_STRING not found in environment variables or configuration");
                    throw new InvalidOperationException(
                        "DATABASE_CONNECTION_STRING environment variable or DefaultConnection in appsettings is not set.");
                }

                _logger.LogInformation("Connecting to PostgreSQL database");
                optionsBuilder.UseNpgsql(connectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.PasscodeHash).IsRequired();
            });

            modelBuilder.Entity<BannedIp>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.IpAddress).IsRequired().HasMaxLength(45);
                entity.Property(e => e.BannedUntil).IsRequired();
                entity.Property(e => e.Reason).HasMaxLength(255).HasDefaultValue("Brute-force attempt");
            });

            modelBuilder.Entity<Announcment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Text).IsRequired().HasMaxLength(1000);
            });
        }

        public DbSet<Admin> Admins => Set<Admin>();
        public DbSet<BannedIp> BannedIps => Set<BannedIp>();
        public DbSet<Announcment> Announcements => Set<Announcment>();
    }
}
