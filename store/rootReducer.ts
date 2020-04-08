import { combineReducers } from '@reduxjs/toolkit';
import { userInfoReducer } from './userInfo';
import { userListReducer } from './userList';
import { iceReducer } from './ice';

const rootReducer = combineReducers({
  userInfo: userInfoReducer,
  userList: userListReducer,
  ice: iceReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
