import {http} from '../utils/http-common';

const controller = 'deliveryMethod';

/** This function is used to call the server to get delivery methods by store id.
 * @params {guid} The id of the store that you want to receive the payment method.
 */
const getDeliveryMethodsByStoreId = storeId => {
  return http.get(
    `/${controller}/get-delivery-methods-by-store-id?storeId=${storeId}`,
  );
};

const getEstimateFeeDeliveryMethodsByAddressAsync = data => {
  return http.post(
    `/${controller}/get-estimate-fee-delivery-methods-by-address`,
    data,
  );
};

const deliveryApiService = {
  getDeliveryMethodsByStoreId,
  getEstimateFeeDeliveryMethodsByAddressAsync,
};
export default deliveryApiService;
