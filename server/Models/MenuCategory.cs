using System.Text.Json.Serialization;

namespace server.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Category
    {
        Коктейли,
        Вино,
        Пиво,
        Закуски,
        Основные_блюда,
        Десерты
    }
}
