import styles from './style';
import Cart from '../../utils/cart';
import BackButton from '../back-button';
import {
  View,
  Image,
  Text,
  AppState,
  Animated,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import {windowHeight, windowWidth} from '../../utils/dimensions';
import {useSelector, useDispatch} from 'react-redux';
import {usePromiseTracker} from 'react-promise-tracker';
import React, {useEffect, useState, useRef} from 'react';
import {LoadingGif} from '../../constants/images.constants';
import {ScreenName} from '../../constants/screen.constants';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BagIcon, HeartCartIcon} from '../../constants/icons.constants';
import {getCurrentRouteName} from '../../data-services/app-data-service';
import {getCart, setCartPosition} from '../../data-services/cart-data-service';
import {
  getCustomerInfo,
  setSession,
} from '../../data-services/session-data-service';
import customerApiService from '../../api-services/customer-api-service';
import CustomerStatus from '../../constants/customer-status.constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatabaseKeys from '../../constants/database-keys.constants';

const cartPositionY = windowHeight - 58;

/**
 * This layout will be used to define the UI for the app.
 * @property  {React.Component} children The children will be rendered and displayed on the mobile screen.
 * @property  {string} title The title will be displayed when the screen can go back, it is complementary to the back button.
 * @property  {React.Component} topRightComponent It's usually icons or whatever that you define.
 * @property  {bool} showConfirm If the value is true when the user clicks on the back button then a confirmation modal will be displayed.
 * If the user clicks the Ok button, the screen will return to the previous screen.
 */
export default function Layout({
  children,
  title,
  subTitle,
  topRightComponent,
  showConfirm,
  backgroundColor,
  backToScreen,
}) {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // The value will be changed when any API is called.
  // If the value is true, the request is being processed.
  // If the value is true, the request has been processed.
  const {promiseInProgress} = usePromiseTracker();
  const [showLoading, setShowLoading] = useState(false);
  const currentScreen = useSelector(getCurrentRouteName);
  const shoppingCart = useSelector(getCart);
  const customerInfo = useSelector(getCustomerInfo);

  const appState = useRef(AppState.currentState);

  const animation = useRef(new Animated.ValueXY()).current;
  const cartResponder = useRef(
    PanResponder.create({
      onPanResponderMove: (e, g) => {
        animation.setValue({x: g.dx, y: g.dy});
      },
      onPanResponderRelease: (e, g) => {
        if (
          g.dx > windowWidth * 0.05 &&
          g.moveY < windowHeight &&
          g.moveX < windowWidth - 100
        ) {
          let xy = {
            x: Number.parseInt(windowWidth) - 100,
            y: 0,
          };
          moveToPosition(xy);
        } else if (
          g.dx < -windowWidth * 0.05 &&
          g.moveY < windowHeight &&
          g.moveY > 0 &&
          g.moveX > 100
        ) {
          let xy = {
            x: Number.parseInt(-windowWidth) + 100,
            y: g.dy,
          };
          moveToPosition(xy);
        } else if (g.moveY < windowHeight - 50 && g.moveY > 50) {
          moveToPosition({x: 0, y: g.dy});
        } else if (g.moveY > windowHeight) {
          // Reset when Y point overflows.
          moveToPosition({x: 0, y: 0});
        } else {
          moveToPosition({x: 0, y: 0});
        }
      },
      onMoveShouldSetPanResponder: (e, gestureState) => {
        return Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1;
      },
    }),
  ).current;

  const moveToPosition = xy => {
    Animated.timing(animation, {
      toValue: xy,
      useNativeDriver: false,
    }).start(() => {
      animation.extractOffset();
    });
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (customerInfo) {
          customerApiService.getCustomerStatus().then(res => {
            if (res.isSuccess && res.status === CustomerStatus.inactive) {
              AsyncStorage.removeItem(DatabaseKeys.session).then(result => {
                dispatch(setSession(undefined));
              });
            }
          });
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // Recheck to show the loading icon for the second request.
    if (!promiseInProgress) {
      if (route.name === currentScreen) {
        setShowLoading(false);
      } else {
        setShowLoading(true);
      }
    }
  }, [promiseInProgress]);

  /** This function is used to navigate the Cart screen when the user clicks on the Cart icon.
   */
  const onClickCart = () => {
    navigation.navigate(ScreenName.cart);
  };

  /** This function is used to check to display the shopping cart on the screen.
   */
  const displayCart = () => {
    return (
      (route?.name === ScreenName.home ||
        route?.name === ScreenName.storeDetails) &&
      shoppingCart?.productDetail?.length > 0
    );
  };

  return (
    <>
      {/* The loading component is only visible the first time the user clicks to navigate to the new screen. */}
      {promiseInProgress && showLoading && (
        <View style={styles.loadingContainer}>
          <Image style={styles.loadingImg} source={LoadingGif} />
        </View>
      )}

      {/* The child components will be displayed here. */}
      <View style={[styles.container, backgroundColor && {backgroundColor}]}>
        <View style={styles.view_header}>
          <View style={styles.view_header_left}>
            {navigation?.canGoBack() && (
              <View>
                <BackButton
                  backToScreen={backToScreen}
                  showConfirm={showConfirm}
                  text={title}
                />
                {subTitle && (
                  <Text numberOfLines={1} style={styles.subTitle}>
                    {subTitle}
                  </Text>
                )}
              </View>
            )}
          </View>
          {topRightComponent && topRightComponent}
        </View>
        {children && children}
      </View>

      {displayCart() && (
        <Animated.View
          onLayout={event =>
            dispatch(
              setCartPosition({
                x: event.nativeEvent.layout.width,
                y: cartPositionY,
              }),
            )
          }
          style={[
            styles.bagContainer,
            {
              transform: [{translateX: animation.x}, {translateY: animation.y}],
            },
          ]}
          {...cartResponder.panHandlers}>
          <TouchableOpacity onPress={onClickCart}>
            <View style={styles.bagWrapperInContainer}>
              <BagIcon style={styles.bagIcon} />

              <View style={styles.heartInCartBox}>
                <Text style={styles.textHeart}>
                  {Cart.totalItemsInCart(shoppingCart)}
                </Text>

                <HeartCartIcon />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
}
