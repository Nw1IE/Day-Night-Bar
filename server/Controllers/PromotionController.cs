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
                return Results.Ok(promos.Select(p => new PromoResponseDto(
                    p.Id, p.Name, p.Description, p.StartDate, p.EndDate
                )));
            });

            group.MapGet("/all", async (PromotionService service, HttpContext ctx) =>
            {
                if (!ctx.Request.Cookies.ContainsKey("AdminAuth")) return Results.Unauthorized();

                var promos = await service.GetAllAsync();
                return Results.Ok(promos.Select(p => new PromoResponseDto(
                    p.Id, p.Name, p.Description, p.StartDate, p.EndDate
                )));
            });

            group.MapGet("/{id:int}", async (int id, PromotionService service) =>
            {
                var p = await service.GetByIdAsync(id);
                return p is null
                    ? Results.NotFound(new { message = $"Акция с ID {id} не найдена" })
                    : Results.Ok(new PromoResponseDto(p.Id, p.Name, p.Description, p.StartDate, p.EndDate));
            });

            group.MapPost("/", async (CreatePromoDto dto, PromotionService service, HttpContext ctx) =>
            {
                if (!ctx.Request.Cookies.ContainsKey("AdminAuth")) return Results.Unauthorized();

                if (dto.EndDate <= dto.StartDate)
                    return Results.BadRequest("Дата окончания должна быть позже даты начала.");

                var p = await service.CreateAsync(dto.Title, dto.Description, dto.StartDate, dto.EndDate);
                return Results.Created($"/api/promotions/{p.Id}", new PromoResponseDto(
                    p.Id, p.Name, p.Description, p.StartDate, p.EndDate
                ));
            });

            group.MapPut("/{id:int}", async (int id, UpdatePromoDto dto, PromotionService service, HttpContext ctx) =>
            {
                if (!ctx.Request.Cookies.ContainsKey("AdminAuth")) return Results.Unauthorized();

                if (dto.EndDate <= dto.StartDate)
                    return Results.BadRequest("Дата окончания должна быть позже даты начала.");

                var existing = await service.GetByIdAsync(id);
                if (existing == null)
                    return Results.NotFound(new { message = $"Акция с ID {id} не найдена для обновления" });

                existing.Name = dto.Title;
                existing.Description = dto.Description;
                existing.StartDate = dto.StartDate;
                existing.EndDate = dto.EndDate;

                await service.UpdateAsync(existing);
                return Results.Ok(new PromoResponseDto(
                    existing.Id, existing.Name, existing.Description, existing.StartDate, existing.EndDate
                ));
            });

            group.MapDelete("/{id:int}", async (int id, PromotionService service, HttpContext ctx) =>
            {
                if (!ctx.Request.Cookies.ContainsKey("AdminAuth"))
                {
                    return Results.Unauthorized();
                }

                await service.DeleteAsync(id);
                return Results.NoContent();
            });
        }

        public record CreatePromoDto(string Title, string Description, DateTime StartDate, DateTime EndDate);
        public record UpdatePromoDto(string Title, string Description, DateTime StartDate, DateTime EndDate);
        public record PromoResponseDto(int Id, string Title, string Description, DateTime StartDate, DateTime EndDate);
    }
}