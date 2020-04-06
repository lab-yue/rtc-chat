//import Head from "next/head";
import { useEffect, useRef } from 'react';
import { selectUserName, setUserName } from '../store';
import { useDispatch } from 'react-redux';

const Home = () => {
  const name = selectUserName();
  const dispatch = useDispatch();
  const selfRef = useRef<HTMLVideoElement>();
  const remoteRef = useRef<HTMLVideoElement>();

  useEffect(() => {
    const wsc = new WebSocket('wss://x.dev:3000');
    wsc.onopen = () => {
      wsc.send('233');
    };
    wsc.onmessage = (e) => console.log(e);
    return () => {};
  }, []);

  const createPeerConnection = () => {
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

  const askMedia = async () => {
    const selfStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    // createPeerConnection();
    selfRef.current.srcObject = selfStream;
    // peerConnection.addStream(selfStream);
  };

  return (
    <>
      Home - {name}
      <input type="text" value={name} onChange={(e) => dispatch(setUserName(e.target.value))} />
      <video ref={remoteRef} autoPlay />
      <video ref={selfRef} muted autoPlay />
      <button onClick={askMedia}>Ask media</button>
    </>
  );
};

export default Home;
