using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using server.Data;
using server.Models;
using System.Net;

namespace server.Properties.Services
{
    public class AuthService(AppDbContext db, ILogger<AuthService> logger, IMemoryCache cache)
    {
        private const int MaxFailedAttempts = 5;
        private readonly TimeSpan BanDuration = TimeSpan.FromHours(24);

        public static bool IsLoopbackOrInternal(string? ip)
        {
            if (string.IsNullOrWhiteSpace(ip) || ip == "unknown") return true;
            if (IPAddress.TryParse(ip, out var address))
            {
                return IPAddress.IsLoopback(address);
            }
            return false;
        }

        public async Task<bool> IsIpBlockedAsync(string ip)
        {
            if (IsLoopbackOrInternal(ip)) return false;

            var cacheKey = $"banned_ip_{ip}";
            if (cache.TryGetValue(cacheKey, out bool isBanned))
            {
                return isBanned;
            }

            try
            {
                var ban = await db.BannedIps
                    .FirstOrDefaultAsync(b => b.IpAddress == ip && b.BannedUntil > DateTime.UtcNow);
                isBanned = ban != null;
                cache.Set(cacheKey, isBanned, TimeSpan.FromSeconds(60));
                return isBanned;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Ошибка при проверке блокировки IP-адреса: {Ip}", ip);
                throw;
            }
        }

        public async Task RegisterFailedAttemptAsync(string ip)
        {
            if (IsLoopbackOrInternal(ip))
            {
                logger.LogWarning("Попытка блокировки локального IP ({Ip}) проигнорирована во избежание отказа в обслуживании всего сервера.", ip);
                return;
            }

            try
            {
                var attempt = await db.LoginAttempts.FirstOrDefaultAsync(a => a.IpAddress == ip);

                if (attempt == null)
                {
                    attempt = new LoginAttempt
                    {
                        IpAddress = ip,
                        FailedCount = 1,
                        LastAttempt = DateTime.UtcNow
                    };
                    db.LoginAttempts.Add(attempt);
                }
                else
                {
                    attempt.FailedCount++;
                    attempt.LastAttempt = DateTime.UtcNow;
                }

                if (attempt.FailedCount >= MaxFailedAttempts)
                {
                    var ban = new BannedIp
                    {
                        IpAddress = ip,
                        BannedUntil = DateTime.UtcNow.Add(BanDuration),
                        Reason = "Превышено число попыток ввода пароля"
                    };
                    db.BannedIps.Add(ban);

                    db.LoginAttempts.Remove(attempt);

                    cache.Set($"banned_ip_{ip}", true, BanDuration);
                    logger.LogWarning("IP-адрес {Ip} заблокирован на 24 часа за превышение попыток ввода пароля.", ip);
                }

                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Ошибка при регистрации неудачной попытки входа для IP-адреса: {Ip}", ip);
                throw;
            }
        }

        public async Task ResetFailedAttemptsAsync(string ip)
        {
            if (IsLoopbackOrInternal(ip)) return;

            try
            {
                var attempt = await db.LoginAttempts.FirstOrDefaultAsync(a => a.IpAddress == ip);
                if (attempt != null)
                {
                    db.LoginAttempts.Remove(attempt);
                    await db.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Ошибка при сбросе неудачных попыток входа для IP-адреса: {Ip}", ip);
                throw;
            }
        }

        public async Task<bool> VerifyAdminAsync(string passcode)
        {
            if (string.IsNullOrWhiteSpace(passcode)) 
                return false;
            try
            {
                var admin = await db.Admins.FirstOrDefaultAsync();
                if (admin == null) 
                {
                    logger.LogWarning("Попытка входа, но учетная запись администратора не найдена в БД.");
                    return false;
                }
                return BCrypt.Net.BCrypt.Verify(passcode, admin.PasscodeHash);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Ошибка при проверке пароля администратора");
                return false;
            }
        }
    }
}
