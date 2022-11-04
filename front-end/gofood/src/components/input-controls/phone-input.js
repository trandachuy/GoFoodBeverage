import {CheckIcon, SearchIcon} from 'native-base';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import addressApiService from '../../api-services/address-api-service';
import PhoneIcon from '../../assets/icons/phone.svg';
import CountryCode from '../../constants/country-code.constants';
import styles from './styles';

/**
 * This component is used to build a phone control that can allow the user to enter their string.
 * @property  {ref} refCountry It will be return the current object country, for example: {id: 243, name: 'Viet Nam', ... }
 * @property  {string} placeholder Placeholder of the text control.
 * @property  {string} label The label of the password control, it will be displayed on the top.
 * @property  {event} onChangeText The event will be used to set the value for the React Hook Form.
 * @property  {event} onBlur The event will be used to set the value for the React Hook Form.
 * @property  {string} value The string will be used to set the value for the React Hook Form.
 * @property  {object} error The error will be displayed if the input control is invalid.
 * @property  {bool} trimSpaces If the value is true, after typing it will automatically trim the space.
 * @property  {number} maxLength The total number of characters to be entered into the control.
 * @property  {string} autoCapitalize='none'|'sentences'|'words'|'characters'|undefined
 */
export default function FnbPhoneInput({
  refCountry,
  placeholder,
  label,
  onChangeText,
  onBlur,
  value,
  error,
  trimSpaces,
  maxLength,
  autoCapitalize = 'none' | 'sentences' | 'words' | 'characters' | undefined,
  defaultValue,
  defaultPhoneCode,
  changePhoneCode
}) {
  const refInput = useRef();
  const [textInputWidth, setTextInputWidth] = useState(0);
  const [focusing, setFocusing] = useState(false);
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState({
    id: undefined,
    name: undefined,
    iso: undefined,
    phonecode: defaultPhoneCode,
  });
  const {t} = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [searchKeywords, setSearchKeywords] = useState('');

  useEffect(() => {
    (async () => {
      let jsonObject = await addressApiService.getCountriesAsync();
      let countryList = [];
      if (jsonObject?.countries) {
        countryList = [
          ...jsonObject?.countries?.map(item => ({
            ...item,
            code: item.iso,
            name: `+${item.phonecode} ${item?.name}`,
          })),
        ];
      }
      let country = countryList?.find(item => item.iso === CountryCode.vietnam);
      setCountries(countryList ?? []);
      if (defaultValue != null) {
        let countryExist = countryList?.find(item => item.id === defaultValue);
        country = countryExist != null ? countryExist : country;
      }
      setCurrentCountry(country);
      setCountryForRefElement(country);
    })();
  }, []);

  /**
   * This function is used to set the width of the TextBox control.
   * On each device, the screen size is different.
   * @param  {event} event The react native event.
   */
  const onSetWidth = event => {
    let layout = event.nativeEvent.layout;
    let width = layout.width - 97;
    setTextInputWidth(width);
  };

  /**
   * This function is used to set the data for the React Form Hook.
   * @param  {string} text The string will be passed to the value of the control.
   */
  const handleWhenTextIsChanged = text => {
    if (trimSpaces === true && text) {
      text = text.trim();
    }
    if (onChangeText) {
      onChangeText(text);
    }
  };

  /**
   * This function is used to set a border width for the control when the user focuses on the TextBox control.
   */
  const handleOnFocus = () => {
    setFocusing(true);
  };

  /**
   * This function is fired when the user leaves the TextBox control.
   * @param  {event} event The react native event.
   */
  const handleOnBlur = event => {
    if (onBlur) {
      onBlur(event);
    }
    setFocusing(false);
  };

  /**
   * This function is used to open the drop-down list to display the list of countries on the sheet.
   * It will fire when the user presses on the phone icon.
   */
  const onOpenOrCloseCountryModal = () => {
    setShowModal(!showModal);
  };

  /**
   * This function is fired when the user search on the modal.
   * @param  {any} value A country object, for example: {name: 'Vietnam (+84)', code: 'VN',...}
   */
  const onSelectCountry = value => {
    setCurrentCountry(value);
    setCountryForRefElement(value);
    changePhoneCode();
  };

  /**
   * This function is fired when the user input some text on the Textbox control.
   * @param  {string} text The name of the country or phone code, for example: vietnam or 84
   */
  const onSearch = text => {
    setSearchKeywords(text);
  };

  /*
   ** This method is used to filter data, it fires when the user searches or on the first load.
   */
  const filteredData = useMemo(() => {
    if (countries && countries.length > 0) {
      return countries?.filter(
        item =>
          item.id !== currentCountry?.id &&
          item.name
            .toLocaleLowerCase('en')
            .includes(searchKeywords.toLocaleLowerCase('en')),
      );
    }
  }, [countries, searchKeywords, currentCountry]);

  /**
   * This function is used to set the country object for the ref element.
   * @param  {country} value The country object, for example: {id: 1, name: 'The US',...}
   */
  const setCountryForRefElement = value => {
    if (refCountry) {
      refCountry.current = value;
    }
  };

  /** This function is used to render the item in the FlatList control.
   * @param  {flatListItem} data The data item is passed by the FlatList control, for example:
   * {index: 1, item:{id: 1, name: 'The UK',...}}
   */
  const renderCountryItemInFlatList = data => {
    let item = data.item;
    return (
      <TouchableOpacity
        key={`country-list-index-${data.index}`}
        onPress={() => onSelectCountry(item)}>
        <View style={styles.countryItemBox}>
          <Text style={styles.textInCountryItemBox}>{item?.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={showModal}>
        <TouchableWithoutFeedback onPress={onOpenOrCloseCountryModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalBody}>
          <View style={styles.modalBodyContent}>
            <View style={styles.headerOfModalBodyContent}>
              <View>
                <Text style={styles.textInHeaderModal}>
                  Select Country / Region
                </Text>
              </View>

              <View>
                <TouchableOpacity onPress={() => setShowModal(!showModal)}>
                  <Text style={styles.textInHeaderModal}>Leave</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.searchBoxInModal}>
              <View style={styles.searchIconBox}>
                <SearchIcon style={styles.searchIcon} />
              </View>

              <View style={styles.searchInputBoxInSearchBox}>
                <TextInput
                  onChangeText={onSearch}
                  style={styles.searchInputSearchControl}
                  placeholder="Search"
                />
              </View>
            </View>

            <View style={styles.currentSelectedBox}>
              <View>
                <Text style={styles.textInCurrentSelectedBox}>
                  {currentCountry?.name}
                </Text>
              </View>

              <View>
                <CheckIcon style={styles.checkedIcon} />
              </View>
            </View>

            <FlatList
              style={styles.countryListBox}
              data={filteredData}
              renderItem={renderCountryItemInFlatList}
              initialNumToRender={50}
              maxToRenderPerBatch={50}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.controlGroup}>
        {label && label?.length > 0 && (
          <View style={styles.labelBox}>
            <Text style={styles.label}>{label}</Text>
          </View>
        )}

        <View onLayout={onSetWidth} style={[styles.phoneInputControlBox]}>
          <TouchableOpacity
            onPress={onOpenOrCloseCountryModal}
            activeOpacity={0.5}>
            <View style={styles.phoneCodeBox}>
              <View style={styles.phoneIcon}>
                <PhoneIcon />
              </View>

              <View>
                <Text style={styles.phoneCodeText}>
                  +{currentCountry?.phonecode}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View
            style={[
              styles.phoneInputBox,
              error ? styles.inputError : focusing && styles.inputOk,
              textInputWidth > 0 && {
                width: textInputWidth,
                maxWidth: textInputWidth,
              },
            ]}>
            <TextInput
              ref={refInput}
              onBlur={handleOnBlur}
              onFocus={handleOnFocus}
              onChangeText={handleWhenTextIsChanged}
              value={value}
              style={[styles.inputControl, styles.phoneInput]}
              placeholder={placeholder ?? ''}
              keyboardType="number-pad"
              autoCapitalize={autoCapitalize}
              maxLength={maxLength}
              placeholderTextColor="#A3A4A6"
            />
          </View>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorMessage}>{error?.message}</Text>
          </View>
        )}
      </View>
    </>
  );
}
