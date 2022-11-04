import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Center, Circle, Flex} from 'native-base';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import DatabaseKeys from '../../constants/database-keys.constants';
import {
  AddressProfileIcon,
  FavoriteProfileIcon,
  LanguageProfileIcon,
  LeftArrowIcon,
  LoginProfileIcon,
  LogoutProfileIcon,
  OrderProfileIcon,
  PrivacyPolicyIcon,
  RightProfileIcon,
  RightProfileOptionIcon,
  TermOfUseIcon,
  UserDefaultIcon,
} from '../../constants/icons.constants';
import {ScreenName} from '../../constants/screen.constants';
import {VERSION} from '../../constants/string.constant';
import {
  getPrivacyPolicyUrl,
  getTermOfUseUrl,
} from '../../constants/terms-policy.constants';
import {setCart} from '../../data-services/cart-data-service';
import {
  getCustomerInfo,
  setCurrentCustomerAddress,
  setSession,
} from '../../data-services/session-data-service';
import TextI18n from '../../i18n/text.i18n';
import {getCurrentLocationByGps} from '../../utils/google';
import ChangeLanguageModal from '../change-language-modal';
import ConfirmationModal from '../confirmation-modal';
import DeleteAccountModal from './delete-account-modal';
import UserProfileEditComponent from './user-profile-edit';
import styles from './user-profile.style';

export default function UserProfileComponent(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {modalVisible, onCloseUserProfile} = props;
  const [showModalUpdateProfile, setShowModalUpdateProfile] = useState(false);
  const customerInformation = useSelector(getCustomerInfo);
  const [orderList, setOrderList] = useState([]);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showLogOutModal, setShowLogOutModal] = useState(false);
  const [showChangeLanguageModal, setShowChangeLanguageModal] = useState(false);
  const {t} = useTranslation();

  const optionButtonData = () => {
    let options = [];
    let isLogin = customerInformation != null;
    if (isLogin) {
      let optionItems = [
        {
          key: 1,
          icon: <OrderProfileIcon />,
          text: t(TextI18n.myOrderText),
          style: '',
        },
        {
          key: 2,
          icon: <FavoriteProfileIcon />,
          text: t(TextI18n.myFavoriteText),
          style: styles.buttonOptionBottom,
        },
        {
          key: 3,
          icon: <AddressProfileIcon />,
          text: t(TextI18n.myAddressText),
          style: styles.buttonOptionBottom,
        },
      ];
      options.push(...optionItems);
    }

    let optionsOptional = [
      {
        key: 4,
        icon: <LanguageProfileIcon />,
        text: t(TextI18n.languageText),
        style: styles.buttonOptionBottom,
      },
      {
        key: 5,
        icon: <TermOfUseIcon />,
        text: t(TextI18n.termOfUse),
        style: styles.buttonOptionBottom,
      },
      {
        key: 6,
        icon: <PrivacyPolicyIcon />,
        text: t(TextI18n.privacyPolicy),
        style: styles.buttonOptionBottom,
      },
    ];
    options.push(...optionsOptional);

    if (isLogin) {
      let optionLogout = {
        key: 7,
        icon: <LogoutProfileIcon />,
        text: t(TextI18n.logoutText),
        style: styles.buttonOptionBottom,
      };
      options.push(optionLogout);
    } else {
      let optionLogin = {
        key: 8,
        icon: <LoginProfileIcon />,
        text: t(TextI18n.loginText),
        style: styles.buttonOptionBottom,
      };
      options.push(optionLogin);
    }

    return options;
  };

  const onCloseModalEdit = () => {
    setShowModalUpdateProfile(false);
  };

  const onOpenDeleteAccountModal = orders => {
    setOrderList(orders);
    setShowDeleteAccountModal(true);
  };

  const onHideDeleteAccountModal = () => {
    setOrderList([]);
    setShowDeleteAccountModal(false);
  };

  const onClickUserName = () => {
    onCloseUserProfile();
    setShowModalUpdateProfile(true);
  };

  const onClickLogout = () => {
    setShowLogOutModal(false);
    AsyncStorage.removeItem(DatabaseKeys.currentCustomerAddress).then(
      result => {
        onSetCurrentCustomerAddress();
      },
    );

    AsyncStorage.removeItem(DatabaseKeys.orderCart).then(result => {
      dispatch(setCart(undefined));
    });

    AsyncStorage.removeItem(DatabaseKeys.session).then(result => {
      dispatch(setSession(undefined));
      onCloseUserProfile();
    });
  };

  const onSetCurrentCustomerAddress = async () => {
    let addressInfo = await getCurrentLocationByGps();
    let jsonString = JSON.stringify(addressInfo);
    await AsyncStorage.setItem(DatabaseKeys.currentCustomerAddress, jsonString);
    dispatch(setCurrentCustomerAddress(addressInfo));
  };

  const onOptionPress = itemKey => {
    switch (itemKey) {
      case 1: {
        onCloseUserProfile();
        navigation.navigate(ScreenName.myOrder);
        break;
      }
      case 2:
        onCloseUserProfile();
        navigation.navigate(ScreenName.favoriteStore, {
          customerId: customerInformation?.id,
        });
        break;
      case 3:
        onCloseUserProfile();
        navigation.navigate(ScreenName.myAddress);
        break;
      case 4:
        onCloseUserProfile();
        setShowChangeLanguageModal(true);
        break;
      case 5:
        openTermOfUse();
        break;
      case 6:
        openPrivacyPolicy();
        break;
      case 7:
        onCloseUserProfile();
        setShowLogOutModal(true);
        break;
      case 8:
        onClickLogin();
        break;
    }
  };

  const openTermOfUse = async () => {
    let url = getTermOfUseUrl();
    await Linking.openURL(url);
  };

  const openPrivacyPolicy = async () => {
    let url = getPrivacyPolicyUrl();
    await Linking.openURL(url);
  };

  const onClickLogin = () => {
    onCloseUserProfile();
    navigation.navigate(ScreenName.login);
  };

  const renderUserDetailComponent = () => {
    return (
      <>
        {showModalUpdateProfile && (
          <UserProfileEditComponent
            modalVisible={showModalUpdateProfile}
            onCloseModal={onCloseModalEdit}
            onOpenDeleteAccountModal={onOpenDeleteAccountModal}
            userInfo={customerInformation}
          />
        )}

        {showDeleteAccountModal && (
          <DeleteAccountModal
            visible={showDeleteAccountModal}
            onHide={onHideDeleteAccountModal}
            orderItems={orderList}
          />
        )}

        {showLogOutModal && (
          <ConfirmationModal
            visible={showLogOutModal}
            cancelTextKey={t(TextI18n.confirmTextCancel)}
            okTextKey={t(TextI18n.confirmTextLogout)}
            contentKey={t(TextI18n.confirmTextMessage)}
            titleKey={t(TextI18n.confirmTextTitle)}
            onCancel={() => setShowLogOutModal(false)}
            onOk={onClickLogout}
          />
        )}

        {showChangeLanguageModal && (
          <ChangeLanguageModal
            visible={showChangeLanguageModal}
            onComplete={() => setShowChangeLanguageModal(false)}
          />
        )}
      </>
    );
  };

  return (
    <>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={onCloseUserProfile}>
        <View style={styles.viewModalProfile}>
          <View style={styles.containModal}>
            <LinearGradient
              colors={['rgb(185, 212, 219)', 'rgb(185, 212, 219)', '#273B4A']}
              style={[styles.containModalTop]}
              locations={[0, 0.47, 1]}>
              <TouchableOpacity
                style={styles.backIcon}
                onPress={onCloseUserProfile}>
                <Flex direction="row" align={'center'} justify={'flex-start'}>
                  <Circle size={6}>
                    <LeftArrowIcon />
                  </Circle>
                </Flex>
              </TouchableOpacity>
              {customerInformation === null ||
              customerInformation?.thumbnail === null ||
              customerInformation?.thumbnail === undefined ||
              customerInformation?.thumbnail === '' ? (
                <>
                  <UserDefaultIcon />
                </>
              ) : (
                <>
                  <Image
                    style={styles.avatarUser}
                    source={{
                      uri: customerInformation?.thumbnail,
                    }}
                  />
                </>
              )}
              {customerInformation !== null &&
                customerInformation !== undefined && (
                  <TouchableOpacity
                    onPress={onClickUserName}
                    style={styles.textUserName}>
                    <Text style={styles.textTitle}>
                      {customerInformation?.fullName}
                    </Text>
                    <View style={styles.viewIconRightProfile}>
                      <RightProfileIcon />
                    </View>
                  </TouchableOpacity>
                )}
            </LinearGradient>
            <View style={styles.shadowOption}>
              <View style={styles.containModalBottom}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {optionButtonData().map(option => (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      key={option.key}
                      onPress={() => {
                        onOptionPress(option.key);
                      }}>
                      <Flex
                        direction="row"
                        align={'center'}
                        justify={'flex-start'}
                        style={[styles.buttonOption, option.style]}>
                        <Center>{option.icon}</Center>
                        <Center w="86%">
                          <Text style={styles.buttonOptionText}>
                            {option.text}
                          </Text>
                        </Center>
                        <Center>
                          <RightProfileOptionIcon />
                        </Center>
                      </Flex>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <Center style={styles.columnVersion}>
                  <Text style={styles.textVersion}>{`v${VERSION}`}</Text>
                  <Text style={styles.textVersion}>
                    {t(TextI18n.footerText)}
                  </Text>
                </Center>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {renderUserDetailComponent()}
    </>
  );
}
