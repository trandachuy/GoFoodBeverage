import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import accountApiService from '../../../api-services/account-api-service';
import GooglePlacesAutocompleteComponent from '../../../components/google-places-auto-complete';
import FnbTextInput from '../../../components/input-controls/text-input';
import Layout from '../../../components/layout';
import {
  CustomerAddressHome,
  CustomerAddressWork,
} from '../../../constants/customer-address-type.constant';
import DatabaseKeys from '../../../constants/database-keys.constants';
import {LocationIcon} from '../../../constants/icons.constants';
import {setCurrentCustomerAddress} from '../../../data-services/session-data-service';
import TextI18n from '../../../i18n/text.i18n';
import styles from './edit-address.style';

export default function EditAddressScreen({route, navigation}) {
  const {t} = useTranslation();
  const {
    control,
    handleSubmit,
    formState: {errors, isDirty},
    setValue,
  } = useForm({
    defaultValues: {
      name: '',
      note: '',
      addressDetail: '',
    },
  });
  const refInput = useRef();
  const dispatch = useDispatch();
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({});
  const [isSelectedAddress, setIsSelectedAddress] = useState(true);
  const [customerAddressTypeId, setCustomerAddressTypeId] = useState(null);

  useEffect(() => {
    getCustomerAddressDetail();
  }, []);

  const getCustomerAddressDetail = async () => {
    const {customerAddressId} = route?.params;
    let res = await accountApiService.getAccountAddressByIdAsync(
      customerAddressId,
    );
    setCustomerInformation(res?.customerAddress);
  };

  const setCustomerInformation = data => {
    setValue('name', data?.name);
    setValue('addressDetail', data?.addressDetail);
    setValue('note', data?.note);
    setAddress(data?.address);
    let location = {
      lat: data?.lat,
      lng: data?.lng,
    };
    setLocation(location);
    setCustomerAddressTypeId(data?.customerAddressTypeId);
  };

  const handleSelectAddress = (description, location) => {
    setLocation(location);
    setAddress(description);
    setIsSelectedAddress(true);
  };

  const onSaveAddress = async values => {
    const {customerAddressId} = route?.params;
    let req = {
      ...values,
      id: customerAddressId,
      address: address,
      lat: location?.lat,
      lng: location?.lng,
    };
    let res = await accountApiService.updateAccountAddressByIdAsync(req);
    if (res) {
      let stringOfAddressInfo = await AsyncStorage.getItem(
        DatabaseKeys.currentCustomerAddress,
      );
      if (customerAddressId === stringOfAddressInfo?.key) {
        let addressInfo = {
          key: customerAddressId,
          lat: location?.lat,
          lng: location?.lng,
          name: req?.name,
          address: address,
          note: req?.note,
          isSuccess: true,
        };

        dispatch(setCurrentCustomerAddress(addressInfo));
        let jsonString = JSON.stringify(addressInfo);
        await AsyncStorage.setItem(
          DatabaseKeys.currentCustomerAddress,
          jsonString,
        );
      }
      navigation?.goBack();
    }
  };

  return (
    <Layout title={t(TextI18n.editAddress)} backgroundColor="#F7FBFF">
      {isSelectedAddress ? (
        <ScrollView style={styles.flexOne}>
          <KeyboardAvoidingView behavior="position">
            <View>
              <Text style={styles.textName}>
                {t(TextI18n.name)}
                <Text style={{color: 'red'}}>*</Text>
              </Text>

              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t(TextI18n.pleaseInputAddressName),
                  },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <FnbTextInput
                    value={value}
                    ref={refInput}
                    onChangeText={onChange}
                    placeholder={t(TextI18n.placeholderAddressName)}
                    editable={
                      !(
                        customerAddressTypeId === CustomerAddressHome.key ||
                        customerAddressTypeId === CustomerAddressWork.key
                      )
                    }
                    containerStyle={[
                      styles.inputName,
                      (customerAddressTypeId === CustomerAddressHome.key ||
                        customerAddressTypeId === CustomerAddressWork.key) &&
                        styles.requiedInputName,
                    ]}
                  />
                )}
                name="name"
              />
              {errors?.home && (
                <View style={styles.viewErrorName}>
                  <Text style={styles.textErrorName}>
                    {t(TextI18n.pleaseInputAddressName)}
                  </Text>
                </View>
              )}
              <Text style={styles.textAddress}>
                {t(TextI18n.address)}
                <Text style={{color: 'red'}}>*</Text>
              </Text>
              <TouchableOpacity onPress={() => setIsSelectedAddress(false)}>
                <View style={styles.viewLocation}>
                  <View style={{marginRight: 15}}>
                    <LocationIcon />
                  </View>
                  <View style={{marginRight: 15}}>
                    <Text style={styles.labelAddress}>{address}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.marginTop16}>
                <Text style={styles.textAddressDetail}>
                  {t(TextI18n.addressDetail)}
                </Text>
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <FnbTextInput
                      value={value}
                      ref={refInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      containerStyle={styles.inputName}
                      autoCapitalize="none"
                      placeholder={t(TextI18n.placeholderAddressDetail)}
                    />
                  )}
                  name="addressDetail"
                />
              </View>
              <View style={styles.marginTop16}>
                <Text style={styles.textNote}>{t(TextI18n.note)}</Text>
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <FnbTextInput
                      value={value}
                      onBlur={onBlur}
                      ref={refInput}
                      onChangeText={onChange}
                      containerStyle={styles.inputName}
                      autoCapitalize="none"
                      placeholder={t(TextI18n.placeholderAddressNote)}
                    />
                  )}
                  name="note"
                />
              </View>
            </View>
          </KeyboardAvoidingView>
          <View style={styles.viewFooter}>
            <TouchableOpacity onPress={handleSubmit(onSaveAddress)}>
              <View style={styles.viewSaveAddress}>
                <Text style={styles.textSaveAddress}>
                  {t(TextI18n.saveAddress)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <GooglePlacesAutocompleteComponent
          handleSelectAddress={handleSelectAddress}
        />
      )}
    </Layout>
  );
}
