import moment from 'moment';
import {CheckIcon, Select} from 'native-base';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, RefreshControl, View} from 'react-native';
import {usePromiseTracker} from 'react-promise-tracker';
import {useSelector} from 'react-redux';
import storeApiService from '../../api-services/store-api-service';
import Layout from '../../components/layout';
import StoreCart from '../../components/store-card';
import {getCurrentCustomerAddress} from '../../data-services/session-data-service';
import TextI18n from '../../i18n/text.i18n';
import styles from './store.style';

export default function StoreScreen({route}) {
  const {t} = useTranslation();
  const currentCustomerAddress = useSelector(getCurrentCustomerAddress);
  // This list is used to display items on the Sort control.
  const sortItems = [
    {id: '0', name: t(TextI18n.promotions)},
    {id: '1', name: t(TextI18n.nearBy)},
    // {id: '2', name: t(TextI18n.rating)},
  ];

  // This list is used to display items on the Filter control.
  const filterItems = [
    {id: '0', name: t(TextI18n.filterByAll)},
    {id: '1', name: t(TextI18n.onlyStoreWithPromotions)},
    {id: '2', name: t(TextI18n.nearestWithinKm)},
    // {id: '3', name: t(TextI18n.bestRatingsOverStar)},
  ];

  // The value will be changed when any API is called.
  // If the value is true, the request is being processed.
  // If the value is true, the request has been processed.
  const {promiseInProgress} = usePromiseTracker();

  const [sort, setSort] = useState('');
  const [filter, setFilter] = useState('0');
  const [storeList, setStoreList] = useState([]);
  const [title, setTitle] = useState(t(TextI18n.recommendStores));

  // This hook will be called the first time.
  useEffect(() => {
    reloadData();
  }, []);

  const stores = useMemo(() => {
    if (storeList) {
      let newStores = [...storeList];
      switch (sort) {
        case '0': {
          let storesByPromotion = storeList
            .filter(s => s.isPromotion)
            .sort((a, b) => a.distance > b.distance);

          let storesByDistance = storeList
            .filter(s => !s.isPromotion)
            .sort((a, b) => a.distance > b.distance);

          newStores = storesByPromotion.concat(storesByDistance);
          break;
        }
        case '1': {
          newStores = storeList.sort((a, b) => a.distance > b.distance);
          break;
        }
        case '2': {
          // newStores = storeList.sort((a, b) => a.rating < b.rating);
          break;
        }
        default:
          break;
      }

      switch (filter) {
        case '1': {
          newStores = storeList.filter(store => store.isPromotion);
          break;
        }
        case '2': {
          newStores = storeList.filter(store => store.distance <= 2000);
          break;
        }
        case '3': {
          // newStores = storeList.filter(store => store.rating >= 4.5);
          break;
        }
        default:
          break;
      }
      return newStores;
    } else {
      return [];
    }
  }, [storeList, sort, filter]);

  /**
   * This function is used to load the data for the first time or when the user pulls down to refresh the list.
   */
  const reloadData = async () => {
    let currentDate = moment().format('yyyy-MM-DD 00:00:00');
    let req = {
      currentDate: currentDate,
      latitude: currentCustomerAddress?.lat,
      longitude: currentCustomerAddress?.lng,
      storeType: ''
    };

    if (route?.params) {
      const { storeType } = route?.params;
      if (storeType) {
        req.storeType = storeType.key;
        setTitle(t(storeType.name));
      }
    }

    // callback the APIs
    let resultFromApi = await storeApiService.getStoresByAddressAsync(req);
    setStoreList(resultFromApi?.stores);
  };

  /**
   * This function is used to render the store item, it will be called by the FlatList control.
   * @param  {any} anItem This variable will contain the index and data, for example: {index: 1, item:{...}}
   */
  const renderStoreItem = anItem => {
    return (
      <StoreCart key={`sort-cart-index-${anItem.index}`} storeItem={anItem} />
    );
  };

  return (
    <Layout title={title}>
      <View style={styles.searchBox}>
        <View style={styles.sortWrapper}>
          <Select
            placeholder={t(TextI18n.sortBy)}
            selectedValue={sort}
            onValueChange={setSort}
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size="5" />,
            }}
            borderRadius={8}
            height={'36px'}>
            {sortItems.map((item, index) => (
              <Select.Item
                key={`store-sort-control-${index}-${item.id}`}
                label={item.name}
                value={`${item.id}`}
              />
            ))}
          </Select>
        </View>

        <View style={styles.filterWrapper}>
          <Select
            placeholder={t(TextI18n.filterByAll)}
            selectedValue={filter}
            onValueChange={setFilter}
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size="5" />,
            }}
            borderRadius={8}
            height={'36px'}>
            {filterItems.map((item, index) => (
              <Select.Item
                key={`store-filter-control-${index}-${item.id}`}
                label={item.name}
                value={`${item.id}`}
              />
            ))}
          </Select>
        </View>
      </View>

      <View style={styles.cardWrapper}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={promiseInProgress}
              onRefresh={reloadData}
            />
          }
          keyExtractor={(item, index) => `store-cart-${index}`}
          showsVerticalScrollIndicator={false}
          data={stores}
          renderItem={renderStoreItem}
        />
      </View>
    </Layout>
  );
}
