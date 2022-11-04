import {http} from '../utils/http-common';

const controller = 'payment';
const controllerPaymentConfig = 'paymentConfig';

/** This function is used to call the server to get all payment methods of the store.
 * @params {guid} The id of the store that you want to receive the payment method.
 */
const getPaymentConfigurationByStore = storeId => {
  return http.get(
    `/${controllerPaymentConfig}/get-payment-configuration-by-store-id?storeId=${storeId}`,
  );
};

const createMobileMoMoPaymentAsync = data => {
  return http.post(`/${controller}/create-mobile-momo-payment`, data);
};

const paymentConfigApiService = {
  getPaymentConfigurationByStore,
  createMobileMoMoPaymentAsync,
};
export default paymentConfigApiService;
