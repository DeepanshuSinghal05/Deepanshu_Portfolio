# Phase 4C final polish + Phase 4D — Holo Gesture

25 September 2026. YatraLok, Prisha and DOJ are frozen. Holo is the fourth and final cinematic Project World. The ending is a seed for the next phase; detailed case studies, experience, contact and a complete Project Worlds finale have not been added.

## DOJ final polish

- Raised the document material's restrained emissive contribution from 0.025 to 0.075 and the existing moving light from 18 to 22. Inactive documents retain a faint presence during context gathering; the whole world is not brightened.
- Separated the three selected chunks laterally and in depth, retaining their existing identities, ink structure, destination and retrieval sequence. Document/instance counts are unchanged.
- Kept the formed response visible through local progress 0.877. The real response interface arrives between 0.823 and 0.85, so the response structure and the populated interface overlap causally.
- Extended the response camera hold through 0.922 before the existing resolution and departure.
- Replaced the old empty title handoff with a sensing rectangle that emerges as DOJ fades, beginning at absolute project progress 1.615. The Holo camera inherits DOJ's exact final pose at 1.64.
- Frozen copies and SHA-256 values are in `artifacts/phase4c-frozen/`. The YatraLok/Prisha environment and trajectory hashes still match their earlier approved freeze. CameraRig and AvatarRig were not rebuilt.

## Holo assets and source evidence

| Evidence | Use |
| --- | --- |
| `project_story_assets/holo_gesture/normal_mode.png` | Large real Normal Mode product reveal; the NOTES orb's image coordinates register to the first procedural orb. |
| `project_story_assets/holo_gesture/jarvis_golden_mode.png` | Real JARVIS reveal aligned to the transformed spatial objects. The actual asset retains teal content orbs alongside gold system accents. |
| `project_story_assets/holo_gesture/holo_gesture.mp4` | Reference only. 132.4 seconds, 30 fps. Twelve sampled timestamps document hand movement, moved orbs, opened notes, and manipulation of the Apollo/fossil props. Contact sheet and timestamps are in `artifacts/holo/`. |
| `project_story_assets/holo_gesture/README.md` | Gesture and mode descriptions, self-hosted tracking, local speech, props and scale-driven separation. |
| `D:/Projects/Holo-GESTURE/holo-gestures-free/holo.html` | Verified pinch gating, smoothed drag, release velocity, note reader/crush thresholds, two-hand scene manipulation, peace reset, continuous scale-driven separation, and tracking initialization. |

The source uses self-hosted MediaPipe first, with a CDN/model-download fallback if local loading fails. “Tracked locally” refers to inference; this portfolio does not claim that the original application never makes any network requests. The original README describes MIT code and Smithsonian CC0 models. The source application is evidence, not code copied wholesale into the portfolio.

Four optimized WebP derivatives total **212,218 bytes across both quality tiers**. Only the two images for the current device tier are requested. Their provenance, dimensions and original hashes are in `artifacts/holo/asset-manifest.json`. Original files are unchanged.

Intentionally omitted from the shipped portfolio: the recording, the original application, MediaPipe/model/WASM files, webcam feed, speech synthesis, optional effects gestures, shelf docking interactions and the heavy GLB scans. The local Apollo GLB is about 5 MB and the fossil about 14 MB. The procedural command-module study represents the supported prop concept and is explicitly captioned as an abstraction, not presented as the original scan. No capability outside the documented project was added.

## Holo story

Progress below is local to Holo, appended at absolute project coordinates **1.64–2.72**. Earlier projects retain their original scroll allocations.

| Local progress | What the viewer sees |
| --- | --- |
| 0–0.10 | A quiet sensing field; landmarks progressively form a hand; Project 04 / Holo Gesture / Hands become the interface. |
| 0.105–0.185 | The real Normal Mode interface, with short visible labels identifying its main areas. |
| 0.185–0.232 | The NOTES orb gains depth and leaves its exact screenshot location. |
| 0.232–0.327 | Thumb and index close, the orb responds, then follows hand travel with a small analytic lag. |
| 0.327–0.39 | The pinch releases; momentum carries the same orb onward, decelerating into a settled position. |
| 0.39–0.467 | A second hand arrives; both attach to the Apollo-inspired object and stretch it. |
| 0.467–0.577 | Eight shell sections, the upper cap and base separate along controlled vectors; the camera moves semi-around the structure; shrinking recombines it. |
| 0.577–0.635 | The interaction transfers to a spatial note: pinch, move and release. |
| 0.635–0.735 | Two hands expand the note into a reader; crushing condenses its structure and exposes a small, silent voice waveform. No article or AI-generated summary is invented. |
| 0.735–0.817 | Two pinches briefly scale/rotate the environment. A peace pose resets the displaced composition, restores the note, and settles the objects. |
| 0.817–0.89 | The same environment shifts from teal to restrained gold. Its objects register to the supplied JARVIS image before returning to depth. |
| 0.89–0.964 | A concise technical annotation sits by the tracked hand, followed by a pullback showing hand, orb, note and prop: Hands become the interface. Gesture → intent → response. |
| 0.964–1 | Hands fade; gold objects become faint and dormant, receding beyond the avatar. The existing avatar returns and the forward path remains open. |

## Technical representation

The rectangle represents a camera's sensing field. Two reusable hand systems each use 21 instanced joints and thin connected line segments following MediaPipe's landmark topology. The hand forms are authored data, not realistic anatomy and not the source app's exact HUD: the actual application primarily displays a fingertip cursor.

Pinch poses illustrate interpretation of thumb/index proximity. Object trajectories demonstrate response, lag, release momentum, two-hand scale and controlled separation. No physics engine, hand tracker, camera permission request or hidden app iframe is initialized. All motion is a direct function of scroll progress; there are no event-triggered one-shot gesture simulations or frame-history dependencies.

The prop is a geometric study. Notes contain generic line structures. The voice indicator is silent. The technical label explains **camera → MediaPipe → landmarks → gesture → object response**, with “Tracked locally” as the minimal processing statement.

## Camera

The existing CameraRig receives continuous interpolated poses from `HoloTrajectory`. FOV remains 40 degrees throughout Holo. The table uses coordinates relative to the inherited Holo origin on desktop.

| Shot | Camera | Target |
| --- | --- | --- |
| Exact entry | `[0, 7, 20]` | `[0, 2, 0]` |
| Product hold | `[0, 7, 12]` | `[0, 6, -18]` |
| Pinch | `[-1.4, 6.5, -1]` | `[-3, 6, -16]` |
| Throw follow | `[9, 7, -3]` | `[8, 6, -23]` |
| Stretch | `[5, 8, -1]` | `[0, 6, -21]` |
| Exploded view | `[8, 8, -8]` | `[0, 6, -21]` |
| JARVIS | `[0, 7, 12]` | `[0, 6, -18]` |
| Resolution pullback | `[0, 10, 10]` | `[0, 5, -21]` |
| Forward seed | `[-3, 6, -13]` | `[-3, 2, -34]` |

Mobile uses a 0.65 spatial scale, narrower lateral travel, closer pinch shots, and additional distance for the full product images and separated prop/two-hand composition. There is no camera spin, shake, FPS movement or orbit-control input.

## Avatar

Entry preserves DOJ's endpoint: desktop `[7, -45, -211]`, mobile `[3.85, -45, -134.75]`, yaw 0.25, idle. Between Holo progress 0.075 and 0.13, the existing avatar moves out of frame. It remains absent from the major gesture interactions and never performs the tracked-hand gestures.

Re-entry begins at 0.94. At the end it is idle, yaw 0.1, at desktop `[4, -45, -245]` or mobile `[1.9, -45, -156.85]`. The existing placeholder avatar is retained, as requested for this phase.

## Engineering and validation

Added source: `HoloHand.ts`, `HoloEnvironment.ts`, `HoloTrajectory.ts`, `holoFallback.ts` in `src/projects/`. Added asset preparation, visual audit and performance scripts; `tests/holo.spec.ts`; four WebP assets; this report and audit artifacts.

Modified source: `DOJEnvironment.ts`, `DOJTrajectory.ts` for the bounded polish; `ProjectWorld.ts`, `projectConfig.ts`, `projectPresentation.ts`, `ProjectOverlay.tsx`, `projects.css` for integration; `CinematicWorld.ts`, `LandingEnvironment.ts`, `AtmosphericBackdrop.ts` for a reversible Holo-only dark palette and floor treatment. Updated DOJ/project tests for the appended final endpoint and README/report status. No production source file was removed. No package was added.

The Holo factory is instantiated lazily near DOJ's ending. Its two image textures are prepared at project progress 1.59, and DOJ media is released after 1.69. Reverse travel evicts Holo textures and prepares DOJ again. Existing texture-generation guards prevent late image loads from resurrecting evicted resources. Generated label texture disposal is explicit; the shared scene disposer releases hand/prop geometry, materials and instanced resources. No second renderer or animation timeline was introduced.

Desktop, 390×844, 320×568 and 844×390 viewports are exercised. Mobile reduces satellites and spatial points (28 versus 64) and adjusts shot distance. Reduced motion and context-loss fallback use readable SVG gesture states and real still images without a WebGL canvas or large camera travel. Screen-reader transcript covers every beat.

Reverse and rapid jumps reconstruct the exact same hand identities/landmarks, object positions, separation, note states, mode, camera and avatar state. Tests cover gold → teal, summary → reader, separated → recombined, throw → held, detection → no hand, Holo → DOJ, refresh, breakpoint reconstruction, context loss and final replay. Tests also intercept camera access and check for absent MediaPipe, WASM, model, video and audio requests.

Validation result: **72 regression checks covered successfully across the full run and targeted reruns**. The full run initially passed 71/72; the remaining interior phase-boundary assertion required tolerance for browser scroll-pixel rounding. It passed after that correction. The 19 DOJ/Holo checks were rerun after the camera/framing refinements. Exact inherited camera equality is also tested directly on the trajectory constructors.

Production profiling in headless Edge: median requestAnimationFrame interval **16.7 ms**, p95 **17.1 ms**, for both desktop 1440×900 and mobile viewport 390×844. Holo peaks at **44 / 43 draw calls**, **6,624 / 6,272 triangles**, and **2 image textures** (plus one small generated label texture). Across all four worlds, peaks are **66 / 62 draw calls**, **26,118 / 21,958 triangles**, and **19 cached project images**. Desktop peak draw calls are unchanged; the mobile maximum is one call above the earlier three-world measurement during the handoff overlap. These are frame intervals on this host, not isolated GPU timings or a physical-phone performance guarantee. The profile traverses all worlds, reverses Holo, advances slowly through pinch/separation, and performs rapid cross-world jumps. It verifies finite transforms, one canvas, no video/audio element, no production debug attributes, no horizontal overflow, and no console/page errors. Full results: `artifacts/holo/performance.json`.

Known limits: browser viewport emulation is not a physical-phone benchmark; no Safari/Firefox testing is claimed. The original screenshot's camera-blocked notice is retained as source evidence; the portfolio does not attempt camera access. The 21-point hands, Apollo structure, generic notes and silent speech indicator are deliberate cinematic abstractions. The original application's real tracking quality and browser speech behavior are not re-tested here.

## Next-phase handoff

| Contract | Desktop | Mobile |
| --- | --- | --- |
| Origin / avatar | `[4, -45, -245]` | `[1.9, -45, -156.85]` |
| Camera | `[4, -39, -224]` | `[2.9725, -41.1, -137.2]` |
| Target | `[4, -43, -245]` | `[1.9, -43.7, -156.85]` |
| FOV | 40 | 40 |
| Avatar yaw/state | 0.1 / IDLE | 0.1 / IDLE |
| Available forward direction | `[0, 0, -1]` | `[0, 0, -1]` |

The hand systems are invisible. The Holo orb, note and prop are faint, stationary, and receded. Earlier project groups are dormant, and their media has been released. A quiet dark field and grounded avatar remain. `projectWorldsHandoff` exposes the exact contract in development diagnostics. No next section or fifth project exists.

## Development

- Portfolio: http://127.0.0.1:5173/
- Holo review entry: http://127.0.0.1:5173/?project=holo-gesture
- DOJ review entry: http://127.0.0.1:5173/?project=doj-chatbot
- Production preview: http://127.0.0.1:4173/
- Build: `npm run build` passes.
- Remaining build advisory: the shared Three.js chunk is about 587.6 kB minified / 148.0 kB gzip. Playwright prints the inherited NO_COLOR/FORCE_COLOR environment advisory. No application runtime errors were found.

This completes the requested four cinematic Project Worlds. Work stops at the quiet handoff seed.

