import {http} from '../utils/http-common';

const controller = 'customer';

/** This function is used to call the server to check the phone number that already exists in the system.
 * @param  {string} phoneNumber The user's phone number, for example: +84123456789 or 0909123456
 * @param  {string} countryCode The current user's country code, for example: VN or US, and so on.
 */
const checkAccountAlreadyExistsInSystem = (phoneNumber, countryCode) => {
  return http.get(
    `/${controller}/check-account-already-exists-in-system?phoneNumber=${phoneNumber}&countryCode=${countryCode}`,
  );
};

/** This function is used to call server to create a new customer.
 * @param  {any} data The data to create a new account.
 */
const createCustomer = data => {
  return http.post(`/${controller}/quick-create-customer`, data);
};

const getCustomerInformation = () => {
  return http.get(`/${controller}/get-current-customer`);
};

const updateCustomerProfile = data => {
  return http.put(`/${controller}/update-customer-profile`, data);
};

const getCustomerOrderList = (
  takeTwoOrders,
  orderStatusList,
  sortBy,
  keyword,
  startDate,
  endDate,
) => {
  let orderStatuses = '';
  orderStatusList?.forEach((item, index) => {
    if (item) {
      orderStatuses += `orderStatusList=${item}&`;
    }
  });

  return http.get(
    `/${controller}/get-customer-order-list?takeTwoOrders=${
      takeTwoOrders ?? 'false'
    }&${orderStatuses ?? '&'}sortByStoreName=${sortBy ?? ''}&keyword=${
      keyword ?? ''
    }&startDate=${startDate ?? ''}&endDate=${endDate ?? ''}`,
  );
};

/** This function is used to call the server to check the customer status
 */
const getCustomerStatus = () => {
  return http.get(`/${controller}/get-customer-status`);
};

const updateCustomerPasswordAsync = data => {
  return http.post(`/${controller}/update-customer-password`, data);
};

const customerApiService = {
  createCustomer,
  getCustomerStatus,
  getCustomerOrderList,
  updateCustomerProfile,
  getCustomerInformation,
  updateCustomerPasswordAsync,
  checkAccountAlreadyExistsInSystem,
};
export default customerApiService;
