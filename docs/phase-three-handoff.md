> Historical Phase 2 report. See [the frozen Phase 2.6 arrival](phase-2.6-polish.md) and [the current Phase 3 → Phase 4 handoff](phase-three-story-handoff.md).

# Phase 2 implementation and Phase 3 handoff

Implemented September 17, 2026. Development: http://127.0.0.1:5173/. No Phase 3 introduction, About, skills, experience or projects have been added.

## Architecture and ownership

The existing `usePhaseOne` lifecycle remains the single owner of Lenis, the GSAP ticker, responsive rebuilding and renderer disposal. There are two adjacent scrubbed ScrollTriggers: the approved opening, followed by `AnimationDirector`. Phase 1 retains its exact original scroll distance (3.2 screens on desktop; 2.7 mobile; 1.2 reduced). Phase 2 adds 8 screens on desktop, 6.5 mobile and 3 reduced. Native sticky positioning holds the same stage throughout.

One WebGL renderer and one canvas persist through both phases. `portraitScene` retains the original face-cage scene and camera. At the handoff, the same canvas is reparented from the clipped portrait mount into the cinematic mount. `CinematicWorld` owns a persistent second scene for the entire shaft, fracture and landing; those events do not recreate canvases or scenes. Reversing to progress zero returns the canvas to its original portrait mount. There is no extra RAF, physics engine or per-frame React state.

## Important files

- `src/cinematic/config.ts`: world-space impact/landing points, avatar calibration, tunnel dimensions, camera destination, phase ranges and scroll distances.
- `src/cinematic/AnimationDirector.ts`: normalized scroll progress, editorial handoff, aperture expansion, accessible state and reduced-motion interpretation.
- `src/cinematic/CinematicWorld.ts`: scene, lighting, environment reflections, subsystem coordination, diagnostic snapshot and disposal.
- `src/cinematic/AvatarRig.ts`: replaceable visual interface, neutral geometric placeholder, feet-origin root choreography and skeletal hook.
- `src/cinematic/CameraRig.ts`: sole owner of cinematic camera transforms, follow framing, impact impulse and final composition.
- `src/cinematic/TunnelSystem.ts`: instanced structural rails and depth markers, transparent octagonal walls and sparse dust.
- `src/cinematic/GlassSystem.ts`: delayed glass discovery, physical pane and structural rim, fracture orchestration.
- `src/cinematic/ShardSystem.ts`: seeded Voronoi cell generation, contact-origin cracks, extruded shards and deterministic trajectories.
- `src/cinematic/LandingEnvironment.ts`: ground, contact shadow and restrained landing marker.
- `src/components/CinematicFallback.tsx`: vector interpretation for reduced motion and WebGL failure.
- `tests/cinematic.spec.ts`: contact, reconstruction, rapid seeks, landing, responsive framing, reload, reduced motion and context loss.
- `scripts/verify-phase-two.cjs`: production frame sampling, console checks, debug exclusion and final screenshots.

## Exact Phase 1 changes

1. `Opening.tsx`: wrapped the existing stage children in `.editorial-layer`, preserving their containing-block dimensions. Added the cinematic canvas mount, vector fallback, accessible announcement and final replay button. Original portrait, signature, typography, copy and navigation remain unchanged.
2. `phaseOneTimeline.ts`: replaced `end: 'bottom bottom'` with the original explicit responsive scroll distance. This prevents the added Phase 2 range from stretching the approved choreography. No Phase 1 tween was changed.
3. `usePhaseOne.ts`: connected the second director to the existing lifecycle and ticker; passed its progress to the renderer; synchronized both timelines on refresh; retained the active phase and its local progress across responsive rebuilding; cleaned both triggers on teardown. A pending loader cannot mutate a disposed lifecycle.
4. `portraitScene.ts`: preserved the existing cage render path, added the persistent cinematic world and moved the same canvas at the phase boundary. The world gets current progress immediately after asynchronous loading. World resources are disposed with the renderer.
5. `global.css`: appended scoped cinematic rules. Original Phase 1 style declarations were not redesigned. The parent stage stays charcoal during the handoff, then the renderer supplies the world background.
6. Opening tests now seek the original Phase 1 distance explicitly, because the document is longer. Native End reaches the new final replay control.

## AvatarRig and future GLB

`AvatarRig` owns translation, rotation and scale. `AvatarPlaceholder()` returns an `AvatarVisual`, currently made from a sphere, capsules and feet blocks. The small face bar and forward foot extension establish +Z direction; this is a choreography proxy, not a proposed final character.

To integrate a real model, return `{ object: normalizedModelGroup, setLandingPose }` from a GLB visual adapter and pass it to `new AvatarRig(visual)`. Normalize the model to 2.1 world units tall, +Y up, +Z forward and a local origin between the soles. Geometry must not add its own world trajectory. Calibrate the entry scale/feet offset in `config.ts`; do not rewrite the shaft or glass choreography.

`setLandingPose(compression, recovery)` is the future skeletal hook. A model adapter can sample authored knee/ankle/hip/spine/arm animation by these progress values. Sample an AnimationMixer at deterministic clip time, rather than advancing it using real-time delta. The current slight root compression can be reduced when the actual skeletal absorption is available.

## Sequence

| Phase 2 progress | Event |
|---|---|
| 0 | Exact approved Phase 1 endpoint |
| .01–.12 | Editorial composition recedes; aligned proxy crossfades within the portrait frame |
| .08–.24 | Aperture expands and camera establishes the vertical shaft |
| .19–.56 | Scroll-driven downward trajectory, acceleration, then contact anticipation |
| .44–.55 | Glass becomes visible beneath the feet |
| .56–.595 | Feet reach the impact point; cracks grow from contact; restrained camera impulse |
| .59–.71 | Irregular cells separate and rotate; center pieces move first |
| .64–.76 | Root crosses the broken plane and continues to Y=-38 |
| .76–.87 | Secondary descent to the landing point |
| .87–.905 | Root compression with feet anchored |
| .905–.943 | Small rebound and recovery |
| .91–1 | Root settles to the right; camera becomes stable; left stays empty |

## Tunnel, glass and shards

The shaft is vertical in world Y, radius 4.4, extending below the landing region. Eight instanced rails and 17 desktop/13 mobile levels establish scale. A single low-opacity octagonal wall shell avoids excessive transparent overlap. Fog, perspective, repeated geometry and relative camera movement communicate depth; dust remains sparse.

The pane is a real thin octagonal mesh centered on `impactPoint`. Desktop uses controlled physical transmission, thickness, IOR and a generated PMREM room environment; mobile omits transmission. The glass is hidden until approach, and the landing environment is hidden until the post-glass fall.

Seed 817 generates 42 desktop/24 mobile Voronoi cells clipped to an octagon. Each is an extruded polygon with real thickness. Additional irregular radial fissures begin at the exact impact origin; branching cell boundaries grow outward by distance. Shards store initial position, direction, travel, rotation axis/amount, depth bias and delay. All transforms are pure functions of fracture progress. Two desktop pieces travel toward the foreground; mobile omits those foreground trajectories. No irreversible physics or random values are generated during rendering.

## Landing and final state

Feet are the root origin. Y reaches -45 at .87. Root Y stays at contact during compression, rises by at most .065 during the short rebound, and settles back to -45. The character remains feet-first. A soft contact shadow supports the ground relationship. The shaft and glass recede, and the left half is intentionally empty.

All values below are world units/radians. Mobile is viewport width <=700 CSS pixels.

| Value | Desktop | Mobile |
|---|---|---|
| AvatarRig position | `[2.2, -45, 0]` | `[1.05, -45, 0]` |
| AvatarRig rotation XYZ | `[0, 0, 0]` | `[0, 0, 0]` |
| AvatarRig scale | `[1, 1, 1]` | `[1, 1, 1]` |
| Camera position | `[0, -42.9, 7.6]` | `[0, -42.9, 8.2]` |
| Camera target | `[0, -43.95, 0]` | `[0, -43.95, 0]` |
| FOV | `42°` | `42°` |
| impactPoint | `[0, -32, 0]` | same |
| landingPoint (initial contact) | `[0, -45, 0]` | same |
| Ground plane Y | `-45.025` | same |

At the endpoint: master progress, spatial, tunnel, descent, speed, glass, impact, fracture, breakthrough, landing, settle and final composition progress all equal **1**. Compression is 0. Ground and proxy are visible; tunnel and glass groups are hidden. The final transform is stable with no idle motion. Reduced-motion/no-WebGL mode ends in an equivalent right-side vector composition rather than running the falling camera.

Phase 3 should continue from these transforms under the existing ticker and scroll owner. It should not reset the world, replace the canvas, or remount the proxy. Reversal must still restore the opening.

## Performance, verification and limitations

No new dependencies were added. DPR remains capped at 1.5 desktop / 1.25 mobile. Rails and markers are instanced; placeholder and shard materials are shared. The world renders only when progress or layout changes, pauses with hidden tabs, and uses no postprocessing or dynamic shadow maps. Environment maps, contact texture, geometries, materials, instanced buffers, listeners, triggers and renderer are disposed on teardown.

Local headless Edge production sampling measured a 16.7ms median frame interval on desktop and mobile, with p95 of 16.8ms desktop / 16.7ms mobile. This is a host measurement, not a physical mobile benchmark. Production checks showed one canvas, no application/WebGL errors, no overflow and no diagnostic data even with `?debug`. Development-only diagnostics are available in the cinematic mount's `data-debug` attribute with `?debug`.

The Windows graphics compiler emits an X4122 precision warning during desktop PMREM setup. It does not prevent shader compilation or rendering. Tests exclude only this observed warning; it is not suppressed in application code. Vite also reports its standard advisory for the lazy Three.js chunk (~146KB gzip).

The proxy cannot perform skeletal impact absorption or realistic balance recovery; those belong to the future rig. Glass fracture is an art-directed deterministic approximation, not material simulation. Foreground shards use motion and transparent highlights without depth-of-field blur. Reflections use a static generated environment. Reduced motion and unavailable WebGL use a deliberately quiet vector narrative. Validation uses Chromium/Edge emulated viewports; Safari, Firefox and physical phones have not been tested.

Run `npm run build`, `npm run test:e2e`, and (with preview on port 4173) `node scripts/verify-phase-two.cjs`. Screenshots and measured results are in ignored `artifacts/`. Stop here: Phase 3 content is intentionally absent.
