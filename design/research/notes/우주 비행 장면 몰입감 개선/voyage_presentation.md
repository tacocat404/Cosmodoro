# Presenting an Interplanetary Voyage Calmly and Convincingly: What a Traveler Really Sees, How Missions Imaged Departure and Approach, How Film/TV/Games Stage Long Travel, and How to Compress Months into a 25-90 Minute Focus Flight

Scope note. These notes support a redesign of the Cosmodoro Flight scene. The current scene (read from `design/drafts/v5-flight.html`) has a chase camera, a quadratic Bezier route, sinusoidal ship roll and bob, 1,500 dust points plus 18 asteroids streaming past for the whole cruise, warp streaks with an FOV kick (52° to 59°) at launch and arrival, "small worlds" (Ceres, an ice moon, Io) flying past at 25/50/75%, and an orrery-scale Sun. The notes build on two earlier files and do not repeat them: `space_visual_references.md` (Q2 games, Q5 calm-transfer matrix) and `focus_app_ux_sound.md` §3 (peripheral motion, WCAG 2.3.3, reduced motion).

Method:
- I ran about 75 web searches.
- WebFetch was blocked by the session's network policy for pds-rings.seti.org, sci.esa.int, www.nasa.gov and www.space.com. Facts from those pages come from search-result extracts, cross-checked against other outlets where possible. Conflicts are flagged.

Computed values are marked **(computed)**:
- Constants come from the NASA NSSDC fact sheets ([NSSDC Planetary Fact Sheets](https://nssdc.gsfc.nasa.gov/planetary/planetfact.html)):
  - Mean radius: Mars 3,389.5 km, Earth 6,371 km, Moon 1,737.4 km.
  - Equatorial radius: Jupiter 71,492 km, Saturn 60,268 km.
  - Saturn's A-ring outer edge: 136,775 km. Sun radius: 695,700 km.
  - GM values and semimajor axes are from the same sheets.
- Model assumptions:
  - Orbits are circular and coplanar, transfers are Hohmann, and trajectories are patched conics.
  - Mars arrival uses a hyperbola with periapsis 300 km above Mars, which was MRO's capture periapsis.
  - Jupiter periapsis is 1.06 R_J and Saturn periapsis is 80,000 km. Both are assumptions.
- Formulas:
  - Angular diameter: θ = 2·asin(R/d).
  - Hohmann time ≈ ½·((r1+r2)/2)^1.5 years, with r in AU.
  - Time-of-flight on the hyperbola comes from Kepler's hyperbolic equation.

---

## Q1. What would a traveler actually see on an Earth-Mars transfer (and Jupiter/Saturn trips): departure, cruise, approach, and how fast does the destination grow?

### Takeaway
For more than 99% of a real transfer the destination is a star-like point, and Earth shrinks below 1° within about 2.6 days:
- Mars subtends 1° only in the last ~38 hours of a ~259-day Hohmann trip, and 5° only in the last ~7 hours. It then fills the sky in the final hour.
- Jupiter and Saturn reach 1° about 9-10 days out.

Real mission imagery that feels grand comes in two kinds:
- **Look-backs** at a receding Earth (often with the Moon) from fixed hull cameras, with spacecraft hardware in the frame. Examples: BepiColombo MCAM, the Orion wing-tip cameras, and the Artemis II window photos.
- **Approach time-lapses** shot with long lenses. Examples: Cassini's narrow-angle camera (0.35° field) and LORRI. In these, the planet's rotation and its moons are the visible clock.

The sense of travel comes from slow changes in angular size, phase and light, not from anything streaming past.

### Cited Findings

**Departure imagery (what leaving Earth really looks like)**
- **MESSENGER (2 Aug 2005)** flew 2,347 km above Mongolia. Its "Earth departure movie" has 358 frames over 24 h covering one full Earth rotation, shot with the MDIS wide-angle camera. It starts with the spacecraft 65,598 km above South America and ends beyond the Moon's distance (NASA PIA10120). — [Planetary Society (Lakdawalla 2005)](https://www.planetary.org/articles/0826_Images_from_the_August_2_2005); [SpaceRef](https://spaceref.com/?p=44318); [PIA10120 mirror](https://pds-rings.seti.org/press_releases/pages/PIA10xxx/PIA10120.html). APOD later described it as Earth rotating as it recedes. — [WFAE/NPR 2013](https://www.wfae.org/2013-08-05/goodbye-earth-what-messenger-saw-on-its-way-to-mercury)
- **BepiColombo (10-11 Apr 2020)** passed within ~12,700 km of Earth.
  - An MCAM "selfie" camera on the Mercury Transfer Module imaged a receding crescent at 17:13 UTC from ~218,000 km. It then shot every 10 min until 13:19 UTC on 11 April, at ~524,200 km. The Moon is a tiny speck in some frames. — [ESA](https://www.esa.int/ESA_Multimedia/Images/2020/04/BepiColombo_s_final_glimpses_of_Earth_after_flyby); [ESA Science](https://sci.esa.int/web/bepicolombo/-/bepicolombo-s-final-glimpses-of-earth)
  - A later animation shows Earth fading from a pale crescent to barely visible over the following days. — [ESA](https://www.esa.int/ESA_Multimedia/Images/2020/05/BepiColombo_keeping_an_eye_on_Earth_from_afar)
  - There are three MCAMs, each taking 1024×1024 black-and-white images. MCAM-2 sees the orbiter's medium-gain antenna and magnetometer boom. MCAM-3 sees the high-gain antenna. — [ESA monitoring cameras](https://www.esa.int/ESA_Multimedia/Images/2018/10/BepiColombo_monitoring_cameras); [ESA boom deployment](https://www.esa.int/ESA_Multimedia/Images/2018/10/BepiColombo_magnetometer_boom_deployed)
- **Artemis I / Orion (Nov-Dec 2022)** carried 16 cameras. Four sat on the solar-array wing tips, for exterior health checks and "selfies" with Earth or the Moon behind.
  - The first images came ~9 h after launch from ~57,000 mi. They show Earth plus part of an engine and a wing.
  - Orion reached a maximum distance of 432,210 km on 28 Nov (flight day 13), with Earth and Moon in one frame.
  - Sources: [NASA](https://www.nasa.gov/missions/artemis/orion/nasas-artemis-i-cameras-to-offer-new-views-of-orion-earth-moon); [Space.com](https://www.space.com/artemis-1-orion-first-photos-from-space); [Astronomy](https://www.astronomy.com/space-exploration/photos-artemis-1-captures-first-images-of-earth-on-trip-to-moon/); [NASA Earth Observatory](https://earthobservatory.nasa.gov/images/150699/orion-views-earth-from-afar); [SciTechDaily FD13](https://scitechdaily.com/?p=228741)
- **Artemis II (crewed, April 2026)** launched 1 April and flew past the Moon on 6 April.
  - NASA released the first Earth photos on 3 April. Commander Reid Wiseman took them from inside Orion ("Hello, World"). Some early shots show Earth as a sliver.
  - The crew photographed Earthset through the window at 6:41 pm EDT and Earthrise at 7:22 pm EDT on 6 April. They also captured the Moon fully eclipsing the Sun.
  - Sources: [CBS News](https://www.cbsnews.com/news/artemis-ii-earth-photo-nasa-reid-wiseman); [Planetary Society](https://www.planetary.org/articles/the-best-images-from-artemis-ii); [Al Jazeera](https://aljazeera.com/news/2026/4/3/nasa-releases-first-stunning-artemis-ii-photos-of-earth-from-moon-mission); [AP via Griffon News](https://www.griffonnews.com/news/nation/an-artemis-ii-crewmember-took-a-picture-showing-a-sliver-of-earth-from-the-window/image_f40576e4-b287-5d97-a664-bbee11b73019.html)
- **OSIRIS-REx (22 Sep 2017)** came within 11,000 km of Earth's surface.
  - A MapCam colour composite was taken a few hours later from ~170,000 km. The Planetary Society gives 179,000 km.
  - An Earth+Moon MapCam image followed on 2 Oct from 5 million km, about 13× the Earth-Moon distance.
  - Sources: [NASA](https://www.nasa.gov/image-article/osiris-rex-views-earth-during-flyby/); [Planetary Society](https://planetary.org/space-images/earth-from-osiris-rex-mapcam); [New Atlas](https://newatlas.com/nasa-osiris-rex-earth-images-gravity-assist/51562)
- **Hayabusa2 (3 Dec 2015)** imaged Earth with its black-and-white ONC-W2 camera from ~200,000 km down to 36,000 km, eventually 19 frames. Closest approach was ~3,090 km over the Pacific near Hawaii. A 4 Dec view came from ~340,000 km; the camera that took it is unconfirmed. — [JAXA](https://www.hayabusa2.jaxa.jp/topics/20151203_e/); [JAXA](https://www.hayabusa2.jaxa.jp/topics/20151224_04_e/); [Satnews](https://satnews.com/2015/12/17/jaxas-hayabusa2-cruises-does-a-post-earth-swing-by/)
- **Juno Earth flyby (9 Oct 2013)** produced a star-tracker movie. Earth and Moon entered the view at ~966,000 km. Juno spun at 2 rpm, so the camera captured one frame per rotation, and the frames were assembled into a video scored by Vangelis. — [JPL](https://www.jpl.nasa.gov/news/nasas-juno-gives-starship-like-view-of-earth-flyby/); [Astronomy](https://www.astronomy.com/science/juno-gives-starship-like-view-of-earth-flyby/); [Universe Today](https://www.universetoday.com/107095/stunning-movie-shows-what-earth-looks-like-to-an-incoming-spacecraft/amp/)
- **Galileo (16 Dec 1992)** looked back 8 days after its final Earth encounter, from ~6.2 million km. The Moon reflects about a third as much sunlight as Earth, and contrast and colour were computer-enhanced so both would show. — [JPL PIA00134](https://www.jpl.nasa.gov/images/pia00134-earth-moon-conjunction/); [NSSDC caption](https://nssdc.gsfc.nasa.gov/photo_gallery/caption/gal_earth_moon.txt)

**Cruise (what the sky looks like for months)**
- **Earth from Mars.** Curiosity's Mastcam shot Earth on 31 Jan 2014, about 80 min after sunset. Earth was the brightest point in the twilight sky with the Moon just below it, ~160 million km away. The caption notes a person on Mars would see Earth and Moon as "two distinct evening stars". — [JPL](https://www.jpl.nasa.gov/images/earth-and-moon-as-seen-from-mars); [Astronomy Now](https://astronomynow.com/news/n1402/13earth). HiRISE imaged the Earth-Moon pair from ~88 million mi (142 km/pixel, 2007) and ~127 million mi (2016, for calibration). — [NASA Earth Observatory](https://earthobservatory.nasa.gov/images/89491/earth-and-moon-from-mars); [Universe Today](https://www.universetoday.com/articles/martian-spacecraft-spies-earth-moon)
- **Stars.** Spacecraft images of sunlit planets or hardware usually show no stars, because the exposures are too short. A JPL scientist said exactly this of a Juno image. — [NASA Earth Observatory blog](https://earthobservatory.nasa.gov/blogs/earthmatters/2011/09/28/where-are-the-stars/); [Planetary Society](https://www.planetary.org/articles/why-are-there-no-stars)
- **Sunlight.** NSSDC (archived) gives solar irradiance at Mars as 589.2 W/m², against 1,367.6 W/m² at Earth (≈43%). Jupiter gets ~50.3-50.5 W/m² (≈3.7%) and Saturn ~14.8-15.0 W/m² (≈1.1%). — [NSSDC Mars sheet (archive)](https://webarchive.library.unt.edu/eot2008/20080916015156/http://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html); [PV Education](https://pveducation.org/pvcdrom/properties-of-sunlight/solar-radiation-in-space); [NSSDC values mirrored by planetarypy](https://michaelaye.github.io/planetarypy/factsheets.html)
- **The asteroid belt is empty to the eye.**
  - The average spacing between main-belt asteroids is ~965,600 km (600,000 mi) as a simple average, or ~1.1 million km if there are a million objects. Bodies larger than 1 km are ~3 million km apart.
  - The Voyagers, Pioneers, Galileo, Cassini and New Horizons all crossed the belt unscathed. Lucy "will never have to fire its thrusters" to avoid an asteroid.
  - Sources: [Astronomy (2024)](https://www.astronomy.com/science/how-do-spacecraft-avoid-collisions-in-the-asteroid-belt/); [Astronomy (2006)](https://astronomy.com/science/how-do-spacecraft-safely-navigate-the-asteroid-belt); [SwRI Lucy](https://lucy.swri.edu/MainBeltDensity.html); [Science Focus](https://www.sciencefocus.com/space/how-do-spacecraft-avoid-asteroids-and-meteoroids/)

**Approach imagery (how real missions saw the destination grow)**
- **Juno at Jupiter.** The approach movie used JunoCam images from 12-29 June 2016, as the spacecraft closed from ~10 million to ~3 million mi.
  - It was built from ~1,500 stills and shows the four Galilean moons circling Jupiter. Callisto's ~17-day orbit matched the movie's span.
  - JunoCam was switched off on 29 June before the 4 July orbit insertion. — [Space.com](https://www.space.com/33350-nasa-juno-jupiter-moons-video.html); [Spaceflight101](https://spaceflight101.com/?p=18877); [Astronomy Now](https://astronomynow.com/2016/07/06/see-jupiters-galilean-moons-in-motion-from-junos-camera/); [Universe Today](https://universetoday.com/tag/galilean-moons/page/3)
  - JunoCam has a field of view of about 58° (11 mm focal length), so "most of the time, its photos of Jupiter will be quite small". It beats amateur resolution only within ~1 million km. A 29 June frame from 5.4 million km shows Jupiter filling only a small part of the frame. — [Wikipedia: JunoCam](https://en.wikipedia.org/wiki/JunoCam); [Planetary Society](https://www.planetary.org/articles/06090600-what-to-expect-from-junocam); [Planetary Society](https://www.planetary.org/articles/08091302-junocam-raw-data)
- **Voyager 1 "Blue Movie" (1979).** It has 66 blue-filter frames, one per Jupiter rotation (~10 h), taken 6 Jan-3 Feb 1979 while Voyager closed from 58 to 31 million km. Closest approach was 5 Mar 1979. — [NASA photojournal](https://science.nasa.gov/photojournal/voyager-1-blue-movie/); [NASA resource](https://solarsystem.nasa.gov/resources/740). A modern reprocessing tweens frames ×8 for smoothness. — [Planetary Society (Regan)](https://www.planetary.org/articles/0828-watching-an-alien-world-turn)
- **Cassini at Saturn (2004).** Its movie has 45 narrow-angle frames from 6 Feb-30 Mar 2004, taken from 70.8 to 46.3 million km and mapped one per planetary rotation. By 16 May the narrow-angle camera could no longer fit the whole planet in frame. A 21 May frame was taken from 22 million km. — [Photojournal PIA06082 (archive)](https://webarchive.library.unt.edu/eot2008/20080924152539/http://photojournal.jpl.nasa.gov/catalog/PIA06082); [PIA05380](https://photojournal.jpl.nasa.gov/catalog/PIA05380). The narrow-angle camera's field of view is 0.35°×0.35° (2,000 mm focal length); the wide-angle camera's is 3.5° (200 mm). — [PDS ISS-NAC description](https://pds-rings.seti.org/pds4/bundles/cassini_iss/cassini_iss_cruise/document/iss-na-camera-description.txt); [NMSU PDS node](https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/Cassini/inst-iss.html)
- **New Horizons at Pluto (2015).**
  - An optical-navigation time-lapse came from 25-31 Jan. An approach movie spans 28 May-25 June; that one is sourced only via an aggregator.
  - The final-approach frames came from ~15,850 km, about 23 min before closest approach on 14 July. — [NASA New Horizons blog](https://science.nasa.gov/blogs/new-horizons/2015/12/03/rotational-movies-of-pluto-and-charon-its-show-time); [phys.org](https://phys.org/news/2015-02-full-day-pluto-charon.amp); [JPL PIA20202](https://www.jpl.nasa.gov/images/pia20202-new-horizons-very-best-view-of-pluto-movie/)
- **Dawn at Ceres (2015).** On 12 Feb it imaged Ceres from ~83,000 km at ~7.8 km/pixel, with the bright spots coming into focus. It was ~22,000 km out on 14-15 Apr and 13,600 km out (1.3 km/pixel) on 3-4 May. Some May frames were taken purely for navigation. — [MPS](https://www.mps.mpg.de/3902247/PM_2015_02_05_Dawn_Neue_Bilder_von_Ceres); [Space.com](https://space.com/28579-ceres-bright-spots-dawn-photos.html); [JPL](https://www.jpl.nasa.gov/news/ceres-bright-spots-seen-closer-than-ever)
- **Rosetta at 67P (2014).**
  - The OSIRIS sequence runs from 24 or 27 Mar to 4 May, closing from ~5 to ~2 million km. The comet moves against the stars of Ophiuchus and develops a coma.
  - The distance fell from 5 million to 120,000 km between March and June. Navcam was within 1,327 km by 31 July, and Rosetta arrived on 6 Aug.
  - A month before arrival the comet was "barely a few pixels". — [Photojournal PIA18376](https://photojournal.jpl.nasa.gov/catalog/PIA18376); [ESA](https://www.esa.int/ESA_Multimedia/Images/2014/05/Comet_develops_a_coma); [A&A 2015](https://www.aanda.org/articles/aa/abs/2015/01/aa24735-14/aa24735-14.html); [Universe Today](https://www.universetoday.com/113626/rosetta-closing-in-on-comet-67pchuryumov-gerasimenko-after-decade-long-chase/)
- **Mars.** Tianwen-1's first Mars image, released 5 Feb 2021, was taken from ~2.2 million km. It is black and white and shows Schiaparelli crater and Valles Marineris. — [Live Science](https://www.livescience.com/china-tianwen-1-mission-first-mars-photo.html); [gov.cn](https://english.www.gov.cn/statecouncil/ministries/202102/06/content_WS601de806c6d0f72576945340.html)

### Inferences

**A. Distance from the planet's centre at which a body subtends a given angular diameter (computed)**

| angular diameter | Mars | Earth | Jupiter (eq.) | Saturn globe | Saturn A-ring span | Moon |
|---|---|---|---|---|---|---|
| 1 arcmin | 23.3 M km | 43.7 M km | 491 M km | 414 M km | 939 M km | 11.9 M km |
| 0.1° | 3.88 M km | 7.30 M km | 81.9 M km | 69.1 M km | 157 M km | 1.99 M km |
| 0.5° (Moon seen from Earth) | 777,000 km | 1.46 M km | 16.4 M km | 13.8 M km | 31.4 M km | 398,000 km |
| **1°** | **388,000 km** (≈ the Earth-Moon distance) | 730,000 km | 8.19 M km | 6.91 M km | 15.7 M km | 199,000 km |
| 2° | 194,000 km | 365,000 km | 4.10 M km | 3.45 M km | 7.84 M km | 99,600 km |
| **5°** | **77,700 km** | 146,000 km | 1.64 M km | 1.38 M km | 3.14 M km | 39,800 km |
| 10° | 38,900 km | 73,100 km | 820,000 km | 691,000 km | 1.57 M km | 19,900 km |
| **20°** | **19,500 km** | 36,700 km | 412,000 km | 347,000 km | 788,000 km | 10,000 km |
| 40° | 9,900 km | 18,600 km | 209,000 km | 176,000 km | 400,000 km | 5,080 km |
| **60°** | **6,780 km** (3,390 km altitude) | 12,700 km | 143,000 km | 121,000 km | 274,000 km | 3,480 km |
| 90° | 4,790 km (1,400 km altitude) | 9,010 km | 101,000 km | 85,200 km | 193,000 km | 2,460 km |

**B. Final approach timeline: time before periapsis at which the target reaches each size (computed; Hohmann arrival v∞ Mars 2.65, Jupiter 5.64, Saturn 5.44 km/s)**

| size | Mars | Jupiter | Saturn (globe) |
|---|---|---|---|
| 0.1° | T−16.8 d | T−145 d | T−137 d |
| 0.5° | T−3.3 d | T−22 d | T−23.5 d |
| 1° | T−38.5 h | T−9.1 d | T−10.4 d |
| 2° | T−18.6 h | T−3.6 d | T−4.4 d |
| 5° | T−6.9 h | T−24.5 h | T−32 h |
| 10° | T−3.2 h | T−9.4 h | T−13 h |
| 20° | T−1.4 h | T−3.7 h | T−5.3 h |
| 40° | T−38 min | T−1.5 h | T−2.1 h |
| 60° | T−23 min | T−53 min | T−1.2 h |
| 90° | T−12 min | T−28 min | T−22 min |
| when an orbit-insertion burn centred on periapsis starts | ~85° (27-min burn, like MRO/Hope) | ~110° (35-min burn, like Juno) | ~72° (96-min burn, like Cassini) |
| at periapsis | 133° (300 km altitude) | 141° | 98° |

- Saturn's ring span reaches 1° about 27 days out, well before the globe does (computed).
- The angular size grows as 1/distance, so the destination's size doubles each time the remaining distance halves. Mars takes ~20 h to go from 1° to 2°, but only ~48 min to go from 20° to 40° (computed). Near the end the planet's own gravity speeds the craft up (2.6 km/s far out, 4.4 km/s at 60°, 5 km/s at 90°), which makes the final growth even more explosive.

**C. Departure: how fast Earth shrinks (computed; v∞ 2.95 km/s from a 200-km parking orbit)**

| after injection | distance | Earth diameter | max Earth-Moon separation |
|---|---|---|---|
| 1 h | 25,700 km | 29° | — |
| 3 h | 61,200 km | 12° | — |
| 6 h | 106,000 km | 6.9° | — |
| 12 h | 187,000 km | 3.9° | — |
| 1 day | 335,000 km | 2.2° | — |
| 2 days | 613,000 km | 1.2° (71′) | 32° |
| 4 days | 1.15 M km | 38′ | 18.5° |
| 7 days | 1.93 M km | 23′ | 11° |
| 14 days | 3.75 M km | 12′ | 6° |
| 30 days | ~6-8 M km | ~6′ | ~3° |

- With Jupiter- or Saturn-class departure speeds (v∞ 8.8-10.3 km/s), Earth is already below 1° after one day (computed).
- Cross-check against Earth's angular diameter in the real images above (computed from the stated ranges):

| image | Earth's angular diameter |
|---|---|
| MESSENGER movie start | ~10.2° |
| Orion's first wing-camera image | ~8.0° |
| OSIRIS-REx MapCam | ~4.3° |
| BepiColombo MCAM sequence | 3.3° → 1.4° |
| Hayabusa2 | 2.1° |
| Artemis I at maximum distance | 1.7° |
| Juno star tracker | 0.76° |
| OSIRIS-REx Earth+Moon | 8.8′ |
| Galileo Earth+Moon | 7.1′, with Earth and Moon up to 3.6° apart |
| Earth from Mars | 0.3′, a point |

  The famous "Earth and Moon together" pictures are taken days to weeks out, when both are small and several degrees apart.

**D. Cruise geometry for Earth → Mars (computed, Hohmann, 259 d)**

| trip | day | Earth size | Mars size | Mars lit fraction | Sun size | sunlight vs Earth | one-way light time to Earth |
|---|---|---|---|---|---|---|---|
| 1% | 3 | 66′ | 9″ | 88% | 32.0′ | 100% | 2 s |
| 10% | 26 | 6.8′ | 11″ | 89% | 31.3′ | 96% | 21 s |
| 25% | 65 | 2.6′ | 18″ | 93% | 28.8′ | 81% | 57 s |
| 50% | 129 | 41″ | 44″ | 100% (full) | 24.3′ | 58% | 3.5 min |
| 75% | 194 | 18″ | 98″ | 80% | 21.8′ | 46% | 8.3 min |
| 90% | 233 | 13″ | 4.0′ | 62% | 21.1′ | 44% | 11.3 min |
| 99% | 256 | 11″ | 39′ | 51% (half) | 21.0′ | 43% | 13.1 min |

- **Jupiter trip (998 d).**
  - Jupiter's size: 38″ at departure, 2.2′ at mid-trip, 10′ at 90%, ~3.4° at 2.4 million km.
  - The Sun shrinks from 32′ to 6.1′ and sunlight falls to ~4%. One-way light time grows to roughly 40 min, varying with Earth's position.
- **Saturn trip (2,220 d).**
  - Saturn's size: 18″ at departure, 51″ at mid-trip, 4′ at 90%, ~1.3° at 5.2 million km (computed).
  - The Sun shrinks to 3.3′ and sunlight falls to ~1%. Light time grows to ~88 min.
- Use table B, not this heliocentric model, for timing in the final weeks. The heliocentric model ignores the planet's gravity, which shortens the last days by a few days at Jupiter and Saturn.
- These model numbers agree with reported delays: Hope's ~11-min one-way delay and Cassini's 84-min light time (Q2).
- Earth drops below 1 arcmin (a point) around day 110 of the Mars trip, at ~45 million km (computed).

**What these numbers mean for the scene**
- **The visual "budget" of a real trip is points of light.** Earth is a disc (>1°) for only about 2.6 days. The destination is a disc only in the last ~1.6 days (Mars) or ~9-10 days (Jupiter/Saturn). Everything in between is the Sun, stars, two bright "stars" (home and destination), lighting changes, and numbers.
- **Lighting is a real progress signal.**
  - Looking back, a Hohmann departure shows Earth about half-lit for the first days. It is ~38% lit at two weeks, ~24% at a month and a thin 3% crescent by two months (computed). This matches BepiColombo's "receding crescent".
  - The destination is at full phase mid-trip. On arrival the Sun sits ~90° from the line of sight, so the target is half-lit with a hard terminator (computed).
  - So the fully lit "poster planet" belongs to mid-cruise geometry, not to arrival.
- **The Sun should be small and fierce, not a big nearby orb.** It is 0.53° across at Earth, 0.35° at Mars, 0.10° at Jupiter and 0.056° at Saturn (computed). On a 1000-px-tall viewport with the current vertical FOV of 52°, that is ~9 px at Earth and ~6 px at Mars. At Jupiter and Saturn it is a blinding point. The orrery-scale Sun is the strongest single scale cue that breaks realism.
- **Stars are optional.** With a sunlit hull or planet in frame, a "documentary exposure" shows few or no stars. Stars can appear when nothing bright is in frame. This is an honest, calm way to vary the image.
- **Pixel mapping (computed; vertical FOV over a 1000-px-tall viewport):**

  | vertical FOV | 0.05° | 0.5° | 1° | 5° | 20° |
  |---|---|---|---|---|---|
  | 52° | 0.9 px | 9 px | 18 px | 90 px | 360 px |
  | 30° | 1.6 px | 16 px | 33 px | 163 px | 658 px |
  | 10° | 5 px | 50 px | 100 px | 500 px | — |
  | 2° (a "long-range imager" inset) | 25 px | 250 px | 500 px | — | — |

  On the viewer's side, a 27" monitor at 60 cm is ~31° tall and a 13" laptop at 50 cm ~20° tall. A 52° render is therefore shown at 0.4-0.6× its "true" angular size (computed). A narrower FOV (25-35°) makes the destination legible without lying about distance, and it shrinks peripheral optic flow.

### Gaps
- I could not open the photojournal or ESA caption pages directly (blocked hosts), so frame counts and distances come from search extracts. Exact phases (crescent or gibbous) of Earth in the MESSENGER, Galileo and OSIRIS-REx images were not verified.
- Not researched: Mars Express approach imagery and Hope's first-image distance.
- I found no source for the naked-eye "1 arcmin" acuity rule used to label table A; treat it as a common approximation.
- The phase and lighting numbers assume an idealized Hohmann geometry. Real Type I/II trajectories change the approach direction and therefore the destination's phase.

---

## Q2. Real transfer facts: durations and path shapes, spacecraft attitude in cruise vs. during burns, RCS behaviour, and what hull/onboard cameras show

### Takeaway
A real voyage is a long unpowered coast along a half-ellipse around the Sun:
- A Hohmann transfer to Mars takes ~259 days; actual missions take ~200-210 days. Jupiter takes ~2.7 years and Saturn ~6.1 years, and real orbiters take longer because they use gravity-assist routes.
- The spacecraft holds a fixed attitude, or spins slowly at ~2 rpm, and fires thrusters only for a few small trajectory corrections.
- Its one big moment is arrival. It turns engine-first ~20-30 min before a 25-100-minute braking burn, often while passing behind the planet.
- Attitude changes are slow: Hubble slews at ~6°/min, about the speed of a clock's minute hand.
- Hull "selfie" cameras (Orion wing tips, BepiColombo MCAM) are the real visual language: spacecraft structure in the foreground, Earth and Moon beyond, black-and-white or short-exposure, no stars.

### Cited Findings
- **Hohmann durations.** Mars takes ~259 days (~8.5 months), Jupiter ~2.7 years and Saturn ~6.1 years. The transfer time is half the period of the transfer ellipse (≈ 0.5·a^1.5 years, with a in AU). — [Rocket Basics: Interplanetary Travel](https://svonstrauss.github.io/rocket-basics/src/Module_02_Orbital_Mechanics/Learn/01_Interplanetary_Travel.html); [NASA GSFC "From Stargazers to Starships"](https://pwg.gsfc.nasa.gov/stargaze/Smars1.htm). A secondary source says real Jupiter orbiters take ~5.5 years and Saturn missions ~6.5-7 years. — [Starlust](https://starlust.org/?p=27561)
- **Real Mars cruises.**
  - Mars 2020 launched on 30 July 2020 on an Atlas V 541. The Centaur's second burn ran from T+44:59.5 to T+52:50.1 (~8 min), and the spacecraft separated at T+57:32.8. — [Spaceflight Now](https://spaceflightnow.com/2020/07/29/atlas-5s-launch-timeline-on-the-mars-2020-mission/)
  - Perseverance landed on 18 Feb 2021, about 203 days later (computed). — [Spaceflight Now](https://spaceflightnow.com/2021/02/22/nasa-releases-first-of-its-kind-high-definition-video-of-mars-rover-landing/)
  - Tianwen-1 launched on 23 July 2020 and entered orbit around 10 Feb 2021, about 202 days (computed). — [gov.cn](https://english.www.gov.cn/statecouncil/ministries/202102/06/content_WS601de806c6d0f72576945340.html); [Live Science](https://www.livescience.com/china-tianwen-1-mission-first-mars-photo.html)
- **Gravity assists (real reasons for a world to pass by).**
  - MESSENGER's 2005 Earth pass was the first of six gravity assists. — [Planetary Society](https://www.planetary.org/articles/0826_Images_from_the_August_2_2005)
  - BepiColombo's Earth flyby was the first of nine: one at Earth, two at Venus, six at Mercury. — [ESA](https://www.esa.int/ESA_Multimedia/Images/2020/04/BepiColombo_s_final_glimpses_of_Earth)
  - Juno's Oct 2013 Earth flyby was the gravity assist that sent it to Jupiter. — [JPL](https://www.jpl.nasa.gov/news/nasas-juno-gives-starship-like-view-of-earth-flyby/)
- **Cruise attitude and corrections.**
  - Mars 2020 made "attitude correction turns", described as slight spins that keep the antenna aimed at Earth and the solar panels at the Sun. — [NASA blog](https://science.nasa.gov/blogs/perseverance-mars-rover/2021/02/15/its-landing-week-for-nasas-mars-2020-perseverance-rover)
  - Four trajectory correction maneuvers were planned, the last two in the final 45 days (the "approach subphase"), using the cruise-stage thrusters. — [JPL press kit](https://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/mission)
  - MSL used a spin-stabilized design inherited from Pathfinder and MER, and rotated at about 2 rpm during its largest correction. — [MSL cruise attitude paper](https://www.aminer.org/pub/5f837d6e6a05fdbd96eef78b/msl-cruise-attitude-control-flight-experience-and-implications-for-mars); [Spaceflight Now (MSL TCM-1)](https://spaceflightnow.com/atlas/av028/120112tcm1/)
  - Juno cruised spinning at 2 rpm. — [JPL](https://www.jpl.nasa.gov/news/nasas-juno-gives-starship-like-view-of-earth-flyby/)
- **Turning around for orbit insertion.**
  - ExoMars TGO turned ~30 min before its burn so its main engine pointed in the direction of travel. India's Mars Orbiter Mission rotated 21 min before its burn. — [Nature World News](https://www.natureworldnews.com/articles/30259/20161018/esa-exomars-trace-gas-orbiter-perform-critical-orbit-insertion-burn.htm); [Planetary Society](https://planetary.org/articles/0916-laxman-mars-orbiter-mission-prepares)
  - The big turnaround is likely done with RCS thrusters, while reaction wheels hold attitude. — [ESA Rocket Science blog](https://blogs.esa.int/rocketscience/?p=2999)
  - Small RCS firings correct oscillations during the burn. — [SpaceRef: What is Mars orbit insertion?](https://spaceref.com/status-report/what-is-mars-orbit-insertion/)
  - Mars Global Surveyor's burn was planned at 20-25 min. — [MSSS MGS mission plan](https://www.msss.com/mars/global_surveyor/mgs_msn_plan/section5/section5.html)
- **Burn durations and drama.**
  - **MRO (10 Mar 2006):** a ~27-min burn (JPL and PDS give 25-26 min) on six 170-N engines, Δv 1,015 m/s. About 21 min into the burn MRO passed behind Mars and contact was lost. The capture orbit had a 300-km periapsis and a ~35-h period. — [Space.com](https://space.com/2143-orbit-day-complete-coverage-mro-red-planet-arrival.html); [JPL MOI timeline (archive)](https://webarchive.library.unt.edu/eot2008/20080916214218/http://mars.jpl.nasa.gov/mro/mission/tl_moi.html); [PDS mission catalog](https://pds-geosciences.wustl.edu/mro/mro-m-rss-1-magr-v1/mrors_0xxx/catalog/mission.cat)
  - **Hope (9 Feb 2021):** six thrusters fired for ~27 min and used about half of ~800 kg of fuel. The reported speed cut was 121,000 to 18,000 km/h, with no frame of reference stated. The burn ran autonomously because of the ~11-min one-way delay. — [WAM](https://www.wam.ae/en/details/1395302908611); [Khaleej Times](https://www.khaleejtimes.com/news/hope-probe-enters-mars-orbit-uae-leaders-offer-congratulations-at-control-room); [The Scotsman](https://www.scotsman.com/news/world/uae-mars-mission-hope-probe-successfully-enters-mars-orbit-what-purpose-mission-3128899); [Smithsonian](https://www.smithsonianmag.com/smart-news/emirati-hope-space-probe-enters-mars-orbit-180976957/)
  - **Juno (4 July 2016):** the spin was raised from 2 to 5 rpm ~22 min before ignition for stability. The burn lasted 35 min (2,102 s), then the spin was reduced back to 2 rpm over ~5 min. Δv was 542 m/s and the capture orbit was 53.5 days. — [Spaceflight Now](https://spaceflightnow.com/2016/06/23/timeline-of-junos-historic-arrival-at-jupiter/); [JPL](https://www.jpl.nasa.gov/news/juno-enters-orbit-around-jupiter/); [Wikipedia (archived)](https://webarchive.library.unt.edu/web/20170125224046/https://en.wikipedia.org/wiki/Juno_(spacecraft))
  - **Cassini (1 July 2004):** a burn of ~96 min (96.4 min). The closest approach of the entire four-year tour happened during it. Confirmation reached Earth after the 84-min one-way light time. — [JPL](https://www.jpl.nasa.gov/news/cassini-set-to-ring-saturn-today/); [Spaceflight Now](https://spaceflightnow.com/cassini/040630goforburn.html); [ESA](https://www.esa.int/Science_Exploration/Space_Science/Cassini-Huygens/Cassini-Huygens_due_to_arrive_at_Saturn)
- **How slow real attitude motion is.** Hubble slews at roughly 6°/min, so a 90° turn takes about 15 min. It uses four reaction wheels. — [HST Primer](https://ssb.stsci.edu/cdbs/perigee/jyounger/cp_primer/Ch_2_Systemoverview5.html); [NASA HST fact sheet](https://science.nasa.gov/wp-content/uploads/2023/04/hst_overview_fact_sheet.pdf)
- **Ion propulsion as calm thrust.** Each of Dawn's ion engines produced 91 mN, roughly the force of holding a sheet of notebook paper. At full throttle it took 4 days to go from 0 to 60 mph. The exhaust was a blue beam leaving at 89,000 mph, and the engine used only 37 oz of xenon over those 4 days. — [NASA Dawn](https://science.nasa.gov/mission/dawn/technology/ion-propulsion/); [JPL](https://www.jpl.nasa.gov/news/nasas-dawn-spacecraft-fires-past-record-for-speed-change/); [Planetary Society](https://www.planetary.org/articles/20130702-dawn-journal-breaking-velocity-records)
- **Onboard and hull cameras.**
  - Orion's wing-tip cameras and BepiColombo's MCAMs are described in Q1. Juno's star-tracker movie captured one frame per 2-rpm rotation (Q1).
  - **Perseverance EDL** used six FLIR cameras: three looking up at the parachute, one on the descent stage looking down, and two on the rover (up and down). They took more than 23,000 images (>30 GB). The released video starts ~230 s after atmospheric entry. Accounts disagree on which camera failed: one parachute camera knocked offline, or a descent-stage camera. — [Spaceflight Now](https://spaceflightnow.com/2021/02/22/nasa-releases-first-of-its-kind-high-definition-video-of-mars-rover-landing/); [Aviation Week](https://aviationweek.com/space/nasa-releases-multi-camera-videos-perseverance-landing); [collectSPACE](https://www.collectspace.com/news/news-022221a-perseverance-landing-video-audio.html)
  - **Starship flight tests** relayed onboard views over Starlink terminals. One camera at a flap showed re-entry heating and plasma, with "visions of planet Earth behind Starship". This comes from SpaceX webcast commentary via third-party re-uploads, a weak source. — [webcast re-upload](https://www.dailymotion.com/video/x96yaei)

### Inferences
- **Path shape and speed (computed).**
  - The Hohmann route to Mars is a half-ellipse sweeping 180° around the Sun. At launch Mars leads Earth by ~44°; Jupiter leads by 97° and Saturn by 106°.
  - Heliocentric speed falls steadily, because the craft coasts uphill against the Sun's gravity:

    | trip | heliocentric speed | arrival v∞ |
    |---|---|---|
    | Mars | 32.7 → 21.5 km/s | 2.65 km/s |
    | Jupiter | 38.6 → 7.4 km/s | 5.64 km/s |
    | Saturn | 40.1 → 4.2 km/s | 5.44 km/s |

  - An honest HUD speed therefore drifts slowly downward. The current HUD's "24.1 ± 0.6 km/s" wobble with a 9-s period has no physical analog.
- **Where the destination really is (computed).**
  - Measured from the craft's heliocentric velocity, the target starts ~6-16° off the nose, sits ~85° off at mid-trip, and is ~179° off (behind) at the end, because Mars catches up with the craft.
  - Keeping the destination "ahead" in the camera frame is an acceptable legibility convention, much as Interstellar simplified Gargantua (see earlier notes). If so, lock the camera frame to the destination and stop the ship from visibly steering or banking.
- **Ship-behaviour spec that is both realistic and calm.**
  - Hold attitude rock-steady (3-axis stabilized), with no sinusoidal roll or bob. The current ±4° roll every 16.5 s plus bob every 10 s reads as an aircraft or boat.
  - Any slew should be ≤ 6°/min of mission-equivalent motion, with at most 1-2 per session.
  - Show trajectory corrections as 2-4 soft RCS puffs under 1 s each, 2-3 times per session, in place of the 25/50/75% flybys.
  - Show arrival as one slow 180° turn to engine-first (real: 20-30 min before the burn), then a long steady burn while the planet fills 70-140° of the sky.
  - Loss of signal behind the planet (MRO) is a natural moment for silence.
  - For a continuous-thrust aesthetic, use a faint, steady blue ion glow (Dawn) instead of streaks. Remove the engine flicker; the current code modulates the plume by `0.9 + 0.06·sin(37t) + random·0.06` every frame.
- **Departure spec.** Replace the warp streaks and FOV kick with what really happens: a long, steady injection burn (~8 min real) with Earth huge below (>30°), then a coast in which Earth shrinks. Shoot it from a hull camera with structure in the foreground (array edge, antenna, boom), as BepiColombo MCAM-2 and Orion's wing cameras do.
- **Mid-trip events.**
  - On an Earth-Mars route nothing flies past. Ceres or Io "close passes" on a Mars trip contradict the physics, and asteroids are ~1 million km apart even in the belt.
  - Real milestones work instead: TCM-1/2/3, "Earth now a point (< 1′)" around day 110, "Signal delay 5 min", and "Halfway: Mars at full phase".
  - For Jupiter and Saturn routes, a gravity-assist flyby (Earth, Venus or Jupiter) is a real reason for a world to sweep past, as with Juno, MESSENGER and BepiColombo.

### Gaps
- I found no Mars 2020-specific spin rate (MSL's ~2 rpm is used as a proxy).
- Hope's reported 121,000 → 18,000 km/h figures don't state a reference frame. The pre-burn figure is hard to reconcile with Mars-relative arrival physics, so treat it with caution.
- I found no authoritative source on how visible chemical-engine plumes are in vacuum, or on navigation-light conventions. The current scene has "blinkers".
- The Starship onboard-camera description rests on webcast re-uploads.

---

## Q3. How films and TV stage voyages and speed: what reads as real vs. cliché (lens, camera mounting, silence, cut rhythm)

### Takeaway
The productions that read as real share five habits:
1. **Monumental slowness.** Kubrick slowed miniatures to near-imperceptible speeds.
2. **Silence in exterior shots used as a dramatic device** (2001, Interstellar, early Expanse). The sound budget goes to interiors and suits.
3. **Physically consistent manoeuvres.** The Expanse's midpoint flip-and-burn mirrors real orbit insertion, where the craft turns engine-first.
4. **Documentary references.** NASA IMAX footage, Saturn V launch footage, scanned Mars topography.
5. **Long transits skipped rather than shown.** Title cards, hypersleep, races between ships.

Clichés that read fake for calm travel: sound in vacuum, aircraft-style banking, streaming debris, swooping cameras.

### Cited Findings
- **2001: A Space Odyssey (1968).**
  - The crew shot at very slow frame rates, sometimes 4 s per frame, for maximum depth of field. That forced miniature movements to "nearly imperceptible speeds". — [Summary of the June 1968 American Cinematographer articles](https://scrapsfromtheloft.com/?p=16201); [ASC: Filming 2001](https://theasc.com/articles/filming-2001-a-space-odyssey)
  - Trumbull said long exposures and time-lapse methods gave close to infinite depth of field. — [Trumbull interview (Yahoo)](https://www.yahoo.com/entertainment/2001-vfx-guru-douglas-trumbull-140012864.html)
  - Star fields were filmed to drift slowly, with the spacecraft shot separately and moved at a different direction and speed. — [Science Friday (Michael Benson excerpt)](https://www.sciencefriday.com/articles/full-of-stars/)
  - Exterior shots of the Jupiter craft are "enveloped in complete silence". — [Filmsite](https://ftp.filmsite.org/twot.html). There is scholarly work on the film's silence. — [EBSCO](https://www.ebsco.com/articles/history/f7fde7eb-03fb-5fcd-a7bc-cd341772bf53/silence-speaks-louder-than-words-in-stanley-kubrick-s-2001-a-space-odyssey)
  - The transit is skipped with the card "JUPITER MISSION / 18 MONTHS LATER". — [Trailers From Hell transcript](https://trailersfromhell.com/?p=59823)
  - Sources disagree on the Discovery model sizes (a 12-ft primary model vs. 54/55-ft and 15-ft models). — [Wikipedia](https://en.wikipedia.org/wiki/Discovery_(Space_Odyssey_spaceship)); [Den of Geek](https://www.denofgeek.com/movies/2001-a-space-odyssey-15-fascinating-facts)
- **Interstellar (2014).**
  - Nolan on silence, as reported: "Every time you cut to the silence, it reminds you that human beings aren't supposed to be there". He called the mix "a carefully considered creative decision". — [Mental Floss](https://www.mentalfloss.com/article/60211/sound-design-interstellar); [Bustle (citing THR)](https://www.bustle.com/articles/49453-christopher-nolan-addresses-interstellar-sound-issues-swears-he-meant-it-to-sound-like-that)
  - The crew sleeps through the ~2-year trip to Saturn (fan-wiki source). — [Interstellar Wiki](https://interstellarfilm.fandom.com/wiki/Endurance)
  - Paul Franklin said they didn't use a single green screen in the spacecraft sequences. Nolan noted the IMAX cameras they used had flown on shuttle missions. — [Space.com IMAX featurette](https://www.space.com/27742-interstellar-imax-featurette-exclusive.html). Earlier notes cover the camera-on-model and lens-flare work.
- **The Expanse.**
  - Flip-and-burn: a quick 180° turn, then thrust the other way. — [About Amazon](https://aboutamazon.com/news/entertainment/the-expanses-new-space)
  - The ship cuts the main drive, rotates on small thrusters, and relights. — [The Portalist](https://theportalist.com/the-expanse-science)
  - The profile is to accelerate for half the trip at ~1 g, flip, then decelerate at 1 g. — [Astronomy Cast #795 (June 2026)](https://www.astronomycast.com/2026/06/795-expanse-science/)
  - VFX animators start with "a physics lesson", and a supervisor says physics-based reality gives the show its own aesthetic. Rocket Science VFX delivered 2,000+ CG-heavy shots over six seasons. — [3D World via PressReader](https://www.pressreader.com/australia/3d-world/20210223/283162906302874); [RSVFX on the Rocinante build](https://www.rsvfx.com/?p=454); [RSVFX retrospective](https://www.rsvfx.com/?p=1750)
  - Season 1 tried to keep ships silent. The sound team later moved to a bigger, stylized sound for battles. — [A Sound Effect](https://www.asoundeffect.com/the-expanse-sound)
- **For All Mankind (S3).**
  - Jay Redd balanced realism against drama. The Mars asset "Cyclops" was built from scanned topography, and The Third Floor did previs for orbital shots. — [IndieWire via Yahoo](https://ca.news.yahoo.com/mankind-building-mars-worth-fighting-163023635.html); [The Third Floor](https://thethirdfloorinc.com/5667/for-all-mankind-season-3/); [Below the Line](https://mande.net/btl/awards/for-all-mankind-vfx-jay-redd)
  - The transit is dramatized as a race (Phoenix ahead, Sojourner-1 deploying solar sails, worry that Mars-94 could beat Sojourner by three days) rather than by its length. — [Cult of Mac recap](https://www.cultofmac.com/778518/for-all-mankind-recap-happy-valley-apple-tv/); [Space.com](https://www.space.com/for-all-mankind-season-3-trailer-apple-tv-plus)
- **The Martian (2015).** Framestore did the Hermes (a ~700 GB model) and the weightlessness work; MPC did Mars. Rotating set pieces, camera and stunt wires ran on the same trigger. — [AWN](https://awn.com/vfxworld/framestore-delivers-stellar-vfx-martian); [CGW](https://www.cgw.com/Press-Center/In-Focus/2015/The-Martian.aspx); [motionpictures.org](https://www.motionpictures.org/2015/10/the-martians-vfx-supervisor-on-creating-zero-gravity-without-a-vomit-comet/)
- **Ad Astra (2019).** MPC delivered 198 shots, with Mr X helping define Neptune and its rings. The team "spent a long time on specular highlight details... making sure the light looked the way it would in real life". They consulted JPL regularly and studied late-1960s Saturn V launch footage. — [AWN](https://www.awn.com/vfxworld/mpcs-visual-effects-are-out-world-ad-astra); [Animation Magazine](https://animationmagazine.net/2019/10/the-vfx-of-ad-astra-envisioning-the-retro-future-of-space-travel); [motionpictures.org](https://www.motionpictures.org/2019/09/how-the-vfx-team-behind-ad-astra-achieved-deep-space/)
- **Apollo 13 (1995).** Digital Domain under Rob Legato mixed models with CG. "Total verisimilitude was the prime directive", and viewers mistook the shots for stock footage. — [Digital Domain](https://digitaldomain.com/work/apollo-13/); [Yahoo retrospective](https://www.yahoo.com/entertainment/apollo-13-turns-25-vfx-164503554.html); [Cinefex 1995 index](https://www.moviemags.com/cinefex/1995)

### Inferences
- **Reads as real vs. cliché (for a calm cruise):**

| Reads as real (use) | Cliché / reads fake (avoid in cruise) |
|---|---|
| Near-imperceptible motion of large objects (2001) | Ships banking and rolling like aircraft (current ±4° roll) |
| A camera that could physically exist: hull cam, window, long-range imager (Orion, BepiColombo, Artemis II window photos) | Free-flying chase cam with sway and swoops |
| Silent exteriors with only interior or room tone, and a hard cut to silence at a key beat (Interstellar, 2001) | Engine roar or whooshes in vacuum |
| Engine-first turnaround before arrival (Expanse flip; real orbit insertion) | Arriving nose-first at full speed with an FOV punch |
| One hard sun, specular realism (Ad Astra) | Big glowing nearby Sun |
| Skipping time with cards, hibernation, mission-day captions (2001, Interstellar) | Showing speed with streaks and debris for an hour |
| Documentary sourcing (NASA footage, scanned terrain) | Invented en-route worlds |

- **Lens language.**
  - Real approach movies are long-lens: Cassini's narrow-angle camera covers 0.35° and LORRI is similar. The target sits centred and grows slowly.
  - A wide JunoCam-type lens (58°) makes a planet tiny until very close.
  - For Cosmodoro: cruise at ~25-35° vertical FOV, with an optional 2-5° "long-range imager" inset that shows the destination as a disc. Go wide (50°+) only in the final arrival moments when the planet fills the sky.
  - No source gave the focal lengths used in these films' planet shots (see Gaps).
- **Cut rhythm.** A 25-90 min session should hold about 4-6 "shots" in total (departure, cruise, approach, arrival, orbit), joined by slow crossfades of ≥ 2-3 s. That is 2001-level slowness, which a focus timer wants.
- **Captions instead of motion for speed.** For example: "DAY 143 · 0.75 AU from the Sun · signal delay 6 min". This borrows the 2001 and For All Mankind habit of stating time and distance rather than animating them.

### Gaps
- I found no primary VFX breakdown giving lens or focal-length choices for planet shots in Interstellar, Ad Astra, For All Mankind or The Martian, and no specific source on Interstellar's Saturn approach shot.
- No source describes how For All Mankind shows transit duration on screen; fan estimates range from 3 to 24 months.
- I found nothing on cut rhythm in these films beyond 2001's slowness.

---

## Q4. How games present long travel, what players find immersive vs. fake, and how speed is conveyed in empty space without fake debris

### Takeaway
The travel systems players respect tie distance to rules about real bodies:
- Elite's supercruise slows near gravity wells, and players drop out when the ETA reads about 7 seconds.
- Kerbal Space Program shows an explicit time-warp factor.
- Both hide loading inside diegetic transitions (Elite's hyperspace tunnel).

What players call fake or tiring:
- Menus and loading screens instead of travel (Starfield).
- Over-busy speed effects. No Man's Sky's speed lines are disliked enough that removal mods exist.

Dust and parallax layers are tricks for manoeuvring at close range, not for cruising. Outer Wilds shows that a compact, honest system convinces better than invented debris.

### Cited Findings
- **Elite Dangerous.**
  - Supercruise tops out at 2,001c on a regular frame-shift drive and takes ~57 min to reach when no bodies interfere (community guide). Heading toward a body lowers the maximum speed; heading away raises it. — [Elite wiki](https://elite-dangerous.fandom.com/wiki/Supercruise); [Frontier forum guide](https://forums.frontier.co.uk/goto/post?id=1661836); [Steam](https://steamcommunity.com/app/359320/discussions/0/343788552529385499)
  - Players cut throttle when the ETA counter reads 7 s, or 4-5 s with supercruise assist. This is player practice; I found no developer statement. — [Steam thread](https://steamcommunity.com/app/359320/discussions/0/1620599015912949746)
  - The hyperspace jump animation is described as a disguised loading screen. Explorers' "golden standard" is ~50 s from jump exit to jump exit. — [EliteDangerous PvE forum](https://elitepve.com/viewtopic.php?p=81011); [Frontier forum](https://forums.frontier.co.uk/goto/post?id=7775624); [Gamepressure](https://www.gamepressure.com/elitedangerous/frame-shift-drive/z6739c)
  - Critics frame its appeal as "the awe of scale a 1:1 Milky Way produces", but also as slow and grindy. Steam reviews are 76% positive and Metacritic is 80. — [GameGeeker review aggregate](https://gamegeeker.com/en/games/elite-dangerous-359320). The player debate about long supercruise stretches is covered in the earlier notes.
- **Star Citizen.**
  - Quantum Travel was reworked in alpha 3.0 for "Hollywood pizzazz". The old system was binary: every short journey looked the same, and long journeys switched effects above a threshold. — [PC Gamer](https://www.pcgamer.com/dev-diary-shows-how-star-citizens-alpha-30-will-make-space-travel-more-hollywood)
  - Calibration begins when the ship is aligned, and spool time varies with distance. — [Star Citizen wiki](https://starcitizen.tools/Guide:Quantum_Travel)
- **Starfield.**
  - Its many loading screens are called "the major, major criticism": you cannot fly into space without one, and space travel stands in for fast travel. Bethesda defended the loading screens as necessary. Some players say they are short enough. — [GamesRadar](https://www.gamesradar.com/starfield-players-are-already-tired-of-all-the-loading-screens-im-shocked-by-how-many-there-are); [80.lv](https://origin.80.lv/articles/bethesda-continues-to-defend-starfield-by-replying-to-steam-reviews); [Nerogames](https://nerogames.beehiiv.com/p/first-look-starfield-20-hours)
  - A streamer's 7-hour attempt to fly to Pluto was covered as a test of whether the game "requires" fast travel. — [HotHardware](https://hothardware.com/news/starfield-streamer-pluto-flight)
- **Kerbal Space Program.**
  - On-rails time warp steps are 1, 5, 10, 50, 100, 1,000, 10,000 and 100,000× (v0.18.2 defaults). A separate physics warp runs 1-4×. — [KSP API docs](https://anatid.github.io/XML-Documentation-for-the-KSP-API/class_time_warp.html); [kOS docs](https://ksp-kos.github.io/KOS/structures/misc/timewarp.html)
  - At high warp, physics such as drag and thrust stops being simulated (forum). The wiki documents warp limits by altitude. — [KSP forum](https://forum.kerbalspaceprogram.com/topic/85930-orbits-sometimes-change-after-time-warp); [KSP wiki](https://wiki.kerbalspaceprogram.com/wiki/Time_Warp)
- **No Man's Sky.**
  - Mods remove or reduce the multi-coloured speed lines and ship halo in pulse flight, including one made "for streamers". — [Nexus Mods](https://www.nexusmods.com/nomanssky/mods/1184); [allmods](https://allmods.net/no-mans-sky-mods/graphics/reduce-pulse-speed-lines-v4-01/)
  - Pulse trips take seconds. A guide claims planets were placed "hours apart" so space exploration would feel more realistic. — [Twinfinite](https://twinfinite.net/guides/no-mans-sky-how-to-fast-travel/)
- **Outer Wilds.**
  - The game runs on a 22-minute loop. — [Wikipedia](https://en.wikipedia.org/wiki/Outer_Wilds)
  - The system is compact by design. — [Game Developer](https://www.gamedeveloper.com/design/live-die-repeat-how-i-outer-wilds-i-piques-curiosity-in-an-ambivalent-solar-system)
  - A player notes there is "no scaling trickery": planets are the size they appear. — [destiny.bungie.org forum](https://destiny.bungie.org/forum/index.php?id=162364)
  - A reviewer calls the autopilot the biggest gameplay flaw. — [Tom's Guide](https://www.tomsguide.com/reviews/outer-wilds)
- **Speed cues (developer and player forums, anecdotal).**
  - Ship motion reads only when something moves relative to the camera. — [Warframe forum](https://forums.warframe.com/topic/267929-space-scenes-really-need-space-dust/)
  - A player-made dust effect around the camera "greatly improved" the feeling of movement. — [Frontier forum](https://forums.frontier.co.uk/goto/post?id=178788)
  - Background stars that moved too fast made a platform look closer than the planet. — [Factorio forum](https://forums.factorio.com/viewtopic.php?p=699984)
  - Stations, belts and galaxies serve as landmarks for orientation. — [GameDev.net](https://gamedev.net/forums/topic/634076-space-game-graphics-with-depth-perception/)

### Inferences
- **Immersive patterns to borrow:**
  - Speed and compression that depend on proximity to bodies (Elite, KSP). Players accept "time runs fast in deep space, slows near planets" as natural.
  - Explicit, game-literate warp readouts such as "×10,000" (KSP).
  - Transitions that are diegetic rather than menus (Elite's hyperspace; the Starfield criticism shows the reverse).
  - Honest scale with few bodies (Outer Wilds).
- **Fake or tiring patterns to drop:**
  - Constant speed lines or streaks. NMS players mod them out, and they make no physical sense in a coast phase.
  - "Every trip looks the same" binary effects (Star Citizen's own diagnosis).
  - Dust or asteroid streams during cruise. Those cues are meant for close-range manoeuvring and dogfights. In Cosmodoro they claim a nearness to objects that doesn't exist; asteroids are ~1 million km apart even in the belt.
- **How to convey speed without debris in Cosmodoro:**
  1. Parallax only near bodies: departure (Earth and Moon receding) and arrival (planet growing, moons shifting).
  2. Slowly changing telemetry: distance to target, falling heliocentric speed, rising light time, falling sunlight %.
  3. Slow angular change: Earth shrinking to a point, the Sun shrinking from 32′ to 21′ (Mars) or 6′ (Jupiter), the destination brightening and then resolving into a disc.
  4. A warp-factor readout that steps down near the destination.
  5. Rare TCM puffs as "life signs" of the ship.

### Gaps
- No GDC talk or developer interview on the rationale for Elite's supercruise (e.g., the 7-second habit, gravity-well slowdown) was found. Speeds and the 57-min figure come from community guides.
- No primary source gives Outer Wilds' planet sizes or ship speeds.
- Everspace was not researched.
- Star Citizen's quantum speed figures conflict across wiki pages, so they are omitted.
- The current KSP warp table was verified only for v0.18.2 defaults.

---

## Q5. Time compression: how to map months of travel into 25-90 minutes plausibly

### Takeaway
NASA and ESA approach movies are already the right model:
- Each compresses days or weeks into seconds.
- Each uses the planet's rotation or its moons as the visible clock.
- Each is framed honestly as a time-lapse.

A linear mapping of a real transfer into 25-90 min fails: Mars would be over 1° for only the last 9-34 seconds. Instead, compress by phase. Let compression fall as the ship nears a body, as KSP warp limits and Elite's gravity-well slowdown do, and show an honest mission clock and warp factor.

### Cited Findings
- **Real time-lapse compression ratios.**
  - Juno: 17 days into ~1,500 frames. The span matched Callisto's ~17-day orbit, so the moons' "ballet" is the clock. — [Spaceflight101](https://spaceflight101.com/?p=18877); [Astronomy Now](https://astronomynow.com/2016/07/06/see-jupiters-galilean-moons-in-motion-from-junos-camera/)
  - Voyager 1 Blue Movie: 66 frames, one per ~10-h rotation, spanning ~28 days. — [NASA photojournal](https://science.nasa.gov/photojournal/voyager-1-blue-movie/)
  - Cassini: 45 frames over 53 days, one map per rotation. — [Photojournal PIA06082 (archive)](https://webarchive.library.unt.edu/eot2008/20080924152539/http://photojournal.jpl.nasa.gov/catalog/PIA06082)
  - MESSENGER departure: 358 frames over 24 h, one Earth rotation. — [Planetary Society](https://www.planetary.org/articles/0826_Images_from_the_August_2_2005)
  - BepiColombo: 10-min cadence over ~20 h. — [ESA Science](https://sci.esa.int/web/bepicolombo/-/bepicolombo-s-final-glimpses-of-earth)
  - Hayabusa2: 19 frames from 200,000 to 36,000 km. — [JAXA](https://www.hayabusa2.jaxa.jp/topics/20151224_04_e/)
  - Rosetta: ~6 weeks closing from 5 to 2 million km, with the comet at "a few pixels" a month before arrival. — [Photojournal PIA18376](https://photojournal.jpl.nasa.gov/catalog/PIA18376); [Universe Today](https://www.universetoday.com/113626/rosetta-closing-in-on-comet-67pchuryumov-gerasimenko-after-decade-long-chase/)
- **Film devices.**
  - A title card ("JUPITER MISSION / 18 MONTHS LATER"). — [Trailers From Hell](https://trailersfromhell.com/?p=59823)
  - Hibernation through a 2-year leg (Interstellar, fan wiki). — [Interstellar Wiki](https://interstellarfilm.fandom.com/wiki/Endurance)
  - A race, with arrival measured in days of lead, as tension (For All Mankind). — [Cult of Mac](https://www.cultofmac.com/778518/for-all-mankind-recap-happy-valley-apple-tv/)
- **Game devices.**
  - Explicit warp steps up to 100,000× and warp limits near bodies (KSP). — [KSP API docs](https://anatid.github.io/XML-Documentation-for-the-KSP-API/class_time_warp.html); [KSP wiki](https://wiki.kerbalspaceprogram.com/wiki/Time_Warp)
  - Speed falls near masses, and players drop at a fixed ETA (Elite). — [Elite wiki](https://elite-dangerous.fandom.com/wiki/Supercruise)
  - Spool time scales with distance (Star Citizen). — [Star Citizen wiki](https://starcitizen.tools/Guide:Quantum_Travel)
  - A 22-min loop, close to one pomodoro (Outer Wilds). — [Wikipedia](https://en.wikipedia.org/wiki/Outer_Wilds)
- **Real phase lengths to anchor a script.**
  - Injection burn ~8 min (Mars 2020). — [Spaceflight Now](https://spaceflightnow.com/2020/07/29/atlas-5s-launch-timeline-on-the-mars-2020-mission/)
  - Approach subphase: the final 45 days. — [JPL press kit](https://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/mission)
  - Orbit-insertion burns of 27 / 35 / 96 min (MRO and Hope / Juno / Cassini). — sources in Q2

### Inferences
- **Why linear fails (computed).** One real day becomes 5.8 s (25 min) to 20.9 s (90 min) of a Mars session, 1.5-5.4 s for Jupiter and 0.7-2.4 s for Saturn. The destination exceeds 1° only in the last 9.3 s (25 min) or 33.5 s (90 min) of a Mars session, and exceeds 5° for just 1.7-6 s. Earth drops below 1° in the first 15-53 s.
- **Average compression (computed).**

  | trip | 25-min session | 90-min session |
  |---|---|---|
  | Mars | ×14,900 | ×4,100 |
  | Jupiter | ×57,500 | ×16,000 |
  | Saturn | ×128,000 | ×35,500 |

  These fall neatly within KSP's familiar ×10,000-×100,000 steps.
- **Recommended phase budget with computed warp factors.** Each phase has its own compression, which falls as the ship nears a body. Phases are departure 0-6%, cruise 6-84%, approach 84-96% and arrival 96-100%. Approach starts at Mars 0.1° (T−16.8 d) or Jupiter/Saturn 0.5° (T−22/23.5 d) and ends at 5°. Arrival runs to the middle of the insertion burn.

| trip / session | Departure (real first day) | Cruise | Approach | Arrival (incl. turn and burn) |
|---|---|---|---|---|
| Mars 25 min | 1.5 min, ×960 | 19.5 min, ×17,800 | 3.0 min, ×7,900 | 1.0 min, ×430 |
| Mars 50 min | 3.0 min, ×480 | 39 min, ×8,900 | 6.0 min, ×4,000 | 2.0 min, ×210 |
| Mars 90 min | 5.4 min, ×270 | 70 min, ×4,900 | 10.8 min, ×2,200 | 3.6 min, ×120 |
| Jupiter 25 / 90 min | ×960 / ×270 | ×72,000 / ×20,000 | ×10,200 / ×2,800 | ×1,500 / ×410 |
| Saturn 25 / 90 min | ×960 / ×270 | ×162,000 / ×45,000 | ×10,700 / ×3,000 | ×2,000 / ×550 |

- **Two size-mapping options within those phases (computed).**
  - **(A) Phase-true.** Earth shrinks from ~30° to ~2° during departure. The destination is a point through cruise. In approach it grows from 0.1° to 5°, doubling every ~32 s in a 25-min session or ~1.9 min in a 90-min one. In arrival it grows from 5° to ~85°+, doubling every ~15 s (25 min) or ~53 s (90 min).
  - **(B) Continuous log growth.** A constant doubling time is perceptually uniform: size goes from ~0.05° to 40°, doubling every 2.6 min (25 min) or 9.3 min (90 min).
    - The edge of a 5° disc then moves only ~0.7 arcmin/s (25 min) or ~0.2 arcmin/s (90 min). That is below the rough 1-2 arcmin/s motion-detection figure in Q6, so growth reads as "it got bigger" rather than as motion.
    - Honest-clock consequence: real Mars grows ~16,000× (9″ to ~40°, 14 doublings) over the trip. Spacing distance log-uniformly puts the session's midpoint at ~1.25 million km, about T−5 days. In other words, about 98% of mission time is spent in the first half of the session, so a HUD mission clock would race early and slow late. Present this as warp stepping down, KSP-style.
  - A hybrid works too: keep the main view phase-true, and show the destination in a 2-5° long-range inset that follows option (B).
- **Rotation as the clock, but decoupled for calm (computed).** Using NSSDC periods (Mars day 24.6 h, Jupiter 9.9 h, Io's orbit 1.77 d) at approach warp (~×8,000-10,000), Mars would turn once every ~11 s and Jupiter every ~3.5 s, and Io would orbit in ~15 s. That is too busy. Use a slow "presentational" rotation (one turn per 2-4 min) in the main view. Keep true-rate rotation for a small "approach movie" inset or a recap at arrival, as the Voyager and Cassini movies did.
- **HUD clock design.** Show three slowly changing truths together:
  1. Mission day ("Day 212 / 259").
  2. Warp factor ("×17,800", stepping down at phase changes; each step is a quiet milestone).
  3. Light-time ("signal delay 11 min 20 s").

  Each changes smoothly at ≤ 1 Hz and never oscillates.

### Gaps
- I found no study testing how users perceive nonlinear time mapping in ambient or focus contexts. The "perceptually uniform log growth" claim relies on general Weber-law reasoning, not a source retrieved here.
- The exact running times of the NASA approach movies (seconds of playback) were not verified, only frame counts and spans.
- No source was found for The Martian's on-screen "Sol" counters or for how For All Mankind captions its transits.

---

## Q6. What is calm enough for a focus timer: acceptable motion in peripheral vision during long sessions, and how to keep a sense of progress

### Takeaway
Motion onsets, looming objects and abrupt transients capture attention; slow, continuous, gradual change does not. Large-field optic flow, like streaming dust, drives vection (the illusion of self-motion), and changing or rotating flow is the most provocative.

So the cruise should have:
- zero optic flow;
- no object onsets;
- only gradual changes in size, phase, light and numbers, kept below rough motion-detection rates.

Visible motion belongs to the four transitions.

The current scene breaks these rules everywhere: dust passing at 30-60°/s, looming rocks up to ~10-14° wide, ±4° roll, flicker, and flybys at 25/50/75%. That likely explains much of "breaks immersion", because it is both physically false and attention-grabbing.

### Cited Findings
- **Motion onset, not motion, captures attention.** Abrams & Christ (2003) found that motion per se does not automatically attract attention but the onset of motion does. — [PubMed](https://pubmed.ncbi.nlm.nih.gov/12930472/). A 2010 follow-up by Abrams and colleagues reportedly found motion onset captures attention more effectively than motion offset or continuous motion. The paper was identified from search results and not read. — [Attention, Perception & Psychophysics 72(5)](https://link.springer.com/article/10.3758/APP.72.5.1311)
- **Looming captures; receding may not.** Franconeri & Simons (2003) found translating and looming stimuli capture attention but receding ones do not, and proposed a "behavioral urgency" account. — [Franconeri & Simons PDF](https://visualcognition.psych.northwestern.edu/publications/FranconeriSimons_Motion.pdf). This is disputed: later work found receding objects can capture attention in stereoscopic 3D, and that looming and receding prioritization can be equal. — [SciELO review](https://www.scielo.br/j/pn/a/VDmtz96hS9yVTyrtdh6DFMJ/?lang=en); [Skarratt et al. (Hull)](https://hull-repository.worktribe.com/output/460957/prioritization-of-looming-and-receding-objects-equal-slopes-different-intercepts)
- **Gradual change goes unnoticed.** When changes are slow enough, the change signal doesn't capture attention and even large changes can go undetected. — [Simons, Franconeri & Reimer 2000, Perception 29:1143](https://visualcognition.psych.northwestern.edu/publications/Simons_etal_gradual.pdf). Gradual changes are harder to detect than changes made during a disruption. — [Psychologica Belgica 2006](https://psychologicabelgica.com/articles/128)
- **Vection and the periphery.** The original claim is that the peripheral retina dominates visually induced self-motion while central vision handles object motion. — [Brandt, Dichgans & Koenig 1973](https://link.springer.com/doi/10.1007/BF00234474)
  - Search-result summaries of this literature say a central 30° stimulus could not induce vection while peripheral stimulation (up to 120°) could. They also say the perceived self-rotation matches stimulus speed up to ~90-120°/s.
  - The same summaries note that later work contradicts the peripheral-dominance hypothesis.
  - I could not confirm which document holds these figures or check them against the original; treat them as unverified. Candidate review: [NASA NTRS PDF](https://ntrs.nasa.gov/api/citations/19850001742/downloads/19850001742.pdf)
- **Visually induced motion sickness and speed.**
  - A Human Factors study used rotation speeds of 0, 2, 14 and 34°/s and found sickness can occur even without vection. — [Ji et al. 2009](https://www.ieda.ust.hk/dfaculty/so/pdf/Ji-et-al-2009-HumanFactors.PDF)
  - Changing vection exacerbates simulator sickness. — [UOW](https://ro.uow.edu.au/hbspapers/1651)
  - Rotational motion, especially pitch and roll, caused severe sickness, while translational motion gave strong vection with little sickness. — [Oulu thesis 2024](https://oulurepo.oulu.fi/handle/10024/51863)
  - A small 1994 thesis found peak symptoms at 100°/s drum rotation. — [Humboldt State](https://digitalcommons.humboldt.edu/etd/1483)
- **Motion thresholds (weak evidence).**
  - A teaching source gives roughly 1-2 arcmin/s to detect motion with a stationary reference and 10-20 arcmin/s without one. I could not confirm this against a primary study. — [Brainscape flashcards](https://www.brainscape.com/flashcards/11296517/packs/19597230)
  - A 1961 Human Factors study tested stimulus motion of about ¼-2 arcmin/s. — [Human Factors 3(3), 1961](https://doi.org/10.1177/001872086100300302)
- **Players find busy speed effects distracting.** No Man's Sky mods strip speed lines and halos, one aimed at streamers. — [Nexus Mods](https://www.nexusmods.com/nomanssky/mods/1184)
- Earlier notes already cover motion in the periphery (Bartram 2001), disruption of reading, WCAG 2.3.3, prefers-reduced-motion, and frame-rate throttling. — `focus_app_ux_sound.md` §3

### Inferences
- **Diagnosis of the current v5 scene (computed from the code).**

  | Element | What the code does | Why it matters |
  |---|---|---|
  | Dust | 1,500 points moving at 0.53 scene units/s past a camera ~0.52 units behind the ship | Peak angular speed is ~60°/s for points passing 0.5 units away, ~30°/s at 1 unit and ~15°/s at 2 units. On a monitor that is ~12-36°/s on the retina, the range used in motion-sickness studies (Ji et al.), and it is large-field radial flow that drives vection. |
  | Rocks | 18 rocks, up to 0.17 units across, at 0.24 units/s | Up to ~10-14° wide when passing at 0.7-1 unit, and each one looms, which captures attention (Franconeri & Simons). |
  | Flyby worlds | One world at each milestone, radius 0.26-0.44 units, passing 1.6-2.2 units to the left over 36 s | Grows to ~14-32° and sweeps at ~17°/s at its closest. It is an onset, looms, and is physically impossible on a Mars route. |
  | Ship roll and bob | ±4° roll on a 16.5-s period; bob on a 10-s period | Periodic motion in central vision. |
  | Engine | Plume and glow modulated at ~6 Hz plus random per-frame jitter | Flicker. |
  | Launch and arrival | Warp streaks plus an FOV kick from 52° to 59° | Onset-heavy transients. |
  | HUD speed | Oscillates ±0.6 km/s every 9 s | No physical meaning. |

- **A quantified calm budget for cruise.**

  | Channel | Budget during cruise | Basis |
  |---|---|---|
  | Optic flow (particles or rocks passing the camera) | None | Real space shows none (asteroids are ~1 million km apart); passing flow drives vection and sickness |
  | Object onsets | None abrupt; anything new fades in over ≥ 20-30 s | Motion onset captures attention; gradual change goes unnoticed |
  | Looming objects | Only the destination, growing at an edge speed ≤ ~1 arcmin/s (option B in Q5) | Looming captures attention; rough detection figure of 1-2 arcmin/s |
  | Camera | Locked hull or window camera; drift ≤ 0.5° over ≥ 60 s, or none; never roll | Rotation and changing flow are the most provocative |
  | Ship | No roll or bob; slews ≤ 6°/min, ≤ 1-2 per session; RCS puffs < 1 s, 2-3 per session | Real attitude behaviour (Hubble, Mars 2020) |
  | Stars | Static; parallax only from camera rotation, never from translation | Stars are effectively at infinity |
  | Light sources | Steady; no flicker or twinkle | DNEG's anti-flicker priority (earlier notes); no scintillation in vacuum (not separately sourced) |
  | HUD numbers | Smooth, ≤ 1 Hz updates, monotonic, no oscillation | Avoids transients |
  | Transitions with visible motion | ≤ 4 per session: departure 1.5-5 min, approach start, flip-and-burn, orbit; ≤ 60 fps only then | Concentrates attention capture where it is wanted |

- **How to keep a sense of progress without motion:**
  1. Earth's shrinking crescent, then a point.
  2. The Sun's shrinking disc.
  3. The destination brightening, reaching full phase at mid-trip, then half-phase as it resolves into a disc.
  4. Telemetry: falling heliocentric speed, rising light time, falling sunlight %, distance to go.
  5. A mission clock with warp steps.
  6. Quiet milestone captions: TCM-1, "Earth is now a star", "signal delay passes 10 min".

  All of these are honest and change slowly enough to stay below attention-capture thresholds while staying visible on any glance.
- **A reduced-motion mode** can reuse the same script: freeze the camera, crossfade between phases, and keep telemetry. Earlier notes cover WCAG and prefers-reduced-motion.

### Gaps
- I found no study of 3D space-flight ambient visuals during real focus work. The calm budget combines lab attention studies with design inference.
- Motion-detection thresholds in the far periphery and on screens were not found in a primary source; the 1-2 / 10-20 arcmin/s figures are weak.
- Vection numbers (central 30° vs. peripheral) come from summaries and are contested.
- No evidence was found on the battery or thermal cost of running a 60-fps WebGL scene for 90 minutes. Earlier notes suggest throttling.
