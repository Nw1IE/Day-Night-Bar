using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using server.Controllers;
using server.Data;
using server.Middlewares;
using server.Models;
using server.Properties.Services;


namespace server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            DotNetEnv.Env.Load();

            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins("http://127.0.0.1:5500") // Разрешаем твоему Live Server
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                });
            });

            builder.Services.AddScoped<EmailService>(); // Должно быть до builder.Build()

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
                    await context.HttpContext.Response.WriteAsJsonAsync(new { error = "������� ����� �������. IP ������������ �� �����." });
                };

                options.AddFixedWindowLimiter("auth-limit", opt =>
                {
                    opt.Window = TimeSpan.FromMinutes(1);
                    opt.PermitLimit = 5;
                });
            });

            builder.Services.AddScoped<MenuService>();
            builder.Services.AddScoped<AnnouncementService>();
            builder.Services.AddScoped<PromotionService>();
            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<BookingService>();
            builder.Services.AddControllers();
            builder.Services.AddOpenApi();

            var app = builder.Build();
            app.UseCors();


            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

           /* app.UseMiddleware<IpBanMiddleware>(); */
            app.UseRateLimiter();                 
            app.UseAuthorization();       
            app.MapBookingEndpoints();        

            app.MapAuthEndpoints();
            app.MapAnnouncementEndpoints();
            app.MapPromotionEndpoints();
            app.MapMenuEndpoints();
            app.MapControllers();

            app.Run();

            
        }
    }
}
