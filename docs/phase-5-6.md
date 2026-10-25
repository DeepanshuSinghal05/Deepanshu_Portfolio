# Phase 5 + Phase 6 — Project Worlds finale and professional experience

Implemented 25 September 2026. Phases 1–4 retain their frozen content, geometry, timing and choreography. This extension starts after the existing Holo endpoint and ends at a stable contact seed. Contact, detailed case studies and the final avatar are not implemented.

## Phase 5

The entry pose comes from the existing Project → DOJ → Holo trajectory chain, not copied or estimated coordinates. The persistent camera and avatar start at exactly Holo's final position, target, yaw and FOV. Holo has already faded its hands and settled its objects at this endpoint; the finale holds that settled geometry, then fades its remaining gold/material/light values. The avatar turns toward the path and gradually becomes the subject as the camera moves closer and lowers.

Four small procedural traces recall the earlier route, transaction, knowledge and gesture visual languages. Their colors are muted red, blue, pale neutral and gold. These are short line fragments, not project logos, screenshots or icons. They converge into the floor path ahead of the avatar and disappear by experience introduction.

“Built through experience.” appears once. Dark space gains a warm ivory floor and a few architectural planes; light and fog change continuously. There is no portal, loading state or section cut. The new environment is one space, not a fifth Project World.

The combined Phase 5/6 timeline uses normalized progress `q = 0…1`, appended after project progress `2.72`. Phase 5 occupies `q = 0….23`:

| Layout | Previous chapters end | Phase 5 scroll | Phase 6 scroll | Combined new scroll |
| --- | --- | --- | --- | --- |
| Desktop | 7,924svh | 161svh | 539svh | 700svh |
| Mobile | 6,536svh | 138svh | 462svh | 600svh |
| Reduced motion | 4,104svh | 96.6svh | 323.4svh | 420svh |

These are scroll distances, not fixed playback durations. Phase 6 is approximately 9–10% of the preceding Phase 4 scroll length. The original project timeline still spans exactly `0…2.72`.

## Phase 6

The introduction reads “EXPERIENCE / Building beyond the classroom.” Two reusable `ExperienceMarker` components follow in newest-first order. Each has a company headline, exact role, period and one contribution; one marker is readable at a time.

| Company | Role | Period | Contribution |
| --- | --- | --- | --- |
| Colorbar Cosmetics | Full-Stack & Backend Developer Intern | Sep 2025 — Oct 2025 | Delivered APIs and automated audit workflows for a live loyalty ERP, from requirements to deployment. |
| Acmegrade | Web Developer Intern | May 2025 — Jun 2025 | Delivered a full-stack application through Agile/Scrum sprints, with real-user validation. |

Both entries come exclusively from the user-supplied résumé's EXPERIENCE section. [The content audit](experience-content-sources.md) records the source file, SHA-256, exact facts, paraphrases and omissions. The illustrative “IT Intern” in the brief is superseded by the more precise title in the résumé.

The persistent placeholder walks along one continuous path. A small distance-driven articulation adapter moves its existing limbs only during this new section and restores their original transforms on reverse into earlier phases. No time-driven idle or new avatar asset is added. Travel slows for reading; the camera pulls back slightly at each marker and the next marker appears deeper along the same architecture. There are no company worlds, cards, skill badges, office props or résumé bullets.

“Still building.” closes the chapter. The type recedes, architecture becomes faint and dormant, and the camera and avatar settle with forward space remaining. Existing replay navigation remains available at the end.

## Content integrity

Names, titles, periods, API/audit/loyalty context, full-stack application work, Agile/Scrum and real-user validation all come from the supplied résumé. No professional facts were invented. This is source-backed portfolio copy, not independent employer verification.

Employment location, work arrangement, team size, promotions, management responsibilities, further jobs and current employment were omitted because they were not established. Source-provided metrics, OTP implementation details, detailed stacks and recommendation-letter claims were also omitted to keep the section concise. College/personal projects are not repeated as professional experience.

## Engineering

Added application files:

- `src/experience/experienceContent.ts`: verified content and scroll budgets.
- `src/experience/ExperienceTrajectory.ts`: inherited pose, reversible travel, camera and contact contract.
- `src/experience/ExperienceWorld.ts`: lazy procedural floor, planes, seams and four memory traces.
- `src/experience/ProjectFinale.ts`: reversible material/light fade of the settled project scene.
- `src/experience/ExperienceWalk.ts`: reversible articulation of the existing placeholder.
- `src/experience/ExperiencePresentation.ts`: deterministic typography, accessibility metadata and fallback presentation.
- `src/components/ExperienceMarker.tsx`, `src/components/ExperienceOverlay.tsx`: reusable markers, section copy, transcript and static SVG fallback.
- `src/styles/experience.css`: scoped typography, responsive compositions and final replay state.

Modified integration files only:

- `src/components/Opening.tsx`: mounts the new overlay.
- `src/main.tsx`: loads its stylesheet.
- `src/story/StoryDirector.ts`: appends a separate ScrollTrigger and extends page height; dormant project presentation is cached.
- `src/animation/usePhaseOne.ts`: forwards progress through the existing ticker, preserves it across refresh/breakpoints, adds review URLs and cleans up the added timeline.
- `src/scenes/portraitScene.ts`: forwards experience progress through the existing renderer contract.
- `src/cinematic/CinematicWorld.ts`: runs the appended world, shared lighting/rigs, reversible lifecycle and diagnostics.

Added supporting files: `tests/experience.spec.ts`, `scripts/audit-experience.mjs`, `scripts/verify-experience.mjs`, this report and `docs/experience-content-sources.md`. README updated. No source files removed. No Three.js systems removed.

The freeze snapshot is `artifacts/phases1-4-frozen/`. Its manifest contains 46 source hashes; only the six integration files above differ. The earlier world modules, CameraRig, AvatarRig, chapter content, assets and styles remain byte-for-byte unchanged. Existing test assertions were not weakened or rewritten.

### Lifecycle and performance

The experience world is constructed lazily. Holo is sampled once on entry to the visible finale and faded without advancing its systems. At `q >= .16`, project groups hide and project image textures/bindings are released. Existing geometry and procedural label resources remain allocated for deterministic reverse scrolling and is disposed on scene teardown. Returning to Holo restores original material values and reloads only the needed project media. Direct entry at the experience review URL does not construct Holo or download project media.

Experience uses the existing renderer, camera, avatar, environment map, lights, Lenis instance and GSAP ticker. It adds five architectural meshes on desktop, three on mobile, two large planes, one floor seam group and four temporary line fragments. No new texture set, media asset, particle engine, physics, post-processing or animation loop is introduced. The final scene skips rendering while scroll is stationary; resize invalidates that cached frame.

### Validation

See `artifacts/experience/performance.json` for measured production timings and render counts, and `artifacts/experience/captures/` for reviewed desktop/mobile/fallback states. `tests/experience.spec.ts` checks exact Holo inheritance; slow spatial continuity; trace convergence; sourced content order; reverse, fast and repeated jumps; dormant media and systems; idle rendering; responsive bounds; reduced motion; restored scroll; breakpoint changes; context loss; keyboard replay and direct review links.

`npm run test:e2e`: **83 passed** (the existing 72 tests plus 11 experience tests). After the final direct-entry loading optimization, all **20 experience + Holo tests passed again**. No existing tests were edited. `npm run build`: **passed**, including TypeScript and the production bundle.

Production sweep: **no browser/application errors**, one canvas, no debug payload, no horizontal overflow, no project-media downloads on direct experience entry, and no image textures resident during Phase 6. Slow, normal, fast, reverse and rapid-crossing sweeps all retained finite transforms and stable final contracts. Idle render count remained unchanged.

| Measured on local Edge Chromium | Desktop 1440×900 | Mobile layout 390×844 |
| --- | --- | --- |
| Median animation-frame interval | 16.7ms | 16.7ms |
| 95th percentile frame interval | 17.0ms | 17.1ms |
| Maximum Phase 6 draw calls | 20 | 18 |
| Maximum Phase 6 triangles | 1,418 | 1,394 |
| Resident project image textures | 0 | 0 |
| Earlier Holo maximum calls / triangles | 44 / 6,624 | 43 / 6,272 |

These are local browser measurements, with mobile viewport emulation rather than a physical-phone benchmark. Visual checks also covered 320×568 and 844×390, including readable text, fully framed avatar and no text/avatar overlap on portrait mobile. Reduced motion uses the same factual content with fades and a static SVG composition; it creates no WebGL canvas. Refresh and breakpoint changes preserve the current chapter, and context loss keeps it readable through the fallback.

Remaining warnings: Vite's existing shared Three.js chunk advisory (587.59kB raw / 148.04kB gzip), and the test runner's inherited `NO_COLOR`/`FORCE_COLOR` environment warning. No TypeScript, application, asset-loading or test errors remain. No dependency changes were needed.

## Contact handoff

The exported trajectory contract is layout-specific. Coordinates are world units; rotations are radians. Both layouts end with unit avatar scale, yaw `0.15`, state `IDLE`, direction `[0, 0, -1]`, FOV `38`, camera mode `CONTACT_READY`, and architecture state `DORMANT`.

| Contract | Desktop | Mobile |
| --- | --- | --- |
| `contactOrigin` | `[4, -45, -277]` | `[1.9, -45, -176.05]` |
| `contactDirection` | `[0, 0, -1]` | `[0, 0, -1]` |
| `contactCameraStart.position` | `[4, -42.3, -267.6]` | `[1.9, -41.1, -164.25]` |
| `contactCameraStart.target` | `[4, -43.8, -277.4]` | `[1.9, -42.9, -176.45]` |
| `contactCameraStart.fov` | `38` | `38` |
| `contactAvatarStart.position` | `[4, -45, -277]` | `[1.9, -45, -176.05]` |
| `contactAvatarStart.rotation` | `0.15` (yaw) | `0.15` (yaw) |
| `contactAvatarStart.state` | `IDLE` | `IDLE` |

Displayed coordinates are rounded; the code passes the actual sampled floating-point values, including the inherited mobile precision. Final avatar Euler is `[0, .15, 0]`, scale `[1, 1, 1]`. The camera's position and target above define its exact orientation via `lookAt`; no independent Euler interpolation is used.

Final background/fog: `#e9e4da`, fog near/far `9/115`. Directional key: `#f5f1e7` at intensity `1.3`, avatar-relative position `[4, 6, 5]`. Rim: `#e6dfd3` at `.5`, relative position `[-5, 2, -3]`. Lower point light is off. Existing ambient `#e8e0d2` at `.4`, hemisphere `#fff2df / #343c43` at `1.1`, and environment intensity `.35` are retained. The scene does not advance while resting.

## Development

- [Full portfolio](http://127.0.0.1:5173/)
- [Project Worlds finale](http://127.0.0.1:5173/?section=finale)
- [Professional experience](http://127.0.0.1:5173/?section=experience)
- [Production preview](http://127.0.0.1:4173/?section=experience)

Use `127.0.0.1`; another local application may resolve under `localhost`. Build with `npm run build`, test with `npm run test:e2e`, capture with `node scripts/audit-experience.mjs`, and profile the running development/production servers with `node scripts/verify-experience.mjs`.

**Phases 1–4: frozen. Phase 5: complete. Phase 6: complete. Contact handoff: ready.**
