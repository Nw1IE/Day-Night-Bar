using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers
{
    public static class AnnouncementController
    {
        public static void MapAnnouncementEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/announcements");

            group.MapGet("/current", async (AppDbContext db) =>
            {
                var announcement = await db.Announcements.FirstOrDefaultAsync();

                if (announcement == null || string.IsNullOrWhiteSpace(announcement.Text))
                    return Results.Ok(new AnnouncementResponseDto("", null));

                return Results.Ok(new AnnouncementResponseDto(announcement.Text, announcement.UpdatedAt));
            });


            group.MapPost("/", async (CreateAnnouncementDto dto, AppDbContext db, HttpContext ctx) =>
            {
                if (!ctx.Request.Cookies.ContainsKey("AdminAuth"))
                    return Results.Unauthorized();

                var announcement = await db.Announcements.FirstOrDefaultAsync();

                if (announcement == null)
                {
                    announcement = new Announcment
                    {
                        Text = dto.Message,
                        UpdatedAt = DateTime.UtcNow
                    };
                    db.Announcements.Add(announcement);
                }
                else
                {
                    announcement.Text = dto.Message;
                    announcement.UpdatedAt = DateTime.UtcNow;
                }

                await db.SaveChangesAsync();

                return Results.Ok(new { message = "Объявление успешно сохранено" });
            });
        }

        public record CreateAnnouncementDto(string Message);
        public record AnnouncementResponseDto(string Message, DateTime? UpdatedAt);
    }
}
