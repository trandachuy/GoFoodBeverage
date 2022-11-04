import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Pin from '../../../../assets/icons/pin.svg';
import Start from '../../../../assets/icons/star.svg';
import {
  ProductDefault,
  StoreDefault,
} from '../../../../constants/images.constants';
import {ScreenName} from '../../../../constants/screen.constants';
import {formatTextNumber} from '../../../../utils/helpers';
import String from '../../../../utils/string';
import styles from './style';

export default function SearchIResultItem({data}) {
  const navigation = useNavigation();

  const getPriceValue = (priceValue, currencySymbol) => {
    let price = formatTextNumber(priceValue) + currencySymbol;
    return price;
  };

  const onClickStore = data => {
    const {storeId, storeBrandId, branchName} = data;
    let storeDetail = {
      storeId,
      branchId: storeBrandId,
    };
    navigation.navigate(ScreenName.storeDetails, {
      storeDetail,
    });
  };

  const renderNameTextMatching = (
    inputText,
    indexFrom,
    indexTo,
    numberOfLines = 2,
    originFontSize = 15,
    flex = 2,
  ) => {
    // Cases:
    // 1 match start  (0, n)
    // 2 match end    (n, text.length)
    // 3 match center (n,n)
    // 4 match all    (0, text.length)
    // 5 un-match     (0, 0)            => product in store, not store
    let text = inputText;

    // 1 match start
    if (indexFrom === 0 && indexTo !== 0 && indexTo < text.length - 1) {
      let textMatch = text.substring(indexFrom, indexTo + 1);
      let textRemain = text.substring(indexTo + 1, text.length);
      return (
        <View style={[styles.flex_start, {flex: flex}]}>
          <Text
            numberOfLines={numberOfLines}
            style={[styles.nameMatch, {fontSize: originFontSize}]}>
            {textMatch}
            <Text style={styles.nameUnmatch}>{textRemain}</Text>
          </Text>
        </View>
      );
    }
    // 2 match end
    else if (indexFrom > 0 && indexTo === text.length - 1) {
      let textMatch = text.substring(indexFrom, indexTo + 1);
      let textRemain = text.substring(0, indexFrom);
      return (
        <View style={[styles.flex_start, {flex: flex}]}>
          <Text
            numberOfLines={numberOfLines}
            style={[styles.nameUnmatch, {fontSize: originFontSize}]}>
            {textRemain}
            <Text style={styles.nameMatch}>{textMatch}</Text>
          </Text>
        </View>
      );
    }
    // 3 match center
    else if (0 < indexFrom && indexTo < text.length - 1) {
      let textLeft = text.substring(0, indexFrom);
      let textMatch = text.substring(indexFrom, indexTo + 1);
      let textRight = text.substring(indexTo + 1, text.length);
      return (
        <View style={[styles.flex_start, {flex: flex}]}>
          <Text
            numberOfLines={numberOfLines}
            style={[styles.nameUnmatch, {fontSize: originFontSize}]}>
            {textLeft}
            <Text style={styles.nameMatch}>{textMatch}</Text>
            {textRight}
          </Text>
        </View>
      );
    }
    // 4 match all
    else if (indexFrom === 0 && indexTo === text.length - 1) {
      return (
        <Text
          numberOfLines={numberOfLines}
          style={[styles.nameMatch, {fontSize: originFontSize}]}>
          {text}
        </Text>
      );
    }
    // 5 un-match
    else {
      return (
        <Text
          style={[styles.nameUnmatch, {flex: flex, fontSize: originFontSize}]}
          numberOfLines={numberOfLines}>
          {text}
        </Text>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Item result */}
      <TouchableOpacity
        style={styles.resultItem}
        activeOpacity={0.5}
        onPress={() => onClickStore(data)}>
        {/* THUMBNAIL */}
        <View style={styles.itemThumbnail}>
          <Image
            style={styles.imgBox_Img}
            source={data?.thumbnail ? {uri: data?.thumbnail} : StoreDefault}
          />
          {data?.isPromo ? <Text style={styles.itemPROMO}>PROMO</Text> : null}
        </View>

        {/* INFORMATION */}
        <View style={styles.itemInfo}>
          {/* Store Name */}
          {renderNameTextMatching(
            data?.name,
            data?.matchFromIndex,
            data?.matchToIndex,
          )}

          {/* Rating and Distance */}
          <View style={styles.itemRatingDistance}>
            <View style={styles.itemRating}>
              <Start />
              <Text>{data?.rating}</Text>
            </View>
            <View style={styles.itemDistance}>
              <Pin />
              <Text> {String.formatDistance(data?.distance)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Sub items */}
      {data?.products?.length > 0 ? (
        <View style={styles.resultProducts}>
          {data?.products?.map(product => {
            return (
              <TouchableOpacity
                key={product.id}
                style={styles.productItem}
                onPress={() => onClickStore(data)}>
                <View style={styles.productItem_ImageBox}>
                  <Image
                    style={styles.productItem_Image}
                    source={
                      product?.thumbnail
                        ? {uri: product?.thumbnail}
                        : ProductDefault
                    }
                  />
                </View>

                <View style={styles.productItem_Name}>
                  {renderNameTextMatching(
                    product.name,
                    product?.matchFromIndex,
                    product?.matchToIndex,
                    1,
                    13,
                    1,
                  )}
                  <View style={styles.productItem_Prices}>
                    {product?.hasDiscount ? (
                      <View style={styles.productItem_SellingPrices}>
                        <Text style={{color: '#000'}}>
                          {getPriceValue(
                            product?.sellingPrice,
                            data?.currencySymbol,
                          )}
                        </Text>
                        <Text> - </Text>
                        <Text style={styles.lineThrough}>
                          {getPriceValue(product?.price, data?.currencySymbol)}
                        </Text>
                      </View>
                    ) : (
                      <Text>
                        {getPriceValue(product?.price, data?.currencySymbol)}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
