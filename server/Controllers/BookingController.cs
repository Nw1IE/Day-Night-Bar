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
                var booking = new Booking
                {
                    ClientName = dto.Name,
                    Phone = dto.Phone,
                    BookingTime = dto.Time,
                    GuestsCount = dto.Guests
                };

                var result = await service.CreateBookingAsync(booking);

                if (!result.Success)
                    return Results.BadRequest(new { error = result.Message });

                _ = email.SendAdminNotification($"🔔 Новая бронь!\n👤 {dto.Name}\n📞 {dto.Phone}\n⏰ {dto.Time:HH:mm}\n👥 Гостей: {dto.Guests}");

                return Results.Ok(new { message = "Заявка принята, ожидайте подтверждения" });
            });
        }

        public record CreateBookingDto(string Name, string Phone, DateTime Time, int Guests);
    }
}
