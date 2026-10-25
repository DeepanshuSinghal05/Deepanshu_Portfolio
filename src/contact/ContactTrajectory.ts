import {Vector3,PerspectiveCamera} from 'three';
import {createExperienceTrajectory} from '../experience/ExperienceTrajectory';
import {range,smooth,mix} from '../cinematic/config';
import type {StoryPose} from '../story/StoryTrajectory';
export function createContactTrajectory(mobile:boolean){
 let aspect=1.6;
 let characterBounds:number[][]|undefined,fitScale=1,fitDirty=true;
 const fitCamera=new PerspectiveCamera(38,aspect,.08,180);
 const entrance=createExperienceTrajectory(mobile).sample(1),origin=entrance.position.clone();
 const destination=origin.clone();
 function sample(p:number):StoryPose{
  const walk=smooth(range(p,.055,.58)),meet=smooth(range(p,.10,.78));
  const position=origin.clone().lerp(destination,walk);
  const offset=mobile?new Vector3(-.7,2.4,9.5):new Vector3(-1.9,2,5.7);
  const aim=mobile?new Vector3(-.7,1.95,0):new Vector3(-1.9,1.12,0);
  if(!mobile){const framing=Math.max(1,1.2/aspect);offset.z*=framing;offset.x*=Math.min(1,aspect/1.6)*framing;aim.x=offset.x;}
  if(characterBounds){
   if(fitDirty){
    fitScale=1;const corners:Vector3[]=[];for(const x of [characterBounds[0][0],characterBounds[1][0]])for(const y of [characterBounds[0][1],characterBounds[1][1]])for(const z of [characterBounds[0][2],characterBounds[1][2]])corners.push(new Vector3(x,y,z).applyAxisAngle(new Vector3(0,1,0),-.1));
    fitCamera.aspect=aspect;fitCamera.updateProjectionMatrix();
    for(let i=0;i<4;i++){
     fitCamera.position.copy(offset).multiplyScalar(fitScale);fitCamera.lookAt(aim.clone().multiplyScalar(fitScale));fitCamera.updateMatrixWorld(true);
     const center=new Vector3().project(fitCamera).x,points=corners.map(v=>v.clone().project(fitCamera).x),left=mobile?.06:.32,right=.94;
     const needed=Math.max(1,(center-Math.min(...points))/Math.max(.05,center-left),(Math.max(...points)-center)/Math.max(.05,right-center));
     if(needed<=1.001)break;fitScale*=needed*1.015;
    }
    fitDirty=false;
   }
   // Dolly around the planted foot anchor: preserve its screen location and the
   // existing camera direction while fitting the actual rest-pose arm span.
   offset.multiplyScalar(fitScale);aim.multiplyScalar(fitScale);
  }
  const camera=entrance.camera.clone().lerp(position.clone().add(offset),meet),target=entrance.target.clone().lerp(position.clone().add(aim),meet);
  return {...entrance,position,camera,target,rotation:mix(entrance.rotation,-.1,meet),distance:0,direction:new Vector3(0,0,-1),lookTarget:camera.clone(),chapter:'contact',mode:p>=.78?'FINAL_PORTRAIT':'CONTACT_ARRIVAL',fov:38,state:'IDLE'};
 }
 return {entrance,origin,destination,sample,setAspect:(value:number)=>{if(aspect!==value)fitDirty=true;aspect=value;},setCharacterBounds:(value:number[][]|undefined)=>{if(characterBounds!==value)fitDirty=true;characterBounds=value;},walkWeight:(_p:number)=>0,get finalPose(){return sample(1);}};
}
