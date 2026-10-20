using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using server.Data;
using System.Net;

namespace server.Middlewares
{
    public class IpBanMiddleware(RequestDelegate next, IMemoryCache cache, ILogger<IpBanMiddleware> logger)
    {
        public async Task InvokeAsync(HttpContext context, AppDbContext db)
        {
            var remoteIpAddress = context.Connection.RemoteIpAddress;

            // Локальные и петлевые адреса никогда не блокируем (защита от бана прокси/шлюза)
            if (remoteIpAddress == null || IPAddress.IsLoopback(remoteIpAddress))
            {
                await next(context);
                return;
            }

            var remoteIp = remoteIpAddress.ToString();
            var cacheKey = $"banned_ip_{remoteIp}";

            if (!cache.TryGetValue(cacheKey, out bool isBanned))
            {
                isBanned = await db.BannedIps
                    .AnyAsync(b => b.IpAddress == remoteIp && b.BannedUntil > DateTime.UtcNow);

                // Кэшируем результат на 60 секунд, чтобы снизить нагрузку на БД
                cache.Set(cacheKey, isBanned, TimeSpan.FromSeconds(60));
            }

            if (isBanned)
            {
                logger.LogWarning("Запрос от заблокированного IP-адреса {Ip} отклонен.", remoteIp);
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new { error = "Ваш IP заблокирован из-за подозрительной активности." });
                return;
            }

            await next(context);
        }
    }
}
