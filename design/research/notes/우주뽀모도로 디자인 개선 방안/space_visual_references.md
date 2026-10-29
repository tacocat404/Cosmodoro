# Visual Language of Acclaimed Space Imagery (Film, Games, Web, Posters): Principles for Cosmodoro

Scope note: Cosmodoro has a monochrome film-grain poster main page (big planet, todo list, stats bar) and a Flight page (ship flies Earth to topic planet over 25-90 min, chase camera, optional solar-system overview). The aim here is to pull out specific, transferable techniques. Each finding has a source. Design translations for Cosmodoro are in "Inferences". Research covered about 28 search and fetch calls, so some references (Arrival, Star Citizen, EVE, KSP2, SpaceEngine, SpaceX, Apple, Bruno Simon) are thin or missing. See Gaps.

---

## Q1. Film: what cinematography, lighting and scale techniques convey vastness and calm? (Interstellar, 2001, Gravity, The Martian, Ad Astra, Dune, Arrival)

### Takeaway
The great space films feel grand and calm because they behave like real photography of real objects. The camera is bolted to the craft, there is one hard key light (the sun), lens artifacts are real, motion is slow and deliberate, and silence is used on purpose. Each of them also *simplifies the physics for legibility*. Interstellar, for example, removed Doppler colour from Gargantua because the accurate version was unreadable.

### Cited Findings

**Interstellar (2014): DNEG, New Deal Studios miniatures, Hoyte van Hoytema**
- DNEG built a new relativistic renderer (DNGR) from Kip Thorne's equations because "no existing visual effects software was capable of providing an accurate image of a black hole". Most VFX shots were finished in 65mm IMAX at 5616x4096 — [DNEG Behind the imagery](https://dneg.com/show/interstellar); [AWN](https://www.awn.com/news/interstellar-vfx-team-helps-science-build-better-black-hole)
- **Simplified for legibility:** Nolan and Franklin "chose to omit the Doppler shifts in the movie" because the fully realistic disk was "exceedingly lopsided, with the hole's shadow barely discernible", which was "obviously unacceptable". For visual purposes they slowed the black hole's spin to a/M=0.6, since the high-spin version "would be too confusing for a mass audience". The stated goal was "producing images understandable for a mass audience" — [James, von Tunzelmann, Franklin, Thorne, "Gravitational Lensing by Spinning Black Holes..." (Classical and Quantum Gravity 2015), ar5iv](https://ar5iv.arxiv.org/html/1502.03808)
- **Disk art-directed, not simulated:** the accretion disk was an artist's conception informed by astrophysical images. It is "very anemic", thin, and held at a uniform 4500 K — [same paper](https://ar5iv.arxiv.org/html/1502.03808)
- **Lens flare was added to CG on purpose:** simulated veiling flare, measured from the point-spread function of Nolan's IMAX/65mm lenses, was added "so that computer generated images will have visual continuity with images shot by real cameras" — [same paper](https://ar5iv.arxiv.org/html/1502.03808)
- **Flicker avoided:** ray-bundle propagation with spatial filtering was "crucial for achieving IMAX-quality smoothness without flickering". Temporal filtering made dynamic images "look like they were filmed with a movie camera" — [same paper](https://ar5iv.arxiv.org/html/1502.03808)
- Star fields came from a NASA star catalog and a custom star renderer, then passed into the black-hole renderer so the stars would lens correctly — [DNEG](https://dneg.com/show/interstellar) (via search summary)
- **"Camera attached to the model":** Nolan required that the camera be mounted to the ship, matching live-action shoots where an exterior camera was bolted to the real craft. For the Ranger explosion, New Deal built the "Pelicam", a VistaVision camera in a Pelican case clipped to the exploding model — [fxguide](https://www.fxguide.com/?p=55891)
- **Single-pass lighting:** key, fill, practical and interior lights were shot together in-camera, rather than as separate passes, so "any artifact that would have occurred with real photography" was included. A locked-off key light with a rotating model produced moving shadows that sold the Endurance's spin — [fxguide](https://www.fxguide.com/?p=55891)
- Miniatures were built at 1:1, 1/5 and 1/15 scale. The 14-foot 1/15 Endurance was the main model, and interior figures were added so windows didn't show empty space — [fxguide](https://www.fxguide.com/?p=55891)
- Secondary claim: the miniatures were big enough to mount IMAX cameras on directly, imitating NASA IMAX documentaries — [AnandTech forum post (secondary, unverified)](https://forums.anandtech.com/threads/interstellar.2383278/post-36893143); van Hoytema reportedly drew on NASA footage for authenticity — [colorculture.org (opinion blog)](https://colorculture.org/cinematography-analysis-of-interstellar-in-depth/)
- **Sound:** the sound team under Richard King focused on "what the effects of space has on the environments the characters were in" rather than what space "sounds like", with no "false synth noises, digitalised whooshes and moans" — [The Sound Architect](https://thesoundarchitect.co.uk/?p=3321). Zimmer's score was built on the 1926 Harrison & Harrison organ at London's Temple Church, with sustained organ chords and hushed textures — [Wikipedia: Interstellar (soundtrack)](https://en.wikipedia.org/wiki/Interstellar_(soundtrack)); [Slate](https://www.slate.com/articles/arts/culturebox/2014/11/interstellar_score_hans_zimmer_composes_music_for_the_universe_brilliantly.2.html). Novelist Christopher Priest notes the in-space score is a deliberate, non-realistic choice because a vacuum carries no sound — [Christopher Priest blog](https://www.goodreads.com/author_blog_posts/7387947-the-stars-my-mutteration)

**2001: A Space Odyssey (1968)**
- The space scenes used miniatures and large models built with Douglas Trumbull, filmed with precise lighting and camera movement to suggest immense scale. Complaints about slow pacing at premieres led Kubrick to cut 17 minutes before general release — [NASA History: 50 years ago, 1968 welcomed 2001](https://www.nasa.gov/history/50-years-ago-1968-welcomed-2001/)
- Peer-reviewed analysis treats 2001 as a "slow film" that stretches expressed time in long takes — [Cinergie (Univ. of Bologna)](https://cinergie.unibo.it/article/view/7340)
- The slow, deliberate motion of the models makes them read as monumental — [The Take](https://the-take.com/read/illusions-of-space-travel-in-stanley-kubricks-2001-a-space-odyssey)
- **Stargate (the "warp" reference):** Trumbull developed slit-scan for the Stargate. He moved the slit "outside the camera and [moved] it in three dimensional space", with a narrow slit in front of a backlit glass panel of light patterns. The "mindbender" shot took about 85 passes on one piece of film. The rig was later adapted into a "Jupiter machine" for a believable Jupiter — [Wikipedia: Douglas Trumbull](https://en.wikipedia.org/wiki/Douglas_Trumbull); [The Film Stage interview](https://thefilmstage.com/features/50-years-later-douglas-trumbull-reflects-on-stanley-kubricks-vision-and-the-technological-breakthroughs-of-2001-a-space-odyssey/); [RedShark News](https://www.redsharknews.com/douglas-trumbull-and-how-slit-scan-changed-sfx) (rig dimensions differ between secondary sources)

**Gravity (2013): Lubezki and Cuaron**
- The "Light Box" was about 20x10 ft of 196 LED panels with 4,096 LEDs each (orientation varies by source). Tim Webber compared the LEDs to monitor pixels. It projected Earth and the ISS so the light on actors' faces matched the CG environment — [LEDinside](https://www.ledinside.com/node/19783); [TIME Best Inventions 2013](https://techland.time.com/2013/11/14/the-25-best-inventions-of-the-year-2013/slide/gravitys-lightbox/)
- Light changed with orbital position: cool blue over ocean, warmer desert tones over North Africa. The core problem was that space light is extreme, coming from the sun plus Earth bounce — reported in coverage of Lubezki's work, incl. [American Cinematographer/ASC](https://theasc.com/?p=51143); [Werewolf](https://werewolf.co.nz/2013/11/the-unbeatable-lightness-of-gravity) (the search summary did not pin the exact attribution)
- The opening is one long take of about 13 minutes (one student source says 17). Earth is established before the craft drifts in, and the planet's blue fills the top of the frame like a sky — [AFP via Geo.tv](https://www.geo.tv/latest/63726-in-gravity-a-cinematic-feat-amid-the-cosmos); [Emory film blog](https://scholarblogs.emory.edu/introtofilm2023/?p=576); [BFI Sight & Sound](https://www.bfi.org.uk/sight-and-sound/reviews/film-week-gravity); critics ranked it "alongside anything in 2001" — [CS Monitor](https://m.csmonitor.com/The-Culture/Movies/2013/1004/Gravity-goes-galactic-with-effects)

**The Martian (2015): Dariusz Wolski**
- Red exterior against a cool interior. Wolski made the Hab deliberately cool as "a release from the red" (red reads as hostile, indoors as comforting). Practical fixtures came in two colour temperatures, warm and cold, all on dimmers. Stage earth tones were matched to Wadi Rum, Jordan — [Below the Line](https://www.btlnews.com/awards/contender-cinematographer-dariusz-wolski-the-martian/)
- On the greenscreen stage, Wolski wanted a single light source to keep shadows consistent. NASA photos were used as reference — [fxguide: Life on Mars](https://www.fxguide.com/?p=60903)

**Ad Astra (2019): van Hoytema**
- The moon-rover sequence was shot in Death Valley and the Dumont Dunes with a stereo rig: an infrared-modified ARRI Alexa paired with a film camera. Infrared produced "pure black skies" and very bright, overexposed highlights that turned the desert white and moon-like. Method blended IR luminance with film colour, then added a CG lunar environment — [befores & afters](https://beforesandafters.com/2019/09/30/shooting-in-the-desert-using-infra-red-and-making-a-moon-rover-melee/); [No Film School interview](https://nofilmschool.com/ad-astra-movie-interview); [CGW / Method](https://www.cgw.com/Press-Center/Web-Exclusives/2019/Method-Journeys-to-the-Dark-Side-of-the-Moon-in-.aspx). The rest of the film was shot mostly on 35mm film — [VFX Voice](https://vfxvoice.com/vfx-crews-ship-out-on-space-odyssey-ad-astra/)

**Dune: Part Two (2024): Greig Fraser**
- The Giedi Prime/Harkonnen sequences were shot in infrared rather than plain B&W. IR filters were removed from regular Alexas to get enough camera bodies. Fraser said brightness on set didn't reliably predict how tones would read on screen, and skin flare forced the crew to stop down — [No Film School](https://nofilmschool.com/dune-part-2-infrared); [TheWrap](https://thewrap.com/?p=7673487); [ComingSoon](https://www.comingsoon.net/?p=1717973)
- IMAX large-format capture is credited with the film's expansive scale. Villeneuve wanted "the full immersive experience" — [British Cinematographer](https://britishcinematographer.co.uk/greig-fraser-asc-acs-dune-part-two/)

**Arrival (2016): Bradford Young**
- Only thin confirmation: the look is described as naturalistic, with production design by Patrice Vermette — [ASC tag page](https://theasc.com/articles_tag/patrice-vermette/)

### Inferences (design translations for Cosmodoro)
- **"Camera bolted to the ship" rule for the chase cam.** Interstellar (fxguide) argues for a chase camera rigidly offset from the ship. Use only tiny inertial lag or micro-sway, no free orbiting, no swooping cuts. That produces the documentary calm. Save cinematic moves for session start and arrival.
- **One sun, one hard terminator.** Interstellar, The Martian and Gravity all use a single dominant key. The Flight page should light every planet and the ship from one consistent sun vector, with minimal fill, so the night side goes near-black. On the monochrome poster page that gives the strong crescent and half-lit silhouettes typical of NASA photos.
- **Add camera artifacts to the CG on purpose.** Interstellar's measured lens veiling flare and temporal filtering show the trick. Subtle bloom or veil around the sun, slight halation, film grain and gentle motion blur are what make WebGL read as "photographed", and they fit the existing film-grain look. Avoid crisp aliasing and star twinkle flicker. DNEG worked hard to remove flicker, which suits low-stimulation study.
- **Simplify the physics for legibility.** Gargantua's Doppler removal and slowed spin give license to compress distances, tweak orbits, and enlarge the destination planet so it is readable as a goal from the start.
- **IR / monochrome language fits the existing main page.** Ad Astra and Dune show that infrared gives black skies plus blown-out highlights, which reads as alien and calm. A luminance-only grade with crushed blacks and a soft highlight roll-off can be a "film stock" for both pages. Colour can be added back only for the topic planet, the way Method layered colour onto IR luminance.
- **Light colour drift as a progress signal (Gravity).** Instead of a busy progress bar, let ambient light temperature drift slowly from Earth-blue toward the destination's hue (Mars ochre, Venus pale gold, Neptune cyan) across the 25-90 minutes.
- **Warm/cool "habitat vs. outside" split (The Martian).** Make UI panels (todo, timer) a cool, neutral "habitat" and let the planet carry the exterior colour. That reads as comforting interface against a hostile, grand environment.
- **Slow motion of large objects reads as monumental (2001).** The planet's rotation and approach should be almost imperceptible. Note that even Kubrick got pushback on pacing, but a focus timer *wants* that slowness.
- **Sound: environment, not "space whooshes" (Interstellar).** Use a low cabin hum or room tone, a soft drone or organ-like pad, and silence. No synth whooshes. A hard cut to silence at a key moment (arrival) is a memorable punctuation.
- **Slit-scan Stargate is a transition, not a state.** A warp or streak effect is powerful but highly stimulating. Use it for 1-3 seconds at departure or arrival only.

### Gaps
- No primary-source detail found on Arrival's fog/scale compositions (tiny figures against the monolithic shell) or Dune's composition rules (small human figures in vast frames). Those are common critical observations but were not verified here.
- No primary source confirming Interstellar's "no impossible camera moves" beyond the fxguide description of camera-on-model. No source on Gargantua star-field brightness choices.
- Kubrick-specific details (silence in exterior shots, front projection, 2001's typography and HAL's interface displays) were not researched for lack of budget.
- The Gravity orbital light-colour detail lacked a clearly pinned primary source in the search summary.

---

## Q2. Games: HUD design, cockpit vs. chase camera, planet rendering style, handling "boring travel", UI typography (Elite Dangerous, No Man's Sky, Outer Wilds, Star Citizen, EVE, Starfield, KSP2, SpaceEngine, Mass Effect)

### Takeaway
The most transferable game ideas are: (1) a coherent art-direction "frame" (NMS = 1970s sci-fi paperback cover come to life; Outer Wilds = national-park poster simplicity plus 60s-70s NASA; Starfield = "NASA-punk" tactile hardware); (2) a diegetic or minimal HUD that steps back when nothing needs attention; and (3) the Elite supercruise debate. Long travel makes some players feel the scale of space, while others call it dead time. For a focus timer, the "dead time" *is the product*.

### Cited Findings

**No Man's Sky (Hello Games)**
- Stated goal: "a unique recognisable style… to look like a science fiction book cover come to life" — [No Man's Sky official: The Art of No Man's Sky](https://www.nomanssky.com/2016/04/art-of-no-mans-sky/)
- Art director Grant Duncan credits Chris Foss as a major influence, plus John Harris, Moebius and Ralph McQuarrie — [Wikipedia: Development of No Man's Sky](https://en.wikipedia.org/wiki/Development_of_No_Man%27s_Sky); also Peter Elson — [Black Gate](https://www.blackgate.com/?p=155057)
- The art pipeline mixed hand-made art with procedural algorithms — [Engadget art video](https://www.engadget.com/2016-04-22-no-mans-sky-art-video.html)
- A player opinion holds that the chromatic aberration and scanline-like effects deliberately evoke 60s-70s sci-fi (not a developer statement) — [Steam discussion](https://steamcommunity.com/app/275850/discussions/0/3421062958696192401)

**Outer Wilds (Mobius Digital)**
- The early tagline was "Camping in space": a mix of "rustic backwoods naturalistic environment" and "60s-70s era NASA" — [80.lv](https://80.lv/articles/dissecting-the-art-style-of-outer-wilds/); [Mobius 2015 update](https://www.mobiusdigitalgames.com/news/archives/12-2015)
- The original painterly style (early American plein-air painters) was replaced by "sharp, stylized shapes" and "simplified textures with large-scale gradients" that create "a sense of depth". The final direction took cues from the graphic simplicity of **national park posters**. A major challenge was balancing detail seen on foot with "large-scale vistas seen from space" on "small, spherical planets" — [Mobius Digital: Our New Style (2018)](https://www.mobiusdigitalgames.com/news/our-new-style)

**Starfield (Bethesda): "NASA-Punk"**
- Art director Istvan Pely coined "NASA-Punk" to frame a grounded, relatable sci-fi. The style favours physical, tactile controls over holograms and touchscreens. Lead animator Rick Vicens said the term kept the art team consistent — [VGC](https://www.videogameschronicle.com/news/starfield-developers-discuss-the-games-nasa-punk-aesthetic); [PCGamesN](https://www.pcgamesn.com/starfield/nasa-punk); [Pure Xbox](https://www.purexbox.com/news/2022/02/bethesda-artist-describes-the-aesthetic-of-starfield-as-nasa-punk)
- A third-party (non-Bethesda) "NASA-Punk UI design system" codifies the look as Swiss-grid typography, Kapton-foil textures and light/dark surface modes. It is a community artifact, not official — [MCP Market listing](https://mcpmarket.com/tools/skills/nasa-punk-ui-design-system)
- A community mod notes some in-game textures used default Windows fonts (Calibri, Impact, Verdana) and replaces them with design typefaces — [Nexus Mods](https://nexusmods.com/starfield/mods/4727) (community claim)

**Elite Dangerous (Frontier): HUD and supercruise**
- The centre HUD holds the vital data: throttle, hull/shield display, power distribution, and a small "Mass Locked" indicator that blocks supercruise or jumping. A circular target tracker shows a lit circle when the target is ahead and a greyed one when it is behind — [Prima Games starter guide](https://primagames.com/tips/elite-dangerous-starters-guide-user-interface-tips-training-modules)
- A forum argument holds that Elite's HUD is spread across the physical cockpit rather than floating over the view, which suits immersion (opinion) — [Frontier forums](https://forums.frontier.co.uk/goto/post?id=421369)
- HUD colour themes can be re-tinted by editing GraphicConfiguration.xml, and players tune them for VR legibility — [KeenGamer](https://www.keengamer.com/articles/guides/elite-dangerous-set-up-your-hud-colours-ui-as-you-want/); [Prima Games: HUD colours for Oculus Rift](https://primagames.com/featured/finding-the-optimal-elite-dangerous-hud-colours-for-the-oculus-rift)
- **Supercruise debate:** some players complain about "hour-long" stretches and call a 30-minute run a design problem. Others say long trips "enable them to feel the scale of space". Suggested fixes include deployable nav beacons and an on-board minigame (the 1984 Elite) to pass time. A reviewer called supercruise a way to bridge systems "without becoming a string of warp screens" — [Frontier forums thread](https://forums.frontier.co.uk/goto/post?id=9928882); [Frontier forums: minigame suggestion](https://forums.frontier.co.uk/goto/post?id=7717621); [Engadget 2014](https://www.engadget.com/2014-09-10-choose-my-adventure-i-am-elite-dangerous.html) (these are player suggestions, not Frontier decisions)
- In the related Elite-like Oolite community, the "Dangerous HUD" add-on offers a minimal mode that fades the crosshair and gauges when no alert is active — [Alioth (Oolite) wiki: Dangerous HUD](https://wiki.alioth.net/index.php/Dangerous_HUD). Note this is an Oolite add-on, not an Elite Dangerous feature.

**Mass Effect galaxy map**
- Mass Effect 2's map was praised for showing active mission titles directly on the map. In ME1, players had to cross-reference menus and memorize alien place names — [That Game Sux](https://www.thatgamesux.com/mass-effect-2s-galaxy-map-offers-information-when-you-need-it)
- Mass Effect: Andromeda moved to rendering space around the ship in a 180-degree view through the windshield, departing from the earlier holo-map style — [GameBanshee interview summary](https://gamebanshee.com/k96ay)
- A design analysis exists at [Game Developer: "Mass Effect Galaxy: a design analysis"](https://gamedeveloper.com/design/mass-effect-galaxy-a-design-analysis) (title only; not read)

### Inferences (design translations for Cosmodoro)
- **Pick one art-direction sentence and enforce it** (as "NASA-Punk" did for Starfield). Candidate: *"A 1960s NASA mission film, printed as a national-park poster."* It reconciles the existing monochrome poster page with Outer Wilds-style graphic simplicity and documentary realism.
- **Outer Wilds' "large-scale gradients + sharp silhouettes"** is a cheap, calm WebGL recipe. Planets as smooth gradient spheres with a crisp terminator and rim atmosphere, with low-frequency surface detail only. High-frequency texture is visual noise for someone studying.
- **NMS's saturated paperback-cover palette is too stimulating as a constant state.** It can work as a reward frame on arrival, for example a one-off "cover art" postcard of the destination planet in Foss-like colour.
- **Tactile, not holographic (Starfield).** Timer controls can look like physical switches and engraved labels in a Swiss grid, rather than glowing glass panels. That keeps things calm and readable.
- **Diegetic and auto-receding HUD (Elite/Oolite).** During flight, collapse the HUD to a near-invisible state: thin distance-remaining tick and time remaining in small caps. Bring it back on mouse move or at milestones. Mirror Elite's "target ahead" indicator with a tiny reticle on the destination planet.
- **Reframe "boring travel" as the feature.** Elite players who like supercruise cite the feel of scale. Cosmodoro can add the gentle, non-interactive version of the "nav beacons" idea: passing milestone markers every N minutes (e.g. passing the Moon's orbit, asteroid belt or Jupiter's orbit), not minigames.
- **Mass Effect 2 lesson for the solar-system overview:** show only information relevant now, i.e. the current route, today's sessions and the destination. Don't add a separate menu.

### Gaps
- No sources gathered for Star Citizen (quantum travel visuals, MobiGlas), EVE Online (warp tunnel, minimalist overview UI), Kerbal Space Program 2 (map view, orbital lines), SpaceEngine (scale-accurate rendering, procedural planets), or No Man's Sky's pulse-drive/warp sequences and HUD.
- Elite Dangerous HUD typography and default orange palette were not verified from an official source. Game UI Database pages were not fetched.
- Unverified lead worth checking: Outer Wilds' time loop is commonly cited as 22 minutes, close to one pomodoro. That could be a strong thematic precedent, but it was not confirmed in this session.
- No official Starfield UI typography spec found.

---

## Q3. Websites and interactive: scroll and interaction patterns, typography, motion (NASA Eyes, Solar System Scope, 100,000 Stars, Awwwards/FWA, Lusion, Active Theory, Bruno Simon, SpaceX, Apple)

### Takeaway
The best interactive space pieces use **semantic zoom** (100,000 Stars reveals star names, then the Oort cloud, then orbits, then the Sun as you zoom), a **"control space and time"** metaphor (NASA Eyes), and **endless-journey loops** built from a few repeating geometries (Active Theory v4). Coverage of 2025-2026 Awwwards space sites and of Lusion/Bruno Simon space work was thin in this pass.

### Cited Findings
- **100,000 Stars (Google Data Arts Team, 2012):** zoom reveals the names of prominent nearby stars, then the relative location of the Oort cloud, then planetary orbits, then the Sun. Zooming out gives Milky Way context, explicitly labelled as an artist's rendition (based on NGC 1232). Clicking a star pulls in Wikipedia info and a close-up rendering. It plots 119,617 stars from sources incl. Hipparcos and was built with WebGL, CSS3D and Web Audio. Music by Sam Hulick — [Google Chrome Blog](https://chrome.googleblog.com/2012/11/explore-stellar-neighborhood-with-your.html); [Creative Bloq](https://creativebloq.com/web-design/chrome-experiment-puts-universe-your-hand-11121272)
- **NASA Eyes on the Solar System:** the early version had separate panes to set date/time, encounter speed and rate, media, and illumination. Its premise is "control space and time" — [PCWorld](https://www.pcworld.com/article/495549/control_space_and_time_with_nasas_eyes_on_the_solar_system.html). The Eyes team released a lighter WebGL orrery in 2018 and later a new WebGL engine — [Vatican Observatory](https://www.vaticanobservatory.org/sacred-space-astronomy/nasas-new-web-based-solar-system-orrery). A fully browser-based 3D Eyes launched around 2022 for "anyone with an internet-enabled device", covering 126 missions — [JPL news](https://www.jpl.nasa.gov/news/explore-the-solar-system-with-nasas-new-and-improved-3d-eyes/)
- **Active Theory v4 (Awwwards Site of the Month, Jan 2018):** the homepage is "an endless journey through 5 repeating alley geometries", with work shown on translucent screens — [Awwwards](https://awwwards.com/active-theory-v4-wins-january-2018-site-of-the-month.html). Active Theory v5 is built around real-time environments users toggle between — [Communication Arts](https://www.commarts.com/webpicks/active-theory-1)
- **Lusion:** the studio site won Awwwards Site of the Month (May 2019). The studio describes itself as focused on real-time animations — [Awwwards case study](https://awwwards.com/case-study-for-lusion-by-lusion-winner-of-site-of-the-month-may.html)
- **Scale-cue precedent:** Awwwards lists "If the Moon Were Only 1 Pixel: A tediously accurate map of the solar system" as an inspiration element — [Awwwards](https://www.awwwards.com/inspiration/if-the-moon-were-only-1-pixel-a-tediously-accurate-map-of-the-solar-system). Other space elements catalogued: an interactive Phobos moon element — [Awwwards](https://www.awwwards.com/inspiration/interactive-moon-element-phobos) — and a NASA-themed satellite chronology timeline — [Awwwards](https://www.awwwards.com/inspiration/chronologic-satellite-timeline)

### Inferences (design translations for Cosmodoro)
- **Semantic zoom for the solar-system overview.** Copy 100,000 Stars' discipline: labels appear only at the scale where they matter (planet names at system scale, the ship and route only when zoomed in). Disclose stylization openly, as Google did with "artist's rendition".
- **Time as the primary control.** The NASA Eyes "control space and time" metaphor maps directly onto a focus timer. Session progress *is* the ship's position on the route. The overview can show ship position as a time scrubber (read-only during focus), linking time-on-task to distance covered.
- **Endless-journey loop (Active Theory).** A 90-minute flight can't be authored shot by shot. A few repeating, slowly evolving "environments" (dust lanes, distant Sun glare, planet growing) looped seamlessly give endless travel at low cost.
- **True-scale humour or awe as an optional moment.** The "Moon = 1 pixel" piece shows that honest scale (mostly empty space) is itself a story. It suits a "how far did I travel today" stat (e.g. "You covered 0.3% of the way to Neptune").
- **Ambient score in the browser.** 100,000 Stars paired WebGL with Web Audio and a composed score, showing that music is part of what makes these pieces feel grand.

### Gaps
- No sources found for Solar System Scope's UI, Bruno Simon's work, SpaceX website patterns (large full-bleed video, minimal type), Apple keynote space visuals, or specific 2025-2026 Awwwards/FWA space-themed Sites of the Day (one SOTD, KODE Immersive, May 13 2025, surfaced but its theme was unconfirmed).
- Lusion's and Active Theory's space-specific projects were not located. The Lusion "liquid glass shader" claim came only from an unofficial Dev.to reverse-engineering post, so it is excluded.
- Typography specifics (e.g. what fonts NASA Eyes uses) were not researched.

---

## Q4. Poster and graphic design: NASA/JPL "Visions of the Future", WPA travel posters, Swiss style, film grain and risograph; combining 3D realism with graphic design

### Takeaway
The JPL posters work by applying a *borrowed, nostalgic graphic system* (WPA national-park travel posters) to *science-checked content*. Typography is drawn to evoke the destination (Venus's flowing cloud lettering). Outer Wilds independently reached the same national-park-poster idea for a 3D game, so "3D scene rendered as a flat-graphic travel poster" is a proven bridge.

### Cited Findings
- "Visions of the Future" was made by JPL's The Studio, a team of "designers, artists, makers, strategists, and thinkers". Nine artists made 14 posters after brainstorming sessions with JPL scientists and engineers — [JPL The Studio](https://www.jpl.nasa.gov/thestudio); [Americans for the Arts](https://ww2.americansforthearts.org/local-projects/visions-future-posters); [NASA Space Tourism Posters](https://science.nasa.gov/resource/space-tourism-posters/)
- The series began with exoplanets and expanded to solar-system destinations at the JPL director's suggestion. David Delgado said the team gravitated to WPA national-parks poster style. Illustrator Joby Harris discussed the WPA influence, and the Venus poster's "curvy, flowy" font was meant to evoke clouds — [I'm Just Creative](https://imjustcreative.com/nasa-visions-of-the-future-poster-series/2019/02/20); [Poster Presentations: The Grand Tour](https://posterpresentations.com/nasa-posters-the-grand-tour.html)
- Science informed the imagery. Kepler-186f's red foliage reflects its star's different light spectrum. The Studio sought feedback from JPL scientists throughout. Credits: creative strategy Dan Goods and David Delgado; illustrators Joby Harris, Invisible Creature (Grand Tour, Mars, Enceladus), Jessie Kawata (Venus), Liz Barrios De La Torre, Stefan Bucher, Ron Miller; typography Lois Kim (Venus, Europa) — [Graphic Artists Guild](https://graphicartistsguild.org/space-exploration-posters-courtesy-of-the-jet-propulsion-lab/)
- Dan Goods framed the purpose as celebrating the diversity of planets and sparking curiosity — [Graphic Artists Guild](https://graphicartistsguild.org/space-exploration-posters-courtesy-of-the-jet-propulsion-lab/); [CNN Style](https://amp.cnn.com/cnn/style/article/nasa-design-posters)
- Outer Wilds also moved to "graphic simplicity of national park posters" for a real-time 3D world — [Mobius Digital](https://www.mobiusdigitalgames.com/news/our-new-style)
- No Man's Sky pursued "a science fiction book cover come to life", the 1970s paperback tradition of Chris Foss and others — [nomanssky.com](https://www.nomanssky.com/2016/04/art-of-no-mans-sky/); [Wikipedia](https://en.wikipedia.org/wiki/Development_of_No_Man%27s_Sky)

### Inferences (design translations for Cosmodoro)
- **Per-planet poster lockups.** Each topic planet (Mars, Venus, Saturn, Neptune) gets its own title lettering that evokes the world, as Lois Kim's Venus cloud script did: rust stencil for Mars, flowing script for Venus, wide-tracked geometric caps for Saturn's rings, cool thin serif for Neptune. Keep body UI in one neutral grotesk.
- **"3D realism to poster" pipeline:** render the 3D planet, then posterize luminance into 3-5 tonal bands (Outer Wilds' "large-scale gradients"), add film grain and a slight print misregistration offset for a risograph feel. Then overlay flat typography in a Swiss grid. This keeps the existing monochrome main page and lets the Flight page "become" a poster on arrival.
- **Science credibility as part of the brand.** JPL's posters feel grand partly because scientists vetted them. Small factual captions on each destination poster (distance, day length, temperature) add the same gravitas at near-zero motion cost.
- **Arrival reward = travel poster.** Finishing a session could unlock a WPA-style "Visit Mars" poster card in the stats bar or collection, a calm, collectible reward rather than a flashy animation.

### Gaps
- No sources gathered specifically on Swiss/International Style space posters (e.g. 1960s-70s NASA Graphics Standards Manual "worm" logo, Danne & Blackburn) or risograph aesthetics. These are relevant precedents but unverified here.
- The JPL posters' exact colour palettes and type families were not documented in the sources read.
- No source on how film grain or halftone shaders are implemented on award-winning sites.

---

## Q5. What transfers to a calm focus timer (low motion, long sessions) and what is too stimulating?

### Takeaway
What transfers best is "documentary calm". That means a camera locked to the ship, one sun, slow monumental motion, honest lens artifacts, silence or drones, semantic zoom, and graphic-poster framing. The too-stimulating set is slit-scan warp tunnels, saturated paperback palettes, handheld or tumbling cameras (Gravity's action), frequent cuts, persistent hologram HUDs and twinkling or flickering stars. Those belong only in seconds-long transitions or rewards.

### Cited Findings
- Slow, extended long takes stretch felt time ("slowness") in 2001 — [Cinergie](https://cinergie.unibo.it/article/view/7340); yet early audiences complained enough that Kubrick cut 17 minutes — [NASA History](https://www.nasa.gov/history/50-years-ago-1968-welcomed-2001/)
- DNEG prioritized "IMAX-quality smoothness without flickering" over speed — [ar5iv paper](https://ar5iv.arxiv.org/html/1502.03808)
- Interstellar's sound design avoided synthetic whooshes in favour of environmental effects. Its score uses soft, sustained organ chords — [The Sound Architect](https://thesoundarchitect.co.uk/?p=3321); [Wikipedia](https://en.wikipedia.org/wiki/Interstellar_(soundtrack))
- Elite players split on long travel: "feel the scale of space" against "hour-long stillness" being a design problem — [Frontier forums](https://forums.frontier.co.uk/goto/post?id=9928882)
- A minimal HUD mode that fades elements when no alert is active exists as a community add-on in the Elite-like Oolite — [Alioth wiki](https://wiki.alioth.net/index.php/Dangerous_HUD)
- Starfield's art team preferred tactile physical controls over holograms — [VGC](https://www.videogameschronicle.com/news/starfield-developers-discuss-the-games-nasa-punk-aesthetic)
- The Martian's cool interior was described as "a release from the red", and red reads as hostile — [Below the Line](https://www.btlnews.com/awards/contender-cinematographer-dariusz-wolski-the-martian/)

### Inferences: transferability matrix

| Technique (source) | Calm-focus verdict | How to use in Cosmodoro |
|---|---|---|
| Camera bolted to ship (Interstellar) | **Use: core** | Fixed chase offset, slow inertial lag (seconds), no cuts during focus |
| One hard sun key, dark night side (Interstellar, Martian) | **Use: core** | Single directional light; terminator crescent on every planet; poster-grade contrast |
| Lens veil, halation, film grain, temporal smoothing (Interstellar paper) | **Use** | Static or very slow grain (avoid fast-dancing noise at 60fps; refresh grain at about 12-24fps), soft sun bloom |
| Physics simplified for readability (Gargantua) | **Use** | Compress distances; destination always visible as a small disc that grows |
| Infrared / mono with black skies and blown highlights (Ad Astra, Dune) | **Use** | Global monochrome grade; colour reserved for destination planet |
| Light-temperature drift with orbital position (Gravity) | **Use (slow)** | Hue drifts from Earth-blue to destination hue over the session = ambient progress |
| Warm/cool habitat vs. exterior (Martian) | **Use** | Cool neutral UI panels against coloured planet |
| Slow monumental model motion (2001) | **Use** | Planet rotation and growth almost imperceptible; no bobbing |
| Organ/drone score, no whooshes, strategic silence (Interstellar) | **Use (optional audio)** | Low cabin hum plus pad; hard silence at arrival; mute by default |
| National-park / WPA poster frame (JPL, Outer Wilds) | **Use** | Arrival poster reward; per-planet title lettering |
| Large-scale gradients, sharp silhouettes (Outer Wilds) | **Use** | Cheap, low-noise planet shading |
| Semantic zoom, labels by scale (100,000 Stars) | **Use (overview only)** | Overview opens only on demand; labels appear by zoom level |
| "Control space and time" (NASA Eyes) | **Use (read-only during focus)** | Route as timeline; scrubbing allowed only on break or overview |
| Endless loop of a few repeating environments (Active Theory v4) | **Use** | Seamless loops for 90-min flights |
| Milestones / "nav beacons" (Elite suggestions) | **Use (gentle)** | Passing orbit markers every 5-15 min; silent, no pop-ups |
| Tactile physical-switch UI (Starfield) | **Use** | Engraved-label buttons, Swiss grid; avoid glowing glass |
| Auto-fading HUD (Oolite Dangerous HUD) | **Use** | HUD fades to minimal after a few seconds of no input |
| Gravity's 13-min long take | **Partial** | The *long take* fits; the tumbling, disorienting camera does not |
| Slit-scan Stargate / warp tunnel (2001, games) | **Transition only (1-3 s)** | Departure or arrival flourish; respect prefers-reduced-motion |
| 70s paperback saturated palette (NMS) | **Reward only** | One-off arrival "cover art" postcard |
| Holographic overlays, busy HUD (sci-fi trope; Starfield rejected) | **Avoid during focus** | n/a |
| Flicker, star twinkle, fast particles | **Avoid** | DNEG worked to remove flicker; keep stars static or very slowly parallaxing |
| Interactive minigames during travel (Elite suggestion) | **Avoid** | Breaks focus; the travel *is* the passive ambient state |

### Gaps
- No empirical studies were found in this pass on motion, visual complexity or ambient video and sustained attention or study performance. Claims about stimulation here are design inference, not evidence.
- No sources reviewed on `prefers-reduced-motion` best practices or WebGL battery/thermal cost for 90-minute sessions. These matter for long sessions but were outside this research pass.
