import WebSocket from 'ws';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();
const app = express();
const server = new http.Server(app);
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

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});
