import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import productApiService from '../../api-services/product-api-service';
import ProductDetailModal from '../../components/product-detail-modal';
import DatabaseKeys from '../../constants/database-keys.constants';
import {PlusIcon, ReduceIcon} from '../../constants/icons.constants';
import {ProductDefault} from '../../constants/images.constants';
import {getCart, setCart} from '../../data-services/cart-data-service';
import Cart from '../../utils/cart';
import {formatTextNumber} from '../../utils/helpers';
import styles from './cart.style';

export default function ProductItemComponent(props) {
  const dispatch = useDispatch();
  const shoppingCart = useSelector(getCart);
  const [isShowProductModal, setIsShowProductModal] = useState(false);
  const [productDetail, setProductDetail] = useState(null);

  const {product, index, updateQuantityProductItem, currency, onReload} = props;

  const totalProductPriceItem = (product, priceValue, quantity) => {
    let toppingPrice = 0;
    if (product?.toppings?.length > 0) {
      product?.toppings
        ?.filter(topping => topping?.quantity > 0)
        .map(topping => {
          toppingPrice += topping?.quantity * topping?.price;
        });
    }

    return getPriceValue((priceValue + toppingPrice) * quantity);
  };

  const getPriceValue = priceValue => {
    let price = `${formatTextNumber(priceValue)}${currency}`;
    return price;
  };

  const getOptionName = () => {
    return (
      <View>
        {product?.options?.map(option => {
          if (option?.selected && option?.selected != option?.isSetDefault) {
            return (
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={
                    styles.textToppingOption
                  }>{`${option?.name} (${option?.optionLevelName})`}</Text>
              </View>
            );
          }
        })}
      </View>
    );
  };

  const getToppingName = () => {
    return (
      <View>
        {product?.toppings?.map(
          topping =>
            topping?.quantity > 0 && (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textToppingOption}>
                  {`${topping?.quantity} x ${topping?.name}`}
                </Text>
              </View>
            ),
        )}
      </View>
    );
  };

  const onChangeProductDetail = async () => {
    let req = {
      productId: product?.id,
      storeId: shoppingCart?.storeDetail?.storeId,
    };

    let res = await productApiService.getProductDetailByIdAsync(req);
    if (res) {
      let productPrices = res?.product?.productPrices?.map(aProductPrice => ({
        id: aProductPrice?.id,
        priceName: aProductPrice?.priceName,
        priceValue: aProductPrice?.priceValue,
        selected: aProductPrice?.id === product?.productPrice?.id,
      }));

      let newOptions = mappingDataOptions(
        product?.options,
        res?.product?.productOptions,
      );

      let productPriceSelected = productPrices?.find(
        pp => pp?.id === product?.productPrice?.id,
      );
      let productUpdate = {
        quantity: product?.quantity,
        isPromo: false,
        id: product?.id,
        isCombo: false,
        toppings: product?.toppings,
        name: res?.product?.name,
        thumbnail: res?.product?.thumbnail,
        productPrices: productPrices,
        options: newOptions,
        description: res?.product?.description,
        original: productPriceSelected?.priceValue,
        note: product?.note,
      };

      setProductDetail(productUpdate);
      setIsShowProductModal(true);
    }
  };

  const mappingDataOptions = (oldOptions, newOptions) => {
    let listOption = [];
    newOptions?.map(o => {
      let oldOption = oldOptions?.find(i => i?.id === o?.option?.id);
      let optionItem = {
        id: o?.option?.id,
        name: o?.option?.name,
        optionLevel: setOptionLevelSelected(
          oldOption?.optionLevelId,
          o?.option?.optionLevel,
        ),
      };
      listOption.push(optionItem);
    });
    return listOption;
  };

  const setOptionLevelSelected = (optionLevelId, optionLevels) => {
    let newOptions = optionLevels?.map(ol => ({
      ...ol,
      selected: optionLevelId === ol?.id,
    }));
    return newOptions;
  };

  const onUpdateProductItem = product => {
    product.isCombo = false;
    let productsAfterUpdateProductEdit = [...shoppingCart?.productDetail];
    productsAfterUpdateProductEdit.splice(index, 1, product);

    let productsNotHaveProductEdit = [...shoppingCart?.productDetail];
    productsNotHaveProductEdit.splice(index, 1);

    let updateOrderCart = {
      ...shoppingCart,
      productDetail: productsNotHaveProductEdit,
    };

    /// Handle check product after update have exist in cart
    let newCartProduct = Cart.checkExistProductItemInCart(
      product,
      updateOrderCart,
    );

    /// If: Product after update exist in cart is merge on productExist
    /// Else: Update productEdit by index
    if (
      updateOrderCart?.productDetail?.length ===
      newCartProduct?.productDetail?.length
    ) {
      updateOrderCart = newCartProduct;
    } else {
      updateOrderCart.productDetail = productsAfterUpdateProductEdit;
    }
    updateOrderCartSession(updateOrderCart);
    setIsShowProductModal(false);
    onReload(updateOrderCart?.productDetail);
  };

  const updateOrderCartSession = async cart => {
    dispatch(setCart(cart));
    await AsyncStorage.setItem(DatabaseKeys.orderCart, JSON.stringify(cart));
  };

  return (
    <>
      <View key={`cart-item-${index}`}>
        <View style={styles.viewProduct}>
          <View style={styles.viewProductItem}>
            <View style={{flex: 2}}>
              <View>
                <Text style={styles.textPriceName}>
                  {product?.productPrice?.priceName}
                </Text>
              </View>
              <View>{getOptionName()}</View>
              <View>{getToppingName()}</View>
            </View>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'flex-end',
              }}
              activeOpacity={0.7}
              onPress={onChangeProductDetail}>
              <Image
                style={styles.imageProduct}
                source={
                  product?.thumbnail
                    ? {uri: product?.thumbnail}
                    : ProductDefault
                }
              />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.viewProductPrice}>
              <Text style={styles.textPriceValue}>
                {totalProductPriceItem(
                  product,
                  product?.productPrice?.priceValue,
                  product?.quantity,
                )}
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
                  <Text style={styles.textQuantity}>{product?.quantity}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => updateQuantityProductItem(index, 1)}>
                  <PlusIcon />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {product?.note != null && product?.note?.length != 0 && (
            <View style={styles.viewNote}>
              <Text style={styles.inputNote}>{product?.note}</Text>
            </View>
          )}
        </View>
      </View>
      {isShowProductModal && (
        <ProductDetailModal
          isShowProductModal={isShowProductModal}
          editProduct={productDetail}
          currencySymbol={currency}
          AddProductItem={onUpdateProductItem}
          closeProductItemModal={() => {
            setIsShowProductModal(false), setProductDetail(null);
          }}
          isCombo={false}
        />
      )}
    </>
  );
}
