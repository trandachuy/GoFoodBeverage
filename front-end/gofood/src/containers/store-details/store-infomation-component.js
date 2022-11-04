import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Animated, TouchableOpacity} from 'react-native';
import {
  InformationIcon,
  LocationIcon,
  PromoIcon,
  StarIcon,
} from '../../constants/icons.constants';
import {StoreDefault} from '../../constants/images.constants';
import {ScreenName} from '../../constants/screen.constants';
import TextI18n from '../../i18n/text.i18n';
import {formatTextNumber} from '../../utils/helpers';
import styles from './store-details.style';
const Header_Maximum_Height = 170; //Max Height of the Header
const Header_Minimum_Height = 70; //Min Height of the Header
const Header_Opacity_Minimum_Height = 100;

const StoreInformationComponent = props => {
  const navigation = useNavigation();
  const {
    animHeaderValue,
    storeDetail,
    menuList,
    onClickMenuItem,
    keySelected,
    onSetRefMenu,
  } = props;

  const heightHeader = animHeaderValue.interpolate({
    inputRange: [0, Header_Maximum_Height],
    outputRange: [Header_Maximum_Height, Header_Minimum_Height],
    extrapolate: 'clamp',
  });

  const opacityMenu = animHeaderValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const opacityStoreDetail = animHeaderValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const {t} = useTranslation();

  const getDiscountAmount = voucher => {
    let discountAmount = '';
    if (voucher?.isPercentDiscount) {
      discountAmount = `${voucher?.percentNumber}%`;
    } else {
      discountAmount = formatTextNumber(voucher?.maximumDiscountAmount);
    }
    return discountAmount;
  };

  const onClickStoreInformation = e => {
    e.stopPropagation();
    navigation.navigate(ScreenName.storeInformation, {
      storeDetails: storeDetail,
      storeId: storeDetail?.id,
      branchId: storeDetail?.branchId,
    });
  };

  /**
   * This function is used to move to VouchersDetail page.
   */
  const onViewVouchers = () => {
    navigation.navigate(ScreenName.vouchers, {
      storeBranchName: `${storeDetail?.name} - ${storeDetail?.branchName}`,
      storeId: storeDetail?.id,
      branchId: storeDetail?.branchId,
      currencySymbol: storeDetail?.currencySymbol,
    });
  };

  return (
    <Animated.View
      style={{
        height: heightHeader,
      }}>
      <Animated.ScrollView
        horizontal
        ref={ref => {
          onSetRefMenu(ref);
        }}
        showsHorizontalScrollIndicator={false}
        style={[styles.viewMenu, {zIndex: opacityMenu, opacity: opacityMenu}]}>
        {menuList?.map((item, index) => (
          <TouchableOpacity
            key={item?.key}
            onPress={() => onClickMenuItem(index)}
            style={[
              styles.viewMenuItem,
              item?.key == keySelected && styles.backgroundColorMenuItemCative,
            ]}>
            <Animated.Text
              style={[
                styles.textMenuItem,
                item?.key == keySelected && styles.colorMenuItemActive,
              ]}>
              {item?.name}
            </Animated.Text>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>
      <Animated.View
        style={[
          styles.viewHeader,
          {zIndex: opacityStoreDetail, opacity: opacityStoreDetail},
        ]}>
        <Animated.View style={[styles.viewStoreDetail]}>
          <Animated.View style={styles.formStoreDetail}>
            <Animated.View style={styles.viewBranchInfo}>
              <Animated.Text numberOfLines={1} style={styles.textStoreName}>
                {storeDetail?.branchName}
              </Animated.Text>
              <TouchableOpacity
                onPress={e => onClickStoreInformation(e)}
                scrollEventThrottle={16}>
                <InformationIcon style={styles.informationIcon} />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={styles.addressStore}>
              <Animated.Text numberOfLines={2} style={styles.textAddressStore}>
                {storeDetail?.address}
              </Animated.Text>
            </Animated.View>
          </Animated.View>
          <Animated.View style={styles.imageStore}>
            <Animated.Image
              style={styles.thumbnail}
              source={
                storeDetail?.thumbnail
                  ? {uri: storeDetail?.thumbnail}
                  : StoreDefault
              }
            />
          </Animated.View>
        </Animated.View>
        <Animated.View style={styles.reviewStore}>
          {storeDetail?.promotions?.length > 0 && (
            <Animated.View style={styles.viewVoucher}>
              <Animated.View style={styles.formVoucher}>
                <PromoIcon />
                <Animated.Text style={styles.discountVoucher}>
                  {`${t(TextI18n.discount)} ${getDiscountAmount(
                    storeDetail?.promotions[0],
                  )}`}
                </Animated.Text>
              </Animated.View>
              <Animated.View>
                <TouchableOpacity onPress={() => onViewVouchers()}>
                  <Animated.Text style={styles.infoVoucher}>
                    {t(TextI18n.viewMoreVoucher)}
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          )}
          <Animated.View style={styles.formReview}>
            <Animated.View style={styles.viewReview}>
              <StarIcon />
              <Animated.Text style={styles.discountVoucher}>
                {storeDetail?.voted?.number}
              </Animated.Text>
            </Animated.View>
            <Animated.View style={styles.viewVoted}>
              <Animated.Text>
                {storeDetail?.voted?.votedCount} {t(TextI18n.voted)}
              </Animated.Text>
            </Animated.View>
          </Animated.View>
          <Animated.View style={styles.viewLocation}>
            <Animated.View style={styles.formLocation}>
              <LocationIcon />
              <Animated.Text
                style={
                  styles.discountVoucher
                }>{` ${storeDetail?.distance}`}</Animated.Text>
            </Animated.View>
            <Animated.View>
              <Animated.Text>{t(TextI18n.distance)}</Animated.Text>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

export default StoreInformationComponent;
