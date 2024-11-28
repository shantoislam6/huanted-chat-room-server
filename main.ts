import { createServer } from 'node:http';
import express from 'express';
import 'dotenv';

import InitSocketIOServers from './socket/main.socket.ts';

const PORT = Deno.env.get('PORT') ? parseInt(Deno.env.get('PORT')!) : 8000;

const app = express();

// deno-lint-ignore no-explicit-any
app.all('*', (_req: any, res: any) => {
  res.send('huanted-chat-room-server');
});

const server = createServer(app);

InitSocketIOServers(server);

server.listen(PORT);
server.on('listening', () => {
  console.log('Server is listenting on port ::' + PORT);
});
