using System.Net;

namespace server.Middlewares
{
    public class ExceptHandlerMiddleware(RequestDelegate next, ILogger<ExceptHandlerMiddleware> logger)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (AppServiceException ex)
            {
                logger.LogWarning("Бизнес-предупреждение [{Method}] {Path} -> Статус: {StatusCode}. Причина: {Message}",
                    context.Request.Method,
                    context.Request.Path,
                    ex.StatusCode,
                    ex.Message);

                await HandleExceptionAsync(context, ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "КРИТИЧЕСКИЙ СБОЙ СЕРВЕРА при обработке запроса [{Method}] {Path} с IP: {Ip}",
                    context.Request.Method,
                    context.Request.Path,
                    context.Connection.RemoteIpAddress?.ToString() ?? "Unknown");

                await HandleExceptionAsync(
                    context,
                    (int)HttpStatusCode.InternalServerError,
                    "Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.");
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, int statusCode, string message)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            return context.Response.WriteAsJsonAsync(new
            {
                error = message,
                timestamp = DateTime.UtcNow
            });
        }
    }
}
