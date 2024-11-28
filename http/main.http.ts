import { Hono } from 'hono';

import router from './routers/routes.ts'

import { logger } from 'hono/logger';
// import { csrf } from "hono/csrf";

// Create root app
const http = new Hono();

// log requests in development mode
if (Deno.env.get('MODE') === 'development') {
  http.use(logger());
}

// app.use(
//   csrf()
// )


// Serve static files
// app.use('/static/*', serveStatic({ root: './' }));



// Inject routes
http.route('/', router);

export default http;