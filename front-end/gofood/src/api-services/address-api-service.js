import {http} from '../utils/http-common';

const controller = 'address';

/** This function is used to call the server to get a list of countries.
 */
const getCountriesAsync = () => {
  return http.get(`/${controller}/get-countries`);
};

const addressApiService = {
  getCountriesAsync,
};
export default addressApiService;
