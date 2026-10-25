# Phase 2.6 — final polish and frozen arrival contract

Completed September 18, 2026. Development: http://127.0.0.1:5173/.

## Background depth

The eight-sided tunnel and its geometry are preserved. Outer fragments now use three separate depth/contrast tiers at Z=-9, -29 and -57, with fewer instances (24 desktop, 12 mobile). Far masses are larger, simpler and lower contrast. Fog extends to 96 during descent. A single opaque gradient plane at Z=-95 adds restrained cool haze and a distant light trace without stacked transparent planes. Perspective separates the apparent motion of the shaft, middle structures and distant silhouettes.

## Glass climax

All timings below are normalized Phase 2 scroll progress, not elapsed seconds:

| Beat | Progress |
|---|---|
| Edge and reflection discovery | .375–.55 |
| Contact and localized stress | .56–.58 |
| Primary radial cracks | .56105–.5782 |
| Secondary branching | .5782–.595 |
| Fully cracked, intact hold | .595–.62 |
| Staggered structural separation | .62–.735 |
| Avatar passes below the glass | .65–.76 |
| Debris fades and becomes inactive | .79–.87 |

The camera aligns before contact and retains its tiny deterministic impulse. Shaft contrast and particles recede during anticipation. Two tests explicitly verify completed cracking with zero displaced shards during the hold, staggered failure, and exact reverse reconstruction.

## Shards

The existing seeded Voronoi fracture remains: 42 desktop / 24 mobile fragments with irregular size hierarchy and actual thickness. Directions now vary more strongly in depth, gravity and rotation axes. Two desktop fragments pass nearer the camera; mobile omits that behavior. Shards use shared materials with zero transmission. Intact glass alone retains desktop transmission.

## Arrival environment and tunnel memory

The broad ground remains continuous, with sparse seams and one short groove toward -Z. The large circular outline is replaced by a small contact response that disappears by .925. Restrained shaft-like support remnants sit behind/right of the proxy; distant beams establish a horizon. The left remains clear for future typography. Arrival particles are reduced to 12 desktop / 5 mobile motes.

## Camera and exact handoff

The camera now moves laterally after landing; the avatar does not slide sideways or rebound off the floor. Existing compression recovers around a planted feet anchor. The 38-degree final framing is unchanged in apparent human scale.

| Property | Desktop | Mobile ≤700px |
|---|---|---|
| Avatar position | [0,-45,0] | [0,-45,0] |
| Avatar rotation, radians | [0,0,0] | [0,0,0] |
| Avatar scale / state | [1,1,1] / IDLE | [1,1,1] / IDLE |
| Camera position | [-1.85,-43.35,6.5] | [-.57,-43.35,7.7] |
| Camera target | [-1.85,-43.9,0] | [-.57,-43.9,0] |
| Camera FOV / mode | 38 / STORY_READY | 38 / STORY_READY |
| storyOrigin | [0,-45,0] | [0,-45,0] |
| storyDirection | [0,0,-1] | [0,0,-1] |

Coordinates use +Y up; the avatar visual faces +Z. Origin and direction are exported through CinematicWorld and centralized in config.

## Lifecycle and performance

Final states: TunnelSystem DORMANT, GlassSystem INACTIVE, ShardSystem INACTIVE, outer descent environment dormant, arrival environment ARRIVAL_IDLE. Hidden glass avoids fracture updates. Dormant tunnel avoids particle-buffer updates. The existing GSAP ticker redraws idle arrival atmosphere at no more than 20 Hz without modifying the avatar or camera. Reverse scrolling restores visible systems deterministically.

Final arrival: 15 draw calls, 1,438 desktop / 1,402 mobile triangles. One renderer/canvas and one application ticker remain. No runtime dependencies were added. Desktop and mobile production samples measured 16.7ms median and 16.8ms p95 frame intervals on this Windows host, with no application errors or overflow. These are local Edge measurements, not physical mobile-device guarantees. The pre-existing Windows PMREM shader precision warning and Vite Three.js chunk advisory remain.

Build and all 26 browser tests passed. Coverage includes Phase 1, glass order/hold/depth, fixed grounding, rapid reversal, reload, breakpoint restoration, four cinematic viewport sizes, reduced motion and WebGL loss. Desktop/mobile continuous forward/reverse recordings are in artifacts/review/phase26-1440.webm and phase26-390.webm.

## Files

Created: src/cinematic/AtmosphericBackdrop.ts, scripts/review-phase-26.cjs, this report.

Modified: src/cinematic/config.ts, AvatarRig.ts, CameraRig.ts, TunnelSystem.ts, OuterEnvironment.ts, GlassSystem.ts, ShardSystem.ts, LandingEnvironment.ts, CinematicWorld.ts, CinematicEvents.ts, AnimationDirector.ts; src/components/CinematicFallback.tsx; tests/cinematic.spec.ts; README.md and report pointers.

## Deferred at this checkpoint

Project cards, project streams, real avatar/GLB, skeletal animation and Phase 3 were not part of this pass. The later Phase 3 request begins from this frozen contract.
