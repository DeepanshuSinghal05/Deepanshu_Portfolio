# Phase 3.1 and Phase 4A — implementation and handoff

Implemented in the existing local portfolio. Development: http://127.0.0.1:5173/. The experience stops at PROJECT_HANDOFF; no Phase 4B–4D system is mounted.

## Phase 3.1

The introduction, five chapters, editorial serif typography, physical route and final “What I build.” composition are preserved. Foundation uses quiet, rough, warm-grey structure; Development gains ordered sage rails; Full Stack uses cooler connected frames; Intelligence brings sparse sources into a shared context; Products resolves into a warmer, more legible assembly. Materials and relationship hierarchy differentiate the chapters without adding a new environment.

Supporting text changes from grey to warm ivory, with brighter secondary detail and a restrained radial shadow behind each statement. Readable hold time is slightly longer. There are no typography cards or opaque panels.

Root travel now uses quintic easing with zero endpoint acceleration. A short tangent look-ahead anticipates turns, and existing true reading pauses and grounded stops remain. The proxy geometry is unchanged. Camera excursions and FOV variation are smaller; camera interpolation retains the lower peak speed that passed the continuity check. The first quintic camera variant exceeded the existing movement limit and was corrected before freezing.

“Information becomes context.” has fewer competing origin connections and four desktop / two mobile pooled signals converging into its context anchor. Signal positions derive entirely from scroll progress and reverse exactly.

The polished story was tested before Phase 4A development and copied to `artifacts/phase31-frozen/`. Subsequent integration adds only a work-dormancy fade and the next scroll range. The approved Phase 3 endpoint remains:

| Transform | Desktop | Mobile |
|---|---|---|
| Avatar feet | [0, -45, -48] | [0, -45, -28.8] |
| Avatar rotation | [0, 0.25, 0] | [0, 0.25, 0] |
| Camera | [-2.4, -43, -40] | [-0.65, -41.8, -19.3] |
| Camera target | [-2.4, -43.8, -48] | [-0.65, -42.6, -28.8] |
| FOV / mode | 40 / PHASE4_HANDOFF | 40 / PHASE4_HANDOFF |

Scale is 1, root is IDLE, StoryPath is complete and all five chapters are dormant. Reverse and fast-jump checks reconstruct this exact pose.

## WorkWorld architecture

`WorkWorld` is a child subsystem in the persistent `CinematicWorld` scene. It owns the continuing path, initial activation signal, capability assembly and distant spatial markers. `CapabilitySystem` owns six layers of shared, instanced primitives and bounded signals. `WorkTrajectory` derives root and camera poses from normalized progress, using the exact final story pose as its entrance.

The existing `StoryDirector` owns the additional `phase-four-a` ScrollTrigger. `workPresentation` only presents that state in the DOM; it creates no director, timer, camera or loop. `usePhaseOne` retains the same Lenis instance and GSAP ticker, and extends refresh, reload, breakpoint reconstruction and cleanup to the new range. `portraitScene` forwards work progress to the existing renderer. The persistent CameraRig, AvatarRig, lights, ground and contact shadow are reused.

No new React components are created per signal or primitive. Content renders through one `WorkOverlay`, with a semantic transcript and a separate lightweight SVG fallback.

## Sequence

The first 3.5% of the new range is still. A signal then enters the existing StoryPath tail, reaches its new branch and activates the nearby interface. The original title holds, fades, and gives the environment space to open. Prior story structures fade into dormancy while the actual StoryPath remains.

| Work progress | Capability behavior |
|---|---|
| 0–0.12 | Stillness, entering signal, branching path |
| 0.12–0.25 | A restrained interface frame and tinted surface emerge |
| 0.25–0.39 | Deeper logic frames connect to the surface |
| 0.39–0.52 | Data becomes an organized spatial lattice |
| 0.52–0.64 | Communication rails and directed signals activate |
| 0.64–0.77 | Information routes converge into a contextual anchor |
| 0.77–0.91 | A common enclosure unifies the layers as a product |
| 0.91–1 | Signals settle; the forward path opens toward future projects |

These are layers of one persistent assembly, not separate slides. Three concise editorial statements support the visual: “An interface is just the beginning.”, “Systems that connect.” and “From logic to product.” The final handoff reads “Built to be real.”

The avatar moves beside the assembly in four eased legs, stopping to observe it. Root movement, turn and settling are distinct from the replaceable visual. There are no pointing gestures or simulated skeletal walk cycles. Camera modes are WORK_INTRO, CAPABILITY_REVEAL, SYSTEM_EXPANSION, PRODUCT_RESOLUTION and PROJECT_HANDOFF. Camera position, target and FOV interpolate continuously; mobile uses a steadier portrait composition.

## Final Phase 4A → 4B contract

| Transform | Desktop | Mobile |
|---|---|---|
| Avatar feet | [-0.3, -45, -60] | [-0.165, -45, -35.4] |
| Avatar rotation | [0, 0.25, 0] | [0, 0.25, 0] |
| Camera | [-2.7, -41.2, -38] | [-0.815, -39.8, -13.4] |
| Camera target | [2, -43, -63] | [1.835, -40.5, -36.4] |
| FOV / mode | 40 / PROJECT_HANDOFF | 40 / PROJECT_HANDOFF |

Minor binary floating-point representation differences may appear in debug JSON. Scale remains 1. Avatar is IDLE. WorkWorld, capability, product resolution, project handoff and WorkPath progress are all 1. All six layers are RESOLVED; active signal count is zero. Project entry direction is [0, 0, -1], and a visible continuation establishes that direction. Previous story chapters remain DORMANT. `projectWorldActive` is false and the next system is registered but unmounted.

`workConfig` centralizes copy, stage timing, scroll distances, handoff direction and future project names. `ProjectDefinition` has extension points for real media, story beats, camera modes and GitHub/live links. `WorkSystemExtension` defines update/dormancy/disposal contracts for projects, intelligence, experience and finale. YatraLok, Prisha Enterprises, OCR and DOJ Chatbot are registered by name only. No project descriptions, media, screenshots, links or worlds have been invented.

## Content sources

The supplied resume is the factual source, as documented in `story-content-sources.md`. Frontend/backend copy summarizes its full-stack skills; API/data copy uses its REST API and database work; intelligent workflows summarize its RAG/agentic work; “Requirements to deployment” uses its SDLC experience. Titles are editorial descriptions, not new achievement claims. No metrics or additional capabilities were introduced. Future project names come directly from the current user brief.

## Responsive, accessibility and performance

Mobile shortens root travel to 55%, reduces capability width/depth, removes one logic frame and one data row, and uses two signals instead of four. Its camera opens more gradually and reserves the upper screen for readable copy. Text and avatar bounds, plus the whole capability assembly, are checked at desktop, phone, small-phone and landscape sizes.

Reduced motion creates no WebGL canvas. The same text and semantic content accompany a stationary SVG assembly whose layers fade in reversibly. Context loss switches to that fallback without discarding progress or replay. ARIA announcements identify capability stage and completion; the full transcript is available independently of animation.

Geometry is shared and instanced. Signal pools are fixed. No new textures, external media, dependencies or postprocessing passes are added. Primary motion is scroll-derived; no timeout chain or scroll-velocity effect owns narrative state. Static poses use the existing low-rate atmospheric render path. All resources remain covered by persistent-world disposal.

Development `?debug` exposes phase progress, capability stage, mode, product/handoff progress, both path states, branch/exit progress, root transform/state, look direction, camera pose/FOV, capability bounds, active structures/signals, layer states, responsive tier, project activation state, draw calls and triangles. WebGL debug snapshots are compiled out of production. Basic DOM progress attributes remain for deterministic presentation and accessibility testing.

## Validation and artifacts

`npm run build` passes. All 46 end-to-end tests passed; the 10 WorkWorld tests were rerun after the final camera adjustment, including complete-system bounds checks. Tests cover exact handoff/stillness, ordered assembly, true pauses, continuous root/camera/yaw, rapid reversal, no backward content leakage, four viewports, native reload, breakpoint reconstruction, reduced motion, context loss, replay and one-canvas ownership.

Production measurements and continuous review results are recorded in `artifacts/work-production.json` and `artifacts/work-review.json`. `scripts/verify-work.cjs` measures a production build on port 4173; `scripts/review-work.cjs` records the entire opening through WorkWorld forward and backward. `scripts/capture-work.cjs` captures ten states on desktop and mobile. Screenshots and videos live under `artifacts/screenshots/` and `artifacts/review/`.

Measured production frame intervals were 16.7 ms median and approximately 17 ms p95 on desktop and mobile. Both had one canvas, no horizontal overflow, no production debug snapshot, and no application errors. Final development rendering uses 25 draw calls / 4,806 triangles on desktop and 27 / 3,802 on mobile. A nonfatal desktop GPU shader precision warning is retained in the report; no matching rendering failure was observed. Complete forward/reverse recordings finished without application errors on both viewports. The final path-signal correction also passed the handoff/assembly and aggressive-reversal tests.

The existing lazy Three.js vendor chunk still triggers Vite's 500 kB chunk-size advisory. The avatar is intentionally the existing neutral geometric placeholder; final GLB, skeletal clips, sound, project worlds, full RAG, experience and final CTA remain outside this task. Browser-emulated mobile checks do not replace profiling on physical phones.

## Files

Created: `src/work/workConfig.ts`, `WorkTrajectory.ts`, `CapabilitySystem.ts`, `WorkWorld.ts`, `workPresentation.ts`; `src/components/WorkOverlay.tsx`; `src/styles/work.css`; `tests/work.spec.ts`; `scripts/capture-work.cjs`, `verify-work.cjs`, `review-work.cjs`; this report and its generated review artifacts.

Modified: `src/story/storyConfig.ts`, `StoryTrajectory.ts`, `StoryWorld.ts`, `StoryDirector.ts`; `src/styles/story.css`, `global.css`; `src/components/Opening.tsx`; `src/animation/usePhaseOne.ts`; `src/scenes/portraitScene.ts`; `src/cinematic/CinematicWorld.ts`; `README.md`.
