import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import styles from './style';

export default function LoadingComponent({className}) {
  return (
    <View style={[styles.loading, className]}>
      <ActivityIndicator size="large" color="#50429B" />
    </View>
  );
}
