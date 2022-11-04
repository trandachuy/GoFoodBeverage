import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ConfirmationModal from '../../../components/confirmation-modal';
import Layout from '../../../components/layout';
import ProductDetailModal from '../../../components/product-detail-modal/index';
import DatabaseKeys from '../../../constants/database-keys.constants';
import {
  ArrowRightIcon,
  PlusIcon,
  ReduceIcon,
  SubtractIcon,
} from '../../../constants/icons.constants';
import {ComboIcon, ProductDefault} from '../../../constants/images.constants';
import {getCart, setCart} from '../../../data-services/cart-data-service';
import TextI18n from '../../../i18n/text.i18n';
import Cart from '../../../utils/cart';
import {formatTextNumber} from '../../../utils/helpers';
import styles from './combo-detail.style';

export default function ComboDetailScreen({route, navigation}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const shoppingCart = useSelector(getCart);
  const [isShowProductModal, setIsShowProductModal] = useState(false);
  const [comboDetail, setComboDetail] = useState({});
  const [productDetail, setProductDetail] = useState({});
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [totalProductPrice, setTotalProductPrice] = useState(null);
  const [noteComboDetail, setNoteComboDetail] = useState('');
  const [isShowConfirmationModal, setIsShowConfirmationModal] = useState(false);
  const [newCartInfo, setNewCartInfo] = useState({});
  const [indexProductSelected, setIndexProductSelected] = useState(-1);

  const pageData = {
    maxLengthNote: 200,
  };

  useEffect(() => {
    const {comboDetail, comboId, currencySymbol} = route?.params?.paramsData;
    getInitDataComboDetail(comboDetail, comboId, currencySymbol);
  }, []);

  const getInitDataComboDetail = (data, comboId, currencySymbol) => {
    setCurrencySymbol(currencySymbol);
    let products = data?.comboPricingProducts;

    let comboDetail = {
      isCombo: true,
      comboId: comboId,
      name: data?.name,
      isComboPricing: data?.isComboPricing,
      comboPricingId: data?.comboPricingId,
      comboProductPriceId: data?.comboProductPriceId,
      original: data?.original,
      priceAfterDiscount: data?.priceAfterDiscount,
      quantity: data?.quantity,
      thumbnail: data?.thumbnail,
      products: products,
      note: data?.note,
    };
    setComboDetail(comboDetail);
    getTotalProductPrice(comboDetail, currencySymbol);
  };

  /** Get product item to show in productDetail modal
   * Handle set option for product.
   */
  const onClickProductItem = product => {
    let productDetail = {
      ...product,
    };
    setProductDetail(productDetail);
    setIsShowProductModal(true);
  };

  const getTotalProductPrice = (comboDetail, currencySymbol) => {
    let priceValue = comboDetail?.priceAfterDiscount * comboDetail?.quantity;
    if (comboDetail?.products?.length > 0) {
      comboDetail?.products?.map(product => {
        if (product?.toppings?.length > 0) {
          priceValue +=
            comboDetail?.quantity *
            product?.toppings?.reduce(
              (total, pt) => (total = total + pt.price * pt?.quantity),
              0,
            );
        }
      });
    }
    let total = `${formatTextNumber(priceValue)}${currencySymbol}`;
    setTotalProductPrice(total);
  };

  const showProductDetailModal = () => {
    return (
      <>
        {isShowProductModal && (
          <ProductDetailModal
            isCombo={true}
            isShowProductModal={isShowProductModal}
            closeProductItemModal={() => setIsShowProductModal(false)}
            editProduct={productDetail}
            AddProductItem={AddProductItem}
            currencySymbol={currencySymbol}
          />
        )}
      </>
    );
  };

  const AddProductItem = product => {
    let newProducts = comboDetail?.products?.map((p, index) => {
      if (index == indexProductSelected) {
        p.note = product?.note;
        p.options = mappingOptions(p.options, product?.options);
        p.toppings = mappingToppings(p?.toppings, product?.toppings);
      }
      return p;
    });
    setComboDetail({...comboDetail, products: newProducts});
    getTotalProductPrice(comboDetail, currencySymbol);
    setIsShowProductModal(false);
  };

  const mappingToppings = (oldToppings, newToppings) => {
    let toppings = [];
    oldToppings?.map(x => {
      let topping = {...x};
      let toppingSelected = newToppings?.find(y => y?.id === x?.id);
      if (toppingSelected != null) {
        topping.quantity = toppingSelected?.quantity;
      }
      toppings.push(topping);
    });
    return toppings;
  };

  const mappingOptions = (oldOptions, newOptions) => {
    let options = oldOptions?.map(o => {
      let optionSelected = newOptions?.find(on => on?.id === o?.id);
      if (optionSelected != null) {
        o?.optionLevel?.map(ol => {
          if (ol?.id === optionSelected?.optionLevelId) {
            ol.selected = true;
          } else {
            ol.selected = false;
          }
          return ol;
        });
      }
      return o;
    });
    return options;
  };

  const getComboProductName = (name, productPrices) => {
    let productName = name;
    if (productPrices?.length > 0 && productPrices[0]?.priceName) {
      productName = `${productName} (${productPrices[0]?.priceName})`;
    }
    return productName;
  };

  const renderComboProducts = () => {
    return (
      <>
        {comboDetail?.products?.map((item, index) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onClickProductItem(item), setIndexProductSelected(index);
            }}
            style={styles.viewProductItem}>
            <Image
              style={styles.imageProduct}
              source={
                item?.thumbnail == undefined
                  ? ComboIcon
                  : {
                      uri: item?.thumbnail,
                    }
              }
            />
            <View style={styles.productDetail}>
              <View style={styles.detail}>
                <Text style={styles.textProductName}>
                  {getComboProductName(item?.name, item?.productPrices)}
                </Text>
                <Text style={styles.textOption}>{t(TextI18n.option)}</Text>
                <ArrowRightIcon />
              </View>
              {item?.options?.map(i => (
                <>
                  {i?.optionLevel
                    ?.filter(
                      ol => ol?.selected && ol?.selected != ol.isSetDefault,
                    )
                    ?.map(ol => (
                      <Text>{ol?.name}</Text>
                    ))}
                </>
              ))}
              {item?.toppings
                ?.filter(t => t?.quantity > 0)
                ?.map(i => (
                  <Text style={styles.textOptionTopping}>
                    x{i?.quantity} {i?.name}
                  </Text>
                ))}
              {item?.note && (
                <View style={styles.viewProductNote}>
                  <Text style={styles.textProductNote}>{item?.note}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </>
    );
  };

  const handleAddComboOnCart = async () => {
    let isDiffStore = false;
    let updateOrderCart = {...shoppingCart};
    const {storeId, isEdit, indexCombo} = route?.params?.paramsData;

    comboDetail.products = Cart.mappingProductOptions(comboDetail.products);
    comboDetail.note = noteComboDetail;

    if (isEdit) {
      let updateComboProductCart = [...updateOrderCart?.productDetail];
      let productsNotHaveProductEdit = [...updateOrderCart?.productDetail];

      updateComboProductCart.splice(indexCombo, 1, comboDetail);

      productsNotHaveProductEdit.splice(indexCombo, 1);
      let newShoppingCart = {
        ...shoppingCart,
        productDetail: productsNotHaveProductEdit,
      };
      /// Handle check product after update have exist in cart
      let newCartProduct = Cart.checkExistProductItemInCart(
        comboDetail,
        newShoppingCart,
      );
      if (
        newCartProduct?.productDetail?.length ===
        newShoppingCart?.productDetail?.length
      ) {
        updateOrderCart = newCartProduct;
      } else {
        updateOrderCart.productDetail = updateComboProductCart;
      }
      updateOrderCartSession(updateOrderCart);
    } else {
      let cartInfo = {
        productDetail: [comboDetail],
      };
      if (
        shoppingCart?.storeDetail?.storeId === undefined ||
        Object.keys(shoppingCart).length === 0
      ) {
        //Case: Haven't product in the cart
        await updateOrderCartSession(cartInfo);
      } else {
        //Case: ProductExisted in cart and add newItem or updateItem

        if (
          updateOrderCart?.storeDetail?.storeId !== storeId &&
          shoppingCart?.productDetail?.length > 0
        ) {
          setNewCartInfo(cartInfo);
          isDiffStore = true;
        } else {
          updateOrderCart = Cart.checkExistProductItemInCart(
            comboDetail,
            shoppingCart,
          );
          await updateOrderCartSession(updateOrderCart);
        }
      }
    }

    if (isDiffStore) {
      setIsShowConfirmationModal(true);
    } else {
      setComboDetail(null);
      navigation.goBack();
    }
  };

  /** This function is used to add or update the cart info to the redux state and the sql lite.
   * @param  {any} cartInfo The cart info, for example: {storeId: '', productDetail: []}
   */
  const updateOrderCartSession = async cartInfo => {
    const {storeId, storeName, branchId, currencySymbol} =
      route?.params?.paramsData;
    let newCartInfo = {
      ...cartInfo,
      storeDetail: {
        storeId,
        storeName,
        branchId,
        currency: currencySymbol,
      },
    };
    dispatch(setCart(newCartInfo));
    await AsyncStorage.setItem(
      DatabaseKeys.orderCart,
      JSON.stringify(newCartInfo),
    );
  };

  const onChangeQuantity = amount => {
    let newComboDetail = comboDetail;
    let quantity = (newComboDetail.quantity += amount);
    setComboDetail({...comboDetail, quantity});
    getTotalProductPrice({...comboDetail, quantity}, currencySymbol);
  };

  const renderConfirmationModal = () => {
    return (
      <ConfirmationModal
        visible={isShowConfirmationModal}
        onOk={onConfirmAddProductToCart}
        onCancel={() => setIsShowConfirmationModal(false)}
        contentKey={t(TextI18n.resetCartOnMobile)}
      />
    );
  };

  const onConfirmAddProductToCart = () => {
    updateOrderCartSession(newCartInfo);
    setIsShowConfirmationModal(false);
    setComboDetail(null);
    navigation.goBack();
  };

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 130 : 0;

  return (
    <Layout backgroundColor={'#F7FBFF'}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={keyboardVerticalOffset}
          behavior="position">
          <View style={styles.viewHeader}>
            <Image
              style={styles.imageCombo}
              source={
                comboDetail?.thumbnail == undefined
                  ? ProductDefault
                  : {
                      uri: comboDetail?.thumbnail,
                    }
              }
            />
            <Text style={styles.title}>{comboDetail?.name}</Text>
            <Text style={styles.price}>
              {`${formatTextNumber(
                comboDetail?.priceAfterDiscount,
              )}${currencySymbol}`}
            </Text>
          </View>
          <View>{renderComboProducts()}</View>
          <View style={styles.viewNote}>
            <Text style={styles.textNote}>{t(TextI18n.note)}</Text>
            <View style={styles.viewNoteDetail}>
              <SubtractIcon style={styles.viewIconNote} />
              <TextInput
                multiline
                maxLength={pageData.maxLengthNote}
                style={styles.inputNote}
                defaultValue={comboDetail?.note}
                placeholder={t(TextI18n.inputYourNote)}
                underlineColorAndroid="transparent"
                onChangeText={text => setNoteComboDetail(text)}
              />
            </View>
            <Text style={styles.vaildNote}>
              {noteComboDetail?.length}/{pageData.maxLengthNote}
            </Text>
          </View>
        </KeyboardAvoidingView>
        {showProductDetailModal()}
      </ScrollView>

      <SafeAreaView style={styles.viewFooter}>
        <View style={styles.viewQuantity}>
          <Text style={styles.textQuantity}>{t(TextI18n.amount)}</Text>
          <View style={styles.viewPlusReduce}>
            <TouchableOpacity
              disabled={comboDetail?.quantity == 1}
              onPress={() => onChangeQuantity(-1)}>
              <ReduceIcon />
            </TouchableOpacity>
            <Text style={styles.productQuantity}>{comboDetail?.quantity}</Text>
            <TouchableOpacity onPress={() => onChangeQuantity(+1)}>
              <PlusIcon />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleAddComboOnCart}
          style={[styles.viewBtnAdd, 1 == 100 && styles.disabledBtnAdd]}>
          <Text style={styles.titleBtnAdd}>{`${t(
            TextI18n.addToCart,
          )} - `}</Text>
          <Text style={styles.total}>{totalProductPrice}</Text>
        </TouchableOpacity>
      </SafeAreaView>
      {renderConfirmationModal()}
    </Layout>
  );
}
