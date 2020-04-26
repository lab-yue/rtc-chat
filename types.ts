import type { User, Theme, IceStatus, UserList } from './services';
export type { User, Theme, IceStatus, UserList };
export type ValueOf<T> = T[keyof T];

export type MeowEventBase = {
  init: {};
  'RTC/candidate': { remote: string; candidate: RTCIceCandidate };
  'RTC/answer':
    | {
        local: string;
        remote: string;
        sdp?: RTCSessionDescription;
        reply: 'accept';
      }
    | { local: string; remote: string; reply: 'refuse' };
  'RTC/invite': { local: string; remote: string; sdp: RTCSessionDescription };
};

export type MeowServerEventBase = {
  'RTC/join': User;
} & MeowEventBase;

export type MeowClientEventBase = {
  'RTC/join': { name: string };
} & MeowEventBase;

export type MeowServerEventType = keyof MeowEventBase | keyof MeowServerEventBase;
export type MeowServerEventOf<T extends MeowServerEventType> = { type: T } & MeowServerEventBase[T];
export type MeowServerEvent = ValueOf<{ [K in MeowServerEventType]: MeowServerEventOf<K> }>;
export type MeowServerEventHandlerOf<T extends MeowServerEventType> = (data: MeowServerEventOf<T>) => void;
export type MeowServerEventHandlerMap = {
  [K in MeowServerEventType]: MeowServerEventHandlerOf<K>;
};

export type MeowClientEventType = keyof MeowEventBase | keyof MeowClientEventBase;
export type MeowClientEventOf<T extends MeowClientEventType> = { type: T } & MeowClientEventBase[T];
export type MeowClientEvent = ValueOf<{ [K in MeowClientEventType]: MeowClientEventOf<K> }>;
export type MeowClientEventHandlerOf<T extends MeowClientEventType> = (data: MeowClientEventOf<T>) => void;
export type MeowClientEventHandlerMap = {
  [K in MeowClientEventType]: MeowClientEventHandlerOf<K>;
};
