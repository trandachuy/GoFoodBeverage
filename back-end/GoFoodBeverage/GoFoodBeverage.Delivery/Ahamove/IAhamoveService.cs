using System.Threading.Tasks;
using System.Collections.Generic;
using GoFoodBeverage.Delivery.Ahamove.Model;

namespace GoFoodBeverage.Delivery.Ahamove
{
    public interface IAhamoveService
    {
        Task<AhamoveTokenModel> GetAhamoveTokenAsync(AhamoveConfigByStoreRequestModel request);

        Task<List<GetListOrderAhamoveResponseModel.OrderDto>> GetOrdersAsync(string token);

        Task<CreateOrderAhamoveResponseModel> CreateOrderAsync(string token, CreateOrderAhamoveRequestModel request);

        Task<OrderDetailAhamoveResponseModel> GetOrderDetailAsync(string token, string orderId);

        Task<bool> CancelOrderAsync(string token, string orderId);

        Task<EstimatedOrderAhamoveFeeResponseModel> EstimateOrderFee(string token, EstimateOrderAhamoveRequestModel request);
    }
}
