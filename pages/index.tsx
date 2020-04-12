//import Head from "next/head";
import { useState } from 'react';
import { useIceStatus, setIceStatus, ws } from '../services';
import { connect, useRTC } from '../connection';

const Home = () => {
  // const [localName, setLocalName] = useState('');
  // const name = selectUserName();
  // const ice = selectIceStatus();
  // const users = selectUsers();
  // const dispatch = useDispatch();

  // const { call, localRef, remoteRef } = useRTC(name);

  // const join = () => {
  //   dispatch(setUserName(localName));
  //   connect(localName);
  // };
  const ice = useIceStatus();
  return (
    <>
      <h1>Home</h1>
      <h2>ice:{ice.status}</h2>
      <button onClick={() => setIceStatus({ status: 'test' })}>test</button>
      {/* <input type="text" value={localName} onChange={(e) => setLocalName(e.target.value)} />
      <button onClick={join}>join</button>
      <video ref={remoteRef} autoPlay />
      <video ref={localRef} muted autoPlay />
      <h2>Users</h2> */}
      {/* <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} <button onClick={() => call(user.name)}>Ask media</button>
          </li>
        ))}
      </ul> */}
    </>
  );
};

export default Home;
