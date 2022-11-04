import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import ConfirmationModal from '../../../components/confirmation-modal';
import ProductDetailModal from '../../../components/product-detail-modal/index';
import {ProductDefault} from '../../../constants/images.constants';
import {getCart} from '../../../data-services/cart-data-service';
import ButtonI18n from '../../../i18n/button.i18n';
import TextI18n from '../../../i18n/text.i18n';
import Cart from '../../../utils/cart';
import {formatTextNumber} from '../../../utils/helpers';
import styles from './product-component.style';

export default function ProductsComponent(props) {
  const {currencySymbol, productCategories, updateProductItem, storeId} = props;
  const {t} = useTranslation();
  const shoppingCart = useSelector(getCart);
  const [productDetail, setProductDetail] = useState(null);
  const [isShowProductModal, setIsShowProductModal] = useState(false);
  const [newCartInfo, setNewCartInfo] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const [productNew, setProductNew] = useState({});

  const onHandleAddProduct = async (product, productCategoryId) => {
    let newProduct = {
      productCategoryId: productCategoryId,
      id: product?.id,
      name: product?.name,
      quantity: 1,
      original: product?.original,
      options: product?.options,
      toppings: product?.toppings,
      thumbnail: product?.thumbnail,
      productPrices: product?.productPrices,
    };
    setProductDetail(newProduct);
    setIsShowProductModal(true);
  };

  const AddProductItem = product => {
    let productNew = {
      id: product?.id,
      productCategoryId: product?.productCategoryId,
      quantity: product?.quantity,
    };

    //Case: Haven't product in the cart
    let cartInfo = {
      productDetail: [product],
    };
    setNewCartInfo(cartInfo);
    if (
      shoppingCart?.storeDetail?.storeId === undefined ||
      Object.keys(shoppingCart).length === 0
    ) {
      updateProductItem(productNew, cartInfo);
      setIsShowProductModal(false);
    } else {
      //Case: ProductExisted in cart and add newItem or updateItem
      let updateOrderCart = {...shoppingCart};
      if (
        updateOrderCart?.storeDetail?.storeId !== storeId &&
        shoppingCart?.productDetail?.length > 0
      ) {
        setProductNew(productNew);
        setIsShowProductModal(false);
        setShowModal(true);
      } else {
        updateOrderCart = Cart.checkExistProductItemInCart(
          product,
          shoppingCart,
        );
        updateProductItem(productNew, updateOrderCart);
        setIsShowProductModal(false);
      }
    }
  };

  const getPriceValue = priceValue => {
    let price = formatTextNumber(priceValue) + currencySymbol;
    return price;
  };

  const AddFastProductItem = (product, productCategoryId) => {
    let productPriceSelected = product?.productPrices[0];
    let productPrice = {
      ...productPriceSelected,
      priceName:
        productPriceSelected?.priceName?.length > 0
          ? `${product?.name} (${productPriceSelected?.priceName})`
          : product?.name,
    };

    let options = [];
    product?.options?.map(o => {
      let optionLevel = o?.optionLevel?.find(ol => ol?.isSetDefault);
      let option = {
        id: o?.id,
        name: o?.name,
        optionLevelId: optionLevel?.id,
        optionLevelName: optionLevel?.name,
        isSetDefault: true,
        selected: true,
      };
      options.push(option);
    });
    let newProduct = {
      id: product?.id,
      productCategoryId: productCategoryId,
      name: product?.name,
      quantity: 1,
      productPrice: productPrice,
      options: options,
      toppings: product?.toppings,
      note: '',
      original: product?.original,
      thumbnail: product?.thumbnail,
    };
    AddProductItem(newProduct);
  };

  const renderFormProductCategoriesValue = () => {
    return (
      <>
        {productCategories?.map((productCategory, index) => (
          <>
            {productCategory?.products?.length > 0 && (
              <View
                style={styles.viewContainer}
                key={`store-details-product-list-${index}`}>
                <Text style={styles.comboName}>{productCategory?.name}</Text>
                {productCategory?.products?.map((product, i) => (
                  <View
                    style={styles.productItem}
                    key={`store-details-product-list-${index}-item-${i}`}>
                    <View style={styles.viewLeft}>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() =>
                          onHandleAddProduct(product, productCategory?.id)
                        }>
                        <View style={styles.viewProduct}>
                          <View style={styles.viewProductName}>
                            <Text style={styles.productName}>
                              {product?.name}
                            </Text>
                            <Text
                              numberOfLines={3}
                              style={[
                                styles.productName,
                                styles.descriptionProduct,
                              ]}>
                              {product?.description}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.viewProductDiscount}>
                          <View style={styles.viewDetailDiscount}>
                            <Text style={styles.productDiscount}>
                              {getPriceValue(product?.original)}
                            </Text>
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
                    </View>
                    <View style={styles.viewBtn}>
                      <View style={styles.viewThumbnail}>
                        <Image
                          style={styles.thumbnail}
                          source={
                            product?.thumbnail
                              ? {uri: product?.thumbnail}
                              : ProductDefault
                          }
                        />
                      </View>
                      <View style={styles.viewBtnAdd}>
                        <TouchableOpacity
                          onPress={() =>
                            AddFastProductItem(product, productCategory?.id)
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
  };

  /**
   * This function is used to hide the modal.
   */
  const onCancel = () => {
    setShowModal(false);
  };

  const onConfirm = () => {
    setShowModal(false);
    updateProductItem(productNew, newCartInfo);
  };

  return (
    <>
      {renderFormProductCategoriesValue()}
      {isShowProductModal && (
        <ProductDetailModal
          isShowProductModal={isShowProductModal}
          editProduct={productDetail}
          currencySymbol={currencySymbol}
          AddProductItem={AddProductItem}
          closeProductItemModal={() => {
            setIsShowProductModal(false), setProductDetail(null);
          }}
          isCombo={false}
        />
      )}
      {showModal && (
        <ConfirmationModal
          visible={showModal}
          onCancel={onCancel}
          onOk={onConfirm}
          contentKey={t(TextI18n.resetCartOnMobile)}
        />
      )}
    </>
  );
}
