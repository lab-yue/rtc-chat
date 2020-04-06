import { combineReducers } from '@reduxjs/toolkit';
import { userInfoReducer } from './userInfo';

const rootReducer = combineReducers({
  userInfo: userInfoReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
