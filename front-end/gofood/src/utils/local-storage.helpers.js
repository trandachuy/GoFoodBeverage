export const localStorageKeys = {
  USED_TIME: 'USED_TIME',
  TOKEN: 'TOKEN',
};

export const getStorage = key => {
  return localStorage.getItem(key);
};

export const setStorage = (key, value) => {
  localStorage.setItem(key, value);
};
