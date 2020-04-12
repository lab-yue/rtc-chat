import { useEffect, useState } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

type Reducer<S, P = any> = (state: S, payload: P) => S;
type Selector<S, T = S> = (s: S) => T;

const basicSelector = <S, T>(s: S) => (s as any) as T;
const basicReducer = <S>(s: S, payload: Partial<S>): S => ({ ...s, ...payload });

export const createService = <S>(initialState: S) => {
  const store = new BehaviorSubject<S>(initialState);

  const select = <T = S>(selector?: Selector<S, T>) => () => useObservable(store, initialState, selector);

  const set = <P = Partial<S>>(reducer: Reducer<S, P> = basicReducer) => {
    return (payload: P) => store.next(reducer(store.value, payload));
  };
  return { select, set };
};

export const useObservable = <S, T>(
  observable: Observable<S>,
  init: S = null,
  selector: Selector<S, T> = basicSelector
) => {
  const [value, setValue] = useState<T>(selector(init));

  useEffect(() => {
    const o = observable.subscribe((x) => {
      const selected = selector(x);
      if (!shallowEqual(selected, value)) {
        setValue(selected);
      }
    });
    return () => o.unsubscribe();
  }, [value]);
  return value;
};

// from react-redux
export const shallowEqual = (objA: any, objB: any): boolean => {
  if (Object.is(objA, objB)) return true;

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
};

// export const selectFrom = <L>(getValue: () => L) => <R>(selector: (getValue: L) => R) => selector(getValue());
