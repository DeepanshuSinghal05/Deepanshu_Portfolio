# Final content phase — 7 October 2026

The portfolio now flows from the frozen cinematic journey into Professional Experience, a static Selected Work explorer, and the Contact finale. No real avatar has been generated or integrated. This is the content/structure milestone, not a launch or final production audit.

## Experience — complete / frozen

- **Colorbar Cosmetics Pvt. Ltd.** — Full-Stack & Backend Developer Intern, Sep–Oct 2025. The supplied résumé supports delivery of APIs for a live loyalty ERP, Twilio OTP, JSON/Excel audit pipelines and MySQL optimisation. The composition uses the authentic blank loyalty-member lookup from `experience/colorbar/loyalty_member_serach.png`.
- **Acmegrade Pvt. Ltd.** — Web Developer Intern, May–Jun 2025. Résumé-backed application delivery, Agile/Scrum sprints and real-user validation remain concise. The actual cart screenshot, `Screenshot 2025-06-22 015648.png`, is the primary evidence; the blank vendor product-entry form, `Screenshot 2025-06-22 015753.png`, is secondary. Both are from `experience/Acmegrade/`.
- Screenshots remain static DOM images. Browser chrome/unused whitespace are cropped; no UI has been fabricated. Exact crop rectangles, dimensions and output sizes are in `public/experience/provenance.json`; `scripts/prepare-experience.py` reproduces them.
- Colorbar uses text left, evidence right, avatar below. Acmegrade reverses the spread. The camera gently varies the viewpoint and reserves readable evidence space; tablet aspect compensation keeps the figure in frame. Mobile stacks type and evidence above the figure. The smallest viewport uses the primary image only.
- Architecture adds restrained instanced columns/beams, a continuous floor path, shallow planes, one faint 2025 marker and two small line fragments. Analytic soft shadow bands add depth without a shadow-map pass. Existing ivory lighting is retained, with contact shadows beneath the images.
- Secondary text has stronger contrast and hierarchy. “Built through experience,” “Building beyond the classroom,” and “Still building” remain. The Experience scroll budget is unchanged.
- Frozen source and SHA-256 manifest: `artifacts/experience-final-frozen/`. The prior Phase 6.1 snapshot remains historical.

## Selected Work — complete

### YatraLok

Tourist safety prototype: profile/trips/emergency-contact views, digital identity, phone OTP, ERC-721 integration and permission-aware browser geolocation. The panic handler is explicitly described as a local UI toggle, **not emergency dispatch**. Identity-screen verification labels are identified as prototype UI, not certification.

Technology: React, Express, MySQL, Twilio, Ethereum/ERC-721 and Google Maps. Architecture distinguishes the interface, API/database, OTP and identity-contract dependencies. Images reuse the sanitized identity, trip and SOS WebP assets in `public/worlds/yatralok/`.

Source: supplied `project_story_assets/yatralok/yatralok_info.md`, with implementation limits checked against `D:/Projects/Yatralok`, especially `TouristDashBoard.jsx`, `TrackingSection.jsx`, backend OTP services and `DigitalID.sol`. The public [YatraLok repository](https://github.com/DeepanshuSinghal05/Yatralok) is reachable but currently exposes documentation rather than the full inspected local implementation. No live-demo link is invented.

### Prisha Enterprises

Full-stack ecommerce: catalogue, persistent browser cart, stock checks, pending checkout, Razorpay payment/signature verification, order/payment/inventory updates and separate administrative order handling. The technical explanation distinguishes local cart convenience from server-owned stock and payment state. No business or reliability metrics are claimed.

Technology: React, Vite, Tailwind, Express, Sequelize, MySQL and Razorpay. Supplied storefront, catalogue and cropped checkout WebP images are reused. Source: `project_story_assets/prisha_enterprises/project_info.md` and the local `C:/Users/Deepanshu Singhal/prisha_enterprises` checkout, including cart/order/payment utilities.

Verified links: [live storefront](https://prishaent.in) and [public repository](https://github.com/DeepanshuSinghal05/Prisha_Enterprises). The live storefront returned HTTP 200 with its Prisha Enterprises title on 7 October 2026; the GitHub repository was also reachable. This link check does not assert a completed purchase or production payment test.

### DOJ Virtual Assistant

Document-grounded AI/RAG prototype: PDF extraction/chunking, embeddings, FAISS retrieval, FastAPI and context-fed answers. The corpus concerns High Court/Supreme Court judges’ salaries and service conditions, including 2021 amendment material. The local Ollama architecture is explicitly the documented target; the inspected checkout still contains Gemini/Google embedding code. Neither a running Ollama implementation nor an accuracy guarantee is claimed.

Images: supplied homepage, chat interface and response captures in `public/worlds/doj/`. The response image is captioned as an interface demonstration, not an answer validated against the current corpus. Source: `project_story_assets/DOJ/PROJECT.md` and `D:/SIH_FINAL/main.py` / frontend code. No verified public project URL was supplied, so no fake or disabled link appears. No official DOJ deployment, adoption or legal-advice claim appears.

### Holo Gesture

Bare-hand spatial-interaction prototype: webcam/MediaPipe landmarks, pinch/grab, drag/throw, two-hand manipulation, notes, GLB separation/recombination and JARVIS mode. The detail explains the camera → landmarks → gesture interpretation → Three.js object flow. Only static normal/JARVIS captures are used; the portfolio never starts webcam, speech or the gesture runtime.

The supplied README identifies an **AI Workshop open-source foundation**. The project is presented as a prototype study, with no unverified original contribution attributed to Deepanshu. Attribution distinguishes MIT source/Three.js, Apache-2.0 MediaPipe and CC0 Smithsonian models. Source: `project_story_assets/holo_gesture/README.md` and the supplied local Holo checkout. No independently verified personal project URL is available, so links are omitted.

### Explorer interaction

`SelectedWork` owns one selected project; reusable `ProjectDetail` renders its evidence, overview, features, technology, architecture, interesting problem, qualifications and available links. Desktop has a sticky editorial index and a normal-flow detail column. Mobile uses a compact horizontal index and stacked reading layout. Selection updates immediately with a 280 ms entrance; reduced motion removes it.

Semantic tabs expose selection, panel labels and orientation. Arrow keys/Home/End select projects; Tab reaches the focusable detail panel. Visible focus, descriptive image alt text, captions and ordinary external anchors are provided. Links identify new-tab behaviour. No router or separate project pages were added.

Hashes `#project-yatralok`, `#project-prisha`, `#project-doj` and `#project-holo` load the corresponding detail. Existing `?project=` cinematic links remain compatible. Header “Work” jumps directly to this section. Selection survives reverse scrolling and Contact visits.

## Contact / finale — complete

A large Instrument Serif “Let’s build / what’s next.” composition closes on a grounded, much larger avatar. Warm ivory, dark ink and muted olive keep it related to Experience. Tablet camera framing is aspect-aware; mobile places actions to the left of the figure. A large soft ground shadow provides depth. The avatar stays planted while the camera meets it, then becomes entirely still.

Primary action: `mailto:deepanshusinghal0508@gmail.com`. Secondary actions: the exact résumé-linked [LinkedIn profile](https://www.linkedin.com/in/deepanshu-singhal-b4320b251/), [GitHub profile](https://github.com/DeepanshuSinghal05), and the original Word résumé download. A small static DS mark returns at the bottom, with “Revisit the journey.” No contact form, backend, phone UI, new portal, glass break, audio or particle climax was added. The outgoing architectural path fades away; additional journey echoes were unnecessary.

The résumé is copied unchanged to `public/resume/Deepanshu_Singhal_Resume.docx`, SHA-256 `21a99d1739b3a0a451ff11e3e13e6628b3818789c2cf4929a0778402d93ddbbb`. Profile destinations come from that supplied document; no message was sent and no mail delivery was attempted. LinkedIn availability may require its usual login/session; its destination is source-verified.

## Content integrity

The supplied résumé establishes professional statements; it is not independent employer verification. Screenshots establish visible interfaces, not invisible backend behaviour. Local source was used to qualify broader project-document claims.

Omitted: unsupported performance/adoption/accuracy figures; operational emergency dispatch; invented employers/dates/roles; official DOJ deployment; unverified Holo authorship; unsupported DOJ/Holo URLs; a fake YatraLok live demo; screenshots containing security tokens, customer details or plaintext credentials. Full public source parity is not claimed where a public repository differs from the inspected local checkout.

**No professional information was invented. No project information was invented. No links were invented.**

## Engineering

- New source: `src/work/workContent.ts`, `src/components/SelectedWork.tsx`, `src/styles/work.css`; Contact world, trajectory, transition, presentation, content and avatar contract under `src/contact/`; `ContactOverlay.tsx`, `contact.css`, and `ExperienceArchitecture.ts`.
- Updated: Experience marker/overlay/content/presentation/trajectory/world/CSS; `Opening.tsx`, `Navigation.tsx`, `main.tsx`, `StoryDirector.ts`, `usePhaseOne.ts`, `CinematicWorld.ts`, `portraitScene.ts`. Added asset preparation, capture/profile scripts and Contact/Selected Work tests. Existing end-of-page replay tests now target the new final footer. No existing source files were removed.
- One renderer, camera rig, avatar rig, Lenis instance and GSAP ticker remain. Selected Work is a real normal-flow DOM section over the persistent sticky stage. Its measured height shifts only the appended Contact timeline; earlier cinematic boundaries stay fixed. A ResizeObserver refreshes layout after project changes; viewport changes preserve the current chapter/progress or work offset.
- WebGL stops updating while the static section is being read. Contact samples the Experience endpoint once per entry, hides the old worlds and sleeps at an unchanged final pose. Reverse scrolling restores the earlier scene deterministically.
- Images use local WebP, responsive sources, lazy loading, async decoding and reserved aspect ratios. Only the selected project panel is mounted. Initial readiness does not force lazy images to decode. New internship images total 67,590 bytes across both resolutions; the browser chooses one size. Existing project assets are reused.
- No dependencies were added. The original Word résumé is the only document download. No third-party models or gesture runtime were imported.
- Frozen audit: 41 of 55 baseline source files remain byte-identical; 14 are Experience or shared append/navigation integration files. `src/projects/**`, original opening timelines, AvatarRig and CameraRig remain unchanged. The Phase 5 trajectory is sampled against the saved baseline across 1,001 positions per responsive mode. Audit: `artifacts/final-content/freeze-audit.json`.

## Real-avatar readiness

`AvatarRig` is unchanged and still owns a procedural `AvatarPlaceholder` child. `src/contact/finalAvatarContract.ts` exports the final position, rotation, scale, camera, lighting and expected model convention for a supplied aspect ratio. No GLB has been integrated.

Local model contract: origin between soles, +Y up, +Z forward, height 2.1, scale `[1,1,1]`. Hooks remain `setLandingPose(compression, recovery)` and `setStoryPose(pose)`. Final state is IDLE, yaw −0.1 radians. Ground height is −45. Key light is warm `#f5f1e7` at 1.25 with relative position `[4,6,5]`; rim `#e6dfd3` at 0.5 and `[-5,2,-3]`; ambient 0.4, hemisphere 1.1, environment intensity 0.35. Existing soft contact shadow is retained.

Every shot should be checked against the replacement model’s silhouette, material exposure, head direction, sole contact and actual animation clips. The closest Contact shot, Experience evidence clearances, landing compression and gesture-world framing may require retuning. Root trajectories and camera ownership are prepared; a real model is not assumed to drop in without visual validation.

## Validation and development

Development: [full portfolio](http://127.0.0.1:5173/), [Experience](http://127.0.0.1:5173/?section=experience), [Selected Work](http://127.0.0.1:5173/?section=work), [Contact](http://127.0.0.1:5173/?section=contact). Production preview: `http://127.0.0.1:4173/`.

Visual review covers 1440×900, 768×1024, 390×844, 320×568 and 844×390. Captures: `artifacts/final-content/`. Automated checks cover forward/reverse/fast crossings, exact inherited poses, project clicks/keyboard, deep links, reload/resize, context loss, reduced motion, resume bytes/download, dormant resources and final stillness. Final run counts and production profiling are recorded below after verification.

Remaining build warning: the existing separate Three.js chunk is above Vite’s 500 kB notice threshold. This phase does not claim a full production performance/accessibility certification, backend audit, deployment or launch.

**Stop state:** Phases 1–5 frozen; Experience complete/frozen; Detailed Projects complete; Contact/finale complete; main portfolio content complete. Next phase: real-avatar integration.


### Completed content verification

The full 105-check run passed 104 checks; the remaining test still targeted the old end-of-page replay. It was updated to the new Contact footer, then all 35 affected/new-section checks passed. A Vite Windows EBUSY watcher failure during an intermediate rerun was resolved by excluding generated Playwright reports and artifacts from watching. The later global-polish report supersedes these counts with the final whole-site run.

Production idle profiling at 1440×900 and 390×844 observed one canvas and zero WebGL draw calls during each 1.2-second Selected Work / final Contact idle sample. Browser rAF medians were approximately 16.7 ms and p95 16.8 ms; these are local idle measurements, not whole-journey GPU benchmarks. JS heap samples ranged from 12.6 to 15.6 MB. Raw results: `artifacts/final-content/performance.json`.

Final transform examples: desktop avatar `[4,-45,-277]`, camera `[2.1,-43,-271.3]`, target `[2.1,-43.88,-277]`; mobile avatar `[1.9,-45,-176.05]`, camera `[1.2,-42.6,-166.55]`, target `[1.2,-43.05,-176.05]`. Both use rotation `[0,-0.1,0]`, scale `[1,1,1]`, 38° FOV. Tablet framing adapts to aspect ratio. Full data: `artifacts/final-content/avatar-contract.json`.


Final structural verification and status: [Global Polish Report](global-polish-report.md). The 115-test full suite passed, followed by 18 passing navigation/Work checks after the final small-mobile spacing adjustment.
