import React from 'react';
import {FlagVnIcon, FlagEngIcon} from '../../src/constants/icons.constants';
import TextI18n from '../i18n/text.i18n';
import {DateFormat} from './string.constant';
export const languageCode = {
  en: 'en',
  vi: 'vi',
  ko: 'ko',
  ja: 'ja',
  zh: 'zh',
  th: 'th',
  ms: 'ms',
  id: 'id',
};

export const listDefaultLanguage = [
  {
    name: TextI18n.languageVn,
    emoji: 'VN',
    isPublish: false,
    isDefault: false,
    languageCode: 'vi',
    countryCode: 'VN',
    datetimeFormat: DateFormat.DD_MM_YYYY,
    flag: <FlagVnIcon />,
  },
  {
    name: TextI18n.languageEn,
    emoji: 'GB',
    isPublish: false,
    isDefault: false,
    languageCode: 'en',
    countryCode: 'US',
    datetimeFormat: DateFormat.MONTH_DAY_YEAR,
    flag: <FlagEngIcon />,
  },
];
