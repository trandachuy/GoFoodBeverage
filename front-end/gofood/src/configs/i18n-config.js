import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import {initReactI18next} from 'react-i18next';
import DatabaseKeys from '../constants/database-keys.constants';
import {Urls} from '../constants/urls.constants';
import EnvironmentConfig from './environment-config';

// creating a language detection plugin.
// http://i18n.com/docs/ownplugin/#languagedetector
const languageDetector = {
  init: Function.prototype,
  type: 'languageDetector',
  async: true,
  detect: async callback => {
    const savedLanguage = await AsyncStorage.getItem(DatabaseKeys.language);
    const lng = savedLanguage ?? DatabaseKeys.defaultLanguage;
    callback(lng);
  },
  cacheUserLanguage: () => {},
};

i18n
  .use(Backend)
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    debug: false,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: true,
    },
    ns: ['translations'],
    defaultNS: 'translations',
    preload: ['en', 'vi'],
    keySeparator: '.',
    wait: true,
    backend: {
      allowMultiLoading: true,
      crossDomain: true,
      loadPath: `${
        EnvironmentConfig.isLocal ? Urls.rootLocalUrl : Urls.rootDevUrl
      }language/mobile/{{lng}}.json?v=${new Date().getTime()}`,
      init: {
        mode: 'cors',
        credentials: 'include',
        cache: 'default',
      },
      reloadInterval: EnvironmentConfig.isLocal ? 60000 : 5 * 60000, // 5 minutes in production mode and 1 minute in developer mode.
    },
    react: {
      useSuspense: false,
      wait: true,
    },
  });
export default i18n;
