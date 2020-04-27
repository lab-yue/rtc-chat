import { createTelepathy, Telepathy } from '@lirica/telepathy';
import { MeowClientEvent, MeowServerEventType, MeowServerEventHandlerOf, MeowServerEventOf } from '../types';
import { setUser, addUser } from '../services';

const parseMeowEvent = <T>(e: MessageEvent): T => {
  return JSON.parse(e.data);
};

export let clientSocketEvent: Telepathy<MeowClientEvent> = createTelepathy({ type: 'init' }, 'meow');
export let wsc: WebSocket;

export const connect = async (name: string) => {
  sendMeowClientEvent({ type: 'RTC/join', name });
  return wsc;
};

export const sendMeowClientEvent = (data: MeowClientEvent) => {
  console.log(`send: ${data.type}`);
  wsc.send(JSON.stringify(data));
};

export const waitForEvent = <T extends MeowServerEventType>(eventType: T): Promise<MeowServerEventOf<T>> => {
  console.log(`waitForMessage ${eventType}`);
  return new Promise((resolve) => {
    const unsubscribe = clientSocketEvent.subscribe((data) => {
      if (eventType === data.type) {
        console.log(`resolve waitForMessage ${eventType}`);
        unsubscribe();
        resolve(data as MeowServerEventOf<T>);
      }
    });
  });
};

// const MeowMap: MeowServerEventHandlerMap = {
//   init: () => {},
//   'RTC/candidate': () => {},
//   'RTC/answer': () => {},
//   'RTC/invite': () => {},
//   'RTC/join': (payload) => addUser(payload)
// };

export const listen = <T extends MeowServerEventType>(eventType: T, handler: MeowServerEventHandlerOf<T>) => {
  clientSocketEvent.subscribe((data) => {
    if (data.type === eventType) {
      handler(data as MeowServerEventOf<T>);
    }
  });
};

if (process.browser) {
  wsc = new WebSocket(`wss://x.dev:3000`);
  wsc.onopen = () => {
    sendMeowClientEvent({ type: 'RTC/join', name: navigator.platform });
    // setUser({ name: navigator.platform, id: navigator.platform, status: 0 });
  };
  wsc.addEventListener('message', (e) => {
    const data = parseMeowEvent<MeowClientEvent>(e);
    clientSocketEvent.next(data);
    // MeowMap[data.type](data as any);
  });
  listen('RTC/join', (payload) => addUser(payload));
}
