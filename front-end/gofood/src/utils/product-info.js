const mappingProducts = (data, oldProducts, isComboPricing) => {
  let comboPricings = data?.map(cp => ({
    comboPricingId: cp?.comboPricingId,
    productPriceId: cp?.productPriceId,
    productPrices: [mappingProductPrice(cp)],
    name: cp?.productPrice?.product?.name,
    thumbnail: cp?.productPrice?.product?.thumbnail,
    options: mappingDataOptions(cp?.productPrice?.product?.productOptions),
    toppings: cp?.productPrice?.product?.productToppings,
    note: cp?.note,
  }));

  let defaultOptionsToppings = [];
  comboPricings?.map(cpp => {
    let oldProduct = {};
    if (isComboPricing) {
      oldProduct = oldProducts?.find(
        p => p?.comboPricingId == cpp?.comboPricingId,
      );
    } else {
      oldProduct = oldProducts?.find(
        p => p?.productPriceId == cpp?.productPriceId,
      );
    }

    let oldOptions = oldProduct?.options;
    let optionAndToppingItem = {...cpp};
    optionAndToppingItem.note = oldProduct?.note;

    let options = [];

    cpp.options.map(o => {
      let oldOption = oldOptions?.find(old => old?.id === o?.id);
      let option = {...o};
      let ols = [];
      o?.optionLevel.map(ol => {
        let olItem = {...ol};
        olItem.selected = oldOption?.optionLevelId === ol?.id;
        ols.push(olItem);
      });
      option.optionLevel = ols;
      options.push(option);
    });
    if (cpp.toppings?.length > 0) {
      let oldToppings = oldProduct?.toppings;

      let toppings = [];
      cpp.toppings.map(t => {
        let oldTopping = oldToppings?.find(old => old?.id === t?.id);
        let topping = {...t};
        topping.quantity = oldTopping != null ? oldTopping?.quantity : 0;
        toppings.push(topping);
      });
      optionAndToppingItem.toppings = toppings;
    }
    optionAndToppingItem.options = options;
    defaultOptionsToppings.push(optionAndToppingItem);
  });
  return defaultOptionsToppings;
};

const mappingProductPrice = data => {
  return {
    id: data?.productPriceId,
    priceName: data?.priceName,
    priceValue: data?.priceValue,
  };
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

const ProductInfo = {
  mappingProducts,
};

export default ProductInfo;
