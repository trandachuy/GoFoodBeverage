import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CheckIcon,
  LeftArrowIcon,
  PlusIcon,
  ReduceIcon,
  SubtractIcon,
} from '../../constants/icons.constants';
import {ProductDefault} from '../../constants/images.constants';
import {Platforms} from '../../constants/platform.constants';
import ButtonI18n from '../../i18n/button.i18n';
import TextI18n from '../../i18n/text.i18n';
import {formatTextNumber} from '../../utils/helpers';
import styles from './style';

export default function ProductDetailModal(props) {
  const {
    isShowProductModal,
    editProduct,
    currencySymbol,
    AddProductItem,
    closeProductItemModal,
    isCombo,
  } = props;

  const {control, getValues, setValue} = useForm();

  const pageData = {
    maxLengthNote: 200,
  };
  const {t} = useTranslation();
  const [totalProductPrice, setTotalProductPrice] = useState(null);

  useEffect(() => {
    getTotalProductPrice();
    setDefaultFormValues();
  }, []);

  const setDefaultFormValues = () => {
    editProduct?.options?.map((option, index) => {
      getDefaultsValueOptionLevel(option?.name, option?.optionLevel, index);
    });
    editProduct?.toppings?.map((topping, index) => {
      setValue(`toppings[${index}].id`, topping?.id);
      setValue(`toppings[${index}].name`, topping?.name);
    });

    var productPrice = editProduct?.productPrices?.find(item => item.selected);
    var id =
      productPrice != null
        ? productPrice.id
        : editProduct?.productPrices[0]?.id;
    setValue(`productPriceId`, id);

    let note = '';
    if (editProduct?.note != undefined || editProduct?.note != null) {
      note = editProduct?.note;
    }
    setValue(`note`, note);
  };

  const getTotalProductPrice = () => {
    const values = getValues();
    const {quantity, toppings, productPriceId} = values;

    let priceValue = 0;
    if (!isCombo) {
      if (editProduct?.productPrices?.length > 0) {
        let productSelected = editProduct?.productPrices?.find(
          pp => pp?.id == productPriceId,
        );
        priceValue += productSelected?.priceValue * quantity;
      } else {
        priceValue += editProduct?.original * quantity;
      }
    }

    if (toppings?.length > 0) {
      priceValue += toppings?.reduce(
        (total, pt) => (total = total + pt.price * pt?.quantity * quantity),
        0,
      );
    }
    setTotalProductPrice(priceValue);
  };

  const getPriceValue = priceValue => {
    let total = formatTextNumber(priceValue) + currencySymbol;
    return total;
  };

  const getDefaultsValueOptionLevel = (name, optionLevels, index) => {
    let olSelected = optionLevels?.find(ol => ol?.selected === true);
    if (olSelected == null) {
      olSelected = optionLevels?.find(ol => ol?.isSetDefault === true);
    }
    onChangeOptionLevel(name, olSelected, index);
    return olSelected?.id;
  };

  const onChangeOptionLevel = (name, optionLevel, index) => {
    setValue(`options[${index}].selected`, true);
    setValue(`options[${index}].optionLevelId`, optionLevel?.id);
    setValue(`options[${index}].optionLevelName`, optionLevel?.name);
    setValue(`options[${index}].isSetDefault`, optionLevel?.isSetDefault);
  };

  const onSubmit = () => {
    const values = getValues();
    const {quantity, productPriceId, options, toppings, note} = values;

    let productPriceSelected = editProduct?.productPrices?.find(
      p => p.id === productPriceId,
    );
    let productPrice = {
      id: productPriceSelected?.id,
      priceName:
        productPriceSelected?.priceName?.length > 0
          ? `${editProduct?.name} (${productPriceSelected?.priceName})`
          : editProduct?.name,
      priceValue: productPriceSelected?.priceValue,
    };
    let productDetail = {
      id: editProduct?.id,
      productCategoryId: editProduct?.productCategoryId,
      name: editProduct?.name,
      quantity: quantity,
      productPrice: productPrice,
      options: options,
      toppings: toppings,
      note: note,
      original: editProduct?.original,
      thumbnail: editProduct?.thumbnail,
    };
    AddProductItem(productDetail);
  };

  const renderFooter = () => {
    const values = getValues();
    const {quantity} = values;
    return (
      <>
        {isCombo ? (
          <TouchableOpacity
            onPress={() => onSubmit()}
            style={[styles.viewBtnAdd]}>
            <Text style={styles.titleBtnAdd}>{t(ButtonI18n.update)}</Text>
            {totalProductPrice > 0 && (
              <Text style={styles.total}>
                {' '}
                - {getPriceValue(totalProductPrice)}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => onSubmit()}
            style={styles.viewBtnAdd}>
            <Text style={styles.titleBtnAdd}>{`${t(
              TextI18n.addToCart,
            )} - `}</Text>
            <Text style={styles.total}>{getPriceValue(totalProductPrice)}</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  const keyboardVerticalOffset = Platform.OS === Platforms.IOS ? 150 : -500;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isShowProductModal}>
      <View style={styles.container}>
        <View style={styles.form}>
          <TouchableOpacity
            onPress={() => closeProductItemModal()}
            style={styles.viewBack}>
            <LeftArrowIcon />
          </TouchableOpacity>
          <View>
            <View style={styles.viewImageProduct}>
              <Image
                style={styles.imageProduct}
                source={
                  editProduct?.thumbnail
                    ? {uri: editProduct?.thumbnail}
                    : ProductDefault
                }
              />
            </View>
          </View>

          {isCombo ? (
            <Text
              style={[styles.titleProduct, styles.marginBottomTitleProduct]}>
              {editProduct?.productPrices[0]?.priceName != null
                ? `${editProduct?.name} (${editProduct?.productPrices[0]?.priceName})`
                : editProduct?.name}
            </Text>
          ) : (
            <>
              <View style={styles.viewTitleProduct}>
                <Text style={styles.titleProduct}>{editProduct?.name}</Text>
                {editProduct?.productPrices?.length === 1 && (
                  <View style={styles.productPriceNameSingle}>
                    <Controller
                      control={control}
                      defaultValue={editProduct?.productPrices[0]?.id}
                      render={() => (
                        <Text style={styles.textProductPriceName}>
                          {getPriceValue(
                            editProduct?.productPrices[0]?.priceValue,
                          )}
                        </Text>
                      )}
                      name={`productPriceId`}
                    />
                  </View>
                )}
              </View>
            </>
          )}

          <ScrollView showsVerticalScrollIndicator={false}>
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={keyboardVerticalOffset}>
              {!isCombo ? (
                <>
                  <View style={styles.viewProductPrices}>
                    {editProduct?.productPrices?.length > 1 && (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        <Controller
                          control={control}
                          defaultValue={editProduct?.productPrices[0]?.id}
                          render={({field: {onChange, value}}) => (
                            <>
                              {editProduct?.productPrices?.map(
                                (item, index) => (
                                  <TouchableOpacity
                                    key={index}
                                    disabled={value === item?.id}
                                    onPress={() => {
                                      onChange(item?.id),
                                        getTotalProductPrice();
                                    }}>
                                    <View
                                      style={[
                                        styles.viewProductPrice,
                                        value === item?.id &&
                                          styles.bgProductPriceSelected,
                                      ]}>
                                      <View style={styles.productPriceName}>
                                        <Text
                                          style={styles.textProductPriceName}>
                                          {item?.priceName}
                                        </Text>
                                      </View>
                                      <View style={styles.viewTextProductPrice}>
                                        <Text
                                          style={[
                                            styles.productPrice,
                                            value === item?.id &&
                                              styles.colorProductPriceSelected,
                                          ]}>
                                          {getPriceValue(item?.priceValue)}
                                        </Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ),
                              )}
                            </>
                          )}
                          name={`productPriceId`}
                        />
                      </ScrollView>
                    )}
                  </View>
                </>
              ) : null}

              {editProduct?.options?.length > 0 && (
                <>
                  <Text style={styles.txtOption}>{t(TextI18n.option)}</Text>
                  <View style={styles.viewOption}>
                    {editProduct?.options?.map((item, index) => (
                      <View key={index}>
                        <Controller
                          control={control}
                          defaultValue={item?.name}
                          render={() => (
                            <View style={styles.viewOptionName}>
                              <Text style={styles.textOptionName}>
                                {item?.name}
                              </Text>
                            </View>
                          )}
                          name={`options[${index}].name`}
                        />
                        <Controller
                          control={control}
                          defaultValue={item?.id}
                          render={() => (
                            <View style={styles.viewOptionLevel}>
                              <Controller
                                control={control}
                                render={({field: {onChange, value}}) => (
                                  <>
                                    {item?.optionLevel?.map(
                                      (optionLevel, i) => (
                                        <>
                                          <TouchableOpacity
                                            key={optionLevel?.id}
                                            onPress={() => {
                                              onChange(optionLevel?.id),
                                                onChangeOptionLevel(
                                                  item?.item,
                                                  optionLevel,
                                                  index,
                                                );
                                            }}>
                                            <View
                                              style={styles.padding_16}
                                              key={optionLevel?.id}>
                                              <Text
                                                style={[
                                                  styles.textOptionLevelName,
                                                  value === optionLevel?.id &&
                                                    styles.defaultTrue,
                                                ]}>
                                                {optionLevel.name}
                                              </Text>
                                              {value === optionLevel?.id && (
                                                <CheckIcon />
                                              )}
                                            </View>
                                          </TouchableOpacity>
                                          {item?.optionLevel?.length >
                                            i + 1 && (
                                            <View
                                              style={
                                                styles.borderStyleDotted
                                              }></View>
                                          )}
                                        </>
                                      ),
                                    )}
                                  </>
                                )}
                                name={`options[${index}].optionLevelId`}
                              />
                            </View>
                          )}
                          name={`options[${index}].id`}
                        />
                      </View>
                    ))}
                  </View>
                </>
              )}
              {editProduct?.toppings?.length > 0 && (
                <>
                  <View>
                    <Text style={styles.txtTopping}>
                      {t(TextI18n.addTopping)}
                    </Text>
                  </View>
                  <View style={styles.viewTopping}>
                    {editProduct?.toppings?.map((item, index) => (
                      <View style={styles.viewToppingItem} key={index}>
                        <Controller
                          control={control}
                          render={() => (
                            <View style={styles.flex_1}>
                              <Text style={styles.textToppingItem}>
                                {item?.name}
                              </Text>
                            </View>
                          )}
                          name={`toppings[${index}].id`}
                        />
                        <Controller
                          control={control}
                          defaultValue={item?.price}
                          render={() => (
                            <View style={styles.flex_1}>
                              <Text style={styles.textToppingPrice}>
                                +{getPriceValue(item?.price)}
                              </Text>
                            </View>
                          )}
                          name={`toppings[${index}].price`}
                        />
                        <Controller
                          control={control}
                          defaultValue={item?.quantity}
                          render={({field: {onChange, value}}) => (
                            <View style={styles.viewPlusReduceTopping}>
                              <TouchableOpacity
                                disabled={value == 0}
                                onPress={() => {
                                  onChange(value - 1), getTotalProductPrice();
                                }}>
                                <ReduceIcon />
                              </TouchableOpacity>
                              <Text style={styles.textToppingQuantity}>
                                {value}
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  onChange(value + 1), getTotalProductPrice();
                                }}>
                                <PlusIcon />
                              </TouchableOpacity>
                            </View>
                          )}
                          name={`toppings[${index}].quantity`}
                        />
                      </View>
                    ))}
                  </View>
                </>
              )}

              <View>
                <Text style={styles.textNote}>{t(TextI18n.note)}</Text>
              </View>
              <Controller
                control={control}
                render={({field: {onChange, value}}) => (
                  <>
                    <View style={styles.viewNote}>
                      <SubtractIcon style={styles.viewIconNote} />

                      <TextInput
                        multiline
                        defaultValue={editProduct?.note}
                        style={styles.inputNote}
                        onChangeText={value => onChange(value)}
                        placeholder={t(TextI18n.inputYourNote)}
                        underlineColorAndroid="transparent"
                        maxLength={pageData.maxLengthNote}
                      />
                    </View>
                    <Text style={styles.vaildNote}>
                      {value != null ? value?.length : 0}/
                      {pageData.maxLengthNote}
                    </Text>
                  </>
                )}
                name={`note`}
              />
            </KeyboardAvoidingView>
          </ScrollView>
          <SafeAreaView
            style={[styles.viewAddProduct, isCombo && styles.viewAddCombo]}>
            {!isCombo && (
              <View style={styles.viewAmountProduct}>
                <View style={styles.flex_1}>
                  <Text style={styles.textAmount}>{t(TextI18n.amount)}</Text>
                </View>
                <View style={styles.viewPlusReduce}>
                  <Controller
                    control={control}
                    defaultValue={editProduct?.quantity}
                    render={({field: {onChange, value}}) => (
                      <>
                        <TouchableOpacity
                          disabled={value == 1}
                          onPress={() => {
                            onChange(value - 1), getTotalProductPrice();
                          }}>
                          <ReduceIcon />
                        </TouchableOpacity>
                        <Text style={styles.productQuantity}>{value}</Text>
                        <TouchableOpacity
                          onPress={() => {
                            onChange(value + 1), getTotalProductPrice();
                          }}>
                          <PlusIcon />
                        </TouchableOpacity>
                      </>
                    )}
                    name={`quantity`}
                  />
                </View>
              </View>
            )}
            {renderFooter()}
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}
