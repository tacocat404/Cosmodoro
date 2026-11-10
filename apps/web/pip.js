/* The small always-on-top window (Document Picture-in-Picture, Chrome/Edge 116+): the flight at a glance while you're
   reading in another tab or app: one slim bar, Earth to the planet, the time, a pause button.
   The planets are drawn from the same surface maps the flight uses (assets/), lit from the Sun's side, once per open;
   the sky is drawn from the same star catalogue. The route line is the flight's meteor: neon trail, white-hot head.
   state() is read every frame of the small window, which keeps running while the flight tab is hidden. */
export const pipSupported = 'documentPictureInPicture' in window;

const W = 400, H = 60, Y = 30;
const DPR = 2, LAP = 25 * 60;   /* free flight in orbit: one lap = one 25-minute focus */
const MAPS = { mercury: 'mercury_1k.jpg', venus: 'venus_clouds_1k.jpg', earth: 'earth_day_1k.jpg', mars: 'mars_1k.jpg', jupiter: 'jupiter_1k.jpg', saturn: 'saturn_1k.jpg', uranus: 'uranus_1k.jpg', neptune: 'neptune_1k.jpg' };

const loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
const texCache = {};
const tex = f => texCache[f] ??= loadImg('assets/' + f).then(i => {
  const c = document.createElement('canvas'); c.width = i.width; c.height = i.height;
  const x = c.getContext('2d'); x.drawImage(i, 0, 0); return x.getImageData(0, 0, c.width, c.height);
});

/* a lit sphere from an equirectangular map, orthographic, with Saturn's ring in front of and behind it */
async function sphere(key, R, ring) {
  const t = await tex(MAPS[key]), rt = ring ? await tex('saturn_ring_1k.png') : null;
  const r = R * DPR, S = Math.ceil(ring ? r * 5 : r * 2.4), c = S / 2;
  const cv = document.createElement('canvas'); cv.width = cv.height = S;
  const x = cv.getContext('2d'), out = x.createImageData(S, S), o = out.data;
  const tilt = ring ? -0.28 : 0, ct = Math.cos(tilt), st = Math.sin(tilt), sinI = 0.34;
  const L = [-0.62, -0.3, 0.72], ll = Math.hypot(...L); L.forEach((v, i) => L[i] = v / ll);
  const ringAt = (u, v) => {
    const rr = Math.hypot(u, v / sinI);
    if (rr < 1.137 || rr > 2.391) return null;
    const k = (Math.min(1023, Math.floor((rr - 1.137) / 1.254 * 1024)) + 31 * rt.width) * 4;
    return [rt.data[k], rt.data[k + 1], rt.data[k + 2], rt.data[k + 3] / 255 * 0.95];
  };
  for (let py = 0; py < S; py++) for (let px = 0; px < S; px++) {
    const dx = (px + 0.5 - c) / r, dy = (py + 0.5 - c) / r, d = Math.hypot(dx, dy);
    const u = dx * ct + dy * st, v = -dx * st + dy * ct;
    let R0 = 0, G0 = 0, B0 = 0, A0 = 0;
    const over = (cr, cg, cb, a) => { R0 = R0 * (1 - a) + cr * a; G0 = G0 * (1 - a) + cg * a; B0 = B0 * (1 - a) + cb * a; A0 = A0 * (1 - a) + a; };
    const rc = ring ? ringAt(u, v) : null;
    if (rc && v < 0) over(rc[0], rc[1], rc[2], rc[3]);
    if (key === 'earth' && d > 0.9 && d < 1.12) {   /* the thin blue air on the lit limb */
      const g = Math.exp(-Math.abs(d - 0.995) * 22) * Math.max(0, (dx * L[0] + dy * L[1]) / Math.max(d, 1e-3) + 0.35);
      over(110, 165, 255, Math.min(1, g * 0.8));
    }
    if (d < 1 + 1 / r) {
      const nz = Math.sqrt(Math.max(0, 1 - d * d));
      const tx = Math.floor((Math.atan2(u, nz) / (2 * Math.PI) + 0.5) * t.width) % t.width;
      const ty = Math.min(t.height - 1, Math.floor((0.5 + Math.asin(Math.max(-1, Math.min(1, v))) / Math.PI) * t.height));
      const k = (ty * t.width + tx) * 4;
      const ndl = dx * L[0] + dy * L[1] + nz * L[2];
      const lit = Math.pow(Math.min(1, Math.max(0, ndl * 1.08 + 0.02)), 0.85) * (0.78 + 0.22 * nz) + 0.015;
      over(t.data[k] * lit, t.data[k + 1] * lit, t.data[k + 2] * lit, Math.min(1, Math.max(0, (1 - d) * r + 0.5)));
    }
    if (rc && v >= 0) over(rc[0], rc[1], rc[2], rc[3]);
    const i = (py * S + px) * 4;
    if (A0 > 0) { o[i] = R0 / A0; o[i + 1] = G0 / A0; o[i + 2] = B0 / A0; o[i + 3] = A0 * 255; }
  }
  x.putImageData(out, 0, 0);
  return { url: cv.toDataURL(), size: S / DPR };
}
/* the real sky from the flight's star catalogue (assets/stars_mag75.json): the Orion-Taurus-Gemini field, every star to
   magnitude 7.5 at its true place, size and colour */
let skyUrl = null;
async function sky() {
  if (skyUrl) return skyUrl;
  const j = await (await fetch('assets/stars_mag75.json')).json();
  const b = atob(j.data), u = new Uint16Array(b.length / 2);
  for (let i = 0; i < u.length; i++) u[i] = b.charCodeAt(2 * i) | b.charCodeAt(2 * i + 1) << 8;
  const W = 800, H = 350, RA0 = 84, SPAN = 104, DEC0 = 4, c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.fillStyle = '#020306'; x.fillRect(0, 0, W, H);
  const col = bv => bv < 0 ? [170, 195, 255] : bv < 0.6 ? [235, 240, 255] : bv < 1.1 ? [255, 236, 205] : [255, 196, 140];
  for (let i = j.count - 1; i >= 0; i--) {   /* faint first, so the bright ones sit on top */
    let ra = u[4 * i] / 65535 * 360, dec = u[4 * i + 1] / 65535 * 180 - 90;
    const mag = u[4 * i + 2] / 65535 * 10 - 2, bv = u[4 * i + 3] / 65535 * 3 - 0.5;
    let dra = ((ra - RA0 + 540) % 360) - 180;
    const px = W / 2 - dra / SPAN * W, py = H / 2 - (dec - DEC0) / SPAN * W;
    if (px < -4 || px > W + 4 || py < -4 || py > H + 4) continue;
    const [r, g, bb] = col(bv), a = Math.min(1, Math.max(0.18, (8 - mag) / 5.5)), rad = Math.max(0.45, (7.6 - mag) * 0.32);
    if (mag < 2.2) {
      const gl = x.createRadialGradient(px, py, 0, px, py, rad * 5);
      gl.addColorStop(0, `rgba(${r},${g},${bb},.35)`); gl.addColorStop(1, `rgba(${r},${g},${bb},0)`);
      x.fillStyle = gl; x.fillRect(px - rad * 5, py - rad * 5, rad * 10, rad * 10);
    }
    x.fillStyle = `rgba(${r},${g},${bb},${a})`;
    x.beginPath(); x.arc(px, py, rad, 0, 7); x.fill();
  }
  return skyUrl = c.toDataURL('image/png');
}

const ICON = {
  pause: '<rect x="5.5" y="4" width="4" height="16" rx="1.6"/><rect x="14.5" y="4" width="4" height="16" rx="1.6"/>',
  play: '<path d="M7 4.6v14.8a1.2 1.2 0 0 0 1.8 1l12-7.4a1.2 1.2 0 0 0 0-2l-12-7.4A1.2 1.2 0 0 0 7 4.6Z"/>',
};
const icon = k => `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">${ICON[k]}</svg>`;

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body { background: #000; color: #f2f2ef; overflow: hidden; user-select: none; -webkit-font-smoothing: antialiased; }
  .w { position: relative; height: 100%; overflow: hidden; background: #000 center / cover; }
  .w::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(120% 160% at 50% 50%, transparent 55%, rgba(0,0,0,.5)); }
  .w > * { position: absolute; }
  svg.l { inset: 0; overflow: visible; }
  img.pl { pointer-events: none; }
  .base { fill: none; stroke: rgba(242,242,239,.18); stroke-width: 1; }
  .done { fill: none; stroke: color-mix(in srgb, var(--a) 75%, transparent); stroke-width: 1.3; stroke-linecap: round; filter: drop-shadow(0 0 3px var(--a)); }
  .tail { fill: none; stroke-linecap: round; }
  .head { fill: #fff; filter: drop-shadow(0 0 1.5px #fff) drop-shadow(0 0 5px var(--a)) drop-shadow(0 0 11px var(--a)); animation: burn 1.6s ease-in-out infinite; }
  @keyframes burn { 50% { filter: drop-shadow(0 0 2px #fff) drop-shadow(0 0 7px var(--a)) drop-shadow(0 0 15px var(--a)); } }
  .orb { fill: none; stroke: color-mix(in srgb, var(--a) 50%, transparent); stroke-width: 1; filter: drop-shadow(0 0 2px var(--a)); }
  .lapdot { fill: var(--a); filter: drop-shadow(0 0 3px var(--a)); }
  button { right: 10px; top: 16px; width: 28px; height: 28px; border: 0; border-radius: 8px; background: transparent; color: #f2f2ef; display: grid; place-items: center; cursor: pointer; z-index: 3; transition: background .2s; }
  button:hover { background: rgba(242,242,239,.08); }
  /* the logo's lettering is drawn, not a font: Quicksand has the same round, even strokes; the logo's soft neon glow */
  .time { right: 46px; top: 0; bottom: 0; display: flex; align-items: center; z-index: 2; font: 500 27px Quicksand, sans-serif; font-variant-numeric: tabular-nums; letter-spacing: .01em; color: #f6f4ee;
    text-shadow: 0 0 2px rgba(246,244,238,.5), 0 0 10px rgba(246,244,238,.28), 0 0 22px color-mix(in srgb, var(--a) 30%, transparent); }
  .paused .time { opacity: .45; }
`;

/* the neon route on any path with pathLength=1: dim base, lit part, a tapering tail that whitens toward the head */
function neon(d, p, hx, hy) {
  const tl = Math.min(0.16, p);
  let tail = '';
  for (let k = 0; k < 12; k++) {
    const a = p - tl + tl * k / 12, f = (k + 1) / 12;
    tail += `<path d="${d}" pathLength="1" class="tail" stroke="color-mix(in srgb, var(--a) ${Math.round(100 - f * 55)}%, #fff)" stroke-width="${(0.6 + f * 2.6).toFixed(2)}" stroke-opacity="${(f * 0.95).toFixed(2)}" stroke-dasharray="${(tl / 12 + 0.002).toFixed(4)} 2" stroke-dashoffset="${(-a).toFixed(4)}"/>`;
  }
  return `<path d="${d}" class="base"/><path d="${d}" pathLength="1" class="done" stroke-dasharray="${p} 2"/>${p > 0.002 ? tail : ''}<circle class="head" cx="${hx.toFixed(2)}" cy="${hy.toFixed(2)}" r="2.6"/>`;
}

/* orbit around the planet, tilted a little: back half under the planet image, front half over it; the head and its
   tail slip behind the planet too */
function orbit(cx, cy, a, b, w) {
  const tilt = -0.14, ct = Math.cos(tilt), st = Math.sin(tilt);
  const at = v => [cx + a * Math.cos(v) * ct - b * Math.sin(v) * st, cy + a * Math.cos(v) * st + b * Math.sin(v) * ct];
  const back = [], front = [];
  for (let k = 0; k < 48; k++) {   /* the ring of the orbit itself, in short pieces so each half can go its own side */
    const [x0, y0] = at(k / 48 * 2 * Math.PI), [x1, y1] = at((k + 1) / 48 * 2 * Math.PI);
    (Math.sin((k + 0.5) / 48 * 2 * Math.PI) < 0 ? back : front).push(`<path class="orb" d="M${x0.toFixed(2)} ${y0.toFixed(2)}L${x1.toFixed(2)} ${y1.toFixed(2)}"/>`);
  }
  for (let k = 0; k < 16; k++) {
    const f = (k + 1) / 16, w0 = w - 1.4 + 1.4 * k / 16, w1 = w0 + 1.4 / 16 + 0.01;
    const [x0, y0] = at(w0), [x1, y1] = at(w1);
    (Math.sin((w0 + w1) / 2) < 0 ? back : front).push(`<path class="tail" d="M${x0.toFixed(2)} ${y0.toFixed(2)}L${x1.toFixed(2)} ${y1.toFixed(2)}" stroke="color-mix(in srgb, var(--a) ${Math.round(100 - f * 60)}%, #fff)" stroke-width="${(0.5 + f * 2.4).toFixed(2)}" stroke-opacity="${(f * 0.95).toFixed(2)}"/>`);
  }
  const [hx, hy] = at(w);
  (Math.sin(w) < 0 ? back : front).push(`<circle class="head" cx="${hx.toFixed(2)}" cy="${hy.toFixed(2)}" r="2.4"/>`);
  return [back.join(''), front.join('')];
}

/* Earth -> planet. In free flight, once there, the line stays lit and the meteor circles the planet; each finished
   25-minute lap lights a dot on the line */
function layout(s, R) {
  const D = [s.ring ? 250 : 254, Y], oa = R * (s.ring ? 2.8 : 1.8), ob = R * (s.ring ? 0.75 : 0.42);
  return { E: [20, Y], D, oa, ob, x0: 34, x1: D[0] - (s.orbit ? oa : R * (s.ring ? 2.3 : 1)) - 6 };
}
function scene(s, g, w) {
  const d = `M${g.x0} ${Y}H${g.x1}`;
  if (!s.orbit) { const p = Math.min(1, s.p); return ['', neon(d, p, g.x0 + (g.x1 - g.x0) * p, Y)]; }
  const laps = Math.floor(s.sec / LAP);
  let dots = '';
  for (let k = 0; k < Math.min(laps, 8); k++) dots += `<circle class="lapdot" cx="${g.x1 - 4 - k * 8}" cy="${Y}" r="2"/>`;
  const [bk, fr] = orbit(g.D[0], g.D[1], g.oa, g.ob, w);
  return [bk, `<path d="${d}" class="done" style="opacity:.45"/>${dots}${fr}`];
}

let win = null;
export async function togglePip(api) {
  if (win) { win.close(); return; }
  const s0 = api.state(), R = s0.ring ? 10 : 15;
  /* start drawing, then open: the window has to open inside the click */
  const draw = Promise.all([sky(), sphere('earth', 8, false), sphere(s0.planet, R, s0.ring)]);
  win = await documentPictureInPicture.requestWindow({ width: W, height: H });
  const doc = win.document;
  doc.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600&display=swap"><style>${CSS}</style>`);
  doc.title = 'Cosmodoro';
  doc.body.innerHTML = `<div class="w"><svg class="l back" viewBox="0 0 ${W} ${H}"></svg><img class="pl earth" alt=""><img class="pl dest" alt=""><svg class="l front" viewBox="0 0 ${W} ${H}"></svg>
    <div class="time"></div><button class="pause"></button></div>`;
  const $ = q => doc.querySelector(q), w = $('.w');
  const [skyU, earth, dest] = await draw;
  w.style.backgroundImage = `url(${skyU})`;
  const place = (el, im, at) => {
    el.style.display = at ? '' : 'none';
    if (at) { el.src = im.url; Object.assign(el.style, { width: im.size + 'px', left: at[0] - im.size / 2 + 'px', top: at[1] - im.size / 2 + 'px' }); }
  };
  $('.pause').addEventListener('click', api.pause);
  let g, orbitWas, last = '', ang = 0, prev = performance.now();
  const tick = () => {
    if (!win) return;
    const s = api.state();
    const now = performance.now();
    if (!s.paused) ang += (now - prev) / 1000 * 0.9;
    prev = now;
    if (s.orbit !== orbitWas) { orbitWas = s.orbit; g = layout(s, R); place($('.earth'), earth, g.E); place($('.dest'), dest, g.D); }
    [$('.back').innerHTML, $('.front').innerHTML] = scene(s, g, ang);
    const key = s.time + s.paused;
    if (key !== last) {
      last = key;
      $('.time').textContent = s.time;
      w.style.setProperty('--a', s.accent);
      w.classList.toggle('paused', s.paused);
      $('.pause').innerHTML = icon(s.paused ? 'play' : 'pause');
      $('.pause').setAttribute('aria-label', s.paused ? '다시 시작' : '일시정지');
    }
    win.requestAnimationFrame(tick);
  };
  win.requestAnimationFrame(tick);
  win.addEventListener('pagehide', () => { win = null; });
}
