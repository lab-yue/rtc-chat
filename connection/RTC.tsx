import { MeowServerEventOf } from '../types';
import { MutableRefObject, useRef } from 'react';
import { setIceStatus } from '../services';
import { waitForEvent, sendMeowClientEvent, listen } from './socket';

const handleICEConnectionStateChange = async () => {
  console.log('handleICEConnectionStateChange');
};

const handleSignalingStateChange = async () => {
  console.log('handleSignalingStateChange');
};

export const createPeerConnection = async (ref: MutableRefObject<HTMLVideoElement>): Promise<RTCPeerConnection> => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302'
      },

      {
        urls: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com'
      }
    ]
  });

  peerConnection.oniceconnectionstatechange = handleICEConnectionStateChange;
  peerConnection.onicegatheringstatechange = () => {
    setIceStatus({ status: peerConnection.iceGatheringState });
    console.log(peerConnection);
    if (peerConnection.iceGatheringState === 'complete') {
      const tracks = peerConnection.getReceivers().map((r) => r.track);
      const stream = new MediaStream(tracks);
      attachStreamToVideo(ref, stream);
    }
  };
  peerConnection.onsignalingstatechange = handleSignalingStateChange;

  return peerConnection;
};

export const getUserMedia = async () => {
  return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
};

export const addTracksToPeerConnection = (connection: RTCPeerConnection, stream: MediaStream) => {
  stream.getTracks().forEach((track) => connection.addTrack(track, stream));
  return new Promise((ok) => {
    connection.onnegotiationneeded = () => {
      ok();
    };
  });
};

export const attachStreamToVideo = (ref: MutableRefObject<HTMLVideoElement>, stream: MediaStream) => {
  if (!ref.current) {
    console.log('no ref');
    return;
  }
  if (ref.current.srcObject) {
    console.log('attached');
    return;
  }
  ref.current.srcObject = stream;
};

export const remoteAnswer = async () => {
  const data = await waitForEvent('RTC/answer');
  if (data.reply == 'refuse') {
    return;
  }
  if (!data.sdp) {
    console.log('no answer sdp');
    return;
  }
  return new RTCSessionDescription(data.sdp);
};

export const useRTC = (local: string) => {
  const localRef: MutableRefObject<HTMLVideoElement> = useRef();
  const remoteRef: MutableRefObject<HTMLVideoElement> = useRef();

  if (!process.browser) return { localRef, remoteRef };

  const exchangeCandidate = (peerConnection: RTCPeerConnection, remote: string) => {
    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        console.log({ candidate: e.cancelable });
        sendMeowClientEvent({ type: 'RTC/candidate', remote, candidate: e.candidate });
      }
    };
    peerConnection.ontrack = (e) => {
      attachStreamToVideo(remoteRef, e.streams[0]);
    };

    listen('RTC/candidate', async (data) => {
      if (!data.candidate) {
        return;
      }
      if (!peerConnection?.remoteDescription) {
        console.log('no remote sdp');
        return;
      }
      const candidate = new RTCIceCandidate(data.candidate);
      await peerConnection.addIceCandidate(candidate);
    });
  };

  const call = async (remote: string) => {
    const peerConnection = await createPeerConnection(remoteRef);
    exchangeCandidate(peerConnection, remote);
    const stream = await getUserMedia();
    await addTracksToPeerConnection(peerConnection, stream);
    attachStreamToVideo(localRef, stream);

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    sendMeowClientEvent({
      type: 'RTC/invite',
      sdp: peerConnection.localDescription,
      local,
      remote
    });
    const sdp = await remoteAnswer();
    await peerConnection.setRemoteDescription(sdp);
  };

  const answer = async (data: MeowServerEventOf<'RTC/invite'>) => {
    const peerConnection = await createPeerConnection(remoteRef);
    exchangeCandidate(peerConnection, data.local);

    await peerConnection.setRemoteDescription(data.sdp);
    const stream = await getUserMedia();
    addTracksToPeerConnection(peerConnection, stream);
    attachStreamToVideo(localRef, stream);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    sendMeowClientEvent({
      type: 'RTC/answer',
      sdp: peerConnection.localDescription,
      local,
      remote: data.local,
      reply: 'accept'
    });
  };

  listen('RTC/invite', async (data) => {
    await answer(data);
  });

  return {
    localRef,
    remoteRef,
    call
  };
};
