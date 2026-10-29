# UI, Typography & Motion Trends for a Premium, Space-Themed Focus Timer (Cosmodoro, Korean audience, 2025-2026)

Scope note: research done 2026-10-24. Sources are a mix of primary pages (Vercel Geist, Pretendard/SUIT GitHub, NumberFlow docs, MDN, Chrome Developers, web.dev, Webflow/GSAP, Motion docs) and secondary trade press/interviews. Where only third-party or vendor sources were found, this is flagged. "Inferences" are the researcher's design recommendations derived from the findings, not sourced facts.

---

## 1. Sci-fi HUD / FUI design (Territory Studio, Perception, Jayse Hansen, GMUNK): principles for restraint, hierarchy, line weight, motion, and adapting FUI to real usable UI

### Takeaway
The studios agree on one thing: film UI exists to serve the story. Every element should have a job, the styling should filter real content rather than decorate it, and the palette should stay unified enough to read over both dark and bright backdrops. For a real product like Cosmodoro, that becomes a fixed three-tier hierarchy (timer, mission, telemetry), real data in place of fake jargon, and decoration that only appears briefly during transitions.

### Cited Findings
**Territory Studio (David Sheldon-Hicks, Marti Romances; Prometheus, Guardians, Blade Runner 2049, Ad Astra)**
- Sheldon-Hicks frames screen graphics as "supporting rather than hijacking the story". Showy graphics can pull attention away from the narrative, so flair has to earn its screen time. — [Pushing Pixels interview, 2014](https://www.pushing-pixels.org/2014/08/07/the-craft-of-screen-graphics-and-movie-user-interfaces-interview-with-david-sheldon-hicks-of-territory-studio.html)
- Design is content-driven: first work out what content flows through a screen, then apply visual styling as a filter that unifies the look. — [Pushing Pixels interview](https://www.pushing-pixels.org/2014/08/07/the-craft-of-screen-graphics-and-movie-user-interfaces-interview-with-david-sheldon-hicks-of-territory-studio.html)
- Consistency within a system: each set or character can get its own style, but all of them belong to one coherent system (e.g., Prometheus's bridge, medical and social areas). — [Pushing Pixels interview](https://www.pushing-pixels.org/2014/08/07/the-craft-of-screen-graphics-and-movie-user-interfaces-interview-with-david-sheldon-hicks-of-territory-studio.html)
- Screens can carry "history" through wear, scratches and mist (Guardians' glass was worn and misty). A character's temperament and job shape the interface. — [Pushing Pixels interview](https://www.pushing-pixels.org/2014/08/07/the-craft-of-screen-graphics-and-movie-user-interfaces-interview-with-david-sheldon-hicks-of-territory-studio.html)
- Film UI is expected to date, so the goal is to avoid looking boring. Interesting ideas and story points last longer than surface styling. — [Pushing Pixels interview](https://www.pushing-pixels.org/2014/08/07/the-craft-of-screen-graphics-and-movie-user-interfaces-interview-with-david-sheldon-hicks-of-territory-studio.html)
- Sheldon-Hicks says the relationship between people, technology and UI should become more human and emotional. He cites Teenage Engineering devices and the vinyl revival as examples of tangible design he values. — [Pushing Pixels interview](https://www.pushing-pixels.org/2014/08/07/the-craft-of-screen-graphics-and-movie-user-interfaces-interview-with-david-sheldon-hicks-of-territory-studio.html)
- Territory starts every project from scratch with no template, even for familiar cinematic HUDs. Film screen graphics either explain story beats or build the world, while game UI has to work functionally. — [Interface in Game interview](https://interfaceingame.com/articles/interview-with-david-sheldon-hicks); [VFX Voice](https://vfxvoice.com/?p=13143400)
- The Ad Astra brief asked for realistic UIs grounded in military and scientific references, with "the clean minimal look of high-end tech firms". It also asked how to make the screens understandable to a broad audience. — [VFX Voice](https://vfxvoice.com/?p=13143400); [SciFi Interfaces Q&A with Territory](https://scifiinterfaces.com/tag/territory-studio/)

**Jayse Hansen (The Avengers, Iron Man HUDs, Top Gun: Maverick)**
- Everything he designs tells a piece of the story as the director wants it told. Style depends on the production designer and has to read on camera. — [Computer Graphics World profile](https://digital.copcomm.com/i/663385/33)
- Designing for stereo 3D on The Avengers meant keeping everything in focus and readable. Every on-screen element had to serve a function and could not be mere decoration. — [hudsandguis.com: The Avengers](https://www.hudsandguis.com/2013/05/15/the-avengers/)
- His process relies on research, including consulting an A-10 fighter pilot for the Avengers HUDs. — [Loop Insight](https://www.loopinsight.com/2012/06/02/on-designing-user-interfaces-for-the-avengers/); [Pushing Pixels conversation](https://www.pushing-pixels.org/?p=7447)

**GMUNK / Bradley Munkowitz (Oblivion, TRON: Legacy)**
- The Oblivion graphic-language brief stressed functionality and minimalism, with a bright, unified color palette designed to work on both dark and bright backdrops. — [ProVideo Coalition: HUD and GUI graphics in Oblivion](https://www.provideocoalition.com/hud-and-gui-graphics-in-oblivion/); [Motionographer](https://motionographer.com/2013/04/19/bradley-g-munkowitz-oblivion-screen-graphics)
- The "light table" had four purpose-specific screens: a main map tracking Bubbleship, scav and drone positions; a drone monitor for vitals and fuel; a hydro-rig water-collection monitor; and a weather screen. Most visuals were captured in-camera, not added in post. — [ProVideo Coalition](https://www.provideocoalition.com/hud-and-gui-graphics-in-oblivion/); [Renderosity](https://www.renderosity.com/-i-oblivion-i---creating-the-futuristic-visual-effects-for-joseph-kosinskis-latest-film-cms-16717)
- Tooling: Illustrator for design, After Effects for animation, Cinema 4D for 3D elements. — [ProVideo Coalition: C4D](https://www.provideocoalition.com/oblivion-3d-motion-graphics-design-team-innovates-with-maxon-cinema-4d/)
- Process video: [work.gmunk.com](https://work.gmunk.com) (linked from Motionographer, not opened). Montage: [Vimeo: OBLIVION GFX Montage](https://vimeo.com/64377100)

**Perception (Iron Man 2, Black Panther, Marvel; real products for Samsung, Microsoft, Ford, GMC Hummer EV, Audi)**
- Perception uses science fiction "to perceive the world through the lens of what is possible" and turns that into product consulting. Its clients include Samsung, Microsoft, Ford, the GMC Hummer EV interface and Audi. — [School of Motion](https://www.schoolofmotion.com/blog/perception); [Core77](https://www.core77.com/posts/108437/The-Design-Firm-Behind-Those-Futuristic-User-Interfaces-in-the-Marvel-Cinematic-Universe); [Engadget 2015](https://www.engadget.com/2015-12-14-perception-ui-design.html)
- The "science fiction feedback loop": film UI has to look grounded, while tech clients ask for products that look like the movies. — [Core77](https://www.core77.com/posts/108437/The-Design-Firm-Behind-Those-Futuristic-User-Interfaces-in-the-Marvel-Cinematic-Universe)
- Perception's Black Panther vibranium-sand UI work was used as design guidelines for several VFX houses. — [Core77](https://www.core77.com/posts/108437/The-Design-Firm-Behind-Those-Futuristic-User-Interfaces-in-the-Marvel-Cinematic-Universe)
- Further reading: [Pushing Pixels interview with John LePore (Perception)](https://www.pushing-pixels.org/?p=12751); [Pushing Pixels FUI category archive](https://www.pushing-pixels.org/category/fui/page/14); [SciFi Interfaces](https://scifiinterfaces.com/); [hudsandguis.com](https://www.hudsandguis.com/)

### Inferences
- **Map the FUI rules onto Cosmodoro's HUD.**
  - *Story first:* the story is "I am on a mission and focusing", so the timer is the only hero element.
  - *Every element has a function:* replace placeholder telemetry such as fake coordinates or random hex with real session data: elapsed and remaining time, session N of M, today's focus minutes, current streak, distance "travelled", and the next break ETA.
  - *Content-driven styling filter:* one consistent treatment for all data labels, e.g., an uppercase mono label above a numeric value.
- **Fix the hierarchy to three tiers.**
  - T1: timer numerals, one per screen, 15-25vh.
  - T2: mission name and phase in Pretendard or the display face at about 14-16px.
  - T3: telemetry and metadata in mono at 10-11px, uppercase, letter-spacing +0.06 to +0.1em, around 50-60% opacity.
  - Two tiers should never compete in size or brightness.
- **Use three line weights at most.**
  - Hairline rules and grid at 1px (or 0.5px on 2x screens) and roughly 10-20% white alpha.
  - Structural strokes such as the progress track at 1px and roughly 30-40% alpha.
  - The active or progress fill at 2px in the accent color.
  - This follows the "minimalism + one unified palette" brief from Oblivion.
- **Motion budget for calm.** Ambient motion should be slow, low-amplitude and rare: a progress line advancing, a blinking cursor or status dot at 1-2s, and a telemetry value updating once per second without a roll animation. Save the cinematic "boot-up" (lines drawing in, brackets expanding, text scrambling) for state transitions only: session start, break, and complete. This follows the "flair must earn its screen time" principle.
- **Wear and history.** Monochrome film grain plus a very subtle vignette is the web equivalent of Territory's "worn glass". Keep grain static or very slow on the HUD, since animated grain adds motion and CPU cost.
- **Palette rule from Oblivion.** Pick one bright accent hue that holds contrast over both dark space and bright planets or suns in the 3D scene, and use it only for live, active state. Everything else stays white at varying alpha.

### Gaps
- No primary source gave numeric line-weight or type-size rules from these studios; the values above are recommendations.
- Did not open work.gmunk.com or the Territory project pages for Blade Runner 2049 and The Expanse; no sourced detail on The Expanse or Interstellar UI specifically. (Interstellar's screen graphics credits were not verified.)
- The full Jayse Hansen Pushing Pixels interview text was not accessible.

---

## 2. Typography: display/mono faces for numerals and timers, Korean + Latin pairing, licensing, variable font animation

### Takeaway
The strongest free stack for Cosmodoro is Pretendard (Korean, Inter-based Latin) paired with an Inter-family or Geist display face for numerals and Geist Mono or JetBrains Mono for metadata. All of these are OFL or free/open, and all numerals should be set with `font-variant-numeric: tabular-nums`. The trendy paid faces (Söhne Mono, PP Neue Machina, Neue Montreal) need web licenses. Satoshi is free but under a proprietary license with redistribution limits.

### Cited Findings
**Free / open (OFL or equivalent)**
- **Geist / Geist Mono / Geist Pixel (Vercel):** SIL OFL 1.1, free to use, modify and redistribute.
  - Geist Sans and Geist Mono have 9 weights each.
  - Geist Pixel has 5 variants: Square, Grid, Circle, Triangle and Line.
  - Stylistic sets: 9 in Sans, 9 in Mono, 7 in Pixel.
  - 32 languages per family.
  - The release includes OTF, WOFF2 and variable files.
  - — [vercel.com/font](https://vercel.com/font)
- **Pretendard:** SIL OFL; commercial use, modification and redistribution allowed except selling the font alone.
  - Built from Inter (Latin), Source Han Sans (Hangul) and M PLUS 1p (Kana).
  - 9 weights plus a variable font.
  - A "dynamic subset" downloads only the glyphs a page uses, the same approach as Google Fonts' Korean fonts. A variable dynamic subset is also available.
  - Families: Pretendard JP (Japanese and Hanja), Pretendard Std (Latin contexts), Pretendard GOV (public sector).
  - CDN v1.3.9 via jsDelivr, cdnjs or UNPKG. Files: `pretendard-dynamic-subset.min.css`, `pretendardvariable.min.css`. Family names: `Pretendard`, `"Pretendard Variable"`.
  - — [github.com/orioncactus/pretendard](https://github.com/orioncactus/pretendard)
- **SUIT (sun-typeface):** SIL OFL 1.1. A UI body font whose Hangul is based on Source Han Sans (본고딕).
  - Static (OTF/TTF/WOFF2) and Variable (TTF/WOFF2) builds.
  - Install with `npm i @sun-typeface/suit`, or load from jsDelivr as `SUIT.css` or `SUIT-Variable.css`. Family names: `'SUIT'`, `'SUIT Variable'`.
  - — [github.com/sun-typeface/SUIT](https://github.com/sun-typeface/SUIT)
- **Inter 4.0:** the former separate "Inter Display" designs are now an optical-size axis (`opsz`) in the variable font. There are two variable fonts (roman and true italic), each with `wght` and `opsz` axes. Features include contextual alternates, slashed zero and tabular numbers. — [rsms.me/inter](https://rsms.me/inter/); [Inter v4.0 release notes via newreleases.io](https://newreleases.io/project/github/rsms/inter/release/v4.0-beta9f). Note: one review site describes Inter Display as a separate download, so packaging descriptions conflict. — [madegooddesigns.com](https://madegooddesigns.com/inter-font/)
- **JetBrains Mono:** "free & open source".
  - Lowercase height is maximized while character width stays standard, which helps rendering.
  - The zero has a dot inside; the letter O does not.
  - Italics are set at 9°.
  - Multiple weights with matching italics, from Thin upward.
  - Code ligatures can be toggled.
  - — [jetbrains.com/lp/mono](https://www.jetbrains.com/lp/mono/)
- **Spoqa Han Sans Neo:** tagged OFL and commercial-use in a font directory. The older Spoqa Han Sans was OFL 1.1, based on Noto Sans and Lato. Neo's Latin source and weights were not confirmed. — [fontmeme listing](https://fontmeme.com/fontes/listing-spoqa/); [FreshPorts spoqahansans-ttf](https://www.freshports.org/korean/spoqahansans-ttf)

**Free but proprietary**
- **Satoshi (Fontshare / Indian Type Foundry):** ITF Free Font License (FFL), free for personal and commercial use.
  - It is closed-source and not OFL.
  - The license bars distributing or duplicating the fonts, including "uploading them in a public server". The EULA anticipates API delivery from ITF's servers.
  - Verify whether self-hosting WOFF2 in a public repo or CDN is allowed.
  - — [Adom theme LICENSES.md quoting FFL](https://wiki.adom.inc/adom/adom-theme/files/fonts/LICENSES.md); [abduzeedo on Fontshare](https://www.abduzeedo.com/fontshare-free-fonts-100-quality-typefaces-designers); official text at fontshare.com/licenses/itf-ffl (not opened)

**Paid / restricted (flag)**
- **PP Neue Machina (Pangram Pangram):** trial fonts are for personal, non-commercial use only. Commercial web use needs a paid license; third-party figures put Desktop and Web licenses from about $30 per family and App from about $60. These are not from Pangram's own page. — [LicenseOrg guide](https://licenseorg.com/guide/fonts/pangram-pangram); [listicler](https://listicler.com/blog/pangram-pangram-best-free-font-source-indie-designers)
- **Söhne Mono (Klim Type Foundry, 2019):** commercial, 8 weights with italics. Also available through Adobe Fonts (Creative Cloud) and Monotype Fonts subscriptions. Price and tnum details were not found. — [Typewolf](https://typewolf.com/sohne-mono); [maxibestof pairing](https://maxibestof.one/typefaces/sohne/pairing/sohne-mono)

**Numerals in motion**
- NumberFlow's docs recommend `font-variant-numeric: tabular-nums` so every digit has the same width and digits don't shift during transitions. `line-height` controls digit spacing during spin animations. — [number-flow.barvian.me](https://number-flow.barvian.me/)

**Korean line breaking**
- `word-break: keep-all` stops breaks inside Korean eojeol (word units). It pairs well with `text-wrap: balance`; without `keep-all`, `balance` can still pick break points mid-word. — [daleseo.com: 어색하게 끊기는 한국어 줄바꿈 다듬는 법](https://daleseo.com/css-text-wrap/)
- A W3C CSSWG contributor (Jungshik Shin) argued that `keep-all` suits Korean titles, multi-line headings and ad copy, and is the exception rather than the norm for long body text. There is no consensus on making it the default. — [csswg-drafts #4285](https://github.com/w3c/csswg-drafts/issues/4285); [www-style 2015](https://lists.w3.org/Archives/Public/www-style/2015Mar/0062.html)

### Inferences
- **Recommended free stack (Option A, "refined Swiss-NASA", lowest risk):**
  - Timer numerals: Inter Tight, or the Inter 4 variable font with `opsz` at its max display setting, weight 200-300, `tabular-nums`, `letter-spacing: -0.04em`. An ultra-light weight at huge size reads as premium and calm; heavy black numerals read as sporty.
  - Korean UI and body: `"Pretendard Variable"` with the dynamic subset. Its Latin is Inter, so it is metrically and stylistically identical to Inter-family numerals, giving the most seamless KR/EN pairing available.
  - Metadata and telemetry: Geist Mono (OFL, 9 weights, stylistic sets) or keep IBM Plex Mono. Geist Mono looks more contemporary in 2025-2026 dev-tool culture.
  - Stats numbers: keep Archivo Expanded, or switch to Geist at a heavy weight for a single-family system.
- **Option B, "cinematic technical":** Geist Sans plus Geist Mono everywhere Latin appears, with Pretendard for Hangul. Fewer families means stronger cohesion, the FUI "one system" rule.
- **Option C, paid upgrade:** Söhne + Söhne Mono for a Klim/OpenAI-grade editorial feel, or PP Neue Machina for a more "space machine" geometric display. Budget web licenses before committing.
- **Font-stack order for mixed KR/EN strings:** put the Latin display face first, then Pretendard, so numerals and Latin come from the display face and Hangul falls through: `font-family: "Inter Tight", "Pretendard Variable", Pretendard, system-ui, sans-serif;`
- **Korean typographic defaults:**
  - Headings: `word-break: keep-all; text-wrap: balance;`
  - Body: `line-height: 1.6-1.7` (Hangul needs more leading than Latin), letter-spacing around -0.01em at 14-16px and -0.02 to -0.03em for large headings. This is common Pretendard practice but was not sourced here.
  - Avoid positive tracking on Hangul except in tiny uppercase-equivalent labels.
- **Variable-font animation ideas (subtle):**
  - Animate `font-variation-settings: "wght"` from 200 to 300 on the timer at session start, over 600-900ms. It reads as the instrument "powering on".
  - Animate `opsz` on the Inter 4 variable font for size changes between the HUD and fullscreen timer.
  - Keep this off the 1-second tick path; animate only on state changes.
- **Timer specifics:**
  - Set the colon in a lighter weight or lower opacity, and nudge it up with `vertical-align` or `translateY(-0.06em)` to optically center it against lining figures.
  - Consider the slashed zero (`zero` feature) in mono metadata to disambiguate from O.

### Gaps
- Not verified this session, but believed from prior knowledge (check before final): Space Grotesk (Florian Karsten, derived from Space Mono) is OFL on Google Fonts; Inter Tight, Archivo and IBM Plex are OFL on Google Fonts; JetBrains Mono uses OFL 1.1 and ships a variable font; Neue Montreal (Pangram) is paid for commercial use with a personal-use trial. The Google Fonts Space Grotesk page returned no content.
- Could not confirm whether Geist Mono or Inter Tight support `tnum` or slashed-zero toggles (Geist's page doesn't list OpenType features).
- noonnu (눈누) was not searched; no Korean display-font survey beyond Pretendard, SUIT and Spoqa.
- Spoqa Han Sans Neo weights and Latin source are unconfirmed (check github.com/spoqa/spoqa-han-sans).
- Söhne Mono web license pricing was not found.

---

## 3. Motion design: timer digit transitions, countdown/launch choreography, View Transitions API, GSAP vs CSS, easing, reduced motion, micro-interactions, sound

### Takeaway
2025-2026 tooling makes cinematic-but-calm motion cheap to build:
- **NumberFlow:** per-digit rolling numerals with built-in reduced-motion handling and `digits` limits for 59→00 wrap.
- **CSS `linear()`:** spring and bounce easing, supported in all major engines.
- **Same-document View Transitions:** Baseline since October 2025, when Firefox 144 shipped them.
- **GSAP:** now 100% free, including SplitText and MorphSVG.

Calm comes from restraint: slow ease-outs, no overshoot on the timer, motion reserved for state changes, and a crossfade fallback for reduced motion.

### Cited Findings
**Digit transitions: NumberFlow**
- An animated number component that is dependency-free, accessible and customizable. It uses a custom element internally with CSS parts for styling. The site documents the React package `@number-flow/react`. — [number-flow.barvian.me](https://number-flow.barvian.me/)
- Digits spin and other characters fade. There are three timing props, each an `EffectTiming`: `transformTiming` (layout), `spinTiming` (digit spin) and `opacityTiming` (fades). The docs suggest external spring-easing generators for spring motion. — [NumberFlow](https://number-flow.barvian.me/)
- `respectMotionPreference` defaults to `true`. The `useCanAnimate` hook reports whether animation is possible. — [NumberFlow](https://number-flow.barvian.me/)
- The `digits` prop sets a maximum value per digit position, useful for countdowns that wrap 59→00. It is not reactive. Formatting uses `Intl.NumberFormat` options. Non-Latin digits and RTL are unsupported. — [NumberFlow](https://number-flow.barvian.me/)
- `trend`: `+1` always rolls up, `-1` always rolls down, `0` rolls each digit by its own change. The `continuous` plugin makes transitions appear to pass through intermediate numbers. — [NumberFlow](https://number-flow.barvian.me/)
- Ports with tabular-figure and changed-digits-only animation exist for Flutter and React Native. — [flutter_number_flow](https://pub.dev/documentation/flutter_number_flow/latest/); [rn-number-flow](https://cdn.jsdelivr.net/npm/rn-number-flow@0.1.6/README.md)

**View Transitions API**
- Same-document view transitions became **Baseline Newly available** on 2025-10-16, when Firefox 144 shipped. They were part of the Interop 2025 focus area. — [web.dev: same-document view transitions are Baseline](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available); [web.dev: New to the web platform in October 2025](https://web.dev/blog/web-platform-10-2025)
- Chrome shipped cross-document (MPA) view transitions in 2024. Firefox support for cross-document transitions was not confirmed. Element-scoped view transitions are marked not supported in Firefox. — [Chrome: What's new in view transitions (2025)](https://developer.chrome.com/blog/view-transitions-in-2025)

**Easing**
- CSS `linear()` interpolates between many stops, so it can approximate spring and bounce curves. Support: Chrome/Edge 113, Firefox 112, Safari 17.2. Chrome 114+ DevTools has a `linear()` editor. Example: `linear(0, 0.25 75%, 1)`. — [Chrome Developers: CSS linear() easing](https://developer.chrome.com/docs/css-ui/css-linear-easing-function)
- The Linear Easing Generator by Jake Archibald and Adam Argyle converts JS easing functions or SVG curves into `linear()`. Presets include Spring, Bounce, Simple elastic and Material emphasized. — [linear-easing-generator.netlify.app](https://linear-easing-generator.netlify.app/) (via [Chrome Developers](https://developer.chrome.com/docs/css-ui/css-linear-easing-function))
- Material 3 Expressive uses physics springs split into "spatial" and "effects" categories, each with speed variants. A third-party Flutter package lists the expressive default spatial spring as stiffness 380 and damping ratio 0.73, with a "standard" scheme for subtle functional transitions. These are unverified against Google's official spec. — [material_expressive (pub.dev)](https://pub.dev/packages/material_expressive/versions/0.4.0); [motor (pub.dev)](https://pub.dev/documentation/motor/latest/); [m3x (unofficial)](https://github.com/tankrap/m3x)

**GSAP vs Motion vs CSS**
- After Webflow's acquisition, GSAP is 100% free for everyone, including commercial use and the formerly paid Club plugins such as SplitText and MorphSVG. The license is effective 2025-04-30. It still restricts use in no-code animation tools that compete with Webflow. The `gsap-trial` package is deprecated. — [Webflow blog: GSAP becomes free](https://webflow.com/blog/gsap-becomes-free); [GSAP standard license](https://gsap.com/community/standard-license/); [gsap-trial README](https://cdn.jsdelivr.net/npm/gsap-trial@3.13.0/README.md)
- Motion (motion.dev) is MIT-licensed. Its hybrid engine runs on WAAPI/ScrollTimeline, GPU-accelerated for opacity, transform, filter and clip-path, and falls back to rAF; GSAP is rAF-only. Motion's own page claims the mini `animate()` is about 2.5kb and the hybrid about 17kb, versus about 23kb for GSAP core, and says GSAP isn't tree-shakable. These are vendor claims; a third-party site gives similar numbers (2.3/18kb vs 24kb, 45kb+ with plugins). — [motion.dev: GSAP vs Motion](https://motion.dev/docs/gsap-vs-motion); [motion.dev feature comparison](https://motion.dev/guides/feature-comparison); [learnwithhasan comparison](https://learnwithhasan.com/js-libraries/compare/motion-vs-gsap/)
- GSAP's acknowledged strengths are timelines and ScrollTrigger. — [learnwithhasan comparison](https://learnwithhasan.com/js-libraries/compare/motion-vs-gsap/)

**Reduced motion**
- `prefers-reduced-motion` (values `no-preference` and `reduce`) has been Baseline widely available since January 2020. Scaling or panning large objects can trigger vestibular symptoms. MDN's example replaces a scaling `pulse` with an opacity `dissolve`. — [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

**Sound-paired UI**
- Josh Comeau's `use-sound` React hook supports volume, pitch, playback rate, interrupts and sprites. He argues that sound is rare on the web, so tasteful use is impactful and makes products feel tangible. — [joshwcomeau.com: announcing use-sound](https://joshwcomeau.com/react/announcing-use-sound-react-hook/)
- Material sound guidance says to limit decorative sounds to reduce listener fatigue, and that building silence in matters as much as adding sound. — [Material Design 2: Applying sound to UI](https://m2.material.io/design/sound/applying-sound-to-ui.html)
- Practices from community sources: never autoplay without consent, provide mute and volume controls, and give every audio cue a visual equivalent. UIfx was built for fire-and-forget UI sounds as a lighter option than Howler. — [OpenReplay blog](https://blog.openreplay.com/implementing-audio-in-react-websites/); [userinterface-wiki: sounds on the web](https://playbooks.com/skills/raphaelsalaja/userinterface-wiki/sounds-on-the-web)

### Inferences
- **Timer digits.** Use NumberFlow, or a CSS-only roll with each digit in an `overflow:hidden` mask and a `translateY` column, for the seconds digits only.
  - Settings: `trend={-1}` so a countdown always rolls down, `digits={{1:{max:5}}}` for MM:SS wrap, and `spinTiming` around 450-600ms with `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo-like).
  - Avoid overshoot springs on the 1-second tick; they read as playful, not calm.
  - The minute digit roll can be slower (about 800ms) as a "bigger event".
  - Alternative "morph" look: crossfade with a 2-4px vertical offset and a 4px blur-to-sharp (`filter: blur()`), which is GPU-friendly.
- **Launch / countdown choreography (session start, about 3-4s total, skippable):**
  1. T-0.0: the HUD dims to about 30%, grain intensity rises slightly, and the camera eases forward in the 3D scene.
  2. "T-3 / T-2 / T-1": a large ghost numeral at about 8% opacity behind the timer, or a mono label "IGNITION SEQUENCE" with a scrambling-text reveal (GSAP SplitText/ScrambleText, now free). Each beat lasts about 700-800ms with a soft tick sound.
  3. Ignition: hairline brackets draw in with `stroke-dashoffset` over 400ms, and HUD elements stagger in at 40-60ms intervals (meta top-left, then telemetry top-right, then progress line, then timer last, as the hero).
  4. The timer's weight goes from 200 to 300 (variable font) and the progress line begins.
  5. Reduced motion: replace all of the above with a 200ms crossfade and no camera move.
- **Choosing a tool.** CSS plus WAAPI (or Motion at about 2.5-17kb) is enough for HUD micro-motion. Use GSAP timelines only for the launch and arrival sequences, where sequencing, labels and SplitText or ScrambleText pay off. Because GSAP is now free, there is no licensing reason to avoid it.
- **View Transitions.**
  - Use same-document `document.startViewTransition()` for main page ↔ flight HUD if they share a document, morphing the timer element (`view-transition-name: timer`) from the poster layout into the HUD bottom-left. This is the single most "cinematic" low-effort win.
  - Feature-detect and fall back to an instant swap.
  - For multi-page builds, cross-document `@view-transition { navigation: auto; }` works in Chromium; Firefox support is unconfirmed.
- **Easing palette, 3-4 tokens only:**
  - `--ease-out: cubic-bezier(0.16,1,0.3,1)` for entrances.
  - `--ease-in-out: cubic-bezier(0.65,0,0.35,1)` for camera and large moves.
  - `--ease-in: cubic-bezier(0.7,0,0.84,0)` for exits, kept short (150-250ms).
  - An optional `linear()` gentle spring with damping of about 0.8-0.9 (low bounce) for toggles and checkboxes only.
  - Durations: micro 120-200ms, UI 250-400ms, scene 600-1200ms.
- **Micro-interactions:**
  - Checkbox (task done): stroke-draw checkmark over 250ms, a 1px ring that expands and fades over 400ms, and an optional soft "blip".
  - Hover: brighten the hairline from 15% to 40% alpha and nudge the mono label +2px. No scale-up on HUD elements.
  - Buttons: `:active` translateY(1px), no bounce.
- **Sound.**
  - Off by default, or ask once at first launch; one volume slider plus mute.
  - Use 3-5 sounds total: a session start "ignition" swell, a soft tick only during the T-3 countdown, break start, session complete chime, and an optional UI blip.
  - No sound on every second. Every sound mirrors a visual event (Material: "limit decorative sound").
  - Respect `prefers-reduced-motion` for motion only; sound has its own toggle.

### Gaps
- Did not verify NumberFlow's license or its Vue, Svelte and vanilla packages. The docs page fetched showed only React. Prior knowledge suggests it is MIT, with `@number-flow/vue`, `@number-flow/svelte` and a vanilla `number-flow` package; verify on GitHub.
- Firefox cross-document view transition support is unconfirmed (check the MDN compatibility table).
- Official Material 3 Expressive spring values and Apple HIG motion guidance were not retrieved.
- No sourced benchmark comparing GSAP and Motion performance.

---

## 4. Layout & color trends (Awwwards/Godly/Dribbble 2025-2026): glassmorphism vs dark editorial, grain/noise, bento grids, stats data viz, category accent systems

### Takeaway
The 2025-2026 trend reporting favors editorial type contrast (oversized display over small supporting text) and dark, OLED-friendly surfaces. Apple's Liquid Glass (iOS 26) produced a widely reported legibility backlash, which argues against heavy glassmorphism over a moving 3D scene. Cosmodoro's existing "dark editorial / NASA poster + grain" direction is on-trend. The upgrade is refinement: a tighter type scale, real data viz, and a disciplined accent system. A switch to glass is not recommended.

### Cited Findings
- 2026 trend guides describe type as deliberate contrast between oversized display text and small supporting text, "like a well-set magazine spread rather than a landing page". Oversized plain sans-serifs on solid, gradient or black-and-white backgrounds create a confident, minimalist feel. Awwwards is cited as the source of examples. — [line25: Web Design Trends 2026](https://line25.com/articles/web-design-trends-2026/); [reallygooddesigns: Web Design Trends 2026](https://reallygooddesigns.com/web-design-trends-2026/)
- Dark backgrounds make saturated colors pop, feel premium and suit OLED, but dark mode needs more careful contrast management. This comes from a bento-grid trend guide. — [barnimages: 8 Web Design Trends 2026](https://barnimages.com/blog/tips/web-design-trends/)
- Mandatory accessibility under the European Accessibility Act is listed among 2026 design standards. — [hostinger: web design trends 2026](https://www.hostinger.com/uk/tutorials/web-design-trends/)
- **Liquid Glass backlash:** iOS 26 betas drew complaints that translucent layers made Control Center and Notifications hard to read, worst for users with vision problems. Accessibility → Display & Text Size → Reduce Transparency makes backgrounds significantly less transparent. Apple then tested a "Tinted" option in iOS 26.1 beta 4 that tones the glass down to a flatter, calmer surface; its current public status is unconfirmed. — [BGR](https://bgr.com/tech/ios-26-beta-3-liquid-glass-complaints/); [heise](https://heise.de/-10445465); [Gulf News](https://gulfnews.com/technology/companies/apple-yields-tinted-control-in-ios-261-beta-4-tones-down-liquid-glass-after-backlash-1.500315176); [kottke](https://kottke.org/25/09/0047552-im-usually-pretty-go-with)
- One explainer notes that glass text and labels lose contrast against the background, and the problem gets worse with motion. Its iOS 27 "reset" claims are speculative. — [Web Designer Depot](https://webdesignerdepot.com/how-liquid-design-broke-the-iphone-and-forced-apples-great-reset/)
- **Grain technique:** generate noise with SVG `feTurbulence`, layer it under or over a gradient, and boost it with CSS `filter: contrast() brightness()`; `mix-blend-mode` is optional. Higher `baseFrequency` gives finer grain. `numOctaves` above 3-4 rarely justifies its cost. SVG noise files are small but CPU-heavy to render, so pre-rendering to a raster tile is a workaround. The result is uniform, static grain, and gradients can still band. — [CSS-Tricks: Grainy Gradients](https://css-tricks.com/?p=335760); [Frontend Masters: Grainy Gradients](https://frontendmasters.com/blog/grainy-gradients/); [fffuel gggrain](https://fffuel.co/gggrain/); [Instant Gradient](https://instantgradient.com/blog/grainy-gradients)
- **Heatmap:** Cal-Heatmap (npm `cal-heatmap`, MIT, TypeScript, v4.2.4 stable) builds GitHub-contribution-style calendar heatmaps. It supports animated date navigation, locale and timezone settings, and tooltip, label and legend plugins. — [npm cal-heatmap](https://npmjs.com/package/cal-heatmap); [cal-heatmap README](https://cdn.jsdelivr.net/gh/wa0x6e/cal-heatmap@master/README.md)

### Inferences
- **Dark editorial over glassmorphism.** For "premium, cinematic, calm", keep the black, hairline-grid, poster direction and refine it rather than replacing it.
  - Raise the type-scale contrast: one oversized display element per view, then tiny mono labels.
  - Add more negative space.
  - Use glass sparingly, only for small HUD chips such as a task pill or pause control. Use `backdrop-filter: blur(16-24px) saturate(120%)` over a tinted fill at 50-70% alpha, so text never depends on the blur alone, plus a 1px inner hairline border at about 12% white.
  - Provide a solid fallback, and drop the glass entirely under `prefers-reduced-transparency: reduce` where supported.
- **Grain.** Pre-render a 256-512px noise PNG or WebP tile at 3-6% opacity with `mix-blend-mode: overlay` or `soft-light`, over the UI and under the text layer. That is cheaper than live `feTurbulence` over WebGL.
  - On the 3D flight scene, prefer grain in the WebGL post-processing pass (for example a three.js film or noise pass) so it sits "in" the image, with no CSS grain over the HUD text.
  - Optionally animate the grain at a low 8-12fps stepped offset on the poster page only. Disable it under reduced motion.
- **Bento grid for the stats page.** Use a 12-column grid with hairline-separated cells (no rounded cards, matching the poster look): 1 hero cell for "Total focus hours" (huge Archivo Expanded numerals) and 2-3 medium cells for the heatmap and weekly bars. Small cells hold streak, average session and completion rate, each pairing a big number with a sparkline.
- **Data viz styles that fit FUI:**
  - Heatmap: GitHub-style focus calendar via Cal-Heatmap, or hand-rolled SVG. Use 5 lightness steps of one accent hue, square cells with 2px gaps, and no outlines.
  - Sparklines: 1px stroke, no axes, the last point marked with a 3px dot in the accent, and the min/max labeled in mono 10px.
  - Radial progress: a thin 1-2px ring with tick marks every 5 minutes, like a watch bezel or mission clock. The progress arc uses the accent, the remainder is 15% white, and an end-cap dot carries a soft glow. This fits "mission clock" better than thick donut charts.
  - "Orbit" variant: render sessions as satellites on concentric rings, one ring per day of the week, for the cinematic stats hero.
- **Accent color system.**
  - One "signal" accent for live state, such as a warm ignition orange or amber (`oklch(0.78 0.16 60)`) or a cool cyan.
  - Category hues (work, study, reading, etc.) defined in OKLCH at the same lightness and chroma (for example L 0.75, C 0.12, hues spaced about 60° apart), so no category is louder than another.
  - Use category color only in small marks (dots, heatmap cells, legend ticks), never as large fills.
  - Keep red reserved for abort and errors.
  - Validate against the black background, and over the brightest region of the 3D scene, for 3:1 non-text contrast.

### Gaps
- No direct Awwwards or Godly collection pages were retrieved; the trend claims come from secondary 2026 trend roundups, not from award data. Grain as a 2026 trend was not confirmed by any trend source found.
- No sourced data on which stats viz types users find most motivating in focus apps (Forest, Flow, Session, etc.).
- `prefers-reduced-transparency` browser support was not verified (believed Chromium-only as of 2025; check MDN).

---

## 5. Accessibility & readability: contrast over 3D backgrounds, Korean text rendering, dark-mode legibility

### Takeaway
Text over a moving 3D scene has to meet WCAG 1.4.3 (4.5:1 for normal text, 3:1 for large text) against the worst-case pixels behind it. The reliable fix is a scrim: a localized gradient or a solid semi-transparent backing behind each HUD cluster. Blur alone or a text-shadow alone is not reliable. Add reduced-motion and reduced-transparency fallbacks and Korean line-breaking rules (`keep-all` and `balance` on headings).

### Cited Findings
- WCAG 1.4.3 sets 4.5:1 for normal text and 3:1 for large text (18pt or larger, or 14pt bold), including text over images, gradients or backdrop filters. Site owners are responsible for contrast over these backgrounds. 1.4.6 (AAA) requires 7:1. Suggested fixes include a semi-transparent solid backing behind the text or darkening the image. — [Acquia: text over image/gradient/backdrop-filter minimum contrast](https://docs.acquia.com/web-governance/text-top-image-gradient-or-backdrop-filter-should-have-minimum-contrast); [Acquia: enhanced contrast](https://docs.acquia.com/md/web-governance/do-links-top-images-have-enhanced-contrast)
- Scrim starting point: a black-to-transparent gradient at about 40% opacity covering about half the image height. The author calls this "not hard rules", so measure the result. — [UX Collective: Techniques to Display Text over Background Images](https://uxdesign.cc/techniques-to-display-text-over-background-images-b089de1cc8bc)
- Text placed directly on bright image regions can fail contrast, and text shadows are not a dependable contrast fix. — [Smashing Magazine: Designing Accessible Text Over Images (Part 1)](https://smashingmagazine.com/2023/08/designing-accessible-text-over-images-part1)
- Testing method: check light text against the lightest background region, or dark text against the darkest, and fall back to per-letter checks. Contrast should be measured against the actual pixels where the text meets the image. — [W3C WCAG2 techniques submission](https://lists.w3.org/Archives/Public/public-wcag2-techs/2015May/0005.html); [W3C auto-wcag list (IBM)](https://lists.w3.org/Archives/Public/public-auto-wcag/2016Jul/0003.html)
- Amazon's APL guidance recommends a gradient overlay to create a text "safe area" with a 4.5:1 target. — [Amazon Alexa APL components](https://developer.amazon.com/en-US/alexa/alexa-haus/apl-components)
- Glass and translucency harm legibility, especially with motion behind them and for low-vision users. This is the iOS 26 Liquid Glass lesson, which led to Reduce Transparency and a Tinted option. — [BGR](https://bgr.com/tech/ios-26-beta-3-liquid-glass-complaints/); [Gulf News](https://gulfnews.com/technology/companies/apple-yields-tinted-control-in-ios-261-beta-4-tones-down-liquid-glass-after-backlash-1.500315176)
- Reduced motion: avoid large scaling or panning for `reduce` users and substitute opacity dissolves. — [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- Korean: use `word-break: keep-all` to avoid mid-eojeol breaks and pair it with `text-wrap: balance` for headings. — [daleseo.com](https://daleseo.com/css-text-wrap/)
- Animated numbers: NumberFlow is described as "accessible" and respects reduced motion by default. — [NumberFlow](https://number-flow.barvian.me/)
- Sound must have visual equivalents and an opt-out. — [userinterface-wiki](https://playbooks.com/skills/raphaelsalaja/userinterface-wiki/sounds-on-the-web); [OpenReplay](https://blog.openreplay.com/implementing-audio-in-react-websites/)

### Inferences
- **HUD-over-3D recipe (corner scrims, not a full-screen dim):**
  ```css
  .hud-corner--bl { background: radial-gradient(120% 100% at 0% 100%, rgb(0 0 0 / .55), rgb(0 0 0 / 0) 60%); }
  .hud-corner--tl { background: radial-gradient(120% 100% at 0% 0%,   rgb(0 0 0 / .45), transparent 55%); }
  .hud-text { color: rgb(255 255 255 / .92); text-shadow: 0 0 1px rgb(0 0 0 / .6), 0 1px 12px rgb(0 0 0 / .35); } /* shadow = halo aid only, not the contrast strategy */
  ```
  - Also constrain the 3D scene: keep the brightest objects (sun, planet limb, engine glow) out of the HUD corners through camera framing, or clamp exposure locally in a post-processing vignette pass. This is the WebGL equivalent of "darkening the image".
  - Test the worst frame: screenshot the brightest moment of the flight and measure the timer and labels against those pixels.
- **Minimum sizes for metadata.** Tiny mono metadata at 10-11px and 50% opacity will fail 4.5:1 over anything but pure black. Either keep metadata at 60-70% white alpha or higher on a solid or scrimmed area, or treat it as decorative and duplicate key info in accessible text. Effective-contrast targets: about 70% white on black is around 9:1; 50% white is around 5:1 on pure black but drops sharply over bright scene areas.
- **Dark-mode legibility.**
  - Avoid pure `#fff` on pure `#000` for long Korean body text, since halation makes thin Hangul strokes bloom. Use about `#EDEDED`–`#F2F2F2` on `#000`–`#0A0A0A`.
  - Use Pretendard weight 400-500 rather than 300 for body text on dark backgrounds; ultra-light weights are only for the huge timer numerals.
  - Don't let grain sit on top of small text; keep the text layer above the noise.
- **Korean rendering.**
  - Use `-webkit-font-smoothing: antialiased` only on large light-on-dark display text, and test Hangul on Windows (ClearType), where many Korean users are.
  - Use the Pretendard dynamic subset for performance.
  - Set `lang="ko"` on the root so the browser applies correct line-break rules and font fallback.
  - Use `word-break: keep-all` on headings and labels, plus `overflow-wrap: anywhere` as a safety net for long English or URLs on narrow screens.
- **Reduced-transparency and contrast media queries.** Under `prefers-reduced-transparency: reduce` or `prefers-contrast: more`, swap glass chips and scrims for solid `rgb(0 0 0 / .85)` panels and raise all text alpha to at least 90%.
- **Focus states and keyboard.** Give the timer controls a visible 2px accent focus ring (`:focus-visible`) and keyboard shortcuts (Space for start/pause). Announce session state changes ("집중 시작", "휴식 시작") through an `aria-live="polite"` region, not on every second tick.

### Gaps
- No primary W3C WCAG 2.2 page was fetched; the thresholds come from Acquia's WCAG documentation. APCA/WCAG 3 guidance for dark mode was not researched.
- No source found on Hangul-specific rendering issues (Windows ClearType vs macOS) or on minimum Hangul sizes in dark UIs.
- `prefers-reduced-transparency` and `prefers-contrast` browser support was not verified this session.
