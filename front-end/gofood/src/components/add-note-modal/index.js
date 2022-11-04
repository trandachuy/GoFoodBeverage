import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Modal, Text, TextInput, TouchableOpacity, View} from 'react-native';
import styles from './style';

export default function AddNoteModal({
  visible,
  titleKey,
  placeholder,
  cancelTextKey,
  onCancel,
  okTextKey,
  onOk,
  note,
  maxLength
}) {
  const {control, handleSubmit} = useForm({
    defaultValues: {
      note: note,
    },
  });

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onCancel}>
      <View style={styles.container}>
        <View style={styles.confirmationBox}>
          <Text style={styles.confirmationText}>{titleKey}</Text>
          <View style={styles.viewInput}>
            <Controller
              control={control}
              render={({field: {onChange}}) => (
                <TextInput
                  maxLength={maxLength}
                  editable
                  multiline
                  defaultValue={note}
                  style={styles.input}
                  onChangeText={onChange}
                  placeholder={placeholder}
                  placeholderTextColor="#A5ABDE"
                />
              )}
              name="note"
            />
          </View>

          <View style={styles.buttonBox}>
            <TouchableOpacity activeOpacity={0.5} onPress={onCancel}>
              <View style={styles.cancelButton}>
                <Text style={styles.textInCancelButton}>{cancelTextKey}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit(onOk)}>
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
