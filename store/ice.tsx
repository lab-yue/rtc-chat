import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ice } from '../types';
import { useShallowEqualSelector } from '.';

const initialState: Ice = {
  status: 'before connected'
};

const ice = createSlice({
  name: 'ice',
  initialState,
  reducers: {
    setIceStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    }
  }
});

export const { setIceStatus } = ice.actions;

export const selectIceStatus = () => useShallowEqualSelector((state) => state.ice.status);

export const iceReducer = ice.reducer;
