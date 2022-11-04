import {http} from '../utils/http-common';

const controller = 'store';

const getStoresByAddressAsync = data => {
  return http.get(
    `/${controller}/get-stores-by-address?currentDate=${
      data?.currentDate ?? ''
    }&latitude=${data?.latitude}&longitude=${data?.longitude}&storeType=${data?.storeType}`,
  );
};

const getAllBranchesByStoreIdOrBranchId = data => {
  return http.post(
    `/${controller}/get-all-branches-by-store-id-or-branch-id`,
    data,
  );
};

const searchProductByNameOrStoreNameRequest = data => {
  return http.post(`/${controller}/search-product-by-name-or-store-name`, data);
};

const storeApiService = {
  getStoresByAddressAsync,
  getAllBranchesByStoreIdOrBranchId,
  searchProductByNameOrStoreNameRequest,
};
export default storeApiService;
