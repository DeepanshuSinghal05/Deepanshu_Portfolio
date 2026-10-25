import { PerspectiveCamera, Vector3 } from 'three';
import { cinematicConfig as C, mix, progressAt, smooth, range } from './config';
import type { StoryPose } from '../story/StoryTrajectory';
export class CameraRig {
  readonly camera = new PerspectiveCamera(C.camera.fov, 1, .08, 180);
  readonly target = new Vector3();
  mode = 'TUNNEL_FOLLOW';
  resize(width: number, height: number) { this.camera.aspect = width / height; this.camera.updateProjectionMatrix(); }
  updateStory(pose:StoryPose){
    this.camera.position.copy(pose.camera);this.target.copy(pose.target);this.camera.fov=pose.fov;this.mode=pose.mode;
    this.camera.lookAt(this.target);this.camera.updateProjectionMatrix();
  }
  update(p: number, feetY: number, mobile: boolean) {
    const t = progressAt(p), reveal = smooth(t.tunnel), settle = smooth(t.settle);
    const impulse = Math.sin(range(p, .56, .62) * Math.PI * 2) * .045 * (1 - range(p, .56, .62));
    const scaleShot = Math.sin(Math.PI * range(p,.23,.43));
    const speed = smooth(range(p,.32,.46)) * (1-smooth(range(p,.49,.555)));
    const approach = smooth(range(p,.48,.555)) * (1-smooth(range(p,.66,.76)));
    const drift = Math.sin(range(p,.24,.7)*Math.PI*2) * (mobile ? .2 : .7) * (1-smooth(range(p,.49,.55)));
    const z = (mobile ? 9.2 : 8) + scaleShot * C.camera.scalePullback * (mobile ? .45 : 1) - approach * .7;
    const landingKick = Math.sin(range(p,.87,.915)*Math.PI*2)*.035*(1-range(p,.87,.915));
    this.camera.position.set((mix(0, 1.7, reveal)+drift) * (1 - settle), mix(0, feetY + 5 + speed*C.camera.fallLag, reveal) + impulse + landingKick, mix(5.6, z, reveal));
    this.target.set(0, mix(-.1, feetY - .6 + Math.sin(t.descent * Math.PI * 2) * .28 - speed*.25, reveal), 0);
    const finalPosition = new Vector3(...C.camera.finalPosition);
    const finalTarget = new Vector3(...C.camera.finalTarget);
    if (mobile) { finalPosition.z = C.camera.mobileFinalZ; finalPosition.x = finalTarget.x = C.camera.mobileFinalX; }
    this.camera.position.lerp(finalPosition, settle);
    this.target.lerp(finalTarget, settle);
    this.camera.fov = mix(C.camera.fov + speed*C.camera.speedFov*(mobile?.45:1) + impulse*4, C.camera.finalFov, settle);
    this.mode = p >= .96 ? 'STORY_READY' : p >= .76 ? 'LANDING' : p >= .535 && p < .64 ? 'GLASS_IMPACT' : 'TUNNEL_FOLLOW';
    this.camera.lookAt(this.target); this.camera.updateProjectionMatrix();
  }
}
