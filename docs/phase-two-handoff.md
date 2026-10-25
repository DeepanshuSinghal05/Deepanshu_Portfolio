> Historical Phase 1 endpoint contract. Phase 2 is now implemented; see [Phase 3 handoff](phase-three-handoff.md) for the current ending.

# Phase 1 ending contract — centered portrait revision

The master timeline ends at time 10 / normalized progress 1. Its visual changes finish by 9.6 and then hold. Phase 2 does not run.

## State

The final state has `progress: 1`, `darkness: 1`, `idleWeight: 0`, and the avatar pose returned by `getPhaseOneEndPose(mobile, layout)` in `src/animation/phaseOneState.ts`.

The layout argument contains stage width/height, unscaled avatar width, and the avatar anchor's Y coordinate as a fraction of the stage height.

- Final horizontal center: 50% on all viewports; pose X is 0.
- Final image top: 26% of stage height on desktop, 27% on mobile.
- Final image width: minimum of 48% of stage width (88% mobile) and 67% of stage height.
- Pose Y: image top plus half the final image height, minus measured initial anchor fraction.
- Pose scale: final image width divided by measured initial image width.
- Pose Z and all rotations: 0.
- The full-stage portrait window clips to inset(22%) on desktop, inset(24% 9% 26%) on mobile, and inset(24% 25%) on short landscape screens.

The initial anchor is centered horizontally. CSS places its image top at 16svh on desktop, 24svh on mobile, 30svh on short mobile, or 22svh on short landscape. The remainder of the anchor offset is half the image's 1.444 aspect-ratio height. The image intentionally extends past the stage in the desktop bust composition.

Responsive tween destinations are resolved after layout refresh. Initial transform values are explicit, so reversing restores the centered opening. The face cage uses the same image pose: its source head center is approximately (147.5, 50) in the 295 × 426 image. It is a perspective-rendered faceted ellipsoid, not an exported avatar mesh. Its idle/pointer contribution reaches zero at the end.

## Final composition

- Field: #151a20; interface: #f4f0e8.
- Initial name, contours and supporting copy: hidden.
- Portrait: centered in its clipped rectangular mat, muted color, visible, no idle motion. Head cage is hidden.
- Two oversized background text rows remain behind the portrait frame.
- Signature: centered over the portrait; all three dash offsets 0; scale 1.045, or 1 with reduced motion; color #e2bd82.
- Signature caption and identity label: visible. Underline scaleX: 1.
- Footer: 100% progress, Prologue complete, functional replay control.
- Accessible chapter: identity current.

Desktop uses 420svh total section height and 320svh scrub range. Mobile uses 370svh / 270svh; reduced motion 220svh / 120svh. These are choreography distances, not placeholder sections.

## Future continuation

A parent coordinator should own the extended scroll range and transfer this final state to Phase 2. Keep one ticker and one pose owner. Replace `AvatarVisualHandle.update(pose, breath, width, height)` with the future model adapter, converting normalized pose into its scene coordinates. Preserve reversal back into Phase 1. The reduced-motion path reaches the same final composition through a hidden reposition and crossfade.

No tunnel, fall, glass, landing or main portfolio reveal has been implemented.
