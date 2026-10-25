import {Vector3} from 'three';
import {createProjectTrajectory} from '../projects/ProjectTrajectory';
import {createDOJTrajectory} from '../projects/DOJTrajectory';
import {createHoloTrajectory} from '../projects/HoloTrajectory';
import type {StoryPose} from '../story/StoryTrajectory';
import {range,smooth,mix} from '../cinematic/config';
import {experienceChapter} from './experienceContent';
export function projectWorldsExit(mobile:boolean){return createHoloTrajectory(mobile,createDOJTrajectory(mobile,createProjectTrajectory(mobile).sample(1)).sample(1)).sample(1);}
/** One human-scale path through a single room. The inherited endpoint is never approximated. */
export function createExperienceTrajectory(mobile:boolean,entrance=projectWorldsExit(mobile)){
 let aspect=1.6;
 const origin=entrance.position.clone();
 const point=(a:number[])=>new Vector3(a[0]*(mobile?.6:1),a[1],a[2]*(mobile?.6:1)).add(origin);
 const roots=[{p:0,a:[0,0,0]},{p:.055,a:[0,0,0]},{p:.23,a:[1.5,0,-7]},{p:.34,a:[2,0,-10]},{p:.385,a:[3,0,-14]},{p:.525,a:[3.1,0,-14.3]},{p:.595,a:[2.6,0,-19]},{p:.64,a:[2.3,0,-23]},{p:.775,a:[2.2,0,-23.3]},{p:.84,a:[2,0,-26]},{p:.97,a:[0,0,-32]},{p:1,a:[0,0,-32]}];
 const lengths=roots.map((r,i)=>i?point(r.a).distanceTo(point(roots[i-1].a)):0);
 const distanceAt=(p:number)=>{let d=0;for(let i=1;i<roots.length;i++)d+=lengths[i]*smooth(range(p,roots[i-1].p,roots[i].p));return d;};
 const walkWeight=(p:number)=>Math.min(1,Math.max(0,(distanceAt(p+.0001)-distanceAt(p-.0001))/.0002/35));
 function sample(p:number):StoryPose{
  if(p<=0)return {...entrance,position:entrance.position.clone(),camera:entrance.camera.clone(),target:entrance.target.clone()};
  let a=roots[0],b=roots[1];for(let i=1;i<roots.length;i++){a=roots[i-1];b=roots[i];if(p<=b.p)break;}
  const position=point(a.a).lerp(point(b.a),smooth(range(p,a.p,b.p))),human=smooth(range(p,.025,.23)),ending=smooth(range(p,.835,.97));
  const cameraOffset=mobile?new Vector3(-1,4.7,11):new Vector3(-2.2,3.3,9.7);
  const targetOffset=mobile?new Vector3(-1,2.75,0):new Vector3(-2.2,1.3,0);
  const reading=smooth(range(p,.34,.385))*(1-smooth(range(p,.525,.595)))+smooth(range(p,.595,.64))*(1-smooth(range(p,.775,.835)));
  cameraOffset.z+=reading*.35;
  const secondView=smooth(range(p,.555,.64))*(1-smooth(range(p,.79,.835)));
  cameraOffset.add(mobile?new Vector3(1,1.4,4.8).multiplyScalar(reading):new Vector3(4.4,-.25,-.45).multiplyScalar(secondView));
  targetOffset.x+=secondView*(mobile?0:4.4);
  if(mobile){targetOffset.y+=reading*2.65;targetOffset.x+=reading;}
  else {cameraOffset.y+=reading*1.8;targetOffset.y+=reading*1.8;}
  if(!mobile){const framing=mix(1,Math.min(1,aspect/1.6),reading);cameraOffset.x*=framing;targetOffset.x*=framing;}
  cameraOffset.lerp(mobile?new Vector3(0,3.9,11.8):new Vector3(0,2.7,9.4),ending);targetOffset.lerp(new Vector3(0,mobile?2.1:1.2,-.4),ending);
  const camera=entrance.camera.clone().lerp(position.clone().add(cameraOffset),human),target=entrance.target.clone().lerp(position.clone().add(targetOffset),human);
  return {position,camera,target,rotation:mix(entrance.rotation,Math.PI,smooth(range(p,.055,.15)))*(1-ending)+.15*ending,direction:new Vector3(0,0,-1),distance:distanceAt(p),fov:mix(40,38,human),state:p>.055&&p<.97?'WALKING':'IDLE',lookTarget:position.clone().add(new Vector3(0,1,-5)),chapter:experienceChapter(p),mode:p<.23?'PROJECT_FINALE':p<.34?'EXPERIENCE_INTRO':p<.84?'EXPERIENCE_OBSERVATION':p<.97?'EXPERIENCE_RESOLUTION':'CONTACT_READY'};
 }
 const end=sample(1);
 return {origin,point,sample,walkWeight,setAspect:(value:number)=>{aspect=value;},contactOrigin:end.position.toArray(),contactDirection:[0,0,-1],contactCameraStart:{position:end.camera.toArray(),target:end.target.toArray(),fov:end.fov},contactAvatarStart:{position:end.position.toArray(),rotation:end.rotation,state:end.state}};
}
