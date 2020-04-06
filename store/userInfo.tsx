import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useShallowEqualSelector } from '.';

type UserInfo = {
  userName: string;
};

const initialState: UserInfo = {
  userName: ''
};

const userInfo = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserName(state, action: PayloadAction<string>) {
      state.userName = action.payload;
    }
  }
});

export const { setUserName } = userInfo.actions;

export const selectUserName = () => useShallowEqualSelector((state) => state.userInfo.userName);

export const userInfoReducer = userInfo.reducer;
