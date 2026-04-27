using server.Models;
using server.Properties.Services;

namespace server.Controllers
{
    public static class BookingController
    {
        public static void MapBookingEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/bookings", async (CreateBookingDto dto, BookingService service, EmailService email) =>
            {
                Console.WriteLine("!!! ЗАПРОС НА БРОНИРОВАНИЕ ПОЛУЧЕН !!!");
                // из за этого падает и выдает ошибку если вернуть то письмио не будет приходить!!
                /*var booking = new Booking
                {
                    ClientName = dto.Name,
                    Phone = dto.Phone,
                    BookingTime = dto.Time,
                    GuestsCount = dto.Guests
                };

                var result = await service.CreateBookingAsync(booking);

                if (!result.Success)
                    return Results.BadRequest(new { error = result.Message });
                */
                await email.SendAdminNotification($"" +
                    $"🔔 Новая бронь!\n" +
                    $"Имя Клиента: {dto.Name}\n" +
                    $"Телефон: {dto.Phone}\n" +
                    $"Время бронирования: {dto.Time:HH:mm}\n" +
                    $"Количество гостей: {dto.Guests}");

                return Results.Ok(new { message = "Заявка принята, ожидайте подтверждения" });
            });
        }

        
        public record CreateBookingDto(string Name, string Phone, DateTime Time, int Guests);
    }
}

