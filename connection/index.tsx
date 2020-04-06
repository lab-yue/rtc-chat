import { MutableRefObject } from 'react';
import store, { addUser } from '../store';
export const connect = (name: string) => {
  const wsc = new WebSocket('wss://x.dev:3000');
  wsc.onopen = () => {
    wsc.send(JSON.stringify({ type: 'join', name }));
  };
  wsc.onmessage = (e) => {
    console.log(e);
    const data: any = JSON.parse(e.data);
    if (data.type == 'join') {
      store.dispatch(addUser(data));
    }
  };
  return wsc;
};

export const createPeerConnection = () => {
  console.log('createPeerConnection');
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      // Information about ICE servers - Use your own!
      {
        urls: 'stun:stun.stunprotocol.org'
      }
    ]
  });

  const handleICECandidate = async () => {
    console.log('handleICECandidate');
  };
  const handleTrack = async () => {
    console.log('handleTrack');
  };
  const handleNegotiationNeeded = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log({
      sdp: peerConnection.localDescription
    });
    console.log('handleNegotiationNeeded');
  };
  const handleICEConnectionStateChange = async () => {
    console.log('handleICEConnectionStateChange');
  };
  const handleICEGatheringStateChange = async () => {
    console.log('handleICEGatheringStateChange');
  };
  const handleSignalingStateChange = async () => {
    console.log('handleSignalingStateChange');
  };

  peerConnection.onicecandidate = handleICECandidate;
  peerConnection.ontrack = handleTrack;
  peerConnection.onnegotiationneeded = handleNegotiationNeeded;
  peerConnection.oniceconnectionstatechange = handleICEConnectionStateChange;
  peerConnection.onicegatheringstatechange = handleICEGatheringStateChange;
  peerConnection.onsignalingstatechange = handleSignalingStateChange;
};

export const askMedia = async (ref: MutableRefObject<HTMLVideoElement>) => {
  const selfStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  // createPeerConnection();
  ref.current.srcObject = selfStream;
  // peerConnection.addStream(selfStream);
};
