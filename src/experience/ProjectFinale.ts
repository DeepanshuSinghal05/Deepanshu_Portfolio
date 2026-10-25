import {Group,Mesh,LineSegments,Points,Light,type Material} from 'three';
/** Fade a frozen scene without advancing any of its systems. Original material state restores on reverse. */
export function createProjectFinale(group:Group){
 const materials=new Map<Material,{opacity:number;transparent:boolean}>(),lights=new Map<Light,number>();
 return {fade(alpha:number){
  if(!materials.size)group.traverse(o=>{if(o instanceof Mesh||o instanceof LineSegments||o instanceof Points)for(const m of Array.isArray(o.material)?o.material:[o.material])if(!materials.has(m))materials.set(m,{opacity:m.opacity,transparent:m.transparent});if(o instanceof Light)lights.set(o,o.intensity);});
  materials.forEach((state,m)=>{m.transparent=true;m.opacity=state.opacity*alpha;});lights.forEach((intensity,l)=>l.intensity=intensity*alpha);group.visible=alpha>.001;
 },restore(){materials.forEach((state,m)=>{m.opacity=state.opacity;m.transparent=state.transparent;});lights.forEach((intensity,l)=>l.intensity=intensity);materials.clear();lights.clear();}};
}
