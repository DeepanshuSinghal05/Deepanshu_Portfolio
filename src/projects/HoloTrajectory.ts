import {Vector3} from 'three';
import type {StoryPose} from '../story/StoryTrajectory';
import {mix,range,smooth} from '../cinematic/config';
type Shot={p:number;c:number[];t:number[]};
export function createHoloTrajectory(mobile:boolean,entrance:StoryPose){
 const origin=entrance.position.clone(),scale=mobile?.65:1,point=(a:number[])=>new Vector3(...a as [number,number,number]).multiplyScalar(scale).add(origin);
 const shots:Shot[]=[
  {p:0,c:entrance.camera.clone().sub(origin).divideScalar(scale).toArray(),t:entrance.target.clone().sub(origin).divideScalar(scale).toArray()},
  {p:.065,c:[0,7,11],t:[0,6,-14]},
  {p:.13,c:[0,7,12],t:[0,6,-18]}, {p:.175,c:[0,7,12],t:[0,6,-18]},
  {p:.235,c:[-1.4,6.5,-1],t:[-3,6,-16]},
  {p:.29,c:[1,6.7,-1],t:[0,6,-17]},
  {p:.335,c:[7,7,-1],t:[5,6,-19]},
  {p:.375,c:[9,7,-3],t:[8,6,-23]},
  {p:.415,c:[1,8,5],t:[0,6,-20]},
  {p:.475,c:[5,8,-1],t:[0,6,-21]},
  {p:.52,c:[8,8,-8],t:[0,6,-21]},
  {p:.565,c:[3,8,-1],t:[0,6,-20]},
  {p:.615,c:[-2,7,-1],t:[-2,6,-18]},
  {p:.665,c:[0,7,3],t:[0,6,-18]},
  {p:.72,c:[0,7,-2],t:[0,6,-18]},
  {p:.79,c:[0,9,8],t:[0,6,-20]},
  {p:.83,c:[0,7,12],t:[0,6,-18]}, {p:.875,c:[0,7,12],t:[0,6,-18]},
  {p:.905,c:[-1,7,3],t:[0,6,-18]},
  {p:.95,c:[0,10,10],t:[0,5,-21]},
  {p:1,c:[-3,6,-13],t:[-3,2,-34]},
 ];
 function sample(p:number):StoryPose{
  if(p<=0)return {...entrance,position:entrance.position.clone(),camera:entrance.camera.clone(),target:entrance.target.clone()};
  let a=shots[0],b=shots[1];for(let i=1;i<shots.length;i++){a=shots[i-1];b=shots[i];if(p<=b.p)break;}
  const u=smooth(range(p,a.p,b.p));
  const pos=(s:Shot,k:'c'|'t')=>{if(s.p===0)return (k==='c'?entrance.camera:entrance.target).clone();const v=point(s[k]);if(mobile&&k==='c'){v.x=origin.x+(v.x-origin.x)*.45;v.z+=s.p===1?6:[.13,.175,.83,.875].includes(s.p)?31:[.475,.52].includes(s.p)?23:[.235,.29].includes(s.p)?9:16;}return v;};
  const away=smooth(range(p,.075,.13))*(1-smooth(range(p,.94,.99))),walk=smooth(range(p,.94,1));
  const position=origin.clone().lerp(point([-3,0,-34]),walk);position.x-=away*(mobile?22:36);
  return {position,direction:new Vector3(0,0,-1),rotation:mix(entrance.rotation,.1,walk),distance:walk,state:p>.94&&p<1?'WALKING':'IDLE',camera:pos(a,'c').lerp(pos(b,'c'),u),target:pos(a,'t').lerp(pos(b,'t'),u),fov:40,lookTarget:point([0,6,-20]),mode:p<.1?'HOLO_SENSOR':p<.19?'HOLO_PRODUCT':p<.29?'HOLO_PINCH':p<.39?'HOLO_MOMENTUM':p<.48?'HOLO_STRETCH':p<.565?'HOLO_SEPARATION':p<.73?'HOLO_INFORMATION':p<.815?'HOLO_SCENE_CONTROL':p<.89?'HOLO_JARVIS':p<.95?'HOLO_RESOLUTION':'PROJECT_WORLDS_SEED',chapter:'holo-gesture'};
 }
 const final=sample(1);
 return {point,origin,scale,sample,handoff:{origin:final.position.toArray(),direction:[0,0,-1],camera:final.camera.toArray(),target:final.target.toArray(),fov:final.fov,avatar:final.position.toArray(),rotation:final.rotation,state:final.state}};
}
