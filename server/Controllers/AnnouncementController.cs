using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Properties.Services;

namespace server.Controllers
{
    public static class AnnouncementController
    {
        public static void MapAnnouncementEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/announcements");

            group.MapGet("/current", async (AnnouncementService service) =>
            {
                var a = await service.GetCurrentAsync();
                return a is null
                    ? Results.NotFound(new { message = "Активных объявлений нет" })
                    : Results.Ok(new AnnouncementResponseDto(a.Id, a.Text, a.UpdatedAt));
            });

            group.MapPost("/", async (CreateAnnouncementDto dto, AnnouncementService service, HttpContext ctx) =>
            {
                if (!ctx.Request.Cookies.ContainsKey("AdminAuth")) return Results.Unauthorized();
                if (string.IsNullOrWhiteSpace(dto.Text)) return Results.BadRequest("Текст объявления не может быть пустым.");

                var a = await service.CreateAsync(dto.Text);
                return Results.Created($"/api/announcements/{a.Id}", new AnnouncementResponseDto(a.Id, a.Text, a.UpdatedAt));
            });

            group.MapPatch("/{id:int}", async (int id, PatchAnnouncementDto dto, AnnouncementService service, HttpContext ctx) =>
            {
                if (!ctx.Request.Cookies.ContainsKey("AdminAuth")) return Results.Unauthorized();
                if (string.IsNullOrWhiteSpace(dto.Text)) return Results.BadRequest("Текст объявления не может быть пустым.");

                var existing = await service.GetByIdAsync(id);
                if (existing == null)
                    return Results.NotFound(new { message = $"Объявление с ID {id} не найдено для изменения" });

                existing.Text = dto.Text;
                existing.UpdatedAt = DateTime.UtcNow;

                await service.UpdateAsync(existing);
                return Results.Ok(new AnnouncementResponseDto(existing.Id, existing.Text, existing.UpdatedAt));
            });

            group.MapDelete("/{id:int}", async (int id, AnnouncementService service, HttpContext ctx) =>
            {
                if (!ctx.Request.Cookies.ContainsKey("AdminAuth"))
                {
                    return Results.Unauthorized();
                }

                await service.DeleteAsync(id);
                return Results.NoContent();
            });
        }

        public record CreateAnnouncementDto(string Text);
        public record PatchAnnouncementDto(string Text);
        public record AnnouncementResponseDto(int Id, string Text, DateTime UpdatedAt);
    }
}
