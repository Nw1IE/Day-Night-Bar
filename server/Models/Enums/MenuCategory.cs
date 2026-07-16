using System.Text.Json.Serialization;

namespace server.Models.Enums
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
