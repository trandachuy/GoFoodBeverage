import axios from 'axios';
import {trackPromise} from 'react-promise-tracker';
import EnvironmentConfig from '../configs/environment-config';
import {store} from '../configs/store-config';
import {PosUrl, Urls} from '../constants/urls.constants';
import appInsights from './azure-app-insights';

const getPosWebsite = () => {
  return PosUrl.devEnvironment;
};

const httpProvider = axios.create({
  // The URL will be changed in different environments.
  baseURL: EnvironmentConfig.isLocal ? Urls.localUrl : Urls.devUrl,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    transactionId: `${new Date().getTime()}`,
  },
  timeout: 30000,
});

httpProvider.interceptors.request.use(
  async config => {
    const token = _getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const usedTimePreviousAction = 5000;
    if (usedTimePreviousAction) {
      config.headers['used-time'] = usedTimePreviousAction;
    }

    try {
      appInsights.trackTrace(JSON.stringify(config));
    } catch {}

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

httpProvider.interceptors.response.use(
  async response => {
    try {
      appInsights.trackTrace(JSON.stringify(response));
    } catch {}
    if (response.status === 200) {
      return response;
    }
    return response;
  },
  error => {
    try {
      appInsights.trackException(error?.response);
    } catch {}
    return Promise.reject(error?.response);
  },
);

const _getToken = () => {
  let token = store.getState()?.session?.token;
  return token;
};

const getMethod = async url => {
  try {
    let result = await trackPromise(httpProvider.get(url));
    return result.data;
  } catch (err) {
    return await trackPromise(Promise.reject(err));
  }
};

const postMethod = async (url, data) => {
  try {
    let result = await trackPromise(httpProvider.post(url, data));
    return result.data;
  } catch (err) {
    return await trackPromise(Promise.reject(err));
  }
};

const putMethod = async (url, data) => {
  try {
    let result = await trackPromise(httpProvider.put(url, data));
    return result.data;
  } catch (err) {
    return await trackPromise(Promise.reject(err));
  }
};

const deleteMethod = async url => {
  try {
    let result = await trackPromise(httpProvider.delete(url));
    return result.data;
  } catch (err) {
    return await trackPromise(Promise.reject(err));
  }
};

const postToFormMethod = async (url, data) => {
  try {
    let result = await trackPromise(
      httpProvider.post(url, data, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }),
    );
    return result.data;
  } catch (err) {
    return await trackPromise(Promise.reject(err));
  }
};

export const http = {
  get: getMethod,
  post: postMethod,
  put: putMethod,
  delete: deleteMethod,
  postFromForm: postToFormMethod,
  getPosWebsite,
};
