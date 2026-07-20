using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Models.Enums;
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
                optionsBuilder.UseNpgsql(connectionString)
                    .EnableDetailedErrors();
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

            modelBuilder.Entity<Announcement>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Text).IsRequired().HasMaxLength(1000);

                entity.HasData(
                    new Announcement { Id = 1, Text = "Добро пожаловать в наш бар! Сегодня живая музыка с 20:00.", 
                        UpdatedAt = new DateTime(2026, 7, 17, 12, 0, 0, DateTimeKind.Utc) },
                    new Announcement { Id = 2, Text = "График работы в праздничные дни изменен. Ждем вас до 04:00!", 
                        UpdatedAt = new DateTime(2026, 9, 17, 12, 0, 0, DateTimeKind.Utc) }
                );
            });

            modelBuilder.Entity<Promotion>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired();

                entity.HasData(
                    new Promotion
                    {
                        Id = 1,
                        Name = "Счастливые часы",
                        Description = "Два коктейля по цене одного каждый вторник и четверг с 16:00 до 19:00.",
                        StartDate = new DateTime(2026, 7, 17, 12, 0, 0, DateTimeKind.Utc),
                        EndDate = new DateTime(2026, 9, 17, 12, 0, 0, DateTimeKind.Utc)
                    },
                    new Promotion
                    {
                        Id = 2,
                        Name = "Скидка в День Рождения",
                        Description = "Дарим скидку 15% на всё меню кухни при предъявлении паспорта.",
                        StartDate = new DateTime(2026, 7, 17, 12, 0, 0, DateTimeKind.Utc),
                        EndDate = new DateTime(2026, 9, 17, 12, 0, 0, DateTimeKind.Utc).AddHours(24)
                    }
                );
            });

            modelBuilder.Entity<Menu>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Category).HasConversion<string>();

                entity.HasData(
                    new Menu { Id = 1, Name = "Негрони", Description = "Джин, красный вермут, кампари, цедра апельсина", Price = 550.00m, Category = Category.Коктейли },
                    new Menu { Id = 2, Name = "Апероль Шприц", Description = "Апероль, просекко, содовая, апельсин", Price = 600.00m, Category = Category.Коктейли },
                    new Menu { Id = 3, Name = "Крафтовый ИПА", Description = "Светлый индийский эль с ярким хмелевым ароматом", Price = 380.00m, Category = Category.Пиво },
                    new Menu { Id = 4, Name = "Брускетта с томатами", Description = "Хрустящий багет, томаты, базилик, чеснок, оливковое масло", Price = 320.00m, Category = Category.Закуски },
                    new Menu { Id = 5, Name = "Стейк Рибай", Description = "Сочный стейк из мраморной говядины с соусом на выбор", Price = 1800.00m, Category = Category.Основные_блюда },
                    new Menu { Id = 6, Name = "Фондан", Description = "Шоколадный кекс с жидкой начинкой и шариком ванильного мороженого", Price = 400.00m, Category = Category.Десерты }
                );
            });

            modelBuilder.Entity<LoginAttempt>(entity =>
            {
                entity.HasKey(e => e.Id);
            });
        }

        public DbSet<Admin> Admins => Set<Admin>();
        public DbSet<BannedIp> BannedIps => Set<BannedIp>();
        public DbSet<Announcement> Announcements => Set<Announcement>();
        public DbSet<Promotion> Promotions => Set<Promotion>();
        public DbSet<Menu> Menus => Set<Menu>();
        public DbSet<LoginAttempt> LoginAttempts => Set<LoginAttempt>();
    }
}