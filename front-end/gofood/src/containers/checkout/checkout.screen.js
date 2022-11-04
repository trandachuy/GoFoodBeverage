import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions, useNavigation, useRoute} from '@react-navigation/native';
import {Toast} from 'native-base';
import {default as React, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  Linking,
  NativeEventEmitter,
  NativeModules,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {usePromiseTracker} from 'react-promise-tracker';
import {useDispatch, useSelector} from 'react-redux';
import deliveryApiService from '../../api-services/delivery-api-service';
import orderApiService from '../../api-services/order-api-service';
import paymentConfigApiService from '../../api-services/payment-api-service';
import productApiService from '../../api-services/product-api-service';
import promotionApiService from '../../api-services/promotion-api-service';
import Button from '../../components/button';
import Layout from '../../components/layout';
import ProductDetailModal from '../../components/product-detail-modal';
import Separator from '../../components/separator';
import EnvironmentConfig from '../../configs/environment-config';
import DatabaseKeys from '../../constants/database-keys.constants';
import DeliveryMethod from '../../constants/delivery-method';
import {
  ArrowRightIcon,
  CheckoutCardIcon,
  CheckoutCouponIcon,
  CheckoutFnbIcon,
  CheckoutLocationIcon,
  CheckoutNoteIcon,
  CheckoutShippingMethodIcon,
  CheckoutTotalPriceIcon,
  CloseIcon,
  PlusIcon,
  ReduceIcon,
  SelectedTickIcon,
} from '../../constants/icons.constants';
import OrderPaymentStatus from '../../constants/order-payment-status';
import OrderStatus from '../../constants/order-status.constants';
import {
  PaymentMethod,
  PaymentMethodNameList,
} from '../../constants/payment-method.constants';
import {ScreenName} from '../../constants/screen.constants';
import {Urls} from '../../constants/urls.constants';
import VnPayPaymentCode from '../../constants/vnpay-payment-code-constants';
import {
  getCart,
  getProductDetails,
  setCart,
} from '../../data-services/cart-data-service';
import {
  getCurrentCustomerAddress,
  getCustomerInfo,
} from '../../data-services/session-data-service';
import ButtonI18n from '../../i18n/button.i18n';
import MessageI18n from '../../i18n/message.i18n';
import TextI18n from '../../i18n/text.i18n';
import DateTimeUtil from '../../utils/datetime';
import {formatTextNumber} from '../../utils/helpers';
import {http} from '../../utils/http-common';
import ProductInfo from '../../utils/product-info';
import {ProductDefault} from './../../constants/images.constants';
import styles from './checkout.style';
import CheckoutModal from './components/modal';
import ShippingMethodComponent from './components/shipping-method';

const vnPayModule =
  Platform.OS === 'android'
    ? NativeModules.VnpayMerchantModule
    : NativeModules.VnpayMerchant;
const eventEmitter = new NativeEventEmitter(vnPayModule);

export default function CheckoutScreen() {
  // Constants
  const {t} = useTranslation();
  const noteInputRef = useRef();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const shoppingCart = useSelector(getCart);
  const {promiseInProgress} = usePromiseTracker();
  const customerInfo = useSelector(getCustomerInfo);
  const productDetails = useSelector(getProductDetails);
  const currentAddress = useSelector(getCurrentCustomerAddress);
  const route = useRoute();

  // States
  const [note, setNote] = useState('');
  const [paymentSummary, setPaymentSummary] = useState({
    discountAmount: 0,
    originalPrice: 0,
    totalFee: 0,
    totalTax: 0,
    totalPriceAfterDiscount: 0,
    shippingFee: 0,
    promotionId: null,
  });

  const [vouchers, setVouchers] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState();
  const [isFocusOnNoteControl, setIsFocusOnNoteControl] = useState(false);
  const [isOpenPaymentMethodBox, setIsOpenPaymentMethodBox] = useState(false);
  const [isReOrder, setIsReOrder] = useState(route?.params?.isReOrder);
  const [partnerCodeMomo, setPartnerCodeMomo] = useState('');
  const [isOpenShippingMethodBox, setIsOpenShippingMethodBox] = useState(false);
  const [productDetail, setProductDetail] = useState(null);
  const [isShowProductModal, setIsShowProductModal] = useState(false);
  const [canPlaceOrder, setCanPlaceOrder] = useState(false);
  const [isShowAhamoveNotWorking, setIShowAhamoveNotWorking] = useState(false);

  useEffect(() => {
    initializeData(true);
  }, []);

  useEffect(() => {
    let formData = getProductFormData();
    productApiService
      .calculateTotalAmountInCartAsync(formData)
      .then(async res => {
        let shippingFee = 0;
        let deliveryMethodId =
          shoppingCart?.deliveryMethodId ||
          route?.params?.initialDataReOrder?.deliveryMethodId;
        if (deliveryMethodId) {
          let deliveryMethodsResult = await getDeliveryMethods();
          let currentDeliveryMethod = deliveryMethodsResult?.find(
            dvm => dvm.id === deliveryMethodId,
          );
          shippingFee = currentDeliveryMethod?.feeValue;
          setDeliveryMethods(deliveryMethodsResult);
          setSelectedDeliveryMethod(deliveryMethodId);
          setCanPlaceOrder(true);
        }
        let paymentInfo = {
          ...paymentSummary,
          discountAmount: res?.customerDiscountAmount,
          originalPrice: res?.originalPrice,
          totalFee: res?.totalFee,
          totalTax: res?.totalTax,
          totalPriceAfterDiscount: res?.totalPriceAfterDiscount,
          promotionId: res?.promotionId,
          shippingFee: shippingFee,
        };
        setPaymentSummary(paymentInfo);
      });
  }, [shoppingCart?.productDetail]);

  useEffect(() => {
    reCalculateShippingFee();
  }, [currentAddress]);

  const getProductFormData = () => {
    let cartItems = shoppingCart?.productDetail?.map(item => ({
      orderItemId: item?.orderItemId,
      productPriceId: item?.productPrice?.id,
      quantity: item?.quantity,
      notes: item?.note,
      options: item?.options,
      toppings: item?.toppings?.map(topping => ({
        toppingId: topping.id,
        name: topping.name,
        priceValue: topping.price,
        quantity: topping.quantity,
      })),
      isCombo: item?.isCombo,
      productId: item?.id,
      orderId: item?.orderId,
      combo: {
        comboId: item?.comboId,
        comboPricingId: item?.comboPricingId,
        comboName: item?.name,
        originalPrice: item?.original,
        sellingPrice: item?.priceAfterDiscount,
        quantity: item?.quantity,
        comboItems: getComboItems(item),
        notes: item?.note,
      },
    }));
    let formData = {
      customerId: customerInfo?.id,
      storeId: shoppingCart?.storeDetail?.storeId,
      branchId: shoppingCart?.storeDetail?.branchId,
      cartItems: cartItems,
      orderFeedIds: [],
      paymentMethodId: selectedPaymentMethod,
      deliveryMethodId: selectedDeliveryMethod,
      note,
      address:
        isReOrder === true
          ? route?.params?.initialDataReOrder?.orderDelivery?.receiverAddress ||
            currentAddress?.address
          : currentAddress?.address,
      receiverAddress: {
        address: currentAddress?.address,
        lat: currentAddress?.lat,
        lng: currentAddress?.lng,
      },
      posUrl: `${http.getPosWebsite()}api/payment/vnpay-update-order-by-sdk`,
    };

    return formData;
  };

  const getComboItems = comboItems => {
    let combosItem = [];
    if (comboItems?.isCombo) {
      comboItems?.products?.map(item => {
        let comboItem = {
          productPriceId: item?.productPriceId,
          itemName: item?.name,
          quantity: 1,
          options: item?.options,
          toppings: getToppingItems(item?.toppings),
          note: item?.note,
        };
        combosItem.push(comboItem);
      });
    }
    return combosItem;
  };

  const getToppingItems = toppings => {
    let toppingsItem = [];
    toppings?.map(t => {
      if (t?.quantity > 0) {
        let toppingItem = {
          toppingId: t?.id,
          name: t?.name,
          quantity: t?.quantity,
          originalPrice: t?.price,
          priceAfterDiscount: t?.price,
        };
        toppingsItem.push(toppingItem);
      }
    });
    return toppingsItem;
  };

  const initializeData = async firstLoad => {
    if (shoppingCart?.storeDetail?.storeId) {
      let utcTime = DateTimeUtil.getUtcString(new Date());
      let promotionResult =
        await promotionApiService.getPromotionsInBranchAsync(
          shoppingCart?.storeDetail?.storeId,
          shoppingCart?.storeDetail?.branchId,
          utcTime,
        );
      setVouchers(promotionResult?.promotions);

      let tmpPaymentConfigList = await getPaymentMethodInStore(
        shoppingCart?.storeDetail?.storeId,
      );
      setPaymentMethods(tmpPaymentConfigList);
      let defaultPaymentMethod = tmpPaymentConfigList?.find(
        item => item.id === PaymentMethod.cash,
      );
      if (isReOrder) {
        let deliveryMethodsResult = await getDeliveryMethods();
        setDeliveryMethods(deliveryMethodsResult);
        setSelectedPaymentMethod(
          route?.params?.initialDataReOrder?.paymentMethodId,
        );
        await setShippingMethod(
          route?.params?.initialDataReOrder?.deliveryMethodId,
        );
      } else {
        if (defaultPaymentMethod && firstLoad) {
          setSelectedPaymentMethod(defaultPaymentMethod.id);
          setCanPlaceOrder(true);
        }
      }

      return {
        paymentMethods: tmpPaymentConfigList,
      };
    }
    return {paymentMethods: []};
  };

  const getPaymentMethodInStore = async storeId => {
    let paymentConfigsResult =
      await paymentConfigApiService.getPaymentConfigurationByStore(storeId);

    let tmpPaymentConfigList = [];
    paymentConfigsResult?.paymentMethods?.map(pm => {
      if (
        pm?.enumId === PaymentMethod.moMo ||
        pm?.enumId === PaymentMethod.cash
      ) {
        let name = PaymentMethodNameList?.find(
          p => p?.key === pm?.enumId,
        )?.name;
        let tmpPaymentConfig = {
          id: pm.enumId,
          name: t(name),
          icon: pm.icon,
          partnerCode: pm?.paymentConfigs[0]?.partnerCode,
        };
        tmpPaymentConfigList.push(tmpPaymentConfig);
      }
    });

    return tmpPaymentConfigList;
  };

  /** This function is called when user clicks on Take Note... section,
   * text box will be enabled and the user can enter some text.
   */
  const onFocusNoteControl = () => {
    setIsFocusOnNoteControl(true);
    setTimeout(() => {
      noteInputRef?.current?.focus();
    }, 100);
  };

  /** This function is called when user clicks on Place Delivery Order button.
   */
  const onPlaceOrder = async () => {
    if (customerInfo) {
      if (selectedDeliveryMethod) {
        if (
          selectedPaymentMethod === PaymentMethod.cash ||
          selectedPaymentMethod === PaymentMethod.moMo ||
          selectedPaymentMethod === PaymentMethod.creditDebitCard ||
          selectedPaymentMethod === PaymentMethod.vnPay
        ) {
          let result = await initializeData();
          if (result) {
            let currentPaymentMethod = result.paymentMethods?.find(
              item => item.id === selectedPaymentMethod,
            );
            if (!currentPaymentMethod) {
              Toast.show({
                title: t(TextI18n.yourSelectedPaymentMethodIsNotWorkingNow),
                duration: 3000,
              });
              setCanPlaceOrder(false);
              return;
            }

            let deliveryMethodsResult = await getDeliveryMethods();
            let currentDeliveryMethod = deliveryMethodsResult?.find(
              dvm => dvm.id === selectedDeliveryMethod,
            );
            if (
              !currentDeliveryMethod ||
              currentDeliveryMethod?.feeValue != paymentSummary.shippingFee
            ) {
              Toast.show({
                title: t(TextI18n.yourSelectedShippingMethodIsNotWorkingNow),
                duration: 3000,
              });
              setCanPlaceOrder(false);
              setSelectedDeliveryMethod();
              let paymentInfo = {
                ...paymentSummary,
                shippingFee: 0,
              };
              setPaymentSummary(paymentInfo);
              return;
            }

            let formData = getProductFormData();
            formData.orderPaymentStatusId = OrderPaymentStatus.unpaid;
            formData.orderStatus =
              selectedPaymentMethod == PaymentMethod.moMo
                ? OrderStatus.Draft
                : OrderStatus.ToConfirm;
            const createOrderRes = await orderApiService.createOrderAsync(
              formData,
            );
            if (createOrderRes?.success) {
              switch (selectedPaymentMethod) {
                case PaymentMethod.cash: {
                  createOrderSuccess(
                    createOrderRes?.orderId,
                    shoppingCart?.storeDetail?.branchId,
                  );
                  break;
                }
                case PaymentMethod.moMo: {
                  let values = {
                    storeId: shoppingCart?.storeDetail?.storeId,
                    branchId: shoppingCart?.storeDetail?.branchId,
                    amount:
                      paymentSummary.totalPriceAfterDiscount +
                      paymentSummary.shippingFee,
                    orderInfo: createOrderRes?.code,
                    orderId: createOrderRes?.orderId,
                  };
                  let res =
                    await paymentConfigApiService.createMobileMoMoPaymentAsync(
                      values,
                    );
                  const {resultCode, deepLink} = res;
                  if (resultCode === 0) {
                    createOrderSuccess(
                      createOrderRes?.orderId,
                      shoppingCart?.storeDetail?.branchId,
                    );
                    await Linking.openURL(deepLink);
                  }
                  break;
                }
                case PaymentMethod.creditDebitCard:
                case PaymentMethod.vnPay: {
                  removeCartInfo(createOrderRes?.orderId);
                  openVnPaySdk(
                    createOrderRes.vnPayUrl,
                    createOrderRes.orderId,
                    createOrderRes.vnPayTransInfo,
                    shoppingCart?.storeDetail?.branchId,
                  );
                  break;
                }
              }
            }
          }
        }
      }
    } else {
      navigation?.navigate(ScreenName.login, {callBack: ScreenName.checkout});
    }
  };

  const createOrderSuccess = async (orderId, branchId) => {
    removeCartInfo();
    navigation.navigate(ScreenName.orderDetails, {
      orderId: orderId,
      branchId: branchId,
      backToScreen: ScreenName.myOrder,
    });
  };

  const removeCartInfo = async () => {
    dispatch(
      setCart({
        storeId: undefined,
        branchId: undefined,
        storeName: undefined,
        productDetail: [],
      }),
    );
    await AsyncStorage.removeItem(DatabaseKeys.orderCart);
  };

  /** This function is used to update the items in the cart
   * when the user clicks the Plus icon button or the Reduce icon button.
   * @param  {number} index The index of item in the cart.
   * @param  {bool} increment If the value is true, the item will be + 1, otherwise the item will be -1.
   */
  const updateCart = (index, quantity) => {
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
    let updateOrderCart = {
      ...shoppingCart,
      productDetail: newOrderCart,
    };

    updateOrderCartSession(updateOrderCart);
  };

  /** This function is used to remove cart item by the index.
   * @param  {number} index The index of item in the cart.
   */
  const onRemoveCartItem = index => {
    // We need to copy the array to update the cart item because it's a read-only array and cannot be modified.
    let newOrderCart = [...shoppingCart?.productDetail];

    // Remove item and update cart.
    newOrderCart.splice(index, 1);
    let updateOrderCart = {
      ...shoppingCart,
      productDetail: newOrderCart,
    };
    updateOrderCartSession(updateOrderCart);
  };

  const updateOrderCartSession = async cart => {
    dispatch(setCart(cart));
    await AsyncStorage.setItem(DatabaseKeys.orderCart, JSON.stringify(cart));

    if (cart?.productDetail?.length == 0) {
      navigation.goBack();
    }
  };

  /** This function is used to calculate the price with the quantity of item.
   * @param  {object} item The cart item object.
   */
  const getPrices = item => {
    let toppingPrice = 0;
    if (item?.isCombo) {
      item?.products?.map(product => {
        toppingPrice += product?.toppings?.reduce(
          (total, pt) =>
            (total = total + pt.quantity * pt?.price * item.quantity),
          0,
        );
      });
      return item?.priceAfterDiscount * item?.quantity + toppingPrice;
    } else {
      let totalPrices = item?.productPrice?.priceValue * item?.quantity;
      if (item?.toppings && item?.toppings?.length > 0) {
        item?.toppings.forEach((value, index) => {
          if (value.quantity > 0) {
            totalPrices += value.price * value.quantity * item.quantity;
          }
        });
      }
      return totalPrices;
    }
  };

  /** This method is used to open the Location screen when user clicks on the Change Location button.
   */
  const onChangeLocation = () => {
    if (customerInfo) {
      navigation.navigate(ScreenName.myAddress);
    } else {
      navigation?.navigate(ScreenName.login, {callBack: ScreenName.home});
    }
  };

  /** This method is used to open the Product Details screen when user clicks on the Change Location button.
   */
  const onOpenProductDetails = async (product, index) => {
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
        index: index,
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
    let newOrderCart = [...shoppingCart?.productDetail];
    newOrderCart.splice(productDetail?.index, 1, product);
    let updateOrderCart = {
      ...shoppingCart,
      productDetail: newOrderCart,
    };
    updateOrderCartSession(updateOrderCart);
    setIsShowProductModal(false);
  };

  /** This method is used to open the Store Details screen when user clicks on the Change Location button.
   */
  const onOpenStoreDetails = () => {
    navigation.navigate(ScreenName.storeDetails, {
      storeDetail: shoppingCart?.storeDetail,
    });
  };
  /** This method is used to open the vouchers screen when user clicks on the promo button.
   */
  const onViewVouchers = () => {
    navigation.navigate(ScreenName.vouchers, {
      vouchers,
      promotionId: paymentSummary?.promotionId,
      branchName: shoppingCart?.storeDetail?.storeName,
      currencySymbol: shoppingCart?.storeDetail?.currency,
    });
  };

  /** This function is used to get the URL of image because images in the local is private
   * and if you want to access those resources then you need to install the Conveyor extension on Visual Studio.
   * This extension is really useful to create a public IP that helps you to access IIS on the LAN.
   * @param  {string} url The url, e.g. http://localhost:5100/images/logo.png
   */
  const getImgUrl = url => {
    if (EnvironmentConfig.isLocal) {
      return url.replace('http://localhost:5100/', Urls.rootLocalUrl);
    } else {
      return url;
    }
  };

  /** This function is used to set the selected payment method by index.
   * @param  {number} idx The index, e.g. 1
   */
  const onSelectPaymentMethod = idx => {
    let paymentMethodItem = paymentMethods[idx];

    if (paymentMethodItem) {
      if (paymentMethodItem?.id === PaymentMethod.moMo) {
        setPartnerCodeMomo(paymentMethodItem?.partnerCode);
      }
      setSelectedPaymentMethod(paymentMethodItem.id);
      setCanPlaceOrder(true);
    }

    setIsOpenPaymentMethodBox(false);
  };

  /** This function is used to get name of the selected payment method.
   * @param  {number} id The index, e.g. 1, you can find it in the constants file PaymentMethod.
   */
  const getSelectedShippingMethodName = () => {
    return deliveryMethods?.find(item => item.id === selectedDeliveryMethod)
      ?.name;
  };

  const closePaymentMethodBox = () => {
    setIsOpenPaymentMethodBox(false);
  };

  const getSelectedPaymentMethodName = () => {
    return paymentMethods?.find(item => item.id === selectedPaymentMethod)
      ?.name;
  };

  const onConfirmShippingMethod = async key => {
    let deliveryMethod = deliveryMethods?.find(dvm => dvm.id == key);
    let newShoppingCart = {
      ...shoppingCart,
      deliveryMethodId: deliveryMethod?.id,
    };
    if (deliveryMethod != null) {
      setPaymentSummary({
        ...paymentSummary,
        shippingFee: deliveryMethod?.feeValue,
      });
      dispatch(setCart(newShoppingCart));
    }
    setSelectedDeliveryMethod(key);
    setIsOpenShippingMethodBox(false);
  };

  const onClickDeliveryMethods = async () => {
    let deliveryMethodsResult = await getDeliveryMethods();
    setDeliveryMethods(deliveryMethodsResult);
    setIsOpenShippingMethodBox(true);
    let checkAhamoveConfig = deliveryMethodsResult?.find(
      dm => dm.enumId === DeliveryMethod.ahaMove,
    );
    if (checkAhamoveConfig && checkAhamoveConfig?.feeValue === 0) {
      setIShowAhamoveNotWorking(true);
      setTimeout(() => {
        setIShowAhamoveNotWorking(false);
      }, 5000);
    }
  };

  const getDeliveryMethods = async () => {
    let deliveryMethods = [];
    let req = {
      storeId: shoppingCart?.storeDetail?.storeId,
      branchId: shoppingCart?.storeDetail?.branchId,
      receiverAddress: {
        lat: currentAddress?.lat,
        lng: currentAddress?.lng,
        address: currentAddress?.address,
      },
    };
    let res =
      await deliveryApiService.getEstimateFeeDeliveryMethodsByAddressAsync(req);

    if (res && res?.feeDeliveryConfigs?.length > 0) {
      deliveryMethods = res?.feeDeliveryConfigs?.map(fdc => ({
        id: fdc?.deliveryMethodId,
        enumId: fdc?.enumId,
        name:
          fdc?.enumId === DeliveryMethod.selfDelivery
            ? t(TextI18n.selfDelivery)
            : t(TextI18n.ahaMove),
        feeValue: fdc?.feeValue,
      }));
    }
    return deliveryMethods;
  };

  const openVnPaySdk = async (
    paymentUrl,
    orderId,
    vnPayTransInfo,
    branchId,
  ) => {
    eventEmitter.addListener('PaymentBack', async e => {
      if (e) {
        let screenInfo = {};
        if (
          e.resultCode === VnPayPaymentCode.cancelOrderFromBackButtonOfSystem ||
          e.resultCode === VnPayPaymentCode.paymentFailed ||
          e.resultCode === VnPayPaymentCode.userClickOnCancelOrderOnVnPay
        ) {
          Toast.show({title: t(MessageI18n.paymentFailed)});
          let formData = {
            orderId,
            branchId,
            status: OrderStatus.Canceled,
          };

          const orderUpdateResult = await orderApiService.updateOrderAsync(
            formData,
          );
          if (orderUpdateResult) {
            screenInfo = {
              orderId: orderId,
              branchId,
              backToScreen: ScreenName.myOrder,
            };
          }
        } else {
          screenInfo = {
            orderId: orderId,
            branchId,
            backToScreen: ScreenName.myOrder,
          };
          if (e.resultCode !== VnPayPaymentCode.userIsOpeningVnPayWallet) {
            Toast.show({title: t(MessageI18n.paymentSuccessfully)});
          } else {
            screenInfo.vnPayTransInfo = vnPayTransInfo;
          }
        }

        eventEmitter.removeAllListeners('PaymentBack');

        StackActions.popToTop();
        navigation.push(ScreenName.orderDetails, screenInfo);
      }
    });

    vnPayModule.show(
      // scheme
      'gofnb',
      // isSandbox
      true,
      // paymentUrl
      paymentUrl,
      // tmn_code
      'XAPFAQUZ',
      // backAlert
      t(MessageI18n.doYouWantToCancelOrder),
      // title
      'Thanh toán VNPAY',
      // titleColor
      '#333333',
      // beginColor
      '#ffffff',
      // endColor
      '#ffffff',
      // iconBackName
      'left-arrow',
    );
  };

  const onOpenComboProductDetails = async (combo, index) => {
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
      currencySymbol: shoppingCart?.storeDetail?.currency,
      comboId: combo?.comboId,
      comboDetail: product,
      isEdit: true,
      indexCombo: index,
    };
    navigation.navigate(ScreenName.comboDetails, {paramsData});
  };

  // Re-Calculate Shipping fee when change receive location
  const reCalculateShippingFee = async () => {
    let deliveryMethodsResult = await getDeliveryMethods();
    setDeliveryMethods(deliveryMethodsResult);
    let deliveryMethod = deliveryMethodsResult?.find(
      dvm => dvm.id == selectedDeliveryMethod,
    );
    if (deliveryMethod != null) {
      setPaymentSummary({
        ...paymentSummary,
        shippingFee: deliveryMethod?.feeValue,
      });
    }
  };

  const setShippingMethod = async deliveryMethodId => {
    let deliveryMethodsResult = await getDeliveryMethods();
    setDeliveryMethods(deliveryMethodsResult);
    setSelectedDeliveryMethod(deliveryMethodId);
  };

  const totalProductPriceItem = combo => {
    let toppingPrice = 0;
    if (combo?.products?.length > 0) {
      combo?.products?.map(product => {
        if (product?.toppings?.length > 0) {
          toppingPrice += product?.toppings
            ?.map(t => t?.quantity * t?.price * combo.quantity)
            ?.reduce((a, b) => a + b, 0);
        }
      });
    }
    return (
      formatTextNumber(combo?.original * combo?.quantity + toppingPrice) +
      shoppingCart?.storeDetail?.currency
    );
  };

  const renderComboProductItem = combo => {
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

    return products?.map((p, index) => (
      <View key={`product-index-${index}`} style={{marginBottom: 5}}>
        <Text style={styles.defaultText}>
          1x {p?.name}{' '}
          {p?.options?.length > 0 && (
            <Text style={styles.textComboProduct}>
              {` - `}
              {p?.options
                ?.filter(o => o.selected && o.selected != o?.isSetDefault)
                ?.map(item => item?.optionLevelName)
                ?.join(', ')}
            </Text>
          )}
        </Text>
        {p?.toppings?.map(t => (
          <Text style={styles.textComboProduct}>
            {t?.quantity}x {t?.name}
          </Text>
        ))}
        {p?.note && <Text style={styles.textComboProduct}>* {p?.note}</Text>}
      </View>
    ));
  };

  const renderProductItem = product => {
    return (
      <View style={styles.productItemInCombo}>
        {product?.options
          ?.filter(
            item => item?.selected && item?.selected != item?.isSetDefault,
          )
          ?.map((option, index) => (
            <View key={`option-index-${index}`}>
              <Text
                style={[styles.defaultText, styles.textInProductItemInCombo]}>
                {`${option?.name} (${option?.optionLevelName})`}
              </Text>
            </View>
          ))}
        {product?.toppings &&
          product?.toppings
            .filter(topping => topping.quantity > 0)
            ?.map((topping, index) => (
              <View key={`topping-index-${index}`}>
                <Text
                  style={[styles.defaultText, styles.textInProductItemInCombo]}>
                  {topping?.quantity}x {topping?.name}
                </Text>
              </View>
            ))}
      </View>
    );
  };

  const onRefreshPaymentMethod = async () => {
    let storeId = shoppingCart?.storeDetail?.storeId;
    let tmpPaymentConfigList = await getPaymentMethodInStore(storeId);
    setPaymentMethods(tmpPaymentConfigList);
  };

  const onRefreshShippingMethod = async () => {
    let deliveryMethodsResult = await getDeliveryMethods();
    setDeliveryMethods(deliveryMethodsResult);
  };

  return (
    <>
      <Layout title={shoppingCart?.storeDetail?.storeName}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={promiseInProgress}
              onRefresh={initializeData}
            />
          }
          showsVerticalScrollIndicator={false}
          style={styles.container}
          contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.rowItem}>
            <View style={styles.headerInRow}>
              <View style={styles.leftSectionInHeader}>
                <View style={styles.iconBoxInLeftSection}>
                  <CheckoutLocationIcon />
                </View>

                <View>
                  <Text style={[styles.defaultText, styles.textInHeaderInRow]}>
                    {t(TextI18n.deliverTo)}
                  </Text>
                </View>
              </View>

              <View>
                <Button
                  onPress={onChangeLocation}
                  style={styles.changeLocationButton}
                  textStyle={styles.textInChangeLocationButton}
                  text={t(ButtonI18n.changeLocation)}
                />
              </View>
            </View>

            <Separator
              borderStyle="dashed"
              color="#C1C1C1"
              style={styles.separator}
            />

            <View style={styles.textAddressBoxInRow}>
              {currentAddress?.name != null && (
                <Text style={[styles.defaultText, styles.locationName]}>
                  {currentAddress?.name}
                </Text>
              )}
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.defaultText, styles.locationAddress]}>
                {currentAddress?.address}
              </Text>

              <Text style={[styles.defaultText, styles.addressNote]}>
                {currentAddress?.note}
              </Text>
            </View>
          </View>

          <View style={styles.rowItem}>
            <View style={styles.headerInRow}>
              <View style={styles.leftSectionInHeader}>
                <View style={styles.iconBoxInLeftSection}>
                  <CheckoutFnbIcon />
                </View>

                <View>
                  <Text style={[styles.defaultText, styles.textInHeaderInRow]}>
                    {t(TextI18n.orderSummary)}
                  </Text>
                </View>
              </View>

              <View>
                <Button
                  onPress={onOpenStoreDetails}
                  text={t(TextI18n.addItems)}
                  textStyle={[styles.defaultText, styles.addItemLink]}
                />
              </View>
            </View>

            <Separator
              borderStyle="dashed"
              color="#C1C1C1"
              style={styles.separator}
            />

            <View>
              {productDetails?.flatMap((item, idx) => (
                <View
                  key={`checkout-preview-order-idx-${idx}`}
                  style={[
                    styles.orderItemBox,
                    idx + 1 === productDetails?.length &&
                      styles.lastOrderItemBox,
                  ]}>
                  <View style={styles.orderItemLeftBox}>
                    <View style={styles.headerBoxInOrderItemLeftBox}>
                      <TouchableOpacity onPress={() => onRemoveCartItem(idx)}>
                        <CloseIcon />
                      </TouchableOpacity>

                      <Text
                        style={[
                          styles.defaultText,
                          styles.textBold,
                          styles.productName,
                        ]}>
                        {item?.isCombo
                          ? item?.name
                          : item?.productPrice?.priceName}
                      </Text>
                    </View>
                    {item?.isCombo
                      ? renderComboProductItem(item)
                      : renderProductItem(item)}

                    <View style={styles.priceTextBox}>
                      <Text style={styles.priceText}>
                        {formatTextNumber(getPrices(item))}đ
                      </Text>
                      {item?.isCombo && (
                        <Text style={styles.textPriceDiscount}>
                          {totalProductPriceItem(item)}
                        </Text>
                      )}
                    </View>
                    {item?.note?.length > 0 && (
                      <View style={styles.productItemInCombo}>
                        <Text
                          style={[
                            styles.textNoteProduct,
                            styles.textNoteComboProduct,
                          ]}>
                          {item?.note}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.orderItemRightBox}>
                    <View style={styles.productImgBox}>
                      <TouchableOpacity
                        onPress={() => {
                          item?.isCombo
                            ? onOpenComboProductDetails(item, idx)
                            : onOpenProductDetails(item, idx);
                        }}>
                        <Image
                          style={styles.productImg}
                          source={
                            item?.thumbnail
                              ? {uri: item?.thumbnail}
                              : ProductDefault
                          }
                        />
                      </TouchableOpacity>
                    </View>

                    {/* ---------- Product Quantity ---------- */}
                    <View style={styles.quantityControlBox}>
                      <TouchableOpacity onPress={() => updateCart(idx, -1)}>
                        <ReduceIcon />
                      </TouchableOpacity>

                      <View>
                        <Text style={[styles.defaultText, styles.textBold]}>
                          {item.quantity}
                        </Text>
                      </View>

                      <TouchableOpacity onPress={() => updateCart(idx, +1)}>
                        <PlusIcon />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* ---------- Note ---------- */}
          <TouchableOpacity onPress={onFocusNoteControl} activeOpacity={0.8}>
            <View style={styles.rowItem}>
              <View style={[styles.headerInRow, styles.headerInRowNoBorder]}>
                <View style={styles.leftSectionInHeader}>
                  <View style={styles.iconBoxInLeftSection}>
                    <CheckoutNoteIcon />
                  </View>
                  <View>
                    <TextInput
                      multiline
                      ref={noteInputRef}
                      editable={isFocusOnNoteControl}
                      onChangeText={setNote}
                      onFocus={onFocusNoteControl}
                      onBlur={() => setIsFocusOnNoteControl(false)}
                      maxLength={255}
                      placeholder={t(TextI18n.takeNoteToTheStore)}
                      placeholderTextColor="#7C7C7C"
                      style={styles.textNote}
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* ---------- Payment Method ---------- */}
          <TouchableOpacity
            onPress={() => setIsOpenPaymentMethodBox(true)}
            activeOpacity={0.8}>
            <View style={styles.rowItem}>
              <View style={[styles.headerInRow, styles.headerInRowNoBorder]}>
                <View style={styles.leftSectionInHeader}>
                  <View style={styles.iconBoxInLeftSection}>
                    <CheckoutCardIcon />
                  </View>

                  <View>
                    <Text style={[styles.defaultText, styles.textInSmallItem]}>
                      {t(TextI18n.paymentMethod)}
                    </Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.textInSelectedTextBox}>
                      {getSelectedPaymentMethodName()}
                    </Text>
                  </View>
                </View>

                <View style={styles.selectedTextBox}>
                  <View>
                    <ArrowRightIcon />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* ---------- Shipping Method ---------- */}
          <TouchableOpacity
            onPress={() => onClickDeliveryMethods()}
            activeOpacity={0.8}>
            <View style={styles.rowItem}>
              <View style={[styles.headerInRow, styles.headerInRowNoBorder]}>
                <View style={styles.leftSectionInHeader}>
                  <View style={styles.iconBoxInLeftSection}>
                    <CheckoutShippingMethodIcon />
                  </View>
                  <View>
                    <Text style={[styles.defaultText, styles.textInSmallItem]}>
                      {t(TextI18n.shippingMethod)}
                    </Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.textInSelectedTextBox}>
                      {getSelectedShippingMethodName()}
                    </Text>
                  </View>
                </View>
                <View style={styles.selectedTextBox}>
                  <View>
                    <ArrowRightIcon />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* ---------- Promotion ---------- */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onViewVouchers()}>
            <View style={styles.rowItem}>
              <View style={[styles.headerInRow, styles.headerInRowNoBorder]}>
                <View style={styles.leftSectionInHeader}>
                  <View style={styles.iconBoxInLeftSection}>
                    <CheckoutCouponIcon />
                  </View>

                  <View>
                    <Text style={[styles.defaultText, styles.textInSmallItem]}>
                      {paymentSummary?.promotionId
                        ? `${t(TextI18n.numberPromoApplied, {
                            number: 1,
                          })}`
                        : t(TextI18n.noPromoApplied)}
                    </Text>
                  </View>
                </View>

                <ArrowRightIcon />
              </View>
            </View>
          </TouchableOpacity>

          {/* ----------------- Summarize Prices ----------------- */}
          <View style={styles.rowItem}>
            <View style={[styles.summarizePricesBox]}>
              <View style={styles.leftSectionInHeader}>
                <View style={styles.iconBoxInLeftSection}>
                  <CheckoutTotalPriceIcon />
                </View>

                <View>
                  <Text style={[styles.defaultText, styles.textInHeaderInRow]}>
                    {t(TextI18n.paymentSummary)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.priceItemBox}>
              {paymentSummary.originalPrice > 0 && (
                <View style={[styles.priceItem, styles.priceItemMargin]}>
                  <Text>
                    {t(TextI18n.subTotalOrder)} (
                    <Text
                      style={[
                        styles.defaultText,
                        styles.textCheckoutItems,
                        styles.textBold,
                      ]}>
                      {productDetails?.reduce(
                        (total, item) => total + item.quantity,
                        0,
                      )}{' '}
                      {t(TextI18n.checkoutItems)}
                    </Text>
                    ) :
                  </Text>

                  <Text>{formatTextNumber(paymentSummary.originalPrice)}đ</Text>
                </View>
              )}

              <View style={[styles.priceItem, styles.priceItemMargin]}>
                <Text>{t(TextI18n.discountValueOfOrder)}:</Text>

                <Text>
                  -
                  {formatTextNumber(
                    (paymentSummary.originalPrice ?? 0) +
                      (paymentSummary.totalFee ?? 0) +
                      (paymentSummary.totalTax ?? 0) -
                      (paymentSummary.totalPriceAfterDiscount ?? 0),
                  )}
                  đ
                </Text>
              </View>

              {paymentSummary.totalFee > 0 && (
                <View style={[styles.priceItem, styles.priceItemMargin]}>
                  <Text>{t(TextI18n.feeAndTax)}:</Text>

                  <Text>
                    {formatTextNumber(
                      (paymentSummary.totalFee ?? 0) +
                        (paymentSummary.totalTax ?? 0),
                    )}
                    đ
                  </Text>
                </View>
              )}

              {paymentSummary.shippingFee > 0 && (
                <View style={styles.priceItem}>
                  <Text>{t(TextI18n.shippingFee)}:</Text>

                  <Text>{formatTextNumber(paymentSummary.shippingFee)}đ</Text>
                </View>
              )}
            </View>

            <View style={styles.totalPricesBox}>
              <View style={styles.priceItem}>
                <Text style={[styles.defaultText, styles.textInTotalPricesBox]}>
                  {t(TextI18n.totalPriceOrder)}:
                </Text>

                <Text
                  style={[
                    styles.textInTotalPricesBox,
                    styles.activeTextInTotalPricesBox,
                  ]}>
                  {formatTextNumber(
                    paymentSummary.totalPriceAfterDiscount +
                      paymentSummary.shippingFee,
                  )}
                  đ
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* ----------------- Quick view total price and the Place Order button ----------------- */}
        {!isFocusOnNoteControl && (
          <View style={styles.checkoutBox}>
            <View style={styles.totalPriceBoxInCheckoutBox}>
              <Text
                style={[
                  styles.defaultText,
                  styles.totalPriceTextInCheckoutBox,
                ]}>
                {t(TextI18n.totalPriceOrder)}
              </Text>
              <Text style={styles.activeTextInTotalPricesBox}>
                {formatTextNumber(
                  paymentSummary.totalPriceAfterDiscount +
                    paymentSummary.shippingFee,
                )}
                đ
              </Text>
            </View>

            <View>
              <Button
                onPress={onPlaceOrder}
                disabled={
                  promiseInProgress ||
                  !selectedDeliveryMethod ||
                  productDetails === undefined ||
                  productDetails?.length === 0 ||
                  !canPlaceOrder
                }
                activeOpacity={0.8}
                disabledStyle={styles.disableStyleButton}
                style={styles.checkoutButtonContainer}
                textStyle={styles.textInCheckoutButton}
                text={t(ButtonI18n.placeOrder)}
              />
            </View>
          </View>
        )}
        {isShowProductModal && (
          <ProductDetailModal
            isShowProductModal={isShowProductModal}
            editProduct={productDetail}
            currencySymbol={shoppingCart?.storeDetail?.currency}
            AddProductItem={onUpdateProductItem}
            closeProductItemModal={() => {
              setIsShowProductModal(false), setProductDetail(null);
            }}
            isCombo={false}
          />
        )}
      </Layout>

      {/* Show the Payment Method modal */}
      <CheckoutModal
        onRefresh={onRefreshPaymentMethod}
        onClose={closePaymentMethodBox}
        isOpen={isOpenPaymentMethodBox}
        headerText={t(TextI18n.choosePaymentMethod)}>
        {(paymentMethods?.length === 0 || paymentMethods === undefined) && (
          <Text
            style={[
              styles.defaultText,
              styles.textCenter,
              styles.colorTextNoAVailable,
            ]}>
            {t(TextI18n.noAvailablePaymentMethod)}
          </Text>
        )}
        {paymentMethods?.flatMap((item, idx) => (
          <TouchableOpacity
            onPress={() => onSelectPaymentMethod(idx)}
            activeOpacity={0.4}
            key={`checkout-payment-method-idx${idx}-${item.id}`}>
            <View
              style={[
                styles.itemInContentBox,
                idx === paymentMethods.length - 1 && styles.lastMethodItemBox,
              ]}>
              <View style={styles.leftSectionOfItemInContentBox}>
                <Image
                  style={styles.imgInMethodItemBox}
                  source={{uri: getImgUrl(item?.icon)}}
                />

                <Text style={[styles.defaultText, styles.textInMethodItemBox]}>
                  {item?.name}
                </Text>
              </View>

              {selectedPaymentMethod === item?.id && (
                <View>
                  <SelectedTickIcon />
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </CheckoutModal>

      {/* Show the Shipping Method modal */}
      {isOpenShippingMethodBox && (
        <ShippingMethodComponent
          deliveryMethods={deliveryMethods}
          selectedDeliveryMethod={selectedDeliveryMethod}
          onClose={() => setIsOpenShippingMethodBox(false)}
          isOpenShippingMethodBox={isOpenShippingMethodBox}
          isShowAhamoveNotWorking={isShowAhamoveNotWorking}
          currency={shoppingCart?.storeDetail?.currency}
          onConfirmShippingMethod={key => onConfirmShippingMethod(key)}
          onRefreshShippingMethod={onRefreshShippingMethod}
        />
      )}
    </>
  );
}
