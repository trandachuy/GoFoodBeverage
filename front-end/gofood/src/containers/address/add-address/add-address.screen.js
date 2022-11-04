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
import accountApiService from '../../../api-services/account-api-service';
import GooglePlacesAutocompleteComponent from '../../../components/google-places-auto-complete';
import FnbTextInput from '../../../components/input-controls/text-input';
import Layout from '../../../components/layout';
import {
  CustomerAddressHome,
  CustomerAddressWork,
} from '../../../constants/customer-address-type.constant';
import {LocationIcon} from '../../../constants/icons.constants';
import TextI18n from '../../../i18n/text.i18n';
import styles from './add-address.style';

export default function AddAddressScreen({route, navigation}) {
  const {t} = useTranslation();
  const {
    control,
    handleSubmit,
    formState: {errors, isDirty},
    getValues,
  } = useForm({
    defaultValues: {
      name:
        route?.params?.customerAddressTypeId === CustomerAddressHome.key
          ? t(CustomerAddressHome.name)
          : route?.params?.customerAddressTypeId === CustomerAddressWork.key
          ? t(CustomerAddressWork.name)
          : '',
      note: '',
      addressDetail: '',
    },
  });
  const refInput = useRef();
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({});
  const [isSelectedAddress, setIsSelectedAddress] = useState(false);
  const [customerAddressTypeId, setCustomerAddressTypeId] = useState(null);
  const [isCheck, setIsCheck] = useState(false);

  useEffect(() => {
    const {customerAddressTypeId} = route?.params;
    if (
      customerAddressTypeId === CustomerAddressHome.key ||
      customerAddressTypeId === CustomerAddressWork.key
    ) {
      setIsCheck(true);
    }
    setCustomerAddressTypeId(customerAddressTypeId);
  }, []);

  const handleSelectAddress = async (description, location) => {
    setLocation(location);
    setAddress(description);
    setIsSelectedAddress(true);
  };

  const onSaveAddress = values => {
    let req = {
      ...values,
      address: address,
      lat: location?.lat,
      lng: location?.lng,
      customerAddressTypeId: customerAddressTypeId,
    };
    accountApiService.createAccountAddressAsync(req).then(res => {
      if (res) {
        navigation?.goBack();
      }
    });
  };

  return (
    <Layout title={t(TextI18n.addAddress)} backgroundColor="#F7FBFF">
      {isSelectedAddress ? (
        <>
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
                      onBlur={onBlur}
                      value={value}
                      ref={refInput}
                      onChangeText={onChange}
                      placeholder={t(TextI18n.placeholderAddressName)}
                      editable={!isCheck}
                      containerStyle={[
                        styles.inputName,
                        isCheck && styles.requiedInputName,
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
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        ref={refInput}
                        containerStyle={styles.inputName}
                        placeholder={t(TextI18n.placeholderAddressNote)}
                        autoCapitalize="none"
                      />
                    )}
                    name="note"
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
          <View style={styles.viewFooter}>
            <TouchableOpacity onPress={handleSubmit(onSaveAddress)}>
              <View style={styles.viewSaveAddress}>
                <Text style={styles.textSaveAddress}>
                  {t(TextI18n.saveAddress)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <GooglePlacesAutocompleteComponent
          handleSelectAddress={handleSelectAddress}
        />
      )}
    </Layout>
  );
}
