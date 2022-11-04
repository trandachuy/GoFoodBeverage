import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {Avatar} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  ImageBackground,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {usePromiseTracker} from 'react-promise-tracker';
import {useDispatch, useSelector} from 'react-redux';
import storeApiService from '../../api-services/store-api-service';
import Layout from '../../components/layout';
import UserProfileComponent from '../../components/user-profile-modal/user-profile';
import DatabaseKeys from '../../constants/database-keys.constants';
import {
  AccountIcon,
  ArtboardIcon,
  DrinkIcon,
  FoodIcon,
  LocationIcon,
  NotiIcon,
  ScanBarCodeIcon,
  SearchIcon,
  StarIcon,
} from '../../constants/icons.constants';
import {
  Banner_1,
  Banner_2,
  Banner_3,
  StoreDefault,
} from '../../constants/images.constants';
import {ScreenName} from '../../constants/screen.constants';
import {DateFormat} from '../../constants/string.constant';
import {
  getCurrentCustomerAddress,
  getCustomerInfo,
  setCurrentCustomerAddress,
} from '../../data-services/session-data-service';
import TextI18n from '../../i18n/text.i18n';
import {windowWidth} from '../../utils/dimensions';
import {getCurrentLocationByGps} from '../../utils/google';
import String from '../../utils/string';
import styles from './home.style';
import { StoreType } from '../../constants/store-constants';
const SLIDER_WIDTH = windowWidth;
const ITEM_WIDTH = SLIDER_WIDTH - 48;

export default function HomeScreen() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const isFocus = useIsFocused();
  const navigation = useNavigation();
  const [stores, setStores] = useState([]);
  const {promiseInProgress} = usePromiseTracker();
  const customerInformation = useSelector(getCustomerInfo);
  const currentCustomerAddress = useSelector(getCurrentCustomerAddress);
  const [showUserProfileView, setShowUserProfileView] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setHidden(false);
    }
    getInitDataStores();
  }, [isFocus]);

  const getPromotions = () => {
    const promotions = [
      {
        id: 0,
        imgUrl: Banner_1,
      },
      {
        id: 1,
        imgUrl: Banner_2,
      },
      {
        id: 2,
        imgUrl: Banner_3,
      },
    ];
    return (
      <View>
        <Carousel
          loop={true}
          autoplay={true}
          interval={5000}
          data={promotions}
          itemWidth={ITEM_WIDTH}
          renderItem={renderItem}
          sliderWidth={SLIDER_WIDTH}
          inactiveSlideScale={0.94}
        />
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={`home-render-slider-idx${index}`}
        activeOpacity={0.8}
        style={{justifyContent: 'center'}}>
        <Image
          style={{width: ITEM_WIDTH, borderRadius: 8}}
          source={item.imgUrl}
        />
      </TouchableOpacity>
    );
  };

  const showStoreByBusiness = (storeType) => {
    if (storeType != null) {
      navigation.navigate(ScreenName.store, {
        storeType: storeType
      });
    }
  }

  //Render menus
  const getMenuList = () => {
    const menus = [
      {
        name: t(TextI18n.scan),
        image: <ScanBarCodeIcon />,
        key: null
      },
      {
        name: t(TextI18n.foods),
        image: <FoodIcon />,
        key: StoreType.Food
      },
      {
        name: t(TextI18n.drinks),
        image: <DrinkIcon />,
        key: StoreType.Beverages
      },
    ];
    return (
      <>
        {menus?.map((menu, index) => {
          return (
            <TouchableOpacity
              key={`home-menu-list-idx-${index}`}
              style={styles.viewMenuItem}
              onPress={() => showStoreByBusiness(menu?.key)}>
              <View style={styles.viewImageMenuItem}>{menu?.image}</View>
              <Text style={styles.textMenuItem}>{menu?.name}</Text>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  //Get stores by address
  const getInitDataStores = async () => {
    const addressInfo = await getLocationCurrent();
    if (addressInfo?.isSuccess) {
      let currentDate = moment().format(DateFormat.START_DATE);
      let req = {
        currentDate: currentDate,
        latitude: addressInfo?.lat,
        longitude: addressInfo?.lng,
        storeType: ''
      };
      let res = await storeApiService.getStoresByAddressAsync(req);
      let stores = [];
      if (res?.stores?.length > 0) {
        res?.stores?.map(item => {
          let store = {
            id: item?.id,
            name: item?.title,
            branchId: item?.storeBranches?.id,
            branchName: item?.storeBranches?.name,
            promo: item?.isPromotion,
            review: item?.rating,
            distance: String.formatDistance(item?.distance),
            logo: item?.logo,
            image: (
              <ImageBackground
                source={item?.logo ? {uri: item?.logo} : StoreDefault}
                style={styles.imageStore}
                imageStyle={{borderRadius: 10}}>
                {item?.isPromotion && (
                  <View style={styles.viewPromo}>
                    <Text style={styles.textPromo}>{t(TextI18n.promo)}</Text>
                  </View>
                )}
              </ImageBackground>
            ),
          };
          stores.push(store);
        });
      }
      setStores(stores);
    } else {
      navigation.navigate(ScreenName.noLocation);
    }
  };

  const getLocationCurrent = async () => {
    let addressInfo = null;
    let stringOfAddressInfo = await AsyncStorage.getItem(
      DatabaseKeys.currentCustomerAddress,
    );
    addressInfo = JSON.parse(stringOfAddressInfo);
    if (addressInfo?.isSuccess) {
      addressInfo = JSON.parse(stringOfAddressInfo);
      return addressInfo;
    } else {
      addressInfo = await getCurrentLocationByGps();
      if (addressInfo?.isSuccess) {
        let jsonString = JSON.stringify(addressInfo);
        await AsyncStorage.setItem(
          DatabaseKeys.currentCustomerAddress,
          jsonString,
        );
        dispatch(setCurrentCustomerAddress(addressInfo));
      }
      return addressInfo;
    }
  };

  //Render recommend stores
  const getStores = () => {
    return (
      <>
        {stores?.map((store, index) => {
          if (index < 5) {
            return (
              <TouchableOpacity
                key={`home-store-item-${index}`}
                activeOpacity={0.8}
                onPress={e => onClickStoreItem(e, store)}>
                <View style={styles.viewStoreItem}>
                  <View style={styles.storeItem}>
                    {store?.image}
                    <Text numberOfLines={2} style={styles.textStoreName}>
                      {store?.name}
                    </Text>
                  </View>
                  <View style={styles.header}>
                    <View style={styles.review}>
                      <StarIcon />
                      <Text style={styles.textReview}>{store?.review}</Text>
                    </View>
                    <View style={styles.distance}>
                      <LocationIcon />
                      <Text style={styles.textReview}>{store?.distance}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }
        })}
      </>
    );
  };

  const onClickStoreItem = (e, store) => {
    e.stopPropagation();
    let storeDetail = {
      storeId: store?.id,
      branchId: store?.branchId,
    };
    navigation.navigate(ScreenName.storeDetails, {
      storeDetail,
    });
  };

  const onShowAllStores = () => {
    navigation.navigate(ScreenName.store);
  };

  const onOpenUserProfile = () => {
    setShowUserProfileView(true);
  };

  const onCloseUserProfile = () => {
    setShowUserProfileView(false);
  };

  const onClickAddressDetail = () => {
    if (customerInformation) {
      navigation.navigate(ScreenName.myAddress);
    } else {
      navigation?.navigate(ScreenName.login, {callBack: ScreenName.home});
    }
  };

  const onClickSearch = () => {
    navigation.navigate(ScreenName.search);
  };

  return (
    <Layout backgroundColor="#F5F5F5">
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={promiseInProgress}
              onRefresh={getInitDataStores}
            />
          }>
          <View style={styles.containerPadding}>
            <View style={styles.header}>
              <View style={styles.flex_3}>
                <TouchableOpacity
                  style={styles.row}
                  onPress={onClickAddressDetail}>
                  <ArtboardIcon />
                  <Text numberOfLines={1} style={styles.address}>
                    {currentCustomerAddress?.name != null
                      ? currentCustomerAddress?.name
                      : currentCustomerAddress?.address}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.header, styles.flex_1]}>
                <View>
                  <TouchableOpacity>
                    <NotiIcon />
                  </TouchableOpacity>
                </View>
                <View style={{paddingLeft: 24}}>
                  <TouchableOpacity onPress={onOpenUserProfile}>
                    {customerInformation?.thumbnail === undefined ||
                    customerInformation?.thumbnail === '' ? (
                      <AccountIcon />
                    ) : (
                      <>
                        <Avatar
                          alignItems="center"
                          size="sm"
                          source={{
                            uri: customerInformation?.thumbnail,
                          }}></Avatar>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.rowSearch}>
              <TouchableOpacity
                style={styles.viewInput}
                onPress={() => onClickSearch()}>
                <SearchIcon style={styles.iconSearch} />
                <TextInput
                  editable={false}
                  style={[styles.flex_1, styles.textSizeInput]}
                  placeholder={t(TextI18n.placeSearchProductOrStoreName)}
                  placeholderTextColor="#7C7C7C"
                  underlineColorAndroid="transparent"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginTop: 20}}>{getPromotions()}</View>
          <View style={styles.containerPadding}>
            <View style={styles.viewMenu}>{getMenuList()}</View>
            <View style={styles.viewStore}>
              <View style={styles.flex_2}>
                <Text style={styles.textRecommendStore}>
                  {t(TextI18n.recommendStores)}
                </Text>
              </View>
              <TouchableOpacity style={styles.viewAllStore}>
                <Text
                  style={styles.textViewAll}
                  onPress={() => {
                    onShowAllStores();
                  }}>
                  {t(TextI18n.viewAll)}
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View key={0} style={styles.viewStores}>
                {getStores()}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
      <UserProfileComponent
        modalVisible={showUserProfileView}
        onCloseUserProfile={onCloseUserProfile}
      />
    </Layout>
  );
}
