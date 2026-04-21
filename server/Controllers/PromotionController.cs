using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Properties.Services;

namespace server.Controllers
{
    public static class PromotionController
    {
        public static void MapPromotionEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/promotions");

            group.MapGet("/", async (PromotionService service) =>
            {
                var promos = await service.GetActiveAsync();
                return Results.Ok(promos.Select(p => new PromoResponseDto(p.Id, p.Name, p.Description, p.EndDate)));
            });

            group.MapPost("/", async (CreatePromoDto dto, PromotionService service, HttpContext ctx) =>
            {
                if (!ctx.Request.Cookies.ContainsKey("AdminAuth")) return Results.Unauthorized();
                if (dto.EndDate <= DateTime.UtcNow) return Results.BadRequest("Дата в прошлом.");

                var p = await service.CreateAsync(dto.Title, dto.Description, dto.EndDate);
                return Results.Ok(new { message = "Акция создана", id = p.Id });
            });

            group.MapDelete("/{id:int}", async (int id, PromotionService service, HttpContext ctx) =>
            {
                if (!ctx.Request.Cookies.ContainsKey("AdminAuth")) return Results.Unauthorized();
                return await service.DeleteAsync(id) ? Results.Ok() : Results.NotFound();
            });
        }

        public record CreatePromoDto(string Title, string Description, DateTime EndDate);
        public record PromoResponseDto(int Id, string Title, string Description, DateTime EndDate);
    }
}