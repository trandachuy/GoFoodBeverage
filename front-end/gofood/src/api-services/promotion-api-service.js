import {http} from '../utils/http-common';

const controller = 'promotion';

const getPromotionsInBranchAsync = (storeId, branchId, currentDate) => {
  return http.get(
    `/${controller}/get-promotions-in-branch?storeId=${storeId}&branchId=${branchId}&currentDate=${
      currentDate ?? ''
    }`,
  );
};

const getPromotionDetailByIdAsync = (promotionId, storeId) => {
  return http.get(
    `/${controller}/get-promotion-detail-by-id?promotionId=${promotionId}&storeId=${storeId}`,
  );
};

const promotionApiService = {
  getPromotionsInBranchAsync,
  getPromotionDetailByIdAsync,
};
export default promotionApiService;
