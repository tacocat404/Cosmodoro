import { serve } from '@hono/node-server';
import { createApp } from './app.js';

const port = +(process.env.PORT || 8787);
const { app } = await createApp();
serve({ fetch: app.fetch, port }, () => console.log(`Cosmodoro on http://localhost:${port}`));
