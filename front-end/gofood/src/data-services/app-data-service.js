import {createSlice} from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    currentRouteName: undefined,
    previousRouteName: undefined,
  },
  reducers: {
    setCurrentRouteName: (state, action) => {
      state.currentRouteName = action.payload;
    },
    setPreviousRouteName: (state, action) => {
      state.previousRouteName = action.payload;
    },
  },
});

export const getCurrentRouteName = state => state.app.currentRouteName;
export const getPreviousRouteName = state => state.app.previousRouteName;
export const {setCurrentRouteName, setPreviousRouteName} = appSlice.actions;
export default appSlice.reducer;
