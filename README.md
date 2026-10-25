> Current implementation (25 October 2026): the supplied `project_story_assets/new_model.glb` is integrated with idle, distance-scrubbed walking, turning, and scroll-controlled fall/impact posing. Hero, content and all environments retain their approved design. See the [final implementation report](docs/final-animated-avatar.md) and [deployment steps](docs/deployment.md). [Local portfolio](http://127.0.0.1:5173/) · [Contact preview](http://127.0.0.1:5173/?section=contact). Earlier phase notes below are historical.

# Deepanshu Singhal — cinematic portfolio



Phase 4B is implemented: YatraLok and Prisha Enterprises continue from the frozen capability world, then settle at the Project 03 handoff. Read the [Phase 4B report](docs/phase-4b-project-worlds.md) for architecture, evidence classification, source checks, privacy handling, transitions, validation and limitations.



- [Full local portfolio](http://127.0.0.1:5173/)

- [YatraLok review entry](http://127.0.0.1:5173/?project=yatralok)

- [Prisha review entry](http://127.0.0.1:5173/?project=prisha-enterprises)



Run `npm run dev`, `npm run build` and `npm run test:e2e`. Project capture: `node scripts/capture-projects.mjs`; production verification: `node scripts/verify-projects.mjs` against preview port 4173. Asset regeneration is documented in `scripts/prepare-project-assets.py`; it writes sanitized copies only, leaving original evidence untouched.



The same renderer, cinematic camera, avatar rig, Lenis instance and GSAP ticker continue through all worlds. HOLO Gesture and DOJ Chatbot remain future registrations only. Previous phase reports preserve their original contracts: [Phase 2.6](docs/phase-2.6-polish.md), [Phase 3.1/4A](docs/phase-3.1-workworld.md), and [story source audit](docs/story-content-sources.md).



The sections below document the original opening implementation and its historical validation; current project behavior is described in the Phase 4B report.



## Archived Phase 1 implementation notes



A cinematic opening built with React, TypeScript, Vite, GSAP/ScrollTrigger, Lenis, and Three.js. The revision follows the supplied screenshot: a large centered portrait, pale oversized name behind the subject, and a faceted 3D cage confined to the face. The latest 212354 recording informs a centered rectangular contraction, opposing oversized background type, and a champagne-gold signature drawn directly over the portrait. Warm porcelain transitions to deep charcoal. Phase 2 is not implemented.



## Run and verify



```sh

npm install

npm run dev -- --host 127.0.0.1

npm run build

npm run test:e2e

```



Development: **http://127.0.0.1:5173/**. Tests use the installed Microsoft Edge Chromium engine. For current production checks, run `npm run preview -- --host 127.0.0.1 --port 4173`, then `node scripts/verify-story.cjs`. `node scripts/capture-opening.cjs` and `node scripts/capture-story.cjs` capture development screenshots.



## Architecture



- `src/components/Opening.tsx`: stage, background contours, name, supporting copy, navigation and footer.

- `src/components/Avatar.tsx`: replaceable `Avatar → AvatarVisual` adapter with normalized pose input; original image, vector silhouette mask and accessible static face-cage fallback.

- `src/components/Signature.tsx`: canonical SVG imported inline for ordered drawing.

- `src/animation/usePhaseOne.ts`: one GSAP ticker for Lenis, avatar and scene; responsive lifecycle, refresh synchronization, event and resource cleanup.

- `src/animation/phaseOneTimeline.ts`: one reversible master timeline and one ScrollTrigger; responsive portrait destination is recalculated on layout refresh.

- `src/animation/phaseOneState.ts`: normalized pose and explicit handoff destination.

- `src/scenes/portraitScene.ts`: perspective camera and actual faceted ellipsoid from an icosahedral mesh. Its edges are aligned to the portrait's head, respond subtly to pointer movement, and follow the same scroll pose. No body-sized oval remains.

- `src/styles/global.css`: responsive full-viewport composition, reduced motion, typography and layering.



Native sticky positioning owns the stage. Lenis uses the GSAP ticker, following the [official Lenis integration](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger). There are no per-frame React state updates or independent application RAF loops.



## Dependencies



React/React DOM provide components and lifecycle. GSAP/ScrollTrigger control the reversible choreography and SVG pen strokes; Lenis handles smooth wheel input. Three.js renders the perspective face cage. Fontsource serves Manrope and Instrument Serif locally. Vite, TypeScript and the React plugin provide development and production builds. Playwright verifies browser interactions. This revision adds no dependencies.



## Assets and identity



- `public/images/deepanshu-avatar.png`: supplied 295 × 426 original, unchanged.

- `public/images/portrait-mask.svg`: vector silhouette used as a CSS mask.

- `src/assets/identity/ds-signature.svg`: original three-path DS signature. An ascending D stem and returning bowl overlap an S, followed by a finishing sweep. GSAP draws each real path length with dash offsets; reversing the scroll erases the same strokes.



Only professional facts supported by the supplied resume are used. No reference branding, portrait, recording or other proprietary assets are shipped.



## Responsive, accessibility and performance



The portrait is centered on all sizes. Desktop opens with a close bust crop, wide background lettering and side copy. Mobile keeps the face visible, reduces supporting copy and fades the lower portrait. Both render the 3D face cage. Reduced motion replaces portrait travel with a crossfade, disables idle/pointer motion, and uses a static vector cage without loading Three.js. Missing WebGL also falls back to that vector.



The camera uses the same measured image dimensions as the avatar adapter. DPR is capped at 1.5 on desktop and 1.25 on mobile. The face cage stops changing at the settled signature state; unchanged frames avoid a WebGL redraw. Hidden pages skip rendering. No postprocessing, video, particles, or model textures are used. Listeners, ticker callbacks, geometry, materials, renderer, timelines and Lenis are disposed on teardown.



Keyboard navigation, native keyboard scrolling, visible focus styles, descriptive image text, a skip-to-identity link and stage announcements remain supported. Fonts are self-hosted and the portrait is preloaded. A refresh reconciles both the visual playhead and accessible chapter state with restored native scroll.



## Validation — September 17, 2026 revision



- TypeScript and production build pass.

- All **14** Playwright tests pass: initial frame and assets, forward/reverse path order, rapid seeking, actual wheel and keyboard input, navigation/replay, five responsive sizes, cross-breakpoint cleanup, same-breakpoint destination recalculation, reduced motion, reload at partial progress, unavailable WebGL, and the centered frame/signature overlap.

- Desktop 1440 × 900 and mobile 390 × 844 production checks report no console errors/warnings, failed assets, or horizontal overflow. All signature paths finish at zero dash offset.

- Local headless Edge scroll samples measured a 16.7 ms median frame interval; 95th percentile was 16.9 ms desktop and 16.8 ms mobile. These are measurements on this host, not physical-device guarantees.

- Application/motion JavaScript is approximately 124 KB gzip, plus the dynamically loaded Three.js chunk at approximately 132 KB gzip. Vite's standard >500 KB raw chunk advisory applies to that Three.js chunk.



## Limitations and continuation



The portrait remains a low-resolution image, not a rigged model. The close crop necessarily magnifies its existing softness. A higher-resolution portrait/render can replace the asset without changing the choreography; a real GLB can replace the visual adapter. The face cage is genuine 3D geometry but is not a reconstructed or tracked face model.



Verification used Edge/Chromium with emulated viewport sizes; physical mobile hardware and Safari/Firefox were not tested. See `docs/phase-two-handoff.md` for the exact ending contract. No tunnel, descent, glass, landing or later portfolio sections exist.



