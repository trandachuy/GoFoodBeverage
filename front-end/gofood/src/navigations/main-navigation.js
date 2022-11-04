import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useRef} from 'react';

import {useDispatch} from 'react-redux';
import {ScreenName} from '../constants/screen.constants';
import AddAddressScreen from '../containers/address/add-address/add-address.screen';
import EditAddressScreen from '../containers/address/edit-address/edit-address.screen';
import MyAddressScreen from '../containers/address/my-address/my-address.screen';
import CartScreen from '../containers/cart/cart.screen';
import CheckoutScreen from '../containers/checkout/checkout.screen';
import FavoriteStoreScreen from '../containers/favorite-stores/favorite-stores.screen';
import HomeScreen from '../containers/home/home.screen';
import LoginScreen from '../containers/login/login.screen';
import MyOrderScreen from '../containers/my-order/my-order.screen';
import NoLocationScreen from '../containers/no-location/no-location.screen';
import OrderDetailScreen from '../containers/order-detail/order-detail.screen';
import RegisterScreen from '../containers/register/register.screen';
import SearchScreen from '../containers/search/search.screen';
import ComboDetailScreen from '../containers/store-details/combo-detail/combo-detail.screen';
import StoreDetailsScreen from '../containers/store-details/store-details.screen';
import StoreInformationScreen from '../containers/store-information/store-information.screen';
import StoreScreen from '../containers/store/store.screen';
import VouchersScreen from '../containers/vouchers/vouchers.screen';
import {
  setCurrentRouteName,
  setPreviousRouteName,
} from '../data-services/app-data-service';
import {navigationRef} from '../utils/root-navigation';

const Stack = createNativeStackNavigator();

export default function MainNavigation() {
  const dispatch = useDispatch();
  const routeNameRef = useRef();

  const linking = {
    prefixes: ['gofnb://'],
    config: {
      initialRouteName: ScreenName.home,
      screens: {
        OrderDetails: {
          path: ScreenName.orderDetails,
        },
      },
    },
  };

  const listScreen = [
    {
      name: ScreenName.login,
      component: LoginScreen,
      options: {headerShown: false},
    },
    {
      name: ScreenName.register,
      component: RegisterScreen,
      options: {headerShown: false, gestureEnabled: false},
    },
    {
      name: ScreenName.home,
      component: HomeScreen,
      options: {headerShown: false},
    },
    {
      name: ScreenName.store,
      component: StoreScreen,
      options: {headerShown: false},
    },
    {
      name: ScreenName.storeDetails,
      component: StoreDetailsScreen,
      options: {headerShown: false},
    },
    {
      name: ScreenName.favoriteStore,
      component: FavoriteStoreScreen,
      options: {headerShown: false},
    },
    {
      name: ScreenName.cart,
      component: CartScreen,
      options: {headerShown: false},
    },
    {
      name: ScreenName.myAddress,
      component: MyAddressScreen,
      options: {headerShown: false},
    },
    {
      name: ScreenName.addAddress,
      component: AddAddressScreen,
      options: {headerShown: false},
    },
    {
      name: ScreenName.editAddress,
      component: EditAddressScreen,
      options: {headerShown: false},
    },
    {
      name: ScreenName.vouchers,
      component: VouchersScreen,
      options: {headerShown: false},
    },
    {
      name: ScreenName.myOrder,
      component: MyOrderScreen,
      options: {headerShown: false},
    },
    {
      name: ScreenName.checkout,
      component: CheckoutScreen,
      options: {headerShown: false},
    },
    {
      name: ScreenName.orderDetails,
      component: OrderDetailScreen,
      options: {headerShown: false},
    },
    {
      name: ScreenName.storeInformation,
      component: StoreInformationScreen,
      options: {headerShown: false},
    },
    {
      name: ScreenName.comboDetails,
      component: ComboDetailScreen,
      options: {headerShown: false},
    },
    {
      name: ScreenName.search,
      component: SearchScreen,
      options: {headerShown: false},
    },
    {
      name: ScreenName.noLocation,
      component: NoLocationScreen,
      options: {headerShown: false},
    },
  ];

  return (
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute().name;

        console.log('Navigation has been changed.', currentRouteName);

        if (previousRouteName !== currentRouteName) {
          dispatch(setPreviousRouteName(currentRouteName));
          // Change this line to use another Mobile analytics SDK.
          // For example: Analytics.setCurrentScreen(currentRouteName);
        }

        // Save the current route name for later comparison.
        routeNameRef.current = currentRouteName;
        dispatch(setCurrentRouteName(currentRouteName));
      }}>
      <Stack.Navigator
        screenOptions={{
          title: 'FnB GoFood',
          headerStyle: {shadowColor: 'black'},
        }}
        initialRouteName="Home">
        {listScreen?.map((screen, index) => (
          <Stack.Screen
            key={`navigation-screen-key-${index}`}
            name={screen?.name}
            component={screen?.component}
            options={screen?.options}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
