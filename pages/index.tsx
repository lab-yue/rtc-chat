//import Head from "next/head";
import { useState } from 'react';
import { selectUserName, setUserName, selectUsers, selectIceStatus } from '../store';
import { useDispatch } from 'react-redux';
import { connect, useRTCContext } from '../connection';

const Home = () => {
  const [localName, setLocalName] = useState('');
  const name = selectUserName();
  const ice = selectIceStatus();
  const users = selectUsers();
  const dispatch = useDispatch();

  const { localRef, remoteRef, call } = useRTCContext(name);
  const join = () => {
    dispatch(setUserName(localName));
    connect(localName);
  };

  return (
    <>
      <h1>Home - {name}</h1>
      <h2>ice:{ice}</h2>
      <input type="text" value={localName} onChange={(e) => setLocalName(e.target.value)} />
      <button onClick={join}>join</button>
      <video ref={remoteRef} autoPlay />
      <video ref={localRef} muted autoPlay />
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} <button onClick={() => call(user.name)}>Ask media</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;
