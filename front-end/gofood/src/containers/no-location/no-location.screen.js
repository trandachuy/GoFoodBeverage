import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Toast} from 'native-base';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, TouchableOpacity, View, Linking, Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import LoadingComponent from '../../components/loading';
import DatabaseKeys from '../../constants/database-keys.constants';
import {ScreenName} from '../../constants/screen.constants';
import {setCurrentCustomerAddress} from '../../data-services/session-data-service';
import ButtonI18n from '../../i18n/button.i18n';
import TextI18n from '../../i18n/text.i18n';
import {getCurrentLocationByGps} from '../../utils/google';
import {NoLocationIcon} from './../../constants/icons.constants';
import styles from './no-location.style';
import { Platforms } from '../../constants/platform.constants';

export default function NoLocationScreen() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const onGetCurrentLocation = async () => {
    setLoading(true);
    let addressInfo = await getCurrentLocationByGps();
    if (addressInfo?.isSuccess) {
      let jsonString = JSON.stringify(addressInfo);
      await AsyncStorage.setItem(
        DatabaseKeys.currentCustomerAddress,
        jsonString,
      );
      dispatch(setCurrentCustomerAddress(addressInfo));
      setLoading(false);
      navigation.navigate(ScreenName.home);
    } else {
      Toast.show({title: t(TextI18n.turnOnLocation), background: 'red.400'});
      setLoading(false);
      if(Platform.OS == Platforms.IOS) {
        Linking.openSettings();
      }
    }
  };

  return (
    <>
      {loading && <LoadingComponent className={styles.loading} />}
      <View style={styles.container}>
        <NoLocationIcon />
        <Text style={styles.label}>{t(TextI18n.whereAreYouNow)}</Text>
        <Text style={styles.label}>{t(TextI18n.turnOnLocation)}</Text>
        <TouchableOpacity style={styles.button} onPress={onGetCurrentLocation}>
          <Text style={styles.text}>{t(ButtonI18n.tryAgain)}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
