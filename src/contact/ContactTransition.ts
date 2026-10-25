import {Mesh,LineSegments,Points,ShaderMaterial,type Group,type Material} from 'three';
/** Freeze/fade the approved experience, including its analytic shadow uniforms, without updating it. */
export function createContactTransition(group:Group){
 const saved=new Map<Material,{opacity:number;transparent:boolean;shadow?:number}>();
 return {fade(alpha:number){
  if(!saved.size)group.traverse(o=>{if(o instanceof Mesh||o instanceof LineSegments||o instanceof Points)for(const m of Array.isArray(o.material)?o.material:[o.material])if(!saved.has(m))saved.set(m,{opacity:m.opacity,transparent:m.transparent,shadow:m instanceof ShaderMaterial?m.uniforms.uOpacity?.value:undefined});});
  saved.forEach((s,m)=>{m.transparent=true;m.opacity=s.opacity*alpha;if(s.shadow!==undefined&&m instanceof ShaderMaterial)m.uniforms.uOpacity.value=s.shadow*alpha;});group.visible=alpha>.001;
 },restore(){saved.forEach((s,m)=>{m.opacity=s.opacity;m.transparent=s.transparent;if(s.shadow!==undefined&&m instanceof ShaderMaterial)m.uniforms.uOpacity.value=s.shadow;});saved.clear();}};
}
