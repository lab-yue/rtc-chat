//import Head from "next/head";
import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    const wsc = new WebSocket('ws://localhost:3000');
    wsc.onopen = () => {
      wsc.send('233');
    };
    wsc.onmessage = (e) => console.log(e);
    return () => {};
  }, []);
  return <>Home</>;
};

export default Home;
