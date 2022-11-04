import {Box, Center, Flex, useToast} from 'native-base';
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
import customerApiService from '../../api-services/customer-api-service';
import {
  ChangePasswordIcon,
  CloseIcon,
  SuccessIcon,
} from '../../constants/icons.constants';
import {MaxTryOnSubmitWrongPassword} from '../../constants/numbers-constants';
import ButtonI18n from '../../i18n/button.i18n';
import MessageI18n from '../../i18n/message.i18n';
import TextI18n from '../../i18n/text.i18n';
import Valid from '../../utils/data-validation';
import FnbPasswordInput from '../input-controls/password-input';
import stylesEditForm from './user-profile-edit.style';

export default function UserUpdatePasswordComponent(props) {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    getValues,
    reset,
    clearErrors,
    formState: {errors, isDirty},
    watch: changePasswordWatch,
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const {t} = useTranslation();
  const {onChangePassword, userInfo, modalVisible} = props;
  const newPassword = useRef({});
  newPassword.current = changePasswordWatch('newPassword', '');
  const currentPassword = useRef({});
  currentPassword.current = changePasswordWatch('currentPassword', '');
  const toast = useToast();
  const [edited, setEdited] = useState(false);
  const [countFailedCurrentPass, setCountFailedCurrentPass] = useState(0);

  useEffect(() => {
    if (modalVisible && userInfo) {
      reset();
      clearErrors();
    }
  }, [modalVisible]);

  useEffect(() => {
    if (countFailedCurrentPass === MaxTryOnSubmitWrongPassword) {
      toast.show({
        title: t(MessageI18n.passwordHasBeenEnteredTooManyTimes),
        placement: 'top',
        style: stylesEditForm.toastErrorMessageContainer,
      });
      onChangePassword();
    }
  }, [countFailedCurrentPass]);

  const submitUserPassword = async data => {
    clearErrors();
    reset();
    var obj = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    };
    customerApiService
      .updateCustomerPasswordAsync(obj)
      .then(response => {
        if (response.isSuccess) {
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
                          {t(response.message)}
                        </Text>
                      </Center>
                    </Flex>
                  </Box>
                </>
              );
            },
          });

          onChangePassword(false);
        } else {
          if (response.objectName !== null && response.objectName !== '') {
            setError(response.objectName, {
              type: 'custom',
              message: t(response.message),
            });
            setCountFailedCurrentPass(prev => prev + 1);
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onClearInputOnErrors = _ => {
    let formData = getValues();
    let currentPassword = formData.currentPassword;
    let newPassword = formData.newPassword;
    let confirmPassword = formData.confirmPassword;

    if (
      newPassword === currentPassword ||
      !Valid.passwordRequirement(newPassword) ||
      confirmPassword !== newPassword
    ) {
      setValue('newPassword', '');
      setValue('confirmPassword', '');
    }
  };

  return (
    <>
      <KeyboardAvoidingView behavior="position">
        <View style={stylesEditForm.containerModalEdit}>
          <View style={stylesEditForm.containUserProfile}>
            <View style={stylesEditForm.formContainer}>
              <View style={stylesEditForm.groupAvatar}>
                <Flex direction="row" align={'center'} justify={'flex-start'}>
                  <View style={{flex: 4, flexDirection: 'row'}}>
                    <ChangePasswordIcon />
                    <Text
                      numberOfLines={1}
                      style={stylesEditForm.textChangePassword}>
                      {t(TextI18n.changePasswordText)}
                    </Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <TouchableOpacity onPress={() => onChangePassword(false)}>
                      <CloseIcon />
                    </TouchableOpacity>
                  </View>
                </Flex>
              </View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
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
                        error={errors?.currentPassword}
                        placeholder={t(TextI18n.enterCurrentPassword)}
                        trimSpaces={false}
                        autoCapitalize="words"
                        maxLength={100}
                      />
                    )}
                    name="currentPassword"
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
                        value: 100,
                        message: t(MessageI18n.invalidData),
                      },
                      validate: {
                        passwordRequirement: value =>
                          Valid.passwordRequirement(value) ||
                          t(MessageI18n.requirePassword),
                        comparePassword: value => {
                          return (
                            value !== currentPassword.current ||
                            t(MessageI18n.newPasswordSameAsOldOne)
                          );
                        },
                      },
                    }}
                    render={({field: {onChange, onBlur, value}}) => (
                      <FnbPasswordInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors?.newPassword}
                        placeholder={t(TextI18n.enterYourNewPassword)}
                        trimSpaces={false}
                        autoCapitalize="words"
                        maxLength={100}
                      />
                    )}
                    name="newPassword"
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
                        value: 100,
                        message: t(MessageI18n.invalidData),
                      },
                      validate: {
                        passwordRequirement: value =>
                          Valid.passwordRequirement(value) ||
                          t(MessageI18n.requirePassword),
                        comparePassword: value => {
                          return (
                            value === newPassword.current ||
                            t(TextI18n.confirmPasswordMustSameTheNewOne)
                          );
                        },
                      },
                    }}
                    render={({field: {onChange, onBlur, value}}) => (
                      <FnbPasswordInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors?.confirmPassword}
                        placeholder={t(TextI18n.enterConfirmPassword)}
                        trimSpaces={false}
                        autoCapitalize="words"
                        maxLength={100}
                      />
                    )}
                    name="confirmPassword"
                  />
                </View>
                <TouchableOpacity
                  onPress={handleSubmit(
                    submitUserPassword,
                    onClearInputOnErrors,
                  )}
                  disabled={!isDirty}
                  style={[
                    stylesEditForm.btnConfirm,
                    !isDirty && !edited && stylesEditForm.activeBtnConfirm,
                  ]}>
                  <Text style={stylesEditForm.textConfirm}>
                    {t(ButtonI18n.confirm)}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
