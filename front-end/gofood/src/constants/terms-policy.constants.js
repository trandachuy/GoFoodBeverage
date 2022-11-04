import i18n from '../configs/i18n-config';
import { languageCode } from './language.constants';

export const termOfUseUrls = [
    {
        languageCode: languageCode.vi,
        url: 'https://gosell.vn/dieu-khoan-chung-va-chinh-sach-bao-mat',
        isDefault: true
    },
    {
        languageCode: languageCode.en,
        url: 'https://gosell.vn/en/terms-conditions',
        isDefault: false
    }
];

export const privacyPolicyUrls = [
    {
        languageCode: languageCode.vi,
        url: 'https://gosell.vn/chinh-sach-bao-mat-ung-dung',
        isDefault: true
    },
    {
        languageCode: languageCode.en,
        url: 'https://gosell.vn/en/app-privacy-policy',
        isDefault: false
    }
];

export const getUrl = (listUrl) => {
    let languageCode = i18n.language;
    let result = listUrl.find(item => item.languageCode === languageCode);
    if (result == null) return listUrl.find(item => item.isDefault).url;
    return result.url;
}

export const getTermOfUseUrl = () => {
    return getUrl(termOfUseUrls);
}

export const getPrivacyPolicyUrl = () => {
    return getUrl(privacyPolicyUrls);
}