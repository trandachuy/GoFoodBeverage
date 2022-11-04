import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useDispatch, useSelector} from 'react-redux';
import AddNoteModal from '../../components/add-note-modal';
import Layout from '../../components/layout';
import DatabaseKeys from '../../constants/database-keys.constants';
import {
  DeleteAccountIcon,
  HeartCartIcon,
  NoteIcon,
} from '../../constants/icons.constants';
import {Cart as CartIcon} from '../../constants/images.constants';
import {ScreenName} from '../../constants/screen.constants';
import {getCart, setCart} from '../../data-services/cart-data-service';
import ButtonI18n from '../../i18n/button.i18n';
import TextI18n from '../../i18n/text.i18n';
import Cart from '../../utils/cart';
import {formatTextNumber, randomGuid} from '../../utils/helpers';
import styles from './cart.style';
import ComboItemComponent from './combo-item';
import ProductItemComponent from './product-item';

export default function CartScreen() {
  const {t} = useTranslation();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const shoppingCart = useSelector(getCart);
  const [products, setProducts] = useState([]);
  const [isShowModalAddNote, setIsShowModalAddNote] = useState(false);
  const [dataEdit, setDataEdit] = useState({});

  useEffect(() => {
    if (shoppingCart?.productDetail?.length == 0) {
      navigation.goBack();
    } else {
      getInitProducts(shoppingCart?.productDetail);
    }
  }, [isFocus]);

  const getInitProducts = productDetail => {
    let products = productDetail?.map(p => ({
      key: randomGuid(),
      ...p,
    }));
    setProducts(products);
  };

  //Handle change quantity product
  const updateQuantityProductItem = (index, quantity) => {
    let isRemove = false;

    let newOrderCart = [...shoppingCart?.productDetail];

    for (var idx = 0; idx < newOrderCart?.length; idx++) {
      let item = {...newOrderCart[idx]};
      if (idx === index) {
        if (item.quantity === 1 && quantity < 0) {
          isRemove = true;
        } else {
          item.quantity += quantity;
        }
      }
      newOrderCart[idx] = item;
    }

    if (isRemove) {
      newOrderCart.splice(index, 1);
    }

    updateOrderCartSession(newOrderCart);
  };

  const updateOrderCartSession = async newCart => {
    getInitProducts(newCart);
    let updateCart = {...shoppingCart, productDetail: newCart};

    dispatch(setCart(updateCart));
    await AsyncStorage.setItem(
      DatabaseKeys.orderCart,
      JSON.stringify(updateCart),
    );
  };

  const onGoToCheckout = () => {
    navigation.navigate(ScreenName.checkout);
  };

  const getPriceValue = priceValue => {
    let price =
      formatTextNumber(priceValue) + shoppingCart?.storeDetail?.currency;
    return price;
  };

  const renderProductItem = (product, index) => {
    return (
      <ProductItemComponent
        onReload={cart => getInitProducts(cart)}
        index={index}
        product={product}
        currency={shoppingCart?.storeDetail?.currency}
        updateQuantityProductItem={updateQuantityProductItem}
      />
    );
  };

  const renderComboItem = (combo, index) => {
    return (
      <ComboItemComponent
        index={index}
        combo={combo}
        currency={shoppingCart?.storeDetail?.currency}
        updateQuantityProductItem={updateQuantityProductItem}
      />
    );
  };

  const renderItem = data => {
    return (
      <>
        {data?.item?.isCombo
          ? renderComboItem(data?.item, data?.index)
          : renderProductItem(data?.item, data?.index)}
      </>
    );
  };

  const renderActionItem = (data, rowMap) => {
    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        onDelete={() => onDeleteProductItem(rowMap, data?.item?.key)}
        onEdit={() => onEditNote(rowMap, data?.item)}
      />
    );
  };

  const HiddenItemWithActions = props => {
    const {onEdit, onDelete} = props;
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          onPress={onEdit}>
          <View>
            <NoteIcon />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={onDelete}>
          <View style={styles.viewDelete}>
            <DeleteAccountIcon />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const onEditNote = (rowMap, data) => {
    if (rowMap[data?.key]) {
      let dataEdit = {
        key: data?.key,
        note: data?.note,
      };
      setDataEdit(dataEdit);
      setIsShowModalAddNote(true);
      rowMap[data?.key].closeRow();
    }
  };

  const onDeleteProductItem = async (rowMap, key) => {
    if (rowMap[key]) {
      onRemoveProductItem(key);
      rowMap[key].closeRow();
    }
  };

  const onRemoveProductItem = key => {
    let newOrderCart = [...shoppingCart?.productDetail];
    let index = products?.findIndex(p => p.key === key);
    newOrderCart.splice(index, 1);
    updateOrderCartSession(newOrderCart);
  };

  const onAddNoteProductItem = data => {
    let index = products?.findIndex(p => p.key === dataEdit?.key);
    let newOrderCart = [...shoppingCart?.productDetail];

    for (var idx = 0; idx < newOrderCart?.length; idx++) {
      let item = {...newOrderCart[idx]};
      if (idx === index) {
        item.note = data?.note;
      }
      newOrderCart[idx] = item;
    }
    updateOrderCartSession(newOrderCart);

    setIsShowModalAddNote(false);
  };

  return (
    <Layout title={t(TextI18n.cart)}>
      <View style={styles.contaner}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SwipeListView
            showsVerticalScrollIndicator={false}
            data={products}
            renderItem={(data, rowMap) => renderItem(data, rowMap)}
            renderHiddenItem={(data, rowMap) => renderActionItem(data, rowMap)}
            leftOpenValue={50}
            rightOpenValue={-90}
            disableRightSwipe
          />
        </ScrollView>
      </View>

      <SafeAreaView style={styles.viewCheckout}>
        <ImageBackground source={CartIcon} style={styles.iconCart}>
          <View style={styles.heartInCartBox}>
            <Text style={styles.textHeart}>
              {Cart.totalItemsInCart(shoppingCart)}
            </Text>

            <HeartCartIcon />
          </View>
        </ImageBackground>
        <TouchableOpacity
          disabled={!(shoppingCart?.productDetail?.length > 0)}
          onPress={onGoToCheckout}>
          <View
            style={[
              styles.checkout,
              shoppingCart?.productDetail?.length == 0 &&
                styles.disabledViewCheckout,
            ]}>
            <Text style={styles.textTotal}>
              {getPriceValue(Cart.totalPricesInCart(shoppingCart))}
            </Text>
            <Text style={styles.textCheckout}>
              {` - `}
              {t(TextI18n.checkout)}
            </Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
      {isShowModalAddNote && (
        <AddNoteModal
          note={dataEdit?.note}
          visible={isShowModalAddNote}
          titleKey={t(TextI18n.addNote)}
          cancelTextKey={t(ButtonI18n.ignore)}
          okTextKey={t(ButtonI18n.confirm)}
          placeholder={t(TextI18n.enterYourNote)}
          onOk={onAddNoteProductItem}
          onCancel={() => setIsShowModalAddNote(false)}
          maxLength={200}
        />
      )}
    </Layout>
  );
}
