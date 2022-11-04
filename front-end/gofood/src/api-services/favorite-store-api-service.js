import {http} from '../utils/http-common';

const controller = 'favoriteStore';

const getFavoriteStoresByCustomerIdAsync = data => {
  return http.get(
    `/${controller}/get-favoriteStores-by-customer-id?customerId=${data.customerId}&currentDate=${data.currentDate}&latitude=${data?.latitude}&longitude=${data?.longitude}`,
  );
};

const removeStoreLeaveFavoriteStoresAsync = data => {
  return http.post(`/${controller}/remove-store-leave-favoriteStores`, data);
};

const addStoreOnFavoriteStoresAsync = data => {
  return http.post(`/${controller}/add-store-on-favoriteStores`, data);
};

const favoriteStoreApiService = {
  addStoreOnFavoriteStoresAsync,
  getFavoriteStoresByCustomerIdAsync,
  removeStoreLeaveFavoriteStoresAsync,
};
export default favoriteStoreApiService;
