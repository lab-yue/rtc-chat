import { MeowEvent, MeowEventOf } from '../types';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { addUser } from '../services';
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
  const join = ws.pipe(filter((e) => e.type === 'RTC/join@server')) as Observable<MeowEventOf<'RTC/join@server'>>;
  join.subscribe((e) => addUser(e));
  ws.subscribe((e) => console.log(e));
  ws.next({ type: 'RTC/join', name: navigator.platform });
}
