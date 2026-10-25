# Phase 3 — avatar story world and Phase 4 handoff

Implemented September 18, 2026. Development: http://127.0.0.1:5173/.

## Phase 2 → Phase 3 handoff

The frozen Phase 2.6 contract is documented in phase-2.6-polish.md. Phase 3 uses the same canvas, renderer, scene, AvatarRig, CameraRig, lights, floor and GSAP ticker. Its third ScrollTrigger starts exactly at the second trigger's end. Phase 1 and Phase 2 keep their existing distances and choreography.

The first 3.5% of Phase 3 is a quiet arrival hold. Desktop keeps the exact arrival camera through 19%. Mobile gently reframes after the boundary to place readable copy above the proxy. Nothing teleports and no new camera is created.

The document has its full responsive height before JavaScript initializes, so native history restoration can return to deep story positions. Responsive rebuilds retain progress within the active phase.

## Introduction

Final copy:

> Hi, I'm  
> Deepanshu.  
> I build digital products where engineering, intelligence and experience come together.  
> AI Product Engineer

Instrument Serif and champagne gold carry the name; Manrope carries the concise supporting statement. Greeting reveals at .035–.065, name at .055–.095, statement at .085–.125, and role at .105–.14. The composition holds until .19 and resolves by .25. These are normalized story progress values, not seconds.

## Story path

A thin, physical Three.js tube starts at [0,-45,0], directly continuing the arrival groove. It draws ahead of the avatar from .155. The centerline is the same Catmull-Rom curve used for the root trajectory. It bends gently through an open world, with no corridor, DOM progress bar or CSS timeline.

Desktop control points relative to the story origin are:

`[0,0,0], [0,0,-5], [-3,0,-12], [2,0,-22], [4,0,-31], [-2,0,-41], [0,0,-48]`.

Scroll controls curve distance, root orientation, structure emergence, camera framing and typography. Shared geometry is created once; the path advances through its index draw range. Reverse scrolling reconstructs the same state.

## Chapters

| Chapter | Readable beat | Environmental progression |
|---|---|---|
| Foundation | “It starts with understanding.” Computer Science with an AI focus; B.Tech, ABES Institute of Technology | A simple footing, sparse vertical members and one rising connection |
| Development | “Pieces become possibilities.” Interfaces, APIs and data | The line branches into several connected components at different heights and depths |
| Full Stack | “From interfaces to complete systems.” Experience connected to dependable systems | Offset structural frames join through depth into a small interconnected assembly |
| Intelligence | “Information becomes context.” Retrieval, connected knowledge and AI agents | Sparse fragments and relational lines gather around a restrained context surface; RAG is only foreshadowed |
| Real Products | “Built to leave the drawing board.” Requirements through deployment | Earlier structural language combines into a coherent open product assembly |

Root pauses occur around .29–.335, .415–.46, .54–.59, .67–.72 and .80–.85. The camera continues its small scroll-controlled framing change through those pauses. Previous structures fade into the distance and become dormant without being destroyed.

Important copy stays readable in DOM. The visual layer is decorative to assistive technology; a semantic, screen-reader-accessible transcript contains every chapter once. Chapter announcements update at meaningful transitions.

## Avatar

AvatarRig retains ownership of world transforms. The current AvatarPlaceholder geometry is unchanged. Logical states are IDLE, TURNING, WALKING and STOPPING, derived from scroll progress. Translation has eased starts/stops and remains on the ground. Orientation follows the path tangent, with an initial turn and a final turn toward the camera.

The visual adapter now accepts `setStoryPose(pose)`. A future DeepanshuAvatar.glb can sit beneath AvatarRig and use the logical state, curve distance, walk direction and look target to drive real animation. Centralized settings expose scale, ground offset, orientation offset and camera framing offset. No fake skeletal walk, gestures, narration or audio were added.

## Camera

The persistent CameraRig supports STORY_INTRO, STORY_FOLLOW, FOUNDATION, SYSTEMS, INTELLIGENCE and PHASE4_HANDOFF. Desktop moves between right- and left-weighted compositions, closer human framing and wider structural views. It follows a continuous sequence of eased position/target/FOV keyframes, not a fixed camera directly behind the avatar.

Mobile uses a shorter journey and a more stable elevated framing, keeping copy above the character. At the final handoff, movement and orientation settle completely.

## Content and sources

All copy is centralized in src/story/storyContent.ts. docs/story-content-sources.md lists every displayed statement and its source. Education and technical themes come from the supplied resume; identity is consistent with Opening.tsx. The introduction uses the user's proposed copy. Editorial chapter titles make no additional achievement claims. There are no temporary content placeholders, invented metrics, employers, awards or technologies.

## Exact transform state

Coordinates use +Y up. Rotations are radians. The visual adapter faces local +Z.

| Property | Phase 3 start, desktop | Phase 3 start, mobile |
|---|---|---|
| Avatar position | [0,-45,0] | [0,-45,0] |
| Avatar rotation / scale / state | [0,0,0] / [1,1,1] / IDLE | same |
| Camera position | [-1.85,-43.35,6.5] | [-.57,-43.35,7.7] |
| Camera target | [-1.85,-43.9,0] | [-.57,-43.9,0] |
| FOV / mode at boundary | 38 / STORY_READY | 38 / STORY_READY |

| Property | Phase 3 end, desktop | Phase 3 end, mobile ≤700px |
|---|---|---|
| Avatar position | [0,-45,-48] | [0,-45,-28.8] |
| Avatar rotation | [0,.25,0] | [0,.25,0] |
| Avatar scale / state | [1,1,1] / IDLE | [1,1,1] / IDLE |
| Camera position | [-2.4,-43,-40] | [-.65,-41.8,-19.3] |
| Camera target | [-2.4,-43.8,-48] | [-.65,-42.6,-28.8] |
| FOV / mode | 40 / PHASE4_HANDOFF | 40 / PHASE4_HANDOFF |
| storyOrigin | [0,-45,0] | [0,-45,0] |
| storyDirection | [0,0,-1] | [0,0,-1] |
| Story Path | COMPLETE | COMPLETE |

The final avatar position is the origin from which Phase 4 may continue. The original storyOrigin remains the Phase 2/3 boundary. The camera and root finish settling by .985. “THE JOURNEY CONTINUES / What I build.” is only a handoff marker.

## Lifecycle and performance

At the end, the tunnel and outer descent structure are dormant, glass/shards inactive, and Phase 3 chapter structures dormant but retained. The complete path and distant final horizon remain visible. The original arrival supports are faded and no longer submitted. The floor and shadow stay continuous.

One instanced box mesh per chapter shares reusable geometry. Desktop uses 45 structural instances across five chapters; mobile uses 33. Line connections use simple buffer geometry. The tube has 160 desktop / 96 mobile segments and four radial sides. Unchanged scroll frames skip trajectory, camera and structure updates; the existing low-rate atmospheric pass uses the same application ticker. No runtime dependencies, extra renderer, React frame updates or new application RAF loop were introduced.

Development debug mode reports story progress, chapter, root/camera transforms, state/mode, origin/direction, look target, path progress, active structures and both handoff progress values. DOM state is exposed on the root's data-story-progress/data-story-phase attributes. Production does not expose the scene debug payload.

## Validation

- TypeScript and production build pass.
- All 36 Playwright checks pass: the 26 opening/cinematic regressions plus 10 story tests covering exact handoff, ordered copy reveal, rooted pauses, deterministic reversal, continuous incremental transforms, four viewport sizes, deep reload, responsive reconstruction, semantic content, reduced motion and context loss.
- Complete Phase 1 → Phase 2 → Phase 3 forward/reverse recordings were captured at 1440×900 and 390×844 with no application errors. Files: artifacts/review/phase1-through-story-1440.webm and phase1-through-story-390.webm.
- Production story scroll samples measured 16.7ms median and 17.0ms p95 frame intervals on both emulated viewports. One canvas, no horizontal overflow, no application errors and no production debug payload. Results: artifacts/story-production.json.
- Final scene submission: 16 calls / 2,790 triangles desktop; 20 calls / 2,446 triangles mobile. Different framing and shorter mobile travel leave more retained groups inside the mobile frustum, despite lower geometry counts.
- The existing Windows PMREM shader precision warning appeared in the desktop production run. The standard Vite advisory for the lazily loaded Three.js chunk remains. Neither prevented rendering or tests.

## Mobile and reduced motion

Mobile scales route depth to 60% and width to 55%, reduces structural/connection complexity and uses a stacked introduction. Typography remains readable above the avatar rather than compressing desktop columns. Reduced motion and unavailable/lost WebGL use a stationary SVG world with restrained fades and a simple path reveal; all five chapters and the semantic transcript remain available.

## Files

Created: src/story/storyContent.ts, storyConfig.ts, StoryTrajectory.ts, StoryWorld.ts, StoryDirector.ts; src/components/StoryOverlay.tsx; src/styles/story.css; tests/story.spec.ts; scripts/capture-story.cjs, review-story.cjs, verify-story.cjs; docs/story-content-sources.md and this report.

Extended: src/animation/usePhaseOne.ts; src/scenes/portraitScene.ts; src/components/Opening.tsx; src/cinematic/AvatarRig.ts, CameraRig.ts, CinematicWorld.ts, LandingEnvironment.ts, AnimationDirector.ts; src/styles/global.css; README.md and prior report pointers.

## Known limitations and deferred work

The proxy moves at the root only, as requested. Real turning/walking/breathing requires the future GLB and skeletal clips. RAG is an abstract hint, not a detailed retrieval experience. No project cards, screenshots, project worlds, carousel, skill-logo cloud, contact section, final CTA or Phase 4 capability experience was added. Testing uses local Edge/Chromium, including emulated mobile viewports; physical mobile hardware and Safari/Firefox are not verified.

Development URL: http://127.0.0.1:5173/.
