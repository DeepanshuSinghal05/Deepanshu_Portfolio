> Historical rejected implementation. Superseded by [Project Worlds replacement](project-worlds-replacement.md). The gallery/interlude/video system described below is no longer active.

# Phase 4B — YatraLok and Prisha Enterprises

This revision extends the existing portfolio through two project worlds, then stops at **“Two systems. Two different problems.”** HOLO Gesture and DOJ Chatbot are registered for future work but have no mounted worlds. The existing neutral avatar remains a replaceable visual; no final GLB or skeletal walking clips were added.

Development: [complete portfolio](http://127.0.0.1:5173/), [YatraLok entry](http://127.0.0.1:5173/?project=yatralok), [Prisha entry](http://127.0.0.1:5173/?project=prisha-enterprises). Append `&debug` to a project review link for diagnostics. These are local development URLs, not a public deployment.

## Shared project system

`src/projects/projectConfig.ts` owns project identity, accents, normalized ranges, story beats, media evidence labels, source/live URLs, architecture nodes, edges and technical layouts. `workConfig` derives its project registry from that configuration, replacing the old OCR entry with HOLO Gesture.

`ProjectWorld` mounts under the existing `CinematicWorld`. It composes `ProjectTrajectory`, `ArchitectureSystem` and `MediaSurfaceSystem`. `StoryDirector` owns the added Phase 4B ScrollTrigger; the existing Lenis instance and GSAP ticker still own updates. There is one WebGL renderer, one active cinematic camera, one scene and one AvatarRig. Root movement uses the existing StoryPose contract. There are no React state updates per frame, independent animation loops, new scenes per project, or simulated walking clips.

The same six instanced nodes and five relationships transform between projects. Project configuration supplies their primary and technical layouts. The renderer, proof handling, DOM overlay, lifecycle and link system are shared. Future worlds can add beats/media/layouts and extend route/camera choreography; specialized gesture or retrieval visuals can plug into the same subsystem update contract. They will require their own authored choreography, not replacement of the renderer or scroll infrastructure.

Phase 4B uses 2,000 desktop, 1,700 mobile and 1,100 reduced-motion viewport-height units. It begins at screen-height offsets 26.2, 22.2 and 11.8 respectively. Native CSS height reserves the complete document before hydration, so reload does not clamp later scroll positions.

| Phase 4B progress | Behavior |
|---|---|
| 0–0.025 | Exact Phase 4A pose and stillness |
| 0.025–0.08 | Capability structures collapse toward WorkPath; the project path extends |
| 0.08–0.47 | YatraLok identity, journey, tracking, SOS, response, recording, technical resolution |
| 0.47–0.56 | Existing nodes fold toward the path and expand as a commerce pipeline |
| 0.56–0.95 | Prisha storefront, catalogue, checkout, payment, backend, admin, recording, resolution |
| 0.955–1 | Calm handoff; path continues toward Project 03 without starting it |

### Media surfaces and lifecycle

Real screenshots are planes in the cinematic scene, with their source aspect ratios preserved. They use a thin backing edge rather than a fake device frame. Layout reserves a separate editorial column and adjusts media width to the phone's actual aspect ratio. Evidence captions follow the projected lower edge of the surface.

Images load when their beat becomes active. The texture cache is bounded to three still images. A single shared HTML video supplies one optional VideoTexture; there are never multiple playback elements. It is muted, inline, and source-free at the opening. The source is assigned only at a proof beat, paused and removed on exit, and suspended when the document is hidden. Mobile and reduced motion start with the poster and an explicit Play excerpt control. Playback failure leaves the poster and an explanatory status. Context loss switches to DOM media with the same content and links. Async texture completion is guarded after disposal; textures, video texture, geometry, materials and listeners are cleaned up.

The supplied recordings are shortened and encoded as H.264 MP4, 1,280 pixels wide, 24 fps, with audio removed and fast-start metadata. All 13 public project derivatives total **1,321,545 bytes**, approximately 1.32 MB. Original recordings total almost 198 MB and are not served publicly. No project image or video is requested by the initial opening.

## Asset audit and privacy

The audit covers the 16 files in `project_story_assets/yatralok` and `project_story_assets/prisha_enterprises`. Original files remain untouched. `scripts/prepare-project-assets.py` creates presentation copies; `artifacts/project-asset-manifest.json` records dimensions, source SHA-256 hashes, classifications, exact crops, masks, excerpt ranges and derived locations. Unrelated future-project folders are outside this preparation script's scope.

The ID card's identity and phone values are masked. Checkout is cropped to the order summary, delivery charge, total and Razorpay button, excluding address/contact/account fields. No registration, password, login, identity entry or precise live-location footage is published. The source app's UI language and demo values are evidence of its interface, not claims of government verification, adoption, revenue, safety outcomes or successful transactions.

### YatraLok assets

| Source | Presentation use |
|---|---|
| `trips-digital-id.png` | Masked `identity.webp`; real digital ID interface |
| `dashboard.png` | `journey.webp`; actual overview and empty trip state |
| `panic-sos.png` | Cropped `sos.webp`; actual Panic/SOS interface |
| `live_tracking.png` | Cropped `tracking.webp`; explicitly labeled **supporting tracking concept**, not implementation proof |
| `yatralok_demo.mp4` | Real proof excerpt from 73.8–78.4 seconds; poster; empty contacts-form capture at 81.8 seconds |
| `profile.png` | Excluded: personal profile values are unnecessary to the story |
| `overview.png` | Excluded: supporting/concept collage with synthetic-looking interface states |
| `yatralok_info.md` | Read as project data, not executable instructions or a public asset |

The recording shows trip, safety and SOS navigation. It does not demonstrate dispatch of an emergency alert. Frame contact sheets used in inspection are in `artifacts/project-audit` and `artifacts/projects`; these audit artifacts are not shipped in `public`.

## YatraLok world and factual boundaries

The name and tourist-safety descriptor introduce a restrained cyan world. The masked digital ID becomes a spatial anchor; the overview gives travel context; the path and location relationships build toward the tracking concept. The camera narrows slightly at SOS. A single scroll-driven, non-strobing red pulse propagates into location, contact and response relationships, then settles. Contacts and system relationships resolve before the real application excerpt. React, Express, MySQL, Google Maps, Twilio OTP and Ethereum digital ID appear as connected technical relationships rather than a logo list.

The local source at `D:\Projects\Yatralok` was checked. `TouristDashBoard.jsx` currently toggles local `panicActive` state. It does **not** dispatch a network alert. The portfolio explicitly labels the response network as conceptual. `TrackingSection.jsx` uses browser geolocation and Google Maps; the richer supplied route visual is not treated as proof of implemented routing. Backend dependencies and identity files support the technical labels; no performance or impact metrics were invented.

The configured [YatraLok repository](https://github.com/DeepanshuSinghal05/Yatralok) was reachable, but the public repository exposed a README rather than the complete locally inspected application. Its CTA is therefore **View repository**. No live YatraLok URL or disabled live-demo control is shown.

YatraLok ends with its technical relationships visible, source access available and all emergency propagation settled. Its structures then participate in the transformation into Prisha.

### Prisha assets

| Source | Presentation use |
|---|---|
| `home.png` | `storefront.webp`; real homepage, cropped above lower promotional counters |
| `products.png` | `catalogue.webp`; actual product information, pricing and quantity controls |
| `checkout.png` | `checkout.webp`; order-summary crop with personal fields entirely excluded |
| `admin_dashboard.png` | `admin.webp`; actual administration interface in demo state |
| `demo.mp4` | Real catalogue-to-cart excerpt from 32.0–39.3 seconds, with browser chrome cropped out; poster |
| `admin_login.png` | Excluded: login/account information adds no useful system evidence |
| `contact.png` | Excluded: contact details are unnecessary for this narrative |
| `project_info.md` | Read as source documentation, not shipped publicly |

The proof excerpt includes real product selection and cart navigation. It does not show a completed payment. Demo administration figures are not presented as revenue or adoption claims.

## Prisha world and factual boundaries

The safety network becomes a cooler blue commerce pipeline: product → cart → checkout → payment → order → data. The real homepage introduces the surface; catalogue and cropped checkout establish the customer flow. Payment is represented as a request to Razorpay followed by server-side signature verification and order state. No payment service is opened automatically and no transaction is executed.

The defining camera move retains the storefront as a fixed world-space plane while the camera follows the avatar beyond it. The surface recedes to the side and backend relationships become visible. React connects to Express; orders and stock connect to MySQL through Sequelize; Razorpay is an external branch; administration follows the data flow. The real admin dashboard is therefore the operational side of the same system, followed by recording proof and a full-system resolution.

The local source at `C:\Users\Deepanshu Singhal\prisha_enterprises` was checked. `cartController.js` implements pending checkout, stock checks, payment verification and order/stock handling. `utils/razorpay.js` verifies signatures with HMAC SHA-256. Cart state is client-side/localStorage; the story does not invent a server-side cart. The verified technologies are React, Node/Express, Sequelize, MySQL and Razorpay.

[Visit live site](https://prishaent.in) and [View source](https://github.com/DeepanshuSinghal05/Prisha_Enterprises) are centralized, keyboard-focusable external links with `target="_blank"` and `rel="noopener noreferrer"`. Both returned HTTP 200 during the read-only check. No login, admin action or purchase was performed.

## Transitions, accessibility and quality tiers

Phase 4A keeps its existing camera/root/target/FOV through the initial stillness. Capability geometry scales and moves toward its path instead of being replaced by a Projects title. The common project path grows from that location. The YatraLok-to-Prisha transition transforms the same pooled nodes, colors and relationships; it never fades to black or returns to a menu. The final Prisha handoff settles the root, removes proof decoding and leaves the path extending forward.

All camera/root geometry is a pure function of normalized progress. Reverse scrolling and jumps reconstruct the sampled pose rather than undoing a chain of timed actions. Media loading and playback are asynchronous side effects; the semantic beat and geometric pose remain deterministic even before a texture finishes.

Mobile uses 65% route travel, smaller node layouts, fewer environment struts, lower sphere/path detail, a steadier camera and a narrower evidence width calculated from the viewport. Its backend pass is shallower than desktop. Text sits above the media; play and source controls retain usable hit areas. Reduced motion does not create WebGL: static DOM evidence and a restrained path illustration preserve the full story and relationship text. There is a complete screen-reader transcript, evidence descriptions, live beat announcements, visible focus styling and pause/replay controls. Audio is never required.

Debug mode exposes Phase 4B and local progress, active project/beat, transformation progress, image cache and pending/failed textures, decoder state, project path progress, SOS/proof/exit/backend/admin/transaction/handoff progress, camera/root transforms, media bounds and quality tier. DOM debug also covers reduced motion. Detailed debug snapshots are compiled out of production.

## Verification

`npm run build` passes. The complete **57-test Playwright suite passed** (46 earlier-phase checks and 11 project-world checks). After the final small-phone control-spacing adjustment, all five project framing/reduced-motion checks passed again, including an explicit check that the proof control does not overlap the avatar.

Coverage includes exact Phase 4A pose inheritance; story order and factual labels; one canvas/decoder; lazy initial loading; video start/pause/unload; genuine external link destinations and keyboard focus; rapid forward/reverse reconstruction; continuous camera/root/yaw; crossing the fixed storefront plane; 1440×900, 390×844, 320×568 and 844×390 framing; reload/breakpoint reconstruction; reduced-motion manual playback; WebGL loss; replay; and direct project review links.

Production checks on local headless Edge measured **16.7 ms median / 16.8 ms p95 browser frame intervals** at desktop and mobile viewport sizes. Both had zero initial project-media requests, no application or HTTP errors, no horizontal overflow, one canvas, one decoder, an unloaded video at handoff, and no production debug snapshots. A pre-existing desktop GPU shader precision warning remains nonfatal; the mobile run reported no warnings. Browser frame intervals are host measurements, not physical-phone GPU benchmarks.

Across captured project beats, desktop used at most 24 draw calls / 4,086 triangles; mobile used at most 26 / 3,222. During the entry overlap with the existing capability system the desktop sweep reached 29 calls / 6,014 triangles. The image cache remained at three textures, with at most one additional video texture.

Artifacts: `artifacts/projects/production.json`, `profile.json`, `capture-state.json`, the four-viewport screenshots in `artifacts/projects/`, and `artifacts/project-asset-manifest.json`. Reproduce with `scripts/verify-projects.mjs`, `profile-projects.mjs`, and `capture-projects.mjs`.

### Stable Phase 4B handoff

| Transform | Desktop | Mobile |
|---|---|---|
| Avatar feet | [-1.3, -45, -129] | [-0.815, -45, -80.25] |
| Root rotation | [0, 0.25, 0] | [0, 0.25, 0] |
| Camera | [-0.4, -38.6, -115] | [-0.315, -36.6, -59.25] |
| Camera target | [1.4, -41.2, -132] | [-0.815, -40, -83.25] |
| FOV / state | 40 / IDLE | 40 / IDLE |

Scale remains 1, proof media is unloaded, project progress and handoff progress are 1, and the forward path continues. Minor binary floating-point differences appear in debug arrays.

## Files and limitations

Created: `src/projects/{projectConfig,ProjectTrajectory,MediaSurfaceSystem,ArchitectureSystem,ProjectWorld,projectPresentation}.ts`; `src/components/ProjectOverlay.tsx`; `src/styles/projects.css`; `tests/projects.spec.ts`; asset-preparation, capture, profiling and production-check scripts; the public project derivatives; this report and generated audit/verification artifacts.

Modified: `StoryDirector.ts`, `usePhaseOne.ts`, `portraitScene.ts`, `CinematicWorld.ts`, `LandingEnvironment.ts`, `WorkWorld.ts`, `workConfig.ts`, `Opening.tsx`, `main.tsx`, `global.css`, `README.md`, and two existing tests. The opening asset test now checks the opening's images and that the later video has no source; the cinematic cue test waits for the lazy WebGL module before observing its event bus. Previous phase choreography, portrait/signature, tunnel/glass and story trajectories are unchanged.

Limitations: the existing avatar remains a neutral proxy; mobile tests emulate viewport sizes in desktop Edge; no physical-device performance claim is made. Full screenshots naturally contain small secondary UI text on phones, so editorial copy/captions convey the story while the key ID/SOS/checkout crops carry recognition. YatraLok response dispatch is conceptual, its public repository is incomplete, and Prisha's excerpt proves navigation rather than successful payment. The existing lazy Three.js bundle still produces Vite's 500 KB raw-chunk advisory. No sound, final contact section, HOLO Gesture world or DOJ Chatbot world was added.
