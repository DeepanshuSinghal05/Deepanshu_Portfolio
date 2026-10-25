import {Vector3} from 'three';
import type {StoryPose} from '../story/StoryTrajectory';
import {mix,range,smooth} from '../cinematic/config';
type Shot={p:number;c:number[];t:number[];mc?:number[];mt?:number[];f?:number};
/** Appended trajectory starts at the exact frozen Prisha pose. All values are local to that endpoint. */
export function createDOJTrajectory(mobile:boolean,entrance:StoryPose){
 const origin=entrance.position.clone();
 const point=(a:number[])=>new Vector3(a[0]*(mobile?.55:1),a[1],a[2]*(mobile?.65:1)).add(origin);
 const shots:Shot[]=[
  {p:0,c:entrance.camera.clone().sub(origin).toArray(),t:entrance.target.clone().sub(origin).toArray(),f:entrance.fov},
  {p:.08,c:[-3,9,9],t:[0,5,-22],mc:[0,7,27],mt:[0,5,-14.3],f:42},
  {p:.135,c:[-2,6.5,1],t:[0,5,-22],mc:[0,6,24],mt:[0,5,-14.3],f:40},
  {p:.19,c:[-2,6.5,1],t:[0,5,-22],mc:[0,6,24],mt:[0,5,-14.3]},
  {p:.25,c:[9,6.8,-12],t:[8,6,-34],mc:[4.4,5,4.8],mt:[4.4,4,-22.1]},
  {p:.295,c:[9,6.8,-12],t:[8,6,-34],mc:[4.4,5,4.8],mt:[4.4,4,-22.1]},
  {p:.36,c:[14,10,-28],t:[5,2,-43],mc:[5.5,10,-10],mt:[2.7,2,-28]},
  {p:.435,c:[12,14,-37],t:[0,3,-55],mc:[1,15,-17],mt:[0,3,-36]},
  {p:.50,c:[9,11,-39],t:[0,3,-55],mc:[1,13,-18],mt:[0,3,-36]},
  {p:.565,c:[9,11,-39],t:[0,3,-55],mc:[1,13,-18],mt:[0,3,-36]},
  {p:.64,c:[8,8,-52],t:[0,3.7,-68],mc:[2,8,-29],mt:[0,3,-44]},
  {p:.705,c:[6,6,-61],t:[0,3,-75],mc:[0,6,-34],mt:[0,3,-49]},
  {p:.735,c:[6,6,-61],t:[0,3,-75],mc:[0,6,-34],mt:[0,3,-49]},
  {p:.80,c:[13,9,-32],t:[7,4,-47],mc:[4.5,8,-12],mt:[4.4,4,-30]},
  {p:.85,c:[10,7.8,-8],t:[8,7,-34],mc:[4.4,5,5],mt:[4.4,4,-22.1]},
  {p:.922,c:[10,7.8,-8],t:[8,7,-34],mc:[4.4,5,5],mt:[4.4,4,-22.1]},
  {p:.958,c:[-20,22,1],t:[1,3,-48],mc:[0,26,8],mt:[0,2,-31]},
  {p:.975,c:[-20,22,1],t:[1,3,-48],mc:[0,26,8],mt:[0,2,-31]},
  {p:1,c:[-5,7,-19],t:[-5,2,-39],mc:[-2.7,6,-6],mt:[-2.7,2,-25]},
 ];
 function sample(p:number):StoryPose{
  if(p<=0)return {...entrance,position:entrance.position.clone(),camera:entrance.camera.clone(),target:entrance.target.clone()};
  let a=shots[0],b=shots[1];for(let i=1;i<shots.length;i++){a=shots[i-1];b=shots[i];if(p<=b.p)break;}
  const u=smooth(range(p,a.p,b.p)),v=(k:Shot,key:'c'|'t')=>new Vector3(...(mobile?(key==='c'?k.mc??k.c:k.mt??k.t):k[key]) as [number,number,number]).add(origin);
  const travel=smooth(range(p,.01,.25)),leave=smooth(range(p,.30,.42)),returning=smooth(range(p,.80,.90)),exit=smooth(range(p,.965,1));
  const position=origin.clone().lerp(point([mobile?-8:-12,0,-30]),travel);position.x-=leave*(1-returning)*(mobile?14:23);position.lerp(point([-5,0,-39]),exit);
  const direction=new Vector3(0,0,-1),rotation=mix(mix(entrance.rotation,Math.PI,travel),.25,exit);
  return {position,direction,rotation,distance:travel,state:(p>.01&&p<.25||p>.965&&p<1)?'WALKING':'IDLE',camera:v(a,'c').lerp(v(b,'c'),u),target:v(a,'t').lerp(v(b,'t'),u),fov:mix(a.f??40,b.f??40,u),lookTarget:point([8,4,-34]),mode:p<.09?'DOJ_ENTRY':p<.21?'DOJ_PRODUCT':p<.31?'DOJ_QUESTION':p<.43?'DOJ_DESCENT':p<.59?'DOJ_RETRIEVAL':p<.68?'DOJ_CONTEXT':p<.76?'DOJ_LOCAL_MODEL':p<.84?'DOJ_RESPONSE_RETURN':p<.92?'DOJ_RESPONSE_HERO':p<.975?'DOJ_RESOLUTION':'PROJECT_04_HANDOFF',chapter:'doj-chatbot'};
 }
 const final=sample(1);
 return {origin,point,sample,project04Origin:final.position.toArray(),project04Direction:[0,0,-1],project04CameraStart:{position:final.camera.toArray(),target:final.target.toArray(),fov:final.fov},project04AvatarStart:{position:final.position.toArray(),rotation:final.rotation,state:final.state}};
}
