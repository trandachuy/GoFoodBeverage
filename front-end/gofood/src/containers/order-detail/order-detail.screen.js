import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Toast} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  AppState,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {usePromiseTracker} from 'react-promise-tracker';
import {useDispatch, useSelector} from 'react-redux';
import orderApiService from '../../api-services/order-api-service';
import Button from '../../components/button';
import ConfirmationModal from '../../components/confirmation-modal';
import Layout from '../../components/layout';
import DatabaseKeys from '../../constants/database-keys.constants';
import {
  CheckoutNoteIcon,
  OrderCancelledIcon,
  OrderCompleteIcon,
  OrderDeliveringIcon,
  OrderPreparingIcon,
  RadioIcon,
  StoreLocationIcon,
} from '../../constants/icons.constants';
import {OrderCancelled, OrderCompelete} from '../../constants/images.constants';
import OrderPaymentStatus from '../../constants/order-payment-status';
import OrderStatus, {
  OrderProcessStatus,
  OrderStepList,
} from '../../constants/order-status.constants';
import {ScreenName} from '../../constants/screen.constants';
import {DateFormat} from '../../constants/string.constant';
import {getCart, setCart} from '../../data-services/cart-data-service';
import ButtonI18n from '../../i18n/button.i18n';
import MessageI18n from '../../i18n/message.i18n';
import TextI18n from '../../i18n/text.i18n';
import DateTimeUtil from '../../utils/datetime';
import {formatTextNumber} from '../../utils/helpers';
import styles from './order-detail.style';

export default function OrderDetailScreen() {
  const {t} = useTranslation();
  const {promiseInProgress} = usePromiseTracker();
  const firstLoad = useRef(true);
  const appState = useRef(AppState.currentState);
  const [orderItems, setOrderItems] = useState([]);
  const [initDataOrder, setInitDataOrder] = useState({});
  const shoppingCart = useSelector(getCart);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [contentMessageModalConfirm, setContentMessageModalConfirm] =
    useState(null);
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    reloadData();
  }, [route]);

  const reloadData = () => {
    const {orderId, branchId, resultCode} = route?.params;
    if (resultCode == 0) {
      onSuccessfulPaymentConfirmation(orderId);
    } else {
      getInitData(orderId, branchId);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        let orderInfo = route?.params?.vnPayTransInfo;
        if (orderInfo) {
          orderApiService
            .updateOrderByVnPayWalletSdkAsync(orderInfo)
            .then(res => {
              if (res) {
                if (firstLoad.current) {
                  firstLoad.current = false;
                  Toast.show({title: t(MessageI18n.paymentSuccessfully)});
                }
                getInitData(orderInfo.orderId, orderInfo.branchId);
              }
            });
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const getInitData = async (orderId, branchId) => {
    let res = await orderApiService.getOrderDetailByIdAsync(orderId, branchId);
    if (res?.order) {
      setInitDataOrder(res?.order);
      let orderItems = mappingToDataTable(res.orderItem);
      setOrderItems(orderItems);
    }
  };

  const mappingToDataTable = orderItems => {
    let gross_Total = 0;
    return orderItems?.map((item, index) => {
      return {
        no: (index += 1),
        productName: item?.isCombo
          ? item?.productPriceName
          : item?.productPrice?.product?.name,
        price: item?.productPrice?.priceValue,
        amount: item?.quantity,
        orderItemOptions: item?.orderItemOptions,
        orderItemToppings: item?.orderItemToppings,
        discount: item?.promotionDiscountValue,
        cost: item?.cost,
        grossTotal: (gross_Total +=
          item?.quantity * item?.productPrice?.priceValue),
        totalFee: item?.totalFee,
        totalTax: item?.totalTax,
        productPriceId: item?.productPriceId,
        productId: item?.productPrice?.product?.id,
        description: item?.productPrice?.product?.description,
        originalPrice: item?.originalPrice,
        thumbnail: item?.productPrice?.product?.thumbnail,
        note: item?.notes,
        orderComboItem: item?.orderComboItem,
        priceAfterDiscount: item?.priceAfterDiscount,
        isCombo: item?.isCombo,
      };
    });
  };

  const listStepOrder = [
    t(OrderStepList.creatingOrder),
    t(OrderStepList.preparing),
    t(OrderStepList.delivering),
  ];

  const onPressReOrder = () => {
    if (
      shoppingCart.storeId !== initDataOrder?.storeId &&
      shoppingCart?.productDetail?.length > 0
    ) {
      setContentMessageModalConfirm(t(TextI18n.resetCartOnMobile));
      setShowModalConfirm(true);
    } else if (
      shoppingCart.storeId === initDataOrder?.storeId &&
      shoppingCart?.productDetail?.length > 0
    ) {
      setContentMessageModalConfirm(t(TextI18n.resetCartInStore));
      setShowModalConfirm(true);
    } else {
      handleResetCard();
      navigation.navigate(ScreenName.checkout, {
        initialDataReOrder: initDataOrder,
        isReOrder: true,
      });
    }
  };

  const onConfirm = () => {
    handleResetCard();
    setShowModalConfirm(false);
    navigation.navigate(ScreenName.checkout, {
      initialDataReOrder: initDataOrder,
      isReOrder: true,
    });
  };

  const onCancel = () => {
    setShowModalConfirm(false);
  };

  const handleResetCard = async () => {
    let productDetails = [];
    const {store} = initDataOrder;
    for (let orderItem of orderItems) {
      let productItem = null;
      if (orderItem?.isCombo) {
        const {orderComboItem} = orderItem;
        const {orderComboProductPriceItems} = orderComboItem;
        let products = [];
        let comboPricingProducts = [];
        for (let orderComboItemPP of orderComboProductPriceItems) {
          let orderComboProductItem = {
            comboPricingId: orderComboItem?.comboPricingId,
            name: orderComboItemPP?.itemName,
            options: orderComboItemPP?.orderItemOptions?.map(optionItem => {
              return {
                ...optionItem,
                isSetDefault: true,
                name: optionItem?.optionName,
                selected: true,
              };
            }),
            productPriceId: orderComboItemPP?.productPriceId,
            productPrices: orderComboItemPP?.productPrice,
            toppings: orderComboItemPP?.orderItemToppings?.map(toppingItem => {
              return {
                ...toppingItem,
              };
            }),
          };
          let comboPricingProductItem = {...orderComboProductItem};
          comboPricingProducts.push(comboPricingProductItem);
          products.push(orderComboProductItem);
        }
        productItem = {
          comboId: orderComboItem?.comboId,
          comboPricingId: orderComboItem?.comboPricingId,
          comboPricingProducts: comboPricingProducts,
          isCombo: true,
          isComboPricing: orderComboItem?.comboPricingId ? true : false,
          name: orderComboItem?.comboName,
          original: orderItem?.originalPrice,
          priceAfterDiscount: orderItem?.priceAfterDiscount,
          products: products,
          quantity: orderItem?.amount,
          thumbnail: orderItem?.thumbnail,
        };
      } else {
        productItem = {
          description: orderItem?.description,
          id: orderItem?.productId,
          isCombo: false,
          isPromo: false,
          name: orderItem?.productName,
          options: orderItem?.orderItemOptions?.map(option => {
            let item = {
              id: option?.id,
              name: option?.optionName,
              optionLevelId: option?.optionLevelId,
              optionLevelName: option?.optionLevelName,
            };
            return item;
          }),
          original: orderItem?.originalPrice,
          productPrice: {
            id: orderItem?.productPriceId,
            priceName: orderItem?.productName,
            priceValue: orderItem?.price,
          },
          quantity: orderItem?.amount,
          thumbnail: orderItem?.thumbnail,
          toppings: orderItem?.orderItemToppings?.map(topping => {
            let item = {
              id: topping?.id,
              name: topping?.toppingName,
              price: topping?.toppingValue,
              quantity: topping?.quantity,
            };
            return item;
          }),
        };
      }

      productDetails.push(productItem);
    }

    let cartResetValue = {
      ...shoppingCart,
      branchId: initDataOrder?.branchId,
      productDetail: productDetails,
      storeId: initDataOrder?.storeId,
      storeName: initDataOrder?.orderDelivery?.senderName,
    };
    let branch = store?.storeBranches.find(
      a => a.id == initDataOrder?.branchId,
    );
    let newCartInfo = {
      ...cartResetValue,
      storeDetail: {
        storeId: store?.id,
        storeName: store?.title,
        branchId: initDataOrder?.branchId,
        branchName: branch?.name,
        currency: store?.currency?.symbol,
      },
    };

    dispatch(setCart(newCartInfo));
    await AsyncStorage.setItem(
      DatabaseKeys.orderCart,
      JSON.stringify(newCartInfo),
    );
  };

  const onSuccessfulPaymentConfirmation = async orderId => {
    let req = {
      orderId: orderId,
      orderStatus: OrderStatus.ToConfirm,
      orderPaymentStatusId: OrderPaymentStatus.paid,
    };
    let orderUpdate = await orderApiService.updateStatusOrderPaymentAsync(req);
    if (orderUpdate.success) {
      getInitData(orderId, orderUpdate.branchId);
    }
  };

  const getCurrentPositionOrder = statusId => {
    switch (statusId) {
      case OrderStatus.ToConfirm || OrderStatus.Draft:
        return OrderProcessStatus.ToConfirm;
      case OrderStatus.Processing:
        return OrderProcessStatus.Processing;
      case OrderStatus.Delivering:
        return OrderProcessStatus.Delivering;
      default:
        return OrderProcessStatus.ToConfirm;
    }
  };

  const renderFormOrderCancelledOrComplete = orderStatusId => {
    return (
      <View style={styles.viewHeader}>
        <ImageBackground
          imageStyle={styles.borderRadiusImage}
          style={styles.imageCanceled}
          source={
            orderStatusId == OrderStatus.Canceled
              ? OrderCancelled
              : OrderCompelete
          }>
          <View style={styles.viewOrderCancelled}>
            {orderStatusId == OrderStatus.Canceled ? (
              <>
                <Text style={styles.textOrderCanceled}>
                  {t(TextI18n.orderCanceled)}
                </Text>
                <View style={styles.viewIconCancelled}>
                  <OrderCancelledIcon style={styles.IconCancelled} />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.textOrderCanceled}>
                  {t(TextI18n.howWasTheStore)}
                </Text>
                <View style={styles.viewIconCancelled}>
                  <OrderCompleteIcon style={styles.IconCancelled} />
                </View>
              </>
            )}
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <>
      <Layout title={t('text.orderDetail')} backToScreen={ScreenName.myOrder}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={promiseInProgress}
              onRefresh={reloadData}
            />
          }
          showsVerticalScrollIndicator={false}
          style={
            (initDataOrder?.statusId == OrderStatus?.Canceled ||
              initDataOrder?.statusId == OrderStatus?.Completed) &&
            styles.containOrderDetail
          }>
          {initDataOrder?.statusId == OrderStatus.Canceled ||
          initDataOrder?.statusId == OrderStatus.Completed ? (
            renderFormOrderCancelledOrComplete(initDataOrder?.statusId)
          ) : (
            <View style={styles.viewNotComplete}>
              {
                <View style={styles.viewOrderNotComplete}>
                  <View style={styles.orderNotComplete}>
                    <StepIndicator
                      stepCount={3}
                      customStyles={styles.indicatorStyles}
                      currentPosition={getCurrentPositionOrder(
                        initDataOrder?.statusId,
                      )}
                      labels={listStepOrder}
                    />
                  </View>
                  <View style={styles.iconOrderNotComplete}>
                    {initDataOrder?.statusId == OrderStatus?.Processing ? (
                      <OrderPreparingIcon />
                    ) : (
                      <OrderDeliveringIcon />
                    )}
                  </View>
                </View>
              }
            </View>
          )}

          <View style={styles.viewOrderDetail}>
            <View style={styles.viewOrderDetailsItem}>
              <Text style={styles.orderTitle}>
                {t(TextI18n.orderInformation)}
              </Text>
              <View style={styles.orderInfo}>
                <Text style={styles.labelOrderTitle}>
                  {t(TextI18n.orderDate)}
                </Text>
                <Text style={styles.textOrderTitle}>
                  {DateTimeUtil.utcToLocalDateString(
                    initDataOrder?.createdTime,
                    DateFormat.MONTH_AND_DAY_HH_MM,
                  )}
                </Text>
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.labelOrderTitle}>
                  {t(TextI18n.orderID)}
                </Text>
                <Text style={styles.textOrderTitle}>
                  {initDataOrder?.stringCode}
                </Text>
              </View>
            </View>
            <View style={styles.viewOrderDetailsItem}>
              <Text style={styles.orderTitle}>
                {t(TextI18n.deliveryDetail)}
              </Text>
              <View style={styles.viewDeliveryDetail}>
                <View>
                  <StoreLocationIcon />
                </View>
                <View>
                  <Text style={styles.labelStoreLocation}>
                    {t(TextI18n.storeLocation)}
                  </Text>
                  <Text numberOfLines={2} style={styles.textStoreLocation}>
                    {initDataOrder?.orderDelivery?.senderAddress} -{' '}
                    {initDataOrder?.orderDelivery?.senderName}
                  </Text>
                </View>
              </View>
              <View style={styles.viewDeliveryDetail}>
                <View>
                  <RadioIcon />
                </View>
                <View>
                  <Text style={styles.labelStoreLocation}>
                    {t(TextI18n.deliveryLocation)}
                  </Text>
                  <Text style={styles.textReceiverAddress}>
                    {initDataOrder?.orderDelivery?.receiverAddress}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.viewOrderDetailsItem}>
              <Text style={styles.orderTitle}>
                {t(TextI18n.orderItemDetail)}
              </Text>
              {orderItems?.map(orderItem => (
                <>
                  <View style={styles.viewDeliveryDetail}>
                    <Text style={styles.textOrderItems}>
                      {orderItem?.productName}
                    </Text>
                    <Text style={styles.textOrderItemsQuantity}>
                      {orderItem?.amount}
                    </Text>
                  </View>
                  {orderItem?.isCombo ? (
                    <View>
                      {orderItem?.orderComboItem?.orderComboProductPriceItems?.map(
                        (ocpp, indexComboItem) => (
                          <View key={`combo-item-index-${indexComboItem}`}>
                            <Text style={{marginLeft: 5}}>
                              1x {ocpp?.itemName}
                            </Text>
                            {ocpp?.orderItemOptions?.map((oio, index) => (
                              <View
                                key={`option-index-${index}`}
                                style={styles.viewComboOption}>
                                <Text style={styles.textOrderItem}>
                                  {oio?.optionName}
                                </Text>
                                <Text style={styles.textOrderItemQuantity}>
                                  {oio?.optionLevelName}
                                </Text>
                              </View>
                            ))}
                            {ocpp?.orderItemToppings?.map((oit, index) => (
                              <View
                                key={`topping-index-${index}`}
                                style={styles.viewComboOption}>
                                <Text style={styles.textOrderItem}>
                                  {oit?.toppingName}
                                </Text>
                                <Text style={styles.textOrderItemQuantity}>
                                  {oit?.quantity}
                                </Text>
                              </View>
                            ))}
                            {ocpp?.note && (
                              <Text
                                style={[
                                  styles.textOrderItem,
                                  {marginLeft: 15},
                                ]}>
                                *{ocpp?.note}
                              </Text>
                            )}
                          </View>
                        ),
                      )}
                    </View>
                  ) : (
                    <>
                      {orderItem?.orderItemOptions?.length > 0 &&
                        orderItem?.orderItemOptions?.map(
                          (orderItemOption, index) => (
                            <View
                              key={`option-index-${index}`}
                              style={styles.viewProductOption}>
                              <Text
                                numberOfLines={1}
                                style={styles.textOrderItem}>
                                {orderItemOption?.optionName}
                              </Text>
                              <Text style={styles.textOrderItemQuantity}>
                                {orderItemOption?.optionLevelName}
                              </Text>
                            </View>
                          ),
                        )}
                      {orderItem?.orderItemToppings?.length > 0 &&
                        orderItem?.orderItemToppings
                          ?.filter(item => item.quantity > 0)
                          .map((orderItemTopping, index) => (
                            <View
                              key={`topping-index-${index}`}
                              style={styles.viewProductOption}>
                              <Text style={styles.textOrderItem}>
                                {orderItemTopping?.toppingName}
                              </Text>
                              <Text style={styles.textOrderItemQuantity}>
                                {orderItemTopping?.quantity}
                              </Text>
                            </View>
                          ))}
                    </>
                  )}

                  {orderItem?.note && (
                    <Text
                      style={[styles.textOrderItem, styles.textNoteProduct]}>
                      *{orderItem?.note}
                    </Text>
                  )}
                </>
              ))}
              {initDataOrder?.note?.length > 0 && (
                <View style={styles.viewNote}>
                  <CheckoutNoteIcon />
                  <Text style={styles.textNote}>{initDataOrder?.note}</Text>
                </View>
              )}
            </View>

            <View style={styles.viewOrderDetailsItem}>
              <Text style={styles.orderTitle}>{t(TextI18n.paymentDetail)}</Text>
              <View style={styles.viewDeliveryDetail}>
                <Text style={styles.labelPaymentDetail}>
                  {t(TextI18n.subTotalOrder)}
                </Text>
                <Text style={styles.textPaymentDetail}>
                  {formatTextNumber(initDataOrder?.originalPrice)}
                </Text>
              </View>
              <View style={styles.viewDeliveryDetail}>
                <Text style={styles.labelPaymentDetail}>
                  {t(TextI18n.discountValueOfOrder)}
                </Text>
                <Text style={styles.textPaymentDetail}>
                  - {formatTextNumber(initDataOrder?.totalDiscountAmount)}
                </Text>
              </View>
              <View style={styles.viewDeliveryDetail}>
                <Text style={styles.labelPaymentDetail}>
                  {t(TextI18n.feeAndTax)}
                </Text>
                <Text style={styles.textPaymentDetail}>
                  {formatTextNumber(
                    (initDataOrder?.totalFee ?? 0) +
                      (initDataOrder?.totalTax ?? 0),
                  )}
                </Text>
              </View>
              <View style={styles.viewDeliveryDetail}>
                <Text style={styles.labelPaymentDetail}>
                  {t(TextI18n.shippingFee)}
                </Text>
                <Text style={styles.textPaymentDetail}>
                  {formatTextNumber(initDataOrder?.deliveryFee)}
                </Text>
              </View>
            </View>
            <View style={[styles.viewTotal, styles.viewTotalBorderBottom]}>
              <Text style={styles.labelTotal}>
                {t(TextI18n.totalPriceOrder)}
              </Text>
              <Text style={styles.textTotal}>
                {formatTextNumber(initDataOrder?.totalAmount)}
              </Text>
            </View>
            <View style={styles.viewTotal}>
              <Text style={styles.labelTotal}>{t(TextI18n.paymentMethod)}</Text>
              <Text style={styles.textPaymentMethod}>
                {initDataOrder?.paymentMethodName}
              </Text>
            </View>
            <View style={styles.viewTotal}>
              <Text style={styles.labelTotal}>
                {t(TextI18n.paymentStatusName)}
              </Text>
              {initDataOrder?.statusId != OrderStatus?.Draft && (
                <Text
                  style={[
                    styles.textPaymentMethod,
                    styles.colorPaymentStatusName,
                  ]}>
                  {initDataOrder?.orderPaymentStatusName}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
        {(initDataOrder?.statusId == OrderStatus?.Canceled ||
          initDataOrder?.statusId == OrderStatus?.Completed) && (
          <>
            <View style={styles.reOrderBox}>
              <Button
                style={styles.reOrderBox.buttonReOrder}
                onPress={onPressReOrder}
                text={t(ButtonI18n.reOrder)}
                textStyle={styles.reOrderBox.buttonReOrder.textStyle}
              />
            </View>
            <ConfirmationModal
              visible={showModalConfirm}
              onCancel={onCancel}
              onOk={onConfirm}
              contentKey={contentMessageModalConfirm}
            />
          </>
        )}
      </Layout>
    </>
  );
}
