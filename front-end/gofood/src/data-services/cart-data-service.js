import {createSlice} from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    productDetail: [],
    cartPosition: {x: 0, y: 0},
    storeDetail: {},
    deliveryMethodId: null,
  },
  reducers: {
    setCart: (state, action) => {
      state.productDetail = action.payload?.productDetail;
      state.storeDetail = action?.payload?.storeDetail;
      state.deliveryMethodId = action?.payload?.deliveryMethodId;
    },
    setProductList: (state, action) => {
      state.productDetail = action.payload;
    },
    setCartPosition: (state, action) => {
      state.cartPosition = action.payload;
    },
    setCartPositionX: (state, action) => {
      state.cartPosition.x = action.payload;
    },
    setCartPositionY: (state, action) => {
      state.cartPosition.y = action.payload;
    },
  },
});

export const getCart = state => state?.cart;
export const getProductDetails = state => state?.cart?.productDetail;
export const getCartPosition = state => state?.cart?.cartPosition;
export const {
  setCart,
  setCartPosition,
  setCartPositionX,
  setCartPositionY,
  setProductList,
} = cartSlice.actions;
export default cartSlice.reducer;
