using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Properties.Services;

namespace server.Controllers
{
    public static class AuthController
    {
        public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/auth");

            group.MapPost("/login", async (AdminLoginDto dto, AuthService auth, HttpContext ctx) =>
            {
                if (!await auth.VerifyAdminAsync(dto.Passcode))
                    return Results.Unauthorized();

                ctx.Response.Cookies.Append("AdminAuth", "secure_session_token_here", new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddHours(24)
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
