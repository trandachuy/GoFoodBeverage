using AutoMapper;
using AutoMapper.QueryableExtensions;
using GoFoodBeverage.Domain.Enums;
using GoFoodBeverage.Interfaces;
using GoFoodBeverage.Models.Customer;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.Application.Features.Customer.Queries
{
    public class GetCustomerReportWithPlatformRequest : IRequest<GetCustomerReportWithPlatformResponse>
    {
        public Guid? BranchId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public EnumSegmentTime SegmentTimeOption { get; set; }

        public DateTime? FromDateOfThePreviousSession { get; set; }

        public DateTime? ToDateOfThePreviousSession { get; set; }
    }

    public class GetCustomerReportWithPlatformResponse
    {
        public int TotalCustomer { get; set; }

        public int TotalOrder { get; set; }

        public decimal RevenueByCustomer { get; set; }

        public double AverageOrder { get; set; }

        public bool IsDecreaseCustomerFromThePreviousSession { get; set; }

        public double PercentageCustomerChangeFromThePreviousSession { get; set; }

        public List<PlatformStatistical> PlatformStatisticals { get; set; }

        public class PlatformStatistical
        {
            public Guid PlatformId { get; set; }

            public string PlatformName { get; set; }

            public int TotalCustomer { get; set; }

            public bool IsDecreaseFromThePreviousSession { get; set; }

            public double PercentageChangeFromThePreviousSession { get; set; }
        }
    }

    public class GetCustomerReportByPlatformRequestHandler : IRequestHandler<GetCustomerReportWithPlatformRequest, GetCustomerReportWithPlatformResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly IUserProvider _userProvider;

        private readonly MapperConfiguration _mapperConfiguration;

        public GetCustomerReportByPlatformRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            MapperConfiguration mapperConfiguration
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapperConfiguration = mapperConfiguration;
        }

        public async Task<GetCustomerReportWithPlatformResponse> Handle(GetCustomerReportWithPlatformRequest request, CancellationToken cancellationToken)
        {
            // Get user information from the token.
            var loggedUser = await _userProvider.ProvideAsync();
            HandlePeriodValue(request);

            // Get Platform List Active
            List<PlatFormReportForCustomerModel> platformList = await _unitOfWork.Platforms
                .Find(platform => platform.StatusId == 1)
                .AsNoTracking()
                .ProjectTo<PlatFormReportForCustomerModel>(_mapperConfiguration)
                .ToListAsync();

            // Get customer list
            List<CustomerReportByPlatformModel> customerListModel = await _unitOfWork.Customers
                .Find(customer => customer.StoreId == loggedUser.StoreId && customer.Platform.StatusId == 1 && customer.CreatedTime >= request.FromDateOfThePreviousSession && customer.CreatedTime <= request.ToDate)
                .Include(customer => customer.Platform)
                .AsNoTracking()
                .ProjectTo<CustomerReportByPlatformModel>(_mapperConfiguration)
                .ToListAsync();

            // Get order list
            List<OrderReportForCustomerModel> orderListModel = await _unitOfWork.Orders
                .Find(order => order.StoreId == loggedUser.StoreId && order.Platform.StatusId == 1 && order.CreatedTime >= request.FromDateOfThePreviousSession && order.CreatedTime <= request.ToDate)
                .Include(order => order.Platform)
                .AsNoTracking()
                .ProjectTo<OrderReportForCustomerModel>(_mapperConfiguration)
                .ToListAsync();

            if (request.BranchId.HasValue)
            {
                customerListModel = customerListModel.Where(customer => customer.BranchId == request.BranchId).ToList();
                orderListModel = orderListModel.Where(order => order.BranchId == request.BranchId).ToList();
            }

            GetCustomerReportWithPlatformResponse response = new GetCustomerReportWithPlatformResponse();
            // Get customer list for current session
            List<CustomerReportByPlatformModel> customerListForCurrentSessionModel = customerListModel
                .Where(customer => customer.CreatedTime >= request.FromDate && customer.CreatedTime <= request.ToDate).ToList();
            // Get customer list for previous session
            List<CustomerReportByPlatformModel> customerListForPreviousSessionModel = customerListModel
                .Where(customer => customer.CreatedTime >= request.FromDateOfThePreviousSession && customer.CreatedTime <= request.ToDateOfThePreviousSession).ToList();
            // Get order list for current session
            List<OrderReportForCustomerModel> orderListForCurrentSessionModel = orderListModel
                .Where(customer => customer.CreatedTime >= request.FromDate && customer.CreatedTime <= request.ToDate).ToList();
            // Get order list for Previous session
            List<OrderReportForCustomerModel> orderListForPreviousSessionModel = orderListModel
                .Where(customer => customer.CreatedTime >= request.FromDateOfThePreviousSession && customer.CreatedTime <= request.ToDateOfThePreviousSession).ToList();

            response.PlatformStatisticals = new List<GetCustomerReportWithPlatformResponse.PlatformStatistical>();
            foreach (var platform in platformList)
            {
                List<CustomerReportByPlatformModel> customerListForCurrentSessionByPlatformModel = customerListForCurrentSessionModel.Where(customer => customer.PlatformId == platform.Id).ToList();
                List<CustomerReportByPlatformModel> customerListForPreviousSessionByPlatformModel = customerListForPreviousSessionModel.Where(customer => customer.PlatformId == platform.Id).ToList();

                GetCustomerReportWithPlatformResponse.PlatformStatistical platformStatisticalItem = new GetCustomerReportWithPlatformResponse.PlatformStatistical();
                platformStatisticalItem.PlatformId = platform.Id;
                platformStatisticalItem.PlatformName = platform.Name;
                platformStatisticalItem.TotalCustomer = customerListForCurrentSessionByPlatformModel.Count();
                int numberOfCustomersChangeByPlatform = customerListForCurrentSessionByPlatformModel.Count() - customerListForPreviousSessionByPlatformModel.Count();
                platformStatisticalItem.IsDecreaseFromThePreviousSession = numberOfCustomersChangeByPlatform < 0 ? true : false;
                if (numberOfCustomersChangeByPlatform > 0 && customerListForPreviousSessionByPlatformModel.Count() > 0)
                {
                    platformStatisticalItem.PercentageChangeFromThePreviousSession = numberOfCustomersChangeByPlatform / customerListForPreviousSessionByPlatformModel.Count() * 100;
                }
                else
                {
                    platformStatisticalItem.PercentageChangeFromThePreviousSession = 0;
                }
                response.PlatformStatisticals.Add(platformStatisticalItem);
            }
            response.TotalCustomer = customerListForCurrentSessionModel.Count();
            response.TotalOrder = orderListForCurrentSessionModel.Count();
            int numberOfCustomersChange = response.TotalCustomer - customerListForPreviousSessionModel.Count();
            response.IsDecreaseCustomerFromThePreviousSession = numberOfCustomersChange < 0 ? true : false;
            if (numberOfCustomersChange > 0 && customerListForPreviousSessionModel.Count() > 0)
            {
                response.PercentageCustomerChangeFromThePreviousSession = numberOfCustomersChange / customerListForPreviousSessionModel.Count() * 100;
            }
            else
            {
                response.PercentageCustomerChangeFromThePreviousSession = 0;
            }
            response.RevenueByCustomer = orderListForCurrentSessionModel.Sum(order => order.OriginalPrice - order.TotalDiscountAmount);
            response.PlatformStatisticals = response.PlatformStatisticals.OrderByDescending(a => a.TotalCustomer).ToList();

            if (customerListForCurrentSessionModel.Count() > 0)
            {
                response.AverageOrder = orderListForCurrentSessionModel.Count() / customerListForCurrentSessionModel.Count();
            }

            return response;
        }

        private void HandlePeriodValue(GetCustomerReportWithPlatformRequest request)
        {
            var numOfDay = request.ToDate.Subtract(request.FromDate);

            switch (request.SegmentTimeOption)
            {
                case (EnumSegmentTime.Today):
                case (EnumSegmentTime.Yesterday):
                    request.FromDateOfThePreviousSession = request.FromDate.AddDays(-1);
                    request.ToDateOfThePreviousSession = request.ToDate.AddDays(-1);
                    break;
                case (EnumSegmentTime.ThisWeek):
                case (EnumSegmentTime.LastWeek):
                    request.FromDateOfThePreviousSession = request.FromDate.AddDays(-7);
                    request.ToDateOfThePreviousSession = request.FromDate.AddSeconds(-1);
                    break;
                case (EnumSegmentTime.ThisMonth):
                case (EnumSegmentTime.LastMonth):
                    request.FromDateOfThePreviousSession = request.FromDate.AddMonths(-1);
                    request.ToDateOfThePreviousSession = request.FromDate.AddSeconds(-1);
                    break;
                case (EnumSegmentTime.ThisYear):
                    request.FromDateOfThePreviousSession = request.FromDate.AddYears(-1);
                    request.ToDateOfThePreviousSession = request.FromDate.AddSeconds(-1);
                    break;
                default:
                    request.FromDateOfThePreviousSession = request.FromDate.AddDays(-numOfDay.TotalDays);
                    request.ToDateOfThePreviousSession = request.FromDate.AddSeconds(-1);
                    break;
            }
        }
    }
}
