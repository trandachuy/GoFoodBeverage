import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import DatabaseKeys from '../constants/database-keys.constants';
import {setCart} from '../data-services/cart-data-service';

const checkExistProductItemInCart = (newProduct, shoppingCart) => {
  let updateOrderCart = {...shoppingCart};
  let productDetailList = [...updateOrderCart?.productDetail];
  if (!newProduct?.isCombo) {
    let productExisted = productDetailList?.filter(
      p =>
        p?.id === newProduct?.id &&
        p?.productPrice?.id === newProduct?.productPrice?.id,
    );
    let newToppings = [];
    let productIndex = -1;
    if (productExisted?.length > 0) {
      let isOptionToppingExisted = false;
      for (var index in shoppingCart?.productDetail) {
        let detail = {...shoppingCart?.productDetail[index]};
        if (
          detail?.id === newProduct?.id &&
          detail?.productPrice?.id === newProduct?.productPrice?.id
        ) {
          //check the content of the options for duplicates between before data and after data
          isOptionToppingExisted = checkDuplicateComboProduct(
            detail?.options,
            newProduct?.options,
            detail?.toppings,
            newProduct?.toppings,
            detail?.note,
            newProduct?.note,
          );

          if (isOptionToppingExisted) {
            if (
              detail?.toppings?.length > 0 &&
              detail?.toppings?.filter(t => t?.quantity > 0)?.length > 0
            ) {
              detail?.toppings?.map(t => {
                let existTopping = newProduct?.toppings?.find(
                  x => x?.id == t?.id,
                );
                let newTopping = {
                  ...t,
                  quantity: t?.quantity + existTopping?.quantity,
                };
                newToppings.push(newTopping);
              });
            }
            productIndex = index;
            break;
          }
        }
      }
    }
    if (productIndex >= 0) {
      let productNeedToUpdate = {...productDetailList[productIndex]};
      productNeedToUpdate.quantity += newProduct?.quantity;

      if (newToppings?.length > 0) {
        productNeedToUpdate.toppings = newToppings;
      }

      productDetailList[productIndex] = productNeedToUpdate;
      updateOrderCart.productDetail = productDetailList;
    } else {
      updateOrderCart.productDetail = [
        ...updateOrderCart.productDetail,
        newProduct,
      ];
    }
  } else {
    let existComboItem = [];
    if (newProduct?.isComboPricing) {
      existComboItem = shoppingCart?.productDetail?.filter(
        p => p?.comboPricingId === newProduct?.comboPricingId,
      );
    } else {
      existComboItem = shoppingCart?.productDetail?.filter(
        p => p?.comboProductPriceId === newProduct?.comboProductPriceId,
      );
    }
    if (existComboItem?.length === 0) {
      updateOrderCart.productDetail = [
        ...updateOrderCart.productDetail,
        newProduct,
      ];
    } else {
      let indexComboProduct = -1;
      let isOptionToppingExisted = false;
      for (var index in shoppingCart?.productDetail) {
        isOptionToppingExisted = false;
        let detail = {...shoppingCart?.productDetail[index]};
        if (
          (newProduct?.isComboPricing &&
            detail?.comboPricingId === newProduct?.comboPricingId) ||
          (!newProduct?.isComboPricing &&
            detail?.comboProductPriceId === newProduct?.comboProductPriceId)
        ) {
          let products = detail?.products;
          for (var i in products) {
            let productCurrent = newProduct?.products?.find(
              pc => pc?.productPriceId === products[i]?.productPriceId,
            );
            isOptionToppingExisted = checkDuplicateComboProduct(
              products[i]?.options,
              productCurrent?.options,
              products[i]?.toppings,
              productCurrent?.toppings,
              products[i]?.note,
              productCurrent?.note,
            );
            if (!isOptionToppingExisted) {
              break;
            }
          }

          if (isOptionToppingExisted) {
            //check the content of the note for duplicates between before data and after data
            isOptionToppingExisted = detail?.note === newProduct?.note;
          }

          if (isOptionToppingExisted) {
            indexComboProduct = index;
            break;
          }
        }
      }
      if (isOptionToppingExisted) {
        let productDetailList = [...updateOrderCart?.productDetail];
        let productNeedToUpdate = {...productDetailList[indexComboProduct]};
        productNeedToUpdate.quantity += newProduct?.quantity;
        let newProducts = [];
        if (productNeedToUpdate?.toppings?.length > 0) {
          newProducts = productNeedToUpdate?.product?.map(p => {
            let productCurrent = newProduct?.products?.find(
              pc => pc?.productPriceId === p?.productPriceId,
            );
            p?.toppings?.map(t => {
              let quantityTopping = productCurrent?.toppings?.find(
                i => i?.id === t?.id,
              )?.quantity;
              t.quantity += quantityTopping;
              return t;
            });
            return p;
          });
          productNeedToUpdate.products = newProducts;
        }
        productDetailList[indexComboProduct] = productNeedToUpdate;
        updateOrderCart.productDetail = productDetailList;
      } else {
        updateOrderCart.productDetail = [
          ...updateOrderCart.productDetail,
          newProduct,
        ];
      }
    }
  }
  return updateOrderCart;
};

const checkDuplicateComboProduct = (
  optionsOld,
  optionsNew,
  toppingsOld,
  toppingsNew,
  noteOld,
  oldNew,
) => {
  let isOptionToppingExisted = false;

  //check the content of the options for duplicates between before data and after data
  isOptionToppingExisted = compareProductOptions(optionsOld, optionsNew);

  //check the content of the toppings for duplicates between before data and after data
  if (isOptionToppingExisted) {
    isOptionToppingExisted = compareProductToppings(toppingsOld, toppingsNew);
  }

  if (isOptionToppingExisted) {
    //check the content of the note for duplicates between before data and after data
    isOptionToppingExisted = noteOld === oldNew;
  }

  return isOptionToppingExisted;
};

/** This function is used to add or update the cart info to the redux state and the sql lite.
 * @param  {any} cartInfo The cart info, for example: {storeId: '', productDetail: []}
 */
const updateOrderCartSession = async (cartInfo, storeDetail) => {
  const dispatch = useDispatch();
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
};

const totalPricesInCart = shoppingCart => {
  let total = 0;
  shoppingCart?.productDetail?.map(p => {
    if (p?.isCombo) {
      let toppingPrice = 0;
      if (p?.products?.length > 0) {
        p?.products?.map(product => {
          if (product?.toppings?.length > 0) {
            toppingPrice += product?.toppings
              ?.map(t => t?.quantity * t?.price)
              ?.reduce((a, b) => a + b, 0);
          }
        });
      }
      //calculate the amount of the total combo.
      total += p?.quantity * (p?.priceAfterDiscount + toppingPrice);
    } else {
      //calculate the amount of the total product.
      let toppingPrice = 0;
      if (p?.toppings?.length > 0) {
        toppingPrice = p?.toppings
          ?.map(t => t?.quantity * t?.price)
          ?.reduce((a, b) => a + b, 0);
      }
      total += (p?.productPrice?.priceValue + toppingPrice) * p?.quantity;
    }
  });
  return total;
};

const totalItemsInCart = shoppingCart => {
  let total = 0;
  shoppingCart?.productDetail?.forEach(element => {
    total += element?.quantity;
  });
  return total > 99 ? `99+` : `${total}`;
};

const compareProductToppings = (toppingsOld, toppingsNew) => {
  var isToppingExisted = true;
  for (var index in toppingsOld) {
    let topping = toppingsNew?.find(
      o =>
        o?.id == toppingsOld[index]?.id &&
        o?.quantity == toppingsOld[index]?.quantity,
    );
    if (topping === null || topping === undefined) {
      isToppingExisted = false;
      break;
    }
  }
  return isToppingExisted;
};

const compareProductOptions = (optionsOld, optionsNew) => {
  var isOptionExisted = true;

  for (var index in optionsOld) {
    let optionItemNew = optionsNew?.find(
      on =>
        on?.id === optionsOld[index]?.id &&
        on?.optionLevelId === optionsOld[index]?.optionLevelId,
    );
    if (optionItemNew === null || optionItemNew === undefined) {
      isOptionExisted = false;
      break;
    }
  }
  return isOptionExisted;
};

const mappingProductOptions = products => {
  let updateProducts = [];
  products?.map(p => {
    let options = [];
    p?.options?.map(o => {
      let optionLevel = o?.optionLevel?.find(ol => ol?.selected);
      let option = {
        id: o?.id,
        name: o?.name,
        optionLevelId: optionLevel?.id,
        optionLevelName: optionLevel?.name,
        isSetDefault: optionLevel?.isSetDefault,
        selected: optionLevel?.selected,
      };
      options.push(option);
    });
    let product = {
      ...p,
      options,
    };
    updateProducts.push(product);
  });
  return updateProducts;
};

const Cart = {
  totalPricesInCart,
  totalItemsInCart,
  compareProductOptions,
  compareProductToppings,
  mappingProductOptions,
  checkExistProductItemInCart,
  updateOrderCartSession,
};

export default Cart;
