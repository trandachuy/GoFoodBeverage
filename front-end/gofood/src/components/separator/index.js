import React from 'react';
import {View} from 'react-native';
import styles from './styles';
export default function Separator({borderStyle, color, style}) {
  return (
    <View style={[styles.container, style && style]}>
      <View
        style={[
          styles.borderContainer,
          {
            borderStyle: borderStyle ?? 'solid',
            borderColor: color ?? '#000000',
          },
        ]}></View>
    </View>
  );
}
