import AsyncStorage from '@react-native-async-storage/async-storage';
import {Box, Center, Flex, useToast} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {useDispatch} from 'react-redux';
import accountApiService from '../../api-services/account-api-service';
import customerApiService from '../../api-services/customer-api-service';
import DatabaseKeys from '../../constants/database-keys.constants';
import {
  ChangePasswordIcon,
  DeleteAccountIcon,
  RightProfileOptionIcon,
  SuccessIcon,
  UploadAvatarIcon,
  UserDefaultSmallIcon,
} from '../../constants/icons.constants';
import OrderStatus from '../../constants/order-status.constants';
import {
  updateCustomerAvatar,
  updateCustomerInfo,
} from '../../data-services/session-data-service';
import MessageI18n from '../../i18n/message.i18n';
import TextI18n from '../../i18n/text.i18n';
import Valid from '../../utils/data-validation';
import {fileNameNormalize} from '../../utils/helpers';
import FnbPhoneInput from '../input-controls/phone-input';
import FnbTextInput from '../input-controls/text-input';
import stylesEditForm from './user-profile-edit.style';

export default function UserUpdateProfileComponent(props) {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    clearErrors,
    formState: {errors, isDirty},
  } = useForm({
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      avatarUrl: '',
    },
  });
  const {t} = useTranslation();
  const {
    modalVisible,
    onCloseModal,
    userInfo,
    onOpenDeleteAccountModal,
    onChangePassword,
  } = props;

  const refCountry = useRef();
  const toast = useToast();
  const dispatch = useDispatch();
  const [edited, setEdited] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const optionEnum = {
    changePassword: 1,
    deleteAccount: 2,
  };

  const optionButtonData = [
    {
      key: optionEnum.changePassword,
      icon: <ChangePasswordIcon />,
      text: t(TextI18n.changePasswordText),
    },
    {
      key: optionEnum.deleteAccount,
      icon: <DeleteAccountIcon />,
      text: t(TextI18n.deleteAccountText),
    },
  ];

  useEffect(async () => {
    if (modalVisible && userInfo) {
      reset();
      clearErrors();
      await setCustomerInformation();
    }
  }, [modalVisible]);

  const setCustomerInformation = async () => {
    setValue('phoneNumber', userInfo?.phoneNumber);
    setValue('email', userInfo?.email);
    setValue('fullName', userInfo?.fullName);
    setValue('avatarUrl', userInfo?.thumbnail);
    setAvatarUrl(userInfo?.thumbnail ?? null);
  };

  const onOptionPress = async itemKey => {
    if (itemKey === optionEnum.deleteAccount) {
      onCloseModal();
      let result = await customerApiService.getCustomerOrderList(true, [
        OrderStatus.New,
        OrderStatus.ToConfirm,
        OrderStatus.Processing,
        OrderStatus.Delivering,
      ]);

      onOpenDeleteAccountModal(result?.orderList);
    }
    if (itemKey === optionEnum.changePassword) {
      onChangePassword(true);
    }
  };

  const submitUserProfile = async data => {
    clearErrors();
    let countryId = refCountry?.current?.id;
    let req = {
      ...data,
      countryId: countryId,
    };
    const customerResolve = await customerApiService.updateCustomerProfile(req);
    if (customerResolve.isSuccess === true) {
      await updateSessionJsonStringValue(customerResolve?.customerInfo);
      dispatch(updateCustomerInfo(customerResolve?.customerInfo));
      toastMessage(t(customerResolve.message), false);
      onCloseModal();
    } else {
      if (
        customerResolve.objectName !== null &&
        customerResolve.objectName !== ''
      ) {
        setError(customerResolve.objectName, {
          type: 'custom',
          message: t(customerResolve.message),
        });
      } else {
        toastMessage(t(customerResolve.message), true);
      }
    }
  };

  const selectAvatar = () => {
    ImagePicker.launchImageLibrary(
      {mediaType: 'photo', quality: 1, includeBase64: true},
      async response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorCode);
        } else {
          let source = response.assets[0];
          if (source.fileSize >= 5242880) {
            toastMessage(t(MessageI18n.errorImageSizeIsTooBig), true);
          } else {
            let buildFileName = new Date().toISOString();
            let formData = new FormData();
            formData.append('file', {
              uri:
                Platform.OS === 'ios'
                  ? source?.uri.replace('file://', '')
                  : source?.uri,
              name: source?.fileName,
              type: source?.type,
            });
            formData.append('fileName', fileNameNormalize(buildFileName));
            const accountUploadResult =
              await accountApiService.uploadAccountAvatarAsync(formData);
            if (accountUploadResult.isSuccess === true) {
              let customerInformation = {
                ...userInfo,
                thumbnail: accountUploadResult?.avatarUrl,
              };
              await updateSessionJsonStringValue(customerInformation);
              dispatch(updateCustomerAvatar(accountUploadResult?.avatarUrl));
              setValue('avatarUrl', accountUploadResult?.avatarUrl);
              setAvatarUrl(accountUploadResult?.avatarUrl);
              toastMessage(t(accountUploadResult?.message), false);
              onCloseModal();
            } else {
              toastMessage(t(accountUploadResult?.message), true);
            }
          }
        }
      },
    );
  };

  const toastMessage = (message, isError = false) => {
    if (isError) {
      toast.show({
        title: message,
        placement: 'top',
        style: stylesEditForm.toastErrorMessageContainer,
      });
    } else {
      toast.show({
        title: null,
        placement: 'top',
        render: () => {
          return (
            <>
              <Box style={stylesEditForm.toastMessageView} bg="#293450">
                <Flex
                  direction="row"
                  align={'center'}
                  justify={'flex-start'}
                  style={stylesEditForm.textGroup}>
                  <Center>
                    <SuccessIcon />
                  </Center>
                  <Center w="95%">
                    <Text style={stylesEditForm.textToastMessage}>
                      {message}
                    </Text>
                  </Center>
                </Flex>
              </Box>
            </>
          );
        },
      });
    }
  };

  const updateSessionJsonStringValue = async customerInformation => {
    let stringOfSession = await AsyncStorage.getItem(DatabaseKeys.session);
    let session = JSON.parse(stringOfSession);
    session = {
      ...session,
      customerInfo: customerInformation,
    };

    let jsonString = JSON.stringify(session);
    await AsyncStorage.setItem(DatabaseKeys.session, jsonString);
  };

  return (
    <>
      <KeyboardAvoidingView behavior="position">
        <View style={stylesEditForm.containerModalEdit}>
          <View style={stylesEditForm.containUserProfile}>
            <View style={stylesEditForm.formContainer}>
              <View style={stylesEditForm.groupAvatar}>
                <Flex direction="row" align={'center'} justify={'flex-start'}>
                  <Center w="50%">
                    <TouchableOpacity
                      style={stylesEditForm.leaveButton}
                      onPress={onCloseModal}>
                      <Text style={stylesEditForm.leaveButton}>
                        {t(TextI18n.leaveText)}
                      </Text>
                    </TouchableOpacity>
                  </Center>
                  <Center w="50%">
                    <TouchableOpacity
                      disabled={!isDirty}
                      style={[
                        stylesEditForm.saveButton,
                        isDirty === false &&
                          edited === false &&
                          stylesEditForm.opacityText,
                      ]}
                      onPress={handleSubmit(submitUserProfile)}>
                      <Text style={stylesEditForm.saveButton}>
                        {t(TextI18n.saveText)}
                      </Text>
                    </TouchableOpacity>
                  </Center>
                </Flex>
                <View style={stylesEditForm.containerAvatarUser}>
                  <View style={stylesEditForm.avatarUser}>
                    {userInfo?.thumbnail === undefined ||
                    userInfo?.thumbnail === '' ? (
                      <>
                        <UserDefaultSmallIcon />
                      </>
                    ) : (
                      <>
                        <Image
                          style={stylesEditForm.avatarUser}
                          source={{
                            uri: avatarUrl,
                          }}
                        />
                      </>
                    )}
                  </View>
                  <TouchableOpacity
                    style={stylesEditForm.uploadAvatarUser}
                    onPress={() => selectAvatar()}>
                    <View>
                      <Controller
                        control={control}
                        rules={{}}
                        render={({field: {onChange, onBlur, value}}) => <></>}
                        name="avatarUrl"
                      />
                      <UploadAvatarIcon />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView
                style={stylesEditForm.containForm}
                showsVerticalScrollIndicator={false}>
                <View>
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
                        placeholder={t(TextI18n.enterYourName)}
                        trimSpaces={false}
                        autoCapitalize="words"
                        maxLength={100}
                      />
                    )}
                    name="fullName"
                  />
                </View>
                <View style={stylesEditForm.controlForm}>
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
                        defaultValue={userInfo?.countryId}
                        defaultPhoneCode={userInfo?.phoneCode}
                        changePhoneCode={() => onChange(value)}
                      />
                    )}
                    name="phoneNumber"
                  />
                </View>
                <View style={stylesEditForm.controlForm}>
                  <Controller
                    control={control}
                    rules={{
                      validate: {
                        emailOrPhone: value => {
                          return value?.length > 0
                            ? Valid.isEmailOrPhoneNumber(value) ||
                                t(MessageI18n.pleaseEnterValidEmailAddress)
                            : true;
                        },
                      },
                    }}
                    render={({field: {onChange, onBlur, value}}) => (
                      <FnbTextInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors?.email}
                        placeholder={t(TextI18n.enterYourEmailText)}
                        trimSpaces={true}
                        autoCapitalize="none"
                      />
                    )}
                    name="email"
                  />
                </View>
                {optionButtonData.map(option => (
                  <View style={stylesEditForm.optionForm} key={option.key}>
                    <TouchableOpacity onPress={() => onOptionPress(option.key)}>
                      <Flex
                        direction="row"
                        align={'center'}
                        justify={'flex-start'}
                        style={stylesEditForm.buttonOption}>
                        <Center>{option.icon}</Center>
                        <Center w="92%">
                          <Text style={stylesEditForm.buttonOptionText}>
                            {option.text}
                          </Text>
                        </Center>
                        <Center>
                          <RightProfileOptionIcon />
                        </Center>
                      </Flex>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
