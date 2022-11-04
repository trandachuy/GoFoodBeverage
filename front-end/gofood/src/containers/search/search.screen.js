import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import storeApiService from '../../api-services/store-api-service';
import FnbTextInput from '../../components/input-controls/text-input';
import Layout from '../../components/layout';
import {SearchIcon, CloseIconNoOutline} from '../../constants/icons.constants';
import {ScreenName} from '../../constants/screen.constants';
import {getCurrentCustomerAddress} from '../../data-services/session-data-service';
import TextI18n from '../../i18n/text.i18n';
import ButtonI18n from '../../i18n/button.i18n';
import SearchIResultItem from './components/SearchIResultItem';
import styles from './search.style';
import {usePromiseTracker} from 'react-promise-tracker';
import {getCurrentRouteName} from '../../data-services/app-data-service';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatabaseKeys from '../../constants/database-keys.constants';
import {getCustomerInfo} from '../../data-services/session-data-service';

const MAX_SEARCH_HISTORY_ITEM = 10;

export default function SearchScreen() {
  const {t} = useTranslation();
  const currentCustomerAddress = useSelector(getCurrentCustomerAddress);
  const customerInfo = useSelector(getCustomerInfo);
  const [result, setResult] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [searchHistoryList, setSearchHistoryList] = useState([]);
  const {promiseInProgress} = usePromiseTracker();
  const currentScreen = useSelector(getCurrentRouteName);
  const route = useRoute();

  const pageData = {
    recommendKeySearch: TextI18n.recommendSearch.map(item => t(item)),
  };

  useEffect(() => {
    getSearchHistoryListFromStorage();
  }, []);

  useEffect(() => {
    //check promise in current screen
    if (route.name === currentScreen) {
      if (!promiseInProgress) {
        setShowLoading(false);
      } else {
        setShowLoading(true);
      }
    }
  }, [promiseInProgress]);

  const {
    control,
    setValue,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {
      searchInput: '',
    },
  });

  //#region Events

  const getSearchHistoryListFromStorage = async () => {
    const searchHistories = await AsyncStorage.getItem(
      DatabaseKeys.searchHistory,
    );
    let searchHistoriesJson = JSON.parse(searchHistories);
    setSearchHistoryList([...searchHistoriesJson]);
  };

  // Handle user click button Search
  const onSearch = async existKeySearch => {
    let keySearch = null;
    if (existKeySearch) {
      keySearch = existKeySearch;
      setValue('searchInput', keySearch);
    } else {
      const data = getValues();
      keySearch = data?.searchInput?.trim();
    }

    if (keySearch?.length > 0) {
      // Save search history to LocalStorage
      let currentSearchHistoryList = searchHistoryList;
      const indexKeySearch = currentSearchHistoryList.indexOf(keySearch);
      if (indexKeySearch >= 0) {
        currentSearchHistoryList.splice(indexKeySearch, 1);
      }
      currentSearchHistoryList.unshift(keySearch);
      updateSearchHistoryListToStorage(currentSearchHistoryList);

      var payload = {
        lat: currentCustomerAddress?.lat,
        lng: currentCustomerAddress?.lng,
        keySearch: keySearch,
        accountId: customerInfo?.id,
      };
      let res = await storeApiService.searchProductByNameOrStoreNameRequest(
        payload,
      );
      if (res) {
        if (res?.searchItemResults?.length > 0) {
          setResult(res?.searchItemResults);
        } else {
          setResult([]);
        }
        setShowSearchResult(true);
      }
    } else {
      setShowSearchResult(false);
    }
  };

  // Handle user click button X on search input
  const onClearText = value => {
    if (value?.length === 0) {
      setShowSearchResult(false);
    }
  };

  // Handle click 'X' button on history search items
  const onClickDeleteHistorySearchItem = async index => {
    let currentSearchHistoryList = searchHistoryList;
    currentSearchHistoryList.splice(index, 1);
    setSearchHistoryList([...currentSearchHistoryList]);
    updateSearchHistoryListToStorage(currentSearchHistoryList);
  };

  const onClearSearchHistoryList = () => {
    setSearchHistoryList([]);
    setSearchHistoryListToStorage();
  };

  const updateSearchHistoryListToStorage = searchHistories => {
    if (searchHistories?.length > MAX_SEARCH_HISTORY_ITEM) {
      searchHistories = searchHistories.pop();
    }
    let searchHistoryListString = JSON.stringify(searchHistories);
    setSearchHistoryListToStorage(searchHistoryListString);
  };

  const setSearchHistoryListToStorage = async (keySearch = '') => {
    await AsyncStorage.setItem(DatabaseKeys.searchHistory, keySearch);
  };

  //#endregion

  //#region Components

  //Header: Search input
  const searchInputComponent = () => {
    return (
      <View style={styles.rowSearch}>
        <Controller
          control={control}
          name="searchInput"
          render={({field: {onChange, onBlur, value}}) => (
            <FnbTextInput
              onChangeText={value => {
                onChange(value), onClearText(value);
              }}
              value={value}
              leftIcon={<SearchIcon />}
              placeholder={t(TextI18n.placeSearchProductOrStoreName)}
              autoCapitalize="none"
              containerStyle={[styles.inputSearchContainer]}
              inputStyle={[styles.inputSearchStyle]}
              autoFocus={true}
              onBlur={e => {
                if (e.currentTarget === e.target) {
                  onSearch();
                }
              }}
            />
          )}
        />
      </View>
    );
  };

  //Body: Search result
  const searchResultComponent = () => {
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        {result?.length == 0 ? null : (
          <View>
            <ScrollView
              style={styles.searchResult}
              showsVerticalScrollIndicator={false}>
              {result?.map(store => {
                return <SearchIResultItem data={store} key={store.id} />;
              })}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  //History, Recommend
  const defaultSearchPageComponent = () => {
    return (
      <View style={styles.defaultSearchContainer}>
        <KeyboardAvoidingView>
          <ScrollView showsVerticalScrollIndicator={false}>
            {showSearchResult == true && result?.length === 0 ? (
              <Text style={styles.noStoreFoundText}>
                {t(TextI18n.noStoreFound)}
              </Text>
            ) : null}

            {/* History */}
            <View style={styles.historyContainer}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyHeader_Title}>
                  {t(TextI18n.historySearch)}
                </Text>
                {searchHistoryList?.length > 0 && (
                  <TouchableOpacity onPress={onClearSearchHistoryList}>
                    <Text style={styles.clearAllButton}>
                      {t(ButtonI18n.clearSearchHistory)}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.historyBody}>
                {searchHistoryList?.length > 0 ? (
                  searchHistoryList?.map((item, index) => {
                    return (
                      <TouchableOpacity
                        style={styles.keySearchItem}
                        onPress={() => onSearch(item)}>
                        <Text style={styles.keySearchItem_Text}>{item}</Text>
                        <TouchableOpacity
                          onPress={() => onClickDeleteHistorySearchItem(index)}
                          style={styles.keySearchItem_DeleteButton}>
                          <CloseIconNoOutline />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <Text>{t(TextI18n.noSearchHistory)}</Text>
                )}
              </View>
            </View>

            {/* Recommend */}
            <View style={styles.recommendContainer}>
              <Text style={styles.recommendHeader}>
                {t(TextI18n.isThereAnythingHot)}
              </Text>
              <View style={styles.recommendBody}>
                {pageData.recommendKeySearch?.map(item => {
                  return (
                    <TouchableOpacity
                      style={styles.keySearchItem}
                      onPress={() => onSearch(item)}>
                      <Text style={styles.keySearchItem_Text}>{item}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  };
  //#endregion

  return (
    <Layout
      backgroundColor="#F5F5F5"
      topRightComponent={searchInputComponent()}
      backToScreen={ScreenName.home}>
      <View style={styles.container}>
        {showSearchResult && result?.length > 0
          ? searchResultComponent()
          : defaultSearchPageComponent()}
      </View>
      {showLoading && (
        <View style={styles.loadingData} h>
          <ActivityIndicator size="large" color="#50429B" />
        </View>
      )}
    </Layout>
  );
}
