using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Controllers;
using server.Data;
using server.Middlewares;
using server.Models;
using server.Properties.Services;
using System.Text;
using System.Text.Json.Serialization;


namespace server
{
    public class Program
    {

        public static void Main(string[] args)
        {
            DotNetEnv.Env.Load();

            var builder = WebApplication.CreateBuilder(args);

            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();
            builder.Logging.AddDebug();

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? "FallbackKeyMakeSureItsLongEnough123!";
            var key = Encoding.UTF8.GetBytes(jwtKey);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "MyAwesomeServer",
                    ValidAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "MyAwesomeClient",
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        context.Token = context.Request.Cookies["AdminAuth"];
                        return Task.CompletedTask;
                    }
                };
            });

            builder.Services.AddAuthorization();

            builder.Services.AddRateLimiter(options =>
            {
                options.OnRejected = async (context, token) =>
                {
                    context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                    await context.HttpContext.Response.WriteAsJsonAsync(new { error = "Too many requests. Wait a minute" });
                };

                options.AddFixedWindowLimiter("auth-limit", opt =>
                {
                    opt.Window = TimeSpan.FromMinutes(1);
                    opt.PermitLimit = 5;
                });
            });

            builder.Services.AddDbContext<AppDbContext>();
            builder.Services.AddScoped<MenuService>();
            builder.Services.AddScoped<AnnouncementService>();
            builder.Services.AddScoped<PromotionService>();
            builder.Services.AddScoped<AuthService>();
            builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// Поддержка строк вместо чисел для Enum в контроллерах
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
            builder.Services.AddOpenApi();

            var app = builder.Build();
            app.UseCors();

            app.UseStaticFiles();

            app.UseMiddleware<ExceptHandlerMiddleware>();
           // app.UseMiddleware<IpBanMiddleware>();

            app.Use(async (context, next) =>
            {
                var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();

                var method = context.Request.Method;
                var path = context.Request.Path;
                var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                logger.LogInformation("--> Incoming Request: {Method} {Path} from {Ip}", method, path, ip);

                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                await next(context);

                stopwatch.Stop();
                var statusCode = context.Response.StatusCode;

                logger.LogInformation("<-- Outgoing Response: {Method} {Path} responded {StatusCode} in {Elapsed}ms",
                    method, path, statusCode, stopwatch.ElapsedMilliseconds);
            });

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseRateLimiter();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapAuthEndpoints();
            app.MapAnnouncementEndpoints();
            app.MapPromotionEndpoints();
            app.MapMenuEndpoints();
            app.MapControllers();

            app.Run();
        }
    }
}
