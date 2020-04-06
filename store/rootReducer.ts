import { combineReducers } from '@reduxjs/toolkit';
import { userInfoReducer } from './userInfo';
import { userListReducer } from './userList';

const rootReducer = combineReducers({
  userInfo: userInfoReducer,
  userList: userListReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
