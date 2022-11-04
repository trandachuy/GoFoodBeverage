import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore} from '@reduxjs/toolkit';
import customerApiService from '../api-services/customer-api-service';
import CustomerStatus from '../constants/customer-status.constant';
import DatabaseKeys from '../constants/database-keys.constants';
import appReducer from '../data-services/app-data-service';
import cartReducer, {setCart} from '../data-services/cart-data-service';
import sessionReducer, {
  setCurrentCustomerAddress,
  setSession,
} from '../data-services/session-data-service';
import {getCurrentLocationByGps} from '../utils/google';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    app: appReducer,
    cart: cartReducer,
  },
});

/** This function is used to load data for the first load on each open app.
 */
const reloadData = () => {
  return async (dispatch, getState) => {
    let stringOfSession = await AsyncStorage.getItem(DatabaseKeys.session);
    if (stringOfSession && stringOfSession?.length > 0) {
      let session = JSON.parse(stringOfSession);
      dispatch(setSession(session));

      let result = await customerApiService.getCustomerStatus();
      if (result.isSuccess && result.status === CustomerStatus.inactive) {
        AsyncStorage.removeItem(DatabaseKeys.session).then(result => {
          dispatch(setSession(undefined));
        });
      }
    }

    let stringOfOrder = await AsyncStorage.getItem(DatabaseKeys.orderCart);
    let orderCart = JSON.parse(stringOfOrder);
    if (orderCart) {
      dispatch(setCart(orderCart));
    }

    try {
      let stringOfAddressInfo = await AsyncStorage.getItem(
        DatabaseKeys.currentCustomerAddress,
      );

      let addressInfo = null;
      if (stringOfAddressInfo == null) {
        addressInfo = await getCurrentLocationByGps();
        let jsonString = JSON.stringify(addressInfo);
        await AsyncStorage.setItem(
          DatabaseKeys.currentCustomerAddress,
          jsonString,
        );
      } else {
        addressInfo = JSON.parse(stringOfAddressInfo);
      }
      dispatch(setCurrentCustomerAddress(addressInfo));
    } catch (e) {
      console.log(e);
    }
  };
};

store.dispatch(reloadData());
