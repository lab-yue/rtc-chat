import { MutableRefObject } from 'react';
import store, { addUser } from '../store';

let wsc: WebSocket;
let peerConnection: RTCPeerConnection;

if (process.browser) {
  wsc = new WebSocket(`wss://x.dev:3000`);
}
export const connect = async (
  name: string,
  selfRef: MutableRefObject<HTMLVideoElement>,
  remoteRef: MutableRefObject<HTMLVideoElement>
) => {
  wsc.send(JSON.stringify({ type: 'join', name }));

  wsc.onmessage = async (e) => {
    console.log(e);
    const data: any = JSON.parse(e.data);
    if (data.type == 'join') {
      store.dispatch(addUser(data));
    }
    if (data.type == 'offer') {
      peerConnection = createPeerConnection(name, data.self, remoteRef);
      if (!data.sdp) {
        console.log('no offer sdp');
        return;
      }
      const remoteDesc = new RTCSessionDescription(data.sdp);
      await peerConnection.setRemoteDescription(remoteDesc);
      const selfStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      selfRef.current.srcObject = selfStream;
      selfStream.getTracks().forEach((track) => peerConnection.addTrack(track, selfStream));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      wscSend({
        type: 'answer',
        sdp: peerConnection.localDescription,
        self: name,
        remote: data.self
      });
    }
    if (data.type == 'answer') {
      if (!data.sdp) {
        console.log('no answer sdp');
        return;
      }
      if (peerConnection?.remoteDescription) {
        console.log('answered');
        return;
      }
      const remoteDesc = new RTCSessionDescription(data.sdp);
      await peerConnection.setRemoteDescription(remoteDesc);
    }
    if (data.type == 'candidate') {
      if (!data.candidate) {
        return;
      }
      if (!peerConnection?.remoteDescription) {
        console.log('no remote sdp');
        return;
      }
      const candidate = new RTCIceCandidate(data.candidate);
      console.log({ candidate });
      await peerConnection.addIceCandidate(candidate);
    }
  };
  return wsc;
};

export const wscSend = (data: any) => {
  console.log(`send: ${JSON.stringify(data)}`);
  wsc.send(JSON.stringify(data));
};
let done = false;
export const createPeerConnection = (self: string, remote: string, remoteRef: MutableRefObject<HTMLVideoElement>) => {
  if (peerConnection) {
    console.log('peerConnection exist');
    return;
  }
  console.log('createPeerConnection');
  peerConnection = new RTCPeerConnection({
    iceServers: [
      // Information about ICE servers - Use your own!
      {
        urls: 'stun:stun.l.google.com:19302'
      },

      {
        urls: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com'
      }
      // {
      //   urls: 'turn:192.158.29.39:3478?transport=udp',
      //   credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      //   username: '28224511:1379330808'
      // },
      // {
      //   urls: 'turn:192.158.29.39:3478?transport=tcp',
      //   credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      //   username: '28224511:1379330808'
      // },
      // {
      //   urls: 'turn:turn.bistri.com:80',
      //   credential: 'homeo',
      //   username: 'homeo'
      // },
      // {
      //   urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
      //   credential: 'webrtc',
      //   username: 'webrtc'
      // }
    ]
  });

  const handleICEConnectionStateChange = async () => {
    console.log('handleICEConnectionStateChange');
  };
  const handleICEGatheringStateChange = async () => {
    console.log('handleICEGatheringStateChange');
  };
  const handleSignalingStateChange = async () => {
    console.log('handleSignalingStateChange');
  };

  peerConnection.onicecandidate = (e) => {
    console.log('onicecandidate');
    if (e.candidate) {
      wscSend({ type: 'candidate', remote, candidate: e.candidate });
    }
  };
  peerConnection.ontrack = (e) => {
    if (done) return;
    console.log('handleTrack');
    done = true;
    console.log(e.streams);
    remoteRef.current.srcObject = e.streams[0];
  };
  peerConnection.onnegotiationneeded = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log({
      sdp: peerConnection.localDescription
    });
    console.log('handleNegotiationNeeded');
    wscSend({
      self,
      remote,
      type: 'offer',
      sdp: peerConnection.localDescription
    });
  };
  peerConnection.oniceconnectionstatechange = handleICEConnectionStateChange;
  peerConnection.onicegatheringstatechange = handleICEGatheringStateChange;
  peerConnection.onsignalingstatechange = handleSignalingStateChange;
  return peerConnection;
};

export const askMedia = async (
  selfRef: MutableRefObject<HTMLVideoElement>,
  remoteRef: MutableRefObject<HTMLVideoElement>,
  self: string,
  remote: string
) => {
  if (!wsc) return;
  const selfStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  const connection = createPeerConnection(self, remote, remoteRef);
  // @ts-ignore
  connection.addStream(selfStream);
  selfRef.current.srcObject = selfStream;
  // peeronnection.addStream(selfStream);
};
