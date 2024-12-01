import { TSocketIO, TSocket } from './types.ts';

import { dateTime } from '../lib/time.ts';

const hauntedRoom = 'haunted-chat-room';

export const handleConnection = (io: TSocketIO, socket: TSocket): void => {
  const username = socket.handshake.query.username ?? 'Anonymouse';
  const uuid = socket.handshake.query.uuid ?? crypto.randomUUID();

  socket.data.uuid = uuid;
  socket.data.username = username;
  socket.data.joined_at = dateTime().utc().toISOString();

  const members: {
    // deno-lint-ignore no-explicit-any
    [key: string]: any;
  } = {};

  socket.join(hauntedRoom);

  socket.on('act', async (id: string) => {
    if (id === socket.id) {
      // deno-lint-ignore no-explicit-any
      (await io.to(hauntedRoom).fetchSockets()).forEach((socketItem: any) => {
        members[socketItem.data.uuid] = {
          ...socketItem.data,
          clientID: socketItem.id,
        };
      });
      //
      console.log(
        `Client connected: ${socket.id}, Username: ${username}, Uuid: ${uuid}, IntialRoom`
      );
      io.to(hauntedRoom).emit('join', members);
    }
  });

  // deno-lint-ignore no-explicit-any
  socket.on('chat message', (pyload: any) => {
    const messageValue = pyload.value?.trim();
    const lengthCond = messageValue.length <= 500;

    if (messageValue !== '' && lengthCond) {
      const message = {
        value: messageValue,
        clientID: socket.id,
        username: username,
        uuid: uuid,
        time: dateTime().utc().toISOString(),
      };

      io.to(hauntedRoom).emit('chat message', message);

      socket.to(hauntedRoom).emit('typing', {
        value: '',
        uuid: uuid,
        username: username,
        type: 'remove',
        clientID: socket.id,
      });
    }
  });

  // deno-lint-ignore no-explicit-any
  socket.on('typing', (value: any) => {
    socket.to(hauntedRoom).emit('typing', {
      value: value,
      type: 'typing',
      username: username,
      uuid: uuid,
      clientID: socket.id,
    });
  });

  socket.on('typingCancel', () => {
    socket.to(hauntedRoom).emit('typing', {
      value: '',
      type: 'remove',
      username: username,
      uuid: uuid,
      clientID: socket.id,
    });
  });

  // deno-lint-ignore no-explicit-any
  socket.on('disconnect', async (reason: any) => {
    socket.to(hauntedRoom).emit('typing', {
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
    (await io.to(hauntedRoom).fetchSockets()).forEach((socketItem: any) => {
      if (socket.id !== socketItem.id) {
        members[socketItem.data.uuid] = {
          ...socketItem.data,
          clientID: socketItem.id,
        };
      }
    });
    socket.to(hauntedRoom).emit('join', members);
    console.log(`Public client disconnected: ${socket.id}, Reason: ${reason}`);
  });
};
