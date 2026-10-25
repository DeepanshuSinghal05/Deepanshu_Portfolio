import {Group,Mesh,MeshBasicMaterial,MeshStandardMaterial,SphereGeometry,TorusGeometry,CylinderGeometry,BoxGeometry,PlaneGeometry,CanvasTexture,SRGBColorSpace,BufferGeometry,Float32BufferAttribute,LineSegments,LineBasicMaterial,Points,PointsMaterial,Color,Vector3,PointLight,DoubleSide,Box3,type PerspectiveCamera} from 'three';
import {createAssetSurface,type AssetCache} from './ProjectAssetSurface';
import {createHoloHand} from './HoloHand';
import {range,smooth,mix} from '../cinematic/config';
const ramp=(p:number,a:number,b:number)=>smooth(range(p,a,b));
const window=(p:number,a:number,b:number,c:number,d:number)=>ramp(p,a,b)*(1-ramp(p,c,d));
export const HOLO_ASSETS=['normal_mode','jarvis_golden_mode'].map(n=>'holo/'+n);
/** Scroll is the only input. Every pose, including lag and momentum, is an analytic function of progress. */
export function createHoloEnvironment(cache:AssetCache,origin:Vector3,mobile:boolean){
 const group=new Group();group.name='holo-spatial-world';group.position.copy(origin);group.scale.setScalar(mobile?.65:1);
 const stage=new Group();stage.position.set(0,6,-20);group.add(stage);
 const teal=new Color('#76c7b0'),gold=new Color('#d7ae65');
 const normal=createAssetSurface(cache,'holo/normal_mode',24,24/(1917/976));normal.group.position.set(0,6,-18);
 const jarvis=createAssetSurface(cache,'holo/jarvis_golden_mode',24,24/(1917/976));jarvis.group.position.copy(normal.group.position);jarvis.group.position.z+=.01;group.add(normal.group,jarvis.group);
 const sensorGeometry=new BufferGeometry().setAttribute('position',new Float32BufferAttribute([-7,0,-17,7,0,-17,7,0,-17,7,11,-17,7,11,-17,-7,11,-17,-7,11,-17,-7,0,-17,-7,5.5,-17,7,5.5,-17,0,0,-17,0,11,-17],3));
 const sensor=new LineSegments(sensorGeometry,new LineBasicMaterial({color:'#72bca9',transparent:true,opacity:0,depthWrite:false}));group.add(sensor);
 const starsGeometry=new BufferGeometry(),starPositions=[];for(let i=0;i<(mobile?28:64);i++)starPositions.push(Math.sin(i*13.71)*18,2+((i*7)%13),-15-((i*11)%32));
 starsGeometry.setAttribute('position',new Float32BufferAttribute(starPositions,3));const stars=new Points(starsGeometry,new PointsMaterial({size:.035,color:teal,transparent:true,opacity:.4,depthWrite:false}));group.add(stars);
 const hand=createHoloHand(),other=createHoloHand(-1);group.add(hand.group,other.group);
 const orbMaterial=new MeshStandardMaterial({color:'#173c35',emissive:teal,emissiveIntensity:.13,roughness:.48,metalness:.25,envMapIntensity:.25,transparent:true,opacity:1});
 const orb=new Mesh(new SphereGeometry(1.17,32,20),orbMaterial),orbRim=new Mesh(new TorusGeometry(1.22,.015,6,64),new MeshBasicMaterial({color:teal,transparent:true,depthWrite:false}));orb.add(orbRim);stage.add(orb);
 const satellites=Array.from({length:mobile?1:2},(_,i)=>{const m=new Mesh(new SphereGeometry(.58,16,12),orbMaterial.clone());m.position.set(i?7:-7,i?-1:2,-6-i*3);stage.add(m);return m;});
 // Apollo command-module inspired study. Deliberately light procedural geometry, not a claimed Smithsonian scan.
 const prop=new Group();stage.add(prop);
 const shellMaterial=new MeshStandardMaterial({color:'#839792',emissive:'#224d43',emissiveIntensity:.2,roughness:.48,metalness:.64,side:DoubleSide,transparent:true});
 const darkMaterial=new MeshStandardMaterial({color:'#263b38',emissive:'#28584d',emissiveIntensity:.22,roughness:.7,metalness:.38,transparent:true});
 const parts=Array.from({length:8},(_,i)=>{const angle=i*Math.PI/4;const m=new Mesh(new CylinderGeometry(.65,1.8,1.65,4,1,true,angle,Math.PI/4-.025),shellMaterial);prop.add(m);return {mesh:m,base:new Vector3(0,0,0),vector:new Vector3(Math.sin(angle+Math.PI/8),.15,Math.cos(angle+Math.PI/8))};});
 const base=new Mesh(new CylinderGeometry(1.8,1.6,.22,32),darkMaterial),cap=new Mesh(new CylinderGeometry(.66,.66,.18,24),darkMaterial);base.position.y=-.94;cap.position.y=.9;prop.add(base,cap);
 const core=new Mesh(new CylinderGeometry(.4,.6,1.2,16),new MeshStandardMaterial({color:'#adbfb5',metalness:.72,roughness:.28,emissive:'#34574e',emissiveIntensity:.25,transparent:true}));prop.add(core);
 const note=new Group();stage.add(note);
 const noteMaterial=new MeshBasicMaterial({color:'#102c28',transparent:true,opacity:1}),inkMaterial=new MeshBasicMaterial({color:'#9acaba',transparent:true,opacity:1});
 const paper=new Mesh(new BoxGeometry(3.6,2.3,.06),noteMaterial);note.add(paper);
 const noteLines=Array.from({length:7},(_,i)=>{const m=new Mesh(new BoxGeometry(i===0?1.5:i===6?1.5:2.8,.045,.025),inkMaterial);m.position.set(i===0?-.62:i===6?-.65:0,.83-i*.26,.05);note.add(m);return m;});
 const waveform=new Group();note.add(waveform);for(let i=0;i<9;i++){const m=new Mesh(new BoxGeometry(.06,.12+Math.sin(i*1.7)**2*.45,.035),inkMaterial);m.position.set((i-4)*.15,-.7,.1);waveform.add(m);}
 const light=new PointLight('#bde9db',48,42,1.7);light.position.set(2,11,-9);group.add(light);
 const key=new PointLight('#c8d5cf',32,28,1.4);key.position.set(-6,9,-18);group.add(key);
 const labelCanvas=document.createElement('canvas');labelCanvas.width=768;labelCanvas.height=168;const ctx=labelCanvas.getContext('2d')!;ctx.font='22px monospace';ctx.fillStyle='#d7c499';ctx.fillText('CAMERA → MEDIAPIPE',4,30);ctx.fillStyle='#a8baaf';ctx.fillText('21 LANDMARKS → GESTURE',4,80);ctx.fillText('OBJECT RESPONSE',4,130);
 const labelTexture=new CanvasTexture(labelCanvas);labelTexture.colorSpace=SRGBColorSpace;
 const technical=new Mesh(new PlaneGeometry(mobile?7:8,mobile?1.53:1.75),new MeshBasicMaterial({map:labelTexture,transparent:true,depthWrite:false,toneMapped:false}));technical.position.set(mobile?-1:-3,9.5,-18);group.add(technical);
 let debug={};
 return {group,surfaces:[normal,jarvis],framing(camera:PerspectiveCamera){
  const bounds:Record<string,{left:number;right:number;top:number;bottom:number}>={};if(!group.visible)return bounds;
  for(const [name,object] of [['hand',hand.group],['secondHand',other.group],['orb',orb],['prop',prop],['note',note]] as const){if(!object.visible)continue;const box=new Box3().setFromObject(object),pts=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])pts.push(new Vector3(x,y,z).project(camera));bounds[name]={left:Math.min(...pts.map(v=>v.x)),right:Math.max(...pts.map(v=>v.x)),top:Math.max(...pts.map(v=>v.y)),bottom:Math.min(...pts.map(v=>v.y))};}return bounds;
 },dispose(){labelTexture.dispose();},clear(){normal.clear();jarvis.clear();},active(){return group.visible?[normal,jarvis].filter(s=>s.group.visible).map(s=>s.key):[];},update(p:number,seed=0){
  const entry=ramp(p,0,.035),dormant=ramp(p,.956,1),fade=1-dormant,mode=ramp(p,.812,.845),color=teal.clone().lerp(gold,mode);
  group.visible=seed>0||p>0;const sensorAlpha=Math.max(seed*.32,window(p,0,.035,.10,.135)*.5);
  sensor.material.opacity=sensorAlpha;sensor.visible=sensorAlpha>.001;
  stars.material.opacity=entry*(1-dormant*.92)*.35;stars.material.color.copy(color);
  technical.material.opacity=window(p,.89,.903,.922,.935);technical.visible=technical.material.opacity>.001;
  normal.show(window(p,.10,.13,.185,.235));jarvis.show(window(p,.827,.845,.88,.905));
  normal.group.rotation.y=mix(.08,0,ramp(p,.10,.135));jarvis.group.rotation.y=0;
  const detach=ramp(p,.185,.23),pinch=window(p,.235,.262,.331,.347),drag=ramp(p,.273,.321),flick=ramp(p,.321,.337),throwTime=range(p,.337,.385),momentum=(1-Math.exp(-throwTime*4))/(1-Math.exp(-4));
  // The source NOTES orb is centered at (1344,180) in the supplied 1917 x 976 UI.
  const orbStart=new Vector3(4.83,3.86,2.15),held=new Vector3(-3+7*drag+1.6*flick,.25+.45*drag,-.2-1.5*drag);
  const orbPosition=orbStart.clone().lerp(new Vector3(-3,.25,4),detach);
  if(p>=.262)orbPosition.lerp(held.clone().add(new Vector3(-.38*Math.sin(drag*Math.PI),-.1*Math.sin(drag*Math.PI),.15*Math.sin(drag*Math.PI))),ramp(p,.262,.28));
  if(p>=.337)orbPosition.set(5.6+4.5*momentum,.7+.8*Math.sin(throwTime*Math.PI)*Math.exp(-throwTime),-1.7-4*momentum);
  const rest=ramp(p,.385,.416);orbPosition.lerp(new Vector3(7,2,-6),rest);
  const reset=ramp(p,.785,.815);orbPosition.lerp(new Vector3(-5,1,0),reset);
  orb.position.copy(orbPosition);orb.scale.setScalar(mix(1,.72,ramp(p,.385,.42))*(1-dormant*.25));
  orb.visible=p>.185;orbMaterial.opacity=ramp(p,.185,.205)*(1-dormant*.85);orbMaterial.color.set('#173c35').lerp(new Color('#493c22'),mode);orbMaterial.emissive.copy(color);orbMaterial.emissiveIntensity=.16+pinch*.14;orbRim.material.color.copy(color);orbRim.material.opacity=orbMaterial.opacity*.65;
  satellites.forEach((m,i)=>{m.visible=p>.22;m.material.color.copy(orbMaterial.color);m.material.emissive.copy(color);m.material.opacity=entry*(1-dormant*.88)*.55;m.position.set(i?7:-7,i?-1:2,-6-i*3);});
  const stretch=ramp(p,.423,.465)*(1-ramp(p,.53,.565)),separation=ramp(p,.455,.485)*(1-ramp(p,.53,.565));
  prop.visible=p>.39;prop.position.set(0,0,-1);prop.position.lerp(new Vector3(3,-.2,-2),ramp(p,.565,.593));prop.scale.setScalar(mix(.95,1.52,stretch));prop.rotation.set(.13,mix(-.25,.32,ramp(p,.455,.525)),.04);
  parts.forEach(({mesh,base,vector})=>mesh.position.copy(base).addScaledVector(vector,separation*1.55));base.position.y=-.94-separation*.9;cap.position.y=.9+separation*1.3;
  const propAlpha=ramp(p,.39,.413)*(1-dormant*.88);shellMaterial.opacity=darkMaterial.opacity=core.material.opacity=propAlpha;shellMaterial.emissive.copy(color).multiplyScalar(.28);
  const noteGrab=window(p,.58,.595,.615,.625),noteTravel=ramp(p,.595,.622),reader=ramp(p,.637,.665),crush=ramp(p,.686,.713),noteReset=ramp(p,.785,.815);
  note.visible=p>.575;note.position.set(mix(-4,0,noteTravel),mix(-.7,.3,noteTravel),2);note.position.lerp(new Vector3(-.5,-.25,0),noteReset);
  note.scale.set(mix(1,1.65,reader)*(1-crush*.7),mix(1,1.8,reader)*(1-crush*.74),1);note.scale.lerp(new Vector3(1,1,1),noteReset);note.rotation.set(0,-.08*(1-reader),-.025*(1-reader));
  noteMaterial.opacity=ramp(p,.575,.591)*(1-dormant*.88);noteMaterial.color.set('#102c28').lerp(new Color('#302719'),mode);inkMaterial.color.copy(color);inkMaterial.opacity=noteMaterial.opacity*.9;
  noteLines.forEach((m,i)=>{m.visible=i<3||crush<.65||noteReset>.5;});waveform.visible=crush>.6&&noteReset<.5;
  // Register the transformed spatial layout to the real JARVIS screenshot, then return to depth.
  const registration=window(p,.815,.843,.88,.907);orb.position.lerp(new Vector3(4.83,3.86,1.9),registration);orb.scale.lerp(new Vector3(1,1,1),registration);
  prop.position.lerp(new Vector3(7.8,-3.5,1.7),registration);prop.scale.lerp(new Vector3(.8,.8,.8),registration);noteMaterial.opacity*=1-registration;inkMaterial.opacity*=1-registration;
  satellites.forEach((m,i)=>{m.position.lerp(new Vector3(i?0:-4.8,i?1.1:2.43,1.9),registration);m.scale.setScalar(1+registration);});
  const sceneControl=window(p,.738,.765,.785,.815);stage.rotation.set(0,sceneControl*.16,sceneControl*-.09);stage.scale.setScalar((1+sceneControl*.13)*(1-dormant*.65));stage.position.z=-20-dormant*30;
  let handAlpha=entry*(1-ramp(p,.092,.12));let handPos=new Vector3(-2,7,-15),otherPos=new Vector3(3,6,-18),grip=0,secondAlpha=0;
  if(p>=.19&&p<.39){handAlpha=window(p,.205,.235,.365,.395);handPos.copy(held).add(new Vector3(0,6,-20));if(p<.262)handPos.set(-3,6.25,-16);else handPos.z=mix(-16,held.z-20,ramp(p,.262,.28));grip=pinch;}
  if(p>=.39&&p<.575){handAlpha=window(p,.39,.41,.565,.58);secondAlpha=handAlpha;const span=2.1+stretch*3.3;handPos.set(-span,6,-20);otherPos.set(span,6,-20);grip=ramp(p,.407,.423);}
  if(p>=.575&&p<.73){handAlpha=window(p,.575,.592,.718,.737);secondAlpha=window(p,.628,.642,.718,.737);const span=mix(1.65,3,reader)*(1-crush*.73);handPos.copy(note.position).add(new Vector3(-span,6,-20));otherPos.copy(note.position).add(new Vector3(span,6,-20));grip=Math.max(noteGrab,window(p,.632,.644,.716,.73));}
  if(p>=.73&&p<.817){handAlpha=window(p,.73,.748,.805,.825);secondAlpha=handAlpha*(1-ramp(p,.777,.79));handPos.set(-5-sceneControl,7,-17);otherPos.set(5+sceneControl,7+sceneControl,-17);grip=1-ramp(p,.775,.787);}
  if(p>=.89){handAlpha=window(p,.89,.907,.945,.969);handPos.set(-5,6,-18);grip=.7;}
  if(p>=.19&&p<.39)handPos.add(new Vector3(.92,0,1.04));
  if(p>=.39&&p<.73){handPos.z+=.65;otherPos.z+=.65;}
  hand.group.position.copy(handPos);other.group.position.copy(otherPos);hand.group.scale.setScalar(.72);other.group.scale.setScalar(.72);if(p>=.39&&p<.73){hand.group.scale.x=-.72;other.group.scale.x=-.72;}hand.group.rotation.set(0,.08,0);other.group.rotation.set(0,-.08,0);
  hand.update(grip,ramp(p,.777,.789)*(1-ramp(p,.81,.825)),ramp(p,.025,.075),mode,handAlpha*fade);other.update(grip,0,1,mode,secondAlpha*fade);
  light.color.set('#bde9db').lerp(new Color('#edce91'),mode);light.intensity=48*entry*(1-dormant*.85);key.intensity=32*entry*(1-dormant*.85);
  debug={holoProgress:p,holoSeed:seed,holoMode:mode,holoDormant:dormant,holoHand:hand.snapshot(),holoSecondHand:other.snapshot(),holoOrbId:orb.id,holoOrbPosition:orb.position.toArray(),holoOrbVisible:orb.visible,holoPinch:grip,holoThrow:momentum,holoSeparation:separation,holoPropParts:parts.map(v=>v.mesh.position.toArray()),holoPropScale:prop.scale.x,holoNotePosition:note.position.toArray(),holoNoteScale:note.scale.toArray(),holoReader:reader,holoSummary:crush,holoReset:reset,holoSceneControl:sceneControl,holoStars:mobile?28:64,holoTracking:'AUTHORED_LOCAL_TRACKING_REPRESENTATION'};
  return debug;
 }};
}
