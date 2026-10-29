# Fake vs. Photographed: Visual Tells in Real-Time Space Scenes, Ranked for the Cosmodoro Flight Page

Scope and method. This note builds on `design/research/notes/우주뽀모도로 디자인 개선 방안/space_visual_references.md` and does not repeat it. That file already covers Interstellar's camera-bolted-to-model rule, its measured lens flare and flicker-free rendering, Gravity's LED Light Box hardware, Ad Astra and Dune infrared, The Martian's single-source lighting, and the calm-focus transferability matrix. This session's network policy blocked direct page fetches, so WebFetch could not resolve any external host. **Every finding below therefore comes from search-engine excerpts of the cited pages.** Quoted wording is as it appeared in those excerpts, and attributions I am unsure of are flagged. Numbers marked "computed" are my own arithmetic from standard values:

- Sun radius 695,700 km, Earth 6,371 km, Moon 1,737 km, Mars 3,390 km.
- Jupiter equatorial radius 71,492 km, Saturn 60,268 km, Saturn A-ring outer edge 136,775 km.
- 1 AU = 149.6 million km.

Computed numbers sit under "Inferences". Where a source exists I cross-check against it.

---

## Q1. Light: what does real space lighting look like, and why do studio fills and indoor reflections read as CG?

### Takeaway
Real space light is a single small, hard, parallel key (the Sun) plus at most one bounce. That bounce comes from a nearby planet, takes that planet's colour, and fades with distance. Everything else is black. High-end productions rebuild exactly this: one big source, with LED screens used only to fake Earth's bounce. Their cinematographers and VFX supervisors say outright that multi-source lighting is what makes space look "fake" or "computery or video gamey". Cosmodoro's lighting stack is effectively a 3D product-viewer rig: a point light, an indoor `RoomEnvironment`, a camera-attached fill, no shadow maps and Khronos PBR Neutral tone mapping. This is the largest single source of fakeness.

### Cited Findings
- **Gravity (Tim Webber, VFX supervisor):** "Tricks that you use when you are doing that sort of work on the earth you can't use in space because there is no aerial perspective, there's no depth fading. At the same time there's some very dramatic lighting in space so we made use of that." — [LBB Online, "Your Shot: Gravity"](https://lbbonline.com/news/your-shot-gravity) (page attribution per search excerpt)
- **Gravity's lighting model:** the sun or moon was the hard key for most sequences, and the Earth acted "as a softer bounce card" — [Digital Media World](https://digitalmediaworld.tv/in-depth/dvein-the-vein-magma-2). This comes from a search excerpt. The page slug suggests the excerpt may belong to a different article on the same site. CGW's coverage describes the Light Box simulating the Earth and Sun as the light sources — [CGW, "Gravitational Pull"](https://www.cgw.com/Publications/CGW/2013/Volume-36-Issue-7-Nov-Dec-2013-/Gravitational-Pull.aspx)
- **Gravity's admitted cheat:** Framestore's Mark Bakowski acknowledged that "the light levels are unrealistic at times to enable everyone to see the film's stars," and said compromises are sometimes necessary — [UAL review of Bakowski lecture](https://www.arts.ac.uk/colleges/london-college-of-communication/stories/review-guest-lecture-mark-bakowski-visual-effects-studio-framestore). "Stars" here most likely means the actors. Read it as "fill was cheated on faces", not as a statement about star fields.
- **First Man (DP Linus Sandgren):**
  - His goal was "to light it all with one single source, to create one single shadow". He judged that lighting with multiple sources to cover the area "would, I thought, look fake".
  - The entire Moon set was lit by one lamp, "placed … at the same height as the sun had been during the actual moon landing".
  - It was shot at night in a quarry near Atlanta, with embankments hiding the trees "so we could get from grey to night sky black".
  - Large LED screens simulated "the bounced light that would've come from Earth".
  - Sources: [Filmmaker Magazine](https://filmmakermagazine.com/?p=106187); [American Cinematographer](https://theasc.com/articles/moon-walk-first-man); [Studio Daily](https://www.studiodaily.com/2018/10/cinematographer-linus-sandgren-moon-first-man-damien-chazelle). Reports give the lamp as 100K, 200K or "200,000-watt".
- **First Man (Paul Lambert, DNEG):**
  - A curved LED wall of roughly 35 ft by 60 ft was chosen over green screen because "it's actually lighting the characters".
  - It produced in-camera reflections in visors and eyes, and light on glass dials, which DNEG calls impossible with green screen.
  - The wall needed about 90 minutes of 4K 360° content, built mainly in Terragen.
  - Sources: [Post Magazine](https://postmagazine.com/Press-Center/Daily-News/2019/-I-First-Man-I-VFX-supervisor-Paul-Lambert-discu.aspx); [DNEG](https://dneg.com/first-man-vfx-videos); [Digital Trends](https://digitaltrends.com/movies/first-man-visual-effects)
- **For All Mankind (VFX supervisor Jay Redd):**
  - The lunar set was lit by a single 100K source, with black fabric everywhere because blue or green screen would tint the Moon.
  - 80–90% of visors seen on screen are added after the shot, partly to remove reflections of ceiling light rigs.
  - "It's really easy to make it look computery or video gamey." He takes pride in the stark look of the space scenes "while always walking that fine line".
  - Sources: [Below the Line, May 20 2021](https://www.btlnews.com/?p=98287); [mirror](https://mande.net/btl/awards/for-all-mankind-vfx-jay-redd)
- **The Expanse:** "Considering there's no up in space, the lighting is always tricky." — [3D World via PressReader](https://www.pressreader.com/australia/3d-world/20210223/283162906302874) (short excerpt only)
- **Strength of planetary fill:**
  - Earth's Bond albedo is listed as 0.306, citing NASA's Earth Fact Sheet. A 2024 fact-sheet revision may list about 0.294 (unverified).
  - The full Earth seen from the Moon is more than 50 times brighter than the full Moon seen from Earth; Big Think puts it at about 43 times.
  - Sources: [Wikipedia: Bond albedo](https://en.wikipedia.org/wiki/Bond_albedo); [Wikipedia: Earth phase](https://en.wikipedia.org/wiki/Earth_phase); [Big Think](https://bigthink.com/?p=151561)
- **Perception research (Rademacher, Lengyel, Cutrell, Whitted 2001):**
  - Controlled experiments on why people judge images as photographs or CG. The factors tested were shadow softness, surface smoothness, number of lights, number of objects and shape variety — [Eurographics Digital Library](https://diglib.eg.org/handle/10.2312/EGWR.EGWR01.235-248)
  - A later summary reports a significant correlation between shadow penumbra angle and perceived realism, and a significant effect of surface roughness — [arXiv 2407.01767](https://arxiv.org/html/2407.01767v1)
- **What `RoomEnvironment` is:** "a scene with a basic room setup" that feeds `PMREMGenerator.fromScene`. The implementation is "based on the EnvironmentScene component from the model-viewer project", which is Google's product viewer — [three.js docs: RoomEnvironment](https://threejs.org/docs/pages/RoomEnvironment.html). PMREM is a prefiltered radiance map used for image-based lighting, blurred by material roughness — [three.js docs: PMREMGenerator](https://threejs.org/docs/pages/PMREMGenerator.html)
- **What Khronos PBR Neutral is for:**
  - It was designed for 3D e-commerce, so that "a product's base color, hue, and saturation are accurately reproduced under grayscale lighting".
  - Khronos says filmic tone mapping (ACES, AgX) "should be used in strongly HDR scenes".
  - Sources: [Khronos press release](https://khronos.org/news/press/khronos-pbr-neutral-tone-mapper-released-for-true-to-life-color-rendering-of-3d-products); [model-viewer tone mapping](https://modelviewer.dev/examples/tone-mapping)
  - A practitioner comparison says Neutral "can look flatter or more 'CGI' in some cases" — [Julia Moller blog](https://sites.google.com/view/juliamoller/blog/colour-accuracy)

### Inferences
- **How strong planetary fill really is (computed).** Illuminance from a fully lit planet is about p·(R/d)² of sunlight, where p is geometric albedo (0.30–0.43 for Earth) and d is distance from the planet's centre. The result is in the table below. In interplanetary cruise the fill is effectively zero. At any exposure that holds the sunlit side, the shadow side is black. Gravity's "bounce card" only applies close to Earth.

| Distance from Earth's centre | Earth bounce as a share of sunlight | Stops below the key |
|---|---|---|
| 6,771 km (ISS altitude) | 27–38% | 1.4–1.9 |
| 42,164 km (geostationary) | about 0.7–1% | about 7 |
| 160,000 km (Artemis II "Hello, World" distance) | about 0.05–0.07% | about 11 |
| 384,400 km (Moon's distance) | about 0.01% | about 13 |
| 1 million km | about 0.0015% | about 16 |

- **Why the current rig reads as a product shot.** `RoomEnvironment` wraps the ship in a lit room. It lifts every shadow and places rectangular softbox highlights on glossy hull panels, which are reflections of a room that cannot exist in space. The camera-attached fill is the "on-camera flash" look, which flattens form because the light comes from the viewer's own position. `RoomEnvironment` plus PBR Neutral is exactly the model-viewer and e-commerce default pairing. The ship ends up looking like a configurator render, and the planets inherit the same lifted night sides.
- **No shadow maps removes the main form cue.** Without them there is no ship self-shadowing, no Saturn globe shadow across the rings and no ring shadow on the globe. Rademacher found shadows to be a significant realism factor. In space, shadows and the terminator are almost the only form cues left, because aerial perspective is absent (Webber).
- **The Sun's size breaks the shadows too.** An 18° Sun would physically cast very soft, wide penumbras, like a big softbox. The real Sun (0.53°) casts crisp shadows with a thin penumbra. The oversized Sun is both a scale tell and a lighting tell.
- **Point light versus directional light.** Sunlight is effectively parallel across any frame. A point light at the origin with compressed orbits makes light directions diverge visibly across the frame, and any inverse-square decay has the wrong magnitudes.
  - Real sunlight relative to Earth (computed): Mars 0.43×, Jupiter 1/27, Saturn 1/91. Juno's team cites 25× weaker at Jupiter — [JPL](https://www.jpl.nasa.gov/news/nasas-juno-spacecraft-breaks-solar-power-distance-record).
  - Real cameras re-expose for each target, so Saturn does not look dim in Cassini photos. The cue to get right is the ratio of key to fill, not absolute brightness.
- **The "real looks fake" paradox and how to resolve it.** Rademacher's subjects rated softer penumbrae as more realistic, but those were terrestrial-style scenes. Don't soften the key. Do what Gravity, First Man and For All Mankind did:
  - one hard source;
  - a coloured, motivated bounce only when a planet is near;
  - micro-roughness on materials;
  - filmic highlight roll-off;
  - cheats confined to legibility, as with Bakowski's faces.
- **Fix direction (calm-compatible):**
  - Remove `RoomEnvironment`, or replace it with a custom space environment: black, a tiny very bright sun disc and a dim planet disc.
  - Remove the camera fill and set ambient to about 0.
  - Make the Sun a `DirectionalLight` with a shadow map on the ship, and add analytic ring and globe shadows for Saturn.
  - Add planetshine as a second directional light from the nearby planet, tinted with that planet's colour and scaled by the table above. Near Earth use blue-white; near Mars use butterscotch.
  - Optionally keep a barely perceptible silhouette lift as a documented legibility cheat.

### Gaps
- Primary fxguide, Cinefex and American Cinematographer texts on Gravity's lighting could not be opened. The "softer bounce card" wording has an uncertain page attribution.
- No primary interview was found on space-exterior lighting for The Expanse beyond one line, or for Ad Astra or The Martian beyond what the prior notes contain.
- Rademacher's result for the number of light sources was not recovered.

---

## Q2. Exposure and dynamic range: why do stars vanish next to sunlit objects, and why are "lots of bright stars next to a bright planet" a classic fake tell?

### Takeaway
In real photos and films, any frame that contains a sunlit object has no stars, or only a few of the very brightest. An exposure for a sunlit surface is far too short for starlight. Stars appear only when nothing sunlit is in view: in a planet's shadow, during an eclipse, or with dark-adapted eyes in a dark cabin. A blazing Sun, a sunlit planet and a dense colourful starfield in one frame is the best-known space-photo fake tell. As Phil Plait put it, "If I were trying to fake this, I would put stars in the image."

### Cited Findings
- **Planetary Society (Emily Lakdawalla, January 28 2019):** the worlds are not dark in reality; stars are simply too faint to register when a camera is exposed for a brightly lit subject. Examples include a Bennu MapCam frame with no stars and a 3.84-second Voyager 2 exposure of Proteus. Space images also hold more shadow detail than displays show — [Planetary Society](https://www.planetary.org/articles/why-are-there-no-stars)
- **Phil Plait:** "If I were trying to fake this, I would put stars in the image" — [Space.com](https://www.space.com/846-top-10-apollo-hoax-theories.html). Also "It has nothing to do with the sky being black or the lack of air, it's just a matter of exposure time" — [UVA Magazine](https://uvamagazine.org/articles/lunar_lunacy)
- **Artemis II (April 2026), the newest real reference:**
  - Crew photos show no stars because exposures were set for sunlit Earth, Moon and spacecraft. Longer exposures would overexpose or blur.
  - Christina Koch's April 9 eclipse image, taken with Orion in shadow, does show stars.
  - Sources: [FOX 5 San Diego](https://fox5sandiego.com/news/why-you-cant-see-any-stars-in-photos-from-artemis-ii/amp/); [Political.org (The Hill copy)](https://political.org/2026/04/06/why-you-cant-see-any-stars-in-photos-from-artemis-ii/); [NewSpace Economy](https://newspaceeconomy.ca/2026/04/29/why-arent-any-stars-visible-in-photos-taken-in-space-or-on-the-moon/). All three are secondary; NASA's own text was not retrieved.
- **Apollo, what eyes saw:**
  - Astronauts could see the brighter stars when standing in the Lunar Module's shadow, and saw stars while orbiting the far side — [Phys.org](https://phys.org/news/2017-08-astronauts-stars-space-station.html)
  - Apollo 11, on entering the Moon's shadow: Armstrong describes being able to "clearly see the stars for the first time in the mission". The crew turned off cabin lights to view the corona — [MVAS](https://mvas.org/?p=414)
  - A forum account says the thermal roll periodically bathed every window in sunlight, making dark adaptation hard — [CosmoQuest forum](https://forum.cosmoquest.org/forum/the-proving-grounds/conspiracy-theories/103736-/page8) (low authority)
- **ISS (Don Pettit):** cabin lights and window reflections made star-viewing "close to impossible". He had the cabin dimmed, put a dark shroud over his head against the window, and after about 15 minutes could see stars — [Arizona Daily Wildcat](https://wc.arizona.edu/papers/97/139/01_6.html)
- **The eye:** rods are colour-blind, so low-light scenes look grey, and full dark adaptation takes about 30 minutes — [Photofocus](https://photofocus.com/photography/why-night-photos-have-color-when-we-see-black-and-white/); [KVNF](https://www.kvnf.org/post/western-slope-skies-seeing-dark)
- **How productions handled it:**
  - Gravity built its celestial sphere from a database of about 120,000 of the most visible stars, with real positions and intensities "so the correct constellations were in the correct positions". Gaps were filled with duplicated stars "at lower exposures", up to over 30 million — [Douban repost of "Creating Gravity's Earth, stars, and lens flares"](https://www.douban.com/note/320623382/?type=like)
  - Elite Dangerous: David Braben said the first night-sky render looked far too bright and had to be corrected — [Space.com interview](https://www.space.com/31366-elite-dangerous-stellar-forge-interview.html) (per search excerpt)
  - SpaceEngine's automatic mode sets exposure from the brightness of the central screen area, with a manual mode for correction. The developer wanted faster adaptation after very bright objects — [SpaceEngine: HDR rendering 2](https://spaceengine.org/news/blog170415/); [SpaceEngine: HDR rendering](https://spaceengine.org/news/blog170312/). A community reply says this auto exposure mimics a camera rather than the eye — [Steam discussion](https://steamcommunity.com/app/314650/discussions/0/1639787494972613066/?ctp=2)
  - Apollo 13 (1995): Digital Domain studied all available NASA footage and then recreated it. The goal was for audiences to believe the shots were stock footage — [Digital Domain](https://digitaldomain.com/work/apollo-13/); [befores & afters](https://beforesandafters.com/2020/06/30/the-apollo-13-effects-you-might-not-know-about/)

### Inferences
- **Size of the gap (computed, illustrative).** A "sunny 16" exposure for a sunlit subject (ISO 100, f/16, 1/100 s) against a typical wide-field Milky Way exposure (ISO 1600, f/2.8, 10 s) is about 522,000×, or about 19 stops. This is rough, because stars are point sources. A display plus tone mapping holds perhaps 10–14 stops, so both cannot be shown honestly in one frame.
- **Put each frame in one "exposure world":**
  - *Sunlit world* (the Sun, or a large sunlit body, in frame): black sky, no Milky Way, stars off. A handful of magnitude <1 stars is acceptable as a cheat.
  - *Dark world* (camera facing away from the Sun, nothing large and sunlit in frame, or in a planet's shadow): accurate stars plus a faint Milky Way.
  - Move between them with slow auto-exposure lasting several seconds, as SpaceEngine does. That is also a calm, natural "breathing" event for a focus timer.
- **The current post stack contradicts the sky.** Grain, vignette, chromatic aberration and lens ghosts all say "photographed by a camera". A sky full of stars, galaxies and nebulae beside a blazing 18° Sun says "painted". Viewers who have seen Apollo, ISS or Artemis photos read that contradiction immediately.
- **Viewer split.** Lay viewers may expect stars, while astronomy-literate viewers expect none in sunlit frames. The film compromise, as in Gravity, is a real catalogue at believable brightness, cheated consistently. In practice, most of a cruise can face away from the Sun and show an accurate sky. Departure and arrival frames, where Earth or the destination is sunlit, go starless. The alternation itself signals photographic truth.

### Gaps
- No primary source was found on how Interstellar, The Martian, Ad Astra or First Man graded star visibility in sunlit shots.
- NASA's own Artemis II explanation was not retrieved directly; only secondary coverage was available.

---

## Q3. Scale: what are the real angular sizes, why does a compressed orrery look like a tabletop model, and how do films sell vastness?

### Takeaway
The scene's Sun spans about 18°, against 0.53° in reality: about 34× too wide and about 1,160× too large in area. The orrery layout puts several planets on screen as discs at once, with the ship nearby. No real camera has ever recorded that view; it matches textbook diagrams and tabletop orreries. In space the usual distance cues, aerial perspective and depth fading, are missing (Webber). That leaves angular size, detail density, motion speed and lighting to carry the whole sense of scale. Get those wrong and the scene reads as a miniature.

### Cited Findings
- **The Sun's angular size:**
  - From Earth, about 32′ (0.53°), varying between about 31.5′ and 32.5′ through the year — [IMCCE](https://promenade.imcce.fr/en/pages5/565.html)
  - About 0.35° from Mars, about 0.11° from Jupiter and about 0.057° from Saturn — [ourplnt](https://ourplnt.com/apparent-size-sun-planets)
  - From Saturn, 190.7″–213.2″ — [RASC Calgary](https://calgary.rasc.ca/sun_and_transits.htm)
- **Earth from the Moon:** about 1.9° (1.8–2.0°), roughly four times the Moon seen from Earth (about 0.52°) — [Wikipedia: Earth phase](https://en.wikipedia.org/wiki/Earth_phase)
- **Mars from Earth:** only 3.5″–25.1″ across — [Wikipedia: Angular diameter](https://en.wikipedia.org/wiki/Angular_diameter)
- **Real departing-spacecraft views:**
  - The Blue Marble was taken about 29,000 km from Earth on December 7 1972 — [Wikipedia: The Blue Marble](https://en.wikipedia.org/wiki/The_Blue_Marble)
  - Artemis II's "Hello, World" was taken by Reid Wiseman from an Orion window on April 2 2026, after translunar injection — [CBS News](https://www.cbsnews.com/news/artemis-ii-earth-photo-nasa-reid-wiseman). The crew was about 100,000 miles (160,000 km) out by mid-morning April 3 — [Al Jazeera](https://aljazeera.com/news/2026/4/3/nasa-releases-first-stunning-artemis-ii-photos-of-earth-from-moon-mission)
  - Artemis II later broke Apollo 13's distance record of 400,171 km — [Register-Herald/AP](https://www.register-herald.com/news/nation_world/artemis-ii-breaks-apollo-13-s-distance-record-as-humans-travel-farther-from-earth-than/article_4f5c9351-eb5b-5928-b060-d12a382a565a.html)
- **No aerial perspective in space** (Webber) — [LBB Online](https://lbbonline.com/news/your-shot-gravity)
- **Held, Cooper, O'Brien and Banks 2010** ("Using Blur to Affect Perceived Distance and Size", ACM TOG 29(2)):
  - Blur patterns set perceived scale. Cinematographers make miniatures look life-size with small apertures, and a linear blur gradient (tilt-shift) makes real scenes look miniature.
  - Their model and algorithm agreed with human judgments with "excellent" agreement.
  - Sources: [SIGGRAPH History](https://history.siggraph.org/?p=123134); [eScholarship](https://escholarship.org/uc/item/3ts0x35k)
- **What miniature fakers add:** saturation, about +30, "toy-like" because models are painted bright, plus an S-curve of contrast. High-angle views help the illusion — [Popular Photography](https://www.popphoto.com/tiltshift/); [Unique Photo](https://www.uniquephoto.com/photoinsider/the-art-of-tilt-shift-photography-for-awesome-miniature-effect)
- **Detail density signals size:** "the smaller and more complex the details, the larger the object appears". ILM's "greebles" were used for exactly this — [Wikipedia: Greeble](https://en.wikipedia.org/wiki/Greeble); [99% Invisible](https://99percentinvisible.org/article/interstellar-illusions-greebles-lend-large-sci-fi-structures-a-sense-of-scale/)
- **Big things move slowly:**
  - Miniature frame rate = 24 × √(full size ÷ model size); a 1/48-scale model needs 166 fps — [Cinematography Mailing List](https://cinematography.net/edited-pages/Miniaturesfps.htm)
  - A ¼-scale model is filmed at 2× speed, and water, smoke and fire "do not miniaturize well" — [Kinolab](https://kinolab.org/browseTags.php?id=320)
- **True scale is itself the story:** with Earth the size of a marble, "To Scale: The Solar System" (2015) needed about 7 miles of Nevada desert (1 AU = 176 m). Wylie Overstreet argued that paper depictions distort the scale — [NPR/WUNC](https://www.wunc.org/npr-blogs/2015-09-18/planets-transit-the-desert-in-7-mile-scale-model-of-the-solar-system); [Engadget](https://www.engadget.com/2015/09/17/solar-system-model-desert/)

### Inferences
- **Reference table (computed).** Values are angular diameters measured from the body's centre and agree with the sources above.

| View | Angular size |
|---|---|
| Sun from Earth / Mars / Jupiter / Saturn | 0.53° / 0.35° / 0.10° / 0.056° |
| **Scene's Sun (radius 2.4 at 15 units)** | **about 18°, 34× too wide** |
| Earth from 42,164 km (geostationary) / 100,000 km / 160,000 km | 17.4° / 7.3° / 4.6° |
| Earth from 384,400 km (Moon's distance) / 1 million km / 10 million km / 1 AU | 1.9° / 0.73° / 4.4′ / 18″ |
| Moon from Earth | 0.52° |
| Mars from 100,000 km / 1 million km / 10 million km | 3.9° / 0.39° / 2.3′ |
| Jupiter from 1 million km / 10 million km | 8.2° / 0.82° |
| Saturn from 10 million km (globe / main rings) | 0.69° / 1.57° |

- **The 18° Sun is the most unphotographic single object in the scene.** No real wide or normal frame shows a Sun wider than about 0.5°. A telephoto that magnified it would show it alone against black, and a camera renders it as a blown-out disc with glare and flare. An 18° glowing ball reads as a game skybox or a poster.
- **The orrery layout triggers "model" recognition.** Several discs at once with a nearby ship is the schema of textbook diagrams and orreries that Overstreet calls distorted. The scene also matches the toy cue set from the tilt-shift literature:
  - colour saturation (the destination hue is kept, and noise planets are bright);
  - a high, near vantage point (the chase camera looking across a compact system);
  - surfaces without multi-scale detail (smooth fbm cube maps, no greeble-like structure).
- **Motion also encodes scale.** By the square-root rule, large objects move slowly. Gravity-driven oscillations scale with period: a pendulum's length is L = gT²/4π², and a deep-water wavelength is λ = gT²/2π. Computed:
  - A 2-second sway reads as about 1 m (a hand-held object).
  - A 3-second sway reads as about 2.2 m, like 14 m chop on water: a dinghy.
  - A 10-second sway reads as about 25 m, or a 156 m ocean swell.
  - A ship rolling or bobbing on a period of a few seconds reads as a small boat. Fast-streaming asteroids and dust read as small and near.
- **How to sell vastness without true scale (calm-compatible):**
  1. Show one body as a disc at a time. Other planets are star-like points.
  2. Make the departure planet recede on the real curve: Earth at 17° (geostationary distance), 7.3° (100,000 km), 1.9° (the Moon's distance), then 0.73° (1 million km). Time-compress the cruise with cuts or fades, not by squeezing space.
  3. Keep the destination a point of light until the last minutes, then let it grow.
  4. Cheat the Sun to at most about 1–3° and let veiling glare and flare carry its presence.
  5. Use deep focus, with no depth-of-field blur on planets, and add fine multi-scale surface detail.
  6. Slow everything down. This keeps the "simplify physics for legibility" licence from the prior notes (the Gargantua precedent) while keeping the relationships between cues consistent.

### Gaps
- No study was found that directly tests perceived realism against compressed solar-system scale. The diorama link is inferred from Held et al., tilt-shift practice, and greeble and overcranking craft knowledge.
- No source was found on how particular films chose the Sun's apparent size.

---

## Q4. Sky background: what does the real sky look like from interplanetary space, and why do colourful nebulae and visible spiral galaxies read as fake?

### Takeaway
To the eye and to cameras, the interplanetary sky is black, with about 5,000–9,000 naked-eye stars in fixed, recognisable constellations. Star colours range subtly from orange to blue-white and are never green or purple. The Milky Way is a low-contrast, greyish band with dark dust lanes. Essentially one spiral galaxy is visible in the north (M31, a faint fuzzy oval with no arms; M33 is only marginal), and the two Magellanic Clouds are visible in the south. All of it vanishes whenever the Sun or a sunlit body is in frame (Q2). Colourful nebulae, visible spiral galaxies, diffraction spikes and uniformly random starfields come from long-exposure, false-colour telescope images or game skyboxes, and read as wallpaper or a screensaver.

### Cited Findings
- **Star counts:**
  - 4,850 stars across the whole sky brighter than magnitude 6, and 1,620 brighter than magnitude 5 — [Roach & Gordon via Springer](https://rd.springer.com/chapter/10.1007/978-94-010-2553-9_2)
  - 4,968 brighter than magnitude 6 — [OEIS A053406](https://oeis.org/A053406)
  - About 9,000 (9,096 in the Yale Bright Star Catalogue) to magnitude 6.5 — [Sky & Telescope](https://skyandtelescope.org/astronomy-resources/how-many-stars-night-sky-09172014/) (per search excerpt)
- **Naked-eye galaxies:**
  - The eye's limit is about magnitude 6–6.5, and surface brightness, not just total magnitude, decides whether a diffuse galaxy is visible.
  - The Magellanic Clouds and M31 are the easy naked-eye galaxies. M33 (about magnitude 5.7) is marginal.
  - Sources: [BBC Sky at Night](https://www.skyatnightmagazine.com/guides/patrick-moores-top-5-autumn-galaxies/); [ETSU planetarium, Local Group](https://faculty.etsu.edu/gardnerr/planetarium/mwshow/local.htm) (a summary across several sources whose magnitudes vary)
- **Andromeda's real look:**
  - A "small, faint, fuzzy patch" whose low surface brightness hides its full extent — [APOD 2020-09-25](https://apod.nasa.gov/apod/ap200925.html)
  - To the naked eye it looks "almost identical to a garden-variety, somewhat fuzzy star" — [Snopes](https://www.snopes.com/andromeda-galaxy-moon-photo/)
  - Only a composite of a *deep exposure* of M31 with a normal Moon shows it several times wider than the 0.5° Moon — [APOD 2013-08-01](https://apod.nasa.gov/apod/ap130801.html). It would be about 8× the full Moon "if our eyes were sensitive enough" — [Harvard CfA](https://iya.cfa.harvard.edu/Enlarged_images/andromeda_lp.php)
- **The Milky Way to the eye:**
  - It looks white or grey because rods are colour-blind — [Photofocus](https://photofocus.com/photography/why-night-photos-have-color-when-we-see-black-and-white/)
  - Dark-adapted observers see the galactic centre as "brownish", and dust reddens it — [ClarkVision](https://clarkvision.com/galleries/gallery.night/web/galactic-center-100mm-f2-c06.08.2013.C45I3080-3103.l-1200-sw.html)
  - "Most night sky pictures you see in the web have an artistic color grading, mostly blue" — [pixls.us forum](https://discuss.pixls.us/t/colors-of-the-milkyway/18382)
- **Telescope colours are assigned:**
  - Hubble records monochrome exposures through filters. Colours are added to reveal faint structure, invisible wavelengths and chemistry; the 1995 Cat's Eye colours, for example, were assigned.
  - Sources: [Live Science](https://www.livescience.com/38399-how-hubble-space-telescope-photos-work.html); [Fox News](https://www.foxnews.com/science/what-does-the-hubble-really-see); [CS Monitor](https://features.csmonitor.com/The-Culture/Full-Frame/2015/0624/Galactic-Light-Masters-Photos-from-the-Hubble-Space-Telescope)
- **Star colours:** there are "no yellow, green, cyan, or purple stars", and red dwarfs actually look orange. A simple blackbody approximation is too red for the coolest stars — [Harre & Heller 2021, arXiv](https://arxiv.org/pdf/2101.06254); [Astrobites](https://astrobites.org/2021/01/19/what-colour-are-stars-really/)
- **Diffraction spikes are telescope artifacts:**
  - They come from light diffracting around the secondary-mirror struts and the mirror's edges. Hubble gives a 4-point cross; JWST gives 6 points.
  - Only the brightest stars show them.
  - Sources: [Wikipedia: Diffraction spike](https://en.wikipedia.org/wiki/Diffraction_spike); [NASA/STScI Webb diffraction-spike transcript](https://science.nasa.gov/wp-content/uploads/2023/07/webb-diffractionspikestranscriptstsci-01g77dqfw6pd35sh619tyxt8gt.pdf)
- **Professional practice uses real catalogues:**
  - Gravity: about 120,000 real stars with correct constellations — [Douban repost](https://www.douban.com/note/320623382/?type=like)
  - Elite Dangerous: about 150,000 real catalogue stars (Hipparcos and others) in their correct positions, with Stellar Forge generating the rest — [Perth Observatory](https://perthobservatory.com.au/game-reviews/elite-dangerous). Space.com cites about 160,000 — [Space.com](https://www.space.com/31366-elite-dangerous-stellar-forge-interview.html)

### Inferences
- **Diagnosis of the current sky:**
  - **Seven canvas galaxies 1.3–6.5° wide:** deep-exposure or telescope imagery pasted into what is meant to be a naked-eye sky. The 6.5° size is wider than M31's full long-exposure extent. At most one should be visible, and none with arms.
  - **Purple and teal fbm nebulae:** the Hubble/JWST false-colour palette. No colourful nebula is visible to the eye.
  - **The fbm Milky Way band:** statistically uniform. It lacks dust lanes, star clouds and a brownish-neutral core.
  - **5,600 random stars:** the count is plausible against the 4,850–9,000 naked-eye totals. Random positions, though, erase constellations (an astronomy-literate viewer will notice Orion is missing) and remove the clustering toward the galactic plane.
  - **14 diffraction-spiked stars:** a JWST/Hubble signature that contradicts the film-camera fiction. A camera lens would give aperture starbursts at most, and only on the Sun.
- **Replacement spec:**
  - A real catalogue (for example Yale BSC or HYG) to about magnitude 6.5, roughly 9,000 stars.
  - Stars as 1–2 px points with brightness derived from magnitude.
  - Colour from B–V converted to temperature: orange to pale blue, with no greens or purples.
  - No twinkle.
  - A desaturated, low-contrast Milky Way taken from a real all-sky mosaic.
  - Optionally, M31 as a faint oval about 1–2° across, and the Magellanic Clouds only when the camera faces the southern sky.
  - No nebulae.
  - The whole sky wired to the exposure logic from Q2.
- **The sky never moves on a real cruise (computed).** The nearest star shifts about 0.005″ over 1 million km and about 0.38″ over 0.5 AU. Over a whole session the background is literally a still photograph, which suits a focus timer.

### Gaps
- No numeric source was found for how strongly naked-eye stars concentrate toward the galactic plane. The Magellanic Clouds' angular sizes were not collected.
- Licensing and resolution of real Milky Way panoramas and star catalogues for web use were not researched.

---

## Q5. Surface authenticity: real, recognisable planets versus procedural surfaces; true colour versus oversaturation; uncanny effects

### Takeaway
Earth may be the most widely reproduced photograph ever (the Blue Marble), so a noise-continent Earth is recognised as wrong instantly. Real planets have specific, recognisable configurations and muted true colours: continents under about two-thirds cloud cover, butterscotch Mars, pastel Jupiter, Saturn's structured rings. Most saturated planet images in circulation are deliberately enhanced. Uncanny-valley research suggests "almost-Earth" is worse than either the real Earth or an openly stylised planet. Configural deviations in familiar structures and inconsistent realism both reduce familiarity.

### Cited Findings
- **The Blue Marble:** a NASA archivist suggested it may be the most widely distributed image in history, and it is NASA's most requested picture. That claim is speculative, not a measured ranking — [Wikipedia: The Blue Marble](https://en.wikipedia.org/wiki/The_Blue_Marble); [History of Information](https://www.historyofinformation.com/detail.php?id=3259)
- **Earth's clouds:**
  - About 67% of Earth's surface is typically cloud-covered, based on nearly a decade of satellite data — [NASA, "Cloudy Earth"](https://www.nasa.gov/image-article/cloudy-earth). Earth Observatory says "nearly 70 percent" — [NASA Earth Observatory](https://earthobservatory.nasa.gov/features/CloudsGallery)
  - Less than 10% of ocean sky is completely clear at any one time — [UN-SPIDER](https://www.un-spider.org/news-and-events/news/nasa-satellites-show-earth-cloudy-place)
- **Mars:**
  - "A lot of Mars is actually more of a butterscotch color" — [JPL, "Mars in a Minute"](https://www.jpl.nasa.gov/edu/resources/video/mars-in-a-minute-is-mars-really-red/)
  - It is reddish from a distance because of atmospheric dust, and butterscotch up close — [Wikipedia: Mars surface color](https://www.Wikipedia.com/wiki/Mars_surface_color)
  - NASA's white-balanced Curiosity mosaics deliberately turn the sky blue to simulate Earth lighting — [Discover](https://www.discovermagazine.com/the-sciences/what-color-is-the-red-planet-really)
- **Jupiter:**
  - Popular Juno images "digitally enhanced color saturation and contrast" — [Live Science](https://livescience.com/jupiter-colors-new-images-juno)
  - True-colour versions are "much more muted and pastel", with less sharply delineated features — [Smithsonian](https://www.smithsonianmag.com/smart-news/junos-latest-photo-jupiter-breathtaking-180970792/)
  - Björn Jónsson published paired "approximately true color and contrast" versions — [Planetary Society](https://www.planetary.org/articles/20170327-treasures-from-jupiter)
- **Uncanny research:**
  - MacDorman and Chattopadhyay 2016 (*Cognition* 146; 3 experiments, N = 548): reducing realism consistency made humans and animals, **but not objects**, look eerier and colder. Category ambiguity did not explain the effect — [IUPUI ScholarWorks](https://scholarworks.indianapolis.iu.edu/items/d82b9253-19d7-49a4-87f6-88ea71f80c08/full)
  - Chattopadhyay and MacDorman 2016 (*Journal of Vision*): the effect runs through reduced familiarity — [EVL/UIC](https://www.evl.uic.edu/pubs/2351)
  - Diel and MacDorman: houses with configural deviations, such as inverted windows or doors, were rated more uncanny, extending the effect to familiar non-living structures — [Cardiff ORCA (Diel & MacDorman 2021)](https://orca.cardiff.ac.uk/143339/1/Diel.%20Creepy%20cats%20and%20strange%20high%20houses.pub.pdf); [Cardiff ORCA (architecture paper; exact title unconfirmed)](https://orca.cardiff.ac.uk/151790/8/1-s2.0-S0272494422000895-main.pdf)
- **The realism benchmark is the archive:** Apollo 13's VFX team studied all available NASA footage and recreated it — [befores & afters](https://beforesandafters.com/2020/06/30/the-apollo-13-effects-you-might-not-know-about/)

### Inferences
- **Per-planet diagnosis.** Features marked † are standard planetary-science facts not separately sourced in this pass.
  - **Earth (noise continents)** is the single strongest surface tell. Viewers expect the Earth signature: recognisable continents, about two-thirds cloud cover with weather structure, deep navy oceans with a sun glint†, a thin blue limb haze†, and a terminator slightly softened by the atmosphere†.
  - **Mars (generic rocky noise)** lacks its known albedo features† (Syrtis Major, Valles Marineris, polar cap). It should be butterscotch or ochre at low saturation, not red.
  - **Gas giants (sinusoidal bands)** miss what real belts have: turbulence, festoons and ovals†, plus Jupiter's Great Red Spot†, all in pastel true colour.
  - **Saturn's sine ring** has no distinct rings, gaps or translucency†, such as the Cassini Division, and no shadows. Without shadow maps the scene drops the planet's shadow across the rings and the ring shadow on the globe, which are signature features of Cassini-era imagery†.
- **Fix with the biggest payoff:** real global maps (public NASA/USGS mosaics) for Earth, with a separate cloud layer, and for the Moon, Mars, Jupiter and Saturn, plus a measured radial profile for the rings. Keep procedural noise only as sub-texel detail. Licensing and resolution are not verified here.
- **Saturation:** stay close to true colour at low saturation. Enhanced Juno or Hubble palettes push toward the toy look (the tilt-shift saturation finding in Q3) and contradict the documentary-camera fiction.
- **The nuance in the uncanny research.** MacDorman's eeriness effect did not appear for objects, so planets will not feel "creepy". The mechanism that applies is familiarity and recognition, as the houses study shows: a not-quite-Earth fails recognition and so reads as fake. An openly stylised planet in the style of Outer Wilds would avoid this, but it clashes with photoreal materials and a film grade (Q7).

### Gaps
- No study was found on the perceived realism of procedural versus real planet textures specifically.
- Specific NASA/USGS map products, resolutions and licences for browser use were not verified.

---

## Q6. Motion tells: screensaver starfields, treadmill debris, dense asteroid fields, boat-like wobble, warp streaks

### Takeaway
At interplanetary speeds nothing in a real view visibly moves except the slow growing or shrinking of the nearest body:
- stars are fixed;
- there is no dust to see;
- the asteroid belt averages about 1 million km between objects, and a direct Earth–Mars transfer never reaches it, because the belt lies beyond Mars;
- a spacecraft does not bob or bank, because there is no medium.

Particle streams, asteroid fields, boat-like wobble and warp streaks are recognised game and film shorthand for speed. Their density and periodicity read as a treadmill or a screensaver, especially when sustained for 25–90 minutes.

### Cited Findings
- **The asteroid belt is nearly empty:**
  - Average spacing is about 600,000 miles (965,600 km) — [Universe Today](https://www.universetoday.com/130136/far-asteroid-belt-earth)
  - Lucy "will never have to fire its thrusters to avoid colliding with an asteroid" — [SwRI Lucy: Main Belt Density](https://lucy.swri.edu/MainBeltDensity.html)
  - The main belt lies between Mars and Jupiter, and its total mass is less than the Moon's — [NASA: Asteroids](https://science.nasa.gov/solar-system/asteroids); [JPL education PDF](https://www.jpl.nasa.gov/edu/pdfs/ss_asteroids.pdf)
  - A popular-science outlet titles its piece "The (very weird) way Hollywood keeps lying to us about asteroid belts" — [Science Focus](https://www.sciencefocus.com/space/hollywood-keeps-lying-to-us-about-asteroid-belts) (title only)
- **"Space dust" is a game device:**
  - Players describe it as a device that gives "a sense of speed and direction" — [Frontier forums](https://forums.frontier.co.uk/goto/post?id=726775)
  - Players ask for a visibility setting or removal: "when i see what look like cannon-balls flying by it just grates" — [Frontier forums: More space dust](https://forums.frontier.co.uk/threads/more-space-dust.591200)
  - It goes back to 1984 Elite, where "the stardust is moved towards us according to our speed" — [BBC Elite deep dive](https://www.bbcelite.com/deep_dives/stardust_in_the_front_view.html)
- **Star streaks are shorthand:**
  - At FTL speeds, Doppler shifting would remove the stars altogether — [Space.com](https://www.space.com/19268-star-wars-hyperspace-physics-reality.html); [Gizmodo](https://gizmodo.com/5975682/this-is-what-hyperspace-travel-would-really-look-like)
  - Star Trek: TNG's streaks are rationalised as lit debris, because "even at warp nine, distant stars shouldn't be seen moving" — [TV Tropes: Space Flecks](https://tvtropes.org/pmwiki/pmwiki.php/Main/SpaceFlecks)
- **Spaceships flown like aircraft:**
  - The "Space Is Air" trope exists because audiences know airplanes better than spacecraft — [TV Tropes: Space Is Air](https://tvtropes.org/pmwiki/pmwiki.php/Main/SpaceIsAir)
  - Babylon 5 is cited as a counterexample that avoids banking — [EN World](https://www.enworld.org/posts/9731102/) (per excerpt)
  - The Expanse's showrunner wanted "these ships to move like real ships" — [VFX Voice](https://vfxvoice.com/new-visual-vistas-propel-the-expanse-into-higher-orbit/)
- **"Who is holding the camera" (Battlestar Galactica):**
  - Space camera angles were designed "as if the audience was watching footage from real cameras".
  - The production asked where the camera was and who was holding it.
  - Gary Hutzel described the show's style as "lots of handheld … very first-person".
  - Sources: [Studio Daily](https://studiodaily.com/2006/11/heavy-duty-vfx-management-for-battlestar-galactica); [AWN](https://www.awn.com/vfxworld/battlestar-galactica-re-deux); [Ron Moore essay (forum copy)](https://forum.gateworld.net/sci-fi-and-fantasy-television/battlestar-galactica/30211-ron-moore-s-essay-about-battlestar-galatica-read-this?p=2431772)
- **Periodic camera motion reads as synthetic:**
  - Squirrel Eiserloh's GDC 2016 talk on camera motion recommends Perlin noise — [GDC Vault](https://gdcvault.com/play/1023146/Math-for-Game-Programmers-Juicing)
  - A practitioner: noise is better "because it is not regular, like a sine function" — [three.js forum](https://discourse.threejs.org/t/camera-shake-or-much-damage-such-wow/8963)
  - Unity Cinemachine ships a "Basic Multi Channel Perlin" camera-noise component — [Unity docs](https://docs.unity3d.com/Packages/com.unity.cinemachine@2.8/manual/CinemachineVirtualCameraNoise.html)

### Inferences
- **Stellar parallax (computed):** 0.005″ over 1 million km, so zero visible star motion over any session. Any streaming of stars is fiction.
- **The current debris is three tells at once.** Eighteen asteroids per session plus continuous dust stack a Hollywood asteroid field, an Elite dust stream and repetition into one treadmill. A direct Earth–Mars cruise never enters the main belt, which lies beyond Mars. Constant peripheral motion for 90 minutes also works against the calm-focus goal (inference; no attention study was gathered in this pass).
- **Why the sinusoidal roll and bob fail:**
  - It implies a medium: the "Space Is Air" or ocean trope.
  - Its period sets perceived scale: a few seconds reads as a dinghy (Q3 calculation).
  - A pure sine is perfectly periodic and detectably synthetic.
  - Fix: keep the ship rigid and let only the camera drift, as if a long-lens operator were on a chase craft. Use multi-octave noise with periods of tens of seconds and amplitudes in fractions of a degree. That aligns with the prior notes' camera-bolted-to-the-ship rule.
- **Warp streaks and the field-of-view kick** are fine as a 1–3 second transition (per the prior notes). For a film-like read, frame them as a time-lapse or cut transition rather than a physical phenomenon.
- **Real motion that can carry a 90-minute session calmly:**
  - the receding Earth's slow rotation and creeping terminator;
  - occasional thruster puffs and attitude changes;
  - the Sun's glare sliding as the camera drifts;
  - the destination slowly brightening and growing.

### Gaps
- No source was found on how visible interplanetary dust grains are; this note infers they are invisible.
- No empirical source was gathered on peripheral motion and sustained attention over 25–90 minutes.
- No VFX-supervisor statement specifically against "boat bob" in space was found. The argument rests on trope documentation and on the Battlestar Galactica and Expanse principles.

---

## Q7. Art direction consistency: mixing stylised and photoreal elements, heavy grading (selective colour, grain, chromatic aberration). When does it help, and when does it cheapen the scene?

### Takeaway
Realism comes from one coherent camera and world, not from stacking camera artifacts. The professional examples (Interstellar's measured flare in the prior notes, Gravity's flares shot through real lenses) derive their artifacts from real optics and keep them subordinate. Cosmodoro mixes three visual languages:
- hand-drawn and sine-pattern elements;
- PBR materials under studio lighting;
- a heavy filter stack: hue-selective desaturation, chromatic aberration, ghosts, grain and bloom.

The result reads as "a CG scene with a filter". Selective colour is widely seen as a cliché, chromatic aberration is the most disliked post effect among players, and bloom overuse is the signature of mid-2000s games.

### Cited Findings
- **Gravity's lens flares came from real lenses.** The team shot real lens reactions to direct sunlight as HDRI, for each lens and camera move used on the shoot. They built a tool that turns a 3D locator into a 2D sun and lens flare for a chosen lens — [Douban repost](https://www.douban.com/note/320623382/?type=like)
- **Selective colour:**
  - Justin Solomon calls it "widely considered amateurish and cliché", saying it "always shifts the conversation away from the content and message" — [Don't Take Pictures](https://www.donttakepictures.com/dtp-blog/tag/Justin+Solomon)
  - A defence: no technique is a gimmick by default; the problem is overuse — [Moneymaker Photography](https://moneymakerphotography.com/art-just-gimmick/)
- **Chromatic aberration** "seems to be more universally hated" than lens flare or motion blur — [Evetech](https://evezone.evetech.co.za/quick-bytes/turn-off-film-grain-chromatic-aberration). Cyberpunk 2077 shipped with chromatic aberration, film grain and motion blur on by default, and guides tell players how to turn them off — [GameSpot](https://www.gamespot.com/articles/cyberpunk-2077-has-some-visual-settings-you-might-want-to-change/1100-6485357/). A counterpoint from players: grain hides colour banding in dark areas.
- **Bloom** was popular in 7th-generation games (2005 to the early 2010s), and several were criticised for overusing it — [Wikipedia: Bloom (shader effect)](https://en.wikipedia.org/wiki/Bloom_(shader_effect)). By 2006, players were already calling it artificial — [DVD Talk forum](https://forum.dvdtalk.com/video-game-talk/460170-open-letter-light-bloom-i-hate-you.html)
- **Mixing styles:** combining realistic textures with stylised assets "creates a jarring aesthetic", and hybrid styles need stronger art direction. These are practitioner blogs — [Wayline](https://www.wayline.io/blog/avoid-pitfalls-mixing-game-art-styles); [Juego Studio](https://www.juegostudio.com/blog/art-direction-in-games)
- **Inconsistent realism raises eeriness** for living things — [MacDorman & Chattopadhyay 2016](https://scholarworks.indianapolis.iu.edu/items/d82b9253-19d7-49a4-87f6-88ea71f80c08/full)
- **Tone mapping:** Neutral is meant for e-commerce, and filmic for strongly HDR scenes — [Khronos](https://khronos.org/news/press/khronos-pbr-neutral-tone-mapper-released-for-true-to-life-color-rendering-of-3d-products); Neutral can look "flatter or more 'CGI'" — [Julia Moller](https://sites.google.com/view/juliamoller/blog/colour-accuracy)

### Inferences
- **The scene's three languages, in detail:**
  1. Photographic and PBR: the ship, tone mapping, grain and vignette.
  2. Illustration: canvas galaxies, sine rings and bands, fbm nebulae.
  3. Telescope imagery: diffraction spikes and the Hubble palette.
- **Pick one governing sentence and test every element against it,** for example: *"a documentary camera on a chase craft, one exposure per shot"*. If that camera could not record something in that exposure, cut it.
- **Grade:** replace the hue-keyed selective desaturation with a global, low-saturation filmic grade. Real space is nearly colourless: black sky, white Sun, grey-white hull, near-neutral stars. The destination planet therefore naturally becomes the only saturated object. That meets the prior notes' "colour reserved for the destination planet" intent through content rather than a filter, consistent with the global infrared-plus-colour blends described there. A hue key also desaturates the Sun's glare and every other body unevenly, which breaks the shared-illuminant physics.
- **Post stack spec:**
  - Chromatic aberration off, or at most about 0.5 px at the corners.
  - Lens ghosts only when the Sun is in or near frame, placed along the line through frame centre from a fixed lens model (basic optics, not sourced here).
  - Bloom threshold above scene white, so only the Sun and specular glints bloom.
  - Grain subtle and temporally stable (prior notes); vignette mild.
  - Tone mapping AgX or ACES-style filmic, because Sun-versus-black is the most extreme HDR case there is.
- **Reconciling with the prior notes:** keep the global grade, the physically based lens veil and halation, and short warp transitions. Reject hue-selective desaturation, ghosts with no source, chromatic aberration, and diffraction spikes.

### Gaps
- No controlled study was found on how post-processing stacks affect the perceived realism of CG space; the evidence is practitioner and player opinion.
- No VFX-supervisor statement on selective colour in space films was found.

---

## Q8. Ranking the tells by impact on perceived realism

### Takeaway
Ranked by impact, judged as violation size × screen share and duration × how widely the real look is known:
1. The lighting rig.
2. An exposure-incoherent sky.
3. Scale: the 18° Sun and the orrery.
4. The motion treadmill.
5. Fake planet surfaces.
6. The filter stack.

Items 1–3 are structural, touch every frame, and are cheap to fix in three.js. Fixing them also makes the scene calmer, so realism and the focus-timer goal point the same way.

### Cited Findings (evidence behind the ranking criteria)
- **Single hard source** is the decisive realism choice according to the practitioners who rebuilt space light: Sandgren ("multiple sources … would look fake"), Redd (single 100K source; "computery or video gamey"), and Webber (hard key plus Earth bounce) — [Filmmaker Magazine](https://filmmakermagazine.com/?p=106187); [Below the Line](https://www.btlnews.com/?p=98287); [LBB Online](https://lbbonline.com/news/your-shot-gravity)
- **Shadows and surface roughness** significantly affect realism judgments in controlled experiments — [arXiv summary of Rademacher et al. 2001](https://arxiv.org/html/2407.01767v1)
- **"Stars in a sunlit frame"** is the most discussed fact about space photography, from Apollo to Artemis II (2026) — [Space.com](https://www.space.com/846-top-10-apollo-hoax-theories.html); [Planetary Society](https://www.planetary.org/articles/why-are-there-no-stars); [FOX 5 San Diego](https://fox5sandiego.com/news/why-you-cant-see-any-stars-in-photos-from-artemis-ii/amp/)
- **Earth's real look is among the most familiar images in the world** — [Wikipedia: The Blue Marble](https://en.wikipedia.org/wiki/The_Blue_Marble)
- **The realism benchmark is "indistinguishable from NASA stock footage"** — [befores & afters on Apollo 13](https://beforesandafters.com/2020/06/30/the-apollo-13-effects-you-might-not-know-about/)
- **Dust streams and aircraft-style flight are recognised conventions** — [BBC Elite deep dive](https://www.bbcelite.com/deep_dives/stardust_in_the_front_view.html); [TV Tropes: Space Is Air](https://tvtropes.org/pmwiki/pmwiki.php/Main/SpaceIsAir)
- **Chromatic aberration, bloom and selective colour** are criticised, but the evidence is opinion-level — [Evetech](https://evezone.evetech.co.za/quick-bytes/turn-off-film-grain-chromatic-aberration); [Wikipedia: Bloom](https://en.wikipedia.org/wiki/Bloom_(shader_effect)); [Don't Take Pictures](https://www.donttakepictures.com/dtp-blog/tag/Justin+Solomon)

### Inferences

**Ranked tells for the Cosmodoro flight scene** (my synthesis; no study ranks these against each other):

| Rank | Tell (current scene) | Real reference | Evidence strength | Why this rank | Fix direction (calm-compatible) |
|---|---|---|---|---|---|
| 1 | **Studio lighting:** `RoomEnvironment` (model-viewer room) + camera-attached fill + point light, no shadow maps, PBR Neutral | One hard parallel Sun; shadow sides about 7 stops down at geostationary distance and 13+ stops down beyond the Moon's distance; coloured planetshine only near a planet | High: every top production (Gravity, First Man, For All Mankind) plus Rademacher's shadow finding | Affects every object in every frame and flattens form. It is literally the e-commerce product-viewer pipeline | Directional Sun with shadows; remove room environment and camera fill; ambient about 0; planetshine light scaled by distance; analytic ring shadows; AgX or ACES filmic |
| 2 | **Exposure-incoherent sky:** 5,600 stars, 14 spiked stars, 7 spiral galaxies, coloured nebulae, all visible beside an 18° Sun and sunlit planets | Sunlit frames are starless; dark frames show real constellations, a grey Milky Way, at most M31 as a faint oval | High: NASA and Planetary Society explanations, Artemis II 2026, Plait, Hubble colour practice | The sky is most of the frame for 25–90 minutes; it is the "screensaver/wallpaper" signifier | Real catalogue to magnitude 6.5; remove galaxies, nebulae and spikes; exposure gating with slow auto-exposure |
| 3 | **Scale:** 18° Sun (34× too wide), orrery-compressed orbits with several discs visible, ship nearby | Sun 0.53° (0.35° at Mars); departure Earth recedes (7.3° at 100,000 km, 1.9° at the Moon's distance); destination a point until late | Medium-high: computed geometry, Held et al., tilt-shift and greeble craft | One huge object plus a tabletop layout triggers the model or orrery schema; everyone knows the Sun is small | Sun at most about 1–3° with glare; one disc at a time; real recession curve; time-compress with cuts, not space |
| 4 | **Motion treadmill:** dust plus 18 asteroids the whole cruise, sinusoidal roll and bob, warp streaks, field-of-view kick | Nothing moves; stars fixed (parallax under 0.4″); asteroids about 1 million km apart; no medium, so no bob | Medium-high: NASA and SwRI belt facts, Elite dust history, Space Is Air, Perlin-versus-sine practice | Constant for the whole session; reads as game shorthand and "small boat"; also distracting | Remove dust and asteroids, or make them rare distant events in the real belt; rigid ship with slow noise-driven camera drift; warp only as a short transition |
| 5 | **Fake surfaces:** noise-continent Earth, generic Mars, sine bands and rings, saturated palette | Recognisable continents under about 67% cloud; butterscotch Mars; pastel Jupiter; structured, shadowed rings | Medium-high for Earth (Blue Marble familiarity); medium for the others | Earth appears at session start and is instantly recognised as wrong; other planets are small for most of the cruise | Real global maps plus a cloud layer; true-colour, low-saturation palette; ring radial profile and shadows |
| 6 | **Filter stack:** hue-selective desaturation, chromatic aberration, lens ghosts, heavy bloom, grain | One coherent camera with measured, subtle artifacts | Low-medium: practitioner and player opinion; Gravity and Interstellar show artifacts done properly | Cannot create realism, but adds "cheap filter" signals and contradicts the sky | Global filmic grade; chromatic aberration off; ghosts only from the Sun; bloom above white; subtle grain |

**Diagnostic checklist (pass/fail tests for screenshots).** Real values are computed or sourced above; the thresholds are my recommendations.

- **A. Light**
  - A1. Exactly one hard key, one shadow direction, and one small specular hot spot per glossy surface. Any extra highlight shape, such as a rectangular softbox, fails.
  - A2. Cover the key: in cruise far from planets, shadow and night sides are near-black, about 10+ stops below the lit side. Near Earth, a blue-tinted lift is allowed, strongest in low orbit (about 30%) and about 1% at geostationary distance.
  - A3. The ship self-shadows. Saturn shows the planet's shadow on its rings and the ring shadow on its globe.
  - A4. Terminators are hard on airless bodies and slightly softened by Earth's atmosphere. Night sides show no wrap light.
- **B. Exposure**
  - B1. If the Sun or a sunlit body larger than about 1° is in frame: stars and Milky Way are off, or only a few magnitude <1 stars remain.
  - B2. Stars appear only in dark-dominated frames, faded in over seconds.
  - B3. The Sun is a blown-out, slightly warm white disc with veiling glare and lens-consistent flare, and no surface texture.
- **C. Scale**
  - C1. The Sun is at most about 1–3° (real 0.53° at 1 AU, 0.35° at Mars).
  - C2. At most one or two bodies show as discs. Other planets are points.
  - C3. The departure body recedes on the real curve, and the destination stays point-like until late.
  - C4. No depth-of-field blur on planets, no toy saturation, and detail density matches size.
- **D. Sky**
  - D1. Real constellations, about 5,000–9,000 stars, 1–2 px points, blackbody colours (no green or purple), no twinkle.
  - D2. No diffraction spikes.
  - D3. The Milky Way has real structure, low contrast and near-neutral colour.
  - D4. Galaxies: at most M31 as a faint oval about 1–2° across, plus the Magellanic Clouds if facing south. No nebula colours.
- **E. Surfaces**
  - E1. Earth has real continents, about two-thirds cloud, dark oceans and a thin limb haze.
  - E2. Mars is butterscotch with real features. Jupiter is pastel with real belts. Saturn is pale gold with structured, translucent, shadowed rings.
- **F. Motion**
  - F1. No particles stream past during cruise, and no asteroids outside the real belt.
  - F2. The ship has no periodic bob or bank. Camera drift is noise-based, with periods of tens of seconds and amplitudes in fractions of a degree.
  - F3. Stars are fixed. Planets change size slowly and monotonically.
  - F4. Warp and field-of-view effects only appear in transitions of 3 seconds or less.
- **G. Post**
  - G1. Global grade only, with filmic tone mapping.
  - G2. Chromatic aberration off. Ghosts only with the Sun in or near frame. Bloom only above scene white. Grain subtle and stable. Vignette mild.

**Suggested order of work (impact ÷ effort):**
1. Lighting and tone mapping: mostly deletions plus a directional light and shadows.
2. Exposure gating and sky replacement: delete galaxies, nebulae and spikes, then load a star catalogue.
3. Sun size and one-disc-at-a-time framing.
4. Remove dust and asteroids; replace sine bob with slow noise camera drift.
5. Real planet maps and a ring profile.
6. Trim the post stack.

Steps 1–4 also lower visual stimulation, matching the calm-focus requirement in the prior notes.

**Don't over-correct.** Interstellar's Gargantua shows that legibility cheats are legitimate (prior notes). Acceptable cheats here:
- a Sun of about 1–3°;
- a destination that becomes visible earlier than physics allows;
- a faint silhouette lift so the ship reads on dim displays;
- a few bright stars in near-sunlit frames.

Cheat consistently, and in the direction that NASA photographs and documentary-style films already accept.

### Gaps
- The ranking is a reasoned synthesis. No study measured these tells against each other, and the weights may differ for lay and astronomy-literate viewers. A quick validation would be a 5-second "real or CG?" judgment test with users on before-and-after stills of each fix.
- Evidence quality varies. Lighting and exposure rest on primary practitioner statements and NASA or Planetary Society explanations, read via excerpts. Post-processing rests on opinion-level sources.
- Superseded or volatile items:
  - Earth's albedo in NASA's fact sheet (0.306 against a possible 2024 revision to about 0.294).
  - Elite Dangerous star counts, which vary by source (130k–160k).
  - SpaceEngine's exposure behaviour, described in 2017 posts and possibly changed since.
  - Artemis II (April 2026) is now the most current real-world reference for "stars vanish in sunlit frames".
