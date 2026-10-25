import {Group,Mesh,MeshBasicMaterial,MeshStandardMaterial,BoxGeometry,InstancedMesh,Object3D,Color,PointLight,Vector3} from 'three';
import {createAssetSurface,type AssetCache,type AssetSurface} from './ProjectAssetSurface';
import type {Point} from './ProjectEnvironment';
import {range,smooth,mix} from '../cinematic/config';
const ramp=(p:number,a:number,b:number)=>smooth(range(p,a,b));
export const DOJ_ASSETS=['homepage','chat_interface','response'].map(n=>'doj/'+n);
/** A question signature enters a bounded document field. Three persistent chunks become context. */
export function createDOJEnvironment(cache:AssetCache,point:Point,mobile:boolean){
 const group=new Group();group.name='doj-knowledge-world';const surfaces:AssetSurface[]=[];
 const surface=(name:string,pos:number[],width:number,aspect:number)=>{const s=createAssetSurface(cache,'doj/'+name,width,width/aspect);s.group.position.copy(point(pos));group.add(s.group);surfaces.push(s);return s;};
 const homepage=surface('homepage',[0,5,-22],mobile?11.5:24,1917/981);
 const chat=surface('chat_interface',[8,mobile?4:6,-34],mobile?7.5:20,mobile?1149/978:1917/978);
 const response=surface('response',[8,mobile?4:7,-34],mobile?7.5:24,mobile?1051/896:1756/896);
 const architecture=new Group();group.add(architecture);
 // Broad, quiet planes supply scale; no browser/device enclosure.
 const floor=new Mesh(new BoxGeometry(mobile?24:52,.08,mobile?53:82),new MeshStandardMaterial({color:'#1c2e3d',roughness:.9,metalness:.08,transparent:true,opacity:0}));floor.position.copy(point([0,-.3,-47]));architecture.add(floor);
 const question=new Group();question.name='doj-question-signature';group.add(question);
 const signature=Array.from({length:5},(_,i)=>{const m=new Mesh(new BoxGeometry(1.9-i*.23,.045,.045),new MeshBasicMaterial({color:'#d5e7ed',transparent:true,opacity:0}));m.position.y=(i-2)*.18;question.add(m);return m;});
 const documentCount=mobile?6:9,chunkCount=documentCount*3;
 const chunks=new InstancedMesh(new BoxGeometry(mobile?2.4:5.8,1.55,.085),new MeshStandardMaterial({color:'#ffffff',roughness:.83,metalness:.04,emissive:'#7196b1',emissiveIntensity:.075,transparent:true}),chunkCount);chunks.instanceMatrix.setUsage(35048);architecture.add(chunks);
 const ink=new InstancedMesh(new BoxGeometry(1,.025,.015),new MeshBasicMaterial({color:'#263e4e',transparent:true,opacity:.7}),chunkCount*3);architecture.add(ink);const inkDummy=new Object3D();
 const selectedIds=mobile?[1,7,13]:[4,13,22],dummy=new Object3D(),selectedPositions:number[][]=[];
 const selected=new Set(selectedIds),quietColor=new Color('#536975'),matchColor=new Color('#d5e3e8'),dimmer=new Color('#253845');
 const scan=new Mesh(new BoxGeometry(mobile?14:26,.016,.22),new MeshBasicMaterial({color:'#adcbd9',transparent:true,opacity:0,depthWrite:false}));architecture.add(scan);
 const model=new Group();model.position.copy(point([0,2.8,-75]));group.add(model);
 const modelMaterial=new MeshStandardMaterial({color:'#40596a',emissive:'#8aa9bc',emissiveIntensity:.15,roughness:.85,metalness:.12,transparent:true});
 const shelves=[-1,0,1].map(i=>{const m=new Mesh(new BoxGeometry(mobile?4.2:8,.055,mobile?3:5),modelMaterial);m.position.y=i*1.35;model.add(m);return m;});
 const answer=new Group();answer.name='doj-response-structure';group.add(answer);
 const answerLines=Array.from({length:4},(_,i)=>{const m=new Mesh(new BoxGeometry(i===0?3:2.25-i*.22,.10,.055),new MeshBasicMaterial({color:i===0?'#e5e9df':'#b3cedd',transparent:true,opacity:0}));m.position.set(i===0?0:-.4,.6-i*.4,0);answer.add(m);return m;});
 const illumination=new PointLight('#c6deed',0,34,1.5);group.add(illumination);
 const queryKeys=[{p:.27,pos:[mobile?8:12,mobile?.7:1.3,-33.6]},{p:.305,pos:[mobile?15:17.8,1.7,-33.4]},{p:.35,pos:[mobile?15:18.5,3,-39]},{p:.40,pos:[4,3,-46]},{p:.49,pos:[0,7,-49]},{p:.565,pos:[0,7,-49]},{p:.665,pos:[0,3.5,-72]},{p:.74,pos:[0,3.5,-74]}];
 let questionPosition=new Vector3(),selectedCount=0;
 return {group,surfaces,clear(){surfaces.forEach(s=>s.clear());},active(){return surfaces.filter(s=>s.group.visible&&group.visible).map(s=>s.key);},update(p:number){
  const entrance=ramp(p,0,.09),exit=1-ramp(p,.975,1),homeHold=ramp(p,.075,.125)*(1-ramp(p,.20,.28));group.visible=p>0&&p<1;
  homepage.show(homeHold);homepage.group.rotation.y=mix(.12,0,ramp(p,.08,.135));
  const chatReveal=ramp(p,.205,.25)*(1-ramp(p,.305,.365));chat.show(chatReveal);
  chat.group.rotation.y=mix(-.12,0,ramp(p,.205,.25));
  response.show(ramp(p,.823,.85)*exit);response.group.rotation.y=.025;
  floor.material.opacity=entrance*exit*.8;
  let a=queryKeys[0],b=queryKeys[1];for(let i=1;i<queryKeys.length;i++){a=queryKeys[i-1];b=queryKeys[i];if(p<=b.p)break;}
  questionPosition=point(a.pos).lerp(point(b.pos),ramp(p,a.p,b.p));question.position.copy(questionPosition);question.visible=p>=.25&&p<.75;
  signature.forEach((m,i)=>{const embed=ramp(p,.33,.40);m.position.x=Math.sin(i*1.7)*.15*embed;m.scale.x=mix(1,.4+(i%3)*.21,embed);m.material.color.set('#355672').lerp(new Color('#d5e7ed'),ramp(p,.29,.34));m.material.opacity=ramp(p,.25,.27)*(1-ramp(p,.71,.75));});
  const field=ramp(p,.34,.43),split=ramp(p,.41,.47),retrieval=ramp(p,.485,.56),context=ramp(p,.575,.655),generation=ramp(p,.68,.745),returning=ramp(p,.755,.84);
  chunks.visible=field>0&&exit>0;selectedCount=0;selectedPositions.length=0;
  for(let i=0;i<chunkCount;i++){
   const doc=Math.floor(i/3),row=i%3,col=doc%3,depth=Math.floor(doc/3);
   const home=point([(col-1)*(mobile?4:8),3+(row-1)*(1.60+split*.42),-50-depth*7]);
   const slot=selectedIds.indexOf(i),isSelected=selected.has(i),respond=ramp(p,.493+Math.max(slot,0)*.012,.525+Math.max(slot,0)*.012);
   if(isSelected){const gather=point([(slot-1)*3.0,4.8-slot*.55,-68+slot*1.15]);home.lerp(gather,context);home.lerp(point([(slot-1)*.6,3.5,-75]),generation);selectedPositions.push(home.toArray());if(respond>.5)selectedCount++;}
   dummy.position.copy(home);dummy.rotation.set(0,(col-1)*-.08*(1-context),0);dummy.scale.setScalar(field*(isSelected?mix(1,.52,context)*(1-generation*.84):1-context*.28));dummy.updateMatrix();chunks.setMatrixAt(i,dummy.matrix);
   for(let line=0;line<3;line++){
    const scale=dummy.scale.x;inkDummy.position.copy(home).add(new Vector3(-.18*scale,(line-1)*.30*scale,.058*scale).applyQuaternion(dummy.quaternion));inkDummy.rotation.copy(dummy.rotation);inkDummy.scale.set((mobile?1.6:4.3)*(line===2?.6:1)*scale,scale,scale);inkDummy.updateMatrix();ink.setMatrixAt(i*3+line,inkDummy.matrix);
   }
   const color=quietColor.clone().lerp(isSelected?matchColor:dimmer,isSelected?respond:retrieval*.85).multiplyScalar(isSelected?1:1-context*.38);chunks.setColorAt(i,color);
  }
  ink.visible=chunks.visible;ink.instanceMatrix.needsUpdate=true;ink.computeBoundingSphere();ink.material.opacity=field*exit*(1-returning*.8)*.72;
  chunks.instanceMatrix.needsUpdate=true;if(chunks.instanceColor)chunks.instanceColor.needsUpdate=true;chunks.computeBoundingSphere();chunks.material.opacity=exit*(1-returning*.78);
  scan.visible=p>.47&&p<.565;scan.position.copy(point([0,3,mix(-45,-67,range(p,.47,.565))]));scan.material.opacity=Math.sin(range(p,.47,.565)*Math.PI)*.35;
  model.visible=p>.61&&p<1;modelMaterial.opacity=ramp(p,.61,.675)*exit*(1-returning*.6);modelMaterial.emissiveIntensity=.15+.25*Math.sin(generation*Math.PI);shelves.forEach((m,i)=>{m.position.x=(i-1)*.13*generation;});
  answer.position.copy(point([0,3.5,-75])).lerp(point([8,mobile?4:7,-33.7]),returning);answer.visible=p>.715&&p<.877;answer.rotation.y=mix(.12,0,returning);answerLines.forEach(m=>{m.material.opacity=ramp(p,.715,.75)*(1-ramp(p,.854,.877));});
  illumination.position.copy(p<.74?questionPosition:answer.position).add(new Vector3(0,4,4));illumination.intensity=entrance*exit*22;illumination.color.set('#c6deed').lerp(new Color('#e3e8e1'),ramp(p,.69,.84));
  return {dojProgress:p,dojStage:p<.09?'ENTRY':p<.205?'PRODUCT':p<.31?'QUESTION':p<.41?'EMBEDDING':p<.485?'DOCUMENTS':p<.575?'RETRIEVAL':p<.665?'CONTEXT':p<.755?'LOCAL_MODEL':p<.84?'RESPONSE_RETURN':p<.92?'RESPONSE':p<.975?'RESOLUTION':'HANDOFF',questionId:question.id,questionVisible:question.visible,questionPosition:questionPosition.toArray(),documentCount,chunkCount,selectedChunkIds:selectedIds,selectedCount,selectedChunkPositions:[...selectedPositions],retrievalProgress:retrieval,contextProgress:context,generationProgress:generation,responsePosition:answer.position.toArray(),responseVisible:answer.visible,dojLighting:{intensity:illumination.intensity,color:illumination.color.getHexString()},dojArchitecture:'DOCUMENTED_INTENDED_LOCAL_PIPELINE'};
 }};
}
