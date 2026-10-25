import { CatmullRomCurve3, Vector3 } from 'three';
import { cinematicConfig as C, mix, range, smooth } from '../cinematic/config';
import { storyConfig as S, storyTravel, storyAvatarState } from './storyConfig';
import { storyChapters } from './storyContent';

export function createStoryTrajectory(mobile:boolean){
  const origin=new Vector3(...C.storyOrigin);
  const curve=new CatmullRomCurve3(S.pathPoints.map(([x,y,z])=>new Vector3(Number((x*(mobile?S.mobile.widthScale:1)).toFixed(8)),y,Number((z*(mobile?S.mobile.travelScale:1)).toFixed(8))).add(origin)),false,'centripetal');
  const at=(u:number)=>u<=0?curve.points[0].clone():u>=1?curve.points[curve.points.length-1].clone():curve.getPointAt(u);
  const frames=[
    {p:0,c:[-1.85,1.65,6.5],t:[-1.85,1.1,0],f:38},
    {p:.19,c:[-1.85,1.65,6.5],t:[-1.85,1.1,0],f:38},
    {p:.31,c:[-4,2.5,8],t:[-2.8,1.1,-.8],f:40},
    {p:.44,c:[5.3,2.7,8],t:[2.8,1.1,-1],f:40},
    {p:.57,c:[-5.2,3.6,10],t:[-3,1.1,-1.4],f:41},
    {p:.70,c:[4.8,3.2,9],t:[2.6,1.1,-.5],f:40.5},
    {p:.83,c:[-4.5,2.4,7.5],t:[-2.5,1.1,0],f:40},
    {p:.985,c:[...S.final.desktopCameraOffset],t:[...S.final.desktopTargetOffset],f:S.final.fov},
  ];
  return {curve,at,sample(p:number){
    const distance=storyTravel(p),position=at(distance),direction=curve.getTangentAt(distance).normalize();
    position.y+=S.avatar.groundOffset;
    const anticipation=curve.getTangentAt(Math.min(1,distance+.008));
    const yaw=Math.atan2(anticipation.x,anticipation.z);
    const turn=smooth(range(p,.19,.235)),stop=smooth(range(p,.95,.985));
    // atan2 may wrap around -PI; choose the same positive-turn branch.
    const heading=yaw<0?yaw+Math.PI*2:yaw;
    const rotation=mix(heading*turn,S.final.avatarRotation[1],stop)+S.avatar.orientationOffset;
    let index=frames.findIndex((frame,i)=>i<frames.length-1&&p>=frame.p&&p<frames[i+1].p);
    if(index<0)index=frames.length-2;
    const a=frames[index],b=frames[index+1],blend=smooth(range(p,a.p,b.p));
    const camera=new Vector3(...a.c as [number,number,number]).lerp(new Vector3(...b.c as [number,number,number]),blend);
    const target=new Vector3(...a.t as [number,number,number]).lerp(new Vector3(...b.t as [number,number,number]),blend);
    let fov=mix(a.f,b.f,blend);
    if(mobile){
      const intro=smooth(range(p,0,.045)),side=Math.sin(p*Math.PI*4)*.28;
      camera.set(mix(C.camera.mobileFinalX,-.65+side,intro),mix(1.65,3.2,intro),mix(C.camera.mobileFinalZ,9.5,intro));
      target.set(mix(C.camera.mobileFinalX,-.65+side*.6,intro),mix(1.1,2.4,intro),0);
      const settle=smooth(range(p,.90,.985));
      camera.lerp(new Vector3(...S.final.mobileCameraOffset),settle);target.lerp(new Vector3(...S.final.mobileTargetOffset),settle);fov=mix(38,S.final.fov,intro);
    }
    camera.add(position);target.add(position).add(new Vector3(...S.avatar.cameraFramingOffset).sub(new Vector3(0,1.1,0)));
    const chapter=storyChapters.find(c=>p>=c.start&&p<c.end);
    const state=storyAvatarState(p);
    const mode=p<.235?'STORY_INTRO':p>=.95?'PHASE4_HANDOFF':chapter?.id==='foundation'?'FOUNDATION':chapter?.id==='full-stack'?'SYSTEMS':chapter?.id==='intelligence'?'INTELLIGENCE':'STORY_FOLLOW';
    const lookTarget=at(Math.min(1,distance+.05)).add(new Vector3(0,S.avatar.cameraFramingOffset[1],0));
    return {position,rotation,direction,distance,state,camera,target,fov,mode,lookTarget,chapter:chapter?.id??(p<.26?'introduction':p>=.9?'handoff':'transition')};
  }};
}
export type StoryPose=ReturnType<ReturnType<typeof createStoryTrajectory>['sample']>;
