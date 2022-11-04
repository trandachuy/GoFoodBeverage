import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useSelector} from 'react-redux';
import {GOOGLE_API} from '../../constants/google.constant';
import {GoogleMapsIcon, SearchIcon} from '../../constants/icons.constants';
import {NotFoundAddress} from '../../constants/images.constants';
import {Vietnamese} from '../../constants/string.constant';
import {getCurrentCustomerAddress} from '../../data-services/session-data-service';
import TextI18n from '../../i18n/text.i18n';
import {windowHeight, windowWidth} from '../../utils/dimensions';
import {
  getCurrentLocationByGps,
  getLocationByAddress,
} from '../../utils/google';
import UserLocation from '../../utils/user-location';
import LoadingComponent from '../loading';
import {MapViewComponent} from '../map-view';
import styles from './style';
const ASPECT_RATIO = windowWidth / windowHeight;
const LATITUDE_DELTA = 0.025;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function GooglePlacesAutocompleteComponent({
  handleSelectAddress,
}) {
  const {t} = useTranslation();
  const [currentRegion, setCurrentRegion] = useState({});
  const [isChooseAddress, setIsChooseAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentCustomerAddress = useSelector(getCurrentCustomerAddress);

  const onSelectAddress = async (data, details) => {
    let location = await getLocationByAddress(data?.description);
    handleSelectAddress(data?.description, location);
  };

  const onSelectLocationPoint = async () => {
    let region = {
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
    setLoading(true);
    let addressDetail = await getCurrentLocationByGps();
    if (addressDetail?.isSuccess) {
      region.latitude = addressDetail?.lat;
      region.longitude = addressDetail?.lng;
    } else {
      let userLocation = UserLocation.getUserLocation(currentCustomerAddress);
      region.latitude = userLocation?.lat;
      region.longitude = userLocation?.lng;
    }

    setCurrentRegion(region);
    setLoading(false);
    setIsChooseAddress(true);
  };

  const hanldeComfirmAddress = async selectedAddress => {
    let location = {
      lat: selectedAddress?.lat,
      lng: selectedAddress?.lng,
    };
    setIsChooseAddress(false);
    handleSelectAddress(selectedAddress?.address, location);
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

  return (
    <>
      {isChooseAddress ? (
        <MapViewComponent
          currentRegion={currentRegion}
          hanldeComfirmAddress={hanldeComfirmAddress}
        />
      ) : (
        <>
          <KeyboardAvoidingView behavior="height" style={styles.viewContainer}>
            <View style={styles.containSearch}>
              <View style={styles.viewSearch}>
                <View style={styles.viewInputSearch}>
                  <GooglePlacesAutocomplete
                    enablePoweredByContainer={false}
                    placeholder={t(TextI18n.deliverTo)}
                    onPress={(data, details) => onSelectAddress(data, details)}
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
              {loading && <LoadingComponent />}

              <View style={styles.alignItemsCenter}>
                <Text style={styles.textAddressInMind}>
                  {t(TextI18n.haveAnAddressInMind)}
                </Text>
                <Text style={styles.textSearchLabel}>
                  {t(TextI18n.searchQuickAccess)}
                </Text>
              </View>
            </View>
            <Image style={styles.imageNotAddress} source={NotFoundAddress} />
          </KeyboardAvoidingView>
        </>
      )}
    </>
  );
}
