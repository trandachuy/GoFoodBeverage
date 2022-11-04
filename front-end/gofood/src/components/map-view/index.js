import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import MapView, {PROVIDER_DEFAULT, PROVIDER_GOOGLE} from 'react-native-maps';
import {LocationMapIcon} from '../../constants/icons.constants';
import {Platforms} from '../../constants/platform.constants';
import ButtonI18n from '../../i18n/button.i18n';
import {getAddressDetailByLatLng} from '../../utils/google';
import {executeAfter} from '../../utils/helpers';
import styles from './style';

export function MapViewComponent({currentRegion, hanldeComfirmAddress}) {
  const {t} = useTranslation();
  const [addressDetail, setAddressDetail] = useState({});

  useEffect(() => {
    fetchAddressDetailAsync();
  }, []);

  const fetchAddressDetailAsync = async () => {
    const addressInfo = await getAddressDetail(currentRegion);
    setAddressDetail(addressInfo);
  };

  const onChangeLocation = async region => {
    executeAfter(3000, async () => {
      let addressInfo = await getAddressDetail(region);
      setAddressDetail(addressInfo);
    });
  };

  const getAddressDetail = async region => {
    const address = await getAddressDetailByLatLng(
      region?.latitude,
      region?.longitude,
    );
    const addressInfo = {
      lat: address?.lat,
      lng: address?.lng,
      name: null,
      address: address?.name,
    };
    return addressInfo;
  };

  return (
    <View style={{flex: 1}}>
      <MapView
        provider={
          Platform.OS == Platforms.ANDROID ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
        style={{flex: 1}}
        showsUserLocation={true}
        followsUserLocation={false}
        showsMyLocationButton={true}
        zoomEnabled={true}
        zoomControlEnabled={true}
        loadingEnabled={true}
        region={currentRegion}
        onRegionChangeComplete={onChangeLocation}
      />
      <View style={styles.iconChooseLocation}>
        <LocationMapIcon />
      </View>
      <View style={styles.viewFooter}>
        <View style={styles.viewSelectedLocation}>
          <LocationMapIcon />
          <Text style={styles.textAddress}>{addressDetail?.address}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewConfirm}
          onPress={() => hanldeComfirmAddress(addressDetail)}>
          <Text style={styles.textConfirm}>{t(ButtonI18n.confirm)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
