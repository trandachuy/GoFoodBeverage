import {http} from '../utils/http-common';

const controller = 'account';

const getAccountAddressesByAccountIdAsync = () => {
  return http.get(`/${controller}/get-account-addresses-by-account-id`);
};

const createAccountAddressAsync = data => {
  return http.post(`/${controller}/create-account-address`, data);
};

const deleteAccountAddressByIdAsync = id => {
  return http.delete(`/${controller}/delete-account-address-by-id/${id}`);
};

const getAccountAddressByIdAsync = id => {
  return http.get(`/${controller}/get-account-address-by-id/${id}`);
};

const updateAccountAddressByIdAsync = data => {
  return http.put(`/${controller}/update-account-address-by-id`, data);
};

const uploadAccountAvatarAsync = data => {
  return http.postFromForm(`/${controller}/upload-account-avatar-by-id`, data);
};

/** This function is used to call the server to disable existing account
 * when they are not using their accounts.
 */
const disableAccount = () => {
  return http.put(`/${controller}/disable-account`);
};

const accountApiService = {
  createAccountAddressAsync,
  getAccountAddressesByAccountIdAsync,
  deleteAccountAddressByIdAsync,
  getAccountAddressByIdAsync,
  updateAccountAddressByIdAsync,
  uploadAccountAvatarAsync,
  disableAccount,
};

export default accountApiService;
