import React, {useRef, useState, forwardRef, useImperativeHandle} from 'react';
import styles from '../checkout.style';
import {View, Text, TouchableOpacity, Animated} from 'react-native';
import {ArrowRightIcon} from '../../../constants/icons.constants';

const DropdownComponent = forwardRef(
  ({itemIcon, text, selectedText, children}, ref) => {
    useImperativeHandle(ref, () => ({
      hideDropdownList: () => {
        onParentPress();
      },
    }));

    const [showMore, setShowMore] = useState(false);
    const [height, setHeight] = useState(0);
    const heightRef = useRef(new Animated.Value(0)).current;

    const onParentPress = e => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (showMore) {
        onSetHeight(0, false);
      } else {
        onSetHeight(height, true);
      }
    };

    const onSetHeight = (height, status) => {
      setShowMore(status ?? false);

      setTimeout(() => {
        Animated.timing(heightRef, {
          toValue: height,
          duration: 300,
          useNativeDriver: false,
        }).start(res => {
          if (res.finished) {
            heightRef.setValue(height);
          }
        });
      }, 100);
    };

    const rotate = showMore
      ? heightRef.interpolate({
          inputRange: [0, height],
          outputRange: ['0deg', '90deg'],
        })
      : heightRef.interpolate({
          inputRange: [0, 0],
          outputRange: ['0deg', '0deg'],
        });

    return (
      <TouchableOpacity
        onPress={onParentPress}
        activeOpacity={showMore ? 1 : 0.8}>
        <View style={styles.rowItem}>
          <View style={[styles.headerInRow, styles.headerInRowNoBorder]}>
            <View style={styles.leftSectionInHeader}>
              <View style={styles.iconBoxInLeftSection}>
                {itemIcon && itemIcon}
              </View>

              <View>
                <Text style={[styles.defaultText, styles.textInSmallItem]}>
                  {text}
                </Text>
              </View>
            </View>

            <View style={styles.selectedTextBox}>
              <Text style={{marginRight: 8}}>{selectedText}</Text>
              <Animated.View style={{transform: [{rotate: rotate}]}}>
                <ArrowRightIcon />
              </Animated.View>
            </View>
          </View>

          <Animated.View
            style={[
              {
                height: heightRef,
                overflow: 'scroll',
              },
            ]}>
            <View
              onLayout={e => {
                setHeight(e.nativeEvent.layout.height);
              }}>
              {children}
            </View>
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  },
);

export default DropdownComponent;
