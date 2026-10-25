> Historical audit of an earlier asset. Superseded by the animated `new_model.glb` integration in [the final report](final-animated-avatar.md).

# Phase 9 — avatar asset validation

25 October 2026. **Status: BLOCKED for animated integration.** The supplied character renders successfully as a static 3D mesh, but it does not contain a skeleton, skin weights or any animation clips. The Phase 9 brief explicitly requires a suitable animated asset before replacement. The existing proxy and production source are preserved.

## Avatar asset

Source: `project_story_assets/deepanshu_3D_Model.glb`.

| Property | Verified result |
|---|---|
| Format | Binary glTF 2.0; generator: Tripo |
| File size | 64,221,780 bytes / 64.22 MB |
| Geometry | One mesh, one primitive, 1,003,709 vertices, 1,954,409 triangles |
| Nodes / skins | One mesh node; zero skins, no skeleton hierarchy |
| Skin attributes | No JOINTS_0 or WEIGHTS_0; Three.js loads an ordinary Mesh, not a SkinnedMesh |
| Animations | Zero clips; Idle, Walk and Turn are all missing |
| Materials | One PBR material; embedded base color, packed roughness/metalness, and normal maps |
| Textures | Three 4096×4096 images; all decode successfully; no external texture dependencies |
| Color handling | GLTFLoader assigns sRGB to base color and linear data handling to normal/roughness/metalness |
| Compression | No Draco or Meshopt decoding required |
| Source bounds | x ±0.1650543, y 0–0.9786377, z ±0.0991058 |
| Orientation | Visual inspection confirms +Y up and front facing +Z |
| Model correction | Height 2.1 would require uniform scale 2.1458401; soles already reach y=0 |

SHA-256: `d380dfb63af4ea07493823df74393606a5826743b99ab00a2fc97ec40265cdfc`.

The full body, face, hair, glasses, clothing and shoes render in front, side and rear views. The face/hair/glasses resemble the supplied reference to the extent encoded in the model. The model wears a light shirt rather than the coral shirt in the approved hero photograph; its supplied appearance was retained. Texture decoding and static rendering pass, but no skeletal deformation, gait or animation compatibility can be validated because that data is absent. This is a targeted GLB/Three.js inspection, not a claim of formal glTF conformance certification.

Isolated development preview: `http://127.0.0.1:5173/artifacts/phase9/preview.html`. Screenshots: `artifacts/phase9/model-front.png`, `model-side.png`, `model-back.png`. It loads the existing source file directly, without copying the 64 MB model into public production assets.

## Architecture and integration decision

1. **World movement:** `AvatarRig.root` owns scroll-derived translation, yaw and scale. It descends through the tunnel/glass, lands with soles at y=−45, then follows the story/project/Experience trajectories.
2. **Visual mesh:** `AvatarRig.visual.object` is a separate child. The default is the procedural `AvatarPlaceholder`; the constructor already accepts an alternative visual.
3. **Skeleton:** the current proxy is assembled from independent primitives and has no humanoid skeleton. The supplied GLB also has none.
4. **Animation:** the visual interface provides `setLandingPose` and `setStoryPose` hooks. `ExperienceWalk` currently moves proxy parts based on their primitive positions; it cannot animate an imported humanoid mesh. No existing GLTF/FBX loader or AnimationMixer controller is installed in the production avatar path.
5. **Camera relationship:** persistent CameraRig and scene trajectories own framing independently of the visual. The hero is a separate approved DOM photograph with its own face cage and ambient float, not the cinematic proxy.

No production AvatarRig, CameraRig, loader, animation controller or timeline changes were made. Installing this file as a rigid walking figure would fail the brief's functional skeleton, walking and idle requirements. A fake bone tree without validated skinning would not resolve that.

The isolated inspection uses Three.js's already-installed GLTFLoader, one correction group, existing material semantics and explicit resource disposal. It creates no production renderer or dependency. No external service received the model.

## Rigging feasibility and missing inputs

No Blender, Maya or Assimp executable was found on PATH or in the checked standard installation locations; Python `bpy` is unavailable. No other GLB/GLTF/FBX/VRM, skeleton or animation clips were found in the project. Available generic scene-editing capabilities do not supply a validated humanoid auto-rig or compatible motion clips for this file.

This mesh is a potential source for a character-preparation workflow. It needs mesh optimization, a humanoid armature, skin weights, deformation testing and actual animation clips. Its arms-down pose and dense generated geometry require inspection during rig preparation; successful automatic weighting is not assumed. No unsupported rigging or animation success is claimed.

Required deliverable to resume Phase 9:

- A full-body skinned GLB based on this model, with a real joint hierarchy, bind matrices and normalized joint weights.
- Validated **Idle**, **Walk** and **Turn** clips, embedded in that GLB or supplied as compatible separate assets. A named rig convention is helpful, but actual joint names and rest transforms must be inspected.
- In-place walking, or clearly identified root-motion tracks that can be removed from visual animation while AvatarRig owns world movement.
- Retain the face, glasses, clothing and material appearance. Proposed project budgets: roughly 40,000–100,000 triangles, 1K–2K textures where sufficient, and a single-digit-MB delivery asset where quality allows. These are preparation targets, not measured properties of the supplied model.
- Validate feet, knees, hips, shoulders, elbows and clothing through a full walking cycle. Fall/impact/recovery poses are also needed for the tunnel/glass/landing sequence; their absence must be handled explicitly rather than substituting an unrelated clip.

The replacement hierarchy should remain `AvatarRig.root → ModelCorrectionGroup → CharacterModel/Skeleton`. Normalize soles, scale and orientation in the correction group. Use one mixer per character, and sample compatible clips deterministically from scroll progress or path distance with explicit blend weights. Preserve the proxy for loading/validation failures. Review all existing camera frames after a valid rig is available.

## Scene validation

Statuses below distinguish existing behavior from real-character integration. A static preview is not a pass for the cinematic scenes.

| Scene | Status | Finding |
|---|---|---|
| Hero | PASS — existing composition | Approved photograph, floating motion, head cage and navigation retained; no 3D replacement intended here. |
| Tunnel | BLOCKED | Supplied mesh can render, but no validated fall/brace rig or pose system is available. Proxy retained. |
| Glass break / landing | BLOCKED | Impact/recovery deformation and ground contact cannot be tested on an unskinned model. Existing effect retained. |
| Personal Journey | BLOCKED | Missing rig and walk/idle/turn clips. Existing root path and camera untouched. |
| YatraLok | BLOCKED | Existing intended avatar appearances preserved with proxy; no new character placement. |
| Prisha | BLOCKED | Same limitation; project content and choreography unchanged. |
| DOJ | BLOCKED | Same limitation; no avatar added to product-focused shots. |
| Holo Gesture | BLOCKED | Same limitation; no changes to gesture-world content or effects. |
| Professional Experience | BLOCKED | Placeholder-specific articulation cannot animate this mesh. Screenshots, company text and lighting preserved. |
| Contact Finale | BLOCKED for real avatar | Static model appears visually usable, but no validated natural idle/skeleton or production optimization exists. Proxy, footer and links retained. |

The prior [avatar scene inventory](avatar-readiness.md) continues to define world transforms, cameras, lighting, ground levels and expected states. No scene acceptance is claimed for the real model.

## Performance

The isolated model alone draws **1,954,409 triangles in one draw call**. One draw call does not offset its vertex/triangle cost across the portfolio.

Three 4K textures require approximately **192 MiB of RGBA base-level texel storage**, or **256 MiB including a full mip chain**. Vertex/index buffers total roughly **53 MiB** before driver overhead. These are calculated uncompressed storage estimates, not measured GPU allocation or a mobile frame-rate result. Source transfer size is 64.22 MB. No avatar mixer cost exists because there is no skeleton/animation.

No production or mobile rendering performance claim is made for this model. It is not loaded by the portfolio, so this inspection adds no model download or render cost to the production route. Optimization should preserve visual detail through suitable topology and texture baking, followed by actual desktop/mobile measurements on the rigged asset.

## Testing

- GLB header/version/length and scene metadata inspected.
- All embedded texture payloads decoded successfully.
- GLTFLoader loaded the model; ordinary Mesh/no skin/no clips confirmed at runtime.
- Front/side/back static renders captured at 1000×1000; source normalized to height 2.1 only in the inspection scene.
- Final isolated-browser validation: zero runtime errors, console warnings or failed HTTP responses. A preview-only favicon 404 from the initial capture was fixed with an inline favicon.
- Forward/reverse/fast scroll **with the real avatar: BLOCKED**, because installing an unrigged, animationless visual would not meet Phase 9 requirements.
- **3/3 existing portfolio smoke checks passed**: hero → Selected Work → Contact → replay at 1440×900 and 390×844, plus reduced-motion navigation. These validate the retained proxy experience, not real-avatar integration.
- `npm run build`: PASS. Existing Three.js chunk-size advisory remains; production source is unchanged.

Reproduce asset inspection with the development server running: `node scripts/validate-avatar-asset.mjs`. Its output explicitly reports `animatedIntegration: BLOCKED` for this file.

## Files

Added:

- `scripts/validate-avatar-asset.mjs`
- `docs/phase9-avatar-validation.md`
- `artifacts/phase9/preview.html`
- `artifacts/phase9/model-metadata.json`, `asset-audit.json`, `browser-validation.json`
- `artifacts/phase9/model-front.png`, `model-side.png`, `model-back.png`

Modified production source/assets: **none**. Removed files: **none**. The original GLB remains unchanged. `dist/` was regenerated by the successful build.

## Next phase

**Phase 9 remains blocked pending a rigged, optimized version of this model and validated animation clips.** Resume the same integration phase once that asset is available. Phase 10 is not started; scene-specific visual/performance follow-ups cannot be accurately finalized before the animated character is validated.
