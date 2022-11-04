using GoFoodBeverage.POS.Models.DeliveryMethod;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.Interfaces.POS
{
    public interface IDeliveryService
    {
        Task UpdateOrderAhamoveStatusAsync(UpdateAhamoveStatusRequestModel request, CancellationToken cancellationToken);

        Task CancelOrderAhamoveAsync(string ahamoveOrderId, Guid storeId);
    }
}
