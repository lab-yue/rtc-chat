export type ValueOf<T> = T[keyof T];

export type MeowEventBase = {
  'RTC/join': { name: string };
  'RTC/join@server': User;
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

export type MeowEventType = keyof MeowEventBase;
export type MeowEventOf<T extends MeowEventType> = { type: T } & MeowEventBase[T];
export type MeowEvent = ValueOf<{ [K in MeowEventType]: MeowEventOf<K> }>;

enum UserStatus {
  online = 1,
  offline = 0
}

export type User = {
  id: string;
  name: string;
  status: UserStatus;
};

export type Ice = {
  status: string;
};
