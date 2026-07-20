using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using server.Data;
using server.Models;

namespace server.Properties.Services
{
    public class AuthService(AppDbContext db, ILogger<AuthService> logger)
    {
        private const int MaxFailedAttempts = 5;
        private readonly TimeSpan BanDuration = TimeSpan.FromHours(24);

        public async Task<bool> IsIpBlockedAsync(string ip)
        {
            try
            {
                var ban = await db.BannedIps
                .FirstOrDefaultAsync(b => b.IpAddress == ip && b.BannedUntil > DateTime.UtcNow);
                return ban != null;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Ошибка при проверке блокировки IP-адреса: {Ip}", ip);
                throw;
            }
        }

        public async Task RegisterFailedAttemptAsync(string ip)
        {
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
            try
            {
                var admin = await db.Admins.FirstOrDefaultAsync();
                if (admin == null) return false;

                return BCrypt.Net.BCrypt.Verify(passcode, admin.PasscodeHash);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Ошибка при проверке администратора");
                throw;
            }
        }
    }
}
