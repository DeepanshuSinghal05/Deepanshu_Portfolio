import {Mesh,type Group} from 'three';
/** Small, scroll-derived articulation of the existing placeholder; no rig or earlier pose changes. */
export function createExperienceWalk(visual:Group){
 const parts=visual.children.filter((o):o is Mesh=>o instanceof Mesh).map(mesh=>({mesh,position:mesh.position.clone(),rotation:mesh.rotation.clone()}));
 const reset=()=>parts.forEach(p=>{p.mesh.position.copy(p.position);p.mesh.rotation.copy(p.rotation);});
 return {reset,update(distance:number,weight:number){
  reset();const stride=Math.sin(distance*4.2)*weight;
  for(const {mesh,position}of parts){
   const side=Math.sign(position.x),leg=Math.abs(position.y-.48)<.001,foot=Math.abs(position.y-.07)<.001,arm=Math.abs(position.y-1.22)<.001;
   if(leg||foot){mesh.position.z+=side*stride*.13;mesh.position.y+=Math.max(0,side*stride)*.045;if(leg)mesh.rotation.x=side*stride*.16;}
   if(arm){mesh.rotation.x=-side*stride*.16;mesh.position.z-=side*stride*.07;}
  }
 },snapshot:()=>parts.map(p=>({position:p.mesh.position.toArray(),rotation:p.mesh.rotation.toArray().slice(0,3)}))};
}
