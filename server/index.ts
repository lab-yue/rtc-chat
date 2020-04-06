import WebSocket from 'ws';
import express from 'express';
import https from 'https';
import bodyParser from 'body-parser';
import next from 'next';
import fs from 'fs';
import path from 'path';

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
//app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

nextApp.prepare().then(() => {
  app.get('*', (res, req) => nextHandler(res, req));
  server.listen(3000, () => {
    console.log('ok');
  });
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  console.log(req.connection.remoteAddress);
  ws.on('message', (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});
