import { AnimationMixer, AnimationClip, Bone, Group, Quaternion, Vector3, Matrix4, SkinnedMesh, type AnimationAction } from 'three';
import { range, smooth } from './config';

export const characterClips = {
  idle: 'idle.001',
  walkPrimary: 'walk.001',
  walkSecondary: 'Create a realistic, natural, full-body walking animation for th',
  turn: 'turn.001',
} as const;
export type CharacterFrame = { section:'cinematic'|'story'|'project'|'experience'|'contact'; progress:number; distance?:number; walkWeight?:number; turnProgress?:number };
type Semantic = keyof typeof characterClips;
const wrap = (v:number,d:number)=>((v%d)+d)%d;

/** One mixer. Absolute action times/weights are evaluated before the fall overlay.
 * No scheduled fades or accumulated gait deltas: reverse seeks reconstruct a pose.
 */
export class CharacterAnimation {
  private readonly mixer:AnimationMixer;
  private readonly actions:Record<Semantic,AnimationAction>;
  private readonly bones=new Map<string,Bone>();
  private readonly fall=new Map<Bone,Quaternion>();
  private readonly brace=new Map<Bone,Quaternion>();
  private readonly overlayBase=new Map<Bone,Quaternion>();
  private readonly point=new Vector3();
  private readonly inverse=new Matrix4();
  private readonly relative=new Matrix4();
  private readonly feet:{mesh:SkinnedMesh;indices:number[]}[]=[];
  private readonly originalY:number;
  private lastKey='';
  private lastTime=0;
  private settledTime=0;
  private frame:CharacterFrame={section:'cinematic',progress:0};
  private walkWeight=0;
  private turnWeight=0;
  private fallWeight=0;
  private impactWeight=0;
  private idleTime=0;
  private gaitTime=0;
  readonly stride:number;
  private readonly gaitDistances:number[];
  private readonly gaitTimes:number[];
  readonly clips:Record<Semantic,{name:string;duration:number}>;
  readonly bounds:number[][];

  constructor(private readonly model:Group,private readonly scale:number,skinned:SkinnedMesh[],clips:AnimationClip[]) {
    this.originalY=model.position.y;
    model.traverse(o=>{if(o instanceof Bone)this.bones.set(o.name.replace(/[^a-z0-9]/gi,''),o);});
    const hips=this.bone('Hips'),bindPosition=hips.position.clone(),bindTwist=this.twist(hips.quaternion);
    const source=Object.fromEntries(Object.entries(characterClips).map(([key,name])=>{
      const clip=clips.find(c=>c.name===name);
      if(!clip||!clip.tracks.length||clip.duration<=0)throw new Error(`Missing or empty character animation: ${name}`);
      if(clip.tracks.some(t=>![...t.values,...t.times].every(Number.isFinite)))throw new Error(`Non-finite animation: ${name}`);
      return [key,clip];
    })) as Record<Semantic,AnimationClip>;
    const travel=source.walkPrimary.tracks.find(t=>t.name===`${hips.name}.position`)!;
    this.stride=Math.hypot(travel.values[travel.values.length-3]-travel.values[0],travel.values[travel.values.length-1]-travel.values[2])*scale;
    this.gaitTimes=Array.from(travel.times);
    this.gaitDistances=this.gaitTimes.map((_,i)=>(travel.values[i*3+2]-travel.values[2])*scale);
    if(this.gaitDistances.some((d,i)=>i>0&&d<this.gaitDistances[i-1]))throw new Error('Primary walk root travel must be monotonic for distance scrubbing.');
    if(this.stride<.1)throw new Error('Primary walk has no usable stride reference.');
    this.clips=Object.fromEntries(Object.entries(source).map(([key,c])=>[key,{name:c.name,duration:c.duration}])) as typeof this.clips;
    this.mixer=new AnimationMixer(model);
    this.actions=Object.fromEntries(Object.entries(source).map(([key,clip])=>{
      // Runtime copies only: the supplied GLB, binding and original clips are intact.
      const clean=clip.clone();
      for(const track of clean.tracks){
        if(track.name===`${hips.name}.position`)for(let i=0;i<track.values.length;i+=3){track.values[i]=bindPosition.x;track.values[i+2]=bindPosition.z;}
        if(key==='turn'&&track.name===`${hips.name}.quaternion`)for(let i=0;i<track.values.length;i+=4){
          const q=new Quaternion().fromArray(track.values,i);
          q.premultiply(this.twist(q).invert()).premultiply(bindTwist).normalize().toArray(track.values,i);
        }
      }
      const action=this.mixer.clipAction(clean);action.play();action.setEffectiveWeight(0);
      return [key,action];
    })) as Record<Semantic,AnimationAction>;
    // Sample the real idle before ever attaching a visible mesh.
    this.actions.idle.setEffectiveWeight(1);this.mixer.update(0);model.updateMatrixWorld(true);
    const offsets:Record<string,[number,number,number]>={Spine:[.075,0,0],Spine1:[.035,0,0],Head:[-.06,0,0],LeftShoulder:[0,0,.025],RightShoulder:[0,0,-.025],LeftArm:[-.05,0,.18],RightArm:[-.05,0,-.18],LeftForeArm:[-.26,0,0],RightForeArm:[-.26,0,0],LeftUpLeg:[-.15,0,.02],RightUpLeg:[-.12,0,-.02],LeftLeg:[.31,0,0],RightLeg:[.27,0,0],LeftFoot:[-.16,0,0],RightFoot:[-.15,0,0]};
    const impact:Record<string,[number,number,number]>={...offsets,Spine:[.13,0,0],LeftArm:[-.10,0,.25],RightArm:[-.10,0,-.25],LeftForeArm:[-.42,0,0],RightForeArm:[-.42,0,0],LeftUpLeg:[-.32,0,.025],RightUpLeg:[-.30,0,-.025],LeftLeg:[.64,0,0],RightLeg:[.60,0,0],LeftFoot:[-.32,0,0],RightFoot:[-.30,0,0]};
    for(const [name,angles] of Object.entries(offsets))this.fall.set(this.bone(name),this.offsetPose(this.bone(name),angles));
    for(const [name,angles] of Object.entries(impact))this.brace.set(this.bone(name),this.offsetPose(this.bone(name),angles));
    for(const bone of this.fall.keys())this.overlayBase.set(bone,bone.quaternion.clone());
    // A bounded sample of sole vertices provides cheap grounding after deformation.
    // The full surface is used for diagnostics only, never scanned every frame.
    for(const mesh of skinned){
      const candidates:number[]=[],p=mesh.geometry.attributes.position;
      for(let i=0;i<p.count;i++)if(p.getY(i)<.035)candidates.push(i);
      const indices=candidates.filter((_,i)=>i%Math.max(1,Math.floor(candidates.length/160))===0);
      this.feet.push({mesh,indices});mesh.frustumCulled=false;
    }
    this.ground();
    // Conservative animated silhouette for camera fitting; excludes the bind T-pose.
    this.bounds=[[-.46,0,-.34],[.46,2.13,.34]];
  }
  private bone(name:string){const bone=this.bones.get(`mixamorig${name}`);if(!bone)throw new Error(`Missing humanoid joint: ${name}`);return bone;}
  private twist(q:Quaternion){const t=new Quaternion(0,q.y,0,q.w);return t.lengthSq()<1e-8?new Quaternion():t.normalize();}
  private offsetPose(bone:Bone,angles:[number,number,number]){
    // Convert model-space anatomical axes into this bone parent's local basis.
    const parent=bone.parent!.getWorldQuaternion(new Quaternion()),model=this.model.getWorldQuaternion(new Quaternion());
    const basis=parent.invert().multiply(model),delta=new Quaternion();
    for(let i=0;i<3;i++){const axis=new Vector3(i===0?1:0,i===1?1:0,i===2?1:0).applyQuaternion(basis);delta.multiply(new Quaternion().setFromAxisAngle(axis,angles[i]));}
    return bone.quaternion.clone().premultiply(delta).normalize();
  }
  private ground(){
    this.model.position.y=this.originalY;this.model.updateWorldMatrix(true,false);this.model.updateMatrixWorld(true);this.inverse.copy(this.model.matrixWorld).invert();
    let min=Infinity;
    for(const {mesh,indices} of this.feet){mesh.skeleton.update();this.relative.multiplyMatrices(this.inverse,mesh.matrixWorld);for(const index of indices){mesh.getVertexPosition(index,this.point).applyMatrix4(this.relative);min=Math.min(min,this.point.y);}}
    if(Number.isFinite(min))this.model.position.y=this.originalY-min;
    this.model.updateMatrixWorld(true);
  }
  private gaitAt(distance:number){
    const d=wrap(distance,this.stride);let lo=0,hi=this.gaitDistances.length-1;
    while(hi-lo>1){const mid=(lo+hi)>>1;if(this.gaitDistances[mid]<=d)lo=mid;else hi=mid;}
    const f=(d-this.gaitDistances[lo])/Math.max(1e-8,this.gaitDistances[hi]-this.gaitDistances[lo]);
    return this.gaitTimes[lo]+(this.gaitTimes[hi]-this.gaitTimes[lo])*f;
  }
  evaluate(frame:CharacterFrame,time=0){
    const key=`${frame.section}:${frame.progress}`;
    const same=this.lastKey===key;
    this.walkWeight=frame.walkWeight??0;this.turnWeight=frame.turnProgress===undefined?0:Math.sin(Math.PI*frame.turnProgress)**2*.38;
    const idleAllowed=frame.section!=='cinematic'||frame.progress>=.96;
    const stationary=idleAllowed&&this.walkWeight<.001&&this.turnWeight<.001;
    if(!same||time===0)this.settledTime=0;else if(stationary)this.settledTime+=Math.min(.05,Math.max(0,time-this.lastTime));
    this.lastTime=time;this.lastKey=key;this.frame=frame;
    this.idleTime=wrap((frame.distance??0)*.1+this.settledTime*.65,this.clips.idle.duration);
    this.gaitTime=this.gaitAt(frame.distance??0);
    for(const action of Object.values(this.actions))action.setEffectiveWeight(0);
    this.actions.idle.time=this.idleTime;this.actions.idle.setEffectiveWeight((1-this.walkWeight)*(1-this.turnWeight));
    this.actions.walkPrimary.time=this.gaitTime;this.actions.walkPrimary.setEffectiveWeight(this.walkWeight*(1-this.turnWeight));
    this.actions.turn.time=(frame.turnProgress??0)*(this.clips.turn.duration-1e-5);this.actions.turn.setEffectiveWeight(this.turnWeight);
    // PropertyMixer skips identical writes. Restore the last pre-overlay values
    // explicitly so a repeated absolute time can never accumulate procedural pose.
    for(const [bone,q] of this.overlayBase)bone.quaternion.copy(q);
    this.mixer.update(0);
    for(const [bone,q] of this.overlayBase)q.copy(bone.quaternion);
    this.fallWeight=0;this.impactWeight=0;
    if(frame.section==='cinematic'){
      const p=frame.progress;
      this.fallWeight=smooth(range(p,.08,.24))*(1-smooth(range(p,.87,.96)));
      this.impactWeight=smooth(range(p,.535,.58))*(1-smooth(range(p,.64,.735)))+.8*smooth(range(p,.815,.87))*(1-smooth(range(p,.89,.96)));
      const air=.97+.03*Math.sin(range(p,.24,.535)*Math.PI*2);
      for(const [bone,q] of this.fall)bone.quaternion.slerp(q,this.fallWeight*air);
      for(const [bone,q] of this.brace)bone.quaternion.slerp(q,this.impactWeight);
    }
    this.ground();
    return stationary;
  }
  get needsIdleFrame(){return (this.frame.section!=='cinematic'||this.frame.progress>=.96)&&this.walkWeight<.001&&this.turnWeight<.001;}
  snapshot(){return {state:this.fallWeight>.01?(this.impactWeight>.1?'BRACING':'FALLING'):this.turnWeight>.01?'TURNING':this.walkWeight>.01?'WALKING':'IDLE',walkWeight:this.walkWeight,turnWeight:this.turnWeight,fallWeight:this.fallWeight,impactWeight:this.impactWeight,gaitTime:this.gaitTime,idleTime:this.idleTime,distance:this.frame.distance??0,stride:this.stride,section:this.frame.section,progress:this.frame.progress,mixers:1,groundOffset:this.model.position.y*this.scale};}
  dispose(){this.mixer.stopAllAction();this.mixer.uncacheRoot(this.model);}
}
