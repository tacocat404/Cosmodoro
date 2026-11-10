/* Cosmodoro shared data, used by the main page and the flight page:
   - PLANETS: every world you can fly to (and Earth, the home base), with its colours, lettering, facts and figures
   - categories: which category sits on which planet, kept in this browser (cosmodoro.cats)
   - the planet icon sprite (solid discs with each world's feature cut through) */
(function () {
  /* figures: NASA/NSSDC planetary fact sheet (mean distance from the Sun, orbital period); light time = distance / c */
  const PLANETS = {
    mercury: {
      ko: '수성', en: 'Mercury', EN: 'MERCURY', color: '#b39dff', accent: '#b39dff', tint: '#a89e94', scale: 0.62, ring: false,
      letter: { text: 'MERCURY', main: 'font-family:"Fraunces",serif;font-weight:300;font-size:min(150px,10.4vw);letter-spacing:-.01em', poster: 'font-family:"Fraunces",serif;font-weight:300;font-size:78px;letter-spacing:-.01em' },
      meta: 'YEAR 88 D · 0.39 AU', ticket: { code: 'MRC', ink: '#7a63c9', on: '#f3efff' }, flight: { dist: 0.61, arc: -1.7 },
      fact: '수성은 태양에 가장 가까운 행성이에요. 낮에는 430°C까지 오르고 밤에는 영하 180°C까지 떨어져요.',
      stats: { km: '5,790만 km', light: '3분 13초', year: '88일', type: '암석 행성' },
    },
    venus: {
      ko: '금성', en: 'Venus', EN: 'VENUS', color: '#27c2b0', accent: '#27c2b0', tint: '#d4c597', scale: 1, ring: false,
      letter: { text: 'Venus', main: 'font-family:"Instrument Serif",serif;font-style:italic;font-weight:400;font-size:min(200px,13.9vw);letter-spacing:-.02em', poster: 'font-family:"Instrument Serif",serif;font-style:italic;font-weight:400;font-size:116px;letter-spacing:-.02em' },
      meta: 'DAY 243 D · 0.72 AU', ticket: { code: 'VNS', ink: '#1f9e8f', on: '#04302a' }, flight: { dist: 0.28, arc: -1.35 },
      fact: '금성은 하루(약 243일)가 1년(약 225일)보다 길고, 다른 행성들과 반대 방향으로 자전해요.',
      stats: { km: '1억 820만 km', light: '6분 1초', year: '225일', type: '암석 행성' },
    },
    earth: {
      ko: '지구', en: 'Earth', EN: 'EARTH', color: '#7f9cc4', accent: '#7f9cc4', tint: '#7f9cc4', scale: 1, ring: false, home: true,
      fact: '모든 비행이 시작되는 출발 기지예요. 여기서 떠나 목적지 행성에 닿는 동안 집중해요.',
      stats: { km: '1억 4,960만 km', light: '8분 19초', year: '365일', type: '암석 행성' },
    },
    mars: {
      ko: '화성', en: 'Mars', EN: 'MARS', color: '#ff5b1f', accent: '#ff5b1f', tint: '#c98466', scale: 1, ring: false,
      letter: { text: 'MARS', main: 'font-family:"Big Shoulders Display",var(--display);font-weight:800;font-size:min(208px,14.4vw);letter-spacing:.01em', poster: 'font-family:"Big Shoulders Display",var(--display);font-weight:800;font-size:132px;letter-spacing:.01em' },
      meta: 'SOL 24H 40M · 1.52 AU', ticket: { code: 'MRS', ink: '#c4451d', on: '#2a0e03' }, flight: { dist: 0.52, arc: 1.5 },
      fact: '화성의 하루(솔)는 약 24시간 40분이에요. 올림푸스 화산은 에베레스트보다 2.5배쯤 높아요.',
      stats: { km: '2억 2,800만 km', light: '12분 41초', year: '687일', type: '암석 행성' },
    },
    jupiter: {
      ko: '목성', en: 'Jupiter', EN: 'JUPITER', color: '#e8b04f', accent: '#e8b04f', tint: '#c8a27a', scale: 1, ring: false,
      letter: { text: 'JUPITER', main: 'font-family:Archivo,var(--display);font-stretch:125%;font-weight:800;font-size:min(122px,8.4vw);letter-spacing:-.01em', poster: 'font-family:Archivo,var(--display);font-stretch:125%;font-weight:800;font-size:64px;letter-spacing:-.01em' },
      meta: 'GREAT RED SPOT · 5.2 AU', ticket: { code: 'JUP', ink: '#c0782c', on: '#2a1606' }, flight: { dist: 4.2, arc: 1.25 },
      fact: '목성은 다른 행성을 모두 합친 것보다 두 배 넘게 무거워요. 대적점은 지구가 통째로 들어갈 만큼 큰 폭풍이에요.',
      stats: { km: '7억 7,850만 km', light: '43분 17초', year: '11.9년', type: '가스 거인' },
    },
    saturn: {
      ko: '토성', en: 'Saturn', EN: 'SATURN', color: '#c9b98a', accent: '#eadcb4', tint: '#c3a074', scale: 0.6, ring: true,
      letter: { text: 'SATURN', main: 'font-family:"Bodoni Moda",serif;font-weight:500;font-size:min(136px,9.4vw);letter-spacing:.02em', poster: 'font-family:"Bodoni Moda",serif;font-weight:500;font-size:66px;letter-spacing:.02em' },
      meta: 'RINGS 282,000 KM · 9.5 AU', ticket: { code: 'STN', ink: '#a3814a', on: '#2a1d08' }, flight: { dist: 8.5, arc: 1.1 },
      fact: '토성 고리는 지름이 수십만 km나 되지만, 두께는 대부분 1km도 되지 않아요.',
      stats: { km: '14억 3,200만 km', light: '1시간 20분', year: '29.5년', type: '가스 거인' },
    },
    uranus: {
      ko: '천왕성', en: 'Uranus', EN: 'URANUS', color: '#7fd8f0', accent: '#7fd8f0', tint: '#8fc6c4', scale: 0.85, ring: false,
      letter: { text: 'URANUS', main: 'font-family:Archivo,var(--display);font-stretch:62%;font-weight:700;font-size:min(190px,13vw);letter-spacing:.02em', poster: 'font-family:Archivo,var(--display);font-stretch:62%;font-weight:700;font-size:104px;letter-spacing:.02em' },
      meta: 'TILT 98° · 19.2 AU', ticket: { code: 'URN', ink: '#2f9cc0', on: '#04232e' }, flight: { dist: 18.2, arc: 1.0 },
      fact: '천왕성은 옆으로 누운 채 자전해요. 그래서 극지방은 42년 동안 낮, 42년 동안 밤이 이어져요.',
      stats: { km: '28억 6,700만 km', light: '2시간 39분', year: '84년', type: '얼음 거인' },
    },
    neptune: {
      ko: '해왕성', en: 'Neptune', EN: 'NEPTUNE', color: '#2f7cff', accent: '#2f7cff', tint: '#7b95c9', scale: 0.92, ring: false,
      letter: { text: 'NEPTUNE', main: 'font-family:Unbounded,var(--display);font-weight:600;font-size:min(80px,5.6vw);letter-spacing:-.01em', poster: 'font-family:Unbounded,var(--display);font-weight:600;font-size:42px;letter-spacing:-.01em' },
      meta: 'WIND 2,100 KM/H · 30 AU', ticket: { code: 'NPT', ink: '#2c5bd0', on: '#eef2ff' }, flight: { dist: 29.1, arc: 0.95 },
      fact: '해왕성에는 태양계에서 가장 빠른 바람이 불어요. 시속 2,000km를 넘기도 해요.',
      stats: { km: '45억 1,500만 km', light: '4시간 11분', year: '165년', type: '얼음 거인' },
    },
  };
  const ORDER = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

  /* categories: { key, planet, name }. Keys stay stable so to-dos and records keep pointing at the right one */
  const DEFAULT_CATS = [
    { key: 'code', planet: 'mars', name: '코딩' },
    { key: 'design', planet: 'venus', name: '디자인' },
    { key: 'read', planet: 'saturn', name: '독서' },
    { key: 'eng', planet: 'neptune', name: '영어' },
  ];
  function loadCats() {
    try {
      const c = JSON.parse(localStorage.getItem('cosmodoro.cats'));
      if (Array.isArray(c) && c.length && c.every(x => x && x.key && x.name && PLANETS[x.planet] && !PLANETS[x.planet].home)) return c;
    } catch {}
    return DEFAULT_CATS.map(c => ({ ...c }));
  }
  function saveCats(cats) { try { localStorage.setItem('cosmodoro.cats', JSON.stringify(cats)); } catch {} }
  /* minutes flown for a category, from the flight log */
  function minutesFor(key) {
    try { return JSON.parse(localStorage.getItem('cosmodoro.flights') || '[]').filter(f => f.topic === key).reduce((a, f) => a + (+f.min || 0), 0); } catch { return 0; }
  }

  /* planet icons: real cut-outs via masks, so they sit on any background; the soft night side comes from the shade */
  const m = (id, body) => `<mask id="pl-m-${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">${body}</mask>`;
  const disc = '<circle cx="12" cy="12" r="8" fill="url(#pl-shade)"/>';
  const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <radialGradient id="pl-shade" cx="35%" cy="32%" r="78%"><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#7a7a7a"/></radialGradient>
    ${m('mercury', `${disc}<g fill="none" stroke="#000"><circle cx="9" cy="9.2" r="1.9" stroke-width="1.2"/><circle cx="14.8" cy="13.6" r="2.5" stroke-width="1.2"/></g><circle cx="9.6" cy="15.8" r="1" fill="#000"/><circle cx="15.4" cy="7.6" r=".8" fill="#000"/>`)}
    ${m('venus', `${disc}<g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round"><path d="M4.6 9.2C7.8 7.2 10.4 10.8 13.6 9S18 7.6 19.6 8.8"/><path d="M4.2 13.2C7.6 11.4 9.9 15 13.2 13.2S17.6 11.8 19.8 13"/><path d="M6.6 16.8C9.2 15.6 11.2 17.8 13.8 16.8"/></g>`)}
    ${m('earth', `${disc}<g fill="#000"><path d="M6.6 9.6c1.6-1.9 4.2-1.5 4.8.2.5 1.4-.9 2.2-.4 3.6.4 1.2-.6 2.4-1.9 1.8C7.4 14.6 5.6 11.4 6.6 9.6Z"/><path d="M13.4 6.2c1.8-.4 3.9.8 4.3 2.4.3 1.3-.9 1.8-1.9 1.4-1.1-.4-1.6.6-2.7.2-1.3-.5-1.3-3.6.3-4Z"/><path d="M14.2 14.2c1.2-.6 2.9-.2 3.3 1-.3 1.6-1.8 2.9-3.3 2.7-.9-.6-1-2.9 0-3.7Z"/></g>`)}
    ${m('mars', `${disc}<g fill="none" stroke="#000" stroke-linecap="round"><path d="M8.4 5.8Q12 4.2 15.6 5.8" stroke-width="1.7"/><path d="M5.8 12.8Q9.2 10.4 12.2 12.4T18.4 11.2" stroke-width="1.6"/><circle cx="9.6" cy="16.4" r="1.4" stroke-width="1.2"/></g>`)}
    ${m('jupiter', `${disc}<g stroke="#000" stroke-linecap="round" fill="none"><path d="M5.4 8H18.6" stroke-width="1"/><path d="M4.2 11.2H19.8" stroke-width="1.3"/><path d="M5.6 17.4H18.4" stroke-width="1"/></g><ellipse cx="15" cy="14.2" rx="2.3" ry="1.35" fill="#000"/>`)}
    ${m('saturn', `<circle cx="12" cy="12.2" r="5.8" fill="url(#pl-shade)"/><path d="M6.6 10.8H17.4" stroke="#000" stroke-width="1"/><path d="M2.6 13.6C4.4 16.1 19.6 16.1 21.4 13.6" stroke="#000" stroke-width="3.4" fill="none"/>`)}
    ${m('uranus', `${disc}<path d="M9.6 4.6V19.4" stroke="#000" stroke-width="1" opacity=".7"/><ellipse cx="12" cy="12" rx="3" ry="10.6" transform="rotate(14 12 12)" fill="none" stroke="#000" stroke-width="2.8"/>`)}
    ${m('neptune', `${disc}<path d="M4.6 9.4H19.4" stroke="#000" stroke-width="1.1" stroke-linecap="round" opacity=".7"/><ellipse cx="9.8" cy="14.6" rx="2.4" ry="1.4" fill="#000"/><path d="M14 16.6H17" stroke="#000" stroke-width="1.3" stroke-linecap="round"/>`)}
  </defs>
    ${['mercury', 'venus', 'earth', 'mars', 'jupiter', 'neptune'].map(k => `<symbol id="pl-${k}" viewBox="0 0 24 24"><rect width="24" height="24" fill="currentColor" mask="url(#pl-m-${k})"/></symbol>`).join('')}
    <symbol id="pl-saturn" viewBox="0 0 24 24"><path d="M3.2 13.4C1.4 11.4 6.6 9.2 12 9.2S22.6 11.4 20.8 13.4" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".5"/><rect width="24" height="24" fill="currentColor" mask="url(#pl-m-saturn)"/><path d="M3.2 13.4C4.9 15.6 19.1 15.6 20.8 13.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></symbol>
    <symbol id="pl-uranus" viewBox="0 0 24 24"><rect width="24" height="24" fill="currentColor" mask="url(#pl-m-uranus)"/><ellipse cx="12" cy="12" rx="3" ry="10.6" transform="rotate(14 12 12)" fill="none" stroke="currentColor" stroke-width="1.1" opacity=".8"/></symbol>
  </svg>`;
  document.body.insertAdjacentHTML('afterbegin', SPRITE);
  const icon = (planet, color, cls = 'pi') => `<svg class="${cls}" style="color:${color}" aria-hidden="true"><use href="#pl-${planet}"/></svg>`;

  window.COSMO = { PLANETS, ORDER, DEFAULT_CATS, loadCats, saveCats, minutesFor, icon };
})();
