using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Properties.Services
{
    public class BookingService(AppDbContext db)
    {
        private const int MaxTables = 10;

        public async Task<(bool Success, string Message)> CreateBookingAsync(Booking booking)
        {
            using var transaction = await db.Database.BeginTransactionAsync();
            try
            {
                var start = booking.BookingTime.AddMinutes(-90);
                var end = booking.BookingTime.AddMinutes(90);

                var activeBookings = await db.Bookings
                    .CountAsync(b => b.BookingTime >= start && b.BookingTime <= end);

                var manualOccupied = await db.TableStatuses.CountAsync(t => t.IsOccupied);

                if (activeBookings + manualOccupied >= MaxTables)
                {
                    return (false, "К сожалению, на это время все столики заняты.");
                }

                db.Bookings.Add(booking);
                await db.SaveChangesAsync();
                await transaction.CommitAsync();

                return (true, "Бронирование создано");
            }
            catch
            {
                await transaction.RollbackAsync();
                return (false, "Ошибка сервера при бронировании");
            }
        }
    }
}
