namespace server.Properties.Services
{
    public class TelegramBotService
    {
        public Task SendAdminNotification(string message)
        {
            // Логика отправки уведомления в Telegram
            return Task.CompletedTask;
        }
    }
}
