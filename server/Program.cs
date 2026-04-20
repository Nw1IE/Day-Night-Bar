using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using server.Controllers;
using server.Data;
using server.Middlewares;
using server.Models;


namespace server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            DotNetEnv.Env.Load();

            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<AppDbContext>();

            builder.Services.AddRateLimiter(options =>
            {
                options.OnRejected = async (context, token) =>
                {
                    var db = context.HttpContext.RequestServices.GetRequiredService<AppDbContext>();
                    var ip = context.HttpContext.Connection.RemoteIpAddress?.ToString();

                    if (!string.IsNullOrEmpty(ip))
                    {
                        var ban = new BannedIp
                        {
                            IpAddress = ip,
                            BannedUntil = DateTime.UtcNow.AddHours(24)
                        };
                        db.BannedIps.Add(ban);
                        await db.SaveChangesAsync();
                    }

                    context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                    await context.HttpContext.Response.WriteAsJsonAsync(new { error = "Слишком много попыток. IP заблокирован на сутки." });
                };

                options.AddFixedWindowLimiter("auth-limit", opt =>
                {
                    opt.Window = TimeSpan.FromMinutes(1);
                    opt.PermitLimit = 5;
                });
            });

            builder.Services.AddControllers();
            builder.Services.AddOpenApi();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseMiddleware<IpBanMiddleware>();
            app.UseRateLimiter();                 
            app.UseAuthorization();               

            app.MapAuthEndpoints();
            app.MapAnnouncementEndpoints();
            app.MapControllers();

            app.Run();
        }
    }
}
