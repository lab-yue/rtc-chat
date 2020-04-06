//import Head from "next/head";
import { useRef, useState } from 'react';
import { selectUserName, setUserName, selectUsers } from '../store';
import { useDispatch } from 'react-redux';
import { connect, askMedia } from '../connection';

const Home = () => {
  const [localName, setLocalName] = useState('');
  const name = selectUserName();
  const users = selectUsers();
  const dispatch = useDispatch();
  const selfRef = useRef<HTMLVideoElement>();
  const remoteRef = useRef<HTMLVideoElement>();

  const join = () => {
    dispatch(setUserName(localName));
    connect(localName, selfRef, remoteRef);
  };

  return (
    <>
      Home - {name}
      <input type="text" value={localName} onChange={(e) => setLocalName(e.target.value)} />
      <button onClick={join}>join</button>
      <video ref={remoteRef} autoPlay />
      <video ref={selfRef} muted autoPlay />
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} <button onClick={() => askMedia(selfRef, remoteRef, localName, user.name)}>Ask media</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;
