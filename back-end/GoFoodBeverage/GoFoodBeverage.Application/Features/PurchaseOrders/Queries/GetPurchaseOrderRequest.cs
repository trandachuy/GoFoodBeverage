using AutoMapper;
using GoFoodBeverage.Interfaces;
using GoFoodBeverage.Domain.Entities;
using GoFoodBeverage.Models.PurchaseOrderModel;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.Application.Features.PurchaseOrders.Commands
{
    public class GetPurchaseOrderRequest : IRequest<GetPurchaseOrderResponse>
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }
    }

    public class GetPurchaseOrderResponse
    {
        public IEnumerable<PurchaseOrderModel> PurchaseOrders { get; set; }

        public int PageNumber { get; set; }

        public int Total { get; set; }
    }

    public class GetPurchaseOrderHandler : IRequestHandler<GetPurchaseOrderRequest, GetPurchaseOrderResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public GetPurchaseOrderHandler(IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<GetPurchaseOrderResponse> Handle(GetPurchaseOrderRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var purchaseOrderData = await _unitOfWork.PurchaseOrders.GetAllPurchaseOrderByStoreId(loggedUser.StoreId.Value, request.PageNumber, request.PageSize, request.KeySearch);
            var purchaseOrders = _mapper.Map<List<PurchaseOrderModel>>(purchaseOrderData.Result);
            var staffInfo = await _unitOfWork.Staffs.GetStaffByAccountIdAsync(loggedUser.AccountId.Value);
            purchaseOrders.ForEach(purchaseOrder =>
            {
                purchaseOrder.CreatedBy = staffInfo.FullName;
            });

            var response = new GetPurchaseOrderResponse()
            {
                PageNumber = request.PageNumber,
                Total = purchaseOrderData.Total,
                PurchaseOrders = purchaseOrders
            };

            return response;
        }
    }
}
