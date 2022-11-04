import styles from './styles';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput, View, Text, TouchableOpacity} from 'react-native';
import {EyeIcon, EyeLockIcon} from '../../constants/icons.constants';

/**
 * This component is used to build a text control that can allow the user to enter their password.
 * @property  {React.Component} leftIcon The icon will be displayed on the left of the control.
 * @property  {string} placeholder Placeholder of the password control.
 * @property  {string} label The label of the password control, it will be displayed on the top.
 * @property  {event} onChangeText The event will be used to set the value for the React Hook Form.
 * @property  {event} onBlur The event will be used to set the value for the React Hook Form.
 * @property  {string} value The string will be used to set the value for the React Hook Form.
 * @property  {object} error The error will be displayed if the input control is invalid.
 * @property  {number} maxLength The total number of characters to be entered into the control.
 * @property  {string} autoCapitalize='none'|'sentences'|'words'|'characters'|undefined
 */
export default function FnbPasswordInput({
  leftIcon,
  placeholder,
  label,
  onChangeText,
  onBlur,
  value,
  error,
  maxLength,
  autoCapitalize = 'none' | 'sentences' | 'words' | 'characters' | undefined,
}) {
  const {t} = useTranslation();
  const [focusing, setFocusing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordControl, setShowPasswordControl] = useState(false);

  /**
   * This method is used to set a border width for the control when the user focuses on the TextBox control.
   */
  const handleOnFocus = () => {
    setFocusing(true);
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

  /**
   * This function is used to set the data for the React Form Hook.
   * @param  {string} text The string will be passed to the value of the control.
   */
  const handleWhenTextIsChanged = text => {
    if (text) {
      text = text.replace('  ', '');
    }
    if (onChangeText) {
      onChangeText(text);
    }

    if (text && text?.length > 0) {
      setShowPasswordControl(true);
    } else {
      setShowPasswordControl(false);
    }
  };

  return (
    <View>
      {label && label?.length > 0 && (
        <View style={styles.labelBox}>
          <Text style={styles.label}>{label}</Text>
        </View>
      )}

      <View
        style={[
          styles.inputControlBox,
          error ? styles.inputError : focusing && styles.inputOk,
        ]}>
        {leftIcon && <View style={styles.leftIconBox}>{leftIcon}</View>}

        <View style={styles.passwordBox}>
          <TextInput
            onChangeText={handleWhenTextIsChanged}
            onBlur={handleOnBlur}
            onFocus={handleOnFocus}
            value={value}
            secureTextEntry={!showPassword}
            style={[styles.inputControl, styles.passwordInputControl]}
            placeholder={placeholder ?? ''}
            autoCapitalize={'none'}
            maxLength={maxLength}
            placeholderTextColor="#A3A4A6"
            numberOfLines={1}
          />
        </View>

        {showPasswordControl && (
          <View style={styles.rightIconBox}>
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeLockIcon /> : <EyeIcon />}
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
