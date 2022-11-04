import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Animated,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {usePromiseTracker} from 'react-promise-tracker';
import {useDispatch, useSelector} from 'react-redux';
import favoriteStoreApiService from '../../api-services/favorite-store-api-service';
import productApiService from '../../api-services/product-api-service';
import ConfirmationModal from '../../components/confirmation-modal';
import Layout from '../../components/layout';
import DatabaseKeys from '../../constants/database-keys.constants';
import {
  FavoriteIcon,
  HeartIcon,
  ShareIcon,
} from '../../constants/icons.constants';
import {DateFormat, Percent} from '../../constants/string.constant';
import {getCart, setCart} from '../../data-services/cart-data-service';
import {
  getCurrentCustomerAddress,
  getCustomerInfo,
} from '../../data-services/session-data-service';
import TextI18n from '../../i18n/text.i18n';
import Cart from '../../utils/cart';
import {roundNumber} from '../../utils/helpers';
import String from '../../utils/string';
import ComboComponent from './combo-component';
import ProductsComponent from './product-component/product-component';
import styles from './store-details.style';
import StoreInformationComponent from './store-infomation-component';
const heightProductItem = 120;
const paddingProductItem = 32;
const paddingMenuItem = 72;

export default function StoreDetailsScreen({route, navigation}) {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const {t} = useTranslation();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const currentCustomerAddress = useSelector(getCurrentCustomerAddress);
  const {promiseInProgress} = usePromiseTracker();
  const [showModal, setShowModal] = useState(false);
  const currentCustomer = useSelector(getCustomerInfo);
  const [newCartInfo, setNewCartInfo] = useState(undefined);
  const shoppingCart = useSelector(getCart);
  const [comboList, setComboList] = useState([]);
  const [storeDetail, setStoreDetail] = useState({});
  const [productCategories, setProductCategories] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [ref, setRef] = useState(null);
  const [refMenu, setRefMenu] = useState(null);
  const [keySelected, setKeySelected] = useState(null);
  const [isCheckItem, setIsCheckItem] = useState(false);

  useEffect(() => {
    if (route?.params?.storeDetail) {
      reloadData();
    }
  }, [route?.params?.storeDetail]);

  useEffect(() => {
    updateDataProducts();
  }, [isFocus]);

  const updateDataProducts = async () => {
    let stringOfOrder = await AsyncStorage.getItem(DatabaseKeys.orderCart);
    let orderCart = JSON.parse(stringOfOrder);
    updateDataTableCombos(comboList, orderCart?.productDetail);
    updateDataTableProductCategories(productCategories, orderCart);
  };

  const reloadData = () => {
    let storeDetail = route?.params?.storeDetail;
    getInitDataStore(storeDetail, currentCustomer?.id);
  };

  const getInitDataStore = async (storeDetail, currentCustomerId) => {
    let stringOfOrder = await AsyncStorage.getItem(DatabaseKeys.orderCart);
    let orderCart = JSON.parse(stringOfOrder);

    /** This function is used to get store detail from the server
     * @param  {string} storeId
     */
    let customerId = currentCustomerId == undefined ? '' : currentCustomerId;

    let currentDate = moment().format(DateFormat.START_DATE);
    let latitude = currentCustomerAddress?.lat;
    let longitude = currentCustomerAddress?.lng;
    productApiService
      .getProductCategoriesActivatedAsync(
        storeDetail?.storeId,
        customerId,
        storeDetail?.branchId,
        currentDate,
        latitude,
        longitude,
      )
      .then(res => {
        let data = {...res};

        //List product category
        let productCategories = getInitDataProductCategories(
          data?.productCategories,
        );
        //List product combo
        let comboList = getInitDataCombos(data?.combos);

        getMenuListProduct(productCategories, comboList);

        //get store detail
        let store = data?.store;
        let initDataStore = {
          id: store?.id,
          name: store?.title,
          branchName: store?.branchName,
          branchId: storeDetail?.branchId,
          customerId: customerId,
          address: store?.addressInfo,
          thumbnail: store?.thumbnail,
          isFavoriteStore: store?.isFavoriteStore,
          promotions: data?.promotions,
          currencySymbol: store?.currencySymbol,
          voted: {
            number: '0',
            votedCount: '0',
          },
          distance: String.formatDistance(store?.distance),
        };
        if (orderCart?.productDetail?.length > 0) {
          updateDataTableCombos(comboList, orderCart?.productDetail);
          updateDataTableProductCategories(productCategories, orderCart);
        } else {
          setComboList(comboList);
          setProductCategories(productCategories);
        }

        setStoreDetail(initDataStore);
      });
  };

  const getMenuListProduct = (productCategories, combos) => {
    let menuCombos = [];
    let distanceFrom = paddingMenuItem;
    let distanceTo = paddingMenuItem;
    combos
      ?.filter(c => c?.products?.length > 0)
      ?.map(item => {
        distanceTo +=
          heightProductItem * item?.products?.length + paddingProductItem;
        let menuCombo = {
          key: item?.id,
          name: item?.name,
          amount: item?.products?.length,
          distanceFrom: distanceFrom,
          distanceTo: distanceTo,
        };
        distanceFrom +=
          heightProductItem * item?.products?.length + paddingProductItem;
        menuCombos.push(menuCombo);
      });
    let menuProductCategories = [];
    productCategories
      ?.filter(p => p?.products?.length > 0)
      ?.map(item => {
        distanceTo +=
          heightProductItem * item?.products?.length + paddingProductItem;
        let menuProductCategory = {
          key: item?.id,
          name: item?.name,
          amount: item?.products?.length,
          distanceFrom: distanceFrom,
          distanceTo: distanceTo,
        };
        distanceFrom +=
          heightProductItem * item?.products?.length + paddingProductItem;
        menuProductCategories.push(menuProductCategory);
      });
    let menuList = menuCombos.concat(menuProductCategories);
    setMenuList(menuList);
  };

  const getInitDataCombos = data => {
    let combos = [];
    data?.map(item => {
      let products = [];
      if (item?.comboPricings?.length > 0) {
        item?.comboPricings?.forEach(comboPricing => {
          let priceAfterDiscount = comboPricing?.sellingPrice
            ? comboPricing?.sellingPrice
            : comboPricing?.originalPrice;
          let promo =
            100 - (priceAfterDiscount * 100) / comboPricing?.originalPrice;
          let promoRound = roundNumber(promo, 1);
          let product = {
            quantities: 0,
            isCombo: true,
            isComboPricing: true,
            promo: `${promoRound}${Percent}`,
            name: comboPricing?.comboName,
            comboPricingId: comboPricing?.id,
            original: comboPricing?.originalPrice,
            priceAfterDiscount: priceAfterDiscount,
            isPromo: comboPricing?.sellingPrice ? true : false,
            thumbnail: item?.thumbnail,
            comboPricingProducts: mappingComboPricing(
              comboPricing?.comboPricingProducts,
            ),
          };
          products.push(product);
        });
      } else {
        let original = item?.comboProductPrices
          ?.map(p => p?.priceValue)
          ?.reduce((a, b) => a + b, 0);
        let promo = 100 - Math.floor((item?.sellingPrice * 100) / original);
        let product = {
          quantity: 0,
          isPromo: true,
          name: item?.name,
          original: original,
          isCombo: true,
          isComboPricing: false,
          promo: `${promo}${Percent}`,
          comboProductPriceId: item?.id,
          priceAfterDiscount: item?.sellingPrice,
          comboProductPrices: mappingComboProductPrices(
            item?.comboProductPrices,
          ),
        };
        products.push(product);
      }
      let combo = {
        id: item?.id,
        name: item?.name,
        thumbnail: item?.thumbnail,
        products: products,
      };
      combos.push(combo);
    });
    return combos;
  };

  const mappingComboPricing = data => {
    let comboPricings = data?.map(cp => ({
      comboPricingId: cp?.comboPricingId,
      productPriceId: cp?.productPriceId,
      productPrices: [mappingProductPrice(cp)],
      name: cp?.productPrice?.product?.name,
      thumbnail: cp?.productPrice?.product?.thumbnail,
      options: mappingDataOptions(cp?.productPrice?.product?.productOptions),
      toppings: cp?.productPrice?.product?.productToppings,
    }));
    return comboPricings;
  };

  const mappingProductPrice = data => {
    let productPrice = {
      id: data?.productPriceId,
      priceName: data?.priceName,
      priceValue: data?.priceValue,
    };
    return productPrice;
  };

  const mappingComboProductPrices = data => {
    let comboProductPrices = data?.map(cpp => ({
      productPriceId: cpp?.productPriceId,
      productPrices: [mappingProductPrice(cpp)],
      name: cpp?.productPrice?.product?.name,
      thumbnail: cpp?.productPrice?.product?.thumbnail,
      options: mappingDataOptions(cpp?.productPrice?.product?.productOptions),
      toppings: cpp?.productPrice?.product?.productToppings,
    }));
    return comboProductPrices;
  };

  const getInitDataProductCategories = data => {
    return data?.map(item => ({
      id: item?.id,
      name: item?.name,
      products: mappingDataProducts(item?.productProductCategories),
    }));
  };

  const mappingDataProducts = data => {
    let products = [];
    data?.map(item => {
      // Set default for product
      let productPrices = [];
      item?.product?.productPrices?.map((aProductPrice, index) => {
        let productPrice = {
          id: aProductPrice?.id,
          priceName: aProductPrice?.priceName,
          priceValue: aProductPrice?.priceValue,
          selected: index === 0 ? true : false,
        };
        productPrices.push(productPrice);
      });

      let product = {
        quantities: 0,
        isPromo: false,
        id: item?.productId,
        isCombo: false,
        toppings: item?.product?.productToppings,
        name: item?.product?.name,
        thumbnail: item?.product?.thumbnail,
        productPrices: productPrices,
        options: mappingDataOptions(item?.product?.productOptions),
        description: item?.product?.description,
        original: item?.product?.productPrices[0]?.priceValue,
      };
      products.push(product);
    });
    return products;
  };

  const mappingDataOptions = newOptions => {
    let listOption = newOptions?.map(o => ({
      id: o?.option?.id,
      name: o?.option?.name,
      optionLevel: setOptionLevelSelected(o?.option?.optionLevel),
    }));
    return listOption;
  };

  const setOptionLevelSelected = optionLevels => {
    let newOptionLevels = [];
    optionLevels?.map(ol => {
      let newOptionLevel = {
        ...ol,
        selected: ol?.isSetDefault,
      };
      newOptionLevels.push(newOptionLevel);
    });
    return newOptionLevels;
  };

  const topRightComponent = () => {
    return (
      <View style={styles.viewHeaderRight}>
        {currentCustomer != null && (
          <TouchableOpacity>
            {storeDetail?.isFavoriteStore ? (
              <TouchableOpacity onPress={() => onDislikeStore()}>
                <HeartIcon style={styles.favoriteIcon} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => onFavoriteStore()}>
                <FavoriteIcon style={styles.favoriteIcon} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity>
          <ShareIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const onFavoriteStore = () => {
    let req = {
      storeId: storeDetail?.id,
      customerId: storeDetail?.customerId,
    };
    favoriteStoreApiService.addStoreOnFavoriteStoresAsync(req).then(res => {
      if (res) {
        setStoreDetail({...storeDetail, isFavoriteStore: true});
      }
    });
  };

  const onDislikeStore = () => {
    let req = {
      storeId: storeDetail?.id,
      customerId: storeDetail?.customerId,
    };
    favoriteStoreApiService
      .removeStoreLeaveFavoriteStoresAsync(req)
      .then(res => {
        if (res) {
          setStoreDetail({...storeDetail, isFavoriteStore: false});
        }
      });
  };

  const addFastComboProduct = async (product, comboId) => {
    let productItem = null;
    let comboListToUpdate = [...comboList];

    let comboIndex = comboListToUpdate.findIndex(combo => combo.id === comboId);

    if (comboIndex >= 0) {
      let comboToUpdate = {...comboListToUpdate[comboIndex]}; // get combo item by index
      let productsToUpdate = [...comboToUpdate?.products]; // get products in combo item (*)

      /**
       * Step I: Check product need add on cart belong comboPricing or comboProductPrice
       * Step II: Get productIndex from (*)
       */
      let productIndex = product?.isComboPricing
        ? productsToUpdate?.findIndex(
            item => item?.comboPricingId === product?.comboPricingId,
          )
        : productsToUpdate?.findIndex(
            item => item?.comboProductPriceId === product?.comboProductPriceId,
          );

      if (productIndex >= 0) {
        productItem = {...productsToUpdate[productIndex]};
      }
    }
    productItem.comboId = comboId;
    productItem.products = Cart.mappingProductOptions(
      productItem.comboPricingProducts,
    );
    addProductOnOrderCartSession(productItem);
  };

  //Handle add productDetail on cart session
  const addProductOnOrderCartSession = async productItem => {
    //Case: Haven't product in the cart
    let cartInfo = {
      productDetail: [productItem],
    };
    setNewCartInfo(cartInfo);

    if (
      shoppingCart?.storeDetail?.storeId === undefined ||
      Object.keys(shoppingCart).length === 0
    ) {
      await updateOrderCartSession(cartInfo);
    } else {
      //Case: ProductExisted in cart and add newItem or updateItem
      let updateOrderCart = {...shoppingCart};
      if (
        updateOrderCart?.storeDetail?.storeId !== storeDetail?.id &&
        shoppingCart?.productDetail?.length > 0
      ) {
        setNewCartInfo(cartInfo);
        setShowModal(true);
        return;
      } else {
        updateOrderCart = Cart.checkExistProductItemInCart(
          productItem,
          shoppingCart,
        );
        await updateOrderCartSession(updateOrderCart);
      }
    }
  };

  /**
   * Case 1: Find and update quantity product on productCategories by productCategoryId, productId
   * Case 2: Handle call function add product on cart
   */
  const updateProductItem = (productItemDetail, updateOrderCart) => {
    const newProductCategories = productCategories?.map(aProductCategory => {
      if (aProductCategory?.id === productItemDetail?.productCategoryId) {
        aProductCategory?.products?.map(product => {
          if (product?.id === productItemDetail?.id) {
            product.quantities += productItemDetail?.quantity;
          }
          return product;
        });
      }
      return aProductCategory;
    });
    updateOrderCartSession(updateOrderCart);
    setProductCategories(newProductCategories);
  };

  /** This function is used to add or update the cart info to the redux state and the sql lite.
   * @param  {any} cartInfo The cart info, for example: {storeId: '', productDetail: []}
   */
  const updateOrderCartSession = async cartInfo => {
    let newCartInfo = {
      ...cartInfo,
      storeDetail: {
        storeId: storeDetail?.id,
        storeName: storeDetail?.name,
        branchId: storeDetail?.branchId,
        branchName: storeDetail?.branchName,
        currency: storeDetail?.currencySymbol,
      },
    };

    dispatch(setCart(newCartInfo));
    await AsyncStorage.setItem(
      DatabaseKeys.orderCart,
      JSON.stringify(newCartInfo),
    );
    updateDataTableCombos(comboList, newCartInfo?.productDetail);
  };

  const updateDataTableProductCategories = async (
    productCategories,
    orderCart,
  ) => {
    productCategories?.map(productCategory => {
      productCategory?.products?.map(product => {
        product.quantities = 0;
        //Check and merge product category from orderCartSession
        if (orderCart?.productDetail?.length > 0) {
          let productsExisted = orderCart?.productDetail?.filter(
            p => p?.id === product?.id,
          );
          if (productsExisted?.length > 0) {
            let quantity = productsExisted
              ?.map(p => p?.quantity)
              ?.reduce((a, b) => a + b, 0);
            product.quantities = quantity;
          }
        }
      });
    });

    setProductCategories([...productCategories]);
  };

  const updateDataTableCombos = async (comboList, productDetail) => {
    let newCombos = comboList;
    //Check and merge product combo from orderCartSession
    newCombos?.map(combo => {
      combo?.products?.map(product => {
        product.quantities = 0;
        if (productDetail?.length > 0) {
          let cpExisted = null;
          if (product?.isComboPricing) {
            //Combo type: Specific combo by specific items
            cpExisted = productDetail?.filter(
              p =>
                p?.isCombo &&
                combo?.id === p?.comboId &&
                p?.comboPricingId === product?.comboPricingId,
            );
          } else {
            //Combo type: Flexible combo by group of items
            cpExisted = productDetail?.filter(
              p =>
                p?.isCombo &&
                combo?.id === p?.comboId &&
                p?.comboProductPriceId === product?.comboProductPriceId,
            );
          }
          if (cpExisted?.length > 0) {
            product.quantities = cpExisted
              ?.map(t => t?.quantity)
              ?.reduce((a, b) => a + b, 0);
          }
        }

        return product;
      });
      return combo;
    });
    setComboList([...newCombos]);
  };

  /**
   * This function is used to confirm to clear the cart
   * when the user adds product of a new store to Cart will display a confirmation modal to remove the old Card
   * and create new one.
   * @param  {any} cart The cart data, for example: {storeId: '', productDetail: []}
   */
  const onConfirm = () => {
    updateOrderCartSession(newCartInfo);
    setShowModal(false);
  };

  /**
   * This function is used to hide the modal.
   */
  const onCancel = () => {
    setShowModal(false);
  };

  const handleScroll = event => {
    const positionY = event.nativeEvent.contentOffset.y + paddingMenuItem * 2;

    let menuItem = menuList?.find(
      ml =>
        ml?.distanceFrom <= positionY &&
        ml?.distanceTo > positionY + heightProductItem,
    );
    if (menuItem != null) {
      let total = 0;
      let menuIndexSelected = menuList?.findIndex(i => i?.key == menuItem?.key);
      let menuListExist = menuList?.filter((ml, i) => i < menuIndexSelected);
      if (menuListExist?.length > 0) {
        total = menuListExist
          ?.map(t => t?.name?.length + paddingMenuItem)
          ?.reduce((a, b) => a + b, 0);
      }
      refMenu.scrollTo({
        x: total,
        y: 0,
        animated: true,
      });

      if (!isCheckItem) {
        setKeySelected(menuItem?.key);
      }
    }
  };

  const onClickMenuItem = index => {
    setIsCheckItem(true);
    setKeySelected(menuList[index]?.key);
    let total = 0;
    let menuListExist = menuList?.filter((ml, i) => i < index);
    if (menuListExist?.length > 0) {
      total = menuListExist
        ?.map(t => t?.amount * heightProductItem + paddingProductItem)
        ?.reduce((a, b) => a + b, 0);
    }
    ref.scrollTo({
      x: 0,
      y: total - paddingMenuItem,
      animated: true,
    });
  };

  return (
    <Layout
      title={storeDetail?.name}
      topRightComponent={topRightComponent()}
      backgroundColor={'#F7FBFF'}>
      <StoreInformationComponent
        animHeaderValue={scrollOffsetY}
        storeDetail={storeDetail}
        menuList={menuList}
        keySelected={keySelected}
        onClickMenuItem={onClickMenuItem}
        onSetRefMenu={ref => setRefMenu(ref)}
      />

      <ScrollView
        ref={ref => {
          setRef(ref);
        }}
        refreshControl={
          <RefreshControl
            refreshing={promiseInProgress}
            onRefresh={reloadData}
          />
        }
        showsVerticalScrollIndicator={false}
        style={styles.container}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
          {listener: event => handleScroll(event)},
          {useNativeDriver: false},
        )}
        onScrollBeginDrag={() => {
          setIsCheckItem(false);
        }}
        scrollEventThrottle={16}>
        <ComboComponent
          combos={comboList}
          storeId={storeDetail?.id}
          storeName={storeDetail?.name}
          branchId={storeDetail?.branchId}
          currencySymbol={storeDetail?.currencySymbol}
          addFastProductItem={addFastComboProduct}
        />
        <ProductsComponent
          storeId={storeDetail?.id}
          currencySymbol={storeDetail?.currencySymbol}
          productCategories={productCategories}
          updateProductItem={updateProductItem}
        />
      </ScrollView>

      <ConfirmationModal
        visible={showModal}
        onCancel={onCancel}
        onOk={onConfirm}
        contentKey={t(TextI18n.resetCartOnMobile)}
      />
    </Layout>
  );
}
