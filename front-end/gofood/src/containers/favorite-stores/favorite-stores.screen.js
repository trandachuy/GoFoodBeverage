import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {CheckIcon, Select} from 'native-base';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ImageBackground, RefreshControl, ScrollView, View} from 'react-native';
import {usePromiseTracker} from 'react-promise-tracker';
import {useSelector} from 'react-redux';
import favoriteStoreApiService from '../../api-services/favorite-store-api-service';
import Layout from '../../components/layout';
import {DateFormat} from '../../constants/string.constant';
import {getCurrentCustomerAddress} from '../../data-services/session-data-service';
import TextI18n from '../../i18n/text.i18n';
import {StoreEmpty} from './../../constants/images.constants';
import styles from './favorite-stores.style';
import StoreItemComponent from './store-item-conponent';

export default function FavoriteStoresScreen({route, navigation}) {
  const {t} = useTranslation();

  // This list is used to display items on the Sort control.
  const sortItems = [
    {id: '0', name: t(TextI18n.promotions)},
    {id: '1', name: t(TextI18n.nearBy)},
    // {id: '2', name: t(TextI18n.rating)},
  ];

  // This list is used to display items on the Filter control.
  const filterItems = [
    {id: '0', name: t(TextI18n.all)},
    {id: '1', name: t(TextI18n.onlyStoreWithPromotions)},
    {id: '2', name: t(TextI18n.nearestWithinKm)},
    // {id: '3', name: t(TextI18n.bestRatingsOverStar)},
  ];
  const isFocus = useIsFocused();
  const {promiseInProgress} = usePromiseTracker();
  const [sort, setSort] = useState('');
  const [filter, setFilter] = useState('0');
  const [favoriteStores, setFavoriteStores] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const currentCustomerAddress = useSelector(getCurrentCustomerAddress);

  useEffect(() => {
    getInitData(route?.params?.customerId);
  }, [isFocus]);

  const getInitData = id => {
    let currentDate = moment().format(DateFormat.START_DATE);
    let req = {
      customerId: id,
      currentDate: currentDate,
      latitude: currentCustomerAddress?.lat,
      longitude: currentCustomerAddress?.lng,
    };
    favoriteStoreApiService
      .getFavoriteStoresByCustomerIdAsync(req)
      .then(res => {
        setCustomerId(id);
        setFavoriteStores(res.favoriteStores);
      });
  };

  const onDislikeStore = storeId => {
    const newFavoriteStores = [...favoriteStores];
    let index = newFavoriteStores.findIndex(s => s.storeId === storeId);
    let storeDelete = newFavoriteStores.splice(index, 1);
    setFavoriteStores(newFavoriteStores);

    let req = {
      storeId: storeId,
      customerId: customerId,
    };
    favoriteStoreApiService
      .removeStoreLeaveFavoriteStoresAsync(req)
      .then(res => {
        if (!res) {
          setFavoriteStores(favoriteStores);
        }
      });
  };

  const favorites = useMemo(() => {
    if (favoriteStores) {
      let newStores = [...favoriteStores];
      switch (sort) {
        case '0': {
          newStores = favoriteStores.sort(
            (a, b) => a.isPromotion < b.isPromotion,
          );
          break;
        }
        case '1': {
          newStores = favoriteStores.sort((a, b) => a.distance > b.distance);
          break;
        }
        case '2': {
          // newStores = favoriteStores.sort((a, b) => a.rating < b.rating);
          break;
        }
        default:
          newStores = favoriteStores.sort((a, b) => {
            let left = `${
              (Number.isInteger(a.rating)
                ? `${a.rating}0`
                : `${a.rating}`.replace('.', '')) + (a.isPromotion ? 1 : 0)
            }`;
            let right = `${
              Number.isInteger(b.rating)
                ? `${b.rating}0`
                : `${b.rating}`.replace('.', '') + (b.isPromotion ? 1 : 0)
            }`;
            let result = parseInt(left) < parseInt(right);
            if (result) {
              if (a.distance > b.distance) {
                return true;
              }
            }

            return result;
          });
          break;
      }

      switch (filter) {
        case '1': {
          newStores = favoriteStores.filter(store => store.isPromotion);
          break;
        }
        case '2': {
          newStores = favoriteStores.filter(store => store.distance <= 2000);
          break;
        }
        case '3': {
          // newStores = favoriteStores.filter(store => store.rating >= 4.5);
          break;
        }
        default:
          break;
      }
      return newStores;
    } else {
      return [];
    }
  }, [favoriteStores, sort, filter]);

  return (
    <Layout title={t(TextI18n.myFavoriteText)} backgroundColor={'#FFFFFF'}>
      <View style={styles.container}>
        <View style={styles.viewFilterData}>
          <View style={styles.viewSort}>
            <Select
              placeholder={t(TextI18n.sortBy)}
              selectedValue={sort}
              onValueChange={setSort}
              maxHeight={'36px'}
              borderRadius={8}
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}>
              {sortItems.map((item, index) => (
                <Select.Item
                  style={styles.selectItem}
                  key={`store-sort-control-${index}-${item.id}`}
                  label={item.name}
                  value={`${item.id}`}
                />
              ))}
            </Select>
          </View>
          <View style={styles.viewFilter}>
            <Select
              selectedValue={filter}
              onValueChange={setFilter}
              maxHeight={'36px'}
              borderRadius={8}
              placeholder="Filter by all"
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}>
              {filterItems.map((item, index) => (
                <Select.Item
                  style={styles.selectItem}
                  key={`store-filter-control-${index}-${item.id}`}
                  label={item.name}
                  value={`${item.id}`}
                />
              ))}
            </Select>
          </View>
        </View>
        {favorites?.length > 0 ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={promiseInProgress}
                onRefresh={getInitData}
              />
            }
            showsVerticalScrollIndicator={false}
            style={{marginTop: 20}}>
            {favorites?.map(favoriteStore => {
              return (
                <StoreItemComponent
                  key={favoriteStore.storeId}
                  favoriteStore={favoriteStore}
                  deleteItem={storeId => onDislikeStore(storeId)}
                />
              );
            })}
          </ScrollView>
        ) : (
          <ImageBackground
            source={StoreEmpty}
            style={{
              width: '100%',
              flex: 1,
            }}
          />
        )}
      </View>
    </Layout>
  );
}
