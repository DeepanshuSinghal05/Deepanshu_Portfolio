import { Vector3, CatmullRomCurve3 } from 'three';
import { createStoryTrajectory } from '../story/StoryTrajectory';
import type { StoryPose } from '../story/StoryTrajectory';
import { range, smooth, mix } from '../cinematic/config';
import { projectState } from './projectConfig';
type Shot={p:number;c:number[];t:number[];f:number;mc?:number[];mt?:number[]};
/** Camera keys are independent of the avatar route. Duplicate poses create read holds. */
export const projectCameraSequence:Shot[]=[
 {p:.085,c:[-7,6,3],t:[-2,3,-11],f:40,mc:[-1,7,11],mt:[-1,3,-8]},
 {p:.13,c:[-6.1,4.9,-2.5],t:[-4,3.9,-12],f:37,mc:[-2.1,4.4,3.4],mt:[-2.2,3.8,-7.8]},
 {p:.18,c:[-6.1,4.9,-2.5],t:[-4,3.9,-12],f:37,mc:[-2.1,4.4,3.4],mt:[-2.2,3.8,-7.8]},
 {p:.218,c:[-10,7,-10],t:[-2,1,-23],f:42,mc:[0,10,2],mt:[0,1,-15]},
 {p:.262,c:[-5,17,-15],t:[1,0,-27],f:43,mc:[0,23,4],mt:[0,0,-17.5]},
 {p:.29,c:[-3.8,17,-15.8],t:[1,0,-27],f:43,mc:[.4,23,4],mt:[0,0,-17.5]},
 {p:.323,c:[-3.8,17,-15.8],t:[1,0,-27],f:43,mc:[.4,23,4],mt:[0,0,-17.5]},
 {p:.357,c:[10.2,4.8,-24.4],t:[8,2.6,-32],f:37,mc:[4.6,3.9,-13.7],mt:[4.4,2.6,-20.8]},
 {p:.399,c:[10.2,4.8,-24.4],t:[8,2.6,-32],f:37,mc:[4.6,3.9,-13.7],mt:[4.4,2.6,-20.8]},
 {p:.447,c:[-18,23,-4],t:[1,1,-25],f:45,mc:[0,27,13],mt:[0,1,-15]},
 {p:.478,c:[-18,23,-4],t:[1,1,-25],f:45,mc:[0,27,13],mt:[0,1,-15]},
 {p:.56,c:[-15,10,-37],t:[-6,6,-60],f:42,mc:[-3.8,8,-18],mt:[-3.8,4.5,-39]},
 {p:.58,c:[-11,7.7,-39.5],t:[-7,5.3,-60],f:42,mc:[-3.8,7,-18],mt:[-3.8,4.5,-39]},
 {p:.607,c:[-11,7.7,-39.5],t:[-7,5.3,-60],f:42,mc:[-3.8,7,-18],mt:[-3.8,4.5,-39]},
 {p:.636,c:[6,5.8,-59],t:[3.3,3.8,-70.8],f:37,mc:[2,5.5,-31.8],mt:[2,3.7,-46]},
 {p:.661,c:[6,5.8,-59],t:[3.3,3.8,-70.8],f:37,mc:[2,5.5,-31.8],mt:[2,3.7,-46]},
 {p:.696,c:[-3.8,5.2,-72.3],t:[0,3,-85],f:40,mc:[0,4.9,-34.2],mt:[0,2.9,-55]},
 {p:.728,c:[-3.8,5.2,-72.3],t:[0,3,-85],f:40,mc:[0,4.9,-34.2],mt:[0,2.9,-55]},
 // Pass the RIGHT edge of checkout, then follow the packet into the structure behind it.
 {p:.758,c:[10,5.8,-84],t:[4,2,-95],f:40,mc:[3.7,5,-48],mt:[2.2,2,-62]},
 {p:.779,c:[15,8,-88],t:[8,1.8,-104],f:40,mc:[4.5,5.7,-53],mt:[4,2,-66]},
 {p:.805,c:[18,9,-94],t:[10,1.8,-108],f:40,mc:[5.5,5.8,-58],mt:[5.5,2,-71]},
 {p:.827,c:[17,7,-103],t:[12,3,-114],f:40,mc:[6.7,6,-59],mt:[7,3,-75]},
 {p:.854,c:[17,5.8,-97],t:[14,3.3,-118],f:40,mc:[7.2,5.5,-54.5],mt:[7.2,3.8,-77]},
 {p:.882,c:[17,5.8,-97],t:[14,3.3,-118],f:40,mc:[7.2,5.5,-54.5],mt:[7.2,3.8,-77]},
 {p:.937,c:[32,38,-53],t:[1,2,-89],f:47,mc:[5,37,-23],mt:[3,1,-59]},
 {p:.968,c:[32,38,-53],t:[1,2,-89],f:47,mc:[5,37,-23],mt:[3,1,-59]},
 {p:1,c:[28,25,-69],t:[9,1,-107],f:47,mc:[6,29,-36],mt:[5,1,-70]},
];
export function createProjectTrajectory(mobile:boolean){
 const entrance=createStoryTrajectory(mobile).sample(1),origin=entrance.position.clone();
 const point=(a:number[])=>new Vector3(a[0]*(mobile?.55:1),a[1],a[2]*(mobile?.65:1)).add(origin);
 const curve=new CatmullRomCurve3([[0,0,0],[-10,0,-8],[-8,0,-20],[1,0,-26],[8,0,-32],[0,0,-47],[8,0,-59],[7,0,-73],[-7,0,-85],[7,0,-99],[12,0,-115],[12,0,-124]].map(point),false,'centripetal');
 const rootKeys=[[0,0],[.047,0],[.14,.095],[.18,.095],[.25,.20],[.323,.24],[.37,.30],[.40,.30],[.47,.34],[.56,.46],[.63,.54],[.66,.54],[.72,.66],[.76,.73],[.83,.89],[.882,.89],[.937,1],[1,1]];
 const first:Shot={p:.047,c:entrance.camera.clone().sub(origin).toArray(),t:entrance.target.clone().sub(origin).toArray(),f:entrance.fov};
 const shots=[first,...projectCameraSequence];
 return {origin,curve,point,sample(p:number):StoryPose{
  if(p<=.047)return {...entrance,position:entrance.position.clone(),camera:entrance.camera.clone(),target:entrance.target.clone()};
  let a=shots[0],b=shots[1];for(let i=1;i<shots.length;i++){a=shots[i-1];b=shots[i];if(p<=b.p)break;}
  const u=smooth(range(p,a.p,b.p));
  const c=(k:Shot)=>new Vector3(...(mobile&&k.mc?k.mc:k.c) as [number,number,number]).add(origin);
  const t=(k:Shot)=>new Vector3(...(mobile&&k.mt?k.mt:k.t) as [number,number,number]).add(origin);
  let ra=rootKeys[0],rb=rootKeys[1];for(let i=1;i<rootKeys.length;i++){ra=rootKeys[i-1];rb=rootKeys[i];if(p<=rb[0])break;}
  const distance=mix(ra[1],rb[1],smooth(range(p,ra[0],rb[0]))),position=curve.getPointAt(distance),direction=curve.getTangentAt(distance),s=projectState(p);
  if(!mobile)position.x-=8*smooth(range(p,.64,.696))*(1-smooth(range(p,.84,.97)));
  if(mobile)position.x-=4*smooth(range(p,.325,.356))*(1-smooth(range(p,.40,.438)));
  if(mobile)position.x-=3*(smooth(range(p,.675,.695))*(1-smooth(range(p,.735,.765)))+smooth(range(p,.80,.825))*(1-smooth(range(p,.885,.915))));
  const moving=rb[1]>ra[1]&&p<rb[0],yaw=Math.atan2(direction.x,direction.z),facing=yaw<0?yaw+Math.PI*2:yaw,settle=smooth(range(p,.882,.937));
  return {position,direction,distance,rotation:mix(mix(.25,facing,smooth(range(p,.047,.11))),.25,settle),state:moving?'WALKING':'IDLE',camera:c(a).lerp(c(b),u),target:t(a).lerp(t(b),u),fov:mix(a.f,b.f,u),mode:p<.08?'PROJECT_PORTAL':p>.967?'DOJ_HANDOFF':p>.47&&p<.56?'SYSTEM_TRANSFORMATION':`${s.project.id.toUpperCase()}_${s.beat.id.toUpperCase()}`,lookTarget:position.clone().add(direction.clone().multiplyScalar(4)).add(new Vector3(0,2,0)),chapter:s.project.id};
 }};
}
