import 'dotenv';
import { createServer } from 'node:http';
import InitSocketIOServers from './socket/main.socket.ts';

const PORT = Deno.env.get('PORT') ? parseInt(Deno.env.get('PORT')!) : 8000;

const server = createServer();

InitSocketIOServers(server);

server.listen(PORT);
server.on('listening', () => {
  console.log('Server is listenting on port ::' + PORT);
});
