using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers
{
    public static class PromotionController
    {
        public static void MapPromotionEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/promotions");

            group.MapGet("/", async (AppDbContext db) =>
            {
                var now = DateTime.UtcNow;

                var promotions = await db.Promotions
                    .Where(p => p.EndDate > now)
                    .OrderBy(p => p.EndDate)
                    .Select(p => new PromoResponseDto(p.Id, p.Name, p.Description, p.EndDate))
                    .ToListAsync();

                return Results.Ok(promotions);
            });

            group.MapPost("/", async (CreatePromoDto dto, AppDbContext db, HttpContext ctx) =>
            {
                if (!ctx.Request.Cookies.ContainsKey("AdminAuth"))
                    return Results.Unauthorized();

                if (dto.EndDate <= DateTime.UtcNow)
                    return Results.BadRequest(new { error = "Дата окончания не может быть в прошлом." });

                var promotion = new Promotion
                {
                    Name = dto.Title,
                    Description = dto.Description,
                    EndDate = dto.EndDate
                };

                db.Promotions.Add(promotion);
                await db.SaveChangesAsync();

                return Results.Ok(new { message = "Акция успешно создана", id = promotion.Id });
            });

            group.MapDelete("/{id:int}", async (int id, AppDbContext db, HttpContext ctx) =>
            {
                if (!ctx.Request.Cookies.ContainsKey("AdminAuth"))
                    return Results.Unauthorized();

                var promotion = await db.Promotions.FindAsync(id);
                if (promotion == null) return Results.NotFound();

                db.Promotions.Remove(promotion);
                await db.SaveChangesAsync();

                return Results.Ok(new { message = "Акция удалена" });
            });
        }

        public record CreatePromoDto(string Title, string Description, DateTime EndDate);
        public record PromoResponseDto(int Id, string Title, string Description, DateTime EndDate);
    }
}