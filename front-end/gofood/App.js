import _ from 'lodash';
import {Provider} from 'react-redux';
import React, {useEffect} from 'react';
import i18n from './src/configs/i18n-config';
import {I18nextProvider} from 'react-i18next';
import {NativeBaseProvider} from 'native-base';
import {store} from './src/configs/store-config';
import SplashScreen from 'react-native-splash-screen';
import MainNavigation from './src/navigations/main-navigation';

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <I18nextProvider i18n={i18n}>
          <MainNavigation />
        </I18nextProvider>
      </NativeBaseProvider>
    </Provider>
  );
}
