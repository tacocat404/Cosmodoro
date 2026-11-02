/* Vercel: every /api request lands here (see vercel.json) */
import { createApp } from '../server/src/app.js';

const { app } = await createApp();
export default { fetch: req => app.fetch(req) };
