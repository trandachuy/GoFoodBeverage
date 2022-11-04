import React from 'react';
import {useTranslation} from 'react-i18next';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import ButtonI18n from '../../i18n/button.i18n';
import TextI18n from '../../i18n/text.i18n';
import styles from './style';

/**
 * This component is used to display the confirmation modal when the user wants to confirm something.
 * @property  {bool} {visible If the value is true, the modal will be displayed.
 * @property  {string} titleKey Title of the modal, you should use the translation hook to render this text.
 * @property  {string} contentKey Content of the modal, you should use the translation hook to render this text.
 * @property  {string} cancelTextKey Text of the cancel button, you should use the translation hook to render this text.
 * @property  {string} onCancel The function will be called again when the user clicks on the cancel button.
 * @property  {string} okTextKey Text of the ok button, you should use the translation hook to render this text.
 * @property  {string} onOk} The function will be called again when the user clicks on the ok button.
 */
export default function ConfirmationModal({
  visible,
  titleKey,
  contentKey,
  cancelTextKey,
  onCancel,
  okTextKey,
  onOk,
}) {
  const {t} = useTranslation();

  if (!titleKey) {
    titleKey = t(TextI18n.confirmation);
  }

  if (!cancelTextKey) {
    cancelTextKey = t(ButtonI18n.ignore);
  }

  if (!okTextKey) {
    okTextKey = t(ButtonI18n.confirm);
  }

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onCancel}>
      <View style={styles.container}>
        <View style={styles.confirmationBox}>
          <Text style={styles.confirmationText}>{titleKey}</Text>

          <Text style={styles.contentText}>{contentKey}</Text>

          <View style={styles.buttonBox}>
            <TouchableOpacity activeOpacity={0.5} onPress={onCancel}>
              <View style={styles.cancelButton}>
                <Text style={styles.textInCancelButton}>{cancelTextKey}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.5} onPress={onOk}>
              <View style={styles.okButton}>
                <Text style={styles.textInOkButton}>{okTextKey}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
