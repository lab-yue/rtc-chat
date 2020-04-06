import { configureStore, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { useSelector, shallowEqual } from 'react-redux';
import rootReducer, { RootState } from './rootReducer';

export * from './userInfo';

const store = configureStore({
  reducer: rootReducer
});

export type AppDispatch = typeof store.dispatch;
export type { RootState };
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
export default store;

type Selector<T> = (state: RootState) => T;

export const useShallowEqualSelector = <D>(selector: Selector<D>) => useSelector<RootState, D>(selector, shallowEqual);
