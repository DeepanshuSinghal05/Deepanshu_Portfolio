import { Group, Mesh, MeshStandardMaterial, SphereGeometry, BoxGeometry, CapsuleGeometry } from 'three';
import { cinematicConfig as C, mix, progressAt, range, smooth } from './config';
import { storyConfig } from '../story/storyConfig';
import type { StoryPose } from '../story/StoryTrajectory';

/** Visual contract: local origin between the soles, +Y up, +Z forward, height 2.1. */
export interface AvatarVisual { object: Group; kind?: 'proxy'|'character'; setLandingPose?: (compression: number, recovery: number) => void; setStoryPose?: (pose:StoryPose) => void }
export function AvatarPlaceholder(): AvatarVisual {
  const object = new Group();
  const material = new MeshStandardMaterial({ color: '#b9b4aa', metalness: .12, roughness: .56 });
  const dark = new MeshStandardMaterial({ color: '#44484a', metalness: .35, roughness: .42 });
  const head = new SphereGeometry(.205, 20, 14);
  const torso = new CapsuleGeometry(.29, .43, 4, 12);
  const limb = new CapsuleGeometry(.09, .58, 4, 8);
  const add = (geometry: SphereGeometry | CapsuleGeometry | BoxGeometry, x: number, y: number, z: number, mat = material) => {
    const mesh = new Mesh(geometry, mat); mesh.position.set(x, y, z); object.add(mesh); return mesh;
  };
  add(head, 0, 1.895, 0);
  add(torso, 0, 1.28, 0).scale.set(1, 1, .68);
  add(new BoxGeometry(.14, .045, .025), 0, 1.93, .196, dark); // Forward-facing marker.
  for (const side of [-1, 1]) {
    add(limb, side * .16, .48, 0);
    add(limb, side * .43, 1.22, 0).rotation.z = side * .09;
    add(new BoxGeometry(.2, .14, .36), side * .16, .07, .075, dark);
  }
  return { object, kind:'proxy' };
}
export class AvatarRig {
  readonly root = new Group();
  visual: AvatarVisual;
  compression = 0;
  constructor(visual: AvatarVisual = AvatarPlaceholder()) { this.visual = visual; this.root.add(visual.object); }
  replaceVisual(visual:AvatarVisual){
    const previous=this.visual;this.root.remove(previous.object);this.visual=visual;this.root.add(visual.object);
    if(previous.kind==='proxy'){
      const geometries=new Set<import('three').BufferGeometry>(),materials=new Set<import('three').Material>();
      previous.object.traverse(o=>{if(o instanceof Mesh){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
    }
  }
  updateStory(pose:StoryPose){
    this.root.position.copy(pose.position);this.root.rotation.set(0,pose.rotation,0);
    this.root.scale.setScalar(storyConfig.avatar.scale);this.compression=0;
    this.visual.setStoryPose?.(pose);
  }
  update(p: number, mobile: boolean) {
    const t = progressAt(p);
    // The root is the feet contact anchor. Geometry never owns the trajectory.
    const descent = t.descent < .78 ? .79 * (t.descent / .78) ** 1.7 : .79 + .21 * (1-(1-range(t.descent,.78,1))**2);
    let y = mix(mix(mobile ? C.avatar.mobileEntryFeet : C.avatar.entryFeet, -1.45, smooth(t.tunnel)), C.impactPoint[1], descent);
    y = mix(y, C.breakthroughY, smooth(t.breakthrough));
    y = mix(y, C.landingPoint[1], 1 - (1 - t.landing) ** 2);
    const compression = Math.sin(Math.PI * range(p, .87, .905)) * .085;
    this.compression = compression;
    // Once landed, only the camera reframes. Soles stay at the story origin.
    this.root.position.set(0, y, 0);
    this.root.rotation.set(mix(.06, 0, smooth(t.glass)), mix(-.12, 0, smooth(range(p,.76,.87))), .045 * Math.sin(t.descent * Math.PI) * (1 - t.glass));
    const scale = mix(mobile ? C.avatar.mobileEntryScale : C.avatar.entryScale, 1, smooth(t.tunnel));
    this.root.scale.set(scale * (1 + compression * .25), scale * (1 - compression), scale * (1 + compression * .25));
    this.visual.setLandingPose?.(compression, t.settle);
  }
}
