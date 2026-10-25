import { Group, Mesh, PlaneGeometry, MeshStandardMaterial, CanvasTexture, MeshBasicMaterial, RingGeometry, InstancedMesh, BoxGeometry, Object3D, Color, BufferGeometry, Float32BufferAttribute, LineSegments, LineBasicMaterial, Points, PointsMaterial } from 'three';
import { cinematicConfig as C, progressAt, smooth, range } from './config';

/** A continuous ground with a sparse threshold, all anchored to the landing origin. */
export function createLandingEnvironment(mobile: boolean) {
  const group=new Group(), floorY=C.landingPoint[1];
  const ground=new Mesh(new PlaneGeometry(180,180),new MeshStandardMaterial({color:'#080d11',roughness:.78,metalness:.14,envMapIntensity:.15,transparent:true}));
  ground.rotation.x=-Math.PI/2;ground.position.y=floorY-.002;group.add(ground);
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
  const ctx=canvas.getContext('2d')!, gradient=ctx.createRadialGradient(64,64,4,64,64,64);
  gradient.addColorStop(0,'rgba(0,0,0,.7)');gradient.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  const texture=new CanvasTexture(canvas),shadowMaterial=new MeshBasicMaterial({map:texture,transparent:true,depthWrite:false});
  const shadow=new Mesh(new PlaneGeometry(2.2,1.4),shadowMaterial);shadow.rotation.x=-Math.PI/2;shadow.position.y=floorY-.001;group.add(shadow);

  // A brief contact response, never a persistent circular platform edge.
  const ringMaterial=new MeshBasicMaterial({color:'#9b8970',transparent:true,opacity:0,depthWrite:false});
  const ring=new Mesh(new RingGeometry(.38,.387,48),ringMaterial);ring.rotation.x=-Math.PI/2;ring.position.y=floorY+.003;group.add(ring);
  const seamMaterial=new LineBasicMaterial({color:'#66716f',transparent:true,opacity:0,depthWrite:false});
  const seams=new LineSegments(new BufferGeometry().setAttribute('position',new Float32BufferAttribute([
    // A short groove continues from the story origin toward -Z.
    0,floorY+.002,-.35, 0,floorY+.002,-9,
    -8,floorY+.002,-9, 13,floorY+.002,-9,
    5.5,floorY+.002,5, 5.5,floorY+.002,-25,
    -18,floorY+.002,-25, 24,floorY+.002,-25,
  ],3)),seamMaterial);seams.renderOrder=2;group.add(seams);

  const structuralMaterial=new MeshStandardMaterial({color:'#ffffff',roughness:.9,metalness:.15,transparent:true});
  // Rear shaft supports continue into sparse horizon fragments.
  const forms=[
    [mobile?1.4:4.4,floorY+4,-12,.22,8,.32],
    [mobile?2.8:7.6,floorY+4,-13,.16,8,.24],
    [mobile?2.1:6,floorY+7.8,-12.5,mobile?1.4:3.2,.11,.2],
    [3,floorY+.18,-18,30,.22,1.2],
    [8,floorY+5,-24,1.2,10,2],
    [-20,floorY+3.5,-29,.7,7,1.4],
    [16,floorY+2,-34,12,.3,2],
  ];
  const count=mobile?4:forms.length;
  const structures=new InstancedMesh(new BoxGeometry(1,1,1),structuralMaterial,count),dummy=new Object3D();
  forms.slice(0,count).forEach(([x,y,z,w,h,d],i)=>{
    dummy.position.set(x,y,z);dummy.scale.set(w,h,d);dummy.updateMatrix();structures.setMatrixAt(i,dummy.matrix);
    structures.setColorAt(i,new Color(i<3?'#384449':'#26323a'));
  });group.add(structures);

  const particleCount=mobile?5:12,positions=new Float32Array(particleCount*3);
  for(let i=0;i<particleCount;i++){positions[i*3]=Math.sin(i*6.17)*8;positions[i*3+1]=floorY+.5+(i*1.43)%5;positions[i*3+2]=-2-(i*3.17)%15;}
  const dustMaterial=new PointsMaterial({color:'#c3b49d',size:.024,transparent:true,opacity:0,depthWrite:false});
  const dust=new Points(new BufferGeometry().setAttribute('position',new Float32BufferAttribute(positions,3)),dustMaterial);group.add(dust);
  function animate(time:number){dust.position.set(Math.sin(time*.11)*.12,Math.sin(time*.17)*.065,0);}
  return {group,particleCount,animate,spatialMood(amount:number){ground.material.opacity*=1-amount*.9;},projectGround(z:number){ground.position.z=z;},update(p:number,x:number,z=0,storyProgress=0){
    const t=progressAt(p),arrival=smooth(range(p,.73,.91));group.visible=p>.69;
    if(!group.visible)return;
    ground.material.opacity=smooth(range(p,.69,.81));shadow.position.set(x,floorY-.001,z);shadowMaterial.opacity=smooth(t.landing);
    // During travel the broad ground center can lie behind the camera. Draw it
    // before transparent world structures so distance sorting cannot erase them.
    ground.renderOrder=storyProgress>0?-1:0;
    shadow.scale.setScalar(1+.1*Math.sin(Math.PI*range(p,.87,.92)));
    ring.position.x=x;ring.scale.setScalar(1+2*range(p,.87,.925));ringMaterial.opacity=.13*Math.sin(Math.PI*range(p,.87,.925));ring.visible=p>.87&&p<.925;
    seamMaterial.opacity=arrival*.14*(1-smooth(range(storyProgress,.15,.3)));
    structures.visible=storyProgress<.35;structuralMaterial.opacity=arrival*.24*(1-smooth(range(storyProgress,.2,.35)));
    structuralMaterial.depthWrite=storyProgress===0;
    dustMaterial.opacity=smooth(range(p,.83,.96))*.13;
  },dispose(){texture.dispose();}};
}
