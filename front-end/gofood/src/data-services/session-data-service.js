import {createSlice} from '@reduxjs/toolkit';

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    token: null,
    customerInfo: null,
    currentCustomerAddress: {},
  },
  reducers: {
    setSession: (state, action) => {
      state.customerInfo = action.payload?.customerInfo;
      state.token = action.payload?.token;
    },
    updateCustomerInfo: (state, action) => {
      state.customerInfo = action.payload;
    },
    setCurrentCustomerAddress: (state, action) => {
      state.currentCustomerAddress = action.payload;
    },
    updateCustomerAvatar: (state, action) => {
      state.customerInfo = {
        ...state?.customerInfo,
        thumbnail: action?.payload,
      };
    },
  },
});

export const getSession = state => state?.session;
export const getToken = state => state?.session?.token;
export const getCustomerInfo = state => state?.session?.customerInfo;
export const getCurrentCustomerAddress = state =>
  state?.session?.currentCustomerAddress;
export const {
  setSession,
  updateCustomerInfo,
  setCurrentCustomerAddress,
  updateCustomerAvatar,
} = sessionSlice.actions;
export default sessionSlice.reducer;
