import React, {useState} from 'react';
import styles from './style';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import LeftArrow from '../../assets/icons/left-arrow.svg';
import {useTranslation} from 'react-i18next';
import TextI18n from '../../i18n/text.i18n';
import MessageI18n from '../../i18n/message.i18n';
import ConfirmationModal from '../confirmation-modal';
import {ScreenName} from '../../constants/screen.constants';
import {resetNav} from '../../utils/root-navigation';

export default function BackButton({text, showConfirm, backToScreen}) {
  const navigation = useNavigation();
  const route = useRoute();
  const {t} = useTranslation();
  const [showModal, setShowModal] = useState(false);

  /**
   * This function is used to go back to the previous screen.
   */
  const onBack = () => {
    if (showConfirm) {
      setShowModal(true);
    } else {
      if (backToScreen) {
        if (backToScreen === ScreenName.home) {
          resetNav({name: backToScreen});
        } else {
          navigation.navigate(backToScreen);
        }
      } else {
        if (route.name === ScreenName.myOrder) {
          resetNav({name: ScreenName.home});
        }
        else{
          navigation.goBack();
        }
      }
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <TouchableOpacity onPress={onBack}>
            <View style={styles.leftRowBox}>
              <LeftArrow />
            </View>
          </TouchableOpacity>

          <View style={styles.textContentBox}>
            <Text numberOfLines={1} style={styles.textInfo}>
              {text}
            </Text>
          </View>
        </View>
      </View>

      <ConfirmationModal
        contentKey={t(MessageI18n.wouldYouLikeToLeaveHere)}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => navigation.goBack()}
      />
    </>
  );
}
