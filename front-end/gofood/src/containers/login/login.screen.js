import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Toast} from 'native-base';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {usePromiseTracker} from 'react-promise-tracker';
import {useDispatch} from 'react-redux';
import loginApiService from '../../api-services/login-api-service';
import Email from '../../assets/icons/email.svg';
import Lock from '../../assets/icons/lock.svg';
import {LogoLogin, LoginBackground} from '../../constants/images.constants';
import Button from '../../components/button';
import FnbPasswordInput from '../../components/input-controls/password-input';
import FnbTextInput from '../../components/input-controls/text-input';
import DatabaseKeys from '../../constants/database-keys.constants';
import {ScreenName} from '../../constants/screen.constants';
import {setSession} from '../../data-services/session-data-service';
import ButtonI18n from '../../i18n/button.i18n';
import MessageI18n from '../../i18n/message.i18n';
import TextI18n from '../../i18n/text.i18n';
import Valid from '../../utils/data-validation';
import {resetNav} from '../../utils/root-navigation';
import styles from './login.style';
import {Image} from 'react-native';
import {ImageBackground} from 'react-native';
import BackButton from '../../components/back-button';
import { withSafeArea } from 'react-native-safe-area'

export default function LoginScreen({route}) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      loginInfo: '',
      password: '',
    },
  });

  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {promiseInProgress} = usePromiseTracker();
  const SafeAreaView = withSafeArea(View, 'margin', 'all')

  /** This function is used to submit data to the server to request permission to access the API.
   * @param  {any} data The form data, for example: {}
   */
  const onSubmit = async data => {
    let result = await loginApiService.loginForCustomer(data);

    if (result.isSuccess) {
      Toast.show({title: t(result.message)});
      if (result.data) {
        dispatch(setSession(result.data));
        let jsonString = JSON.stringify(result.data);
        await AsyncStorage.setItem(DatabaseKeys.session, jsonString);
      }
      if (route?.params?.callBack === ScreenName.checkout) {
        navigation.navigate(ScreenName.checkout);
      } else {
        resetNav({name: ScreenName.home});
      }
    } else {
      Toast.show({title: t(result.message)});
    }
  };

  /** This function is used to navigate to the Register screen.
   */
  const goToRegisterAccountScreen = () => {
    navigation.navigate(ScreenName.register);
  };

  return (
    
    <ImageBackground
      resizeMode="stretch"
      source={LoginBackground}
      style={styles.backgroundImg}>
      <SafeAreaView>
        <View>
          <BackButton backToScreen={ScreenName.home} />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
          keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView behavior="position">
            <View style={styles.logoContainer}>
              <Image source={LogoLogin} style={styles.smallLogo} />
            </View>

            <View style={styles.controlContainer}>
              <View style={styles.controlGroup}>
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t(MessageI18n.invalidData),
                    },
                    validate: {
                      emailOrPhone: value =>
                        Valid.isEmailOrPhoneNumber(value) ||
                        t(MessageI18n.invalidData),
                    },
                  }}
                  render={({field: {onChange, onBlur, value}}) => (
                    <FnbTextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors?.loginInfo}
                      leftIcon={<Email />}
                      placeholder={t(TextI18n.enterYourEmailOrPhoneNumber)}
                      label={t(TextI18n.emailOrPhoneNumber)}
                      trimSpaces={true}
                      autoCapitalize="none"
                    />
                  )}
                  name="loginInfo"
                />
              </View>

              <View style={styles.controlGroup}>
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t(MessageI18n.invalidData),
                    },
                  }}
                  render={({field: {onChange, onBlur, value}}) => (
                    <FnbPasswordInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.password}
                      leftIcon={<Lock />}
                      placeholder={t(TextI18n.enterYourPassword)}
                      label={t(TextI18n.password)}
                      autoCapitalize="none"
                    />
                  )}
                  name="password"
                />
              </View>
              <Button
                disabled={promiseInProgress}
                style={styles.loginButton}
                textStyle={styles.textInButton}
                text={t(ButtonI18n.login)}
                activeOpacity={0.8}
                onPress={handleSubmit(onSubmit)}
              />

              <View style={styles.linkBox}>
                <Text style={styles.textInLinkBox}>
                  {t(TextI18n.doYouHaveAccount)}
                </Text>
                <Text> </Text>
                <TouchableOpacity
                  onPress={goToRegisterAccountScreen}
                  activeOpacity={0.5}>
                  <Text style={[styles.textInLinkBox, styles.textActive]}>
                    {t(TextI18n.register)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
