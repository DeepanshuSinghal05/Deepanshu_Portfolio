import { Group, Mesh, CylinderGeometry, MeshPhysicalMaterial, TorusGeometry, MeshStandardMaterial, MeshBasicMaterial, PlaneGeometry, RingGeometry } from 'three';
import { cinematicConfig as C, progressAt, range, smooth } from './config';
import { createShardSystem } from './ShardSystem';
export function createGlassSystem(mobile: boolean) {
  const group = new Group();
  const material = new MeshPhysicalMaterial({color:'#dce3df',roughness:.075,metalness:.06,transparent:true,opacity:.3,transmission:mobile?0:.45,thickness:.08,ior:1.45,clearcoat:1,depthWrite:false});
  const pane = new Mesh(new CylinderGeometry(C.glass.radius,C.glass.radius,.028,8),material);pane.position.fromArray(C.impactPoint);group.add(pane);
  const trimMaterial = new MeshStandardMaterial({color:'#a69a83',metalness:.8,roughness:.3,transparent:true});
  const trim = new Mesh(new TorusGeometry(C.glass.radius,.022,4,8),trimMaterial);trim.rotation.x=Math.PI/2;trim.position.fromArray(C.impactPoint);group.add(trim);
  const shards=createShardSystem(mobile);group.add(shards.group);
  const reflectionMaterial=new MeshBasicMaterial({color:'#c5cfcb',transparent:true,opacity:0,depthWrite:false});
  const reflections=new Group(); reflections.position.fromArray(C.impactPoint); group.add(reflections);
  for(let i=0;i<3;i++){
    const strip=new Mesh(new PlaneGeometry(5.8-i*.7,.014+i*.004),reflectionMaterial);
    strip.rotation.x=-Math.PI/2;strip.rotation.z=.12;strip.position.set(0,.022,(i-1)*1.3);reflections.add(strip);
  }
  const stressMaterial=new MeshBasicMaterial({color:'#e2cfab',transparent:true,opacity:0,depthWrite:false});
  const stress=new Mesh(new RingGeometry(.07,.11,32),stressMaterial);stress.rotation.x=-Math.PI/2;stress.position.set(...C.impactPoint);stress.position.y+=.025;group.add(stress);
  return {group,update(p:number){
    const t=progressAt(p), visibility=smooth(t.glass)*(1-range(p,.79,.87));
    group.visible=p>.375&&p<.87;
    if (!group.visible) return;
    const discovery=smooth(range(p,.375,.55));
    pane.visible=t.fracture===0;material.opacity=.16*visibility;trimMaterial.opacity=.52*discovery*(1-range(p,.79,.87));
    reflectionMaterial.opacity=.32*discovery*(1-smooth(range(p,.56,.595)));
    // A localized stress response leads the cracks; it does not explode outward.
    stress.scale.setScalar(1+smooth(range(p,.56,.579))*3.5);
    stressMaterial.opacity=(.2+.6*Math.sin(Math.PI*range(p,.56,.58)))*(1-smooth(range(p,.579,.595)))*Number(p>=.56);
    shards.update(t.fracture,t.impact,visibility);
  },snapshot:shards.snapshot,diagnostics(p:number){return {stage:p<.375?'HIDDEN':p<.56?'DISCOVERY':p<.595?'CRACKING':p<=.62?'FRACTURED_HOLD':p<.735?'SEPARATING':p<.87?'DEBRIS':'INACTIVE',paneVisible:group.visible&&pane.visible,...shards.diagnostics()};},count:shards.count};
}
