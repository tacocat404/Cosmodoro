/* Cosmodoro server: the web pages (apps/web), sign-in (Better Auth) and one JSON document per user that every
   device syncs with. Locally one SQLite file (node:sqlite); on Vercel, Postgres (Neon) through DATABASE_URL. */
import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { bodyLimit } from 'hono/body-limit';
import { csrf } from 'hono/csrf';
import { serveStatic } from '@hono/node-server/serve-static';
import { betterAuth } from 'better-auth';
import { getMigrations } from 'better-auth/db/migration';
import { DatabaseSync } from 'node:sqlite';
import pg from 'pg';
import { randomBytes } from 'node:crypto';
import { resolve } from 'node:path';

const WEB = resolve(import.meta.dirname, '../../apps/web');
const env = process.env;

/* Postgres when DATABASE_URL is set (serverless hosts keep no files), else a SQLite file. Same SQL for both: `?`
   placeholders become $1, $2 … for Postgres */
function openDb(dbPath) {
  if (env.DATABASE_URL) {
    const pool = new pg.Pool({ connectionString: env.DATABASE_URL, max: 3 });
    const run = (sql, p) => { let i = 0; return pool.query(sql.replace(/\?/g, () => `$${++i}`), p); };
    return { raw: pool, run, get: async (sql, p) => (await run(sql, p)).rows[0] };
  }
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA journal_mode = WAL');
  return { raw: db, run: async (sql, p = []) => db.prepare(sql).run(...p), get: async (sql, p = []) => db.prepare(sql).get(...p) };
}

export async function createApp({ dbPath = env.DB_PATH || 'cosmodoro.db', baseURL = env.BETTER_AUTH_URL || 'http://localhost:8787' } = {}) {
  if (env.NODE_ENV === 'production' && !env.BETTER_AUTH_SECRET) throw new Error('BETTER_AUTH_SECRET is required in production');
  const db = openDb(dbPath);
  const auth = betterAuth({
    database: db.raw,
    baseURL,
    secret: env.BETTER_AUTH_SECRET,
    emailAndPassword: { enabled: true, minPasswordLength: 8 },
    socialProviders: env.GOOGLE_CLIENT_ID ? { google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET } } : {},
    /* counts live in the database: serverless instances don't share memory */
    rateLimit: { enabled: true, storage: 'database' },
    /* behind the host's proxy the client IP comes in a header (e.g. fly-client-ip); without it every visitor shares one
       rate-limit bucket */
    advanced: env.IP_HEADER ? { ipAddress: { ipAddressHeaders: [env.IP_HEADER] } } : {},
  });
  /* ponytail: checks the schema on every cold start (a few queries); move to a deploy step if start-up time matters */
  await (await getMigrations(auth.options)).runMigrations();
  await db.run(`CREATE TABLE IF NOT EXISTS user_data (
    user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
    data TEXT NOT NULL DEFAULT '{}',
    ical TEXT UNIQUE,
    updated_at BIGINT NOT NULL DEFAULT 0
  )`);
  const getRow = uid => db.get('SELECT data, ical FROM user_data WHERE user_id = ?', [uid]);
  const putData = (uid, data) => db.run(`INSERT INTO user_data (user_id, data, updated_at) VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`, [uid, data, Date.now()]);
  const putIcal = (uid, token) => db.run('INSERT INTO user_data (user_id, ical) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET ical = excluded.ical', [uid, token]);
  const load = async uid => JSON.parse((await getRow(uid))?.data || '{}');

  const app = new Hono();
  app.use(secureHeaders());
  /* form-style posts from other sites (the only kind a browser sends without asking) are refused */
  app.use('/api/*', csrf({ origin: new URL(baseURL).origin }));
  app.on(['GET', 'POST'], '/api/auth/*', c => auth.handler(c.req.raw));
  app.get('/api/config', c => c.json({ google: !!env.GOOGLE_CLIENT_ID }));

  /* everything below /api (except auth, config, the calendar feed) is for the signed-in user only, and only ever
     reads or writes that user's own row */
  const signedIn = async (c, next) => {
    const s = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!s) return c.json({ error: 'sign-in required' }, 401);
    c.set('uid', s.user.id);
    await next();
  };

  /* sync: the client sends its copy when it changed since the last sync (or null), gets the merged copy back */
  app.post('/api/sync', bodyLimit({ maxSize: 4 * 1024 * 1024 }), signedIn, async c => {
    const body = await c.req.json().catch(() => null);
    const uid = c.get('uid');
    if (!body || typeof body !== 'object') return c.json({ error: 'bad body' }, 400);
    let data = await load(uid);
    if (body.data != null) {
      if (!validData(body.data)) return c.json({ error: 'bad data' }, 400);
      data = merge(data, body.data, !!body.first);
      await putData(uid, JSON.stringify(data));
    }
    return c.json({ data });
  });

  /* calendar subscription: a long random address, made on first use; rotate makes a new one (the old one stops) */
  app.post('/api/ical', signedIn, async c => {
    const uid = c.get('uid'), body = await c.req.json().catch(() => ({}));
    let token = (await getRow(uid))?.ical;
    if (!token || body?.rotate) await putIcal(uid, (token = randomBytes(24).toString('base64url')));
    return c.json({ url: `${baseURL}/api/ical/${token}.ics` });
  });
  app.get('/api/ical/:file', async c => {
    const row = await db.get('SELECT data FROM user_data WHERE ical = ?', [c.req.param('file').replace(/\.ics$/, '')]);
    if (!row) return c.notFound();
    return c.body(ical(JSON.parse(row.data)), 200, { 'content-type': 'text/calendar; charset=utf-8', 'cache-control': 'no-store' });
  });

  app.all('/api/*', c => c.notFound());
  if (!env.VERCEL) app.use('/*', serveStatic({ root: WEB })); /* on Vercel the pages come from its CDN */
  return { app, auth };
}

const KEYS = { cats: 'array', missions: 'array', flights: 'array', settings: 'object' };
function validData(d) {
  if (!d || typeof d !== 'object' || Array.isArray(d)) return false;
  return Object.entries(d).every(([k, v]) => KEYS[k] && (KEYS[k] === 'array' ? Array.isArray(v) : v && typeof v === 'object' && !Array.isArray(v))
    && (k !== 'flights' || v.every(f => f && Number.isFinite(f.at))));
}

/* flights only ever get added, so both sides' are kept (same `at` = same flight, the incoming copy wins).
   ponytail: everything else is last-writer-wins per key, so two devices editing to-dos offline at once keep only the
   later one's list; per-item updatedAt + tombstones if that ever bites. The first sync after signing in (`first`)
   adds this device's to-dos to the account's instead of replacing them. */
export function merge(server, client, first = false) {
  const byKey = (a = [], b = [], key) => [...new Map([...a, ...b].map(x => [x[key], x])).values()];
  const out = { ...server };
  if (client.flights) out.flights = byKey(server.flights, client.flights, 'at').sort((a, b) => a.at - b.at);
  if (client.missions) out.missions = first ? byKey(server.missions, client.missions, 'id') : client.missions;
  if (client.cats) out.cats = first && server.cats?.length ? server.cats : client.cats;
  if (client.settings) out.settings = first ? { ...client.settings, ...server.settings } : { ...server.settings, ...client.settings };
  return out;
}

/* to-dos with a due date, as all-day events */
export function ical(data) {
  const esc = s => String(s).replace(/[\\;,]/g, m => '\\' + m).replace(/\r?\n/g, '\\n');
  const stamp = new Date().toISOString().replace(/[-:]|\.\d+/g, '');
  const ev = (data.missions || []).filter(m => !m.done && /^\d{4}-\d{2}-\d{2}$/.test(m.date || '')).map(m => [
    'BEGIN:VEVENT', `UID:${esc(m.id)}@cosmodoro`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${m.date.replaceAll('-', '')}`, `SUMMARY:${esc(m.t)}`, 'END:VEVENT',
  ].join('\r\n'));
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Cosmodoro//KO', 'X-WR-CALNAME:Cosmodoro', ...ev, 'END:VCALENDAR', ''].join('\r\n');
}
