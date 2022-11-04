import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, Modal, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import accountApiService from '../../../api-services/account-api-service';
import DatabaseKeys from '../../../constants/database-keys.constants';
import {
  ArrowRightIcon,
  CheckReadIcon,
} from '../../../constants/icons.constants';
import {HeaderImgInDeleteAccountModal} from '../../../constants/images.constants';
import {ScreenName} from '../../../constants/screen.constants';
import {setSession} from '../../../data-services/session-data-service';
import ButtonI18n from '../../../i18n/button.i18n';
import TextI18n from '../../../i18n/text.i18n';
import OrderUtil from '../../../utils/order';
import Button from '../../button';
import styles from './style';

export default function DeleteAccountModal({orderItems, visible, onHide}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!visible) {
      setCountdown(10);
      return;
    }
    // Each count lasts for a second.
    let interval = setInterval(() => {
      setCountdown(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000);
    // Cleanup the interval on complete.
    return () => clearInterval(interval);
  }, [visible]);

  const onNavigateToOrderList = () => {
    navigation.navigate(ScreenName.myOrder);
    onHide();
  };

  const onNavigateToOrderDetail = orderDetail => {
    navigation.navigate(ScreenName.orderDetails, {
      orderId: orderDetail?.id,
      branchId: orderDetail?.branchId,
      backToScreen: ScreenName.myOrder,
    });
    onHide();
  };

  const deleteAccountNow = async () => {
    let result = await accountApiService.disableAccount();
    if (result) {
      dispatch(setSession(undefined));
      await AsyncStorage.removeItem(DatabaseKeys.session);
      onHide();
    }
  };

  return (
    <Modal onRequestClose={onHide} transparent={true} visible={visible}>
      <View style={styles.container}>
        {orderItems === undefined || orderItems?.length === 0 ? (
          <View style={styles.confirmationBox}>
            <View
              style={[styles.headerTitleBox, styles.headerDeleteAccountBox]}>
              <Image
                style={styles.headerImg}
                source={HeaderImgInDeleteAccountModal}
              />
              <Text style={styles.headerTitleText}>
                {t(TextI18n.deleteAccount)}
              </Text>
            </View>

            <View style={styles.contentBox}>
              <Text style={[styles.textInModal, styles.warningAccount]}>
                {t(TextI18n.warningWhenDeletingAccount)}
              </Text>

              <Text style={styles.textMainConfirmation}>
                {t(TextI18n.ifYouStillWantToDeleteYourAccount)}
              </Text>

              <View style={[styles.policyItem, styles.firstItemInPolicyItem]}>
                <CheckReadIcon />

                <Text style={[styles.textInModal, styles.textInPolicy]}>
                  {t(TextI18n.unableToReviewOrdersWhenDeletingAccount)}
                </Text>
              </View>

              <View style={styles.policyItem}>
                <CheckReadIcon />

                <Text style={[styles.textInModal, styles.textInPolicy]}>
                  {t(TextI18n.allDevicesUsingThisAccount)}
                </Text>
              </View>
            </View>

            <View style={styles.buttonBoxForAccountDeletion}>
              <Button
                disabled={countdown > 0}
                onPress={deleteAccountNow}
                text={
                  countdown > 0
                    ? `${t(ButtonI18n.yesDeleteMyAccount)} (${countdown}s)`
                    : t(ButtonI18n.yesDeleteMyAccount)
                }
                style={[
                  styles.deleteButtonIsDisabled,
                  countdown === 0 && styles.deleteButtonIsEnabled,
                ]}
                textStyle={[
                  styles.textInModal,
                  styles.textBold,
                  styles.textInCloseButton,
                ]}
              />

              <Button
                onPress={onHide}
                text={t(ButtonI18n.cancelKeepIt)}
                style={styles.cancelButton}
                textStyle={[styles.textInModal, styles.textInCancelButton]}
              />
            </View>
          </View>
        ) : (
          <View style={styles.confirmationBox}>
            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTitleText}>
                {t(TextI18n.confirmation)}
              </Text>
            </View>

            <View style={styles.canNotDeleteAccountBox}>
              <Text
                style={[styles.textInCannotDeleteAccountBox, styles.textBold]}>
                {t(TextI18n.youCannotDeleteYourAccount)}
              </Text>

              <Text style={[styles.textInCannotDeleteAccountBox]}>
                {t(TextI18n.weRecognizeYouHavePendingOrders)}
              </Text>

              <Text
                style={[
                  styles.textInCannotDeleteAccountBox,
                  styles.lastTextInCannotDeleteAccountBox,
                ]}>
                {t(TextI18n.pleaseCompleteOrder)}
              </Text>
            </View>

            <View style={styles.orderBox}>
              {orderItems &&
                orderItems.length > 0 &&
                orderItems.map((item, index) => (
                  <TouchableOpacity
                    key={`delete-account-order-item-index-${index}`}
                    activeOpacity={0.5}
                    onPress={() => onNavigateToOrderDetail(item)}>
                    <View style={styles.orderItemBox}>
                      <View>
                        <Text
                          style={[
                            styles.textInModal,
                            styles.textBold,
                            styles.orderNameInItemBox,
                          ]}>
                          {item?.store?.title}
                        </Text>

                        <Text
                          style={[
                            styles.textInModal,
                            styles.orderCodeInItemBox,
                          ]}>
                          {item?.stringCode}
                        </Text>
                      </View>

                      <View style={styles.rightSectionInItemBox}>
                        <Text
                          style={[
                            styles.textInModal,
                            styles.textRightInRightSection,
                          ]}>
                          {t(OrderUtil.getStatusName(item?.statusId))}
                        </Text>
                        <ArrowRightIcon />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}

              {orderItems?.length > 1 && (
                <TouchableOpacity
                  onPress={onNavigateToOrderList}
                  activeOpacity={0.5}>
                  <View style={styles.showMoreOrderItemBox}>
                    <Text
                      style={[
                        styles.textInModal,
                        styles.textInShowMoreOrderItemBox,
                      ]}>
                      {t(TextI18n.viewOrderList)}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              <View style={styles.buttonBox}>
                <Button
                  onPress={onHide}
                  text={t(ButtonI18n.close)}
                  style={styles.closeButton}
                  textStyle={[
                    styles.textInModal,
                    styles.textBold,
                    styles.textInCloseButton,
                  ]}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}
