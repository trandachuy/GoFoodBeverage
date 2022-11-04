import AsyncStorage from '@react-native-async-storage/async-storage';
import {Center} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import i18n from '../../configs/i18n-config';
import DatabaseKeys from '../../constants/database-keys.constants';
import {CheckIcon} from '../../constants/icons.constants';
import {listDefaultLanguage} from '../../constants/language.constants';
import TextI18n from '../../i18n/text.i18n';
import styles from './style';

export default function ChangeLanguageModal({visible, onComplete}) {
  const [languageList, setLanguageList] = useState(listDefaultLanguage);
  const {t} = useTranslation();

  useEffect(() => {
    setDefaultLanguage();
  }, []);

  const setDefaultLanguage = async () => {
    let languageCode = await AsyncStorage.getItem(DatabaseKeys.language);
    changeLanguage(languageCode ?? DatabaseKeys.defaultLanguage);
  };

  const changeLanguage = languageCode => {
    let newLanguage = languageList?.map(item => {
      item.isDefault = item.languageCode == languageCode;

      return item;
    });

    setLanguageList(newLanguage);
  };

  const saveChangeLanguage = async () => {
    let newLanguage = languageList?.find(item => item.isDefault);
    i18n.changeLanguage(newLanguage.languageCode);
    await AsyncStorage.setItem(DatabaseKeys.language, newLanguage.languageCode);
    onComplete();
  };

  const renderLanguage = () => {
    return (
      <>
        {languageList?.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => changeLanguage(item.languageCode)}>
            <View style={styles.padding_16}>
              <View style={styles.flagBox}>{item?.flag}</View>
              <View style={styles.textLanguageBox}>
                <Text style={styles.textLanguageName}>{t(item?.name)}</Text>
              </View>
              <View style={styles.checkIconBox}>
                {item.isDefault && <CheckIcon style={styles.checkIcon} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </>
    );
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onComplete}>
      <View style={styles.container}>
        <View style={styles.topContent}>
          <Text style={styles.textLanguage}>{t(TextI18n.languageText)}</Text>
        </View>
        <View style={styles.languagesContent}>{renderLanguage()}</View>
        <View style={styles.bottomContent}>
          <View style={styles.bottomButton}>
            <TouchableOpacity onPress={saveChangeLanguage}>
              <Center>
                <Text style={styles.textButton}>{t(TextI18n.saveText)}</Text>
              </Center>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
