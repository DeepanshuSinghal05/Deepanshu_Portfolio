import {Group,Mesh,InstancedMesh,Object3D,BoxGeometry,PlaneGeometry,BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,MeshBasicMaterial,ShaderMaterial,LineSegments,LineBasicMaterial,CanvasTexture,SRGBColorSpace,Vector3} from 'three';
import {range,smooth,mix} from '../cinematic/config';
import {experiences} from './experienceContent';
const ramp=(p:number,a:number,b:number)=>smooth(range(p,a,b));
/** Additive Phase 6 architecture. Everything is invisible throughout the frozen finale (q <= .23). */
export function createExperienceArchitecture(mobile:boolean,point:(p:number[])=>Vector3){
 const group=new Group();group.name='career-corridor';group.visible=false;
 const scale=mobile?.6:1,dummy=new Object3D();
 const columnData=(mobile?[[6.8,2.8,-14],[6.8,2.8,-24],[6.8,2.8,-34]]:[[6.8,3.4,-12],[6.8,3.4,-19],[6.8,3.4,-26],[6.8,3.4,-33],[-7,3.4,-20],[-7,3.4,-30]]);
 const beamData=mobile?[[2.5,5.6,-25,8.6,.13,.32],[2.5,5.6,-35,8.6,.13,.32]]:[[0,6.8,-20,14,.16,.42],[0,6.8,-27,14,.16,.42],[0,6.8,-34,14,.16,.42]];
 const columns=new InstancedMesh(new BoxGeometry(1,1,1),new MeshStandardMaterial({color:'#b6b5a9',roughness:.93,transparent:true,opacity:0}),columnData.length+beamData.length);group.add(columns);

 const pathPoints=[[1.5,-7],[2,-10],[3,-14],[3.1,-14.3],[2.6,-19],[2.3,-23],[2.2,-23.3],[2,-26],[0,-32],[0,-39]];
 const vertices:number[]=[];for(let i=1;i<pathPoints.length;i++){const [ax,az]=pathPoints[i-1],[bx,bz]=pathPoints[i];const width=.9;for(const [x,z]of [[ax-width,az],[ax+width,az],[bx-width,bz],[bx-width,bz],[ax+width,az],[bx+width,bz]])vertices.push(x*scale,.007,z*scale);}
 const path=new Mesh(new BufferGeometry().setAttribute('position',new Float32BufferAttribute(vertices,3)),new MeshBasicMaterial({color:'#c8c4b5',transparent:true,opacity:0,depthWrite:false,side:2}));path.position.copy(point([0,0,0]));group.add(path);
 const landings=new InstancedMesh(new PlaneGeometry(1,1),new MeshBasicMaterial({color:'#c8c4b5',transparent:true,opacity:0,depthWrite:false}),2);group.add(landings);
 // Analytic, feathered architectural shadows avoid a shadow-map pass and remain exact under reversal.
 const shadows=new ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uOpacity:{value:0},uDefinition:{value:0}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv; uniform float uOpacity; uniform float uDefinition; void main(){float edge=mix(.075,.026,uDefinition);float s=vUv.x*.7+vUv.y;float band=0.;for(int i=0;i<4;i++){float c=.38+float(i)*.22;band+=smoothstep(c-edge,c,s)*(1.-smoothstep(c+.032,c+.032+edge,s));}float fade=smoothstep(0.,.12,vUv.x)*(1.-smoothstep(.83,1.,vUv.x))*smoothstep(0.,.08,vUv.y)*(1.-smoothstep(.9,1.,vUv.y));gl_FragColor=vec4(.29,.29,.25,min(band,1.)*fade*uOpacity);}' });
 const floorShadow=new Mesh(new PlaneGeometry(26*scale,42*scale),shadows);floorShadow.rotation.x=-Math.PI/2;floorShadow.position.copy(point([0,.015,-24]));group.add(floorShadow);
 const wallShadow=new Mesh(new PlaneGeometry(12*scale,7),shadows);wallShadow.position.copy(point([-6.84,3.5,-25]));wallShadow.rotation.y=Math.PI/2;group.add(wallShadow);
 const frosted=new Mesh(new PlaneGeometry(3.8*scale,4.1),new MeshStandardMaterial({color:'#e9e7df',roughness:.7,transparent:true,opacity:0,depthWrite:false}));frosted.position.copy(point([5.7,2.05,-29]));frosted.rotation.y=-.22;group.add(frosted);
 const fragments=experiences.map((e,i)=>{
  const lines:number[]=[];for(let row=0;row<3;row++){const y=1.7-row*.4;lines.push(-1.5,y,0,1.4-row*.2,y,0,-1.5,y-.13,0,-.3,y-.13,0);}if(i===0)lines.push(-1.8,.4,0,-1.8,2,0,-1.8,2,0,-1.5,2,0);else lines.push(1.8,.4,0,1.8,2.1,0,-1.8,2.1,0,1.8,2.1,0);
  const mesh=new LineSegments(new BufferGeometry().setAttribute('position',new Float32BufferAttribute(lines,3)),new LineBasicMaterial({color:'#747c70',transparent:true,opacity:0,depthWrite:false}));mesh.position.copy(point([5,1,i?-34:-22]));mesh.scale.setScalar(mobile?.65:1);mesh.name=`work-memory-${e.id}`;group.add(mesh);return mesh;
 });
 const year=experiences[0].period.match(/\d{4}/)?.[0]??'';
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=256;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#777b6e';ctx.font='200px "Instrument Serif", Georgia, serif';ctx.textAlign='center';ctx.fillText(year,384,206);
 const texture=new CanvasTexture(canvas);texture.colorSpace=SRGBColorSpace;
 const years=new InstancedMesh(new PlaneGeometry(1,1),new MeshBasicMaterial({map:texture,transparent:true,opacity:0,depthWrite:false,toneMapped:false}),1);group.add(years);years.visible=!mobile;
 let snapshot={};
 return {group,update(p:number){
  group.visible=p>.23;if(!group.visible)return;
  const first=ramp(p,.30,.405),second=ramp(p,.565,.69),settle=ramp(p,.955,.997),growth=first*.55+second*.45;
  columns.material.opacity=.72*first*(1-settle*.65);columnData.forEach(([x,y,z],i)=>{const rise=ramp(p,.28+i*.04,.39+i*.04);dummy.position.copy(point([x,y-mix(.65,0,rise),z]));dummy.rotation.set(0,0,0);dummy.scale.set(.14*scale,y*2,.25*scale);dummy.updateMatrix();columns.setMatrixAt(i,dummy.matrix);});columns.instanceMatrix.needsUpdate=true;
  beamData.forEach(([x,y,z,w,h,d],i)=>{dummy.position.copy(point([x,y+mix(.35,0,second),z]));dummy.rotation.set(0,0,0);dummy.scale.set(w*scale,h,d*scale);dummy.updateMatrix();columns.setMatrixAt(columnData.length+i,dummy.matrix);});columns.instanceMatrix.needsUpdate=true;
  path.material.opacity=ramp(p,.245,.33)*.25;landings.material.opacity=.18*first;
  [[3,-14],[2.3,-23]].forEach(([x,z],i)=>{const widen=ramp(p,i?.575:.32,i?.64:.385);dummy.position.copy(point([x,.008,z]));dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.set(mix(1.8,3.5,widen)*scale,2.2*scale,1);dummy.updateMatrix();landings.setMatrixAt(i,dummy.matrix);});landings.instanceMatrix.needsUpdate=true;
  shadows.uniforms.uOpacity.value=(.075+second*.025)*first*(1-settle*.55);shadows.uniforms.uDefinition.value=second;frosted.material.opacity=second*.25*(1-settle*.8);
  fragments.forEach((m,i)=>{const show=ramp(p,i?.635:.39,i?.68:.435),leave=ramp(p,i?.79:.53,i?.855:.595);m.material.opacity=show*(1-leave)*.24;m.visible=m.material.opacity>.001;});
  years.material.opacity=first*.105*(1-settle);[[4.8,3.6,-38]].forEach(([x,y,z],i)=>{dummy.position.copy(point([x,y,z]));dummy.rotation.set(0,0,0);dummy.scale.set(6*scale,2*scale,1);dummy.updateMatrix();years.setMatrixAt(i,dummy.matrix);});years.instanceMatrix.needsUpdate=true;
  snapshot={careerArchitectureActive:true,careerGrowth:growth,careerColumns:columnData.length,careerBeams:beamData.length,careerShadowStrength:shadows.uniforms.uOpacity.value,careerPathVisible:path.material.opacity>0,careerYear:year,workMemoryActive:fragments.filter(m=>m.visible).map(m=>m.name)};
 },snapshot:()=>snapshot,dispose(){texture.dispose();}};
}
