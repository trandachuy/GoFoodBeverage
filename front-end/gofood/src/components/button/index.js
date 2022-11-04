import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './styles';
export default function Button({
  style,
  text,
  textStyle,
  onPress,
  activeOpacity,
  disabled,
  disabledStyle,
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={activeOpacity}
      onPress={onPress}>
      <View
        style={[
          styles.container,
          style && style,
          disabled && disabledStyle && disabledStyle,
        ]}>
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}
