/* Keeps this browser's copy (localStorage, what the pages read and write) and the account's copy on the server the
   same. Imported first by both pages: it syncs before the page reads anything, then pushes changes as they happen. */
const KEYS = { cats: 'cosmodoro.cats', missions: 'cosmodoro.missions', flights: 'cosmodoro.flights' };
const SETTINGS = ['goal', 'dur', 'traffic', 'quality', 'grade', 'sound'];
const USER = 'cosmodoro.user', PUSHED = 'cosmodoro.sync.pushed';
const read = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const post = (path, body, opts) => fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), ...opts });

function snapshot() {
  const d = { settings: {} };
  for (const [k, key] of Object.entries(KEYS)) { const v = read(key); if (Array.isArray(v)) d[k] = v; }
  SETTINGS.forEach(k => { const v = localStorage.getItem('cosmodoro.' + k); if (v !== null) d.settings[k] = v; });
  return d;
}
function apply(d) {
  for (const [k, key] of Object.entries(KEYS)) if (Array.isArray(d[k])) localStorage.setItem(key, JSON.stringify(d[k]));
  for (const [k, v] of Object.entries(d.settings || {})) if (SETTINGS.includes(k)) localStorage.setItem('cosmodoro.' + k, String(v));
}
const dirty = () => JSON.stringify(snapshot()) !== localStorage.getItem(PUSHED);

export const user = () => read(USER);

export async function sync({ first = false, keepalive = false } = {}) {
  if (!user()) return;
  const r = await post('api/sync', { data: first || dirty() ? snapshot() : null, first }, { keepalive });
  if (r.status === 401) return forget();
  if (!r.ok) return;
  apply((await r.json()).data);
  localStorage.setItem(PUSHED, JSON.stringify(snapshot()));
}

/* signed in (email form, or back from Google): remember who, then fold this device's records into the account */
export async function signedIn(u, via) {
  const flights = read(KEYS.flights)?.length || 0, todos = read(KEYS.missions)?.length || 0;
  const d = new Date(), since = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  localStorage.setItem(USER, JSON.stringify({ name: u.name || u.email.split('@')[0], email: u.email, via, since, merged: { flights, todos } }));
  await sync({ first: true });
}

/* signed out: this device's account data goes too, so the next person on it starts empty */
export function forget() {
  [USER, PUSHED, ...Object.values(KEYS), ...SETTINGS.map(k => 'cosmodoro.' + k)].forEach(k => localStorage.removeItem(k));
}

export async function auth(path, body) {
  const r = await post('api/auth/' + path, body);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.message || ''), { status: r.status, code: j.code });
  return j;
}

/* on load: pick up a session made elsewhere (Google sign-in comes back here), then sync. Never waits long: offline or a
   slow server just means the page opens with what this browser has */
await Promise.race([
  (async () => {
    if (!user()) {
      const s = await fetch('api/auth/get-session').then(r => (r.ok ? r.json() : null));
      if (s?.user) await signedIn(s.user, sessionStorage.getItem('cosmodoro.via') || 'email');
    } else await sync();
  })().catch(() => {}),
  new Promise(r => setTimeout(r, 2500)),
]);
/* ponytail: changes go up every 20 s and when the page hides; a keepalive request caps at 64 KB, so a big history
   that changed right before closing goes up on the next visit instead */
setInterval(() => { if (user() && dirty()) sync().catch(() => {}); }, 20000);
addEventListener('pagehide', () => { if (user() && dirty()) sync({ keepalive: true }).catch(() => {}); });
