import {http} from '../utils/http-common';

const controller = 'file';

const uploadFile = data => {
  return http.postFromForm(`/${controller}/upload`, data);
};

const fileApiService = {
  uploadFile,
};

export default fileApiService;
