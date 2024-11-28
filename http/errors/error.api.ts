import { type Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { HTTPResponseError } from 'hono/types';
import { logDev } from '../../lib/utils.ts';

export function errorHandler(err: Error | HTTPResponseError, c: Context) {
  if (err instanceof HTTPException) {
    logDev(err);
    return err.getResponse();
  } else {
    console.error(err.stack);
    return c.text('Server Error', 500);
  }
}
