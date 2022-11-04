using Newtonsoft.Json;
using System.Collections.Generic;

namespace GoFoodBeverage.Delivery.Ahamove.Model
{
    public class OrderDetailAhamoveResponseModel
    {
        [JsonProperty("_id")]
        public string Id { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("total_price")]
        public decimal TotalPrice { get; set; }

        public IEnumerable<PathDto> Path { get; set; }

        public class PathDto
        {
            public string Name { get; set; }

            public string Address { get; set; }
        }

        public string Items { get; set; }
    }
}
