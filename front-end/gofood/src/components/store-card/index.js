import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import Pin from '../../assets/icons/pin.svg';
import Start from '../../assets/icons/star.svg';
import {StoreDefault} from '../../constants/images.constants';
import {ScreenName} from '../../constants/screen.constants';
import TextI18n from '../../i18n/text.i18n';
import String from '../../utils/string';
import styles from './style';

export default function StoreCart({storeItem}) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const storeInfo = storeItem.item;

  /**
   * This function is used to navigate to the Store Details when the user clicks on the store item.
   */
  const onShowStoreDetails = () => {
    let storeDetail = {
      storeId: storeInfo?.id,
      branchId: storeInfo?.storeBranches?.id,
    };
    navigation.navigate(ScreenName.storeDetails, {storeDetail});
  };

  return (
    <TouchableOpacity delayPressIn={100} onPress={onShowStoreDetails}>
      <View style={styles.container}>
        <View style={styles.imgBox}>
          <ImageBackground
            style={styles.imgBox_Img}
            imageStyle={{borderRadius: 10}}
            source={storeInfo?.logo ? {uri: storeInfo?.logo} : StoreDefault}>
            {storeInfo?.isPromotion && (
              <View style={styles.promotionBox}>
                <Text style={styles.promotionText}>{t(TextI18n.promo)}</Text>
              </View>
            )}
          </ImageBackground>
        </View>

        <View style={styles.contentBox}>
          <View>
            <Text numberOfLines={2} style={styles.storeName}>
              {storeInfo?.title}
            </Text>
          </View>

          <View style={styles.locationInfo}>
            <View style={styles.ratingBox}>
              <View style={styles.iconBox}>
                <Start />
              </View>

              <View>
                <Text style={styles.textInfo}>{storeInfo?.rating}</Text>
              </View>
            </View>

            <View style={styles.locationBox}>
              <View style={styles.iconBox}>
                <Pin />
              </View>

              <View>
                <Text style={styles.textInfo}>
                  {String.formatDistance(storeInfo?.distance)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
