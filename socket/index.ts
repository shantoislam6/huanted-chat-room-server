import { Server as SocketIOServer } from 'socket.io';
import { handleConnection } from './connections.ts';

export const initializeSocketConnection = (
  io: SocketIOServer
): void => {
  // Log that the server is running
  console.log('Socket.io server is running');
  
  io.on('connection', (socket) => {
    handleConnection(io, socket);
  });
};
