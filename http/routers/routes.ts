import { Hono } from 'hono';

import { errorHandler } from '../errors/error.api.ts';

const route = new Hono();

route.get('/', (c) => {
  return c.json({
    message: 'Hello World',
  });
});

route.onError(errorHandler);

export default route;
