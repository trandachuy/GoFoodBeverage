import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Box, Center, Flex, useToast} from 'native-base';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {RefreshControl, Text, TouchableOpacity, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {SwipeListView} from 'react-native-swipe-list-view';
import {usePromiseTracker} from 'react-promise-tracker';
import {useDispatch, useSelector} from 'react-redux';
import accountApiService from '../../../api-services/account-api-service';
import ConfirmationModal from '../../../components/confirmation-modal';
import Layout from '../../../components/layout';
import {MapViewComponent} from '../../../components/map-view';
import {MaximumAddressOfTheAccount} from '../../../constants/account-address.constants';
import {
  CustomerAddressHome,
  CustomerAddressWork,
} from '../../../constants/customer-address-type.constant';
import DatabaseKeys from '../../../constants/database-keys.constants';
import {GOOGLE_API} from '../../../constants/google.constant';
import {
  AddressOtherIcon,
  DeleteAddressIcon,
  EditAddressIcon,
  GoogleMapsIcon,
  GpsFixedIcon,
  HomeMapIcon,
  NewAddressIcon,
  SearchIcon,
  SuccessIcon,
  WorkMapIcon,
} from '../../../constants/icons.constants';
import {ScreenName} from '../../../constants/screen.constants';
import {Vietnamese} from '../../../constants/string.constant';
import {
  getCurrentCustomerAddress,
  setCurrentCustomerAddress,
} from '../../../data-services/session-data-service';
import ButtonI18n from '../../../i18n/button.i18n';
import MessageI18n from '../../../i18n/message.i18n';
import TextI18n from '../../../i18n/text.i18n';
import {windowHeight, windowWidth} from '../../../utils/dimensions';
import {
  getCurrentLocationByGps,
  getLocationByAddress,
} from '../../../utils/google';
import {randomGuid} from '../../../utils/helpers';
import UserLocation from '../../../utils/user-location';
import styles from './my-address.style';
const ASPECT_RATIO = windowWidth / windowHeight;
const LATITUDE_DELTA = 0.025;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function MyAddressScreen() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [currentAddress, setCurrentAddress] = useState({});
  const [myAddresses, setMyAddresses] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isChooseAddress, setIsChooseAddress] = useState(false);
  const [currentRegion, setCurrentRegion] = useState({});
  const currentCustomerAddress = useSelector(getCurrentCustomerAddress);
  const {promiseInProgress} = usePromiseTracker();
  const [canAddAddress, setCanAddAddress] = useState(true);
  const toast = useToast();

  useFocusEffect(
    useCallback(() => {
      getLocationCurrent();
      getCustomerAddresses();
    }, []),
  );

  const getCustomerAddresses = async () => {
    let res = await accountApiService.getAccountAddressesByAccountIdAsync();
    if (res) {
      mappingMyAddresses(res?.customerAddresses);
      let canAddAddress =
        res?.customerAddresses?.length < MaximumAddressOfTheAccount;
      setCanAddAddress(canAddAddress);
    }
  };

  const mappingMyAddresses = addresses => {
    let listCustomerAddress = [];

    // Show address Home
    let addressHome = addresses?.find(
      item => item.customerAddressTypeId === CustomerAddressHome.key,
    );
    let addressHomeItem = {
      key: addressHome != null ? addressHome?.id : randomGuid(),
      customerAddressTypeId: addressHome?.customerAddressTypeId,
      name:
        addressHome != null
          ? t(CustomerAddressHome.name)
          : t(CustomerAddressHome.addressHome),
      lat: addressHome?.lat,
      lng: addressHome?.lng,
      address: addressHome?.address,
      icon: <HomeMapIcon />,
      isExist: addressHome?.id != null && true,
      note: addressHome?.note,
    };
    listCustomerAddress.push(addressHomeItem);

    // Show address Work
    let addressWork = addresses?.find(
      item => item.customerAddressTypeId === CustomerAddressWork.key,
    );
    let addressWorkItem = {
      key: addressWork != null ? addressWork?.id : randomGuid(),
      customerAddressTypeId: addressWork?.customerAddressTypeId,
      name:
        addressWork != null
          ? t(CustomerAddressWork.name)
          : t(CustomerAddressWork.addressWork),
      lat: addressWork?.lat,
      lng: addressWork?.lng,
      address: addressWork?.address,
      icon: <WorkMapIcon />,
      isExist: addressWork?.id != null && true,
      note: addressHome?.note,
    };
    listCustomerAddress.push(addressWorkItem);

    //Show customer address item
    addresses
      ?.filter(
        item =>
          item?.customerAddressTypeId != CustomerAddressHome.key &&
          item?.customerAddressTypeId != CustomerAddressWork.key,
      )
      ?.map(address => {
        let addressItem = {
          key: address?.id,
          customerAddressTypeId: address?.customerAddressTypeId,
          name: address?.name,
          lat: address?.lat,
          lng: address?.lng,
          address: address?.address,
          icon: <AddressOtherIcon />,
          isExist: true,
          note: addressHome?.note,
        };
        listCustomerAddress.push(addressItem);
      });

    let newCustomerAddress = {
      key: randomGuid(),
      customerAddressTypeId: null,
      icon: <NewAddressIcon />,
      name: t(TextI18n.addAddress),
      isExist: false,
    };
    listCustomerAddress.push(newCustomerAddress);

    setMyAddresses(listCustomerAddress);
  };

  const getLocationCurrent = async () => {
    let addressInfo = await getCurrentLocationByGps();
    if (addressInfo?.isSuccess) {
      setCurrentAddress(addressInfo);
    }
  };

  const onClickAddressItem = async (key, customerAddressTypeId, isExist) => {
    if (!isExist) {
      if (!canAddAddress) {
        toastMessage(t(MessageI18n.maximumAddresses));
        return;
      }

      navigation.navigate(ScreenName.addAddress, {
        customerAddressTypeId,
      });
    } else {
      let customerAddressSelected = myAddresses?.find(
        customerAddress => customerAddress?.key == key,
      );
      if (customerAddressSelected != null) {
        let addressInfo = {
          key: key,
          isSuccess: true,
          lat: customerAddressSelected?.lat,
          lng: customerAddressSelected?.lng,
          name: customerAddressSelected?.name,
          address: customerAddressSelected?.address,
          note: customerAddressSelected?.note,
          isSuccess: true,
        };
        onSelectAddress(addressInfo);
      }
    }
  };

  const onSelectAddress = async selectedAddress => {
    dispatch(setCurrentCustomerAddress(selectedAddress));
    let jsonString = JSON.stringify(selectedAddress);
    await AsyncStorage.setItem(DatabaseKeys.currentCustomerAddress, jsonString);
    navigation?.goBack();
  };

  const VisibleItem = props => {
    const {data} = props;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.viewAddressItem}
        onPress={() =>
          onClickAddressItem(data?.item?.key, data?.index, data?.item?.isExist)
        }>
        <View style={{paddingTop: 16}}>{data?.item?.icon}</View>
        <View style={styles.viewAddressDetail}>
          <Text
            style={[
              styles.textName,
              data?.item?.isExist && styles.textNameColor,
            ]}>
            {data?.item?.name}
          </Text>
          {data?.item?.address != null && (
            <Text style={styles.textAddress}>{data?.item?.address}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = data => {
    return <VisibleItem data={data} />;
  };

  const HiddenItemWithActions = props => {
    const {onEdit, onDelete} = props;
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backRightBtnLeft}
          onPress={onEdit}>
          <View style={{backgroundColor: '#FFE9E9', borderRadius: 8}}>
            <EditAddressIcon />
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={onDelete}>
          <View style={{backgroundColor: '#FFE9E9', borderRadius: 8}}>
            <DeleteAddressIcon />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        onEdit={() => EditRow(rowMap, data?.item?.key)}
        onDelete={() => deleteRow(rowMap, data?.item?.key)}
      />
    );
  };

  const EditRow = (rowMap, key) => {
    if (rowMap[key]) {
      rowMap[key].closeRow();
      navigation?.navigate(ScreenName.editAddress, {customerAddressId: key});
    }
  };

  const deleteRow = async (rowMap, id) => {
    if (rowMap[id]) {
      rowMap[id].closeRow();
      setSelectedAddressId(id);
      setIsShowModal(true);
    }
  };

  /**
   * This function is used to hide the modal.
   */
  const onCancelDeleteAddress = () => {
    setIsShowModal(false);
  };

  const onConfirmDeleteAddress = async () => {
    if (currentCustomerAddress?.key === selectedAddressId) {
      dispatch(setCurrentCustomerAddress(currentAddress));
      let jsonString = JSON.stringify(currentAddress);
      await AsyncStorage.setItem(
        DatabaseKeys.currentCustomerAddress,
        jsonString,
      );
    }

    let res = await accountApiService.deleteAccountAddressByIdAsync(
      selectedAddressId,
    );
    if (res) {
      setSelectedAddressId(null);
      setIsShowModal(false);
      getCustomerAddresses();
    }
  };

  const onSelectLocationPoint = async () => {
    let userLocation = UserLocation.getUserLocation(currentAddress);
    let region = {
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
      latitude: userLocation.lat,
      longitude: userLocation.lng,
    };
    setCurrentRegion(region);
    setIsChooseAddress(true);
  };

  const hanldeComfirmAddress = async selectedAddress => {
    dispatch(setCurrentCustomerAddress(selectedAddress));
    let jsonString = JSON.stringify(selectedAddress);
    await AsyncStorage.setItem(DatabaseKeys.currentCustomerAddress, jsonString);
    setIsChooseAddress(false);
    navigation?.goBack();
  };

  const onSelectAddressSearch = async data => {
    let location = await getLocationByAddress(data?.description);
    let addressInfo = {
      lat: location?.lat,
      lng: location?.lng,
      address: data?.description,
    };
    onSelectAddress(addressInfo);
  };

  const renderRightButton = () => {
    return (
      <TouchableOpacity style={styles.viewMap} onPress={onSelectLocationPoint}>
        <GoogleMapsIcon />
      </TouchableOpacity>
    );
  };

  const renderLeftButton = () => {
    return (
      <View style={styles.containerIconSearch}>
        <SearchIcon style={styles.containerIconSearch.viewIconSearch} />
      </View>
    );
  };

  const toastMessage = message => {
    toast.show({
      placement: 'top',
      render: () => {
        return (
          <>
            <Box style={styles.toastMessageView} bg="#293450">
              <Flex
                direction="row"
                align={'center'}
                justify={'flex-start'}
                style={styles.textGroup}>
                <Center>
                  <SuccessIcon />
                </Center>
                <Center w="95%">
                  <Text style={styles.textToastMessage}>{message}</Text>
                </Center>
              </Flex>
            </Box>
          </>
        );
      },
    });
  };

  return (
    <Layout title={t(TextI18n.myAddressText)} backgroundColor="#F7FBFF">
      {isChooseAddress ? (
        <MapViewComponent
          currentRegion={currentRegion}
          hanldeComfirmAddress={hanldeComfirmAddress}
        />
      ) : (
        <View style={styles.container}>
          <View style={styles.viewSearch}>
            <View style={styles.viewInputSearch}>
              <GooglePlacesAutocomplete
                enablePoweredByContainer={false}
                placeholder={t(TextI18n.deliverTo)}
                onPress={(data, details) => onSelectAddressSearch(data)}
                query={{
                  key: GOOGLE_API,
                  language: Vietnamese,
                  components: 'country:vn',
                }}
                styles={{
                  textInputContainer: styles.inputSearchAddress,
                  textInput: styles.textInputSearch,
                }}
                renderRightButton={() => renderRightButton()}
                renderLeftButton={() => renderLeftButton()}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewIconGps}
            disabled={
              currentAddress?.lat === undefined ||
              currentAddress?.lng === undefined
            }
            onPress={() => onSelectAddress(currentAddress)}>
            <View style={styles.marginRight16}>
              <GpsFixedIcon />
            </View>
            <View>
              <Text style={styles.textCurrentLocation}>
                {t(TextI18n.yourCurrentLocation)}
              </Text>
              <Text style={styles.textUserAddress}>
                {currentAddress.address}
              </Text>
            </View>
          </TouchableOpacity>
          <SwipeListView
            refreshControl={
              <RefreshControl
                refreshing={promiseInProgress}
                onRefresh={getCustomerAddresses}
              />
            }
            showsVerticalScrollIndicator={false}
            data={myAddresses}
            renderItem={(data, rowMap) => renderItem(data, rowMap)}
            renderHiddenItem={(data, rowMap) =>
              data?.item?.isExist && renderHiddenItem(data, rowMap)
            }
            leftOpenValue={50}
            rightOpenValue={-90}
            disableRightSwipe
          />
        </View>
      )}

      <ConfirmationModal
        visible={isShowModal}
        onCancel={onCancelDeleteAddress}
        onOk={onConfirmDeleteAddress}
        contentKey={t(TextI18n.confirmRemoveCustomerAddress)}
        cancelTextKey={t(ButtonI18n.cancel)}
        okTextKey={t(ButtonI18n.yes)}
      />
    </Layout>
  );
}
