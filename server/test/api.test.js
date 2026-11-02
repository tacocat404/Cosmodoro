import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp, merge } from '../src/app.js';

const base = 'http://localhost:8787';
const { app } = await createApp({ dbPath: ':memory:', baseURL: base });
const call = (path, { cookie, body } = {}) => app.request(base + path, {
  method: body === undefined ? 'GET' : 'POST',
  headers: { 'content-type': 'application/json', origin: base, ...(cookie && { cookie }) },
  body: body === undefined ? undefined : JSON.stringify(body),
});
async function signUp(email) {
  const r = await call('/api/auth/sign-up/email', { body: { email, password: 'correct horse 1', name: email.split('@')[0] } });
  assert.equal(r.status, 200, await r.clone().text());
  return r.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');
}

test('sync needs a session', async () => {
  assert.equal((await call('/api/sync', { body: { data: null } })).status, 401);
  assert.equal((await call('/api/sync', { cookie: 'better-auth.session_token=forged', body: { data: null } })).status, 401);
});

test('other sites can\'t post forms to the API, and server files aren\'t served', async () => {
  const r = await app.request(base + '/api/sync', { method: 'POST', headers: { 'content-type': 'text/plain', origin: 'https://evil.example' }, body: '{"data":null}' });
  assert.equal(r.status, 403);
  for (const p of ['/../server/src/app.js', '/%2e%2e/server/package.json', '/../../server/cosmodoro.db']) assert.equal((await app.request(base + p)).status, 404, p);
  assert.equal((await app.request(base + '/')).headers.get('x-content-type-options'), 'nosniff');
});

test('each user only ever sees their own data', async () => {
  const a = await signUp('a@test.dev'), b = await signUp('b@test.dev');
  const mine = { missions: [{ id: 1, t: '비밀 할 일', topic: 'code', date: '2026-11-03' }], flights: [{ at: 1, min: 25, topic: 'code' }] };
  assert.deepEqual((await (await call('/api/sync', { cookie: a, body: { data: mine } })).json()).data.missions, mine.missions);
  assert.deepEqual((await (await call('/api/sync', { cookie: b, body: { data: null } })).json()).data, {});
  assert.equal((await call('/api/sync', { cookie: a, body: { data: { missions: 'x' } } })).status, 400);

  const { url } = await (await call('/api/ical', { cookie: a, body: {} })).json();
  const feed = await (await call(new URL(url).pathname)).text();
  assert.match(feed, /SUMMARY:비밀 할 일/);
  assert.match(feed, /DTSTART;VALUE=DATE:20261103/);
  const { url: rotated } = await (await call('/api/ical', { cookie: a, body: { rotate: true } })).json();
  assert.notEqual(rotated, url);
  assert.equal((await call(new URL(url).pathname)).status, 404);
});

test('merge keeps every flight; first sign-in adds this device\'s to-dos', () => {
  const server = { flights: [{ at: 1, min: 25 }], missions: [{ id: 1 }], cats: [{ key: 'code' }] };
  const out = merge(server, { flights: [{ at: 2, min: 50 }, { at: 1, min: 25, rating: 5 }], missions: [{ id: 2 }], cats: [{ key: 'read' }] }, true);
  assert.deepEqual(out.flights, [{ at: 1, min: 25, rating: 5 }, { at: 2, min: 50 }]);
  assert.deepEqual(out.missions, [{ id: 1 }, { id: 2 }]);
  assert.deepEqual(out.cats, [{ key: 'code' }]);
  assert.deepEqual(merge(server, { missions: [] }).missions, []);
});
