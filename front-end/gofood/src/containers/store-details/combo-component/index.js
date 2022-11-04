import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ProductDefault} from '../../../constants/images.constants';
import {ScreenName} from '../../../constants/screen.constants';
import ButtonI18n from '../../../i18n/button.i18n';
import {formatTextNumber} from '../../../utils/helpers';
import styles from './style';

export default function ComboComponent(props) {
  const navigation = useNavigation();
  const {
    combos,
    currencySymbol,
    addFastProductItem,
    storeId,
    storeName,
    branchId,
  } = props;
  const {t} = useTranslation();

  const getPriceValue = priceValue => {
    let price = formatTextNumber(priceValue) + currencySymbol;
    return price;
  };

  const onClickComboDetail = (comboId, comboDetail, thumbnail) => {
    let updateComboDetail = comboDetail;
    updateComboDetail.thumbnail = thumbnail;
    let newComboPricingProducts = [];
    if (comboDetail?.isComboPricing) {
      newComboPricingProducts = setDefaultOptionAndToppingOfProduct(
        updateComboDetail?.comboPricingProducts,
      );
    } else {
      newComboPricingProducts = setDefaultOptionAndToppingOfProduct(
        updateComboDetail?.comboProductPrices,
      );
    }
    updateComboDetail.comboPricingProducts = newComboPricingProducts;
    updateComboDetail.quantity = 1;
    let paramsData = {
      storeId,
      storeName,
      branchId,
      currencySymbol,
      comboId,
      comboDetail: updateComboDetail,
      isEdit: false,
    };
    navigation.navigate(ScreenName.comboDetails, {paramsData});
  };

  const setDefaultOptionAndToppingOfProduct = comboPricingProducts => {
    let defaultOptionsToppings = [];
    comboPricingProducts?.map(cpp => {
      let optionAndToppingItem = {...cpp};
      let options = [];
      cpp.options.map(o => {
        let option = {...o};
        let ols = [];
        o?.optionLevel.map(ol => {
          let olItem = {...ol};
          olItem.selected = olItem.isSetDefault;
          ols.push(olItem);
        });
        option.optionLevel = ols;
        options.push(option);
      });
      if (cpp.toppings?.length > 0) {
        let toppings = [];
        cpp.toppings.map(t => {
          let topping = {...t};
          topping.quantity = 0;
          toppings.push(topping);
        });
        optionAndToppingItem.toppings = toppings;
      }
      optionAndToppingItem.options = options;
      defaultOptionsToppings.push(optionAndToppingItem);
    });
    return defaultOptionsToppings;
  };

  const onClickAddFastProductItem = (product, comboId, thumbnail) => {
    product.quantity = 1;
    product.thumbnail = thumbnail;

    let newComboPricingProducts = [];
    if (product?.isComboPricing) {
      newComboPricingProducts = setDefaultOptionAndToppingOfProduct(
        product?.comboPricingProducts,
      );
    } else {
      newComboPricingProducts = setDefaultOptionAndToppingOfProduct(
        product?.comboProductPrices,
      );
    }
    product.comboPricingProducts = newComboPricingProducts;
    addFastProductItem(product, comboId);
  };

  return (
    <>
      {combos?.map((item, index) => (
        <>
          {item?.products?.length > 0 && (
            <View key={`store-details-product-list-${index}`}>
              <Text style={styles.comboName}>{item?.name}</Text>
              {item?.products?.map((product, i) => (
                <View
                  style={styles.productItem}
                  key={`store-details-product-list-${index}-item-${i}`}>
                  <TouchableOpacity
                    onPress={() =>
                      onClickComboDetail(item?.id, product, item?.thumbnail)
                    }
                    activeOpacity={0.8}
                    style={styles.viewLeft}>
                    <View style={styles.viewProduct}>
                      <View style={styles.viewProductName}>
                        <Text style={styles.productName} numberOfLines={1}>
                          {product?.name}
                        </Text>
                        <Text
                          style={[
                            styles.productName,
                            styles.descriptionProduct,
                          ]}>
                          {product?.description}
                        </Text>
                      </View>
                      {product?.isPromo && (
                        <View style={styles.productPromo}>
                          <Text style={styles.textPromo}>{product?.promo}</Text>
                        </View>
                      )}
                    </View>
                    {product?.isComboPricing && (
                      <>
                        {product?.comboPricingProducts?.map(cpp => (
                          <Text style={styles.textComboProduct}>
                            1x {cpp?.name}
                          </Text>
                        ))}
                      </>
                    )}

                    <View style={styles.viewProductDiscount}>
                      <View style={styles.viewDetailDiscount}>
                        <Text style={styles.productDiscount}>
                          {product?.isPromo
                            ? getPriceValue(product?.priceAfterDiscount)
                            : getPriceValue(product?.original)}
                        </Text>
                        {product?.isPromo && (
                          <Text style={styles.productOriginal}>
                            {getPriceValue(product?.original)}
                          </Text>
                        )}
                      </View>
                      {product?.quantities > 0 && (
                        <View style={styles.quantityProduct}>
                          <Text style={styles.textQuantityProduct}>
                            x {product?.quantities}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View style={styles.viewBtn}>
                    <View style={styles.viewThumbnail}>
                      <Image
                        style={styles.thumbnail}
                        source={
                          item?.thumbnail
                            ? {uri: item?.thumbnail}
                            : ProductDefault
                        }
                      />
                    </View>
                    <View style={styles.viewBtnAdd}>
                      <TouchableOpacity
                        onPress={() =>
                          onClickAddFastProductItem(
                            product,
                            item?.id,
                            item?.thumbnail,
                          )
                        }>
                        <View style={styles.viewAdd}>
                          <Text style={styles.textAdd}>
                            {t(ButtonI18n.add)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      ))}
    </>
  );
}
