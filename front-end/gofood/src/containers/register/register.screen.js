import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {Toast} from 'native-base';
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
import {usePromiseTracker} from 'react-promise-tracker';
import {useDispatch} from 'react-redux';
import customerApiService from '../../api-services/customer-api-service';
import Lock from '../../assets/icons/lock.svg';
import User from '../../assets/icons/user.svg';
import RegisterLogo from '../../assets/logos/logo-register.svg';
import Button from '../../components/button';
import FnbPasswordInput from '../../components/input-controls/password-input';
import FnbPhoneInput from '../../components/input-controls/phone-input';
import FnbTextInput from '../../components/input-controls/text-input';
import Layout from '../../components/layout';
import LoadingComponent from '../../components/loading';
import DatabaseKeys from '../../constants/database-keys.constants';
import {ScreenName} from '../../constants/screen.constants';
import {setSession} from '../../data-services/session-data-service';
import ButtonI18n from '../../i18n/button.i18n';
import MessageI18n from '../../i18n/message.i18n';
import TextI18n from '../../i18n/text.i18n';
import Valid from '../../utils/data-validation';
import {resetNav} from '../../utils/root-navigation';
import String from '../../utils/string';
import styles from './register.style';

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: {errors, isDirty},
    getValues,
  } = useForm({
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      password: '',
    },
  });
  const countdownNumber = 60;
  const refCountry = useRef();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {promiseInProgress} = usePromiseTracker();

  const [countResend, setCountResend] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [showSmsOtp, setShowSmsOtp] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorSmsOtp, setErrorShowSmsOtp] = useState(false);

  useEffect(() => {
    // Each count lasts for a second.
    let interval = setInterval(() => {
      setCountdown(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000);
    // Cleanup the interval on complete.
    return () => clearInterval(interval);
  }, [countResend]);

  /**
   * This function is used to handle the form data and it is only called when the data is valid.
   * This function will send data to server, if account does not exists in the system, show the SMS OTP form.
   * @param  {object} data The form data, for example: {fullName: 'William Thomas', phone: '0123456789', password: 'William!977'}
   */
  const onSubmit = async data => {
    setLoading(true);
    let result = await customerApiService.checkAccountAlreadyExistsInSystem(
      data.phoneNumber,
      refCountry.current?.iso,
    );

    if (result?.isSuccess) {
      setShowSmsOtp(true);
      setCountResend(1);
      setCountdown(countdownNumber);
      setPhoneNumber(result?.phoneNumberToSendOtpCode);
      setLoading(false);
      await signInWithPhoneNumber(result?.phoneNumberToSendOtpCode);
    } else {
      Toast.show({title: t(MessageI18n.phoneNumberExisted)});
      setLoading(false);
    }
  };

  const signInWithPhoneNumber = async phoneNumber => {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  };

  const compareOtpSmsCode = async code => {
    try {
      await confirm.confirm(code);
      return true;
    } catch (e) {
      return false;
    }
  };

  /** This function is used to send data to the server if the SMS OTP code is correct.
   * @param  {string} code The SMS OTP code, for example: 123456
   */
  const onSubmitSmsOtpCode = async code => {
    setLoading(true);
    if (await compareOtpSmsCode(code)) {
      setErrorShowSmsOtp(false);
      let countryId = refCountry?.current?.id;
      let countryCode = refCountry?.current?.iso;

      let formData = {
        ...getValues(),
        countryId,
        countryCode,
      };

      // Call server to register an account.
      let result = await customerApiService.createCustomer(formData);

      // If the account has been created successfully, reset the nav root and navigate to the Home screen.
      if (result.isSuccess) {
        Toast.show({title: t(MessageI18n.registerAccountSuccessfully)});
        if (result.data) {
          dispatch(setSession(result.data));
          let jsonString = JSON.stringify(result.data);
          await AsyncStorage.setItem(DatabaseKeys.session, jsonString);
        }
        setLoading(false);
        resetNav({name: ScreenName.home});
      }
    } else {
      setLoading(false);
      setErrorShowSmsOtp(true);
    }
  };

  /** This function is used to reset the sms code when the countdown is 0.
   */
  const onResendSmsOtpCode = () => {
    if (countResend < 3) {
      setCountResend(countResend + 1);
      setCountdown(countdownNumber);
      setTimeout(async () => {
        setErrorShowSmsOtp(false);
        await signInWithMobileNumber(phoneNumber);
      }, 100);
    } else {
      Toast.show({
        title: t(MessageI18n.max3Otp),
        duration: 5000,
        onCloseComplete: () => {
          setShowSmsOtp(false);
        },
      });
    }
  };

  /** This function is used to build the user's phone information, for example: (+84) 3789 111 111
   */
  const buildPhoneCode = () => {
    return `+(${refCountry?.current?.phonecode}) ${String.formatPhoneNumber(
      getValues('phoneNumber'),
    )}`;
  };

  return (
    <Layout
      showConfirm={isDirty}
      title={t(TextI18n.registerAccount)}
      backgroundColor="#FFFFFF">
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <KeyboardAvoidingView behavior="position">
          <View style={styles.logoContainer}>
            <RegisterLogo />
          </View>
          {loading && <LoadingComponent />}
          {showSmsOtp ? (
            <View style={styles.smsOtpContainer}>
              <View style={styles.smsOtpHeaderTextBox}>
                <Text style={styles.smsOtpText}>
                  {t(TextI18n.weJustSentCodeToPhoneNumber)}
                </Text>
                <Text style={[styles.smsOtpText, styles.smsOtpTextForPhone]}>
                  {buildPhoneCode()}
                </Text>
              </View>
              <OTPInputView
                clearInputs={countdown === countdownNumber}
                editable={true}
                style={styles.smsOtpItemBox}
                pinCount={6}
                autoFocusOnLoad={countdown < countdownNumber}
                codeInputFieldStyle={styles.smsOtpItemInBox}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled={onSubmitSmsOtpCode}
              />
              <View style={styles.smsOtpErrorCodeBox}>
                {showErrorSmsOtp === true && (
                  <Text style={styles.smsOtpErrorCode}>
                    {t(TextI18n.youEnteredTheWrongCode)}
                  </Text>
                )}
              </View>
              <View style={styles.resendCodeBox}>
                <View>
                  <Text style={styles.messageInResendCodeBox}>
                    {t(TextI18n.didNotYouReceiveAnyCode)}
                  </Text>
                </View>

                {countdown <= 0 ? (
                  countResend <= 3 ? (
                    <TouchableOpacity onPress={onResendSmsOtpCode}>
                      <Text
                        style={[
                          styles.messageInResendCodeBox,
                          styles.resendText,
                        ]}>
                        {t(ButtonI18n.resend)}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <></>
                  )
                ) : (
                  <Text
                    style={[styles.messageInResendCodeBox, styles.resendText]}>
                    Resend in: {countdown}s
                  </Text>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.controlContainer}>
              <View style={styles.controlGroup}>
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t(MessageI18n.invalidData),
                    },
                    maxLength: {
                      value: 100,
                      message: t(MessageI18n.invalidData),
                    },
                    validate: {
                      withoutCharacters: value =>
                        Valid.withoutSpecialCharacters(value) ||
                        t(MessageI18n.invalidData),
                    },
                  }}
                  render={({field: {onChange, onBlur, value}}) => (
                    <FnbTextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors?.fullName}
                      leftIcon={<User />}
                      placeholder={t(TextI18n.enterYourName)}
                      trimSpaces={false}
                      autoCapitalize="words"
                      maxLength={100}
                    />
                  )}
                  name="fullName"
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
                    maxLength: {
                      value: 16,
                      message: t(MessageI18n.invalidData),
                    },
                    pattern: {
                      value: /[+0-9]{1,15}/g,
                      message: t(MessageI18n.invalidData),
                    },
                  }}
                  render={({field: {onChange, onBlur, value}}) => (
                    <FnbPhoneInput
                      refCountry={refCountry}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.phoneNumber}
                      placeholder={t(TextI18n.enterYourPhoneNumber)}
                      autoCapitalize="none"
                      maxLength={15}
                    />
                  )}
                  name="phoneNumber"
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
                    maxLength: {
                      value: 100,
                      message: t(MessageI18n.invalidData),
                    },
                    validate: {
                      passwordRequirement: value =>
                        Valid.passwordRequirement(value) ||
                        t(MessageI18n.requirePassword),
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
                      autoCapitalize="none"
                      maxLength={100}
                    />
                  )}
                  name="password"
                />
              </View>
              <Button
                disabled={promiseInProgress}
                style={styles.loginButton}
                textStyle={styles.textInButton}
                text={t(ButtonI18n.register)}
                activeOpacity={0.8}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </ScrollView>
    </Layout>
  );
}
