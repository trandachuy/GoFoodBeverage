import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {usePromiseTracker} from 'react-promise-tracker';
import promotionApiService from '../../api-services/promotion-api-service';
import Layout from '../../components/layout';
import VoucherDetailModal from '../../components/voucher-detail-modal/voucher-detail.modal';
import DatabaseKeys from '../../constants/database-keys.constants';
import {
  PromoDiscountIcon,
  PromoPercentIcon,
} from '../../constants/icons.constants';
import {AstronautWithQuestion, Moon} from '../../constants/images.constants';
import {listDefaultLanguage} from '../../constants/language.constants';
import {ListPromotionType} from '../../constants/promotion.constants';
import {DateFormat} from '../../constants/string.constant';
import TextI18n from '../../i18n/text.i18n';
import DateTimeUtil from '../../utils/datetime';
import {formatTextNumber} from '../../utils/helpers';
import styles from './vouchers.style';

const DEFAULT_DATETIME_FORMAT = DateFormat.MONTH_DAY_YEAR;

export default function VouchersScreen({route}) {
  const {t} = useTranslation();
  const {promiseInProgress} = usePromiseTracker();
  const [vouchers, setVouchers] = useState([]);
  const [voucherDetail, setVoucherDetail] = useState({});
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [isPercentDiscount, setIsPercentDiscount] = useState(false);
  const [isShowVoucherDetail, setIsShowVoucherDetail] = useState(false);
  const [datetimeFormat, setDatetimeFormat] = useState(DEFAULT_DATETIME_FORMAT);
  const [storeBranchName, setStoreBranchName] = useState('');
  const [promotionId, setPromotionId] = useState();

  // This hook will be called the first time.
  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = async () => {
    const {storeId, branchId, storeBranchName, currencySymbol, vouchers, promotionId} = route?.params;
    setStoreBranchName(storeBranchName);
    setCurrencySymbol(currencySymbol);
    getDatetimeFormat();

    if (vouchers)
    {
      let voucherUses = vouchers.filter(item => item.id == promotionId);
      setPromotionId(promotionId);
      setVouchers(voucherUses);
      return;
    }
  
    let utcTime = DateTimeUtil.getUtcString(new Date());
    let promotionResult = await promotionApiService.getPromotionsInBranchAsync(
      storeId,
      branchId,
      utcTime,
    );
    setVouchers(promotionResult?.promotions);
  };

  const getDatetimeFormat = async () => {
    let currentLanguageCode =
      (await AsyncStorage.getItem(DatabaseKeys.language)) ??
      DatabaseKeys.defaultLanguage;

    let language = listDefaultLanguage.find(
      x => x.languageCode === currentLanguageCode,
    );
    setDatetimeFormat(
      language === undefined
        ? DEFAULT_DATETIME_FORMAT
        : language.datetimeFormat,
    );
  };

  const getNamePromotionType = promotionTypeId => {
    let promotionTypeName = '';
    let promotionType = ListPromotionType?.find(
      pt => pt.key === promotionTypeId,
    );
    if (promotionType != null) {
      promotionTypeName = t(promotionType.name);
    }
    return promotionTypeName;
  };

  const getEXP = voucher => {
    let exp = DateTimeUtil.utcToLocalDateString(
      voucher?.endDate,
      datetimeFormat,
    );
    return exp;
  };

  const getDiscountAmount = voucher => {
    let discountAmount = '';
    if (voucher?.isPercentDiscount) {
      discountAmount = `${voucher?.percentNumber}%`;
    } else {
      discountAmount = `${
        formatTextNumber(voucher?.maximumDiscountAmount) + currencySymbol
      }`;
    }
    return discountAmount;
  };

  const onViewVoucherDetail = voucher => {
    promotionApiService
      .getPromotionDetailByIdAsync(voucher?.id, voucher?.storeId)
      .then(res => {
        if (res?.isSuccess) {
          setVoucherDetail(res?.promotion);
          setIsPercentDiscount(voucher?.isPercentDiscount);
          setIsShowVoucherDetail(true);
        }
      });
  };

  const isUsed = voucher => {
    return promotionId === voucher.id;
  };

  const renderVouchers = () => {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={promiseInProgress}
            onRefresh={reloadData}
          />
        }>
        {vouchers?.map(voucher => {
          return (
            <View style={styles.viewVoucher}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.viewVoucherItem}
                onPress={() => onViewVoucherDetail(voucher)}>
                <View style={styles.viewPromo}>
                  {voucher?.isPercentDiscount ? (
                    <PromoPercentIcon style={styles.iconPromoPercent} />
                  ) : (
                    <PromoDiscountIcon style={styles.iconPromoPercent} />
                  )}
                </View>
                <View style={styles.voucherInfoBox}>
                  <Text style={styles.namePromo}>{voucher?.name}</Text>
                  <Text style={styles.infoPromo}>
                    {getNamePromotionType(voucher?.promotionTypeId)}
                  </Text>
                  {voucher?.endDate != null && (
                    <Text style={styles.infoPromo}>
                      {t(TextI18n.exp)}: {getEXP(voucher)}
                    </Text>
                  )}
                  <View style={styles.viewDiscountAmount}>
                    <Text
                      style={[
                        styles.discountAmount,
                        voucher?.isPercentDiscount
                          ? styles.bgPercent
                          : styles.bgDiscountValue,
                      ]}>
                      {getDiscountAmount(voucher)}
                    </Text>
                    <Text style={styles.isUsedText}>
                      {isUsed(voucher) && t(TextI18n.used)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <Layout title={t(TextI18n.applicableVouchers)} subTitle={storeBranchName}>
      <View style={styles.container}>
        {vouchers?.length > 0 ? (
          renderVouchers()
        ) : (
          <>
            <View style={{flex: 1}}>
              <Image
                style={styles.astronautImage}
                source={AstronautWithQuestion}
              />
              <Image style={styles.moonImage} source={Moon} />
            </View>
          </>
        )}
      </View>
      <VoucherDetailModal
        show={isShowVoucherDetail}
        isPercent={isPercentDiscount}
        voucherDetail={voucherDetail}
        currencySymbol={currencySymbol}
        closeVoucherDetailModal={() => setIsShowVoucherDetail(false)}
      />
    </Layout>
  );
}
