> Historical approved replacement baseline. The final polish and DOJ extension are documented in [Phase 4B.2 / 4C](phase-4b2-4c.md).

# Project Worlds replacement — review and handoff

Implemented for the September 24 brief. Scope ends after YatraLok, Prisha Enterprises and a dormant path toward DOJ. This document supersedes the rejected Phase 4B showcase report.

## 1. Removed/replaced showcase

Removed the old single screenshot slot, six-node architecture diagram, evidence captions, project numbers, flow legends, video proof beats and mid-story controls. `ArchitectureSystem.ts` and `MediaSurfaceSystem.ts` are removed. `ProjectWorld`, `ProjectTrajectory`, project configuration, presentation, overlay and CSS are replacements.

The Phase 4A capability interlude is removed from the active sequence: its overlay, world, trajectory, capability renderer, configuration, presentation and CSS are archived. Projects now follow the approved Phase 3 endpoint directly. Historical code, tests, tooling and presentation media are preserved under `artifacts/rejected-showcase`; original project assets remain untouched.

## 2. Architecture

- `ProjectWorld.ts`: director under the existing persistent `CinematicWorld`; selects lifecycle, upcoming assets, environments and transition state.
- `projectConfig.ts`: project identities, evidence descriptions, beats, links, scroll budgets and future-world registry.
- `ProjectEnvironment.ts`: separate YatraLok and Prisha factories, each with its own geometry, assets and normalized choreography. Shared helpers only create paths and surfaces.
- `ProjectAssetSurface.ts`: real-image surfaces, geographic edge feathering and a guarded texture cache.
- `ProjectTransition.ts`: continuously reshapes sampled YatraLok route geometry toward commerce space; also owns the next-world exit signal.
- `ProjectTrajectory.ts`: independent camera keyframes and avatar route. The returned `StoryPose` drives the existing CameraRig and AvatarRig.
- `projectPresentation.ts` / `ProjectOverlay.tsx`: minimal editorial text, resolution links, accessible transcript and no-WebGL fallback.

The existing Lenis instance, GSAP ticker, ScrollTrigger infrastructure and renderer remain in charge. No new animation loop, separate project renderer, camera instance or skeletal avatar animation was introduced.

## 3. Phase 3 → portal

Project progress starts after 19.4 desktop, 16.4 mobile or 8.4 reduced-motion screen heights. The following sequence occupies 22, 18 or 12 additional screen heights respectively. Total document reservations are 4240, 3540 and 2140svh.

Progress 0–0.025 inherits Phase 3's exact camera/root pose. Its structures then diminish, the existing path gains a warm continuation, and the small **SELECTED WORK** marker introduces the threshold. YatraLok begins at 0.08. There is no capability-card stop between story and projects.

## 4. YatraLok assets used

| Source | Treatment and role |
|---|---|
| `trips-digital-id.png` | Identity card cropped; ID, phone and Aadhaar values masked. Heading and body separate slightly in depth. |
| `dashboard.png` | A shallow journey workspace strip along the route. |
| `yatralok_demo.mp4`, 88 seconds | Actual tracking heading and map frame. Geographic detail is blurred. No recording is autoplayed. |
| `live_tracking.png` | Supplied supporting route concept, map region only. Used for the environmental expansion after the recorded tracking frame; not presented as verified feature evidence. Speed, ETA and location-sharing claims are excluded. |
| `panic-sos.png` | Actual circular SOS control and Emergency Contacts navigation fragment. |

The reproduction script records source hashes, crops, dimensions and provenance in `artifacts/world-asset-manifest.json`. Profile/registration/private contact screenshots are not served.

## 5. YatraLok beats

The viewer approaches a depth-separated identity card, then travels alongside a thin ivory route and the trip workspace. A real tracking frame expands into a feathered map projection, followed by the supplied route concept. Procedural roads, a river-like line, contour rings, destination pins and an avatar-following location ring extend beyond its edges.

Tracking gets a prolonged overhead oblique hold. The camera then moves to the actual circular SOS control. A single scroll-owned radial signal expands, branches reveal, and the contact connection completes. The final pullback puts identity, route, location and safety in one spatial composition. Only here does the compact React / Express / MySQL / Google Maps / Twilio OTP / Ethereum digital ID line appear.

The response network is explicitly conceptual. The inspected SOS implementation toggles local UI state; this portfolio does not claim alert dispatch.

## 6. YatraLok camera states

`PROJECT_PORTAL`, `YATRALOK_INTRO`, `YATRALOK_IDENTITY`, `YATRALOK_JOURNEY`, `YATRALOK_TRACKING`, `YATRALOK_SOS`, `YATRALOK_RESOLUTION`.

Identity uses a diagonal 37° approach with a still read interval at progress 0.135–0.17. Journey rises to 45°. Tracking holds at 44° through 0.265–0.32 with a slight desktop orbit; mobile holds a simpler overhead view. SOS tightens to 36° and holds through 0.36–0.39. Resolution opens to 47° and holds at 0.445–0.47.

## 7. YatraLok final state

At progress 0.47 the desktop avatar is approximately `[4.6184, -45, -86.5667]`, yaw `3.8039`, IDLE. Camera `[-19, -21, -50]`, target `[1, -44, -72]`, FOV 47°. The resolved map, identity and safety route are still present when transformation begins. Exact desktop/mobile contracts appear in section 13.

## 8. YatraLok → Prisha

Progress 0.47–0.56 samples the actual YatraLok route, progressively straightening and moving it into the commerce approach. The same transition line and pooled nodes change position from normalized progress. Map projection, identity and safety connections recede as the camera travels onward. The line terminates at the product transaction origin. The atmosphere shifts from restrained cool mapping accents to warm transaction highlights without a black reset.

## 9. Prisha assets used

| Source | Treatment and role |
|---|---|
| `home.png` | Recognizable storefront hero crop, with account/header and lower promotional counters excluded. |
| `products.png` | Coherent catalogue strip; the real 43-inch ₹12,500 product image and its detail region separate selectively. |
| `checkout.png` | Order summary, delivery/total and Razorpay action only. Personal customer fields excluded. |
| `admin_login.png` | Real Admin Portal crop; email and password values masked; large decorative lock omitted. |
| `admin_dashboard.png` | Orders summary, revenue strip, status distribution and products region become an operational surface at different heights. |

These are actual supplied UI pixels. Dashboard numbers are explicitly demo UI, not portfolio business results.

## 10. Prisha beats

Storefront → product selection → cart → checkout → payment verification → Admin Portal → order operations → full-system resolution.

The storefront approaches obliquely. A catalogue takes over, and one actual product advances while the surrounding catalogue recedes. Its image persists as a smaller transaction token. A bracket-like cart stage leads to the readable summary and a payment action separated in depth. The token passes a restrained gateway ring, then continues toward administration. The final frame includes storefront, transaction path, payment and the layered operations surface.

## 11. Customer → payment → admin choreography

The same product mesh travels along a dedicated 3D spline from catalogue to checkout, gateway and operations. The camera alternates between following the token and moving to the side of the pipeline. It travels behind the storefront's original plane, reaches the sanitized Admin Portal, then rises over the dashboard fragments. The order/status/product regions are laid into shallow spatial depth rather than mounted together on a wall.

Verification is based on the inspected server-side Razorpay HMAC signature flow. The single restrained pulse is a conceptual explanation, not a recorded successful payment. The admin screenshot comes from a demo state; its displayed product/order rows are not asserted to be this same recorded transaction.

## 12. Resolution CTA

Prisha's **Visit live project ↗** and **View code ↗** appear only after its resolution beat begins, around project progress 0.911. They point to `https://prishaent.in` and the existing `DeepanshuSinghal05/Prisha_Enterprises` repository, open in a new tab with `noopener noreferrer`, and support keyboard focus. There are no mid-story buttons or video autoplay controls.

## 13. Avatar and handoff transforms

Coordinates are world-space. Yaw is in radians; root scale remains `[1,1,1]`. Progress 0 is the inherited story end, 0.08 is YatraLok entry, 0.47 is YatraLok resolution, 0.56 is Prisha entry, 0.95 is Prisha resolution, and 1 is the dormant DOJ handoff. The proxy model itself is unchanged.

| Tier | Progress | Avatar | Yaw | Camera | Target | FOV | State |
|---|---:|---|---:|---|---|---:|---|
| Desktop | 0 | [0, -45, -48] | 0.2500 | [-2.4, -43, -40] | [-2.4, -43.8, -48] | 40° | IDLE |
| Desktop | 0.08 | [-5.8551, -45, -51.7869] | 3.4537 | [-7, -39, -45] | [-2, -42, -59] | 43° | WALKING |
| Desktop | 0.47 | [4.6184, -45, -86.5667] | 3.8039 | [-19, -21, -50] | [1, -44, -72] | 47° | IDLE |
| Desktop | 0.56 | [4.9748, -45, -102.3694] | 2.3930 | [-18, -35, -84] | [-5, -38, -107] | 44° | IDLE |
| Desktop | 0.95 | [12, -45, -172] | 0.2500 | [40, -8, -106] | [-1, -44, -133] | 50° | IDLE |
| Desktop | 1 | [12, -45, -172] | 0.2500 | [28, -20, -117] | [9, -44, -155] | 47° | IDLE |
| Mobile | 0 | [0, -45, -28.8] | 0.2500 | [-0.65, -41.8, -19.3] | [-0.65, -42.6, -28.8] | 40° | IDLE |
| Mobile | 0.08 | [-3.3971, -45, -31.4378] | 3.3725 | [-1, -38, -17.8] | [-1, -42, -36.8] | 43° | WALKING |
| Mobile | 0.47 | [2.2699, -45, -54.3037] | 3.7296 | [0, -18, -15.8] | [0, -44, -43.8] | 47° | IDLE |
| Mobile | 0.56 | [2.9753, -45, -64.4674] | 2.4939 | [-3, -37, -45.8] | [-3, -41, -67.8] | 44° | IDLE |
| Mobile | 0.95 | [6.6, -45, -109.4] | 0.2500 | [5, -5, -47.8] | [3, -44, -85.8] | 50° | IDLE |
| Mobile | 1 | [6.6, -45, -109.4] | 0.2500 | [6, -16, -64.8] | [5, -44, -98.8] | 47° | IDLE |

Mobile additionally moves the avatar outside the essential checkout/operations reading area during those holds. Root movement remains deterministic; no fake skeletal walk was added.

## 14. Prisha camera/FOV direction

Storefront establishes at 43–44°. Product selection tightens to 35° and holds at 0.635–0.66. Checkout is a 40° three-quarter view with a hold at 0.696–0.722. Payment passes at 39°. Portal and operations use 43° while camera position and target shift independently of the avatar. Operations spans 0.827–0.867. Resolution opens to a 50° wide frame at 0.925–0.965; the final dormant hint settles at 47°.

The camera keys use smooth interpolation and authored holds. Reverse scroll reconstructs them directly. There are no timer-triggered camera moves.

## 15. Asset loading and performance

There are 19 fragments with desktop/mobile variants, 38 WebP files totaling 758,028 bytes. Desktop dimensions cap at 1536px, mobile at 768px. Original videos and large screenshots are not in the public runtime bundle.

YatraLok prepares during Phase 3's last 10%. Prisha prepares after project progress 0.42. YatraLok textures release beyond 0.57; reversing before 0.42 releases Prisha and prepares YatraLok. Maximum overlap is 19 textures; normal active worlds retain 8 or 11. Generation checks dispose stale asynchronous completions. Geometry is constructed once, and the transition updates a fixed buffer. Existing DPR caps remain 1.5 desktop / 1.25 mobile.

Production traversal on this machine measured median 16.7ms and p95 16.8ms requestAnimationFrame intervals at 1440×900 and 390×844. This is browser traversal timing, not a hardware-independent GPU benchmark. The geometry profile before the final small storefront connector peaked at 63 draw calls and 26,966 triangles. No initial project-media requests, application errors, failed HTTP responses, overflow, video decoders or production debug attributes were observed. One nonfatal desktop shader precision warning remains from the existing Three.js lighting path.

## 16. Reverse and fast-scroll behavior

Root, camera, visibility, route reveal, map expansion, token position, verification pulse and transition are functions of absolute normalized progress. Rapid jumps and repeated cross-world reversals are tested against exact sampled values. Texture callbacks cannot resurrect a released world. Refresh synchronizes the GSAP timelines from restored scroll; breakpoint reconstruction preserves normalized project progress. Review URLs can enter a project directly.

## 17. Mobile

Mobile uses separately authored camera positions/targets, compressed spatial travel, lower-resolution textures, fewer contours/roads/transition nodes and a simpler overhead tracking hold. The catalogue's selected product remains prominent. Checkout fits within the camera, while the avatar moves aside. The operations hold emphasizes status distribution and order summary; revenue is omitted and products return only in the wide resolution. No horizontal page overflow was observed at 390×844, 320×568 or 844×390.

## 18. Reduced motion and context loss

Reduced motion uses no WebGL camera travel. Scroll presents sequential real asset crops, readable descriptions, the same resolution links and a complete screen-reader transcript. No autoplay runs. Context loss switches to this DOM evidence path without losing scroll, project context or replay. Reduced mode retains the distinction between real captures and conceptual route/payment/response storytelling.

## 19. DOJ and Holo extension

`projectWorlds` registers implemented YatraLok and Prisha, then **03 DOJ Chatbot** and **04 Holo Gesture** with `status: future`. Their metaphors are question → language → knowledge → response, and hands becoming the interface. They have no instantiated environment, texture requests or complete story beats. Future additions can supply their own environment and camera sequence while sharing the director/cache/StoryPose contract. The end of this pass stays IDLE and reveals a forward path and restrained DOJ title.

## 20. File changes

Added `src/projects/ProjectAssetSurface.ts`, `ProjectEnvironment.ts`, `ProjectTransition.ts`; `scripts/prepare-world-assets.py`, `capture-worlds.mjs`, `profile-worlds.mjs`, `verify-worlds.mjs`, `audit-worlds.mjs`; and `public/worlds/**`.

Replaced `src/projects/ProjectWorld.ts`, `ProjectTrajectory.ts`, `projectConfig.ts`, `projectPresentation.ts`, `src/components/ProjectOverlay.tsx`, `src/styles/projects.css`, and `tests/projects.spec.ts`.

Integrated through `src/story/StoryDirector.ts`, `src/animation/usePhaseOne.ts`, `src/components/Opening.tsx`, and `src/cinematic/CinematicWorld.ts`. These changes remove the interlude and connect/preload project worlds; Phase 1–3 choreography, assets, CameraRig, AvatarRig and their visual systems remain unchanged.

Removed/archive-retained: old `src/work/*.ts`, `WorkOverlay.tsx`, `work.css`, `ArchitectureSystem.ts`, `MediaSurfaceSystem.ts`, retired work tests/tooling, old project capture/preparation tooling, and unused `public/projects/**`. A source change inventory is in `artifacts/worlds/changed-files.json`.

## 21. Verification and limitations

`npm run build` passes. The final Playwright run passed all **52 tests**: 36 opening/tunnel/story regressions and 16 project-world checks. These cover exact Phase 3 inheritance, semantic beat evidence, deterministic reversal/jumps, texture lifecycle, product continuity, resolution-only links, four responsive viewports, refresh/breakpoint restoration, reduced motion, context loss, camera/orientation continuity, direct review URLs and essential UI framing.

Compared with the pre-replacement backup, 27 existing source files are byte-identical, including the approved visual systems; the 22 added/changed/removed source entries are recorded in the change inventory.

The map's environmental route, SOS response, payment passage and continuous order token are explanatory visualizations. They are not live product sessions or proof that those demo records belong to one transaction. The final avatar GLB remains future work. Some product evidence remains planar by design; its depth, world placement and camera choreography carry the spatial treatment. Small admin text is secondary on mobile; the full semantic sequence is retained in the accessible transcript and reduced-motion evidence view. Abrupt cold jumps can require an image decode before a surface appears; normal forward traversal preloads the next world. This has not been deployed publicly.

Visual review artifacts are under `artifacts/worlds/`, including desktop/phone compositions, a reduced-motion capture, projected evidence bounds, production timing and exact handoff transforms. The identity card, checkout summary, Admin Portal and operation-status surface were checked inside the camera bounds at 1440×900, 390×844 and 320×568.

## 22. Local review URLs

- Complete portfolio: http://127.0.0.1:5173/
- YatraLok: http://127.0.0.1:5173/?project=yatralok
- Prisha: http://127.0.0.1:5173/?project=prisha-enterprises
- Production preview: http://127.0.0.1:4173/

Append `&debug` to project review URLs for development diagnostics: active world/beat, camera/target/FOV, avatar state/transforms, visible surfaces and bounds, texture state, route/token progress, transition, lifecycle and preloading. Production omits debug data.
