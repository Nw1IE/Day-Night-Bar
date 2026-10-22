using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
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
using System.Threading.RateLimiting;

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

            var corsOriginsEnv = Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS");
            var allowedOrigins = !string.IsNullOrWhiteSpace(corsOriginsEnv)
                ? corsOriginsEnv.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                : builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                    ?? new[] { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" };

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins(allowedOrigins)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? "FallbackKeyMakeSureItsLongEnough123!";
            var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "BarServer";
            var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "BarClient";
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
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
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
                    await context.HttpContext.Response.WriteAsJsonAsync(
                        new { error = "Слишком много запросов. Пожалуйста, подождите 1 минуту." },
                        cancellationToken: token);
                };

                options.AddPolicy("auth-limit", httpContext =>
                {
                    var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                    return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 5,
                        Window = TimeSpan.FromMinutes(1),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    });
                });
            });

            var dbConnection = Environment.GetEnvironmentVariable("DB_CONNECTION")
                ?? Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING");

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(dbConnection));
            builder.Services.AddScoped<MenuService>();
            builder.Services.AddScoped<AnnouncementService>();
            builder.Services.AddScoped<PromotionService>();
            builder.Services.AddScoped<AuthService>();
            builder.Services.AddOpenApi();
            builder.Services.AddMemoryCache();

            builder.Services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
                options.KnownNetworks.Clear();
                options.KnownProxies.Clear();
            });

            builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
            {
                options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
                options.SerializerOptions.PropertyNameCaseInsensitive = true;
            });

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
                });

            var app = builder.Build();

            app.UseForwardedHeaders();
            app.UseCors();

        // ---- Security Headers Middleware ----
        app.Use(async (context, next) =>
        {
            // Content Security Policy – allow only self and trusted sources
            context.Response.Headers["Content-Security-Policy"] = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline';";
            // HSTS – enforce HTTPS (only in non‑development)
            if (!app.Environment.IsDevelopment())
            {
                context.Response.Headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload";
            }
            // Other security headers
            context.Response.Headers["X-Content-Type-Options"] = "nosniff";
            context.Response.Headers["X-Frame-Options"] = "DENY";
            context.Response.Headers["Referrer-Policy"] = "no-referrer";
            await next();
        });

            app.UseStaticFiles();

            app.UseMiddleware<ExceptHandlerMiddleware>();
            app.UseMiddleware<IpBanMiddleware>();

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

            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var logger = services.GetRequiredService<ILogger<Program>>();
                try
                {
                    var db = services.GetRequiredService<AppDbContext>();

                    // Получаем пароль из переменной окружения (может быть null)
                    var adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD");
                    var admin = db.Admins.FirstOrDefault();

                    if (string.IsNullOrEmpty(adminPassword))
                    {
                        logger.LogWarning("ADMIN_PASSWORD not set; skipping admin account initialization.");
                    }
                    else if (admin == null)
                    {
                        admin = new Admin
                        {
                            PasscodeHash = BCrypt.Net.BCrypt.HashPassword(adminPassword)
                        };
                        db.Admins.Add(admin);
                        db.SaveChanges();
                        logger.LogInformation("Создана начальная учетная запись администратора.");
                    }
                    else if (!BCrypt.Net.BCrypt.Verify(adminPassword, admin.PasscodeHash))
                    {
                        admin.PasscodeHash = BCrypt.Net.BCrypt.HashPassword(adminPassword);
                        db.SaveChanges();
                        logger.LogInformation("Пароль администратора синхрон… (updated).");
                    }
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Ошибка при инициализации администратора");
                }
            }

            app.Run();
        }
    }
}
