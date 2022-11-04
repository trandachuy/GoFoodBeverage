using AutoMapper;
using GoFoodBeverage.Common.Extensions;
using GoFoodBeverage.Domain.Entities;
using GoFoodBeverage.Domain.Enums;
using GoFoodBeverage.Interfaces;
using GoFoodBeverage.Models.QRCode;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MoreLinq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.Application.Features.QRCodes.Queries
{
    public class GetAllQRCodeRequest : IRequest<GetAllQRCodeResponse>
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }

        public Guid? BranchId { get; set; }

        public int? ServiceTypeId { get; set; }

        public int? TargetId { get; set; }

        public int? StatusId { get; set; }
    }

    public class GetAllQRCodeResponse
    {
        public IEnumerable<QRCodeModel> QRCodes { get; set; }

        public QRCodeFilterModel QRCodeFilters { get; set; }

        public int Total { get; set; }
    }

    public class GetAllQRCodeRequestHandler : IRequestHandler<GetAllQRCodeRequest, GetAllQRCodeResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IDateTimeService _dateTime;

        public GetAllQRCodeRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IDateTimeService dateTime)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _dateTime = dateTime;
        }

        public async Task<GetAllQRCodeResponse> Handle(GetAllQRCodeRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var listQRCode = new PagingExtensions.Pager<QRCode>(new List<QRCode>(), 0);
            if (string.IsNullOrEmpty(request.KeySearch))
            {
                listQRCode = await _unitOfWork.QRCodes
                .GetAllQRCodeInStore(loggedUser.StoreId.Value)
                .AsNoTracking()
                .OrderByDescending(p => p.CreatedTime)
                .ToPaginationAsync(request.PageNumber, request.PageSize);
            }
            else
            {
                string keySearch = request.KeySearch.Trim().ToLower();
                listQRCode = await _unitOfWork.QRCodes
                .GetAllQRCodeInStore(loggedUser.StoreId.Value)
                .Where(qr => qr.Name.ToLower().Contains(keySearch))
                .AsNoTracking()
                .OrderByDescending(p => p.CreatedTime)
                .ToPaginationAsync(request.PageNumber, request.PageSize);
            }

            var listQRCodeModels = _mapper.Map<IEnumerable<QRCodeModel>>(listQRCode.Result);

            listQRCodeModels.ForEach(item =>
            {
                if (item.IsStopped)
                {
                    item.StatusId = (int)EnumQRCodeStatus.Finished;
                }
                else
                {
                    item.StatusId = (int)GetQRCodeStatus(item.StartDate, item.EndDate);
                }
            });

            ///Initial Filter
            var qrCodeFilter = new QRCodeFilterModel();
            qrCodeFilter.Branches = _unitOfWork.StoreBranches.Find(sb => sb.StoreId == loggedUser.StoreId)
                .Select(c => new QRCodeFilterModel.BranchDto { Id = c.Id, Name = c.Name })
                .ToList();
            qrCodeFilter.ServiceTypes = Enum.GetValues(typeof(EnumOrderType))
                                .Cast<EnumOrderType>()
                                .Where(ot => ot == EnumOrderType.Instore || ot == EnumOrderType.Online)
                                .Select(e => new QRCodeFilterModel.ServiceTypeDto { Id = e })
                                .ToList();
            qrCodeFilter.Targets = Enum.GetValues(typeof(EnumTargetQRCode))
                                .Cast<EnumTargetQRCode>()
                                .Select(e => new QRCodeFilterModel.TargetDto { Id = e })
                                .ToList();
            qrCodeFilter.Status = Enum.GetValues(typeof(EnumQRCodeStatus))
                                .Cast<EnumQRCodeStatus>()
                                .Select(e => new QRCodeFilterModel.StatusDto { Id = e })
                                .ToList();

            ///Handle Filter
            if (listQRCodeModels != null)
            {
                if (request.BranchId != null)
                {
                    listQRCodeModels = listQRCodeModels.Where(qr => qr.StoreBranchId == request.BranchId);
                }

                if (request.ServiceTypeId != null)
                {
                    listQRCodeModels = listQRCodeModels.Where(qr => qr.ServiceTypeId == (EnumOrderType)request.ServiceTypeId);
                }

                if (request.TargetId != null)
                {
                    listQRCodeModels = listQRCodeModels.Where(qr => qr.TargetId == (EnumTargetQRCode)request.TargetId);
                }

                if (request.StatusId != null)
                {
                    listQRCodeModels = listQRCodeModels.Where(qr => qr.StatusId == (int)request.StatusId);
                }
            }

            var response = new GetAllQRCodeResponse()
            {
                QRCodes = listQRCodeModels,
                QRCodeFilters = qrCodeFilter,
                Total = listQRCode.Total
            };

            return response;
        }

        private EnumQRCodeStatus GetQRCodeStatus(DateTime startDate, DateTime? endDate)
        {
            var result = _dateTime.NowUtc.Date.CompareTo(startDate.Date);

            if (result < 0)
            {
                return EnumQRCodeStatus.Scheduled;
            }
            else if (result == 0)
            {
                return EnumQRCodeStatus.Active;
            }
            else
            {
                if (endDate.HasValue)
                {
                    return _dateTime.NowUtc.Date.CompareTo(endDate.Value.Date) > 0 ? EnumQRCodeStatus.Finished : EnumQRCodeStatus.Active;
                }
                else
                {
                    return EnumQRCodeStatus.Active;
                }
            }
        }
    }
}
