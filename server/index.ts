import WebSocket from 'ws';
import express from 'express';
import https from 'https';
import next from 'next';
import fs from 'fs';
import path from 'path';
import { MeowClientEvent } from '../types';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();
const app = express();
const server = https.createServer(
  {
    key: fs.readFileSync(path.resolve(__dirname, '../ssl/x.dev-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../ssl/x.dev.pem'))
  },
  app
);

nextApp.prepare().then(() => {
  app.all('*', (res, req) => nextHandler(res, req));
  server.listen(3000, () => {
    console.log('ok');
  });
});

const wss = new WebSocket.Server({ server });
const counter = createCounter();

const m = {};
wss.on('connection', (ws, req) => {
  console.log(req.connection.remoteAddress);

  ws.on('message', (data) => {
    let d: MeowClientEvent = JSON.parse(data.toString());
    console.log({ d });
    if (d.type == 'RTC/join') {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          // @ts-ignore
          m[d.name] = client;
          client.send(JSON.stringify({ ...d, type: 'RTC/join', id: counter.next().value }));
          // @ts-ignore
          console.log(d.name);
        }
      });
    }

    if (d.type == 'RTC/invite' || d.type == 'RTC/candidate' || d.type == 'RTC/answer') {
      console.log(data);
      m[d.remote].send(data);
    }
  });
});

function* createCounter() {
  let index = 0;
  while (true) yield index++;
}
