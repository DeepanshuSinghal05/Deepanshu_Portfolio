# Targeted fixes and subtle hero motion

9 October 2026. Scope: existing hero actions, ambient photo/head-element movement, and Contact footer layout. The real-avatar phase has not started.

## 1. Landing-page bugs

The reported initial disappearance did **not reproduce in the current source**. Before editing, both Explore Projects and Let’s talk had opacity 1, visible ancestors, in-viewport bounds and unobstructed pointer hit tests at all eight requested sizes. The captured baseline is `artifacts/targeted-fixes/before.json`. There was no delayed entrance animation on these actions. No speculative opacity, stacking or typography override was added.

A confirmed navigation bug was present: Let’s talk still linked directly to `mailto:`. It now dispatches the existing `portfolio:navigate` event for Contact, using the same Lenis/ScrollTrigger covered transition as Explore Projects. The original anchor, label, underline and hover styling remain. Contact’s primary action still opens email.

The transition's accessible status messages now identify Contact correctly instead of announcing Selected Work for every destination. `#contact` is also resolved on direct entry. Explore Projects continues to enter the static project explorer, with the destination heading focused and the cinematic state synchronized.

Additional tests hold back fonts, portrait images and the WebGL module to check that neither hero action depends on asset readiness to become visible. Clickability is verified through element hit tests, real navigation clicks, keyboard activation and return from Contact.

## 2. Ambient motion

The existing `.avatar-pose` remains owned by the scroll trajectory. A separate transform on the existing image child supplies ambient translation; no new photo, decorative element or camera is introduced. The tiny previous image breathing scale has been removed so the image dimensions remain constant.

| Existing subject | Desktop | Mobile | Full cycle |
|---|---|---|---|
| Photo | ±6 px vertical travel | ±3 px | 6 seconds |
| Faceted head cage, relative to the photo | 0 to 10 px upward, then back | 0 to 6 px upward, then back | 5.2 seconds |

The repository's existing “circle” is the faceted Three.js face/head cage, with an SVG fallback. That element is animated in place; no separate halo was created. Its vertical position follows the photo plus the independent upward offset. Geometry, size, color and material are preserved. The original restrained pointer/turn behavior remains; no extra pointer effect was added.

Both offsets come from a shared sine/cosine sampler on the **existing GSAP ticker**. CSS child transforms are corrected for parent scale to keep travel in screen pixels. The Three.js cage receives those same offsets; the SVG fallback does too. Initial WebGL creation receives the current ambient sample, avoiding a reset when the renderer becomes ready.

The existing scroll-owned idle weight fades the offsets to zero during the opening transition. The ambient clock stops when this weight reaches zero, the hero is offscreen, the transition is covered, or the document is hidden. Its phase is retained when returning or rebuilding at a breakpoint. Reduced motion gives both offsets zero. No new RAF loop, Lenis instance, ScrollTrigger, camera motion or model is added.

## 3. Contact footer

**Confirmed root cause:** `.contact-composition` and `.contact-footer` were independently absolutely positioned in a viewport-height overlay. The large editorial heading and links could extend below the footer's top. At **1280×720**, the content ended at y=637 while the footer began at y=620.80, overlapping by approximately **16.2 px**. At 1366×768 only about 5 px separated them.

The overlay now uses a column flex layout. Composition and footer participate in the same flow; a flexible top spacer retains the existing preferred placement and shrinks when the available height is insufficient. The footer remains bottom-aligned through its automatic margin, and the content reserves at least 18 px separation. Existing horizontal positions, text, fonts, colors, dimensions, footer border, padding and link targets are retained.

At 1280×720 and 1366×768 the final measured gap is **18 px**. Taller and mobile compositions preserve their existing larger spacing. The footer is visible, every contact link passes pointer hit tests, and no horizontal overflow is observed at the requested sizes. No footer hiding or arbitrary z-index fix was used.

## 4. Testing

Required viewport coverage: **1920×1080, 1440×900, 1366×768, 1280×720, 768×1024, 390×844, 375×667, 320×568**. Existing regression coverage additionally checks short landscape 844×390.

Checks cover:

- Initial CTA visibility, delayed assets, full bounds and pointer hit testing.
- Hero → static Selected Work, hero → Contact, direct Contact hash and keyboard navigation.
- Footer clearance, real link actionability, bottom-of-page state and replay to the hero.
- Photo movement amplitude, independent head-cage movement, unchanged scroll transform, offscreen suspension and phase-preserving return.
- Existing signature reversal, rapid scrolling, reloads, breakpoints, WebGL loss and Contact trajectory/stillness.
- Reduced motion and WebGL-unavailable SVG fallback.

Screenshots and layout measurements: `artifacts/targeted-fixes/`. The eight-size capture recorded no runtime errors or failed HTTP responses. The existing ANGLE/Three.js generated shader precision warning appeared once; it was not suppressed. Vite's existing Three.js chunk-size advisory remains.

`npm run build` passed after the final source change. The affected opening, Contact and hero-navigation regression suites passed all 37 existing checks. All **12 new targeted checks passed** in the final run (1.3 minutes), for **49 passing affected checks** across the existing and new suites. An initial test used same-document hash navigation while intending to test fresh direct entry; the test was corrected to load a new document.

Source-preservation verification compared all 72 previously frozen source/config files: 67 remain byte-identical, five application files changed as listed below, and one small ambient sampler was added. The full project/Experience/Work modules, rigs, trajectories, assets, dependencies and existing timelines remain unchanged.

The initial CTA disappearance remains unconfirmed in this checkout; no hidden root cause is claimed. Development: http://127.0.0.1:5173/.

## 5. Files

Modified application files:

- `src/components/Navigation.tsx` — existing Let’s talk anchor uses direct Contact navigation.
- `src/components/Avatar.tsx` — independent image and SVG cage ambient transforms.
- `src/animation/usePhaseOne.ts` — shared paused ambient clock, synchronized renderer initialization, Contact announcements/hash.
- `src/scenes/portraitScene.ts` — existing cage follows photo and its independent vertical offset.
- `src/styles/contact.css` — shared content/footer layout with flexible top spacing.

Added:

- `src/animation/heroAmbient.ts` — small pure ambient sampler.
- `tests/targeted-fixes.spec.ts` — interaction, layout and motion regressions.
- `scripts/capture-targeted-fixes.mjs` — reproducible eight-size visual/layout audit.
- `docs/targeted-fixes-2026-10-09.md` — this report.
- Local before/after screenshots, measurements and source-preservation audit under `artifacts/targeted-fixes/`.

No source files were removed and no dependencies changed.

## 6. Design preservation

The original design, fonts, palette, portrait asset, head-cage geometry and visual hierarchy are preserved. The only layout adjustment is the Contact content/footer relationship when vertical space is tight. Project Worlds, Experience, Detailed Projects, CameraRig, AvatarRig and the approved cinematic trajectories remain untouched. The proxy remains in place.

Stop state: targeted fixes and motion complete; real-avatar integration remains the next separate phase.
