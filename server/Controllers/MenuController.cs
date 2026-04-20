using server.Models;
using server.Properties.Services;

namespace server.Controllers
{
    public static class MenuController
    {
        public static void MapMenuEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/menu");

            group.MapGet("/", async (MenuService service) =>
                Results.Ok(await service.GetAllAsync()));


            group.MapPost("/", async (CreateMenuDto dto, MenuService service, HttpContext ctx) =>
            {
                if (!ctx.Request.Cookies.ContainsKey("AdminAuth")) return Results.Unauthorized();

                var item = new Menu
                {
                    Name = dto.Name,
                    Category = dto.Category,
                    Description = dto.Description,
                    Price = dto.Price
                };

                await service.CreateAsync(item);
                return Results.Created($"/api/menu/{item.Id}", item);
            });


            group.MapPut("/{id:int}", async (int id, UpdateMenuDto dto, MenuService service, HttpContext ctx) =>
            {
                if (!ctx.Request.Cookies.ContainsKey("AdminAuth")) return Results.Unauthorized();

                var existing = await service.GetByIdAsync(id);
                if (existing == null) return Results.NotFound();

                existing.Name = dto.Name;
                existing.Category = dto.Category;
                existing.Description = dto.Description;
                existing.Price = dto.Price;

                await service.UpdateAsync(existing);
                return Results.Ok(existing);
            });


            group.MapDelete("/{id:int}", async (int id, MenuService service, HttpContext ctx) =>
            {
                if (!ctx.Request.Cookies.ContainsKey("AdminAuth")) return Results.Unauthorized();

                await service.DeleteAsync(id);
                return Results.NoContent();
            });
        }

        public record CreateMenuDto(string Name, Category Category, string Description, decimal Price);
        public record UpdateMenuDto(string Name, Category Category, string Description, decimal Price);
    }
}
