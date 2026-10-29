# three.js r167 techniques for a photographic space-flight scene: catalog stars, Milky Way alignment, exposure, textured planets, rings, vast scale, ship lighting, KTX2, iGPU cost

> **Scope and method (researched 2026-10-29).** This adds to `design/research/notes/우주뽀모도로 디자인 개선 방안/web3d_space_rendering.md` and `web3d_performance.md` (r160 era). It does not repeat what those cover: the atmosphere survey (takram, Heckel, O'Neil, Hillaire), Solar System Scope and Poly Haven licensing, the pmndrs effect list, fps capping, baking procedural planets, detect-gpu, or WebGPU.
>
> - **"three r167 source" facts** come from the npm packages `three@0.167.1`, `postprocessing@6.38.3` and (for one check) `three@0.168.0/0.169.0`. I downloaded them from registry.npmjs.org and read the files. Links point to the same files on jsDelivr, the CDN the app imports from.
> - **Stellarium, Stellarium Web Engine, Celestia, ERFA, the three.js r168 Earth example, takram and wwwtyro** were read from raw GitHub files.
> - **Network policy blocked direct fetches** of threejs.org, discourse.threejs.org, cdn.jsdelivr.net, svs.gsfc.nasa.gov, eso.org, gaia.ari.uni-heidelberg.de, www.uni-weimar.de, www.vendian.org, tonisagrista.com, developer.nvidia.com, shadertoy.com and bjj.mmedia.is. Facts from those pages come from web-search result summaries and are marked **(search summary)**. They were not read in full.
> - **"Inferences"** are my implementation sketches and arithmetic. None were benchmarked. The GLSL targets an r167 `ShaderMaterial` on WebGL2. three injects GLSL ES 3.0 compatibility defines, so `attribute`, `varying` and `gl_FragColor` work.

## 1. Real star catalog rendering: magnitude to flux, point size and intensity, B-V color, PSF/glare, bloom and tone mapping

### Takeaway
Treat each star as a flux F ∝ 10^(−0.4·m). Splat it as a Gaussian at its sub-pixel position, with the Gaussian's integral equal to F × exposure. Keep σ ≥ ~0.65 px so the footprint never falls below ~1.5 px FWHM. Fade faint stars by lowering brightness, not size. Let only the brightest stars exceed 1.0 so bloom draws their glow, and give the very brightest a separate glare sprite. Stellarium, Stellarium Web Engine and Celestia publish tested curves: minimum radius 1.2 px, 0.6-1.0 px and 2 px respectively, FOV-dependent limiting magnitude, and log-space adaptation. For color, convert B−V to temperature with the Ballesteros formula, then look up a Planck×CMF table normalized to unit luminance. **Critical r167 gotcha:** the Neutral tone mapping the scene uses has a quadratic toe below linear 0.08. It wipes out ~2.7 magnitudes of faint stars unless you compensate.

### Cited Findings
**Stellarium desktop (`StelSkyDrawer.cpp`, GPL-2.0+)** — [source](https://github.com/Stellarium/stellarium/blob/master/src/core/StelSkyDrawer.cpp)
- Magnitude to log-luminance: `pointSourceMagToLnLuminance(mag) = -0.92103*(mag + 12.12331) + lnfovFactor`. The constant 0.92103 equals 0.4·ln10.
- The limit depends on FOV. Each frame computes `powFactor = pow(60/max(0.7,fov), 0.8)` and `lnfovFactor = log(1/50*2025000*60*60/(fov*fov)/(EYE_RESOLUTION^2)/powFactor/1.4)`, with `EYE_RESOLUTION 0.25`. It also sets `starLinearScale = pow(35*2*starAbsoluteScaleF, 1.40*0.5*starRelativeScale)`, default 19.569.
- `computeRCMag`: radius = eye-adapted scaled luminance × `starLinearScale`.
  - radius < 0.3 → not drawn.
  - 0.3 ≤ radius < 1.2 → luminance = r³/1.728 and the radius is pinned at 1.2 px. The comment reads: "if size of star is too small (blink) we put its size to 1.2 --> no more blink".
  - luminance < 0.05 → not drawn.
  - Above `MAX_LINEAR_RADIUS 8` → `r = 8 + sqrt(1 + r − 8) − 1`, which compresses large radii.
  - The result is multiplied by the screen scale.
- Halos are textures, not an analytic PSF: `star16x16.png`, plus a big halo `haloLune.png` when radius > (8+5)·scale. The big halo has alpha `min(1, lum, (r − threshold)/30/scale)` and size 150 px·scale.
- The limiting magnitude is found by bisection on `computeRCMag` over −26…30 with tolerance 0.05.

**Stellarium Web Engine (`src/core.c`, AGPL-3.0)** — [source](https://github.com/Stellarium/stellarium-web-engine/blob/master/src/core.c)
- `core_mag_to_illuminance`: `E = 10.7646e4 / ERFA_DR2AS² · 10^(−0.4·vmag)` lux.
- `core_illuminance_to_lum_apparent` treats unresolved stars as having a 2.5′ radius, "roughly corresponding to human eye Point Spread Function".
- `core_get_point_for_mag`: radius = `s_linear · pow(ld, s_relative/2)`, where ld is the tone-mapped luminance.
  - Skipped below 0.25 px.
  - Minimum radius 0.6 px, raised to 1.0 px when `min_point_radius * win_pixels_scale < 1` ("Fix aliasing on low res screen").
  - Below the minimum radius, luminance is multiplied by `((r − r_skip)/(r_min − r_skip))²`.
  - Gamma `ld^(1/2.2)`. Maximum radius 50 px.
  - Defaults: `star_linear_scale 0.8`, `star_relative_scale 1.1`, `star_scale_screen_factor = clamp(min(w,h)/600, 0.7, 1.5)`.

**Celestia (GPL-2.0)** — [render.cpp](https://github.com/CelestiaProject/Celestia/blob/master/src/celengine/render.cpp), [pointstarrenderer.cpp](https://github.com/CelestiaProject/Celestia/blob/master/src/celengine/pointstarrenderer.cpp)
- `calculatePointSize`: `alpha = max(0, (faintestMag − appMag)·brightnessScale + brightnessBias)`. Saturated stars (alpha > 1) grow instead:
  - ScaledDisc style: `discScale = min(MaxScaledDiscStarSize, exp2(0.3·(satPoint − appMag)))`, `glareAlpha = min(0.5, discScale/4)`, `glareSize = 3·discSize`.
  - Other styles: `discScale = min(100, satPoint − appMag + 2)`, `glareAlpha = min(GlareOpacity, (discScale − 2)/4)`, `glareSize = 2·discScale·size`.
- `brightnessScale = 1/(faintestMag − saturationMag)`, or 0.1667 if the range is under 6. `satPoint = faintestMag − (1 − brightnessBias)/brightnessScale`.
- AutoMag makes the limit FOV-dependent: `faintestMag = faintestAutoMag45deg·sqrt(fieldCorr)` and `saturationMag = saturationMagNight·(1 + fieldCorr²)`.
- PSF style:
  - `irradiance = magToIrradiance(appMag)`, `peakRad = peakRadScale·irradiance`.
  - Stars at or below `dimGate` are culled, with a soft clip `sqrt(peak² − dimGate²)`.
  - A glow is drawn only when peak > 1 (smoothstep onset). The glow peak is soft-clipped as `(1 − 1/(p/max + 1))·max`.
  - Points fade over at least 2 px (`psfPointFade`). The base size is scaled by DPI/96.

**Gaia Sky (search summary; docs host blocked)**
- It computes a per-star "pseudo-size" from magnitude. The shader derives a solid angle from that size and the camera distance.
- It renders billboards rather than plain points.
- A "magnitude multiplier" exponent sets the contrast between bright and faint stars.
- Version 3.5.0 added rendering stars at a fixed angular size.
- Sources: [Star rendering, docs 3.7.3](https://gaia.ari.uni-heidelberg.de/gaiasky/docs/3.7.3/Star-rendering.html); [Visual settings](https://gaia.ari.uni-heidelberg.de/gaiasky/docs/master/quickstart/Qs-visual-settings.html); [3.5.0 release notes](https://gaia.ari.uni-heidelberg.de/gaiasky/releases/3.5.0.5b427a04f/releasenotes.html)

**"Smaller than Pixels: Rendering Millions of Stars in Real-Time" (Schneegans, Kreskowski, Gerndt; Eurographics 2025 short paper, CC BY 4.0; search summary)**
- Pixels at the screen edge cover a smaller part of the field of view, so single-pixel stars there must be drawn proportionally brighter.
- Glare must be perspectively correct, not computed in screen space.
- Their software rasterizer beat point and billboard rendering in almost all cases. 50 million Gaia stars took about 8 ms at 4K on an RTX 4070 Super.
- The method is implemented in the open-source CosmoScout VR.
- Sources: [EG Digital Library](https://diglib.eg.org/handle/10.2312/egs20251029); [DLR PDF](https://elib.dlr.de/215930/1/egs20251029.pdf)
- CosmoScout's `csp-stars` README lists only `minMagnitude/maxMagnitude` (example −15/15), `minSize/maxSize` (0.1/3.0), `minOpacity/maxOpacity`, `scalingExponent` (3.0) and the Hipparcos/Tycho-2 catalog paths. It does not document draw modes or photometry — [README](https://github.com/cosmoscout/cosmoscout-vr/blob/main/plugins/csp-stars/README.md)

**takram `StarsMaterial` (three.js, MIT)** — [StarsMaterial.ts](https://github.com/takram-design-engineering/three-geospatial/blob/main/packages/atmosphere/src/StarsMaterial.ts)
- The `pointSize` uniform is multiplied by `renderer.getPixelRatio()` every frame.
- Other uniforms: `intensity`, and `magnitudeRange` with default (−2, 8). depthTest and depthWrite are on, and the shaders are GLSL3.
- The shader math lives in `stars.vert/frag`, which I did not read. The package needs three ≥ 0.170 (earlier notes), so treat it as a reference only.

**Color**
- Ballesteros (2012): `T = 4600 K · [1/(0.92(B−V) + 1.7) + 1/(0.92(B−V) + 0.62)]`, derived from a blackbody spectrum and the filter curves — [Wikipedia: Color index](https://en.wikipedia.org/wiki/Color_index) (search summary). PyAstronomy documents B−V↔Teff conversions — [PyAstronomy](https://pyastronomy.readthedocs.io/en/latest/pyaslDoc/aslDoc/aslExt_1Doc/ramirez2005.html) (search summary).
- Unity's Blackbody node is based on Mitchell Charity's blackbody data: linear RGB output, D65 white, CIE 1964 10° observer — [Unity docs](https://docs.unity3d.com/Packages/com.unity.shadergraph@16.0/manual/Blackbody-Node.html).
- Celestia colored stars directly with that table's sRGB values — [Celestia forum](https://celestiaproject.space/forum/viewtopic.php?p=83146).
- Charity suggested a D58 white point rather than D65 for on-screen star colors — [JILA colour page](https://jila.colorado.edu/%7Eajsh/colour/Tspectrum.html). These three are search summaries; vendian.org itself was blocked.
- Wyman, Sloan and Shirley (JCGT 2013) give analytic multi-lobe fits of the CIE 1931 color matching functions. The fit error is smaller than the variance among the CIE observers, and the code is about 10 lines — [NVIDIA Research](https://research.nvidia.com/publication/2013-07_simple-analytic-approximations-cie-xyz-color-matching-functions)

**Catalogs**
- HYG v4.x is CC BY-SA 4.0. The `mag` field is apparent visual magnitude and `ci` is the B−V color index — [astronexus HYG](https://astronexus.com/hyg); [GitHub mirror](https://github.com/codebox/HYG-Database) (search summary).
- NASA SVS star maps use Hipparcos-2 for stars brighter than magnitude 8 and Tycho-2 for 8.0–11.5 — [SVS 4851](https://svs.gsfc.nasa.gov/4851) (search summary).

**r167 tone mapping and bloom facts**
- `NeutralToneMapping` subtracts `offset = x < 0.08 ? x − 6.25x² : 0.04`, where x = min(r,g,b). It then compresses highlights starting at 0.76 and desaturates with factor 0.15 — [tonemapping_pars_fragment.glsl.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/shaders/ShaderChunk/tonemapping_pars_fragment.glsl.js)
- The same chunk ends with a replaceable stub, `vec3 CustomToneMapping( vec3 color ) { return color; }`. **But r167's `OutputPass` only sets defines for Linear, Reinhard, Cineon, ACES Filmic, AgX and Neutral, so `CustomToneMapping` has no effect in a composer.** `OutputShader` does `#include <tonemapping_pars_fragment>` and calls `NeutralToneMapping` — [OutputPass.js](https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/postprocessing/OutputPass.js); [OutputShader.js](https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/shaders/OutputShader.js)
- `UnrealBloomPass.threshold` feeds a `luminosityThreshold` uniform applied to the pass input, i.e. the HDR scene buffer — [UnrealBloomPass.js](https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/postprocessing/UnrealBloomPass.js)
- `OutputPass` copies `renderer.toneMappingExposure` into its uniform on every render — [OutputPass.js](https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/postprocessing/OutputPass.js)

### Inferences
**Physical range.**
- By the Web Engine formula, a magnitude 0 star gives about 2.5×10⁻⁶ lux. The Sun (m = −26.74) gives about 1.26×10⁵ lux.
- That is a ratio of about 5×10¹⁰, or 10.7 decades. No fixed exposure can show both, so star visibility has to be tied to exposure (section 3). That is also what real photographs do.

**Recommended star splat for r167** (Points, one draw call, additive into the HDR composer buffer before bloom):
```glsl
// --- vertex ---
attribute float aMag;            // apparent V magnitude
attribute vec3  aColor;          // linear sRGB from B-V, normalised to luminance 1
uniform float uFlux0;            // HDR flux of a mag-0 star at exposure 1 (see calibration)
uniform float uSigma;            // Gaussian sigma in framebuffer px, e.g. 0.65 * sqrt(DPR)
varying vec3 vColor; varying float vPeak, vSigma, vSize;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);  // position = unit direction * R (sky pass)
  gl_Position = projectionMatrix * mv;
  float flux = uFlux0 * exp2(-1.3287712 * aMag);     // 10^(-0.4 m)
  float c = max(0.2, -normalize(mv.xyz).z);          // cos(angle off the view axis)
  flux /= c * c * c;                                  // pixel solid angle ~ cos^3 (Schneegans et al. 2025)
  float s = uSigma;
  float peak = flux / (6.2831853 * s * s);           // integral of the Gaussian == flux
  if (peak > 8.0) { s *= pow(peak / 8.0, 0.25); peak = flux / (6.2831853 * s * s); } // gentle growth
  vSize = ceil(6.0 * s) + 1.0;  gl_PointSize = vSize; // +-3 sigma
  vPeak = peak; vSigma = s; vColor = aColor;
  if (peak < 1.0 / 2048.0) gl_Position = vec4(0.0, 0.0, 2.0, 1.0); // clip invisible stars
}
// --- fragment ---
varying vec3 vColor; varying float vPeak, vSigma, vSize;
void main() {
  vec2 d = (gl_PointCoord - 0.5) * vSize;            // px offset from the true sub-pixel centre
  gl_FragColor = vec4(vColor * (vPeak * exp(-dot(d, d) / (2.0 * vSigma * vSigma))), 1.0);
}
// material: blending AdditiveBlending, depthWrite false, depthTest true (planets occlude stars)
```
- **Why it doesn't shimmer:** the Gaussian is evaluated relative to the point's sub-pixel center, and its energy is constant. A star crossing pixel boundaries keeps the same summed brightness, which is what Stellarium approximates with its 1.2 px floor. The `cos³` term follows the "Smaller than Pixels" finding. It matters at FOVs above ~50°: at 60° vertical FOV, 16:9, a corner star is ~3.7× brighter per pixel than a centered one.
- **Calibration:** `uFlux0 = T_lin · 2πσ² · 10^(0.4·m_lim)`.
  - Example: m_lim = 6.5, a visibility threshold of sRGB 4/255 (linear 0.00121), σ = 0.65 → uFlux0 ≈ 1.28. A magnitude 0 star then peaks at ≈ 0.48 and Sirius (m −1.46) at ≈ 1.85. Only a handful of stars cross a bloom threshold of 1.0, which matches photographs.
  - If you want more stars to bloom, lower the threshold or raise uFlux0. Don't widen σ for all stars.
- **The Neutral toe problem (computed from the verified r167 formula):** for grey input under 0.08 the output is 6.25·x².
  - Linear 0.01 becomes 0.00063 (sRGB code 2 instead of 25). Linear 0.02 becomes 0.0025 (code 8 instead of 39).
  - The faint-star threshold moves up by 2.6–3.4 magnitudes. In the example above, the limit falls from 6.5 to ~3.9.
  - The same crush darkens a faint Milky Way background.
  - Fix A: keep `renderer.toneMapping = THREE.NeutralToneMapping`, but patch the Neutral body in the shared chunk so it keeps only a quarter of the toe. A `CustomToneMapping` replacement would be ignored by r167's OutputPass. Run this before the OutputPass material first compiles:
    ```js
    const src = THREE.ShaderChunk.tonemapping_pars_fragment;
    const patched = src
      .replace('const float StartCompression = 0.8 - 0.04;', 'const float StartCompression = 0.8 - 0.01;')
      .replace('float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;',
               'float offset = ( x < 0.08 ? x - 6.25 * x * x : 0.04 ) * 0.25;'); // 1/4 of the Khronos toe
    if (patched === src) console.warn('Neutral toe patch did not match this three.js version');
    THREE.ShaderChunk.tonemapping_pars_fragment = patched;
    ```
  - Fix B: render the sky (Milky Way plus stars) into its own target and add it after tone mapping, in display space, inside the existing grade pass.
- **Glare for the brightest ~20–50 stars:** draw instanced camera-facing quads rather than `gl_PointSize`, which avoids the implementation's point-size limit.
  - Size and alpha can follow Celestia: glare only when saturated, `glareAlpha ≈ min(0.5, discScale/4)`.
  - Define the size in angular units so the glare doesn't change with zoom, per the "perspectively correct" glare point.
  - A 4- or 6-spike diffraction texture is optional (see the previous notes).
- **Color:**
  - Build a 256×1 `DataTexture` LUT at startup over T ∈ [2,000, 40,000] K: Planck spectrum × Wyman CMF fit → XYZ → linear sRGB, normalized to Y = 1.
  - Index it per star with Ballesteros(B−V). Normalizing keeps color from changing brightness.
  - With a D65 white, the Sun-like G2 stars look slightly warm. Charity's D58 suggestion makes them read white.
  - Art direction: desaturate star colors 20–40% toward white. Real photographs show mostly white saturated cores with color in the halos (my observation, not sourced).
- **Catalog and packing:**
  - Yale BSC (~9k stars, the naked-eye sky) or HYG cut at m ≤ 6.5–7.5.
  - Pack each star as a Float32 unit vector (12 B) + Float32 mag (4 B) + Uint8×3 color (3 B) = 19 B. That is ~170 KB for 9k stars and ~2.3 MB for 120k.
  - Precompute the positions in the frame of section 2 so stars and the Milky Way share one rotation.
  - HYG's CC BY-SA means a redistributed derived binary is also CC BY-SA. Stellarium and Celestia are (A)GPL, so reimplement their formulas rather than copying code.
- **Draw order:** run a "sky pass" first: camera rotation only, depthTest on, depthWrite off. Draw the Milky Way background, then the stars. Planets drawn later occlude correctly.

### Gaps
- Gaia Sky's exact pseudo-size and solid-angle formulas and CosmoScout's shader code were not read (docs host blocked; GitHub API gated for that repo; the README has no math).
- Charity's actual RGB table values were not read (vendian.org blocked).
- No WebGL measurements exist for the cost of the `cos³` correction or the Gaussian splat. It is trivially cheap per star, and the cost scales with sprite area.
- Star counts per magnitude for BSC/HYG/Hipparcos were not verified in-session.

## 2. Milky Way from a real panorama, correct frame alignment (galactic → equatorial → ecliptic), and no double counting

### Takeaway
Use NASA SVS "Deep Star Maps 2020" **Milky Way background**. It is published without the bright Hipparcos and Tycho stars, in both celestial and galactic coordinates. Draw the catalog stars yourself as HDR points; that avoids double counting by construction. Rotate the sky with ERFA's ICRS→Galactic matrix and the J2000 obliquity (ε = 84381.406″ = 23.4392794°). In a scene whose XZ plane is the ecliptic (+Y = north ecliptic pole, +X = March equinox):
- an equatorial map needs `scene.backgroundRotation.set(-ε, 0, 0)`;
- a galactic map needs a full rotation (values below).

The galactic plane is tilted **60.19°** to the ecliptic. The Galactic Centre lies at ecliptic λ ≈ 266.84°, β ≈ −5.54°. Avoid `scene.background = equirect` for large maps: r167 converts it to an *uncompressed* cube with faces as tall as the image.

### Cited Findings
- **NASA SVS Deep Star Maps 2020 (ID 4851), all search summaries:**
  - Celestial coordinates, centered on 0h RA, with RA increasing to the left.
  - OpenEXR half-float, linear, from 4K (4096×2048) to 64K (65536×32768, 3.8 GB).
  - Built from about 1.7 billion stars: Hipparcos-2, Tycho-2 and Gaia DR2, plus BSC, UCAC3 and XHIP.
  - **The Milky Way background is a separate version that leaves out the bright Hipparcos and Tycho stars.** Those stars are in a separate foreground map. Both come in celestial and galactic coordinates.
  - Hipparcos-2 covers stars brighter than magnitude 8; Tycho-2 covers 8.0–11.5.
  - Sources: [SVS 4851](https://svs.gsfc.nasa.gov/4851); [SVS API record](https://svs.gsfc.nasa.gov/api/4851)
- **ESO "The Milky Way panorama" (eso0932a), search summary:**
  - 6000×3000, credit ESO/S. Brunier, released 14 Sep 2009.
  - Galactic plane horizontal across the frame. The 800-Mpx original is available only on request.
  - A Wikimedia Commons mirror states CC BY 4.0; the license was not confirmed on eso.org.
  - Source: [ESO eso0932a](https://eso.org/public/images/eso0932a)
- **ERFA `icrs2g.c`** gives the ICRS→Galactic matrix, applied as v_gal = r·v_icrs. First row: (−0.054875560416215368, −0.873437090234885049, −0.483835015548713227). It is built from R₃(−R)·R₁(π/2−Q)·R₃(π/2+P), with P = 192.85948°, Q = 27.12825° and R = 32.93192°, "regarded as exact" — [liberfa/erfa icrs2g.c](https://github.com/liberfa/erfa/blob/master/src/icrs2g.c)
- **ERFA `obl06.c`** gives the IAU 2006 mean obliquity: ε₀ = 84381.406″ − 46.836769″·t − … (t in Julian centuries from J2000) — [liberfa/erfa obl06.c](https://github.com/liberfa/erfa/blob/master/src/obl06.c)
- **r167 conventions:**
  - `equirectUv(dir)`: u = atan(dir.z, dir.x)/(2π) + 0.5, v = asin(dir.y)/π + 0.5 — [common.glsl.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/shaders/ShaderChunk/common.glsl.js)
  - `WebGLBackground` copies `scene.backgroundRotation`, negates x, y and z, re-negates y and z only for non-render-target `CubeTexture`s, and builds `makeRotationFromEuler` in the Euler's own order. The shader samples `backgroundRotation * worldDir`, with `flipEnvMap = -1` only for non-render-target cube textures — [WebGLBackground.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/webgl/WebGLBackground.js)
  - Material `envMapRotation` uses the same negated-Euler logic — [WebGLMaterials.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/webgl/WebGLMaterials.js)
  - `Scene` has `backgroundRotation`, `environmentRotation` and `environmentIntensity` — [Scene.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/scenes/Scene.js)
  - An equirect background is converted with `new WebGLCubeRenderTarget( image.height )`, so the faces are as tall as the image — [WebGLCubeMaps.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/webgl/WebGLCubeMaps.js)
  - `PMREMGenerator.fromEquirectangular` sets the cube size to width/4, and its target is `3·max(cubeSize, 112) × 4·cubeSize` — [PMREMGenerator.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/extras/PMREMGenerator.js)

### Inferences
**Derived values.** I computed these as v_gal = G·E·v_ecl, where G is the ERFA matrix and E is the rotation about x by ε (x_eq = x, y_eq = cosε·y − sinε·z, z_eq = sinε·y + cosε·z). They match textbook values: Galactic Centre RA 266.40°, Dec −28.94°.
- North ecliptic pole in galactic coordinates: l = 96.384°, b = +29.811°. The ecliptic is inclined **60.189°** to the galactic plane.
- Galactic Centre in ecliptic coordinates: λ = 266.840°, β = **−5.536°**. North galactic pole: λ = 180.02°, β = +29.81°.
- The three.js axis mapping I use for any astronomical frame is X = x, Y = z (north), Z = −y. With r167's `equirectUv`, this reproduces maps drawn "longitude 0 at center, increasing to the left" (SVS, and standard galactic panoramas) without mirroring.

**Ready-to-use r167 code** (scene frame = ecliptic, XZ = orbital plane, +Y = ecliptic north, +X = March equinox):
```js
const EPS = THREE.MathUtils.degToRad(84381.406 / 3600);   // 23.4392794 deg
// (a) equatorial (RA/Dec) equirect, e.g. SVS celestial Milky Way background:
scene.backgroundRotation.set(-EPS, 0, 0);                  // (-0.409093, 0, 0)
// (b) galactic equirect (SVS galactic version, ESO panorama), Euler order 'XYZ':
// scene.backgroundRotation.set(3.138424, -1.459576, -2.087955);
scene.environmentRotation.copy(scene.backgroundRotation);  // same convention for PMREM env maps
```
For a custom sky shader (recommended, see memory note), use the sampling matrix directly:
```js
// world (ecliptic, three layout) -> galactic texture direction (three layout); row-major args
const SKY_FROM_WORLD_GAL = new THREE.Matrix3().set(
  -0.0548755604, -0.0964768285, +0.9938213594,
  -0.8676661490, +0.4971471916, +0.0003516911,
  -0.4941094279, -0.8622858525, -0.1109909090);
// equatorial texture instead: rotation about X: [1,0,0; 0,cosE,-sinE; 0,sinE,cosE]
```
```glsl
uniform mat3 uSkyFromWorld; uniform sampler2D uSky; uniform float uSkyGain;
vec3 d = normalize(uSkyFromWorld * vWorldDir);
vec2 uv = vec2(atan(d.z, d.x) * RECIPROCAL_PI2 + 0.5, asin(clamp(d.y, -1., 1.)) * RECIPROCAL_PI + 0.5);
// seam fix: atan jumps at u=0/1 -> wrong mip there; take gradients from a copy whose seam is elsewhere
float u2 = fract(uv.x + 0.5);
vec2 dx = dFdx(uv), dy = dFdy(uv), dx2 = vec2(dFdx(u2), dx.y), dy2 = vec2(dFdy(u2), dy.y);
if (dot(dx2,dx2) + dot(dy2,dy2) < dot(dx,dx) + dot(dy,dy)) { dx = dx2; dy = dy2; }
vec3 sky = textureGrad(uSky, uv, dx, dy).rgb * uSkyGain;
```
**Sanity tests:**
- In a galactic map, the Galactic Centre must land at (u, v) = (0.5, 0.5). The LMC (l 280.47°, b −32.89°) lands at (0.721, 0.317) and the SMC at (0.659, 0.254), i.e. lower right.
- With an equatorial map in this scene, Polaris sits near direction (0, 0.917, −0.398), tilted 23.4° from +Y toward −Z.
- The Galactic Centre direction in the scene is (−0.055, −0.096, +0.994). Orion's belt (RA ≈ 5.5h, Dec ≈ −1°) is a quick visual check.
- If the orrery places planets by real heliocentric ecliptic longitude (e.g. from an ephemeris), +X must be λ = 0. Otherwise only the 23.44° tilt matters visually.

**No double counting:**
- **SVS background + catalog points:** the background excludes Hip+Tycho stars, so drawing catalog stars to m ≈ 6.5–8 overlays nothing twice.
- Stars of magnitude 8–11.5 are then missing from both layers. At 4K (≈5.3′/pixel) they would be sub-threshold individually anyway.
- **ESO or Solar System Scope panoramas include stars.** Overlaying catalog points creates doubled or misaligned bright stars. Either remove stars from the panorama, or draw only stars brighter than ~m 3 on top and dim the panorama's star pixels.

**HDR vs LDR:**
- Once the stars are removed, the background's dynamic range is modest. Convert the linear EXR offline (exposure baked) to 8-bit sRGB, then to KTX2/JPEG, and multiply by `uSkyGain` tied to exposure.
- Keep HDR only for the stars, which come from the catalog.
- Watch the Neutral toe from section 1. A Milky Way at linear 0.01–0.03 would be crushed.

**Memory:**
- `scene.background = equirect4k` → a 2048²×6 cube render target: 96 MiB RGBA8 or 192 MiB half-float, +⅓ if mipmapped, on top of the source texture.
- With an 8K map, the faces are 4096² (384 MiB RGBA8).
- The conversion also discards KTX2 compression, because the render target is uncompressed. A custom sky shader sampling the (compressed) equirect avoids all of that.

### Gaps
- I could not open the SVS page to confirm the exact file names, license or credit line. NASA SVS media is usually free to use with credit, but this was not verified here. I also could not confirm whether the "background" omits stars down to 11.5 or only Hipparcos.
- ESO panorama projection details (pure plate carrée? exact l orientation?) and the license were not confirmed on eso.org. Use the LMC/SMC test above.
- Solar System Scope's "stars + Milky Way" map frame (galactic vs equatorial) is undocumented in what I found.

## 3. Exposure coupling / auto exposure (dimming stars when a bright planet or the Sun fills the frame)

### Takeaway
Neither r167 nor three's addons ship auto exposure. The postprocessing folder has no `AdaptiveToneMappingPass`. pmndrs `ToneMappingEffect` adapts only in `REINHARD2_ADAPTIVE` mode. Its luminance lives in 8-bit RGBA, which fits poorly with HDR scenes containing the Sun, and it cannot be combined with Neutral/AgX. The robust, nearly free option is **Stellarium-style analytic metering**: each frame, compute the brightest significant source in view from the projected solid angle and luminance of the Sun and lit bodies, adapt in log space, and drive `renderer.toneMappingExposure`. Optionally refine it with a GPU log-average luminance read back with r167's non-blocking `readRenderTargetPixelsAsync`. Since bloom runs before OutputPass's exposure, scale `bloomPass.threshold` by 1/exposure.

### Cited Findings
**Stellarium desktop** — [StelSkyDrawer.cpp](https://github.com/Stellarium/stellarium/blob/master/src/core/StelSkyDrawer.cpp)
- `reportLuminanceInFov(lum)` keeps the maximum luminance reported in a frame. `maxLum` moves in log space with `transitionSpeed = 0.2` s: `exp(log(old) + (log(lum) − log(old))·min(1, 1/fps/0.2))`.
- `preDraw()` sets `eye->setWorldAdaptationLuminance(maxLum)` and then resets `maxLum = 0`.
- Only large disks (Sun, Moon, bright planets) report, using `min(700, min(wl/50, 3600/fov²·6))·(1 − opacity)`.

**Stellarium Web Engine** — [core.c](https://github.com/Stellarium/stellarium-web-engine/blob/master/src/core.c)
- `core_report_luminance_in_fov` keeps the per-frame maximum `lwmax`.
- `core_update` steps toward it in log space by `fmin(0.16·dt/0.01666, 0.5)`: about 16% per 60 fps frame, capped at 50% per update. "Fast adaptation" jumps immediately.
- Each frame resets `lwmax` to `lwmax_min = 0.052`. Defaults: `tonemapper_p = 2.2`, `exposure_scale = 2`.
- `core_report_vmag_in_fov` uses "100% ad-hoc formulas" tuned so the Moon hides all but bright stars, and zooming on Mars hides most stars.

**SpaceEngine (search summary)**
- In auto mode all objects have physically based brightness. "Automatic camera adaptation" picks the exposure "by analysing the image brightness in the central area of the screen" — [SpaceEngine blog: HDR rendering (2017)](https://spaceengine.org/news/blog170312/)

**pmndrs postprocessing** — [6.38.3 build](https://cdn.jsdelivr.net/npm/postprocessing@6.38.3/build/index.js)
- `ToneMappingEffect` options default to `mode AGX`, `resolution 256` (luminance texture, power of two), `whitePoint 4`, `middleGrey 0.6`, `minLuminance 0.01`, `averageLuminance 1`, `adaptationRate 1`.
- `adaptiveLuminancePass.enabled = (mode === REINHARD2_ADAPTIVE)`, so adaptation applies only to the Reinhard2 operator.
- The luminance target is `new WebGLRenderTarget(1, 1, {minFilter: LinearMipmapLinearFilter, depthBuffer: false})` with mipmaps, and values are packed with `packFloatToRGBA`.
- Adaptation: `adaptedLum = l0 + (l1 − l0)·(1 − exp(−deltaTime·tau))`.
- **Version compatibility from npm `peerDependencies`:** 6.36.0 `>=0.157 <0.168`; 6.36.1–6.36.2 `<0.169`; … 6.38.3 `<0.184` (all accept r167). **6.39.0 and later require `>=0.168.0`** — [npm registry: postprocessing](https://registry.npmjs.org/postprocessing)

**three r167**
- The postprocessing folder contains AfterimagePass, BloomPass, BokehPass, ClearPass, CubeTexturePass, DotScreenPass, EffectComposer, FilmPass, GTAOPass, GlitchPass, HalftonePass, LUTPass, MaskPass, OutlinePass, OutputPass, Pass, RenderPass, RenderPixelatedPass, RenderTransitionPass, SAOPass, SMAAPass, SSAARenderPass, SSAOPass, SSRPass, SavePass, ShaderPass, TAARenderPass, TexturePass and UnrealBloomPass. There is no adaptive tone-mapping pass — [examples/jsm/postprocessing/](https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/postprocessing/)
- `WebGLRenderer.readRenderTargetPixelsAsync(rt, x, y, w, h, buffer)`:
  - It copies into a `PIXEL_PACK_BUFFER` (`STREAM_READ`), inserts `fenceSync`, polls `clientWaitSync` every 4 ms via `probeAsync`, then calls `getBufferSubData` — [WebGLRenderer.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/WebGLRenderer.js); [utils.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/utils.js)
  - HalfFloat targets are readable when `EXT_color_buffer_half_float` or `EXT_color_buffer_float` is present, and Float targets always are — [WebGLCapabilities.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/webgl/WebGLCapabilities.js)

### Inferences
**Why not pmndrs here:**
- Reinhard2-only means losing Neutral or AgX.
- The 1×1 luminance target uses the default (UnsignedByte) type, so HDR luminance above 1 probably clips. That reading of the code is unverified at runtime.
- You'd also need to port the existing composer to pmndrs.
- If you want it anyway for r167, pin `postprocessing@6.38.3` or lower, and use the package's own `build/index.js` through the importmap.

**Analytic metering (CPU, zero GPU cost), a vanilla r167 port of the Stellarium idea:**
```js
const KEY = 0.18, LW_FLOOR = 0.05, EXPO_MIN = 1e-4, EXPO_MAX = 2.0, BLOOM_T = 1.0;
let lAdapt = LW_FLOOR; const _v = new THREE.Vector3(), _n = new THREE.Vector3();
function meter(camera, bodies, dt) {            // bodies: {position, radius, L, litFraction}
  const vy = THREE.MathUtils.degToRad(camera.fov) / 2, vx = Math.atan(Math.tan(vy) * camera.aspect);
  const viewSolid = 4 * Math.asin(Math.sin(vx) * Math.sin(vy));   // exact solid angle of the frustum
  let target = LW_FLOOR;
  for (const b of bodies) {
    const d = _v.copy(b.position).sub(camera.position).length();
    const ang = Math.asin(Math.min(1, b.radius / d));             // angular radius
    _n.copy(b.position).project(camera);
    if (_n.z > 1 || Math.abs(_n.x) > 1 + 2 * ang || Math.abs(_n.y) > 1 + 2 * ang) continue;
    const cover = Math.min(1, Math.PI * ang * ang / viewSolid);   // fraction of the frame
    const centre = Math.exp(-1.5 * (_n.x * _n.x + _n.y * _n.y));  // SpaceEngine-like centre weight
    target = Math.max(target, b.L * b.litFraction * Math.sqrt(cover) * centre * b.visibility); // visibility: occlusion (sec. 6)
  }
  const tau = target > lAdapt ? 0.4 : 2.5;      // brighten fast, darken slowly: calm
  lAdapt = Math.exp(Math.log(lAdapt) + (Math.log(target) - Math.log(lAdapt)) * (1 - Math.exp(-dt / tau)));
  renderer.toneMappingExposure = THREE.MathUtils.clamp(KEY / lAdapt, EXPO_MIN, EXPO_MAX);
  bloomPass.threshold = BLOOM_T / renderer.toneMappingExposure;  // bloom sees pre-exposure HDR
}
```
- The `sqrt(cover)` shaping and the time constants are tunable, much like Stellarium's ad-hoc terms. The Sun should report even when tiny: its L is about 10⁵–10⁶× a lit planet's.
- Use `visibility` from the eclipse/occlusion code in section 6 so a planet hiding the Sun drops exposure smoothly.

**Stars dim for free.**
- Stars, sky and planets all sit in one HDR buffer, and OutputPass multiplies by `toneMappingExposure`. When the Sun or a bright limb raises `lAdapt`, faint stars fall below display threshold through the section 1 splat math, exactly as in photographs.
- Don't scale star flux separately, or you double-apply exposure.
- `EXPO_MAX` stops empty deep space from turning grey; it plays the role of pmndrs' `minLuminance`.

**GPU refinement (optional, 2–4 Hz):**
- Add a custom Pass right after the RenderPass (`needsSwap = false`). It renders `log(max(lum, 1e-4))` of the HDR read buffer into a 64×32 `HalfFloatType` target.
- Then call `renderer.readRenderTargetPixelsAsync(lumRT, 0, 0, 64, 32, u16buf)` with a `Uint16Array`, decode with `THREE.DataUtils.fromHalfFloat`, and take `exp(mean)`.
- Results arrive 1–3 frames late without stalling. Combine as `target = max(analytic, k·gpuLogAvg)`.
- One bilinear tap per texel aliases a small Sun, so let the analytic term handle point-like sources.

### Gaps
- I found no measured cost for `readRenderTargetPixelsAsync` on iGPUs, and no browser-specific notes on `clientWaitSync` polling.
- I did not verify at runtime whether pmndrs `LuminancePass` writes to an 8-bit or float target. The inference comes from its default render-target type.
- SpaceEngine's exact metering curve is unpublished (forum discussions only).

## 4. Texture-based planets: day/night and city lights, clouds and cloud shadows, ocean glint, relief, terminator, limb darkening, Venus; cheapest atmosphere that still looks right

### Takeaway
Use three.js's own Earth example (r168, TSL) as the parameter reference and port it to GLSL via `onBeforeCompile` or a `ShaderMaterial`:
- day/night `smoothstep(−0.25, 0.5)` on N·L;
- clouds `smoothstep(0.2, 1)`;
- roughness 0.25–0.35, forced rough under clouds;
- atmosphere day `#4db2ff` and twilight `#bc490b`;
- a shell at 1.04× radius.

Add an exact cloud shadow: intersect the sun ray with the cloud shell, one extra fetch. Use Minnaert limb darkening for gas giants (k = 0.5 is flat, 1 is Lambert; clamp at the limb). For the atmosphere at orrery scale, keep the current single-scattering ray march in the shell but remove its inner light loop with a 2D transmittance LUT or analytic optical depth. That cuts exponentials about 4–5×. Below ~30 px disk radius, switch to an analytic rim.

### Cited Findings
**three.js `webgpu_tsl_earth` (r168; TSL/WebGPURenderer, so not drop-in for r167)** — [example source @ r168](https://github.com/mrdoob/three.js/blob/r168/examples/webgpu_tsl_earth.html)
- Textures: `earth_day_4096.jpg` and `earth_night_4096.jpg` (sRGB), plus `earth_bump_roughness_clouds_4096.jpg` packing R = elevation, G = roughness, B = clouds. All use anisotropy 8.
- Light: `DirectionalLight('#ffffff', 2)`. The sphere is 64×64.
- Clouds: `cloudsStrength = clouds.b.smoothstep(0.2, 1)`, and `colorNode = mix(day, white, cloudsStrength·2)`.
- Roughness: `max(G, step(0.01, cloudsStrength))`, remapped to `[0.25, 0.35]`. Bump: `bumpMap(max(R, cloudsStrength))`.
- Day/night: `dayStrength = sunOrientation.smoothstep(−0.25, 0.5)`; `mix(night, lit, dayStrength)`.
- Atmosphere tint on the globe: `mix(twilight #bc490b, day #4db2ff, sunOrientation.smoothstep(−0.25, 0.75))`, blended by `fresnel²`.
- Shell: same geometry ×1.04, BackSide, transparent. `alpha = remap(fresnel, 0.73→1, 1→0)³ × sunOrientation.smoothstep(−0.5, 1)`.

**r167 `SphereGeometry`:** `x = −r·cos(φ)·sin(θ)`, `y = r·cos(θ)`, `z = r·sin(φ)·sin(θ)`, uv = (u, 1 − v) — [SphereGeometry.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/geometries/SphereGeometry.js)

**Minnaert limb darkening (search summaries)**
- I/F = (I/F)₀·μ₀^k·μ^(k−1). k > 0.5 darkens the limb, k < 0.5 brightens it, k = 0.5 means no limb darkening, and k = 1 is Lambertian.
- Neptune fits give k > 0.5 near 830 nm and k < 0.5 at longer wavelengths.
- Sources: [Wikipedia: Limb darkening](https://en.wikipedia.org/wiki/Limb_darkening); [arXiv:2101.01063](https://arxiv.org/pdf/2101.01063)
- Blender developers noted the shader "goes to infinity" at grazing angles and that implementations use different k conventions — [bf-committers](https://lists.blender.org/pipermail/bf-committers/2005-April/010448.html)

**Atmosphere cost references**
- wwwtyro/glsl-atmosphere uses `iSteps 16` and `jSteps 8`: 16 primary + 128 secondary sample positions (288 exponentials) and 18 ray-sphere tests per pixel. Phases: Rayleigh 3/(16π)(1+μ²), Mie Henyey–Greenstein — [index.glsl](https://github.com/wwwtyro/glsl-atmosphere/blob/master/index.glsl)
- Schüler, "An Approximation to the Chapman Grazing-Incidence Function for Atmospheric Scattering" (book chapter listing; volume not confirmed) — [Taylor & Francis](https://www.taylorfrancis.com/chapters/edit/10.1201/b11642-11/approximation-chapman-grazing-incidence-function-atmospheric-scattering-christian-schu%C2%A8ler)
- The secant approximation is adequate up to ~60–70° zenith angle — [Chapman function](https://www.wikiwand.com/en/Chapman_function). An analytic Chapman approximation reaches <0.5% maximum error — [Yue 2024, ACP 24:5093](https://acp.copernicus.org/articles/24/5093/2024/) (search summaries).

**Community reference:** the three.js showcase "3dsolarsystem.online" uses day, cloud, night, topography and normal maps plus an fbm overlay in custom GLSL — [three.js forum](https://discourse.threejs.org/t/photorealistic-real-time-solar-system-in-three-js-3dsolarsystem-online/91545) (search summary).

### Inferences
**Surface fragment snippet (r167 GLSL; `N`, `L` in planet object space, unit length):**
```glsl
// SphereGeometry-compatible UV from an object-space direction
vec2 sphUV(vec3 d) { return vec2(fract(atan(d.z, -d.x) * RECIPROCAL_PI2), 0.5 + asin(clamp(d.y,-1.,1.)) * RECIPROCAL_PI); }
float NdotL = dot(N, L);
// 1) exact cloud shadow: where does the sun ray from this surface point cross the cloud shell (radius 1+h)?
float b = dot(N, L);
float t = -b + sqrt(b*b + 2.0*uCloudH + uCloudH*uCloudH);       // uCloudH ~ 0.002-0.01 (cloud height / R)
vec2 uvC = sphUV(normalize(N + L * t)) + vec2(uCloudUOffset, 0.0); // match the cloud layer's own rotation
float cloudShadow = 1.0 - uShadowK * texture2D(uClouds, uvC).r;   // uShadowK ~ 0.5-0.7
// 2) lighting with a twilight band (Earth example: day = smoothstep(-0.25, 0.5, NdotL))
float day = smoothstep(-0.25, 0.5, NdotL);
vec3 lit  = albedo * max(NdotL, 0.0) * uSunColor * cloudShadow;
float cloudsHere = smoothstep(0.2, 1.0, texture2D(uClouds, vUv + vec2(uCloudUOffset, 0.0)).r);
vec3 night = texture2D(uNight, vUv).rgb * (1.0 - day) * (1.0 - 0.8 * cloudsHere) * uCityGain; // clouds hide lights
```
- **Ocean glint:** use `MeshStandardMaterial` (via `onBeforeCompile` for the extras) with `roughnessMap` = inverted water mask.
  - Example: land 0.8–0.9, ocean 0.15–0.3; the Earth example uses 0.25–0.35 for the whole globe. Force roughness 1 under clouds, as the example does.
  - From orbit the glint should be a compact ellipse. A roughness below ~0.1 makes a pinpoint that aliases, so keep MSAA, or clamp roughness up with distance.
- **Relief:**
  - A bump or normal map needs anisotropy (`renderer.capabilities.getMaxAnisotropy()`, typically 8–16). The grazing sun at the terminator is where relief shows.
  - For distant bodies, fade the normal strength by pixel size to avoid sparkle.
- **Terminator softness:**
  - The Sun's angular diameter (0.53° at 1 AU) gives only a ~60 km penumbra on Earth, so geometric softness is negligible.
  - The visible softness on Earth comes from atmospheric twilight. Use the ~±15–25° N·L band above with the twilight tint.
  - **Airless bodies (Moon, Mercury)** need a hard terminator. A Lommel–Seeliger term, μ₀/(μ₀+μ), instead of Lambert gives the flat-looking full Moon real photos show. That is standard planetary photometry, but I did not source it in-session.
- **Gas giants:** `I = albedo · pow(max(μ0, 0.02), k) · pow(max(μ, 0.05), k − 1.0)`, with k ≈ 0.7–0.9 in visible light (art-directed; see Gaps).
  - Clamp μ (N·V) to avoid the limb blow-up.
  - Add a slight reddening toward the limb, and a thin haze rim from the atmosphere shell.
  - Band textures (Solar System Scope) plus Minnaert are enough at orrery distances.
- **Venus:**
  - Use the Solar System Scope "venus_atmosphere" map at low contrast (×0.3–0.5 around its mean), a high pale-cream albedo, Minnaert k ≈ 0.6–0.7, no specular, and a broad bright haze rim.
  - Hide the surface map completely. The visible cloud deck has very little contrast, so a contrasty map looks fake.
- **Cheapest atmosphere that still looks right at planet scale**, in rising cost (per covered pixel):
  1. Fresnel rim (current-style shells): about 0 exponentials. The colors and terminator are wrong.
  2. **O'Neil (GPU Gems 2):** scattering per vertex. Cheapest correct look, but the scale height must be 25% of the atmosphere thickness and the atmosphere 2.5% of the radius (earlier notes).
  3. **Ray march with analytic or LUT optical depth (recommended):** N primary samples, no inner loop.
     - The current 10×4 march costs ~10 × 2 + 40 × 2 = 100 exponentials + 11 ray-sphere tests per pixel.
     - With a 256×64 `HalfFloatType` transmittance LUT, rendered once per atmosphere type, it drops to ~20 exponentials + 10 fetches. Use 6–8 primary samples on the iGPU tier.
  4. Full Bruneton precomputation (takram): needs r170+.
- **Apply the same transmittance to the surface shader** (sun color = LUT(h = 0, μs)). That gives the orange terminator band, the main "photo" cue.
- **LOD:** when the disk radius is under ~30 px, replace the march with `rim = kRayleighColor * (1 − exp(−c / max(μ, 0.05)))` times sun visibility.

### Gaps
- I found no source with measured Minnaert k for Jupiter, Saturn or Venus in visible light; the k values above are art-directed.
- There is no WebGL timing for cloud-shadow or LUT-atmosphere variants.
- I did not verify the license of the three.js example textures (`earth_*_4096.jpg`).
- Venus's visible-light appearance and the Lommel–Seeliger photometry are unsourced here.

## 5. Saturn rings: radial textures, both shadows, forward/back scattering, unlit side

### Takeaway
Drive the rings with a 1-D radial profile of color and optical depth τ, computing radius in the shader: three's `RingGeometry` UVs are planar, not radial. Shade with single-scattering slab formulas. They reproduce the observed reversal: the dense B ring is bright on the lit face and dark on the unlit face, while the thin C ring and Cassini Division glow from the unlit side. Add a forward-scattering lobe for high phase angles. Compute the planet-on-ring and ring-on-planet shadows analytically in the fragment shaders: ray toward the Sun versus sphere or plane. No shadow maps.

### Cited Findings
- **Unlit-side reversal:** Cassini images show the B ring brighter than the A and C rings when lit directly, but darker from the unlit face, where A and C look brighter. NASA attributes this to the B ring's greater density. The unlit view was at phase 98°, the sunlit mosaic at phase 28° — [PIA08840](https://pds-rings.seti.org/press_releases/pages/PIA08xxx/PIA08840.html); [PIA11142](https://pds-rings.seti.org/press_releases/pages/PIA11xxx/PIA11142.html) (search summary)
- **Voyager 1:** from the unlit side, the nearly opaque B ring looks darker than the C ring and Cassini Division, and the A ring is intermediate. C ring and Cassini Division particles are more neutral in color than the A/B rings — [Voyager 1 ISS Science excerpt](https://pds-rings.seti.org/voyager/reference/science_v1s/iss/iss.html) (search summary)
- **Optical depths:** C ring ≈ 0.05–0.10, Cassini Division ≈ 0.10–0.20 — [arXiv:2311.17344](https://arxiv.org/pdf/2311.17344). A ring ≈ 0.4–1.0 — [arXiv:1203.6230](https://arxiv.org/pdf/1203.6230) (search summaries)
- **Björn Jónsson's maps** (back-scattered, forward-scattered, transparency) are used by Celestia modders. His transparency map is inverted relative to Celestia's opacity channel, and the real rings look more opaque at low angles, which a fixed transparency can't capture — [Celestia forum](https://celestiaproject.space/forum/viewtopic.php?p=135032) (search summary; his site was blocked)
- **Shadow techniques:**
  - Space Nerds In Space casts a ray from each ring fragment toward the light and tests it against the planet sphere — [SNIS rings](https://smcameron.github.io/space-nerds-in-space/planetary-rings/example/slideshow.html).
  - A gamedev.net write-up shadows a pixel when its distance to the line through the planet center along the sun direction is below the planet radius — [gamedev.net](https://gamedev.net/blogs/entry/1507603-planetary-rings-asteroids).
  - John Whigham uses the same ray test — [blog](https://johnwhigham.blogspot.com/2011/11/).
  - A three.js user found a ring mesh receiving only global shadow-map shadows, not the planet's — [three.js forum](https://discourse.threejs.org/t/ringgeometry-did-not-receive-shadow/67908). All search summaries.
- **r167 `RingGeometry` UVs** are planar: `uv.x = (x/outerRadius + 1)/2`, `uv.y = (y/outerRadius + 1)/2` — [RingGeometry.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/geometries/RingGeometry.js)

### Inferences
**Ring fragment shader (world space; `uRingTex` RGB = color, A = normal-incidence transmission T₀, so τ = −ln T₀):**
```glsl
float r = length(vLocalPos.xy);                               // radial, not RingGeometry's planar uv
float x = (r - uInner) / (uOuter - uInner);
vec4 ring = texture2D(uRingTex, vec2(x, 0.5));
float tau = -log(max(ring.a, 1e-3)) * uTauScale;
vec3 Nr = normalize(uRingNormal), V = normalize(cameraPosition - vWorldPos), L = uSunDir;
float muV = max(abs(dot(Nr, V)), 0.02), muL = max(abs(dot(Nr, L)), 0.02);
bool litFace = dot(Nr, V) * dot(Nr, L) > 0.0;
float cosA = dot(-L, V);                                       // scattering angle (phase = acos(-cosA))
float hgBack = (1.0 - 0.09) / pow(1.0 + 0.09 - 2.0 * -0.3 * cosA, 1.5);  // g = -0.3 (icy particles)
float hgFwd  = (1.0 - 0.49) / pow(1.0 + 0.49 - 2.0 *  0.7 * cosA, 1.5);  // g = +0.7 (dust)
float P = mix(hgBack, hgFwd, uDustFrac * (1.0 - smoothstep(0.1, 1.0, tau))); // dust matters in thin rings
// single-scattering slab: reflection (same side) / diffuse transmission (opposite side)
float S = litFace
  ? muL / (muL + muV) * (1.0 - exp(-tau * (1.0/muL + 1.0/muV)))
  : muL / max(abs(muL - muV), 1e-3) * abs(exp(-tau / muL) - exp(-tau / muV));
vec3 col = ring.rgb * uAlbedo * P * 0.25 * S * uSunIntensity;
float alpha = 1.0 - exp(-tau / muV);                           // more opaque at grazing view (matches the forum note)
// planet shadow on the ring: closest approach of the sun ray to the planet centre
vec3 toC = uPlanetPos - vWorldPos; float tca = dot(toC, L);
float dist = sqrt(max(dot(toC, toC) - tca * tca, 0.0));
float pen = tca * uSunAngRadius;                               // penumbra half-width ~ distance * sun angular radius
float planetShadow = tca > 0.0 ? smoothstep(uPlanetR - pen, uPlanetR + pen, dist) : 1.0;
gl_FragColor = vec4(col * planetShadow, alpha);                // premultiply or use NormalBlending; depthWrite false
```
- The τ-dependence is the point: thick τ (B ring) gives `S → 0` on the unlit face, while thin τ gives `S ≈ τ/μ`. So the C ring and Cassini Division glow from below, as in PIA08840.
- The "forward-scattered" and "unlit side" brightness profiles in Jónsson's data can replace `P` and `S` with measured radial curves.
- Add Saturn-shine to the unlit face as a small constant × planet color.

**Ring shadow on the planet (planet fragment shader, one fetch):**
```glsl
float den = dot(L, uRingNormal);
float tR = dot(uPlanetPos - vWorldPos, uRingNormal) / den;     // distance along L to the ring plane
vec3 Q = vWorldPos + L * tR; float rq = length(Q - uPlanetPos);
float inRing = step(0.0, tR) * step(uInner, rq) * step(rq, uOuter);
float T0 = texture2D(uRingTex, vec2((rq - uInner) / (uOuter - uInner), 0.5)).a;
float ringShadow = mix(1.0, pow(max(T0, 1e-3), 1.0 / max(abs(den), 0.05)), inRing); // exp(-tau/|mu|)
directLight *= ringShadow;
```
**Assets:**
- A 2048×1 (or ×4) RGBA strip is enough: 32 KB uncompressed, so don't bother compressing.
- If you use Jónsson-style transparency, mind the inversion relative to opacity.
- The Solar System Scope ring PNG (earlier notes) works as color + alpha with τ = −ln(1 − α).

**Cost:** about 15 ALU-heavy lines plus one fetch per ring pixel; the planet pays one fetch plus a ray-plane test. Both are negligible next to the atmosphere or bloom.

### Gaps
- I could not read Jónsson's own data description or download his maps. The exact radial tables (lit, unlit, forward-scattered) need to be obtained from his site or the PDS Rings Node.
- The HG g values for ring particles and dust above are illustrative, not from a fitted source.
- There is no WebGL performance data for ring shaders.

## 6. Vast scale: logarithmic depth, scaled-space multi-pass, floating origin, impostors; drawing the Sun as a small disk plus glare; occlusion-aware lens flare

### Takeaway
r167 has only `logarithmicDepthBuffer`. It writes `gl_FragDepth` for every fragment, which disables early-Z, and every custom ShaderMaterial must include the log-depth chunks. Reversed-Z arrives in r169. For this scene the better fit is **two RenderPasses**:
1. a "far/scaled-space" scene (sky, Sun, planets), with its own near/far;
2. the ship scene, drawn with `clear = false, clearDepth = true`.

Add a floating origin kept in JS doubles. Both keep early-Z and precision without log depth. Draw the Sun at its true angular size: ~0.53° at 1 AU, about 11 px at 1080p with a 50° FOV, versus ~370 px in today's orrery. Make it an HDR disk plus a glare sprite plus bloom. Compute occlusion analytically for planets (disk overlap) and with depth samples for the ship. three's `Lensflare` relies on framebuffer copies that are likely invalid inside a 4×MSAA composer target.

### Cited Findings
- **r167 log depth:**
  - Vertex: `vFragDepth = 1.0 + gl_Position.w`.
  - Fragment: `gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2(vFragDepth) * logDepthBufFC * 0.5`, with `logDepthBufFC = 2.0 / (log(camera.far + 1.0) / LN2)`.
  - Custom shaders get it only by including `logdepthbuf_*` chunks.
  - Sources: [logdepthbuf_fragment.glsl.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/shaders/ShaderChunk/logdepthbuf_fragment.glsl.js); [logdepthbuf_vertex.glsl.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/shaders/ShaderChunk/logdepthbuf_vertex.glsl.js); [WebGLRenderer.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/WebGLRenderer.js)
- **Log depth cost reports (search summaries):**
  - A forum thread says log depth "disables early-Z testing", which caused "massive overdraw" with grass sprites. It recommends measuring in ms, not fps (60→48 fps is ~4.2 ms), raising `camera.near` for short view ranges, and reversed-Z when available — [three.js forum thread](https://discourse.threejs.org/t/beware-of-logarithmic-depth-buffer-it-can-degrade-scene-performance/88495).
  - A user reported a 10–12 fps drop after enabling it on a many-object scene, and iTwin.js documents that "framerate may degrade" — [iTwin.js docs](https://www.itwinjs.org/v3/reference/core-frontend/rendering/rendersystem/rendersystem.options/logarithmicdepthbuffer).
  - A three.js report says MSAA fails where geometry intersects with log depth — [three.js forum](https://discourse.threejs.org/t/antialiasing-and-logarithmic-depth-buffer/31295).
- **Reversed depth:** `reverseDepthBuffer` is absent in three 0.167.1 and 0.168.0 and **first present in 0.169.0** (`state.buffers.depth.setReversed(true)`, `clearDepth(0)`) — [three@0.169.0 WebGLRenderer.js](https://cdn.jsdelivr.net/npm/three@0.169.0/src/renderers/WebGLRenderer.js) (npm source check)
- **Cesium (search summary):**
  - Since 1.45 it combines multi-frustum rendering with log depth in each frustum.
  - The blog's example needs one frustum and 111 draw calls with log depth. Without `EXT_frag_depth` it falls back to multi-frustum. Lowering `logarithmicDepthFarToNearRatio` adds frustums to remove z-fighting.
  - Source: [Cesium blog: logarithmic depth](https://cesium.com/blog/2018/05/24/logarithmic-depth/)
- **KSP "scaled space" (search summaries):**
  - Planets are drawn at 1/6000 scale with distances scaled the same, by a separate scaled-space camera, "closer than they look, just rendered behind everything".
  - Galaxy and scaled-space cameras rotate but don't translate; local cameras move with the vessel. Layers must be drawn in order by separate cameras.
  - Sources: [KSP forum](https://forum.kerbalspaceprogram.com/topic/66458-question-regarding-quotscaledspacequot-subscenes-in-ksp-in-unity-maybe-the-modders-know); [KSP forum 173808](https://forum.kerbalspaceprogram.com/topic/173808-atmosphere-buggy-in-iva-cameras-ksp-14x-solved)
- **Floating origin / relative-to-eye:** three.js does no explicit precision handling. The usual fixes are rescaling units, keeping the camera near the origin, or per-tile local origins (RTC) — [three.js forum](https://discourse.threejs.org/t/how-does-three-js-deal-with-precision-errors/26344); [Re:Earth high-precision rendering](https://reearth-engineering.pages.dev/posts/high-precision-rendering-en) (search summaries)
- **r167 `RenderPass`** has `clear = true` and `clearDepth = false` flags; with `clearDepth` it calls `renderer.clearDepth()` before rendering — [RenderPass.js](https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/postprocessing/RenderPass.js)
- **r167 `Lensflare` occlusion** — [Lensflare.js](https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/objects/Lensflare.js)
  - It uses two 16×16 `FramebufferTexture`s.
  - Steps: copy the screen region with `copyFramebufferToTexture`, draw a depth-tested quad, copy again to an occlusion map, then restore.
  - The flare vertex shader averages 9 taps of the occlusion map into `vVisibility`.
  - It returns early if the light is behind the camera.
- **Framebuffer copy:** `copyFramebufferToTexture` issues `copyTexSubImage2D` from the currently bound framebuffer. A render target with `samples > 0` (and no multisampled-render-to-texture extension) is rendered into `__webglMultisampledFramebuffer` — [WebGLRenderer.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/WebGLRenderer.js)

### Inferences
**Precision numbers:**
- Float32 has a 24-bit significand. At 1.5×10⁸ (1 AU in km) the spacing is **16 units**; at the orrery's 15 units it is ~10⁻⁶. The current compressed scale has no precision problem. Real scale would, which is why a floating origin matters only if you move to true distances.
- Log depth's relative depth resolution with a 24-bit buffer is Δw/(1+w) ≈ ln2·log₂(far+1)·2⁻²⁴: ≈ 1.0×10⁻⁶ for far = 10⁷, ≈ 1.2×10⁻⁶ for far = 10⁹.
- Standard depth with near 0.1 gives Δz ≈ z²/(near·2²⁴): 0.6 units at z = 1000, ~6000 units at z = 10⁵.

**Recommended layering for r167 (no log depth):**
```js
const farScene = new THREE.Scene(), nearScene = new THREE.Scene();      // sky+sun+planets | ship (+its lights)
const farCam = new THREE.PerspectiveCamera(fov, aspect, 0.5, 5e5);      // scaled-space units
const nearCam = new THREE.PerspectiveCamera(fov, aspect, 0.05, 2000);   // metres around the ship
const farPass = new RenderPass(farScene, farCam);
const nearPass = new RenderPass(nearScene, nearCam); nearPass.clear = false; nearPass.clearDepth = true;
composer.insertPass(farPass, 0); composer.insertPass(nearPass, 1);      // then bloom, grade, OutputPass
function syncCameras(worldPosF64 /* {x,y,z} doubles */) {
  farCam.quaternion.copy(nearCam.quaternion);
  farCam.position.set(worldPosF64.x / K, worldPosF64.y / K, worldPosF64.z / K); // K: scaled-space factor
  // floating origin: the ship scene stays at the origin; far objects are positioned relative to farCam in doubles
}
```
- Each pass keeps early-Z. The ship gets fine depth precision, and planets can be huge and far.
- The Sun `DirectionalLight` and planetshine light live in `nearScene`, with direction computed from far-scene positions.
- Each pass keeps its own frustum near/far. It costs one extra depth clear plus the RenderPass bookkeeping.

**If you still choose log depth:**
- Add `#include <logdepthbuf_pars_vertex>` / `<logdepthbuf_vertex>` / `<logdepthbuf_pars_fragment>` / `<logdepthbuf_fragment>` to every custom shader (planets, atmosphere shells, rings, sky) or they will mis-sort.
- Expect the early-Z loss to hurt most on overdraw: additive star sprites, atmosphere shells, exhaust particles.
- Upgrading to r169+ gives `reverseDepthBuffer: true`, which keeps early-Z, but that changes the r167 target.

**Sun:**
- Real angular radius at 1 AU is 0.2666°. The current orrery gives atan(2.4/15) = 9.09°, **34× too large** (diameter 18.2° → ~370 px at 1080p/50° FOV, versus ~10.8 px real).
- For a photographic look, compute the drawn disk from the *true* angular size: `angR = asin(R_sun_true / d_true)`. Use an HDR radiance, e.g. 2,000–30,000, and **stay below half-float's 65,504 maximum** or bloom produces Inf/NaN blocks.
- Add a camera-facing glare quad (radial `1/(1 + (θ/θ0)²)`-style falloff, sized in degrees) and let bloom do the rest.
- Since the Sun also drives exposure (section 3), stars vanish when it is in frame, as in real photos.

**Occlusion without framebuffer copies:**
```js
// analytic eclipse by a planet: angular radii rs (sun), rp (planet), angular separation d [radians]
function sunVisibility(rs, rp, d) {
  if (d >= rs + rp) return 1;  if (d <= rp - rs) return 0;   if (d <= rs - rp) return 1 - (rp*rp)/(rs*rs);
  const a = rs*rs*Math.acos((d*d + rs*rs - rp*rp) / (2*d*rs));
  const b = rp*rp*Math.acos((d*d + rp*rp - rs*rs) / (2*d*rp));
  const c = 0.5*Math.sqrt((-d+rs+rp)*(d+rs-rp)*(d-rs+rp)*(d+rs+rp));
  return 1 - (a + b - c) / (Math.PI*rs*rs);
}
```
- For the **ship**, attach a `DepthTexture` to the composer's render target and sample ~9 depth taps around the Sun's screen position in the glare/flare shader. Or use the ektogamat raycaster flare from the earlier notes.
- Multiply glare, flare and exposure reporting by the product of the visibilities.
- **Built-in `Lensflare`:** its `copyTexSubImage2D` would read from the composer's multisampled framebuffer, which OpenGL ES 3.0 forbids (INVALID_OPERATION), so expect no flare or GL errors with 4× MSAA. Not tested; confirm in the browser console.

**Impostors** for far planets are covered in the earlier notes. In the two-pass setup they also remove the need for big far planes.

### Gaps
- I found no iGPU measurement of the log-depth penalty for this kind of scene. The reports are anecdotal (fps deltas on unspecified hardware).
- I did not find a three.js GitHub issue confirming the Lensflare + MSAA failure; it is inferred from code plus the GLES spec.
- The Spencer et al. 1995 glare PSF coefficients were not retrieved (Cornell PDF not fetched) — [paper page](https://en-cg-web.coecis.cornell.edu/pubs/1995/SSZG95.html).

## 7. Spaceship lighting: a single Sun DirectionalLight with a tight shadow, no indoor env map, planetshine, PBR that reads as real hardware

### Takeaway
Use one `DirectionalLight` (Sun) whose orthographic shadow camera is fitted to the ship's bounding sphere. On an iGPU, use `PCFShadowMap` at 1024² (17 taps in r167; PCFSoft is 16 taps with manual bilinear weights, so it's no cheaper). Re-render the shadow only when the ship/Sun relation changes (`shadowMap.autoUpdate = false`). Delete `RoomEnvironment` and the camera fill light. Replace them with:
- **planetshine**: a hemisphere or second directional light, colored by the nearby planet, with intensity from albedo × (R/d)² × phase;
- at most a very dim PMREM of the sky panorama, aligned with `scene.environmentRotation`.

Real hardware in sunlight has near-black shadows and bright, slightly rough white paint (AZ-93 absorbs ~15% of sunlight, so albedo is ≈ 0.85).

### Cited Findings
- **r167 shadow types:** `BasicShadowMap = 0`, `PCFShadowMap = 1`, `PCFSoftShadowMap = 2`, `VSMShadowMap = 3` — [constants.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/constants.js)
- **r167 shadow sampling** — [shadowmap_pars_fragment.glsl.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js)
  - Depth is packed in RGBA and compared manually: `step(compare, unpackRGBAToDepth(texture2D(depths, uv)))`. There is no hardware `sampler2DShadow`.
  - PCF = **17** texture fetches per light per fragment; PCFSoft = **16** fetches with manual bilinear weighting; Basic = 1.
  - `getShadow` takes a `shadowIntensity` argument, so r167 has `light.shadow.intensity`.
- **r167 VSM** — [WebGLShadowMap.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/webgl/WebGLShadowMap.js)
  - Each shadow update runs an extra two-pass separable blur, with samples = `shadow.blurSamples` (default 8) and radius = `shadow.radius`.
  - **Receivers are also rendered into the VSM map:** `object.castShadow || (object.receiveShadow && type === VSMShadowMap)`.
  - `renderer.shadowMap.autoUpdate` (default true) and `needsUpdate` control re-rendering.
- **`LightShadow` defaults:** `mapSize 512×512`, `radius 1`, `blurSamples 8`, `intensity 1`, `normalBias 0` — [LightShadow.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/lights/LightShadow.js)
- The **CSM addon** is present in r167 (`examples/jsm/csm/CSM.js`, `CSMShader.js`, …) — [examples/jsm/csm/](https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/csm/)
- `Scene.environmentIntensity` and `Scene.environmentRotation` exist in r167 — [Scene.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/scenes/Scene.js)
- **PMREM sizing:** `fromEquirectangular` uses cubeSize = width/4, and the HalfFloat target is `3·max(cube,112) × 4·cube` — [PMREMGenerator.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/extras/PMREMGenerator.js)
- **AZ-93 white thermal-control paint:** solar absorptance 0.15 ± 0.02, thermal emittance 0.91 ± 0.02 (vendor) — [Modus Advanced](https://www.modusadvanced.com/resources/blog/az-93-white-thermal-control-paint). A NASA document lists ~15% solar absorption and cites NASA RP-1121 — [NTRS 20000109826](https://ntrs.nasa.gov/api/citations/20000109826/downloads/20000109826.pdf) (search summaries).

### Inferences
**Tight Sun shadow (r167):**
```js
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;            // iGPU default; PCFSoft costs about the same
const sun = new THREE.DirectionalLight(0xfff5ea, SUN_INTENSITY);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);                      // 2048 on a "high" tier
const r = shipBoundingSphere.radius * 1.05;
Object.assign(sun.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: 0.01 * r, far: 4 * r });
sun.shadow.camera.updateProjectionMatrix();
sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.01 * r;   // tune per model
scene.add(sun, sun.target);
renderer.shadowMap.autoUpdate = false;
function updateSun(sunDirWorld) {                        // call when ship rotates or sun direction changes
  sun.target.position.copy(ship.position);
  sun.position.copy(ship.position).addScaledVector(sunDirWorld, 2 * r);
  renderer.shadowMap.needsUpdate = true;                 // e.g. throttle to <= 15 Hz during slow drift
}
```
- **Texel density:** a 20 m ship at 1024² gives ~2 cm per texel, enough for panel-scale self-shadowing. Only the ship casts and receives.
- **Why not VSM on an iGPU:** it renders receivers into the map as well, adds two blur passes per update, and light-bleeds.
- **Why not PCFSoft:** it is not cheaper (16 vs 17 fetches) in r167.
- Keep a small `shadow.radius` with PCF for a slightly soft edge. The Sun's 0.53° gives a physically small penumbra (~1 cm per metre of occluder distance), so near-hard shadows are correct.

**Planetshine (cheap, physically scaled):**
```js
// far-field Lambert sphere: E_ps / E_sun ≈ A * (2/3) * (R/d)^2 * Φ(α),  Φ(α) = (sin α + (π-α) cos α) / π
const toShip = _a.copy(ship.position).sub(planet.position); const d = toShip.length(); toShip.divideScalar(d);
const alpha = Math.acos(THREE.MathUtils.clamp(toShip.dot(sunDirFromPlanet), -1, 1));
const phi = (Math.sin(alpha) + (Math.PI - alpha) * Math.cos(alpha)) / Math.PI;
const k = Math.min(0.3, planet.bondAlbedo * (2 / 3) * Math.min(1, (planet.radius / d) ** 2) * phi);
planetLight.color.copy(planet.meanColor);                // e.g. Earth ~#7f9ec4 (blue-white), Mars ~#c08a62
planetLight.intensity = SUN_INTENSITY * k;               // DirectionalLight from the planet (no shadow), or
// HemisphereLight(black, planet.meanColor) with its "sky" axis pointing away from the planet
```
- Example: A = 0.3 at d = 2R on the day side gives k ≈ 0.05, and at d = 1.2R k ≈ 0.14. That is real, colored fill from the planet side, and black on the opposite side.
- **Environment reflections:** physically the sky is ~10⁻⁹ of sunlight, so an environment map should contribute almost nothing.
  - Build one tiny PMREM from a **1024×512** copy of the Milky Way map: cubeSize 256 → a ~6 MiB HalfFloat target, versus 96 MiB from a 4K map and 384 MiB from an 8K map.
  - Set `scene.environment = pmrem.texture; scene.environmentIntensity ≈ 0.01–0.05` (artistic) and `scene.environmentRotation.copy(scene.backgroundRotation)`.
  - Remove `RoomEnvironment`; its bright "windows" in metal are the main "indoor" tell.
  - Remove the camera fill light, or keep it under ~2% for readability in the UI tier only.
- **PBR values that read as flight hardware** (art direction except AZ-93):

  | Surface | baseColor (linear) | metalness | roughness | notes |
  |---|---|---|---|---|
  | White thermal paint (AZ-93-like) | ~0.80 neutral | 0 | 0.55–0.75 | albedo ≈ 1 − 0.15; slight grime variation |
  | MLI blanket (aluminized Kapton, gold/amber) | ~(1.0, 0.75, 0.35) | 1 | 0.25–0.45 | crinkle normal map; the strongest "real spacecraft" cue |
  | Bare/anodized aluminum | ~0.91 neutral | 1 | 0.3–0.5 | anisotropic streaks optional |
  | Solar array | ~(0.02, 0.03, 0.06) | 0 | 0.15–0.25 | add clearcoat 1 for the cover glass; Fresnel sheen at grazing |
  | Black thermal paint / radiators | ~0.03–0.05 | 0 | 0.4–0.6 | keeps silhouettes readable against space |
- **Exposure:** with section 3 metering, a sunlit white hull fills the frame, the exposure drops, and the stars disappear. That matches real photographs of spacecraft in sunlight, where stars are rarely visible (my observation).

### Gaps
- I found no measured shadow-pass cost (ms) on Iris Xe or M1 for 1024² vs 2048² maps.
- No sourced optical values for MLI, Kapton or solar-cell surfaces (only AZ-93); the table rows except AZ-93 are judgment.
- The `CSM` addon's cost wasn't evaluated; a single fitted frustum suffices for one ship.

## 8. Texture delivery: KTX2/Basis in r167 via importmap/CDN, memory budgets, mipmaps, anisotropy, decode time, progressive loading

### Takeaway
KTX2 works in r167 with no bundler:
- `setTranscoderPath()` must point at the *version-matched* `examples/jsm/libs/basis/` folder on jsDelivr. The loader fetches `basis_transcoder.js` and `.wasm` and starts Blob workers (4 by default).
- Call `detectSupport(renderer)` before loading.
- Files must already contain their mipmaps: no runtime generation, and `flipY` is ignored for compressed textures.
- ETC1S picks ETC2, then ETC1, BC7, BC1/3; UASTC picks ASTC, then BC7, ETC2. So on a desktop GPU with BPTC but no ETC2, **ETC1S lands as BC7 (1 byte/pixel), not BC1**.

Biggest budget wins: compress everything (an 8K equirect drops from 171 MiB as RGBA8 to 21–43 MiB), and never let three convert big maps to cubes or PMREMs.

### Cited Findings
- **r167 `KTX2Loader`** — [KTX2Loader.js](https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/loaders/KTX2Loader.js); [WorkerPool.js](https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/utils/WorkerPool.js)
  - Loading: `setTranscoderPath(path)`; `init` loads `basis_transcoder.js` and `basis_transcoder.wasm` with `FileLoader`, builds a Blob worker source and `new Worker(...)`. `setWorkerLimit(num)`; the `WorkerPool` default is `pool = 4`.
  - Feature detection: `detectSupport(renderer)` probes ASTC, ETC1, ETC2, BC (S3TC), BPTC and PVRTC through `renderer.extensions.has('WEBGL_compressed_texture_…')`.
  - Transcode targets (`priorityETC1S` / `priorityUASTC`): ASTC_4x4 (∞ / 1), BC7_M5 (3 / 2), BC1/BC3 (4 / 5), ETC1/ETC2 (1 / 3), ETC1 (2 / 4), PVRTC (5 / 6).
  - Mipmaps: `generateMipmaps = false`; `minFilter = LinearMipmapLinearFilter` only if the file has more than one mip level, otherwise `LinearFilter`.
  - `colorSpace` comes from the DFD transfer function (sRGB or linear; also Display-P3 variants).
  - 6-face containers become a `CompressedCubeTexture`. Uncompressed half-float vkFormats (`R16G16B16A16_SFLOAT` etc.) map to `HalfFloatType`.
  - No UASTC-HDR transcode path appears in r167.
- **`CompressedTexture.flipY = false`** in r167 — [CompressedTexture.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/textures/CompressedTexture.js)
- **r167 HDR-capable loaders:** `EXRLoader`, `RGBELoader`, `HDRCubeTextureLoader`, `LogLuvLoader`, `UltraHDRLoader` (gain-map JPEG) — [examples/jsm/loaders/](https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/loaders/)
- **r167 build:** `build/three.module.js` is a single full build; there is no separate core file. `WebGLRenderer.initTexture(texture)` exists — [build/](https://cdn.jsdelivr.net/npm/three@0.167.1/build/); [WebGLRenderer.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/WebGLRenderer.js)
- **Basis Universal README (search summary):** ETC1S is designed for very fast transcoding, "slightly faster than libjpeg" natively. UASTC LDR→ASTC/BC7 transcoding is particularly fast because UASTC is a common subset of both. I found no per-texture ms figures — [basis_universal README](https://github.com/BinomialLLC/basis_universal)

### Inferences
**Importmap + loader (r167, no build step):**
```html
<script type="importmap">{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.167.1/build/three.module.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/"
}}</script>
<script type="module">
import * as THREE from 'three';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
const ktx2 = new KTX2Loader()
  .setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/libs/basis/') // must match three's version
  .setWorkerLimit(2)                 // fewer workers = less memory/CPU contention on laptops
  .detectSupport(renderer);          // before any load()
const day = await ktx2.loadAsync('tex/earth_day_4k.ktx2');
day.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
renderer.initTexture(day);           // upload now, not on the first visible frame
</script>
```
- **Orientation gotcha:** `flipY` is ignored, so a KTX2 encoded from the same PNG appears vertically flipped versus `TextureLoader`. Encode with a lower-left origin (toktx has a `--lower_left_maps_to_s0t0` option; verify against your toktx version) or flip `v` in the shader.
- Store mipmaps in the file (`--genmipmap` in toktx, `-mipmap` in basisu).

**Encoding presets** (offline; verify flags against `toktx --help`):
- Color maps (day, night, Venus, gas giants, Milky Way): ETC1S at quality ~128–192, or UASTC + RDO for the hero planet and the sky.
- Normal and height maps: UASTC, linear transfer.
- Single-channel data (clouds, ocean mask, ring τ): pack into channels of one texture, as the r168 Earth example packs bump/roughness/clouds.

**GPU memory per equirect** (full mip chain ≈ ×4/3, computed):

| Size | RGBA8 (JPG/PNG) | BC7 / ASTC 4×4 / ETC2-RGBA (1 B/px) | BC1 / ETC1 / ETC2-RGB (0.5 B/px) | RGBA16F (EXR/UltraHDR) |
|---|---|---|---|---|
| 2048×1024 | 10.7 MiB | 2.7 MiB | 1.3 MiB | 21.3 MiB |
| 4096×2048 | 42.7 MiB | 10.7 MiB | 5.3 MiB | 85.3 MiB |
| 8192×4096 | 170.7 MiB | 42.7 MiB | 21.3 MiB | 341.3 MiB |

- **Conversions three does for you, and what they cost:**
  - An equirect as `scene.background` becomes a cube of H²×6: 96 MiB RGBA8 from a 4K map, 384 MiB from an 8K map.
  - `PMREMGenerator.fromEquirectangular(4K)` allocates a 3072×4096 HalfFloat target (96 MiB). From an 8K map it allocates 384 MiB.
  - Both outputs are uncompressed regardless of the source.
- **Suggested laptop budget** (≈ 100 MiB of textures total):
  - Hero Earth at 4K: day + night + packed bump/rough/clouds as ETC1S → BC7/ETC2 at 5–11 MiB each, plus a UASTC normal map at 10.7 MiB.
  - Other planets at 2K (1.3–2.7 MiB each); Saturn ring strip ~32 KB.
  - Milky Way background 4K UASTC at 10.7 MiB, or 8K at 42.7 MiB on "high".
  - Env PMREM from 1024×512 at 6 MiB.
  - Integrated GPUs share system RAM, so this budget directly competes with the browser.
- **Progressive loading:**
  - Ship 512–1K placeholders inline or first.
  - In `requestIdleCallback`, load the 2K/4K KTX2, call `renderer.initTexture(tex)`, swap the material's map, then `dispose()` the placeholder.
  - Load the planet you're flying to first; everything else stays at 1K until visible above ~100 px.
  - Transcoding runs in workers, so the main thread only pays the upload.

### Gaps
- I found no measured Basis transcode times (ms per 2K/4K texture in WASM) or KTX2 upload times on iGPUs.
- Not verified: which compressed-texture extensions Chrome, Safari and Firefox expose on Iris Xe (Windows) and Apple M1/M2 (macOS). That determines whether ETC1S becomes BC7, ETC2 or BC1, so measure with `renderer.extensions.has(...)` on target machines.
- The exact `toktx`/`basisu` flag names were not verified in-session.

## 9. Performance numbers on integrated GPUs (Intel Iris Xe, Apple M1/M2)

### Takeaway
I found **no published ms/frame measurements on Iris Xe or M1/M2** for any of the techniques above in a three.js context. What exists are anecdotes (log depth "10–12 fps drop", bloom on an Intel MacBook, already in `web3d_performance.md` §3), discrete-GPU numbers ("Smaller than Pixels": 50M stars ≈ 8 ms at 4K on an RTX 4070 Super), and the exact per-pixel work verifiable in r167 source. Budget by **(full-screen passes × resolution) + (fragment cost × covered pixels)**, keep early-Z, and measure on the target laptops.

### Cited Findings
- Log depth: one user reported a 10–12 fps drop; another saw "massive overdraw" once early-Z was disabled; the thread advises measuring in ms — [three.js forum](https://discourse.threejs.org/t/beware-of-logarithmic-depth-buffer-it-can-degrade-scene-performance/88495) (search summary)
- "Smaller than Pixels": 50M Gaia stars ≈ 8 ms at 4K on an RTX 4070 Super with their software rasterizer — [EG Digital Library](https://diglib.eg.org/handle/10.2312/egs20251029) (search summary)
- r167 per-pixel work counts:
  - PCF 17 / PCFSoft 16 / Basic 1 shadow fetches per lit fragment; VSM adds a two-pass blur per update and draws receivers into the map — [shadowmap_pars_fragment](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js); [WebGLShadowMap.js](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/webgl/WebGLShadowMap.js)
  - `UnrealBloomPass`: `nMips = 5`, separable blur kernel radii `[3, 5, 7, 9, 11]` (horizontal + vertical per mip) — [UnrealBloomPass.js](https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/postprocessing/UnrealBloomPass.js)
  - `EffectComposer`'s default render target is `HalfFloatType` — [EffectComposer.js](https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/postprocessing/EffectComposer.js)
  - Log depth writes `gl_FragDepth` for every perspective fragment — [logdepthbuf_fragment](https://cdn.jsdelivr.net/npm/three@0.167.1/src/renderers/shaders/ShaderChunk/logdepthbuf_fragment.glsl.js)
- The wwwtyro atmosphere reference costs 144 sample positions and 288 exponentials per pixel — [index.glsl](https://github.com/wwwtyro/glsl-atmosphere/blob/master/index.glsl)

### Inferences
**Cost model per frame at 1080p and DPR 1 (2.07 Mpx).** These are relative units, not measurements.

| Feature | Work | Scales with | Laptop iGPU guidance |
|---|---|---|---|
| Catalog stars (9k, σ 0.65 → ~5×5 sprites) | ~225k fragments, 1 exp each | star count × sprite area | negligible; avoid big `gl_PointSize` for all stars |
| Milky Way custom sky shader | 1 fetch/pixel over the uncovered sky | screen | cheap; cheaper and smaller than the cube conversion |
| Planet surface (textured) | 3–5 fetches + PBR | covered pixels | cheap unless a planet fills the screen |
| Atmosphere shell, current 10×4 | ~100 exp + 11 ray-sphere/pixel | covered pixels | the main shader cost when a planet is large; use a LUT (~20 exp) |
| Ship shadow map 1024², PCF | 1 depth pass over the ship + 17 fetches per lit ship pixel | ship pixels | re-render only on change; 2048² only on "high" |
| 4× MSAA HalfFloat target | 4 samples × 8 B color + depth per pixel, plus resolve | screen | probably the largest fixed bandwidth cost; consider 2× or SMAA on iGPU |
| UnrealBloom at half res | ~12 small passes over the 1/2…1/64 chain | screen | keep half res; raise the threshold |
| OutputPass + grade pass | 2 full-screen passes | screen | merge the grade into one custom output shader |
| Log depth | loses early-Z on everything | overdraw | avoid; use the two-pass layering |

- **Bandwidth arithmetic** (assuming ~60–70 GB/s shared LPDDR4X, typical of Iris Xe/M1 laptops; not verified in-session):
  - One HalfFloat full-screen read + write at 1080p moves ~33 MB, about 0.5 ms if bandwidth-bound.
  - A 4× MSAA HalfFloat color + depth buffer moves ~100 MB per frame before resolve, i.e. ~1.5 ms.
  - So passes and MSAA, not star or ring shaders, dominate a laptop iGPU budget at 30–60 fps (33/16.7 ms frames). Target ≤ 10–12 ms of GPU time at 1080p.
- **Measurement plan:**
  - Run each target laptop with an uncapped loop and DPR 1.
  - Toggle one feature at a time: MSAA 4×/2×/off, bloom, shadows, atmosphere LUT vs march, the 9k stars. Record frame time (ms) via rAF timestamps over 600 frames.
  - Where `EXT_disjoint_timer_query_webgl2` is available, wrap passes in GPU timer queries; its availability per browser was not verified.
  - Check `renderer.info.memory` and the OS GPU-memory view against the texture budget in section 8.

### Gaps
- No Iris Xe or M1/M2 WebGL timings were found for shadows, MSAA, bloom, atmosphere marching, KTX2 transcode or async readback. Every iGPU number above is arithmetic or relative.
- The bandwidth figures for Iris Xe and M1 are assumptions, not verified.
- Browser support for `EXT_disjoint_timer_query_webgl2` on these GPUs was not verified.
