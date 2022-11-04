import React from 'react';
import {
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {usePromiseTracker} from 'react-promise-tracker';
import {LeftArrowIcon} from '../../../constants/icons.constants';
import styles from '../checkout.style';

export default function CheckoutModal({
  onClose,
  isOpen,
  children,
  headerText,
  onRefresh,
}) {
  const {promiseInProgress} = usePromiseTracker();

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent={true}
      visible={isOpen}>
      <SafeAreaView style={styles.contentBoxInModal}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={promiseInProgress}
              onRefresh={onRefresh}
            />
          }>
          <View style={styles.headerTitleBoxInModal}>
            <TouchableOpacity onPress={onClose}>
              <View style={styles.leftArrowInHeaderTitleBox}>
                <LeftArrowIcon />
              </View>
            </TouchableOpacity>
            <Text
              style={[
                styles.defaultText,
                styles.textBold,
                styles.textInHeaderTitleBox,
              ]}>
              {headerText}
            </Text>
          </View>
          {children}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
