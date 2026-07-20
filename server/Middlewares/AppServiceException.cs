
namespace server.Middlewares
{
    [Serializable]
    public class AppServiceException : Exception
    {
        public int StatusCode { get; }

        public AppServiceException(string message, int statusCode = 400) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}