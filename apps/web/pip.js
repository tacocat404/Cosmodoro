/* The small always-on-top window (Document Picture-in-Picture, Chrome/Edge 116+): the flight at a glance while you're
   reading in another tab or app. Two looks, card and bar, switched from the window itself; the choice is remembered.
   state() is read every frame of the small window, which keeps running while the flight tab is hidden. */
export const pipSupported = 'documentPictureInPicture' in window;

const KEY = 'cosmodoro.pip';
const SIZE = { card: [320, 140], bar: [400, 60] };
const P0 = [34, 108], C = [160, 4], P2 = [286, 108];   /* the card's arc, Earth to the planet */
const bez = (t, i) => (1 - t) ** 2 * P0[i] + 2 * (1 - t) * t * C[i] + t * t * P2[i];
const STARS = Array.from({ length: 34 }, (_, i) => {
  const r = n => ((Math.sin(i * 127.1 + n * 311.7) * 43758.5453) % 1 + 1) % 1;
  return `<circle cx="${(r(1) * 400).toFixed(1)}" cy="${(r(2) * 140).toFixed(1)}" r="${(0.3 + r(3) * 0.7).toFixed(2)}" opacity="${(0.25 + r(4) * 0.55).toFixed(2)}"/>`;
}).join('');
const ICON = {
  pause: '<path d="M5 3.5h2.2v9H5zM8.8 3.5H11v9H8.8z"/>',
  play: '<path d="M5 3.2v9.6L12.6 8z"/>',
  bar: '<rect x="2" y="6.5" width="12" height="3" rx="1.5"/>',
  card: '<rect x="2.5" y="3.5" width="11" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/>',
};
const icon = k => `<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">${ICON[k]}</svg>`;

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body { background: #05060a; color: #f2f2ef; font-family: "Pretendard Variable", system-ui, sans-serif; overflow: hidden; user-select: none; -webkit-font-smoothing: antialiased; }
  .w { position: relative; height: 100%; overflow: hidden; background: radial-gradient(160px 110px at var(--gx) var(--gy), color-mix(in srgb, var(--a) 22%, transparent), transparent 70%), linear-gradient(180deg, #0a0c16, #04050a); }
  .stars { position: absolute; inset: 0; fill: #fff; }
  .scene { position: absolute; inset: 0; overflow: visible; }
  .btns { position: absolute; right: 10px; top: 10px; display: flex; gap: 6px; z-index: 2; }
  button { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; border: 1px solid rgba(242,242,239,.16); background: rgba(10,12,20,.55); color: rgba(242,242,239,.82); cursor: pointer; transition: background .2s, color .2s, border-color .2s; }
  button:hover { background: rgba(242,242,239,.12); color: #fff; border-color: rgba(242,242,239,.32); }
  button.main { background: #f2f2ef; color: #05060a; border-color: #f2f2ef; }
  button.main:hover { background: #fff; }
  .eb { position: absolute; left: 14px; top: 15px; font: 500 9.5px/1 "IBM Plex Mono", monospace; letter-spacing: .16em; color: rgba(242,242,239,.5); white-space: nowrap; }
  .eb i { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--a); margin-right: 7px; vertical-align: 1px; box-shadow: 0 0 8px var(--a); }
  .time { font-family: "Inter Tight", "Pretendard Variable", sans-serif; font-weight: 300; font-variant-numeric: tabular-nums; letter-spacing: -.02em; }
  .card .mid { position: absolute; left: 0; right: 0; top: 70px; text-align: center; }
  .card .time { font-size: 34px; line-height: 1; }
  .sub { margin-top: 6px; font-size: 11px; color: rgba(242,242,239,.55); letter-spacing: -.01em; }
  .bar .eb, .bar .mid .sub { display: none; }
  .bar .mid { position: absolute; right: 84px; top: 0; bottom: 0; display: flex; align-items: center; }
  .bar .time { font-size: 21px; }
  .bar .btns { top: 16px; }
  .paused .time { opacity: .45; }
`;

function scene(s, mode, t) {
  const a = s.accent, p = Math.min(1, s.p);
  if (mode === 'bar') {
    const x0 = 22, x1 = 232, x = x0 + (x1 - x0) * p, y = 30;
    const ship = s.orbit
      ? [x1 + 11 * Math.cos(t * 0.9), y + 4.5 * Math.sin(t * 0.9), Math.cos(t * 0.9) * 90 + 90]
      : [x, y, 0];
    return `
      <line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="rgba(242,242,239,.28)" stroke-width="1" stroke-dasharray="1.5 4"/>
      <line x1="${x0}" y1="${y}" x2="${x}" y2="${y}" stroke="${a}" stroke-width="1.4" stroke-linecap="round"/>
      ${planet(x0, y, 5.5, { accent: '#4f86d9' })}
      ${planet(x1, y, 5.5, s)}
      ${shipAt(ship[0], ship[1], ship[2], a, 0.8)}`;
  }
  const d = `M${P0} Q${C} ${P2}`;
  let sx, sy, ang;
  if (s.orbit) {
    const w = t * 0.9; sx = P2[0] + 20 * Math.cos(w); sy = P2[1] + 6 * Math.sin(w); ang = Math.atan2(6 * Math.cos(w), -20 * Math.sin(w)) * 57.3;
  } else {
    sx = bez(p, 0); sy = bez(p, 1);
    const q = Math.min(1, p + 0.01), r = Math.max(0, q - 0.02);
    ang = Math.atan2(bez(q, 1) - bez(r, 1), bez(q, 0) - bez(r, 0)) * 57.3;
  }
  return `
    <path d="${d}" fill="none" stroke="rgba(242,242,239,.26)" stroke-width="1" stroke-dasharray="1.5 5" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="${a}" stroke-width="1.5" stroke-linecap="round" pathLength="1" stroke-dasharray="${p} 2"/>
    ${planet(P0[0], P0[1], 10, { accent: '#4f86d9' })}
    <circle cx="${P0[0]}" cy="${P0[1]}" r="12.5" fill="none" stroke="#9fc0ff" stroke-opacity=".3"/>
    ${s.orbit ? `<ellipse cx="${P2[0]}" cy="${P2[1]}" rx="20" ry="6" fill="none" stroke="${a}" stroke-opacity=".35" stroke-dasharray="1.5 3"/>` : ''}
    ${s.orbit && sy < P2[1] ? shipAt(sx, sy, ang, a, 0.85) + planet(P2[0], P2[1], 10, s) : planet(P2[0], P2[1], 10, s) + shipAt(sx, sy, ang, a, s.orbit ? 0.85 : 1)}`;
}
function planet(x, y, r, s) {
  const ring = s.ring ? `<ellipse cx="${x}" cy="${y}" rx="${r * 2}" ry="${r * 0.55}" fill="none" stroke="${s.accent}" stroke-opacity=".75" stroke-width="1.3" transform="rotate(-16 ${x} ${y})"/>` : '';
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${s.accent}"/><circle cx="${x + r * 0.35}" cy="${y + r * 0.2}" r="${r}" fill="#05060a" opacity=".35"/>${ring}`;
}
function shipAt(x, y, ang, a, k) {
  return `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${ang.toFixed(1)}) scale(${k})">
    <path d="M-8 0h-7" stroke="${a}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>
    <path d="M7 0 L-5 -4.2 L-3 0 L-5 4.2 Z" fill="#fff"/></g>`;
}
function label(s) {
  if (!s.started) return '발사 대기';
  if (s.paused) return '일시정지';
  if (s.done) return '도착했어요 · 탭으로 돌아가요';
  if (s.orbit) return `${s.ko} 궤도 · 자유 비행`;
  return s.free ? `${s.ko}행 · 집중한 시간` : `${s.ko}행 · 남은 시간`;
}

let win = null;
export async function togglePip(api) {
  if (win) { win.close(); return; }
  let mode = 'card', last = '';
  try { if (localStorage.getItem(KEY) === 'bar') mode = 'bar'; } catch {}
  win = await documentPictureInPicture.requestWindow({ width: SIZE[mode][0], height: SIZE[mode][1] });
  const doc = win.document;
  document.querySelectorAll('link[rel="stylesheet"], link[href*="fonts.googleapis"]').forEach(l => doc.head.append(l.cloneNode()));
  doc.head.insertAdjacentHTML('beforeend', `<style>${CSS}</style>`);
  doc.title = 'Cosmodoro';
  doc.body.innerHTML = `<div class="w"><svg class="stars" viewBox="0 0 400 140" preserveAspectRatio="xMidYMid slice">${STARS}</svg>
    <svg class="scene"></svg><div class="eb"><i></i><span></span></div>
    <div class="mid"><div class="time"></div><div class="sub"></div></div>
    <div class="btns"><button class="mode"></button><button class="main pause"></button></div></div>`;
  const $ = q => doc.querySelector(q), w = $('.w');
  const setMode = m => {
    mode = m; w.className = `w ${m}`; last = '';
    $('.mode').innerHTML = icon(m === 'card' ? 'bar' : 'card');
    $('.mode').setAttribute('aria-label', m === 'card' ? '한 줄로 보기' : '카드로 보기');
    w.style.setProperty('--gx', m === 'card' ? '89%' : '56%'); w.style.setProperty('--gy', m === 'card' ? '77%' : '50%');
  };
  setMode(mode);
  $('.mode').addEventListener('click', () => {
    setMode(mode === 'card' ? 'bar' : 'card');
    try { localStorage.setItem(KEY, mode); } catch {}
    const [cw, ch] = SIZE[mode];
    win.resizeTo(cw + win.outerWidth - win.innerWidth, ch + win.outerHeight - win.innerHeight);
  });
  $('.pause').addEventListener('click', api.pause);
  const t0 = performance.now();
  const tick = () => {
    if (!win) return;
    const s = api.state(), t = (performance.now() - t0) / 1000;
    $('.scene').setAttribute('viewBox', mode === 'card' ? '0 0 320 140' : '0 0 400 60');
    $('.scene').innerHTML = scene(s, mode, t);
    const key = [s.time, label(s), s.paused, s.ko].join('|');
    if (key !== last) {
      last = key;
      $('.time').textContent = s.time; $('.sub').textContent = label(s);
      $('.eb span').textContent = `TO ${s.en}`;
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
