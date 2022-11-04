import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import productApiService from '../../api-services/product-api-service';
import {PlusIcon, ReduceIcon} from '../../constants/icons.constants';
import {ProductDefault} from '../../constants/images.constants';
import {ScreenName} from '../../constants/screen.constants';
import {getCart} from '../../data-services/cart-data-service';
import {formatTextNumber} from '../../utils/helpers';
import ProductInfo from '../../utils/product-info';
import styles from './cart.style';

export default function ComboItemComponent(props) {
  const navigation = useNavigation();
  const shoppingCart = useSelector(getCart);
  const {combo, index, updateQuantityProductItem, currency} = props;

  const totalProductPriceItem = (combo, priceValue) => {
    let toppingPrice = 0;
    if (combo?.products?.length > 0) {
      combo?.products?.map(product => {
        if (product?.toppings?.length > 0) {
          toppingPrice += product?.toppings
            ?.map(t => t?.quantity * t?.price)
            ?.reduce((a, b) => a + b, 0);
        }
      });
    }
    return getPriceValue(combo?.quantity * (priceValue + toppingPrice));
  };

  const getPriceValue = priceValue => {
    let price = `${formatTextNumber(priceValue)}${currency}`;
    return price;
  };

  const getOptionToppingName = () => {
    let products = [];
    combo?.products?.map(product => {
      let options = product?.options?.filter(
        item => item?.selected && item?.selected != item?.isSetDefault,
      );
      let toppings = product?.toppings?.filter(item => item?.quantity > 0);

      let productName = product?.name;
      if (
        product?.productPrices?.length > 0 &&
        product?.productPrices[0]?.priceName
      ) {
        productName = `${productName} (${product?.productPrices[0]?.priceName})`;
      }

      let renderProduct = {
        name: productName,
        note: product?.note,
        options: options,
        toppings: toppings,
      };
      products.push(renderProduct);
    });

    return products?.map(product => (
      <>
        {(product?.options?.length > 0 ||
          product?.toppings?.length > 0 ||
          product?.note) && (
          <>
            <Text style={styles.textProductName}>
              1x {product?.name}{' '}
              {product?.options?.length > 0 && (
                <Text style={styles.textToppingName}>
                  {` - `}
                  {product?.options
                    ?.map(item => item?.optionLevelName)
                    ?.join(', ')}
                </Text>
              )}
            </Text>
            {product?.toppings?.map(topping => (
              <Text style={styles.textToppingName}>
                x{topping?.quantity} {topping?.name}
              </Text>
            ))}
            {product?.note && (
              <Text style={styles.textProductNote}>*{product?.note}</Text>
            )}
          </>
        )}
      </>
    ));
  };

  const onClickComboItem = async () => {
    let product = {
      thumbnail: combo?.thumbnail,
      quantity: combo?.quantity,
      isComboPricing: combo?.isComboPricing,
      priceAfterDiscount: combo?.priceAfterDiscount,
      original: combo?.original,
      note: combo?.note,
      name: combo?.name,
    };
    let req = {
      storeId: shoppingCart?.storeDetail?.storeId,
      comboId: combo?.comboId,
      isComboPricing: combo?.isComboPricing,
      comboPricingId: combo?.isComboPricing ? combo?.comboPricingId : '',
    };
    let res = await productApiService.getComboProductByComboIdAsync(req);

    if (combo?.isComboPricing) {
      product.comboPricingId = combo?.comboPricingId;
      product.comboPricingProducts = ProductInfo.mappingProducts(
        res?.comboPricing?.comboPricingProducts,
        combo?.products,
        combo?.isComboPricing,
      );
    } else {
      product.comboProductPriceId = combo?.comboId;
      product.comboPricingProducts = ProductInfo.mappingProducts(
        res?.comboProductPrices,
        combo?.products,
        combo?.isComboPricing,
      );
    }
    let paramsData = {
      storeId: shoppingCart?.storeDetail?.storeId,
      storeName: shoppingCart?.storeDetail?.storeName,
      branchId: shoppingCart?.storeDetail?.branchId,
      currencySymbol: currency,
      comboId: combo?.comboId,
      comboDetail: product,
      isEdit: true,
      indexCombo: index,
    };
    navigation.navigate(ScreenName.comboDetails, {paramsData});
  };

  return (
    <View key={`cart-item-${index}`}>
      <View style={styles.viewProduct}>
        <View style={styles.viewProductItem}>
          <View style={{flex: 3}}>
            <View>
              <Text style={styles.textPriceName}>{combo?.name}</Text>
            </View>
            <View>{getOptionToppingName()}</View>
          </View>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'flex-end',
            }}
            activeOpacity={0.8}
            onPress={onClickComboItem}>
            <Image
              style={styles.imageProduct}
              source={
                combo?.thumbnail ? {uri: combo?.thumbnail} : ProductDefault
              }
            />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.viewProductPrice}>
            <Text style={styles.textPriceValue}>
              {totalProductPriceItem(combo, combo?.priceAfterDiscount)}
            </Text>
            <Text style={styles.textPriceDiscount}>
              {totalProductPriceItem(combo, combo?.original)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
            }}>
            <View style={styles.viewUpdateQuantity}>
              <TouchableOpacity
                onPress={() => updateQuantityProductItem(index, -1)}>
                <ReduceIcon />
              </TouchableOpacity>
              <View style={styles.viewQuantity}>
                <Text style={styles.textQuantity}>{combo?.quantity}</Text>
              </View>

              <TouchableOpacity
                onPress={() => updateQuantityProductItem(index, 1)}>
                <PlusIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {combo?.note != null && combo?.note?.length != 0 && (
          <View style={styles.viewNote}>
            <Text style={styles.inputNote}>{combo?.note}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
