// import { MeowEventType, MeowEvent, MeowEventOf } from '../types';
// import { MutableRefObject, useRef } from 'react';
// import { setUserList, setUser, setIceStatus } from '../services';

// export let wsc: WebSocket;

// if (process.browser) {
//   wsc = new WebSocket(`wss://x.dev:3000`);
//   wsc.onopen = () => {
//     wsc.send(JSON.stringify({ type: 'RTC/join', name: navigator.platform }));
//     store.dispatch(setUserName(navigator.platform));
//   };
//   wsc.addEventListener('message', (e) => {
//     const data = parseMeowEvent(e);
//     if (data.type == 'RTC/join@server') {
//       store.dispatch(addUser(data));
//     }
//   });
// }

// const waitForMessage = <T extends MeowEventType, K>(eventType: T, handler: (data: MeowEventOf<T>) => K): Promise<K> => {
//   console.log(`waitForMessage ${eventType}`);
//   return new Promise((resolve) => {
//     const listener = async (e: MessageEvent) => {
//       const data = parseMeowEvent(e) as MeowEventOf<T>;
//       if (eventType === data.type) {
//         wsc.removeEventListener('message', listener);
//         console.log(`resolve waitForMessage ${eventType}`);

//         resolve(handler(data));
//       }
//     };
//     wsc.addEventListener('message', listener);
//   });
// };

// const parseMeowEvent = (e: MessageEvent): MeowEvent => {
//   //console.log(e);
//   return JSON.parse(e.data);
// };

// export const connect = async (name: string) => {
//   wsc.send(JSON.stringify({ type: 'RTC/join', name }));
//   return wsc;
// };

// export const sendMeowEvent = (data: MeowEvent) => {
//   console.log(`send: ${data.type}`);
//   wsc.send(JSON.stringify(data));
// };

// const handleICEConnectionStateChange = async () => {
//   console.log('handleICEConnectionStateChange');
// };

// const handleSignalingStateChange = async () => {
//   console.log('handleSignalingStateChange');
// };

// export const createPeerConnection = async (ref: MutableRefObject<HTMLVideoElement>): Promise<RTCPeerConnection> => {
//   const peerConnection = new RTCPeerConnection({
//     iceServers: [
//       // Information about ICE servers - Use your own!
//       {
//         urls: 'stun:stun.l.google.com:19302'
//       },

//       {
//         urls: 'turn:numb.viagenie.ca',
//         credential: 'muazkh',
//         username: 'webrtc@live.com'
//       }
//     ]
//   });

//   peerConnection.oniceconnectionstatechange = handleICEConnectionStateChange;
//   peerConnection.onicegatheringstatechange = () => {
//     store.dispatch(setIceStatus(peerConnection.iceGatheringState));
//     console.log(peerConnection);
//     if (peerConnection.iceGatheringState === 'complete') {
//       const tracks = peerConnection.getReceivers().map((r) => r.track);
//       const stream = new MediaStream(tracks);
//       console.log(stream);
//       attachStreamToVideo(ref, stream);
//     }
//   };
//   peerConnection.onsignalingstatechange = handleSignalingStateChange;

//   return peerConnection;
// };

// export const getUserMedia = async () => {
//   return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
// };

// export const addTracksToPeerConnection = (connection: RTCPeerConnection, stream: MediaStream) => {
//   stream.getTracks().forEach((track) => connection.addTrack(track, stream));
//   return new Promise((ok) => {
//     connection.onnegotiationneeded = () => {
//       ok();
//     };
//   });
// };

// export const attachStreamToVideo = (ref: MutableRefObject<HTMLVideoElement>, stream: MediaStream) => {
//   if (!ref.current) {
//     console.log('no ref');
//     return;
//   }
//   if (ref.current.srcObject) {
//     console.log('attached');
//     return;
//   }
//   ref.current.srcObject = stream;
// };

// export const remoteAnswer = async () => {
//   return waitForMessage('RTC/answer', (data) => {
//     if (data.reply == 'refuse') {
//       return;
//     }
//     if (!data.sdp) {
//       console.log('no answer sdp');
//       return;
//     }
//     return new RTCSessionDescription(data.sdp);
//   });
// };

// export const useRTC = (local: string) => {
//   const localRef: MutableRefObject<HTMLVideoElement> = useRef();
//   const remoteRef: MutableRefObject<HTMLVideoElement> = useRef();

//   if (!process.browser) return { localRef, remoteRef };

//   const exchangeCandidate = (peerConnection: RTCPeerConnection, remote: string) => {
//     peerConnection.onicecandidate = (e) => {
//       if (e.candidate) {
//         console.log({ candidate: e.cancelable });
//         sendMeowEvent({ type: 'RTC/candidate', remote, candidate: e.candidate });
//       }
//     };
//     peerConnection.ontrack = (e) => {
//       attachStreamToVideo(remoteRef, e.streams[0]);
//     };

//     wsc.addEventListener('message', async (e) => {
//       const data = parseMeowEvent(e);
//       if (data.type === 'RTC/candidate') {
//         if (!data.candidate) {
//           return;
//         }
//         if (!peerConnection?.remoteDescription) {
//           console.log('no remote sdp');
//           return;
//         }
//         const candidate = new RTCIceCandidate(data.candidate);
//         await peerConnection.addIceCandidate(candidate);
//       }
//     });
//   };

//   const call = async (remote: string) => {
//     const peerConnection = await createPeerConnection(remoteRef);
//     exchangeCandidate(peerConnection, remote);
//     const stream = await getUserMedia();
//     await addTracksToPeerConnection(peerConnection, stream);
//     attachStreamToVideo(localRef, stream);

//     const offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(offer);
//     sendMeowEvent({
//       type: 'RTC/invite',
//       sdp: peerConnection.localDescription,
//       local,
//       remote
//     });
//     const sdp = await remoteAnswer();
//     await peerConnection.setRemoteDescription(sdp);
//   };

//   const answer = async (data: MeowEventOf<'RTC/invite'>) => {
//     const peerConnection = await createPeerConnection(remoteRef);
//     exchangeCandidate(peerConnection, data.local);

//     await peerConnection.setRemoteDescription(data.sdp);
//     const stream = await getUserMedia();
//     addTracksToPeerConnection(peerConnection, stream);
//     attachStreamToVideo(localRef, stream);

//     const answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(answer);
//     sendMeowEvent({
//       type: 'RTC/answer',
//       sdp: peerConnection.localDescription,
//       local,
//       remote: data.local,
//       reply: 'accept'
//     });
//   };

//   wsc.addEventListener('message', async (e) => {
//     const data = parseMeowEvent(e);
//     if (data.type === 'RTC/invite') {
//       await answer(data);
//     }
//   });

//   return {
//     localRef,
//     remoteRef,
//     call
//   };
// };

export {};
