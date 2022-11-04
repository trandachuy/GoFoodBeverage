import {http} from '../utils/http-common';

const controller = 'order';

const getOrderDetailByIdAsync = (id, branchId) => {
  return http.get(
    `/${controller}/get-order-detail-by-id?id=${id}&&branchId=${branchId}`,
  );
};

const createOrderAsync = data => {
  return http.post(`/${controller}/create-order`, data);
};

const updateStatusOrderPaymentAsync = data => {
  return http.put(`/${controller}/update-status-order-payment`, data);
};

const updateOrderAsync = data => {
  return http.put(`/${controller}/update-order`, data);
};

const updateOrderByVnPayWalletSdkAsync = data => {
  return http.put(`/${controller}/update-order-by-vnpay-wallet-sdk`, data);
};

const orderApiService = {
  createOrderAsync,
  updateOrderAsync,
  getOrderDetailByIdAsync,
  updateStatusOrderPaymentAsync,
  updateOrderByVnPayWalletSdkAsync,
};
export default orderApiService;
