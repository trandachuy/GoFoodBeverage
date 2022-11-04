import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import DeliveryMethod from '../../../constants/delivery-method';
import {
  AhamoveDeliveryIcon,
  CheckCircleIcon,
  SelectedTickIcon,
  SelfDeliveryIcon,
} from '../../../constants/icons.constants';
import ButtonI18n from '../../../i18n/button.i18n';
import MessageI18n from '../../../i18n/message.i18n';
import TextI18n from '../../../i18n/text.i18n';
import {formatTextNumber} from '../../../utils/helpers';
import styles from './../checkout.style';
import CheckoutModal from './../components/modal';

export default function ShippingMethodComponent(props) {
  const {
    currency,
    deliveryMethods,
    selectedDeliveryMethod,
    isOpenShippingMethodBox,
    onClose,
    isShowAhamoveNotWorking,
    onConfirmShippingMethod,
    onRefreshShippingMethod,
  } = props;
  const {t} = useTranslation();

  const {control, setValue, handleSubmit} = useForm();
  const [isSelectDeliveryMethod, setIsSelectDeliveryMethod] = useState(false);

  useEffect(() => {
    setValue(`selectedDeliveryMethod`, selectedDeliveryMethod);
    setIsSelectDeliveryMethod(selectedDeliveryMethod != null);
  }, []);

  const onSubmit = data => {
    onConfirmShippingMethod(data.selectedDeliveryMethod);
  };

  return (
    <>
      <CheckoutModal
        onRefresh={onRefreshShippingMethod}
        onClose={onClose}
        isOpen={isOpenShippingMethodBox}
        headerText={t(TextI18n.chooseShippingMethod)}>
        {(deliveryMethods?.length === 0 || deliveryMethods === undefined) && (
          <Text
            style={[
              styles.defaultText,
              styles.textCenter,
              styles.colorTextNoAVailable,
            ]}>
            {t(TextI18n.noAvailableShippingMethod)}
          </Text>
        )}
        <View style={styles.deliveryMethodContainer}>
          <Controller
            control={control}
            defaultValue={selectedDeliveryMethod}
            render={({field: {onChange, value}}) => (
              <>
                {deliveryMethods?.flatMap((item, idx) => (
                  <TouchableOpacity
                    onPress={() => {
                      onChange(item.id), setIsSelectDeliveryMethod(true);
                    }}
                    disabled={item?.feeValue == 0}
                    activeOpacity={0.4}
                    key={item.id}>
                    <View
                      style={[
                        styles.itemInContentBox,
                        idx === deliveryMethods.length - 1 &&
                          styles.lastMethodItemBox,
                      ]}>
                      <View style={styles.leftSectionOfItemInContentBox}>
                        {item?.enumId === DeliveryMethod.selfDelivery ? (
                          <SelfDeliveryIcon style={styles.imgInMethodItemBox} />
                        ) : (
                          <AhamoveDeliveryIcon
                            style={styles.imgInMethodItemBox}
                          />
                        )}
                        <Text
                          style={[
                            styles.defaultText,
                            styles.textInMethodItemBox,
                          ]}>
                          {item?.name}
                        </Text>
                      </View>
                      <View style={styles.viewItemRight}>
                        {item?.feeValue == 0 &&
                        item?.enumId === DeliveryMethod.ahaMove ? (
                          <Text style={styles.textFeeValue}>-</Text>
                        ) : (
                          <Text style={styles.textFeeValue}>
                            {formatTextNumber(item?.feeValue)}
                            {currency}
                          </Text>
                        )}

                        <View style={styles.viewCheckDeliveryMethod}>
                          {value === item?.id && <SelectedTickIcon />}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
            name="selectedDeliveryMethod"
          />

          <SafeAreaView style={styles.confirmShippingMethodBtn}>
            {isShowAhamoveNotWorking && (
              <View style={styles.viewAhamoveNotWorking}>
                <CheckCircleIcon />
                <Text style={styles.textAhamoveNotWorking}>
                  {t(MessageI18n.ahaMoveNotWorking)}
                </Text>
              </View>
            )}
            {deliveryMethods?.length > 0 && (
              <TouchableOpacity
                disabled={!isSelectDeliveryMethod}
                style={[
                  styles.btnComfirmDeliveryMethod,
                  !isSelectDeliveryMethod &&
                    styles.disabledComfirmDeliveryMethod,
                ]}
                onPress={handleSubmit(onSubmit)}>
                <Text style={styles.textBtnomfirmDeliveryMethod}>
                  {t(ButtonI18n.confirm)}
                </Text>
              </TouchableOpacity>
            )}
          </SafeAreaView>
        </View>
      </CheckoutModal>
    </>
  );
}
