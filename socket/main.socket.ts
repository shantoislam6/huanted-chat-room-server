import { Server as SocketIOServer } from 'socket.io';
import { initializeSocketConnection } from './index.ts';
import type { Server } from "node:http";

export default function InitSocketIOServers(server: Server) {
  const io = new SocketIOServer(server, {
    serveClient: false,
    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
    cors: {
      origin: '*',
    },
  });

  // Initialize socket connection
  initializeSocketConnection(io);

  return io;
}
