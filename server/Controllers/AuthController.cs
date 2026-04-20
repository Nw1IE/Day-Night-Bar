using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using server.Data;
using server.Models;

namespace server.Controllers
{
    public static class AuthController
    {
        public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/auth");

            group.MapPost("/register", async (AdminRegistrationDto dto, AppDbContext db) =>
            {
                if (await db.Admins.AnyAsync(a => a.Username == dto.Username))
                    return Results.BadRequest("Пользователь уже существует");

                var admin = new Admin
                {
                    Username = dto.Username,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
                };

                db.Admins.Add(admin);
                await db.SaveChangesAsync();

                return Results.Ok("Администратор успешно зарегистрирован");
            });

            group.MapPost("/login", async (AdminLoginDto dto, AppDbContext db) =>
            {
                var admin = await db.Admins.FirstOrDefaultAsync(a => a.Username == dto.Username);

                if (admin == null || !BCrypt.Net.BCrypt.Verify(dto.Password, admin.PasswordHash))
                    return Results.Unauthorized();

                return Results.Ok(new { message = "Вход выполнен успешно", user = admin.Username });
            });
        }

        public record AdminRegistrationDto(string Username, string Password);
        public record AdminLoginDto(string Username, string Password);
    }
}
