/* 시안: 끝난 과목을 "별로 보내기" (v6-flight-stars.html?mode=atlas 전용)
   기존 부품(.pd-btn, .pd-chip, .pd-note, .plabel, .ml-row, .atlas-back)만 다시 써요.
   콘솔/캡처용: STARS.scene1('A'|'B'), STARS.scene2('A'|'B'), STARS.scene3('A'|'B') */
const C = window.cosmodoro, P = COSMO.PLANETS;
/* 예시: 지난 학기에 별로 보낸 과목 */
const SENT = [
  { key: 'calc', name: '미적분학', planet: 'mars', min: 2530 },
  { key: 'phys', name: '일반물리학', planet: 'jupiter', min: 1890 },
  { key: 'writing', name: '대학 글쓰기', planet: 'venus', min: 740 },
];
const hm = m => `${Math.floor(m / 60)}시간 ${String(m % 60).padStart(2, '0')}분`;

document.head.insertAdjacentHTML('beforeend', `<style>
  .us-layer { position: fixed; inset: 0; pointer-events: none; z-index: 3; }
  .us-layer svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .us-link { fill: none; stroke: rgba(242,242,239,.14); stroke-width: 1; stroke-dasharray: 2 4; }
  .ustar { position: absolute; left: 0; top: 0; width: 0; height: 0; pointer-events: auto; cursor: pointer; }
  .ustar::before { content: ""; position: absolute; left: -14px; top: -14px; width: 28px; height: 28px; border-radius: 50%; }
  .ustar i { position: absolute; border-radius: 50%; background: radial-gradient(circle, #fff 0 16%, color-mix(in srgb, var(--sc) 35%, #fff) 26%, color-mix(in srgb, var(--sc) 30%, transparent) 46%, transparent 72%); }
  .ustar.ring::after { content: ""; position: absolute; left: -11px; top: -11px; width: 22px; height: 22px; border-radius: 50%; border: 1px solid rgba(242,242,239,.32); }
  .ustar .plabel { position: absolute; left: 6px; top: -9px; pointer-events: none; opacity: 0; transition: opacity .3s; }
  .ustar.hover .plabel, .ustar:hover .plabel { opacity: 1; }
  .us-take { pointer-events: auto; margin-top: 6px; background: none; border: 0; border-bottom: 1px solid rgba(242,242,239,.4); padding: 0 0 1px; cursor: pointer; font-family: var(--mono); font-size: 9.5px; letter-spacing: .1em; color: var(--ink); }
  .us-btn { position: absolute; top: 38px; display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--edge, #333); background: rgba(0,0,0,.35); color: var(--ink-2); font-family: var(--mono); font-size: 11px; letter-spacing: .08em; cursor: pointer; z-index: 4; }
  .us-btn.on { color: var(--ink); border-color: #777; }
  .us-list { position: absolute; top: 90px; width: 330px; z-index: 4; }
  .us-list .ml-row { grid-template-columns: 22px minmax(0, 1fr) auto; }
  .us-list .ml-row .dot { width: 6px; height: 6px; border-radius: 50%; background: #fff; box-shadow: 0 0 8px 2px color-mix(in srgb, var(--sc) 70%, transparent); }
  .us-list .ml-row.cur { color: var(--ink); }
  .us-pick { padding: 4px 0 10px 30px; }
  .us-pick small { display: block; font-size: 12px; color: var(--ink-3); margin-bottom: 8px; }
  .us-pick .pd-tabs { margin: 0; gap: 14px; border: 0; flex-wrap: nowrap; }
  .us-pick .pd-tabs button { display: inline-flex; align-items: center; gap: 6px; }
  .us-pick .pd-tabs .pi { width: 12px; height: 12px; }
  .us-pick .pd-tabs button[disabled] { opacity: .35; cursor: default; }
  .us-toast { position: fixed; left: 50%; bottom: 44px; transform: translateX(-50%); }
</style>`);

const layer = document.createElement('div');
layer.className = 'us-layer';
layer.innerHTML = '<svg><polyline class="us-link"/></svg>';
document.body.appendChild(layer);
/* 별 자리: 태양계를 처음 연 시점에서 왼쪽 위 하늘의 한 구역. 하늘에 고정돼서 카메라가 돌면 같이 돌아요
   (실제 구현에선 실제 별 목록에서 그 구역의 별을 빌려 와요) */
const SPOTS = [[-0.80, 0.42], [-0.66, 0.60], [-0.86, 0.68]];
let dirs = null;
const stars = SENT.map((s, i) => {
  const el = document.createElement('div');
  el.className = 'ustar';
  el.style.setProperty('--sc', P[s.planet].color);
  const r = 4 + Math.log2(1 + s.min / 300) * 2.2; /* 밝기(크기) = 집중한 시간 */
  el.innerHTML = `<i style="left:${-r}px;top:${-r}px;width:${2 * r}px;height:${2 * r}px"></i>
    <div class="plabel"><span class="stem"></span><span>${s.name}<small>${hm(s.min)}</small></span></div>`;
  layer.appendChild(el);
  return { s, el, i };
});
function place() {
  const cam = C.camera;
  if (!dirs) dirs = SPOTS.map(([x, y]) => cam.position.clone().set(x, y, 0.5).unproject(cam).sub(cam.position).normalize());
  const fwd = cam.position.clone().set(0, 0, -1).transformDirection(cam.matrixWorld);
  const pts = [];
  stars.forEach(({ el, i }) => {
    const v = cam.position.clone().addScaledVector(dirs[i], 1e5).project(cam);
    const on = dirs[i].dot(fwd) > 0;
    const x = (v.x + 1) / 2 * innerWidth, y = (1 - v.y) / 2 * innerHeight;
    el.style.display = on ? '' : 'none';
    el.style.transform = `translate(${x}px, ${y}px)`;
    if (on) pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  });
  layer.querySelector('.us-link').setAttribute('points', pts.join(' '));
  requestAnimationFrame(place);
}
const wait = () => new Promise(r => { const t = () => (C?.ready && C.camera ? r() : setTimeout(t, 200)); t(); });

/* 장면 ① 행성 확대 화면의 버튼 줄 */
function scene1(v) {
  C.focusPlanet('mars');
  C.AT.f = 0.999; /* land the camera now (the capture runs on slow software rendering) */
  const p = P.mars, chip = `<span class="pd-chip">${COSMO.icon('mars', p.color)}코딩</span>
    <button class="pd-btn solid">이 행성으로 집중하기<iconify-icon icon="solar:arrow-right-linear" width="15"></iconify-icon></button>`;
  const fill = () => {
    document.getElementById('pdCat').innerHTML = v === 'A'
      ? `${chip}<button class="pd-btn quiet">이름 바꾸기</button><button class="pd-btn quiet warn">정말 별로 보낼까요?</button>
         <span class="pd-note">행성은 비워지고, 코딩은 하늘의 별이 돼요 · 집중한 42시간 10분은 그대로 남아요</span>`
      : `${chip}<button class="pd-btn">별로 보내기</button><button class="pd-btn quiet warn">그냥 떼기</button><button class="pd-btn quiet">취소</button>
         <span class="pd-note">별로 보내면 하늘에 남아 언제든 다시 불러올 수 있어요</span>`;
    const last = document.querySelector('#pdStats > :last-child > :last-child'); /* the example's own focus time */
    if (last) { last.textContent = '42시간 10분'; last.style.color = ''; }
  };
  setTimeout(fill, 60); setTimeout(fill, 900);
}
/* 장면 ② 하늘의 내 별, 하나에 마우스를 올린 상태 */
function scene2(v) {
  C.unfocus?.();
  stars.forEach(({ el, i }) => { el.classList.toggle('hover', i === 0); el.classList.toggle('ring', v === 'B' && i === 0); });
}
/* 장면 ③ 별 목록 */
function scene3(v) {
  C.unfocus?.();
  document.querySelectorAll('.us-btn, .us-list').forEach(e => e.remove());
  const back = document.getElementById('atlasBack'), right = 40 + back.offsetWidth + 8;
  document.body.insertAdjacentHTML('beforeend', `<button class="us-btn on" style="right:${right}px">✦ 별 ${SENT.length}</button>
    <div class="us-list ml-list" style="right:${right}px"><ol>${SENT.map((s, i) => `
      <li class="ml-row${i === 0 ? ' cur' : ''}" style="--sc:${P[s.planet].color}"><span class="dot"></span><span>${s.name}</span>
        ${v === 'B' && i === 0 ? '<button class="swap" style="display:inline">불러오기</button>' : `<span class="side">${Math.round(s.min / 60)}H</span>`}</li>
      ${v === 'B' && i === 0 ? `<li class="us-pick"><small>화성은 지금 코딩이 써요 · 빈 행성을 골라요</small><nav class="pd-tabs">
        ${['mercury', 'mars', 'jupiter', 'uranus'].map(k => `<button ${k === 'mars' ? 'disabled' : ''}>${COSMO.icon(k, P[k].color)}${P[k].EN}</button>`).join('')}</nav></li>` : ''}`).join('')}
    </ol></div>`);
  stars.forEach(({ el, i }) => { el.classList.toggle('hover', v === 'A' && i === 0); el.classList.remove('ring'); });
  if (v === 'A') {
    const lab = stars[0].el.querySelector('.plabel > span:last-child');
    if (!lab.querySelector('.us-take')) lab.insertAdjacentHTML('beforeend', '<button class="us-take">불러오기</button>');
  }
}

await wait();
/* wait until the atlas intro move has finished (F.m eases to 1), then a couple of frames for the camera */
await new Promise(r => { const t = () => (C.F.m === 1 && document.body.classList.contains('ready') ? r() : setTimeout(t, 250)); t(); });
await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
place();
window.STARS = { scene1, scene2, scene3 };
