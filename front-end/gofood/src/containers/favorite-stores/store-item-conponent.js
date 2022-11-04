import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  HeartIcon,
  LocationIcon,
  StarIcon,
} from '../../constants/icons.constants';
import {StoreDefault} from '../../constants/images.constants';
import {ScreenName} from '../../constants/screen.constants';
import String from '../../utils/string';
import styles from './favorite-stores.style';
const width = Dimensions.get('window').width;

export default function StoreItemComponent(props) {
  const {deleteItem, favoriteStore} = props;
  const navigation = useNavigation();

  const pageData = {
    promo: 'PROMO',
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 0.5,
      duration: 510,
      useNativeDriver: true,
    }).start();
  }, []);

  const animatedValue = new Animated.Value(0);

  const translate_Animation_Object = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-width, 0, width],
  });

  const opacity_Animation_Object = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  const onRemove = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 510,
      useNativeDriver: true,
    }).start(() => {
      deleteItem(favoriteStore?.storeId);
    });
  };

  const onClickStoreItem = favoriteStore => {
    let storeDetail = {
      storeId: favoriteStore?.storeId,
      branchId: favoriteStore?.storeBranches?.id,
    };
    navigation.navigate(ScreenName.storeDetails, {
      storeDetail,
    });
  };

  return (
    <Animated.View
      style={{
        transform: [{translateX: translate_Animation_Object}],
        opacity: opacity_Animation_Object,
      }}>
      <View style={styles.viewFavoriteStore}>
        <TouchableOpacity
          style={styles.viewLogo}
          onPress={() => onClickStoreItem(favoriteStore)}>
          <ImageBackground
            style={styles.viewLogo}
            imageStyle={{borderRadius: 10}}
            source={
              favoriteStore?.storeThumbnail == undefined
                ? StoreDefault
                : {uri: favoriteStore?.storeThumbnail}
            }>
            {favoriteStore?.isPromotion && (
              <View style={styles.viewPromo}>
                <Text style={styles.txtPromo}>{pageData.promo}</Text>
              </View>
            )}
          </ImageBackground>
        </TouchableOpacity>
        <View style={styles.viewInfoStore}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 8}}>
              <Text style={styles.storeName} numberOfLines={2}>
                {favoriteStore?.storeTitle}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity onPress={onRemove}>
                <HeartIcon />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.viewReview}>
            <View style={[styles.review, styles.viewReview]}>
              <StarIcon />
              <Text>{favoriteStore?.rating}</Text>
            </View>
            <View style={styles.viewReview}>
              <LocationIcon />
              <Text> {String.formatDistance(favoriteStore?.distance)}</Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
