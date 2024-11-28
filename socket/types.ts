import { DefaultEventsMap, Socket, Server as SocketIOServer } from 'socket.io';

export type TSocketIO = SocketIOServer<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  // deno-lint-ignore no-explicit-any
  any
>;

export type TSocket = Socket;
