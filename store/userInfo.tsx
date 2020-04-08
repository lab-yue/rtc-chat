import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { useShallowEqualSelector } from '.';

const initialState: User = {
  id: '',
  name: '',
  status: 0
};

const userInfo = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    }
  }
});

export const { setUserName } = userInfo.actions;

export const selectUserName = () => useShallowEqualSelector((state) => state.userInfo.name);

export const userInfoReducer = userInfo.reducer;
