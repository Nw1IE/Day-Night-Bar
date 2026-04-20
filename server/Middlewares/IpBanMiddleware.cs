using Microsoft.EntityFrameworkCore;
using server.Data;

namespace server.Middlewares
{
    public class IpBanMiddleware(RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context, AppDbContext db)
        {
            var remoteIp = context.Connection.RemoteIpAddress?.ToString();

            if (!string.IsNullOrEmpty(remoteIp))
            {
                var isBanned = await db.BannedIps
                    .AnyAsync(b => b.IpAddress == remoteIp && b.BannedUntil > DateTime.UtcNow);

                if (isBanned)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    await context.Response.WriteAsJsonAsync(new { error = "Ваш IP заблокирован из-за подозрительной активности." });
                    return;
                }
            }
            await next(context);
        }
    }
}
