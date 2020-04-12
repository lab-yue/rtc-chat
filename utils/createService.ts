import { useEffect, useState } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

export const createService = <S>(initialState: S) => {
  const store = new BehaviorSubject<S>(initialState);

  const use = () => useObservable(store, initialState);
  const set = (payload: Partial<S>) => {
    store.next({ ...store.value, ...payload });
  };
  const select = selectFrom(use);

  return [use, set, select] as const;
};

export const useObservable = <T>(observable: Observable<T>, init: T = null) => {
  const [value, setValue] = useState<T>(init);

  useEffect(() => {
    const o = observable.subscribe((x) => {
      if (!shallowEqual(x, value)) {
        setValue(x);
      }
    });
    return () => o.unsubscribe();
  }, [value]);
  return value;
};

export const selectFrom = <L>(getValue: () => L) => <R>(selector: (getValue: L) => R) => selector(getValue());

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
