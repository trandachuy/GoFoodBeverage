import * as React from 'react';
import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    // Perform navigation if the react navigation is ready to handle actions
    navigationRef.navigate(name, params);
  } else {
    // You can decide what to do if react navigation is not ready
    // You can ignore this, or add these actions to a queue you can call later
  }
}

/**
 * This function is used to reset the navigation root,
 * when you call this function the root index is 0 and the back button will never show.
 * @param  {any} routes, for example: {name: 'Home',  params: {screen: 'CartTab', anyData....},}
 */
export function resetNav(routes) {
  if (navigationRef.isReady()) {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [routes],
    });
    navigationRef.dispatch(resetAction);
  }
}

/**
 * This function is used to get the current screen.
 */
export function getCurrentScreenName() {
  if (navigationRef.isReady()) {
    navigationRef.getCurrentRoute().name;
  }
}
