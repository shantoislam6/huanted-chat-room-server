import { TSocketIO, TSocket } from './types.ts';

import { dateTime } from '../lib/time.ts';

export const handleConnection = async (
  io: TSocketIO,
  socket: TSocket
): Promise<void> => {
  console.log(`Client connected: ${socket.id}`);

  const username = socket.handshake.query.username ?? 'Anonymouse';
  const uuid = socket.handshake.query.uuid ?? crypto.randomUUID();

  socket.data.uuid = uuid;
  socket.data.username = username;
  socket.data.joined_at = dateTime().utc().toISOString();

  const members: {
    // deno-lint-ignore no-explicit-any
    [key: string]: any;
  } = {};

  // deno-lint-ignore no-explicit-any
  (await io.fetchSockets()).forEach((socketItem: any) => {
    members[socketItem.data.uuid] = {
      ...socketItem.data,
      clientID: socketItem.id,
    };
  });

  io.emit('join', members);

  // deno-lint-ignore no-explicit-any
  socket.on('chat message', (pyload: any) => {
    io.emit('chat message', {
      value: pyload.value,
      clientID: socket.id,
      username: username,
      uuid: uuid,
      time: dateTime().utc().toISOString(),
    });
    socket.broadcast.emit('typing', {
      value: '',
      uuid: uuid,
      username: username,
      type: 'remove',
      clientID: socket.id,
    });
  });

  // deno-lint-ignore no-explicit-any
  socket.on('typing', (value: any) => {
    socket.broadcast.emit('typing', {
      value: value,
      type: 'typing',
      username: username,
      uuid: uuid,
      clientID: socket.id,
    });
  });

  socket.on('typingCancel', () => {
    io.emit('typing', {
      value: '',
      type: 'remove',
      username: username,
      uuid: uuid,
      clientID: socket.id,
    });
  });

  // deno-lint-ignore no-explicit-any
  socket.on('disconnect', async (reason: any) => {
    io.emit('typing', {
      value: '',
      type: 'remove',
      username: username,
      uuid: uuid,
      clientID: socket.id,
    });

    const members: {
      // deno-lint-ignore no-explicit-any
      [key: string]: any;
    } = {};
    // deno-lint-ignore no-explicit-any
    (await io.fetchSockets()).forEach((socketItem: any) => {
      if (socket.id !== socketItem.id) {
        members[socketItem.data.uuid] = {
          ...socketItem.data,
          clientID: socketItem.id,
        };
      }
    });

    // console.log(members);
    io.emit('join', members);

    console.log(`Public client disconnected: ${socket.id}, Reason: ${reason}`);
  });
};
