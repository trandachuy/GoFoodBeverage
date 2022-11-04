import {http} from '../utils/http-common';

const controller = 'login';

/** This function is used to call the server to grant the client permission to access the API services.
 * @params {any} data The form data, for example: {loginInfo, 'abc@email.com', password: '123456'}
 */
const loginForCustomer = data => {
  return http.post(`/${controller}/customer`, data);
};

const loginApiService = {
  loginForCustomer,
};
export default loginApiService;
