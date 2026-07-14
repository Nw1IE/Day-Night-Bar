using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;

namespace server.Properties.Services
{
    public class EmailService(IConfiguration config)
    {
        public async Task SendAdminNotification(string message)
        {
            var adminEmail = config["EmailSettings:AdminEmail"];
            var host = config["EmailSettings:Host"];
            var port = int.Parse(config["EmailSettings:Port"] ?? "587");
            var senderEmail = config["EmailSettings:SenderEmail"];
            var password = config["EmailSettings:Password"];

            var emailMessage = new MimeMessage();

            emailMessage.From.Add(new MailboxAddress("Bar System", senderEmail));
            emailMessage.To.Add(new MailboxAddress("Admin", adminEmail));
            emailMessage.Subject = "🔔 Новое бронирование стола";
            emailMessage.Body = new TextPart("plain") { Text = message };

            using var client = new SmtpClient();
            try
            {
                await client.ConnectAsync(host, port, MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(senderEmail, password);
                await client.SendAsync(emailMessage);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine("---------- ошибки ----------");
                Console.WriteLine($"Сообщение: {ex.Message}");
                Console.WriteLine($"Детали: {ex.InnerException?.Message}");
                Console.WriteLine("-------------------------------------");
            }
        }
    }
}
