// Render Cosmodoro draft pages headlessly and save screenshots of given states.
// usage (from design/tools): node shoot.js <shots.json> <outDir>   — see README.md
// shots.json: [{ name, url, w, h, setup, frames, hideUI }]
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = process.env.ROOT || path.resolve(__dirname, '../..');
const NM = path.join(__dirname, 'node_modules');
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.mjs': 'application/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ktx2': 'image/ktx2', '.wasm': 'application/wasm', '.bin': 'application/octet-stream',
};

function serve(port) {
  return new Promise(res => {
    const s = http.createServer((req, rsp) => {
      const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const f = path.join(ROOT, p);
      if (!f.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
      fs.stat(f, (e, st) => {
        if (e || !st.isFile()) { rsp.writeHead(404); return rsp.end('not found'); }
        rsp.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' });
        fs.createReadStream(f).pipe(rsp);
      });
    });
    s.listen(port, () => res(s));
  });
}

function fileOr404(route, f, type) {
  if (fs.existsSync(f) && fs.statSync(f).isFile()) return route.fulfill({ path: f, contentType: type || MIME[path.extname(f).toLowerCase()] });
  console.warn('missing', f);
  return route.fulfill({ status: 404, body: '' });
}

async function routes(ctx) {
  // three.js from the CDN -> local npm copy
  await ctx.route(/cdn\.jsdelivr\.net\/npm\/three@0\.167\.0\//, route => {
    const rest = route.request().url().split('three@0.167.0/')[1].split('?')[0];
    return fileOr404(route, path.join(NM, 'three', rest), 'application/javascript');
  });
  // Pretendard css + fonts
  await ctx.route(/cdn\.jsdelivr\.net\/gh\/orioncactus\/pretendard@v1\.3\.9\//, route => {
    const rest = route.request().url().split('pretendard@v1.3.9/')[1].split('?')[0];
    const f = path.join(NM, 'pretendard', rest);
    return fileOr404(route, fs.existsSync(f) ? f : f.replace('.min.css', '.css'));
  });
  // iconify web component + icon API
  await ctx.route(/code\.iconify\.design\/iconify-icon\/2\.1\.0\/iconify-icon\.min\.js/, route =>
    fileOr404(route, path.join(NM, 'iconify-icon', 'dist', 'iconify-icon.min.js'), 'application/javascript'));
  const sets = {};
  await ctx.route(/api\.(iconify\.design|simplesvg\.com|unisvg\.com)\//, route => {
    const u = new URL(route.request().url());
    const prefix = u.pathname.replace(/^\//, '').replace(/\.json$/, '');
    const names = (u.searchParams.get('icons') || '').split(',').filter(Boolean);
    try {
      sets[prefix] = sets[prefix] || JSON.parse(fs.readFileSync(path.join(NM, '@iconify-json', prefix, 'icons.json'), 'utf8'));
      const S = sets[prefix], icons = {}, notFound = [];
      names.forEach(n => { if (S.icons[n]) icons[n] = S.icons[n]; else if (S.aliases && S.aliases[n]) icons[n] = S.icons[S.aliases[n].parent]; else notFound.push(n); });
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ prefix, icons, width: S.width || 24, height: S.height || 24, not_found: notFound }) });
    } catch (e) { return route.fulfill({ status: 404, body: '' }); }
  });
}

(async () => {
  const shots = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const out = process.argv[3];
  fs.mkdirSync(out, { recursive: true });
  const server = await serve(5521);
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const s of shots) {
    const t0 = Date.now();
    const ctx = await browser.newContext({ viewport: { width: s.w || 1440, height: s.h || 900 }, deviceScaleFactor: 1 });
    await routes(ctx);
    await ctx.addInitScript(() => { try { localStorage.setItem('cosmodoro.sound', '0'); } catch (e) {} });
    const page = await ctx.newPage();
    const logs = [];
    page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') logs.push(`${m.type()}: ${m.text()}`); });
    page.on('pageerror', e => logs.push('pageerror: ' + e.message));
    await page.goto('http://localhost:5521/' + s.url, { waitUntil: 'load', timeout: 180000 });
    await page.waitForFunction(() => window.cosmodoro && window.cosmodoro.ready !== false, null, { timeout: 180000 });
    if (s.hideUI) await page.addStyleTag({ content: '.ui,.labels,.countdown,.toast,.arrival{visibility:hidden!important}' });
    if (s.setup) await page.evaluate(s.setup);
    const frames = s.frames || 30;
    await page.evaluate(n => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), frames);
    if (s.after) await page.evaluate(s.after);
    await page.evaluate(() => { document.getAnimations().forEach(a => { try { a.finish(); } catch (e) {} }); });
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.screenshot({ path: path.join(out, s.name + '.png') });
    const info = await page.evaluate(() => { const c = window.cosmodoro; return c && c.F ? { p: +(c.F.elapsed / c.F.total).toFixed(3), clock: +c.F.clock.toFixed(1), m: +c.F.m.toFixed(2), expo: c.EXPO ? { vis: +c.EXPO.vis.toFixed(3), e: +c.EXPO.e.toFixed(3), lit: +c.EXPO.lit.toFixed(4) } : null } : null; });
    console.log(`${s.name}: ${((Date.now() - t0) / 1000).toFixed(1)}s`, JSON.stringify(info), logs.slice(0, 6).join(' | '));
    await ctx.close();
  }
  await browser.close();
  server.close();
})();
