import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, SafeAreaView, Text, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useSelector} from 'react-redux';
import storeApiService from '../../api-services/store-api-service';
import Layout from '../../components/layout';
import {
  DownArrowIcon,
  HomeIndicatorIcon,
  LocationIcon,
  SelectedTickIcon,
  StarIcon,
  StoreAddressIcon,
  StoreEmailIcon,
  StoreInformationIcon,
  StorePhoneIcon,
  StoreWebsiteIcon,
} from '../../constants/icons.constants';
import {Platforms} from '../../constants/platform.constants';
import {getCurrentCustomerAddress} from '../../data-services/session-data-service';
import TextI18n from '../../i18n/text.i18n';
import {windowHeight} from '../../utils/dimensions';
import {getDistanceBetweenPoints} from '../../utils/google';
import String from '../../utils/string';
import styles from './store-information.style';

export default function StoreInformationScreen({route}) {
  const {t} = useTranslation();
  const [openDropdownBranch, setOpenDropdownBranch] = useState(false);
  const [value, setValue] = useState(undefined);
  const [currentRegion, setCurrentRegion] = useState(undefined);
  const [storeList, setStoreList] = useState([]);
  const currentCustomerAddress = useSelector(getCurrentCustomerAddress);
  const [selectedStoreInformation, setSelectedStoreInformation] =
    useState(null);
  const [isMinTranslationY, setIsMinTranslationY] = useState(false);
  const transY = useSharedValue(0);
  const context = useSharedValue({y: 0});
  const maxTranslationY = -windowHeight / 50 + 20;
  const minTranslationY = windowHeight / 2;

  const scrollTo = useCallback(
    destination => {
      'worklet';
      transY.value = withSpring(destination, {damping: 50});
    },
    [transY],
  );

  const gestureHandler = Gesture.Pan()
    .onStart(event => {
      context.value = {y: transY.value};
    })
    .onUpdate(event => {
      transY.value = event.translationY + context.value.y;
      transY.value = Math.max(transY.value, maxTranslationY);
      transY.value = Math.min(transY.value, minTranslationY);
    })
    .onEnd(() => {
      if (transY.value >= windowHeight / 1.6 / 4.5) {
        scrollTo(minTranslationY);
        runOnJS(setIsMinTranslationY)(true);
      } else if (transY.value < windowHeight / 1.6 / 4.5) {
        scrollTo(maxTranslationY);
        runOnJS(setIsMinTranslationY)(false);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: transY.value}],
    };
  });

  useEffect(() => {
    getAllBranchOfCurrentStore();
  }, [route?.params]);

  const getAllBranchOfCurrentStore = async () => {
    let dataRequest = {
      storeId: route?.params?.storeId,
      branchId: route?.params?.branchId,
    };
    const allBranches = await storeApiService.getAllBranchesByStoreIdOrBranchId(
      dataRequest,
    );
    if (allBranches) {
      let selectedStoreId = null;
      let addressList = [];
      let stores = [];

      allBranches.forEach((element, index) => {
        let storeItem = {
          ...element,
          label: element?.storeName,
          value: element?.storeBranchId,
          latitude: element?.latitude,
          longitude: element?.longitude,
        };
        if (
          element?.storeBranchId === dataRequest?.storeId ||
          element?.storeBranchId === dataRequest?.branchId
        ) {
          selectedStoreId = element?.storeBranchId;
        }
        addressList.push(element?.address);
        stores.push(storeItem);
      });

      let selectedStore = stores?.find(a => a.storeBranchId == selectedStoreId);
      setCurrentRegion({
        latitude: selectedStore?.latitude || 0,
        longitude: selectedStore?.longitude || 0,
      });
      let originAddress = {
        lat: currentCustomerAddress?.lat || 0,
        lng: currentCustomerAddress?.lng || 0,
      };
      let destination = {
        lat: selectedStore?.latitude || 0,
        lng: selectedStore?.longitude || 0,
      };

      let distance = await onGetDistanceBetweenPoints(
        originAddress,
        destination,
      );
      selectedStore = {
        ...selectedStore,
        distance: String.formatDistance(distance?.value),
      };

      let selectedStoreIndex = stores
        .map(x => x.storeBranchId)
        .indexOf(selectedStore.storeBranchId);
      stores.splice(selectedStoreIndex, 1);
      stores.unshift(selectedStore);

      setStoreList(stores);
      setSelectedStoreInformation(selectedStore);

      setValue(selectedStoreId);
    }
  };

  const renderArrowDownAndUpIcon = () => {
    return (
      <>
        <View style={styles.iconDropdownBranches}>
          <DownArrowIcon />
        </View>
      </>
    );
  };

  const renderTickIcon = () => {
    return (
      <>
        <View
          style={[styles.selectedItemLabelDropdownStore, {paddingRight: 28}]}>
          <SelectedTickIcon />
        </View>
      </>
    );
  };

  const onChangeStoreSelected = async itemId => {
    let selectedStore = storeList?.find(a => a.storeBranchId == itemId);
    setCurrentRegion({
      latitude: selectedStore?.latitude || 0,
      longitude: selectedStore?.longitude || 0,
    });
    let originAddress = {
      lat: currentCustomerAddress?.lat || 0,
      lng: currentCustomerAddress?.lng || 0,
    };
    let destination = {
      lat: selectedStore?.latitude || 0,
      lng: selectedStore?.longitude || 0,
    };
    let distance = await onGetDistanceBetweenPoints(originAddress, destination);
    selectedStore = {
      ...selectedStore,
      distance: String.formatDistance(distance?.value),
    };

    setSelectedStoreInformation(selectedStore);
    setValue(itemId);
  };

  const onRegionChange = () => {
    scrollTo(minTranslationY);
    runOnJS(setIsMinTranslationY)(true);
  };

  const onGetDistanceBetweenPoints = async (originAddress, destination) => {
    const distance = await getDistanceBetweenPoints(originAddress, destination);
    return distance;
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Layout>
        <View>
          {currentRegion && (
            <MapView
              style={styles.map}
              provider={
                Platform.OS == Platforms.ANDROID
                  ? PROVIDER_GOOGLE
                  : PROVIDER_DEFAULT
              }
              showsUserLocation
              minZoomLevel={1}
              maxZoomLevel={50}
              region={{
                ...currentRegion,
                latitudeDelta: 0.018,
                longitudeDelta: 0.018,
              }}
              onRegionChange={onRegionChange}>
              {currentRegion && (
                <Marker
                  coordinate={currentRegion}
                  image={require('../../assets/images/store-location-map.png')}
                  title={selectedStoreInformation?.storeName}
                  description={selectedStoreInformation?.storeName}
                  onPress={() =>
                    onChangeStoreSelected(
                      selectedStoreInformation?.storeBranchId,
                    )
                  }></Marker>
              )}
              {storeList?.map((store, index) => {
                return (
                  <Fragment key={`store-information-marker-item-idx-${index}`}>
                    <Marker
                      key={store.storeBranchId}
                      coordinate={{
                        latitude: store?.latitude || 0,
                        longitude: store?.longitude || 0,
                      }}
                      image={require('../../assets/images/store-location-map.png')}
                      title={store.storeName}
                      description={store.storeName}
                      onPress={() =>
                        onChangeStoreSelected(store?.storeBranchId)
                      }></Marker>
                  </Fragment>
                );
              })}
            </MapView>
          )}
        </View>
        <View style={[styles.containerStoreInformation]}>
          <GestureDetector gesture={gestureHandler} nestedScrollEnabled={true}>
            <Animated.View
              style={[styles.containStoreInformation, animatedStyle]}>
              <View style={styles.homeIndicatorIcon}>
                <HomeIndicatorIcon />
              </View>

              <SafeAreaView style={styles.storeInformation}>
                <View style={styles.viewStoreInformation}>
                  {value && storeList.length > 1 ? (
                    isMinTranslationY ? (
                      <>
                        <View style={styles.viewStoreNameText}>
                          <Text style={styles.storeNameText}>
                            {selectedStoreInformation.storeName}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <DropDownPicker
                        listMode="SCROLLVIEW"
                        value={value}
                        setValue={setValue}
                        items={storeList}
                        setItems={setStoreList}
                        style={styles.dropdownlistBranchesControl}
                        autoScroll={true}
                        textStyle={styles.textDropdownBranches}
                        labelStyle={styles.labelStyleDropdownStore}
                        ArrowDownIconComponent={() =>
                          renderArrowDownAndUpIcon()
                        }
                        ArrowUpIconComponent={() => renderArrowDownAndUpIcon()}
                        open={openDropdownBranch}
                        setOpen={() => {
                          setOpenDropdownBranch(!openDropdownBranch);
                        }}
                        closeAfterSelecting={true}
                        onChangeValue={onChangeStoreSelected}
                        listItemContainerStyle={
                          styles.listItemContainerStyleDropdownStore
                        }
                        listItemLabelStyle={
                          styles.listItemLabelStyleDropdownStore
                        } // css for label item container
                        selectedItemLabelStyle={
                          styles.selectedItemLabelDropdownStore
                        }
                        TickIconComponent={() => renderTickIcon()}
                        bottomOffset={4}
                        dropDownContainerStyle={styles.dropDownContainerStyle}
                        zIndex={3000}
                        scrollViewProps={{
                          nestedScrollEnabled: true,
                        }}
                      />
                    )
                  ) : (
                    <View style={styles.viewStoreNameText}>
                      <Text style={styles.storeNameText}>
                        {selectedStoreInformation?.storeName}
                      </Text>
                    </View>
                  )}

                  <View style={styles.textContainStoreInformation}>
                    <View style={[styles.groupText, styles.groupContain]}>
                      <View style={styles.iconText}>
                        <StoreAddressIcon />
                      </View>
                      <View style={styles.textContain}>
                        <Text>{selectedStoreInformation?.address}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.textContainStoreInformation}>
                    <Text style={styles.groupTitle}>{t(TextI18n.rating)}</Text>
                    <View style={[styles.groupText, styles.groupContain]}>
                      <View style={styles.itemRange}>
                        <StarIcon />
                        <Text>{selectedStoreInformation?.rate}</Text>
                      </View>
                      <View style={styles.itemRange}>
                        <LocationIcon />
                        <Text> {selectedStoreInformation?.distance}</Text>
                      </View>
                    </View>
                  </View>

                  {(selectedStoreInformation?.phoneNumber ||
                    selectedStoreInformation?.email ||
                    selectedStoreInformation?.website) && (
                    <>
                      <View style={styles.textContainStoreInformation}>
                        <Text style={styles.groupTitle}>
                          {t(TextI18n.contact)}
                        </Text>

                        {selectedStoreInformation?.phoneNumber && (
                          <>
                            <View
                              style={[styles.groupText, styles.groupContain]}>
                              <View style={styles.iconText}>
                                <StorePhoneIcon />
                              </View>
                              <View style={styles.textContain}>
                                <Text>
                                  {selectedStoreInformation?.phoneNumber}
                                </Text>
                              </View>
                            </View>
                          </>
                        )}

                        {selectedStoreInformation?.email && (
                          <>
                            <View
                              style={[styles.groupText, styles.groupContain]}>
                              <View style={styles.iconText}>
                                <StoreEmailIcon />
                              </View>
                              <View style={styles.textContain}>
                                <Text>{selectedStoreInformation?.email}</Text>
                              </View>
                            </View>
                          </>
                        )}

                        {selectedStoreInformation?.website && (
                          <>
                            <View
                              style={[styles.groupText, styles.groupContain]}>
                              <View style={styles.iconText}>
                                <StoreWebsiteIcon />
                              </View>
                              <View style={styles.textContain}>
                                <Text>{selectedStoreInformation?.website}</Text>
                              </View>
                            </View>
                          </>
                        )}
                      </View>
                    </>
                  )}
                </View>
              </SafeAreaView>

              <View style={styles.containerImageBackground}>
                <StoreInformationIcon />
              </View>
            </Animated.View>
          </GestureDetector>
        </View>
      </Layout>
    </GestureHandlerRootView>
  );
}
