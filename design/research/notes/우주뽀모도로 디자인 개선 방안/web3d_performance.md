# Web 3D performance and graceful degradation for long-running Three.js scenes (Cosmodoro flight page)

Scope: Three.js r160 vanilla (no build step), about 9 procedural fbm planet ShaderMaterials (up to 6-octave simplex noise per pixel), EffectComposer + UnrealBloomPass + OutputPass, about 20k point sprites, instanced asteroids, a procedural ship, and a baked cube-map sky. The page stays open 25-90+ minutes on laptops and mid-range phones. Research date: Oct 2026.

Main finding: GPU fragment work scales roughly with **fps × (canvas px × DPR²) × per-pixel shader cost**. For an always-on ambient scene, the cheapest gains come from (1) capping fps (30 or less while the user is focused), (2) capping and adapting DPR, (3) baking the fbm planets into textures, and (4) running bloom at half resolution or less. Moving to WebGPU is not a performance win for this project right now.

---

## 1. Frame-rate capping, pausing and adaptive quality (rAF, Page Visibility, Battery, reduced motion, dynamic resolution)

### Takeaway
Three.js has no built-in fps cap, so you write a frame-skip inside `renderer.setAnimationLoop` and drive all motion from time deltas, not frame counts. Combine this with a DPR cap (at most 2, lower on phones), a vanilla port of drei's `PerformanceMonitor` hysteresis logic, and pausing on `visibilitychange`. Treat the Battery API and `prefers-reduced-motion` as optional hints, not requirements.

### Cited Findings
- Three.js has no built-in option to limit FPS with `setAnimationLoop`. You implement the cap yourself inside the loop. — [Needle forum: FPS limit](https://forum.needle.tools/t/fps-limit/1176)
- Forum guidance: when using the renderer's loop, use `renderer.setAnimationLoop` rather than manual `requestAnimationFrame`/`cancelAnimationFrame`. — [three.js forum: Cap game FPS to 60](https://discourse.threejs.org/t/cap-game-fps-to-60/69915)
- A forum user reported that an unplugged laptop limited the screen to 30 fps, so their animation ran at half speed. The fix was to drive animation from a time delta. — [three.js forum: 120hz screens animation too fast](https://discourse.threejs.org/t/120hz-screens-animation-too-fast-issue/39940)
- Clamp the delta so returning from a background tab does not cause a huge jump. Call `clock.getDelta()` only once per frame, because a second call returns about 0. — [WikiDocs: setAnimationLoop instead of rAF (Korean)](https://wikidocs.net/425936)
- Chrome Energy Saver mode works by "reducing the display refresh rate, affecting scrolling and animation fidelity and video frame rates". rAF follows the new rate. A loop that assumes 16.67 ms per frame "will run twice as slow". Users can set the mode to run when the device is unplugged. You can test it with the `#battery-saver-mode-available` flag and the toggle on `chrome://discards`. There is "no dedicated web API to measure display refresh rate". — [Chrome for Developers: Memory and Energy Saver modes](https://developer.chrome.com/blog/memory-and-energy-saver-mode)
- Chrome does not call `requestAnimationFrame()` for background tabs, and each background timer runs at most once per second. — [Chrome blog: Background tabs in Chrome 57](https://developer.chrome.com/blog/background_tabs)
- Utsubo's best-practice list recommends `setAnimationLoop()` plus the `Timer` class, which has been in core since **r179**. `Timer.connect(document)` pauses the timer when the tab is hidden, so you avoid a huge delta when the user comes back. R3F's `frameloop="demand"` skips idle frames to save battery. `PerformanceMonitor` with `flipflops={3}` adjusts DPR and falls back safely. — [Utsubo: Three.js best practices (100 tips)](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- Cap the pixel ratio with `Math.min(devicePixelRatio, 2)`. A 3x phone has 9x the pixels of 1x. — [Utsubo 100 tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- **drei PerformanceMonitor algorithm** (port this to vanilla JS):
  - It averages fps over `ms`-long windows (default 250 ms) and collects `iterations` of them (default 10).
  - If at least `threshold` (default 0.75) of the averages fall below the lower bound, `onDecline` fires. If they fall above the upper bound, `onIncline` fires.
  - The default `bounds` function is `r > 90 ? [50, 90] : [50, 60]`, where `r` is the observed refresh rate. FPS inside the bounds triggers nothing, which prevents ping-ponging.
  - `factor` (0-1, default 0.5) moves by `step` (default 0.1) on each change.
  - After `flipflops` reversals, `onFallback` fires and the monitor shuts down. Use that callback to lock a safe baseline.
  - The doc example maps factor to DPR with `dpr = 0.5 + 1.5 * factor`, so DPR ranges from 0.5 to 2.
  - Source: [drei docs: PerformanceMonitor](https://drei.docs.pmnd.rs/performances/performance-monitor)
- `navigator.getBattery()`:
  - MDN marks it "Limited availability", not Baseline.
  - Since Chrome 103 it works only in secure contexts (HTTPS).
  - It can be blocked by the `battery` Permissions-Policy directive (throws `NotAllowedError`).
  - `BatteryManager.charging` and the `chargingchange` event let you react to plugging and unplugging.
  - Source: [MDN: Navigator.getBattery()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery)

### Inferences
- **Recommended vanilla loop for r160.** In r160, `Timer` is an addon (`three/addons/misc/Timer.js`), not core. Using the rAF timestamp works with no imports:
  ```js
  let targetFps = 30;             // focus/idle default; 60 only during intro / interaction
  let last = 0, acc = 0;
  renderer.setAnimationLoop((t) => {          // t = DOMHighResTimeStamp
    const dt = Math.min((t - last) / 1000, 0.1); last = t;   // clamp after tab return
    acc += dt;
    const frame = 1 / targetFps;
    if (acc < frame * 0.95) return;           // skip: no update, no render
    const step = acc; acc = acc % frame;      // keep phase, avoid drift
    update(step);                             // all motion = speed * step
    composer.render(step);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) renderer.setAnimationLoop(null);   // also stops hidden-iframe/embedded cases
    else { last = performance.now(); renderer.setAnimationLoop(loop); }
  });
  ```
  The early `return` saves GPU and CPU work but not rAF wakeups. That is fine, because skipped callbacks are nearly free.
- **Calm tiers for a focus timer.** A slow-drifting space view loses little at 24-30 fps. Ambient motion such as drifting planets and twinkling stars may even look fine at 15-20 fps. Suggested tiers:
  - Intro and warp transitions: 60 fps.
  - Interaction (pointer move or drag in the last 2 s): 60 fps.
  - Focus-session steady state: 30 fps.
  - Calm or low-power mode: 15-20 fps, or a fully static frame (see section 6).
- **Approximate savings.** Fragment work goes from 60 fps at DPR 2 to 30 fps at DPR 1.25 by a factor of `0.5 × (1.25² / 2²) ≈ 0.20`, which is about **80% less fragment work**. This is first-order math, not a measurement. Vertex and CPU costs do not scale with DPR.
- **Porting PerformanceMonitor under a cap.** With the cap at 30, fps can never go above the cap, so drei's "incline when above upper bound" never fires. Use these bounds relative to the cap instead:
  - Decline when the average is below 0.85 × targetFps.
  - Incline only when frame time shows clear headroom: measure CPU time spent in `composer.render()` (rough), or use the `EXT_disjoint_timer_query_webgl2` GPU timer where available. Availability varies by browser and is not verified here.
  - Keep `flipflops` around 3, and lock a fallback DPR in `onFallback`.
- **DPR changes are costly.** `renderer.setPixelRatio()` reallocates the drawing buffer, and `composer.setPixelRatio()`/`setSize()` reallocate every render target. Change it only on hysteresis decisions, not every second, and use discrete steps (2 → 1.5 → 1.25 → 1 → 0.75).
- **When to pause.** Pause on `document.hidden`. Optionally drop to about 5-10 fps or a static frame on `window` `blur` when the user is working in another app. A timer on a second monitor is still visible, so keep it rendering at the calm rate rather than stopping.
- **Battery.** Use `getBattery()` only as progressive enhancement: on `!charging`, step down one tier. Even without it, delta-time animation keeps visuals correct when Chrome Energy Saver lowers the refresh rate.
- **`prefers-reduced-motion: reduce`** is a standard CSS media query, read in JS with `matchMedia('(prefers-reduced-motion: reduce)')`. When it matches:
  - Default to calm mode with no warp streaks, camera shake or fast parallax.
  - Or show a static frame.
  - Listen for `change` events.
  - Reference: [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion). This MDN page was not re-fetched in this session; it is standard and well documented.

### Gaps
- No source measured actual battery or thermal savings (watts or minutes) from fps capping in a Three.js page. The 80% figure is first-order arithmetic only.
- Not verified this session: the per-browser compatibility table for `getBattery()`. It is commonly understood to be Chromium-only (Firefox removed it, Safari never shipped it), but this was not fetched.
- Not verified: the cross-browser availability of `EXT_disjoint_timer_query_webgl2`.

---

## 2. Shader cost reduction: baking procedural planets, LOD, fewer octaves, noise textures, impostors

### Takeaway
Nine planets running 6-octave 3D simplex fbm for every pixel, every frame, is the single largest avoidable GPU cost. The planets are not physically changing, so bake the fbm albedo/height to a texture once at load (render-to-texture). At runtime, keep only cheap lighting, the terminator, and maybe a scrolling cloud layer or a 1-2 octave detail term. Use screen-size LOD so distant planets use fewer octaves or a sprite impostor.

### Cited Findings
- **Render-once approach (Bekk tutorial):**
  - The tutorial writes "a shader program that computes each texel in the texture" and renders it into a GPU render target with a separate orthographic camera and scene.
  - It generates the texture "only once at the initialization of the planet scene".
  - `readPixels` is only needed if the CPU must see the data.
  - The tutorial uses an older three.js API.
  - Source: [Bekk: Procedural Planet in WebGL and Three.js, Part 2](https://blogg.bekk.no/procedural-planet-in-webgl-and-three-js-part-2-33d99bbb2256)
- **Three Shader Baker** (community library) bakes a ShaderMaterial into textures "to use in other Three.js shaders/materials to save on performance". It accepts an optional target render target. Last push was about Oct 2024, so check maintenance. — [three.js forum: Threejs Shader Baker](https://discourse.threejs.org/t/threejs-shader-baker/71225)
- Forum caveat: baking cannot capture view-dependent effects such as reflections, which depend on the observer's position. Those must stay live. — [three.js forum: Threejs Shader Baker](https://discourse.threejs.org/t/threejs-shader-baker/71225)
- **General shader guidance:**
  - Baked lighting costs "essentially nothing at render time".
  - Mediump fragment shaders can be up to 2x faster on Adreno (per Qualcomm).
  - Prefer `mix()`/`step()` to branching for short per-pixel choices.
  - Use the built-in `LOD` object in vanilla Three.js.
  - Measure frame time before and after any change.
  - Source: [Utsubo 100 tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips)

### Inferences
- **Bake recipe in vanilla r160, no extra deps.** For each planet at load (or lazily, the first time it is near):
  1. Create a `WebGLRenderTarget(2048, 1024)` (equirect) or a `WebGLCubeRenderTarget(512-1024)`, with `generateMipmaps: true` and `minFilter: LinearMipmapLinearFilter`.
  2. Render a fullscreen quad with an orthographic camera. The quad's fragment shader converts UV to a sphere direction `(lon, lat) → vec3` and evaluates the existing `fbm(dir * scale, 6 octaves)` color ramp. Reuse the current GLSL noise code.
  3. Replace the planet's material with a cheap ShaderMaterial or `MeshStandardMaterial`/`MeshLambertMaterial` that samples `rt.texture`. Optionally also bake a height/normal map so the terminator lighting keeps relief.
  4. Keep the render target alive (do not dispose it while in use). Alternatively, copy it to a `CanvasTexture` or `DataTexture` via `readRenderTargetPixels` if you need it to survive context loss.
- **Equirect vs cubemap.** Cube faces avoid pole pinching and seam artifacts. For an fbm planet, sampling a cubemap with the 3D normal (`textureCube(map, normal)`) is simplest and avoids UV seams entirely.
- **Budget.** A 2048×1024 RGBA8 with mips is about 11 MB; 9 planets come to about 100 MB. That is too much for phones. Use 1024×512 (about 2.8 MB each) for most planets, 2048 only for the hero planet, and 512 cube faces on low tier. Quick check: 1024×512×4 bytes = 2 MiB, plus about 33% for mips ≈ 2.8 MB.
- **Bake timing.** Each bake is one draw call of N texels × 6 octaves, a few ms per planet on desktop GPUs (estimate, not measured). Spread bakes across frames during the launch or countdown animation, one planet per frame, to avoid a hitch. Bake planets the camera cannot see yet lazily.
- **Keep some motion alive cheaply:**
  - Rotate the planet mesh (free).
  - Add a separate cloud sphere that samples a small tiling noise texture with UV scroll, or a 2-octave live noise layer.
  - Animate atmosphere and fresnel rim analytically, which is cheap.
- **Screen-size LOD.** Each frame, or every 10th frame, compute the projected radius in pixels: `r_px = (radius / dist) * (canvasHeight / (2*tan(fov/2)))`. Then:
  - `r_px < 4`: render as a point or sprite, or hide it, since bloom alone can carry it.
  - `r_px < 64`: use a low-poly sphere (16×12 segments), the baked texture's lower mip, and no live detail octaves.
  - Hero planet: full detail.
  - Pass an `octaves` uniform with a `for` loop of constant max length, breaking on `i >= octaves`, so you avoid recompiling shaders.
- **Noise texture vs ALU noise.** If any noise must stay live (clouds, nebula), sampling a precomputed tiling 3D noise texture or 2D noise atlas is generally cheaper on mobile than evaluating simplex noise ALU per octave, at the cost of memory and some tiling. This is general GPU practice; no measured comparison was found (see Gaps).
- **Impostors.** Distant planets can use a pre-rendered sprite: a `Sprite` or quad with the baked lit disc. That costs about one texture fetch per pixel, and mipmaps keep it alias-free when small.
- **Precision.** `precision mediump float` in planet fragment shaders helps on Adreno and Mali, but simplex noise with large coordinates can band or glitch in mediump. Keep noise-coordinate math in highp, or bake it (baking removes the issue).

### Gaps
- No measured benchmark was found comparing 6-octave simplex fbm with a baked texture lookup in Three.js. The savings depend on how many screen pixels the planets cover. Profile with the Chrome DevTools Performance panel or a GPU timer query.
- No authoritative measured comparison of texture-noise and ALU-noise cost on mobile GPUs was found.

---

## 3. Post-processing cost: three EffectComposer vs pmndrs/postprocessing, half-res bloom, mipmap blur, selective bloom

### Takeaway
`UnrealBloomPass` already works at half resolution internally and blurs a 5-level mip chain. Its cost knob is the `resolution` you pass to its constructor and the canvas DPR. pmndrs/postprocessing merges effects into one `EffectPass` and uses a fullscreen triangle, which saves passes when you have several effects. With only bloom + output, the gain is modest. The bigger lever is rendering bloom at 0.5x or lower and skipping it entirely on low tiers.

### Cited Findings
- Three.js `UnrealBloomPass` "creates a mip map chain of bloom textures and blurs them with different radii". The weighted combination and the larger blurs done on higher mips are why it "provides good quality and performance". — [three.js docs: UnrealBloomPass](https://threejs.org/docs/pages/UnrealBloomPass.html)
- `UnrealBloomPass` source sets `this.nMips = 5` and creates the bright-pass target at `Math.round(resolution.x / 2)` × `Math.round(resolution.y / 2)`. Each mip is half the previous one. — [UnrealBloomPass.js source copy](https://uploads-ssl.webflow.com/62ac7f8b653eb2f658c0da71/631854f92aebc35035a08203_UnrealBloomPass.js.txt) (third-party mirror of the three.js file; the canonical file is `examples/jsm/postprocessing/UnrealBloomPass.js` in the three.js repo)
- A forum user reported that the official bloom example barely exceeded 20 fps on an Intel i7 MacBook Pro 2020 in Safari at full width. It reached about 60 fps only when shrunk to about 400 px wide, and ran at a stable 60 fps on an M1 MacBook Air. Bloom cost is fill-rate bound and highly GPU-dependent. — [three.js forum: UnrealBloomPass poor performance on macOS Safari with Intel](https://discourse.threejs.org/t/unrealbloompass-poor-performance-on-macos-safari-with-intel/42606)
- pmndrs `postprocessing`:
  - Its `EffectPass` "automatically organizes and merges any given combination of effects", which minimizes render operations versus chaining passes.
  - Fullscreen passes use a single oversized triangle that "eliminates unnecessary fragment calculations along the screen diagonal".
  - Recommended renderer settings: `powerPreference: "high-performance", antialias: false, stencil: false, depth: false`.
  - `frameBufferType: HalfFloatType` is "the preferred option for HDR-like workflows on desktop devices".
  - Install is via npm (`npm install three postprocessing`), with `three` as a peer dependency.
  - Source: [postprocessing README (v6.39.1)](https://cdn.jsdelivr.net/npm/postprocessing@6.39.1/README.md)
- Half-resolution post-processing "can roughly double frame rate in fill-rate-bound scenes". — [Utsubo 100 tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips)

### Inferences
- **Quick wins with the existing three.js composer (no library change):**
  - Construct bloom with a reduced resolution, `new UnrealBloomPass(new Vector2(w*0.5, h*0.5), strength, radius, threshold)`. Its internal /2 then makes the bright pass about 1/4 of the canvas per axis.
  - On resize, call `bloom.setSize()` with the scaled size rather than the full size. Note that `EffectComposer.setSize` passes full size × pixelRatio to each pass, so you may need to override it, or pass a fixed small resolution after the composer resize.
  - Raise `threshold` so fewer pixels contribute.
  - Disable bloom (`bloomPass.enabled = false`) on tier 0-1 and in calm mode. Replace it with a cheap fake glow: additive sprites behind the sun and planets, or a pre-blurred glow texture.
- **Merging passes.** OutputPass does tone mapping and sRGB conversion as a separate fullscreen pass. With pmndrs, bloom, tone mapping, vignette and similar effects merge into one EffectPass, saving about 1-2 full-screen read/writes per frame. Useful, but secondary to resolution and fps.
- **Using pmndrs/postprocessing without a build step.** It needs an import map: `"postprocessing": "https://cdn.jsdelivr.net/npm/postprocessing@6.x/build/index.js"` (exact path not verified), with `three` mapped to the same version the app uses. Check the package's `peerDependencies` range against r160 before switching (see Gaps).
- **pmndrs `BloomEffect` mipmapBlur.** It has a `mipmapBlur` option (a downsample/upsample chain similar to UE4 / CoD "next-gen post" bloom) plus `luminanceThreshold`/`luminanceSmoothing`, and supports `resolutionScale`/resolution settings. This is from prior knowledge of the library; not re-verified this session.
- **Selective bloom.** The classic three.js approach (layers plus two composers, darkening non-bloom objects) doubles scene renders and is expensive. For this scene, threshold-based bloom with emissive-only bright colors on the sun, engine and stars is cheaper. Alternatively, write the bloom mask into alpha or MRT in a single scene render.
- **Antialiasing.** With a composer, `antialias: true` on the renderer does not apply to composer render targets unless MSAA samples are set. Most of this scene is soft and procedural, so skipping MSAA, or using `samples: 2` only on high tier, saves bandwidth.

### Gaps
- Not verified: postprocessing's current `peerDependencies` range for three (whether r160 is supported by the latest 6.x) and whether a v7 with WebGPU support has shipped. The README fetched did not state either.
- No source quantified UnrealBloomPass ms cost against pmndrs BloomEffect (mipmapBlur) on the same scene.

---

## 4. Memory/GPU leaks in long sessions, texture compression (KTX2/Basis), instancing, draw calls, Points vs instanced quads

### Takeaway
A 90-minute session is safe as long as nothing is created per frame or per Pomodoro cycle without `dispose()`. Watch `renderer.info.memory` across cycles: a monotonic climb means a leak. Draw calls are already low thanks to instancing and Points. Keep under about 100 calls for mobile. KTX2 helps only if you load large image textures. Baked render targets are already in GPU memory, so their cost is sized by resolution.

### Cited Findings
- **Memory:**
  - A 4096² RGBA texture uses 64 MiB of VRAM, about 85 MiB with mipmaps.
  - Dispose geometries, materials, textures and render targets when done, and call `texture.source.data.close?.()` for ImageBitmap textures.
  - Watch `renderer.info.memory`: counts that keep climbing indicate a leak.
  - Source: [Utsubo 100 tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- **Draw calls:**
  - Aim for about 100 draw calls per frame on mobile; desktops handle several hundred to low thousands.
  - Check with `renderer.info.render.calls`.
  - InstancedMesh turns 1,000 objects into 1 call.
  - `BatchedMesh` (r156+) merges different geometries sharing a material.
  - `mergeGeometries` handles static parts, and `matrixAutoUpdate = false` helps on static objects.
  - Source: [Utsubo 100 tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- **KTX2:** keeps textures compressed in GPU memory, typically 4-8x less VRAM than decoded PNG/JPEG. Keep textures at 2048 or below unless hero assets, keep mipmaps on, and raise `anisotropy` rather than resolution. — [Utsubo 100 tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- **Transparency:** use alpha test for cutouts, and turn `transparent` off when opacity is 1. — [Utsubo 100 tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- The three.js manual has a dedicated page, "How to dispose of objects" ([three.js manual](https://threejs.org/manual/#en/how-to-dispose-of-objects)). It could not be fetched this session (404 on the tested URL forms), so its exact wording is not quoted here.

### Inferences
- **Likely leak sources in a Pomodoro app:**
  1. Re-creating the scene, composer or render targets when a session restarts or the user navigates to and from the flight page in an SPA. On leaving, call `composer.dispose()`, each pass's `.dispose()`, `renderer.dispose()`, and `renderTarget.dispose()` for baked planets.
  2. Allocating `new Vector3()`/`new Color()` per frame in `update()`. This is not a GPU leak, but it causes GC churn and periodic hitches. Hoist temporaries.
  3. Creating new materials or geometries for warp effects or HUD text each cycle.
  4. `CanvasTexture`s updated every second for the timer display. Prefer DOM or CSS for the timer text over a texture, which is cheaper and sharper.
- **Logging check.** Every N minutes in dev, log `renderer.info.memory.{geometries,textures}` and `renderer.info.programs.length`. All three should be flat after the first minute.
- **WebGL context loss.** Mobile browsers and OS memory pressure can drop the context during long sessions. Listen for `webglcontextlost`/`webglcontextrestored` on the canvas, re-bake planet render targets on restore, and show the static fallback in between. Render-target contents are lost on context loss, so the bake routine must be re-runnable.
- **20k Points.** That is one draw call, so it is cheap in calls. The real cost is overdraw: large `size` with additive blending and `transparent: true` across many overlapping sprites.
  - Keep sprite size small, use `depthWrite: false`, and avoid huge `sizeAttenuation` sizes near the camera.
  - Use a cheap fragment shader (analytic disc via `gl_PointCoord`, not texture plus discard where possible).
  - Points are limited by the max `gl_PointSize`, which is implementation-defined. Instanced quads avoid that limit and allow rotation and stretching (good for warp streaks), at the cost of 4-6 vertices per star.
  - For static background stars, the baked cubemap sky can absorb most of the 20k. Keep only about 2-5k near-field parallax stars as Points.
- **Static objects.** Set `matrixAutoUpdate = false` (and `matrixWorldAutoUpdate` where applicable) on the sky, distant planets and asteroid parents. Update instanced asteroid matrices only for visible or near asteroids, or rotate the whole InstancedMesh group instead of per-instance matrices.
- **KTX2 relevance.** The current assets are procedural, so KTX2 matters only for any image textures (ship decals, a pre-baked hero planet if shipped as a file instead of baked at runtime). `KTX2Loader` needs the Basis transcoder (`basis_transcoder.js/.wasm` from `three/examples/jsm/libs/basis/`), which works without a bundler via an import map plus `setTranscoderPath`. Shipping pre-baked planet textures as KTX2 (UASTC/ETC1S) would remove the runtime bake cost and cut VRAM 4-8x, a good option for the mobile tier.

### Gaps
- The exact text of the three.js "How to dispose of objects" manual page was not retrieved.
- No source with measured overdraw cost of 20k additive Points versus instanced quads.

---

## 5. WebGPU in Three.js (WebGPURenderer, TSL) in 2025-2026: worth migrating?

### Takeaway
WebGPU now ships in all major browsers: Chrome/Edge 113+, Safari 26, and Firefox 141 on Windows. Three.js `WebGPURenderer` (`three/webgpu`, r171+) falls back to WebGL2 automatically. But Cosmodoro's nine custom GLSL `ShaderMaterial`s and the `EffectComposer` stack would all need rewriting in TSL and the node-based post-processing, and multiple 2025-2026 reports show WebGPURenderer is often *slower* than WebGLRenderer, especially on CPU and first frame. **Recommendation: do not migrate now. Stay on WebGLRenderer, optionally upgrading to a recent r17x-r18x for fixes and `Timer` in core.**

### Cited Findings
- **Browser support:** web.dev (Nov 25, 2025) says WebGPU is now supported in Chrome, Edge, Firefox and Safari.
  - Chrome/Edge: desktop since 113 (Windows D3D12, macOS, ChromeOS); Android since Chrome 121, Android 12+ with Qualcomm/ARM GPUs only.
  - Firefox: Windows since 141; macOS Tahoe 26 on ARM64 since 145; Linux, Android and Intel Macs still in progress.
  - Safari: 26 on macOS Tahoe 26, iOS 26, iPadOS 26 and visionOS 26.
  - Linux in Chromium is "in progress".
  - Source: [web.dev: WebGPU is now supported in major browsers](https://web.dev/blog/webgpu-supported-major-browsers)
- **Import and init:** WebGPURenderer uses separate build files. Import from `'three/webgpu'` (and `'three/tsl'`) via an import map. It initializes asynchronously, and `setAnimationLoop()` is recommended so the renderer is ready before the first frame. — [three.js manual: WebGPURenderer](https://threejs.org/manual/en/webgpurenderer)
- **"Production-ready" claim:** The claim that WebGPURenderer has been "production-ready since r171" with "zero-config imports" and automatic WebGL 2 fallback comes from third-party guides. Utsubo cites about 87% global WebGPU support and says Safari 26 shipped it in Sept 2025. — [Utsubo 100 tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips); [Utsubo: WebGPU migration guide](https://www.utsubo.com/blog/webgpu-threejs-migration-guide). I found no official three.js statement that the renderer has left "experimental" status.
- **Porting effort:** scenes using only built-in features often port by switching the renderer. GLSL shaders are not compatible and must be ported to TSL, and particles and lines need case-by-case fixes. As of r176 (May 2025), WebGLRenderer was sometimes faster, about 4x faster for many separate meshes. — [ICS MEDIA: Getting started with Three.js on WebGPU](https://ics.media/en/entry/250501/)
- **r183 forum benchmark** (CAD/BIM, 4,000 meshes):
  - CPU render time: WebGLRenderer 4.5 ms, WebGPURenderer (WebGPU backend) 9.7 ms, `forceWebGL` 10.3 ms.
  - Cold first frame: 32 ms with WebGL vs 167 ms with WebGPU.
  - Source: [three.js forum: WebGPURenderer 2x slower CPU and 5-10x slower first frame (r183)](https://discourse.threejs.org/t/webgpurenderer-2x-slower-cpu-and-5-10x-slower-first-frame-than-webglrenderer-on-many-mesh-scenes-r183-same-on-both-backends/91904)
- Another thread reports 2-4x more FPS with WebGL than WebGPU, with `forceWebGL` 5-10x worse than plain WebGLRenderer. A reply points to a distinct WebGPURenderer issue with many draw calls; the workaround is instancing/batching. — [three.js forum: Why WebGPURenderer performance significantly lower than WebGLRenderer?](https://discourse.threejs.org/t/why-webgpurenderer-performance-significantly-lower-than-webglrenderer/77629); [three.js forum: WebGPU performance issue](https://discourse.threejs.org/t/webgpu-performance-issue/87939)
- Don't assume a speedup; profile first. `renderer.compileAsync(scene, camera)` avoids shader-compile hitches and reportedly no longer blocks rendering since r184. — [Utsubo 100 tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips)

### Inferences
- Cosmodoro's bottleneck is GPU fragment work (fbm × pixels × fps, plus bloom), not draw calls or CPU. WebGPU's main wins, lower driver overhead and compute shaders, don't target that bottleneck. Baking plus fps/DPR caps will save far more than a renderer switch.
- **Migration cost:** port 9 GLSL planet shaders, the point-sprite shader and the ship shaders to TSL, and replace `EffectComposer`/`UnrealBloomPass`/`OutputPass` with the TSL `PostProcessing` + `bloom()` node. Mobile WebGPU coverage is also uneven (Firefox Android and Linux missing; Chrome Android limited to Qualcomm/ARM on Android 12+), so the WebGL2 fallback path must stay solid regardless.
- **Revisit when** three.js closes the WebGPURenderer CPU and first-frame gap, or if you want GPU compute (for example, compute-shader particles, or baking planets with compute).
- **Upgrade note.** A three.js upgrade from r160 to a recent release (r179+ for core `Timer`) is optional but low-risk for WebGLRenderer users. Check the migration guide for renamed APIs, such as color management and lighting changes made before r160, which already apply. It does not require a bundler; import maps keep working.

### Gaps
- No official three.js statement on WebGPURenderer "stable" status was found. The "production-ready since r171" claim comes from third-party blogs.
- No benchmark specific to fragment-heavy (fill-bound) scenes comparing WebGL and WebGPU in three.js; the published comparisons are draw-call/CPU-bound.

---

## 6. Detecting low-end devices, a calm/low-power mode, and measuring

### Takeaway
Use `@pmndrs/detect-gpu` (tier 0-3 from benchmark fps) for **initial** defaults, then let runtime monitoring (section 1) correct them. Offer an explicit user-facing "Calm / Low power" toggle (15-20 fps, DPR 1, no bloom, baked planets only) and a "Static" option (one rendered frame or a pre-rendered image/video poster) for tier 0, reduced-motion users, or battery. Measure with `renderer.info`, stats.js, and Chrome DevTools.

### Cited Findings
- **detect-gpu (`@pmndrs/detect-gpu`):**
  - `getGPUTier()` returns `{ tier: 0-3, isMobile, type, fps?, gpu }`.
  - Tier 0 means no WebGL, a blocklisted GPU, or under 15 fps; tier 1 is 15+ fps, tier 2 is 30+, tier 3 is 60+. Thresholds `[0, 15, 30, 60]` can be overridden for mobile and desktop.
  - `type` is one of `BENCHMARK`, `FALLBACK`, `BENCHMARK_FETCH_FAILED`, `BLOCKLISTED`, `WEBGL_UNSUPPORTED` or `SSR`.
  - Benchmark data loads from UNPKG by default, or can be self-hosted via `benchmarksURL` (for offline use or strict CSP).
  - The package is ESM-only.
  - Its data source, gfxbench.com, "stopped updating in December 2025", so new GPUs may be missing or stale (issue #132).
  - Tier 0 should trigger a non-WebGL fallback.
  - Source: [GitHub: pmndrs/detect-gpu](https://github.com/pmndrs/detect-gpu)
- **Measuring with `renderer.info`:** check `renderer.info.render.calls` (`drawCalls` on WebGPURenderer) and `renderer.info.memory` for leaks. Common mobile guidance is to detect tier at startup and downscale or disable post-processing. — [Utsubo 100 tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- **No refresh-rate API:** Chrome says there is "no dedicated web API to measure display refresh rate". Approximate it from successive rAF timestamps, but don't poll constantly. — [Chrome for Developers: Memory and Energy Saver modes](https://developer.chrome.com/blog/memory-and-energy-saver-mode)
- drei's `PerformanceMonitor` infers refresh rate from the highest observed fps (`refreshrate`) and uses `onFallback` after repeated flip-flops to lock a baseline. — [drei docs: PerformanceMonitor](https://drei.docs.pmnd.rs/performances/performance-monitor)

### Inferences
- **Suggested startup flow:**
  1. `prefers-reduced-motion: reduce` sets Calm mode, with Static offered.
  2. Run `getGPUTier()` with self-hosted benchmarks, under a 1-2 s timeout that falls back to tier 2.
  3. Set defaults from the tier:

     | Tier | DPR | fps cap | Bloom | Planets | Stars |
     |---|---|---|---|---|---|
     | 3 | min(dpr, 2) | 60 intro / 30 focus | half res | baked + 1-2 live octaves on hero | 20k |
     | 2 | min(dpr, 1.5) | 30 | 0.5x | baked only | 10k |
     | 1 | 1 | 24-30 | off (fake sprite glow) | baked 512-1024 | 5k |
     | 0 | n/a | n/a | n/a | n/a | n/a |

     Tier 0 gets a static image or CSS/2D fallback: a pre-rendered PNG/AVIF of the flight scene with a slow CSS `transform` drift, which costs almost nothing.
  4. Run the runtime monitor (section 1) to adjust DPR within the tier's range.
  5. A persistent user setting (localStorage) overrides everything.
- **"Calm mode" content:** a single render or a 15 fps render with DPR 1, no bloom, star twinkle disabled, and camera motion slowed. Alternatively, render one frame to the canvas and stop the loop entirely, resuming on interaction. That is render-on-demand: re-render only when the timer state changes or the user moves the pointer. For a focus timer this is the most battery-friendly mode, because GPU use drops to near zero between renders.
- **Measuring toolkit:**
  - **stats.js:** FPS/ms panel. For a frame-capped loop, also log your own "rendered frames per second" counter.
  - **`renderer.info`:** `render.calls`, `render.triangles`, `render.points`, `memory.geometries/textures`, `programs.length`. Set `renderer.info.autoReset = false` and call `renderer.info.reset()` per frame when using a composer with multiple renders.
  - **Chrome DevTools Performance panel:** GPU track and frame timeline. Also `chrome://gpu` for driver and feature status.
  - **OS-level:** Windows Task Manager GPU % and the power-usage column; macOS Activity Monitor Energy Impact. These are the most honest "fans and battery" metrics for A/B testing caps.
  - **Long-session soak test:** leave the page open 90 minutes with periodic `renderer.info.memory` logging and confirm flat memory and steady fps (thermal throttling shows as fps decay after 10-20 minutes on phones).
- **detect-gpu without a build step:** it is ESM, so it can load via an import map from jsdelivr or unpkg. Self-host the benchmark JSON to avoid a runtime third-party CDN dependency. Because its data is stale since Dec 2025, treat unknown GPUs (fallback type) as tier 2 and rely on runtime monitoring.

### Gaps
- No public dataset quantifying energy use (W) of WebGL pages at different fps and DPR settings was found; A/B with OS power meters on target hardware.
- Not verified: detect-gpu's current bundle size and latest version number (the README shows only a badge).
