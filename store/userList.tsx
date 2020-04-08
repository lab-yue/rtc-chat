import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { useShallowEqualSelector } from '.';

type userList = {
  users: Record<string, User>;
};

const initialState: userList = {
  users: {}
};

const userList = createSlice({
  name: 'userList',
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<User>) {
      state.users[action.payload.id] = action.payload;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      state.users[action.payload.id] = { ...state.users[action.payload.id], ...action.payload };
    }
  }
});

export const { addUser, updateUser } = userList.actions;

export const selectUsers = () => useShallowEqualSelector((state) => Object.values(state.userList.users));
// export const selectUserName = () => useShallowEqualSelector((state) => state.userList.users);

export const userListReducer = userList.reducer;
