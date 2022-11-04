import styles from './styles';
import React, {useEffect, useRef, useState} from 'react';
import CloseIcon from '../../assets/icons/close.svg';
import {TextInput, View, Text, TouchableOpacity} from 'react-native';

/**
 * This component is used to build a text control that can allow the user to enter their string.
 * @property  {React.Component} leftIcon The icon will be displayed on the left of the control.
 * @property  {string} placeholder Placeholder of the text control.
 * @property  {string} label The label of the password control, it will be displayed on the top.
 * @property  {event} onChangeText The event will be used to set the value for the React Hook Form.
 * @property  {event} onBlur The event will be used to set the value for the React Hook Form.
 * @property  {string} value The string will be used to set the value for the React Hook Form.
 * @property  {object} error The error will be displayed if the input control is invalid.
 * @property  {bool} trimSpaces If the value is true, after typing it will automatically trim the space.
 * @property  {number} maxLength The total number of characters to be entered into the control.
 * @property  {string} autoCapitalize='none'|'sentences'|'words'|'characters'|undefined
 * @property  {number} height Set height of the control.
 * @property  {object} containerStyle Set style for container of the control.
 * @property  {object} inputStyle Set style for the control.
 * @property  {event} onFocus The event will be used to handle anything if the control is focused.
 */
export default function FnbTextInput({
  leftIcon,
  placeholder,
  label,
  onChangeText,
  onBlur,
  value,
  error,
  trimSpaces,
  maxLength,
  autoCapitalize = 'none' | 'sentences' | 'words' | 'characters' | undefined,
  height,
  containerStyle,
  inputStyle,
  onFocus,
  editable,
  autoFocus,
}) {
  const refInput = useRef();
  const [textInputWidth, setTextInputWidth] = useState(0);
  const [focusing, setFocusing] = useState(false);
  const [showClearIcon, setShowClearIcon] = useState(false);

  useEffect(() => {
    if (value?.length > 0) {
      setShowClearIcon(true);
    }
  }, [value]);

  /**
   * This function is used to set the width of the TextBox control.
   * On each device, the screen size is different.
   * @param  {event} event The react native event.
   */
  const onSetWidth = event => {
    let layout = event.nativeEvent.layout;
    let width = (layout.width - 64) | 0;
    setTextInputWidth(width);
  };

  /**
   * This function is used to set the data for the React Form Hook.
   * @param  {string} text The string will be passed to the value of the control.
   */
  const handleWhenTextIsChanged = text => {
    if (trimSpaces === true && text?.length > 0) {
      text = text.trim();
    }
    if (text) {
      text = text.replace('  ', '');
    }
    if (onChangeText) {
      onChangeText(text);
    }

    if (text?.length > 0) {
      setShowClearIcon(true);
    } else {
      setShowClearIcon(false);
    }
  };

  /**
   * This method is used to clear the text, it will be fired when the user clicks on the clear icon.
   */
  const clearText = () => {
    refInput.current.clear();
    handleWhenTextIsChanged('');
  };

  /**
   * This method is used to set a border width for the control when the user focuses on the TextBox control.
   */
  const handleOnFocus = () => {
    setFocusing(true);
    if (onFocus) {
      onFocus();
    }
  };

  /**
   * This method is fired when the user leaves the TextBox control.
   * @param  {event} event The react native event.
   */
  const handleOnBlur = event => {
    if (onBlur) {
      onBlur(event);
    }
    setFocusing(false);
  };

  return (
    <View style={styles.controlGroup}>
      {label && label?.length > 0 && (
        <View style={styles.labelBox}>
          <Text style={styles.label}>{label}</Text>
        </View>
      )}

      <View
        onLayout={onSetWidth}
        style={[
          styles.inputControlBox,
          error ? styles.inputError : focusing && styles.inputOk,
          height && {height},
          containerStyle && containerStyle,
        ]}>
        {leftIcon && <View style={styles.leftIconBox}>{leftIcon}</View>}

        <View>
          <TextInput
            ref={refInput}
            editable={editable}
            onBlur={handleOnBlur}
            onFocus={handleOnFocus}
            onChangeText={handleWhenTextIsChanged}
            value={value}
            style={[
              styles.inputControl,
              styles.textInputControl,
              textInputWidth && {
                width: textInputWidth,
                maxWidth: textInputWidth,
              },
              height && {height},
              inputStyle && inputStyle,
            ]}
            placeholder={placeholder ?? ''}
            autoCapitalize={autoCapitalize}
            maxLength={maxLength}
            placeholderTextColor="#A3A4A6"
            autoFocus={autoFocus}
          />
        </View>

        {showClearIcon && (
          <View style={styles.rightIconBox}>
            <TouchableOpacity onPress={clearText}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorMessage}>{error?.message}</Text>
        </View>
      )}
    </View>
  );
}
