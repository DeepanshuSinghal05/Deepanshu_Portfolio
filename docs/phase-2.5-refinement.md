# Phase 2.5 — cinematic refinement and current handoff

Historical checkpoint. [Phase 2.6](phase-2.6-polish.md) supersedes this arrival contract; [Phase 3](phase-three-story-handoff.md) now continues from it.

September 18, 2026. Development server: http://127.0.0.1:5173/.

This supersedes the final camera/avatar coordinates in `phase-three-handoff.md`. Phase 1 and the existing Phase 2 concept remain intact. No project cards, project belts or Phase 3 content were implemented.

## Before versus after

| Before | Refined result |
|---|---|
| Thin, similarly bright lines repeated at equal intervals | Substantial dark vertical supports, heavier major frames, quiet tertiary lines and connection blocks |
| Empty dark backdrop | Incomplete architectural fragments at three world depths, softened by fog |
| Nearly constant following distance | A restrained scale shot, lateral reveal, acceleration lag, glass anticipation, landing response and closer arrival framing |
| Glass becomes a visible disk late in the fall | Thin reflective cues and lower illumination precede the pane; contact stress precedes cracks |
| Radial and cell cracks develop together | Primary fissures propagate first, then branching cell boundaries, then staggered separation |
| Floor switches on and shaft remains prominent | Floor fades into view before contact; shaft and outer structure recede through the landing |
| Small settled proxy | A closer full-body composition with an explicit STORY_READY camera and IDLE avatar |

## Tunnel and outer environment

The original eight-sided shaft is retained. Primary rails are volumetric `.22 × .32` supports. Secondary frames vary in thickness, tertiary lines remain dim, and joints establish assembly detail. Bays are located at Y=`[5,-1,-7.5,-12,-15.5,-18.5,-22,-26,-33,-41,-48]`, providing wider upper spacing, denser middle structure and an open lower chamber. Selected lower frames widen by up to .65 world units. Forward-facing frames are thinner so they do not dominate the proxy.

`OuterEnvironment` adds 36 desktop / 18 mobile instanced abstract beam fragments, each with a restrained edge accent, at approximately Z=-8, -20 and -32. They include interrupted vertical spans and incomplete cross frames, not buildings, a city or content panels. Their real depth produces parallax at different apparent speeds. Fog starts at 16 and extends to 78 world units during descent, reducing contrast with distance. During arrival, fog contracts toward 9–42 and the outer forms fade to a clean background.

## Descent zones and lighting

| Normalized Phase 2 progress | Zone and visual purpose |
|---|---|
| 0–.19 | Entry: preserved portrait-to-proxy handoff; architecture emerges progressively |
| .19–.30 | Upper shaft: broad bays, soft upper illumination, first distant structures |
| .30–.40 | Deep shaft: denser structure and a wider scale shot; upper lighting weakens |
| .40–.47 | Acceleration: stronger passing geometry, slight camera lag, restrained particulate streaking |
| .47–.535 | Lower chamber: wider/open structure, lower illumination and reflection cues |
| .535–.56 | Approach: camera closes slightly, particles quiet and the glass resolves |
| .56–.64 | Impact: stress, primary fissures, branching and initial structural separation |
| .64–.76 | Breakthrough: concise secondary fall; shaft dominance begins decreasing |
| .76–.91 | Landing: floor anticipation, feet contact, compression and rebound |
| .91–1 | Arrival: environment quiets and the camera settles into human-scale framing |

Lighting stays within charcoal, warm neutral and restrained champagne tones. Upper key intensity evolves from 1.8 toward .85 in depth, then 1.45 in the lower chamber and 1.6 after landing. A subtle point source below the glass becomes relevant gradually, rather than appearing at contact. No colored light show, bloom or distortion was added.

## Motion, velocity and camera

AvatarRig's deterministic root trajectory, explicit impact point and landing point remain unchanged. Descent perception now combines variable framing, physical parallax, structural variation, lighting and particulate motion instead of merely increasing root Y speed.

Velocity is derived from normalized progress over the existing ticker's delta time, capped at 1.2 and damped exponentially with rate 7. Large seeks are excluded. It affects only particle drift and short streak length/opacity. After scrolling stops, this secondary response decays; the root and camera remain exactly at their timeline positions. At/after landing the velocity is zero. No second RAF, raw wheel-to-position mapping or physics engine was introduced.

CameraRig remains the sole cinematic camera owner:

- `TUNNEL_FOLLOW`: includes a temporary pullback of up to 2.2 units, restrained lateral reveal and an acceleration lag of up to 1.1 units. Mobile reduces drift, pullback and FOV response.
- `GLASS_IMPACT`: closes the framing for discovery and contact, with the existing restrained micro impulse.
- `LANDING`: adds a small contact reaction and blends continuously toward the final camera.
- `STORY_READY`: stationary 38-degree full-body composition. The proxy is on the right and the left remains empty.

## Glass discovery, fracture and shards

Reflection strips and the perimeter begin resolving from .375, ahead of the pane's .44–.55 discovery range. The pane has lower opacity, controlled physical transmission on desktop, and no transmission on mobile. It is supported by the lower light and reflects the generated environment. These reflections are art directed; the strips are not a full dynamic mirror of the shaft.

Contact remains at `[0,-32,0]` and .56 progress. A small stress ring appears briefly. Nine irregular radial fissures are subdivided and revealed outward from the exact contact. Primary propagation spans the early part of impact; Voronoi boundary branching begins after 30% of impact progress. Structural separation begins at .59. The pane therefore does not explode in one frame.

The existing seeded 42 desktop / 24 mobile extruded shards are retained. Radial delay, varied travel distance, rotation axis, rotation amount and depth bias remain deterministic. Individual nonlinear motion exponents add variation in separation speed. Two desktop pieces travel toward the foreground; mobile omits that treatment. Shard opacity builds gently from the intact glass appearance, and expensive physical transmission is not applied to shards. Upward scrolling returns every piece to its original transform.

## Landing and chaos to calm

The ground now fades in from .69 through .81, before feet contact at .87. Existing root compression/rebound remains intact. The contact shadow subtly responds, a restrained ground-ring response supports impact, and the camera adds a small positional reaction. No fake leg bones or skeletal animation were added.

Shaft opacity starts resolving after .69 instead of remaining prominent until recovery. Outer architecture fades from .73 to .965. Dust reduces before glass contact, shards disappear through the post-break fall, and tighter fog absorbs the remaining structures. The ground and grounded proxy remain in a cleaner composition. At completion, hidden tunnel/glass/shards retain their deterministic data for reversal rather than being destroyed.

## Silent future audio hooks

`CinematicEvents.ts` exports an EventTarget. Optional consumers may listen for `cue` events whose detail includes `cue`, `direction`, `progress` and `seek`. Cues cover acceleration, contact, fracture, shatter and landing. Forward/reverse crossings are distinguished, and large jumps are marked so future audio can ignore seeks. Holding a frame does not repeat a cue. No audio assets, autoplay or audio playback are implemented.

## Exact final handoff

World units, XYZ rotations in radians. Mobile means width <=700 CSS pixels.

| State | Desktop | Mobile |
|---|---|---|
| AvatarRig position | `[1.85,-45,0]` | `[0.57,-45,0]` |
| AvatarRig rotation | `[0,0,0]` | same |
| AvatarRig scale | `[1,1,1]` | same |
| Avatar logical state | `IDLE` | same |
| Camera position | `[0,-43.35,6.5]` | `[0,-43.35,7.7]` |
| Camera target | `[0,-43.9,0]` | same |
| Camera FOV | `38°` | same |
| Camera mode | `STORY_READY` | same |
| Tunnel | `DORMANT` | same |
| Outer environment | `SETTLED` | same |
| Glass / shards | `INACTIVE` / `INACTIVE` | same |
| Master and phase progress values | all `1` | same |
| Secondary velocity / root compression | `0` / `0` | same |

Impact point remains `[0,-32,0]`; initial landing point remains `[0,-45,0]`. Phase 3 can begin from this state without remounting the world. It should retain the existing scroll/ticker owner and preserve reversal.

## Performance, mobile and verification

Added architecture uses two instanced draws with shared box geometry/materials. The shaft retains instanced supports and frames. Desktop uses 110 small particulate points, mobile 42, with short low-opacity streaks only during acceleration. Mobile halves distant structure count, reduces camera movement and keeps the existing lower shard count and simpler glass. DPR remains capped at 1.5 desktop / 1.25 mobile. No postprocessing, dynamic shadows, physics dependency or full scene replacement was introduced.

The world redraws for progress/layout changes and while the small particle response is decaying, then stops. Resources remain owned by the persistent world's existing disposal path. Reduced motion and WebGL failure retain the quiet vector narrative, with no falling camera or foreground shards.

Local headless Edge production sampling after refinement measured a 16.7ms median frame interval, p95 17.0ms desktop and 16.9ms mobile. No application/WebGL errors, horizontal overflow or extra canvases were reported. Development debug fields are absent from production. These are host measurements, not physical-phone results. The existing desktop PMREM X4122 precision warning and Vite's lazy Three.js chunk advisory remain documented; shaders compile and render.

The tests cover forward/reverse reconstruction, rapid seeks, reloads, breakpoint restoration, contact/landing coordinates, reduced motion, WebGL loss, full-body bounds, final lifecycle states, velocity decay without root drift, and one-shot directional cue crossings. Phase 1's existing regression coverage remains in place.

## Files and preserved scope

Created:
- `src/cinematic/OuterEnvironment.ts`
- `src/cinematic/CinematicEvents.ts`
- `docs/phase-2.5-refinement.md`

Refined:
- `src/cinematic/config.ts`
- `src/cinematic/TunnelSystem.ts`
- `src/cinematic/CinematicWorld.ts`
- `src/cinematic/CameraRig.ts`
- `src/cinematic/GlassSystem.ts`
- `src/cinematic/ShardSystem.ts`
- `src/cinematic/LandingEnvironment.ts`
- `src/scenes/portraitScene.ts` — passes the existing ticker time to the world for secondary velocity damping; the Phase 1 render path is unchanged.
- `tests/cinematic.spec.ts` — updated final coordinates and added framing/lifecycle/velocity/event checks.
- `README.md`, `docs/phase-three-handoff.md` — point to the new current handoff.

The placeholder and AvatarRig trajectory architecture are retained. The original Phase 1 timeline, design, signature and handoff DOM were not redesigned. Before-refinement source/screenshots are retained in ignored `artifacts/phase25-before/` for comparison.

## Deferred work

- Real avatar/GLB integration, calibrated visual scale and authored skeletal absorption/recovery.
- Floating project cards, project belts and project content around the shaft.
- Phase 3 story, typography, introduction, TURN/WALK/STOP choreography and content.

Glass remains a deterministic cinematic approximation, and the proxy is deliberately neutral. Safari/Firefox and physical devices remain untested. Stop at the story-ready frame.
