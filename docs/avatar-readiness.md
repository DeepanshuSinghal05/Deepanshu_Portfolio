# Avatar replacement inventory

Captured from the running portfolio on 7 October 2026. Numeric samples are representative reading/transition frames, not a replacement for the continuous trajectory functions. Full precision, camera distance, FOV and bounds: `artifacts/global-polish/avatar-scenes.json`.

## World / visual separation

`AvatarRig.root` owns world position, rotation and scale. Its `visual.object` child is the current procedural AvatarPlaceholder. Local convention: soles at origin, +Y up, +Z forward, height 2.1. The hero is a separate supplied DOM portrait and face cage; it is not the same visual child. Phase 2 crossfades from that portrait into the persistent rig. Do not replace either renderer or camera when installing a future GLB.

## Representative scene poses

| View | Scene | Avatar position | Rotation XYZ | Scale | Camera position | Camera target | Camera–root distance | Ground | State |
|---|---|---|---|---|---|---|---|---|---|
| 1440 px | entry | [0, -2.587, 0] | [0.06, -0.12, 0] | [1.692, 1.692, 1.692] | [0.019, 0.027, 5.627] | [0, -0.135, 0] | 6.205 | airborne | FALL |
| 1440 px | tunnel | [0, -11.265, 0] | [0.06, -0.12, 0.045] | [1, 1, 1] | [2.398, -6.047, 9.96] | [0, -11.844, 0] | 11.497 | airborne | FALL |
| 1440 px | glass | [0, -32, 0] | [0, -0.12, 0] | [1, 1, 1] | [1.7, -27.006, 7.3] | [0, -32.6, 0] | 9.006 | airborne | FALL |
| 1440 px | landing | [0, -45, 0] | [0, 0, 0] | [1.009, 0.963, 1.009] | [0.453, -40.876, 7.611] | [-0.48, -45.159, 0] | 8.668 | −45 | RECOVERY |
| 1440 px | arrival | [0, -45, 0] | [0, 0, 0] | [1, 1, 1] | [-1.85, -43.35, 6.5] | [-1.85, -43.9, 0] | 6.957 | −45 | IDLE |
| 1440 px | introduction | [0, -45, 0] | [0, 0, 0] | [1, 1, 1] | [-1.85, -43.35, 6.5] | [-1.85, -43.9, 0] | 6.957 | −45 | IDLE |
| 1440 px | foundation | [-0.431, -45, -6.203] | [0, 3.636, 0] | [1, 1, 1] | [-4.39, -42.499, 1.797] | [-3.207, -43.9, -7.003] | 9.270 | −45 | IDLE |
| 1440 px | development | [-2.112, -45, -14.864] | [0, 2.639, 0] | [1, 1, 1] | [3.188, -42.3, -6.864] | [0.688, -43.9, -15.864] | 9.969 | −45 | IDLE |
| 1440 px | full-stack | [2.594, -45, -23.614] | [0, 2.788, 0] | [1, 1, 1] | [-2.606, -41.4, -13.614] | [-0.406, -43.9, -25.014] | 11.832 | −45 | IDLE |
| 1440 px | intelligence | [3.119, -45, -33.176] | [0, 3.72, 0] | [1, 1, 1] | [7.919, -41.8, -24.176] | [5.719, -43.9, -33.676] | 10.690 | −45 | IDLE |
| 1440 px | real-products | [-1.728, -45, -40.006] | [0, 3.436, 0] | [1, 1, 1] | [-6.228, -42.6, -32.506] | [-4.228, -43.9, -40.006] | 9.070 | −45 | IDLE |
| 1440 px | work-handoff | [0, -45, -48] | [0, 0.25, 0] | [1, 1, 1] | [-2.4, -43, -40] | [-2.4, -43.8, -48] | 8.588 | −45 | IDLE |
| 1440 px | yatralok | [-6.15, -45, -69.888] | [0, 2.206, 0] | [1, 1, 1] | [-9.087, -36.174, -58.913] | [-1.452, -44.183, -71.73] | 14.386 | −45 | WALKING |
| 1440 px | prisha | [-13.431, -45, -136.199] | [0, 2.392, 0] | [1, 1, 1] | [10.127, -39.144, -132.102] | [4.102, -43.005, -143.229] | 24.618 | −45 | IDLE |
| 1440 px | doj | [-23, -45, -202] | [0, 3.142, 0] | [1, 1, 1] | [21, -34, -211] | [12, -42, -227] | 46.239 | −45 | IDLE |
| 1440 px | holo | [-29, -45, -211] | [0, 0.25, 0] | [1, 1, 1] | [13.749, -37, -216.081] | [7, -39, -232] | 43.787 | −45 | IDLE |
| 1440 px | project-finale | [4.846, -45, -248.949] | [0, 3.142, 0] | [1, 1, 1] | [3.104, -40.787, -234.095] | [3.104, -43.463, -247.614] | 15.538 | −45 | WALKING |
| 1440 px | colorbar | [7.045, -45, -259.134] | [0, 3.142, 0] | [1, 1, 1] | [4.845, -39.9, -249.084] | [4.845, -41.9, -259.134] | 11.483 | −45 | WALKING |
| 1440 px | acmegrade | [6.258, -45, -268.125] | [0, 3.142, 0] | [1, 1, 1] | [8.458, -40.15, -258.525] | [8.458, -41.9, -268.125] | 10.978 | −45 | WALKING |
| 1440 px | still-building | [4.551, -45, -275.346] | [0, 0.923, 0] | [1, 1, 1] | [3.983, -42.145, -265.868] | [3.983, -43.774, -275.642] | 9.915 | −45 | WALKING |
| 1440 px | contact-arrival | [4, -45, -277] | [0, 0.098, 0] | [1, 1, 1] | [3.604, -42.446, -268.372] | [3.604, -43.817, -277.317] | 9.007 | −45 | IDLE |
| 1440 px | contact | [4, -45, -277] | [0, -0.1, 0] | [1, 1, 1] | [2.1, -43, -271.3] | [2.1, -43.88, -277] | 6.332 | −45 | IDLE |
| 390 px | entry | [0, -1.252, 0] | [0.06, -0.12, 0] | [0.951, 0.951, 0.951] | [0.019, 0.042, 5.641] | [0, -0.12, 0] | 5.788 | airborne | FALL |
| 390 px | tunnel | [0, -11.266, 0] | [0.06, -0.12, 0.045] | [1, 1, 1] | [1.9, -6.048, 10.082] | [0, -11.845, 0] | 11.510 | airborne | FALL |
| 390 px | glass | [0, -32, 0] | [0, -0.12, 0] | [1, 1, 1] | [1.7, -27.007, 8.5] | [0, -32.6, 0] | 10.004 | airborne | FALL |
| 390 px | landing | [0, -45, 0] | [0, 0, 0] | [1.009, 0.963, 1.009] | [0.788, -40.872, 8.813] | [-0.147, -45.161, 0] | 9.763 | −45 | RECOVERY |
| 390 px | arrival | [0, -45, 0] | [0, 0, 0] | [1, 1, 1] | [-0.57, -43.35, 7.7] | [-0.57, -43.9, 0] | 7.895 | −45 | IDLE |
| 390 px | introduction | [0, -45, 0] | [0, 0, 0] | [1, 1, 1] | [-0.375, -41.8, 9.5] | [-0.485, -42.6, 0] | 10.031 | −45 | IDLE |
| 390 px | foundation | [-0.222, -45, -3.685] | [0, 3.596, 0] | [1, 1, 1] | [-1.076, -41.8, 5.815] | [-0.995, -42.6, -3.685] | 10.061 | −45 | IDLE |
| 390 px | development | [-1.178, -45, -8.881] | [0, 2.679, 0] | [1, 1, 1] | [-2.02, -41.8, 0.619] | [-1.943, -42.6, -8.881] | 10.060 | −45 | IDLE |
| 390 px | full-stack | [1.425, -45, -14.162] | [0, 2.813, 0] | [1, 1, 1] | [0.991, -41.8, -4.662] | [0.905, -42.6, -14.162] | 10.034 | −45 | IDLE |
| 390 px | intelligence | [1.735, -45, -19.864] | [0, 3.675, 0] | [1, 1, 1] | [1.25, -41.8, -10.364] | [1.184, -42.6, -19.864] | 10.036 | −45 | IDLE |
| 390 px | real-products | [-0.959, -45, -24.03] | [0, 3.406, 0] | [1, 1, 1] | [-1.845, -41.8, -14.53] | [-1.751, -42.6, -24.03] | 10.064 | −45 | IDLE |
| 390 px | work-handoff | [0, -45, -28.8] | [0, 0.25, 0] | [1, 1, 1] | [-0.65, -41.8, -19.3] | [-0.65, -42.6, -28.8] | 10.046 | −45 | IDLE |
| 390 px | yatralok | [-3.337, -45, -43.032] | [0, 2.274, 0] | [1, 1, 1] | [0, -32.63, -26.435] | [0, -44.182, -44.256] | 20.967 | −45 | WALKING |
| 390 px | prisha | [-3.002, -45, -86.403] | [0, 2.437, 0] | [1, 1, 1] | [3.721, -39.982, -76.929] | [2.246, -43, -90.903] | 12.655 | −45 | WALKING |
| 390 px | doj | [-11.8, -45, -128.9] | [0, 3.142, 0] | [1, 1, 1] | [7.6, -32.0, -127.4] | [6.6, -42, -145.4] | 23.401 | −45 | IDLE |
| 390 px | holo | [-18.15, -45, -134.75] | [0, 0.25, 0] | [1, 1, 1] | [5.823, -39.8, -115.049] | [3.85, -41.1, -148.4] | 31.462 | −45 | IDLE |
| 390 px | project-finale | [2.407, -45, -159.215] | [0, 3.142, 0] | [1, 1, 1] | [1.937, -40.571, -144.483] | [1.574, -42.741, -158.414] | 15.391 | −45 | WALKING |
| 390 px | colorbar | [3.727, -45, -165.33] | [0, 3.142, 0] | [1, 1, 1] | [3.727, -38.9, -149.18] | [3.727, -39.6, -165.33] | 17.264 | −45 | WALKING |
| 390 px | acmegrade | [3.255, -45, -170.725] | [0, 3.142, 0] | [1, 1, 1] | [3.255, -38.9, -154.575] | [3.255, -39.6, -170.725] | 17.264 | −45 | WALKING |
| 390 px | still-building | [2.232, -45, -175.053] | [0, 0.927, 0] | [1, 1, 1] | [1.973, -40.892, -163.461] | [1.973, -42.731, -175.349] | 12.301 | −45 | WALKING |
| 390 px | contact-arrival | [1.9, -45, -176.05] | [0, 0.098, 0] | [1, 1, 1] | [1.754, -41.413, -164.73] | [1.754, -42.931, -176.366] | 11.875 | −45 | IDLE |
| 390 px | contact | [1.9, -45, -176.05] | [0, -0.1, 0] | [1, 1, 1] | [1.2, -42.6, -166.55] | [1.2, -43.05, -176.05] | 9.823 | −45 | IDLE |

## Ground and animation requirements

- Hero starts at translation `[0,0,0]`, rotation `[0,0,0]`, scale `1` relative to its CSS anchor. Signature handoff preserves zero rotations, x/z=0, and computes scale as `min(width × (.88 mobile / .48 desktop), height × .67) / avatarWidth`; y uses image top `.27 mobile / .26 desktop` plus scaled face registration minus anchorY. These are CSS degrees and viewport fractions, whereas the world table uses radians and world units.
- Hero/signature: DOM portrait uses `Avatar` and `getPhaseOneEndPose`; viewport-relative x/y/z, scale and rotations are independent of the 3D rig. The face cage camera is at z=1500 with its FOV fitted to pixel height. Preserve source-head registration when revisiting the hero later.
- Entry/tunnel/glass: rig descends from the entry feet position (desktop −2.6, mobile −1.25) toward impact y=−32, then breakthrough y=−38. There is no ground contact during the fall. Root scale eases from 1.7 desktop / .95 mobile to 1. Future clips: fall, brace/impact, landing and recovery.
- Landing/journey/all project worlds/Experience/Contact: floor/sole level is y=−45. Grounded scale is 1. Story states include IDLE, TURNING, WALKING and STOPPING. Some project shots intentionally focus on a system rather than keeping the avatar visible.
- Experience walk currently animates procedural child limbs through `ExperienceWalk`, which assumes the placeholder child structure. A GLB needs a mixer-based adapter for these locomotion hooks; do not apply these child-index assumptions to arbitrary bones. No such adapter or GLB is installed in this pass.
- `setLandingPose(compression, recovery)` and `setStoryPose(pose)` are available visual hooks. Root motion remains scroll-owned, deterministic and reversible; clips should sample from scroll-derived state/distance, not accumulate independent root motion.
- Contact is IDLE with zero travel and final yaw −0.1. The camera meets the planted avatar. `src/contact/finalAvatarContract.ts` provides responsive final transforms, 38° FOV, lighting and the expected model contract.

## Lighting relationships

| Scenes | Lighting contract |
|---|---|
| Hero/signature | Supplied raster portrait; CSS exposure/saturation and a transparent wire cage. It has no physically lit skeletal model. |
| Entry/tunnel/glass | Key follows rig at [4,6,5], warm #fff1db; key intensity 1.8 → .85 → 1.45 with depth; lower point light peaks at 6. Rim remains behind the rig, with scroll-driven intensity. |
| Landing/journey | Key settles to 1.6 then rises toward 1.8 at the story handoff; warm key, pale cool rim. Soft procedural ground contact shadow. |
| YatraLok | Key blends toward #e4eef1 and rim toward #8ac2ce. Project illumination is distinct from the shared avatar lights. |
| Prisha | Rim shifts toward #a7b4dc; commerce panels have their own materials. Key reaches 2.05. |
| DOJ | Key #e3edf2 and rim #b9cedc, with the same avatar-relative light positions. |
| Holo / project finale | Shared cool lighting remains, while Holo owns restrained spatial/JARVIS accents; finale fades the world without spawning a replacement rig. |
| Experience | Key blends to #f5f1e7 at 1.3; rim to #e6dfd3 at .5. Architectural soft shadow bands supplement the avatar contact shadow. |
| Contact | Key #f5f1e7 at 1.25 and rim #e6dfd3 at .5. Ambient .4, hemisphere 1.1, environment .35. Relative key/rim positions [4,6,5] / [−5,2,−3]. |

## Replacement strategy

Load one GLB visual child, normalise its soles/height/forward direction, and attach it to the existing AvatarRig root. Retain the persistent renderer, CameraRig and trajectories. Add only a visual animation adapter for clips/morphs and replace the placeholder-specific ExperienceWalk mapping. Review silhouette clearances in the entry face transition, fall/glass/landing, every story read hold, project close-ups, Experience evidence spreads and the close Contact frame. Retune material exposure and contact shadows as needed. No real avatar, generated avatar, model download or new section was added.
