import { Group, BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial, Mesh, SphereGeometry, MeshBasicMaterial, type CatmullRomCurve3 } from 'three';
import { smooth,range } from '../cinematic/config';
import type { Point } from './ProjectEnvironment';
/** Reuses one route and its nodes, reshaping journey space into the commerce approach. */
export function createProjectTransition(point:Point,mobile:boolean,source:CatmullRomCurve3){
 const group=new Group(),count=mobile?40:72,positions=new Float32Array((count+1)*3);
 const geometry=new BufferGeometry().setAttribute('position',new Float32BufferAttribute(positions,3));
 const material=new LineBasicMaterial({color:'#d8cfbc',transparent:true,opacity:.7}),line=new Line(geometry,material);line.frustumCulled=false;group.add(line);
 const nodeMaterial=new MeshBasicMaterial({color:'#e4d8be',transparent:true,opacity:.8});
 const nodes=Array.from({length:mobile?4:6},()=>{const mesh=new Mesh(new SphereGeometry(.08,8,6),nodeMaterial);group.add(mesh);return mesh;});
 const sample=(t:number,morph:number)=>{
  const a=source.getPointAt(t);
  const center=source.getPointAt(.55);a.lerp(center,Math.sin(morph*Math.PI)*.16);
  const b=point([-7+10.3*t,.3+4.4*t,-51-t*20]);return a.lerp(b,morph);
 };
 const exitGeometry=new BufferGeometry().setFromPoints([[12,.08,-124],[12,.08,-130],[16,.08,-138]].map(point));
 const exit=new Line(exitGeometry,new LineBasicMaterial({color:'#d8c3a0',transparent:true,opacity:0}));group.add(exit);
 return {group,update(p:number){const morph=smooth(range(p,.478,.56)),visible=p>.455&&p<.61,alpha=smooth(range(p,.455,.48))*(1-smooth(range(p,.565,.61)));line.visible=visible;material.opacity=alpha*.8;nodeMaterial.opacity=alpha;
  if(visible){const a=geometry.attributes.position;for(let i=0;i<=count;i++){const v=sample(i/count,morph);a.setXYZ(i,v.x,v.y,v.z);}a.needsUpdate=true;geometry.computeBoundingSphere();}
  nodes.forEach((n,i)=>{n.visible=visible;n.position.copy(sample(i/(nodes.length-1),morph));});
  exit.material.opacity=smooth(range(p,.94,1))*.75;
  return {networkMorph:morph,transition:visible?'JOURNEY_TO_TRANSACTION':p>.967?'PRISHA_TO_DOJ':p<.08?'STORY_TO_PORTAL':'NONE'};
 }};
}
