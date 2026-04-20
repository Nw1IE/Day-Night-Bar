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
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<AppDbContext>(options => 
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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
                    await context.HttpContext.Response.WriteAsJsonAsync(new { error = "Слишком много попыток. Ваш IP заблокирован на сутки." });
                };

                options.AddFixedWindowLimiter("auth-limit", opt =>
                {
                    opt.Window = TimeSpan.FromMinutes(1);
                    opt.PermitLimit = 5;
                });
            });

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseMiddleware<IpBanMiddleware>();

            app.MapAuthEndpoints();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
