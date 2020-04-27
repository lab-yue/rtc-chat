//import Head from "next/head";
//import { useState } from 'react';
import { selectUserName, selectIceStatus, setIceStatus } from '../services';
//import { connect, useRTC } from '../connection';
import { UserList } from '../components';
const Home = () => {
  // const [localName, setLocalName] = useState('');
  const name = selectUserName();
  // const ice = selectIceStatus();
  // const dispatch = useDispatch();

  // const { call, localRef, remoteRef } = useRTC(name);

  // const join = () => {
  //   dispatch(setUserName(localName));
  //   connect(localName);
  // };
  const ice = selectIceStatus();
  return (
    <>
      <h1>Home</h1>
      <h2>ice:{ice.status}</h2>
      <p>{name}</p>
      <button onClick={() => setIceStatus({ status: 'test' })}>test</button>
      {/* <input type="text" value={localName} onChange={(e) => setLocalName(e.target.value)} />
      <button onClick={join}>join</button>
      <video ref={remoteRef} autoPlay />
      <video ref={localRef} muted autoPlay />
      <h2>Users</h2> */}
      <UserList />
    </>
  );
};

export default Home;
