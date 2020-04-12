import { MeowEventType, MeowEvent, MeowEventOf } from '../types';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
//import { fromEventPattern } from 'rxjs';
//
//const parseMeowEvent = (e: MessageEvent): MeowEvent => {
//  //console.log(e);
//  return JSON.parse(e.data);
//};

//export let ws: WebSocketSubject<unknown>;
export let ws: WebSocketSubject<MeowEvent>;

if (process.browser) {
  ws = webSocket<MeowEvent>('wss://x.dev:3000');
  ws.subscribe((e) => console.log(e));
}
