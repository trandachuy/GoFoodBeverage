import {http} from '../utils/http-common';

const controller = 'product';

const getProductCategoriesActivatedAsync = (
  storeId,
  customerId,
  branchId,
  currentDate,
  latitude,
  longitude,
) => {
  return http.get(
    `/${controller}/get-product-categories-activated-by-store-id?storeId=${storeId}&customerId=${customerId}&branchId=${branchId}&currentDate=${
      currentDate ?? ''
    }&latitude=${latitude}&longitude=${longitude}`,
  );
};

const calculateTotalAmountInCartAsync = data => {
  return http.post(`/${controller}/calculate-product-cart-item`, data);
};

const getProductDetailByIdAsync = data => {
  return http.get(
    `/${controller}/get-product-detail-by-id?productId=${data?.productId}&storeId=${data?.storeId}`,
  );
};

const getComboProductByComboIdAsync = data => {
  return http.get(
    `/${controller}/get-combo-product-by-combo-id?storeId=${data?.storeId}&comboId=${data?.comboId}&isComboPricing=${data?.isComboPricing}&comboPricingId=${data?.comboPricingId}`,
  );
};

const productApiService = {
  calculateTotalAmountInCartAsync,
  getProductCategoriesActivatedAsync,
  getProductDetailByIdAsync,
  getComboProductByComboIdAsync,
};

export default productApiService;
