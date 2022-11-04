import moment from 'moment';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Modal, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {
  CommentCheckIcon,
  LeftArrowIcon,
  PromoDiscountLargeIcon,
  PromoPercentLargeIcon,
} from '../../constants/icons.constants';
import {ListPromotionType} from '../../constants/promotion.constants';
import {DateFormat} from '../../constants/string.constant';
import TextI18n from '../../i18n/text.i18n';
import {formatTextNumber} from '../../utils/helpers';
import styles from './voucher-detail.style';

export default function VoucherDetailModal(props) {
  const {t} = useTranslation();
  const {
    show,
    isPercent,
    voucherDetail,
    closeVoucherDetailModal,
    currencySymbol,
  } = props;

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

  const renderTermsAndConditions = termsAndCondition => {
    let arrTermsAndCondition = termsAndCondition?.split(/\r?\n/);
    return (
      termsAndCondition?.length > 0 && (
        <View style={styles.viewFooter}>
          <Text style={styles.title}>{t(TextI18n.termsAndConditions)}</Text>
          {arrTermsAndCondition?.map(item => (
            <>
              {item?.length > 0 && (
                <Text style={styles.textItem}>
                  {'\u2022' + ' '}
                  {item}
                </Text>
              )}
            </>
          ))}
        </View>
      )
    );
  };

  const renderProductDiscountsApply = (products, title) => {
    return (
      products?.length > 0 && (
        <View style={styles.viewFooter}>
          <Text style={styles.title}>{t(title)}</Text>
          {products?.map(product => (
            <Text style={styles.textItem}>
              {'\u2022' + ' '}
              {product?.name}
            </Text>
          ))}
        </View>
      )
    );
  };

  const renderAdditionalConditions = voucherDetail => {
    let isMinimumPurchaseAmount = voucherDetail?.isMinimumPurchaseAmount;
    let isSpecificBranch = voucherDetail?.isSpecificBranch;
    let branches = voucherDetail?.branches;
    let isIncludedTopping = voucherDetail?.isIncludedTopping;

    return (
      <View style={[styles.viewFooter, {marginTop: 0}]}>
        {(isMinimumPurchaseAmount ||
          !isSpecificBranch ||
          branches?.length > 0 ||
          isIncludedTopping) && (
          <Text style={[styles.title, {marginBottom: 0}]}>
            {t(TextI18n.additionalConditions)}
          </Text>
        )}
        {isMinimumPurchaseAmount && (
          <>
            <View style={styles.viewItem}>
              <CommentCheckIcon />
              <Text style={styles.textItemAdditionalConditions}>
                {t(TextI18n.checkboxPurchaseAmount)}
              </Text>
            </View>
            <View>
              <Text style={styles.textItemDetail}>
                {formatTextNumber(voucherDetail?.minimumPurchaseAmount)}
              </Text>
            </View>
          </>
        )}
        {!isSpecificBranch ? (
          <View style={styles.viewItem}>
            <CommentCheckIcon />
            <Text style={styles.textItemAdditionalConditions}>
              {t(TextI18n.applyForAllBranches)}
            </Text>
          </View>
        ) : (
          <>
            {branches?.length > 0 && (
              <>
                <View style={styles.viewItem}>
                  <CommentCheckIcon />
                  <Text style={styles.textItemAdditionalConditions}>
                    {t(TextI18n.checkboxSpecificBranches)}
                  </Text>
                </View>
                <View>
                  {branches?.map(branch => (
                    <Text style={styles.textItemDetail}>{branch?.name}</Text>
                  ))}
                </View>
              </>
            )}
          </>
        )}
        {isIncludedTopping && (
          <View style={styles.viewItem}>
            <CommentCheckIcon />
            <Text style={styles.textItemAdditionalConditions}>
              {t(TextI18n.includedTopping)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const getDiscountAmount = voucher => {
    let discountAmount = '';
    if (voucher?.isPercentDiscount) {
      discountAmount = `${voucher?.percentNumber}%`;
    } else {
      discountAmount =
        formatTextNumber(voucher?.maximumDiscountAmount) + currencySymbol;
    }
    return discountAmount;
  };

  return (
    <Modal animationType="slide" transparent={true} visible={show}>
      <View style={styles.container}>
        <View style={styles.form}>
          <View style={styles.viewBack}>
            <TouchableOpacity onPress={() => closeVoucherDetailModal()}>
              <View>
                <LeftArrowIcon />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.viewIconDiscount}>
            <View
              style={[
                styles.iconDiscount,
                isPercent ? styles.colorIconPercent : styles.colorIconDiscount,
              ]}>
              {isPercent ? (
                <PromoPercentLargeIcon />
              ) : (
                <PromoDiscountLargeIcon />
              )}
            </View>
          </View>
          <View style={styles.voucher}>
            <Text style={styles.voucherName}>{voucherDetail?.name}</Text>
            <Text style={styles.discountType}>
              {getNamePromotionType(voucherDetail?.promotionTypeId)}
            </Text>
            {voucherDetail?.endDate != null && (
              <Text style={styles.discountType}>
                {t(TextI18n.exp)}:{' '}
                {moment(voucherDetail?.endDate).format(DateFormat.DD_MM_YYYY)}
              </Text>
            )}
            <View style={styles.viewDiscountAmount}>
              <Text
                style={[
                  styles.discountAmount,
                  voucherDetail?.isPercentDiscount
                    ? styles.bgPercent
                    : styles.bgDiscoutValue,
                ]}>
                {getDiscountAmount(voucherDetail)}
              </Text>
            </View>
          </View>
          <ScrollView>
            {renderTermsAndConditions(voucherDetail?.termsAndCondition)}
            {renderProductDiscountsApply(
              voucherDetail?.products,
              TextI18n.productDiscountsApply,
            )}
            {renderProductDiscountsApply(
              voucherDetail?.productCategories,
              TextI18n.productCategoryDiscountsApply,
            )}
            {renderAdditionalConditions(voucherDetail)}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
