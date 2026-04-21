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
                return Results.Ok(new AnnouncementResponseDto(a?.Text ?? "", a?.UpdatedAt));
            });

            group.MapPost("/", async (CreateAnnouncementDto dto, AnnouncementService service, HttpContext ctx) =>
            {
                if (!ctx.Request.Cookies.ContainsKey("AdminAuth")) return Results.Unauthorized();

                await service.UpdateOrCreateAsync(dto.Message);
                return Results.Ok(new { message = "Объявление успешно сохранено" });
            });
        }

        public record CreateAnnouncementDto(string Message);
        public record AnnouncementResponseDto(string Message, DateTime? UpdatedAt);
    }
}
