import { Group, BoxGeometry, InstancedMesh, Object3D, MeshStandardMaterial, MeshBasicMaterial, BufferGeometry, Float32BufferAttribute, LineSegments, LineBasicMaterial, Mesh, TubeGeometry, Vector3 } from 'three';
import { range, smooth } from '../cinematic/config';
import { storyChapters } from './storyContent';
import { createStoryTrajectory } from './StoryTrajectory';

type Beam=[number,number,number,number,number,number];
export function createStoryWorld(mobile:boolean){
  const group=new Group();group.visible=false;
  const trajectory=createStoryTrajectory(mobile),box=new BoxGeometry(1,1,1),dummy=new Object3D();
  const segments=mobile?96:160;
  const pathMaterial=new MeshStandardMaterial({color:'#bcab8b',emissive:'#9f8962',emissiveIntensity:.18,roughness:.55,metalness:.25,transparent:true,opacity:.6});
  const path=new Mesh(new TubeGeometry(trajectory.curve,segments,.015,4,false),pathMaterial);
  path.position.y=.018;path.renderOrder=2;group.add(path);
  const chapters=storyChapters.map((chapter,index)=>{
    const chapterGroup=new Group();chapterGroup.position.copy(trajectory.at(chapter.route));group.add(chapterGroup);
    const palette=['#66695e','#80908b','#647f89','#8a9692','#a39b86'];
    const material=new MeshStandardMaterial({color:palette[index],roughness:[.9,.72,.5,.55,.38][index],metalness:.4,transparent:true,depthWrite:false});
    const lineMaterial=new LineBasicMaterial({color:index===2?'#9fbabc':'#c8b18a',transparent:true,depthWrite:false});
    const beams:Beam[]=[],lines:number[]=[];
    const beam=(...b:Beam)=>beams.push(b);
    const connect=(a:number[],b:number[])=>lines.push(...a,...b);
    const frame=(x:number,y:number,z:number,w:number,h:number)=>{
      beam(x-w/2,y+h/2,z,.09,h,.12);beam(x+w/2,y+h/2,z,.09,h,.12);beam(x,y+h,z,w,.09,.12);
    };
    if(index===0){
      beam(-1,.05,-1.4,5,.1,.12);beam(-3.4,.05,-2.8,.12,.1,2.8);
      beam(-2,1.1,-2.8,.16,2.2,.18);beam(1.2,.6,-3.3,.2,1.2,.2);
      connect([0,.025,0],[-2,.025,-1.4]);connect([-2,.025,-1.4],[-2,2.2,-2.8]);
    }else if(index===1){
      for(let i=0;i<(mobile?2:3);i++){
        const x=1.4+i*.85,y=.8+i*.65,z=-1.5-i*1.3;
        beam(x,y/2,z,.1,y,.16);beam(x+1.2,y,z,2.5,.09,.16);
        connect([0,.025,0],[x,.025,z]);connect([x,.025,z],[x,y,z]);connect([x,y,z],[x+2.4,y,z]);
      }
    }else if(index===2){
      for(let i=0;i<(mobile?2:3);i++){
        const x=-2+i*.75,y=.25+i*.7,z=-1.5-i*2;
        frame(x,y,z,3.2,1.4);beam(x,y,z,3.2,.08,.1);
        connect([x,y,z],[x+.75,y+.7,z-2]);connect([x+1.6,y+1.4,z],[x+2.35,y+2.1,z-2]);
      }
      connect([0,.025,0],[-2,.25,-1.5]);
    }else if(index===3){
      const count=mobile?7:13;
      for(let i=0;i<count;i++){
        const x=1.4+Math.sin(i*2.14)*2.2,y=.4+(i%4)*.65,z=-1.4-Math.floor(i/4)*1.45;
        beam(x,y,z,.06,.45+(i%3)*.18,.08);
        // Sparse sources converge into a common contextual relationship.
        if(i%3===0)connect([0,.05,0],[x,y,z]);
        connect([x,y,z],[1.2,1.5,-4.5]);
      }
      beam(1.2,1.5,-4.5,1.3,.035,.5);
    }else{
      frame(-1.8,.1,-2,4,2.7);frame(-.5,.1,-5,4,2.7);
      beam(-1.15,.12,-3.5,5.3,.12,.12);
      beam(-3.15,2.8,-3.5,.1,.1,3);beam(1.5,2.8,-3.5,.1,.1,3);
      connect([0,.03,0],[-1.8,.1,-2]);connect([-1.8,.1,-2],[-.5,2.8,-5]);connect([.2,2.8,-2],[1.5,2.8,-5]);
    }
    const mesh=new InstancedMesh(box,material,beams.length);
    beams.forEach(([x,y,z,w,h,d],i)=>{dummy.position.set(x,y,z);dummy.scale.set(w,h,d);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});
    const connections=new LineSegments(new BufferGeometry().setAttribute('position',new Float32BufferAttribute(lines,3)),lineMaterial);
    connections.renderOrder=2;chapterGroup.add(mesh,connections);
    return {chapter,group:chapterGroup,material,lineMaterial,connections,lineCount:lines.length/3,count:beams.length,state:'UNREVEALED'};
  });
  const signalMaterial=new MeshBasicMaterial({color:'#e2bd82',transparent:true,depthWrite:false});
  const signals=new InstancedMesh(box,signalMaterial,mobile?2:4);signals.renderOrder=3;chapters[3].group.add(signals);
  const source=new Vector3(),destination=new Vector3(1.2,1.5,-4.5);let signalProgress=0;
  const threshold=new Group();threshold.position.copy(trajectory.at(1));group.add(threshold);
  const horizonMaterial=new MeshStandardMaterial({color:'#37464a',roughness:.85,metalness:.2,transparent:true});
  const horizon=new InstancedMesh(box,horizonMaterial,mobile?2:4);
  const pieces:Beam[]=[[-9,.1,-12,19,.13,.4],[8,3,-18,.25,6,.5],[-12,2,-24,.3,4,.5],[4,4,-30,18,.1,.3]];
  pieces.slice(0,horizon.count).forEach(([x,y,z,w,h,d],i)=>{dummy.position.set(x,y,z);dummy.scale.set(w,h,d);dummy.updateMatrix();horizon.setMatrixAt(i,dummy.matrix);});threshold.add(horizon);
  let pathProgress=0;
  return {group,trajectory,update(p:number){
    group.visible=p>0;
    const pose=trajectory.sample(p);
    pathProgress=Math.min(1,Math.max(.085,pose.distance+.075))*smooth(range(p,.155,.235));
    path.visible=pathProgress>0;path.geometry.setDrawRange(0,Math.floor(pathProgress*segments)*4*6);
    for(const c of chapters){
      const reveal=smooth(range(p,c.chapter.start-.05,c.chapter.reveal));
      const past=smooth(range(p,c.chapter.end,c.chapter.end+.09));
      c.group.visible=reveal>0;c.group.scale.y=Math.max(.001,reveal);
      c.material.opacity=reveal*((c.chapter.id==='real-products'?.78:.67)-past*(c.chapter.id==='real-products'?.67:.56));
      c.lineMaterial.opacity=reveal*(.6-past*.49);
      c.connections.geometry.setDrawRange(0,Math.floor(reveal*c.lineCount/2)*2);
      if(c.chapter.id==='intelligence')c.lineMaterial.opacity*=.72+.28*smooth(range(p,.67,.71));
      c.state=reveal===0?'UNREVEALED':past>=1?'DORMANT':'ACTIVE';
    }
    signalProgress=range(p,.645,.77);signals.visible=p>.645&&p<.80;
    signalMaterial.opacity=smooth(range(p,.645,.665))*(1-smooth(range(p,.765,.80)));
    for(let i=0;i<signals.count;i++){
      const n=i*3;source.set(1.4+Math.sin(n*2.14)*2.2,.4+(n%4)*.65,-1.4-Math.floor(n/4)*1.45);
      dummy.position.copy(source).lerp(destination,range(signalProgress*1.5-i*.12,0,1));dummy.scale.setScalar(.07);dummy.updateMatrix();signals.setMatrixAt(i,dummy.matrix);
    }
    signals.instanceMatrix.needsUpdate=true;
    horizonMaterial.opacity=.3*smooth(range(p,.86,.97));threshold.visible=p>.86;
    return pose;
  },setWorkDormancy(p:number){
    const fade=1-smooth(range(p,.03,.22));
    chapters.forEach(c=>{c.material.opacity*=fade;c.lineMaterial.opacity*=fade;c.group.visible=fade>0;});horizonMaterial.opacity*=fade;threshold.visible=fade>0;
  },snapshot(){return {pathProgress,signalProgress,activeSignals:signals.visible?signals.count:0,pathState:pathProgress>=1?'COMPLETE':pathProgress>0?'DRAWING':'DORMANT',structures:chapters.map(c=>({id:c.chapter.id,state:c.state,count:c.count})),activeStructures:chapters.filter(c=>c.state==='ACTIVE').reduce((n,c)=>n+c.count,0)};}};
}
