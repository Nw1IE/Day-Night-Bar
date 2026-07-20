using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.Models;
using server.Properties.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace server.Controllers
{
    public static class AuthController
    {
        public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
{
    // ЖЕСТКО прописываем чистый путь без всяких `.env`
    var group = app.MapGroup("/api/auth");

    group.MapPost("/login", async (AdminLoginDto dto, AuthService auth, HttpContext ctx) =>
    {
        var ip = ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown";

        if (await auth.IsIpBlockedAsync(ip))
        {
            return Results.Json(new { error = "Доступ заблокирован." }, statusCode: 403);
        }

        // Никаких проверок Headers! Сразу идем к сверке пароля:
        if (!await auth.VerifyAdminAsync(dto.Passcode))
        {
            await auth.RegisterFailedAttemptAsync(ip);
            return Results.Unauthorized();
        }

        await auth.ResetFailedAttemptsAsync(ip);

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY") ?? "FallbackKeyMakeSureItsLongEnough123!");

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, "Admin"),
                new Claim(ClaimTypes.Role, "Admin")
            }),
            Expires = DateTime.UtcNow.AddHours(12),
            Issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "MyAwesomeServer",
            Audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "MyAwesomeClient",
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var jwtToken = tokenHandler.WriteToken(token);

        ctx.Response.Cookies.Append("AdminAuth", jwtToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddHours(12)
        });

        return Results.Ok(new { message = "Вход выполнен успешно" });
    }).RequireRateLimiting("auth-limit");

    group.MapPost("/logout", (HttpContext ctx) =>
    {
        ctx.Response.Cookies.Delete("AdminAuth");
        return Results.Ok();
    });
}

        public record AdminLoginDto(string Passcode);
    }
}
