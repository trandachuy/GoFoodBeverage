import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Animated,
  Image,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import {usePromiseTracker} from 'react-promise-tracker';
import customerApiService from '../../api-services/customer-api-service';
import Button from '../../components/button';
import FnbTextInput from '../../components/input-controls/text-input';
import Layout from '../../components/layout';
import {
  ArrowRightIcon,
  BlackFilterIcon,
  CancelledIcon,
  CompletedIcon,
  DeliveringIcon,
  DotIcon,
  DrafIcon,
  ProcessingIcon,
  SearchIcon,
  ToConfirmIcon,
} from '../../constants/icons.constants';
import {AstronautWithQuestion, Moon} from '../../constants/images.constants';
import OrderStatus, {
  OrderStatusList,
} from '../../constants/order-status.constants';
import {ScreenName} from '../../constants/screen.constants';
import {DateFormat} from '../../constants/string.constant';
import ButtonI18n from '../../i18n/button.i18n';
import TextI18n from '../../i18n/text.i18n';
import DateTimeUtil from '../../utils/datetime';
import {windowWidth} from '../../utils/dimensions';
import {formatTextNumber} from '../../utils/helpers';
import OrderUtil from '../../utils/order';
import PaymentMethodUtil from '../../utils/payment-method';
import String from '../../utils/string';
import styles from './my-order.style';
const initDate = new Date();

export default function MyOrderScreen() {
  // Constants
  const {t} = useTranslation();
  const refFilterBox = useRef();
  const filterValueRef = useRef({
    timeIdx: 0,
    statusIdx: 0,
    sortByIdx: 0,
    firstRequest: undefined,
    startDate: initDate,
    endDate: initDate,
  }).current;

  const isFocus = useIsFocused();
  const navigation = useNavigation();
  const {promiseInProgress} = usePromiseTracker();

  // The filter box will be run from outside the screen, e.g. -450 to 50.
  const positionRef = useRef(new Animated.Value(-windowWidth)).current;

  // Default values of the controls.
  const defaultSortByList = [
    {value: false, name: t(TextI18n.createdDate), active: true},
    {value: true, name: t(TextI18n.storeName)},
  ];
  const defaultTimeList = [
    {value: 0, name: t(TextI18n.anytime), active: true},
    {value: 1, name: t(TextI18n.setTime)},
  ];

  // States
  const countFilterRef = useRef(0);
  const [keyword, setKeyword] = useState('');
  const [timeList, setTimeList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [sortByList, setSortByList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [startDate, setStartDate] = useState(undefined);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showStartDate, setShowStartDate] = useState(false);
  const [hideBackground, setHideBackground] = useState(false);
  const [isOpenFilterBox, setIsOpenFilterBox] = useState(false);

  // Set default value on the first run.
  useEffect(() => {
    setTimeList([...defaultTimeList]);
    setSortByList([...defaultSortByList]);
    let all = {value: null, name: TextI18n.all, active: true};
    setStatusList([all, ...OrderStatusList]);

    onLoadCustomerOrder(null, false, null, null, null);
  }, []);

  // Hide the status bar on the iOS devices.
  useEffect(() => {
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        StatusBar.setHidden(isFocus);
      }, 1000);
    }
  }, [isFocus]);

  // Toggle effects such as showing and hiding the filter box.
  useEffect(() => {
    if (isOpenFilterBox) {
      setTimeout(() => {
        runAnimation(16);
      }, 100);
    }
  }, [isOpenFilterBox]);

  // It will be run when the user types in the search control.
  useEffect(() => {
    // This line is used to tell React that it doesn't need to call the server on the first time.
    if (filterValueRef.firstRequest === undefined) {
      filterValueRef.firstRequest = false;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      onApplyFilterBox();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  /** This function is used to show the filter box.
   */
  const openFilterBox = () => {
    setIsOpenFilterBox(true);
  };

  /** This function is used to close the filter box.
   */
  const closeFilterBox = () => {
    runAnimation(-windowWidth, false);
  };

  /** This function is used to apply the filter's values and call the API when the user clicks the Apply button.
   */
  const onApplyFilterBox = () => {
    // Get orders by status.
    let totalNumberOfFilter = 0;
    let statusIndex = statusList.findIndex(item => item.active);
    if (statusIndex > 0) {
      totalNumberOfFilter++;
      filterValueRef.statusIdx = statusIndex;
    } else {
      filterValueRef.statusIdx = 0;
    }

    // Sort by the created date or store name.
    let sortIndex = sortByList.findIndex(item => item.active);
    if (sortIndex > 0) {
      filterValueRef.sortByIdx = sortIndex;
    } else {
      filterValueRef.sortByIdx = 0;
    }

    // Receive orders at any time or within a specified period.
    let timeIndex = timeList.findIndex(item => item.active);
    if (timeIndex > 0) {
      totalNumberOfFilter++;
      filterValueRef.timeIdx = timeIndex;
    } else {
      filterValueRef.timeIdx = 0;
    }

    // Set values for the variable, the values will never change when React is rendered.
    if (startDate) {
      filterValueRef.startDate = startDate;
    }

    if (endDate) {
      filterValueRef.endDate = endDate;
    }

    // Convert local date to the UTC date.
    let dateToSearchOrders = {};
    if (timeIndex > 0) {
      let strEndDate = DateTimeUtil.getUtcEndDateString(filterValueRef.endDate);
      dateToSearchOrders.endDate = strEndDate;

      let strStartDate = DateTimeUtil.getUtcStartDateString(
        filterValueRef.startDate,
      );
      dateToSearchOrders.startDate = strStartDate;
    }

    // Set the number of filters on the filter icon's badge.
    countFilterRef.current = totalNumberOfFilter;

    // Re-call animation and close the filter box.
    closeFilterBox();

    // Call server to reload data.
    onLoadCustomerOrder(
      [statusList[filterValueRef.statusIdx]?.value],
      sortByList[filterValueRef.sortByIdx]?.value,
      keyword,
      dateToSearchOrders?.startDate,
      dateToSearchOrders?.endDate,
    );
  };

  /** This function is used to set the active item of the status list when the user clicks on the filter box.
   * @param  {number} index The array index.
   */
  const onChangeStatus = index => {
    let newStatusList = [...statusList];
    newStatusList.forEach((item, idx) => {
      item.active = false;
    });
    newStatusList[index].active = true;
    setStatusList(newStatusList);
  };

  /** This function is used to set the active item of the sort list when the user clicks on the filter box.
   * @param  {number} index The array index.
   */
  const onChangeSort = index => {
    let newSortList = [...sortByList];
    newSortList.forEach((item, idx) => {
      item.active = false;
    });
    newSortList[index].active = true;
    setSortByList(newSortList);
  };

  /** This function is used to set the active item of the time list when the user clicks on the filter box.
   * @param  {number} index The array index.
   */
  const onChangeTime = index => {
    let newTimeList = [...timeList];
    newTimeList.forEach((item, idx) => {
      item.active = false;
    });
    newTimeList[index].active = true;
    setTimeList(newTimeList);
  };

  /** This function is used to check to show or hide the date picker.
   */
  const isShowDateGroup = () => {
    let idx = timeList.findIndex(item => item.active);
    return idx > 0;
  };

  /** This function is used to check to show or hide the date picker.
   * @param {string} value The value will be set for the state.
   */
  const onChangeText = value => {
    setKeyword(value);
  };

  /** This function is used to show the date picker when the user clicks on the From label.
   */
  const onShowStartDatePicker = () => {
    setShowStartDate(!showStartDate);
    setShowEndDate(false);

    onScrollToEnd();
  };

  /** This function is used to show the date picker when the user clicks on the To label.
   */
  const onShowEndDatePicker = () => {
    setShowStartDate(false);
    setShowEndDate(!showEndDate);

    onScrollToEnd();
  };

  const onScrollToEnd = () => {
    setTimeout(() => {
      refFilterBox.current?.scrollToEnd({animated: true});
    }, 500);
  };

  /** This function is used to set value for the Start Date state when the user clicks on the date picker.
   * @param  {date} date The date, for example: 2022-08-10 00:00:00 (date type)
   * @param  {enum} type The end date or start date.
   */
  const onChangeStartDate = (date, type) => {
    setStartDate(date);
    setMinDate(date);
    setShowStartDate(false);
  };

  /** This function is used to set value for the End Date state when the user clicks on the date picker.
   * @param  {date} date The date, for example: 2022-08-10 00:00:00 (date type)
   * @param  {enum} type The end date or start date.
   */
  const onChangeEndDate = (date, type) => {
    setEndDate(date);
    setMaxDate(date);
    setShowEndDate(false);
  };

  /** This function is used to open the order details screen by order id.
   * @param  {guid} orderId The order id, for example: f34137f3-c4e6-443a-948a-ea5b89dc7406
   */
  const onOpenOrderDetails = (orderId, branchId) => {
    navigation?.navigate(ScreenName.orderDetails, {orderId, branchId});
  };

  /** This function is used to load customer's order list.
   * @param  {enum} status The list of states, but the list still contains only a single value,
   * and you can refer to the OrderStatus enum, e.g. [OrderStatus.new]
   * @param  {bool} sortBy Value is true or false, if the value is true we will take orders by the store name.
   * @param  {string} keyword You can find orders by order id or store name.
   * @param  {date} startDate Get all orders from X date.
   * @param  {date} endDate Get all orders to X date.
   */
  const onLoadCustomerOrder = async (
    status,
    sortBy,
    keyword,
    startDate,
    endDate,
  ) => {
    let data = await customerApiService.getCustomerOrderList(
      false,
      status,
      sortBy,
      keyword,
      startDate,
      endDate,
    );
    setOrderList(data.orderList);
  };
  /** This method is used to call animation and reset values for the filter box.
   * @param  {number} toValue It's the value of window width, e.g. -450 or 0.
   * @param  {bool} filterBoxStatus If value is false, the filter box will be reset.
   */
  const runAnimation = (toValue, filterBoxStatus) => {
    Animated.timing(positionRef, {
      toValue: toValue,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      // The arrow function will be recalled when the animation has been completed.
      positionRef.setValue(toValue);
      if (filterBoxStatus != undefined) {
        setIsOpenFilterBox(filterBoxStatus);
        onChangeTime(filterValueRef.timeIdx);
        onChangeSort(filterValueRef.sortByIdx);
        onChangeStatus(filterValueRef.statusIdx);

        setShowEndDate(false);
        setShowStartDate(false);

        setEndDate(undefined);
        setStartDate(undefined);
      }
    });
  };

  /** This function is used to render the filter icon.
   */
  const FilterIcon = ({number}) => {
    return (
      <TouchableOpacity onPress={openFilterBox}>
        <View style={styles.filterIconBox}>
          <BlackFilterIcon />
          {number > 0 && (
            <View style={styles.badgeBox}>
              <Text style={[styles.defaultText, styles.textInBadgeBox]}>
                {number}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusOrder = statusId => {
    switch (statusId) {
      case OrderStatus.Draft:
        return <DrafIcon />;
      case OrderStatus.Processing:
        return <ProcessingIcon />;
      case OrderStatus.ToConfirm:
        return <ToConfirmIcon />;
      case OrderStatus.Delivering:
        return <DeliveringIcon />;
      case OrderStatus.Completed:
        return <CompletedIcon />;
      case OrderStatus.Canceled:
        return <CancelledIcon />;
      default:
        return <DrafIcon />;
    }
  };

  const getOrderStatusDecoration = statusId => {
    let orderTextStyles;
    switch (statusId) {
      case OrderStatus.Draft:
        orderTextStyles = styles.orderStatusTextDraft;
        break;
      case OrderStatus.Processing:
        orderTextStyles = styles.orderStatusTextProcessing;
        break;
      case OrderStatus.ToConfirm:
        orderTextStyles = styles.orderStatusTextConfirm;
        break;
      case OrderStatus.Delivering:
        orderTextStyles = styles.orderStatusTextDelivering;
        break;
      case OrderStatus.Completed:
        orderTextStyles = styles.orderStatusTextCompleted;
        break;
      case OrderStatus.Canceled:
        orderTextStyles = styles.orderStatusTextCancel;
        break;
      default:
        orderTextStyles = styles.orderStatusText;
        break;
    }
    return (
      <Text style={[styles.defaultText, orderTextStyles]}>
        {t(OrderUtil.getStatusName(statusId))}
      </Text>
    );
  };

  return (
    <>
      <Layout
        title={t(TextI18n.myOrderText)}
        topRightComponent={<FilterIcon number={countFilterRef.current} />}>
        <View style={styles.searchBox}>
          <FnbTextInput
            leftIcon={<SearchIcon />}
            placeholder={t(TextI18n.searchByOrderIdOrStoreName)}
            trimSpaces={true}
            height={52}
            containerStyle={styles.searchInput}
            onChangeText={onChangeText}
            onFocus={() => setHideBackground(true)}
            onBlur={() => setHideBackground(false)}
          />
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={promiseInProgress}
              onRefresh={onApplyFilterBox}
            />
          }
          showsVerticalScrollIndicator={false}>
          {orderList?.length > 0 &&
            orderList?.flatMap((item, index) => (
              <TouchableOpacity
                key={`my-orders-idx-${index}`}
                activeOpacity={0.8}
                onPress={() => onOpenOrderDetails(item?.id, item?.branchId)}>
                <View style={styles.orderItemBox}>
                  {getStatusOrder(item?.statusId)}

                  <View>
                    <View style={styles.rowInOrderBox}>
                      {getOrderStatusDecoration(item?.statusId)}
                      <DotIcon />
                      <Text style={[styles.defaultText, styles.orderDateText]}>
                        {DateTimeUtil.utcToLocalDateString(
                          item?.createdTime,
                          DateFormat.MONTH_AND_DAY,
                        )}
                      </Text>
                    </View>

                    <View style={styles.rowInOrderBox}>
                      <Text style={[styles.defaultText, styles.storeName]}>
                        {item?.store?.title}
                      </Text>
                    </View>

                    <View
                      style={[styles.rowInOrderBox, styles.lastRowInOrderBox]}>
                      <Text style={[styles.defaultText, styles.priceText]}>
                        {formatTextNumber(item?.totalPrices)}đ (
                        {t(
                          PaymentMethodUtil.getPaymentMethodName(
                            item.paymentMethodId,
                          ),
                        )}
                        )
                      </Text>
                      <DotIcon />
                      <Text style={[styles.defaultText, styles.orderDateText]}>
                        {item?.totalItems} {t(TextI18n.orderItems)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>

        {(orderList?.length === 0 || orderList === undefined) &&
          !hideBackground && (
            <View>
              <Image
                style={styles.astronautImage}
                source={AstronautWithQuestion}
              />
              <Image style={styles.moonImage} source={Moon} />
            </View>
          )}
      </Layout>

      <Modal
        onRequestClose={closeFilterBox}
        transparent={true}
        visible={isOpenFilterBox}>
        <TouchableWithoutFeedback onPress={closeFilterBox}>
          <View style={styles.transparentBox} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.filterBox, {right: positionRef}]}>
          <ScrollView ref={refFilterBox} showsVerticalScrollIndicator={false}>
            <View style={styles.rowOfFilterItem}>
              <Text style={[styles.defaultText, styles.groupNameOfFilterItem]}>
                {t(TextI18n.status)}
              </Text>

              <View style={styles.controlGroupInFilterItem}>
                {statusList.map((item, idx) => (
                  <TouchableOpacity
                    onPress={() => onChangeStatus(idx)}
                    activeOpacity={0.8}
                    key={`my-order-status-${item.id}-idx-${idx}`}>
                    <View
                      style={[
                        styles.controlItemInGroup,
                        item.active && styles.activeControlItemInGroup,
                      ]}>
                      <Text
                        style={[
                          styles.defaultText,
                          styles.textInControlItemInGroup,
                          item.active && styles.activeTextInControlItemInGroup,
                        ]}>
                        {String.capitalize(t(item.name))}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.rowOfFilterItem}>
              <Text style={[styles.defaultText, styles.groupNameOfFilterItem]}>
                {t(TextI18n.sortBy)}
              </Text>

              <View style={styles.controlGroupInFilterItem}>
                {sortByList.map((item, idx) => (
                  <TouchableOpacity
                    onPress={() => onChangeSort(idx)}
                    activeOpacity={0.8}
                    key={`my-order-sort-by-${item.value}-idx-${idx}`}>
                    <View
                      style={[
                        styles.controlItemInGroup,
                        item.active && styles.activeControlItemInGroup,
                      ]}>
                      <Text
                        style={[
                          styles.defaultText,
                          styles.textInControlItemInGroup,
                          item.active && styles.activeTextInControlItemInGroup,
                        ]}>
                        {t(item.name)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.rowOfFilterItem}>
              <Text style={[styles.defaultText, styles.groupNameOfFilterItem]}>
                {t(TextI18n.fromToFilterOrder)}
              </Text>

              <View style={styles.controlGroupInFilterItem}>
                {timeList.map((item, idx) => (
                  <TouchableOpacity
                    onPress={() => onChangeTime(idx)}
                    activeOpacity={0.8}
                    key={`my-order-time-${item.value}-idx-${idx}`}>
                    <View
                      style={[
                        styles.controlItemInGroup,
                        item.active && styles.activeControlItemInGroup,
                      ]}>
                      <Text
                        style={[
                          styles.defaultText,
                          styles.textInControlItemInGroup,
                          item.active && styles.activeTextInControlItemInGroup,
                        ]}>
                        {t(item.name)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}

                {isShowDateGroup() && (
                  <>
                    <View>
                      <TouchableOpacity onPress={onShowStartDatePicker}>
                        <View style={styles.dateControlBox}>
                          <Text
                            style={[
                              styles.defaultText,
                              styles.leftTextInDateControlBox,
                              showStartDate &&
                                styles.spaceWhenCalendarHasBeenOpened,
                            ]}>
                            {t(TextI18n.from)}
                          </Text>

                          <View style={styles.rightTextBox}>
                            <Text
                              style={[
                                styles.defaultText,
                                styles.textInRightTextBox,
                              ]}>
                              {DateTimeUtil.localTimeString(
                                startDate ?? filterValueRef.startDate,
                                DateFormat.DD_MM_YYYY,
                              )}
                            </Text>

                            <ArrowRightIcon />
                          </View>
                        </View>
                      </TouchableOpacity>

                      {showStartDate && (
                        <View style={styles.calendarPickerBox}>
                          <CalendarPicker
                            maxDate={maxDate}
                            selectedStartDate={filterValueRef.startDate}
                            onDateChange={onChangeStartDate}
                            selectedDayColor="#50429B"
                            selectedDayTextStyle={{color: '#FF8C21'}}
                            todayBackgroundColor="#ffffff"
                            todayTextStyle={{color: '#FF8C21'}}
                            width={windowWidth - 124}
                          />
                        </View>
                      )}
                    </View>

                    <View style={showStartDate && styles.hide}>
                      <TouchableOpacity onPress={onShowEndDatePicker}>
                        <View
                          style={[
                            styles.dateControlBox,
                            styles.lastDateControlBox,
                            showEndDate &&
                              styles.spaceWhenCalendarHasBeenOpened,
                          ]}>
                          <Text
                            style={[
                              styles.defaultText,
                              styles.leftTextInDateControlBox,
                            ]}>
                            {t(TextI18n.to)}
                          </Text>

                          <View style={styles.rightTextBox}>
                            <Text
                              style={[
                                styles.defaultText,
                                styles.textInRightTextBox,
                              ]}>
                              {DateTimeUtil.localTimeString(
                                endDate ?? filterValueRef.endDate,
                                DateFormat.DD_MM_YYYY,
                              )}
                            </Text>

                            <ArrowRightIcon />
                          </View>
                        </View>
                      </TouchableOpacity>

                      {showEndDate && (
                        <View style={styles.calendarPickerBox}>
                          <CalendarPicker
                            minDate={minDate}
                            selectedStartDate={filterValueRef.endDate}
                            onDateChange={onChangeEndDate}
                            selectedDayColor="#50429B"
                            selectedDayTextStyle={{color: '#FF8C21'}}
                            todayBackgroundColor="#ffffff"
                            todayTextStyle={{color: '#FF8C21'}}
                            width={windowWidth - 124}
                          />
                        </View>
                      )}
                    </View>
                  </>
                )}
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonBoxInFilterBox}>
            <Button
              activeOpacity={0.5}
              text={t(ButtonI18n.apply)}
              style={styles.buttonInFilterBox}
              textStyle={styles.textInButtonInFilterBox}
              onPress={onApplyFilterBox}
            />
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}
