import {Group,Mesh,BoxGeometry,PlaneGeometry,MeshStandardMaterial,MeshBasicMaterial,BufferGeometry,Float32BufferAttribute,LineSegments,LineBasicMaterial,Color,Vector3} from 'three';
import {createExperienceTrajectory} from './ExperienceTrajectory';
import {createExperienceArchitecture} from './ExperienceArchitecture';
import {range,smooth,mix} from '../cinematic/config';
const ramp=(p:number,a:number,b:number)=>smooth(range(p,a,b));
export function createExperienceWorld(mobile:boolean){
 const trajectory=createExperienceTrajectory(mobile),group=new Group();group.visible=false;group.name='professional-editorial-space';
 const career=createExperienceArchitecture(mobile,trajectory.point);group.add(career.group);
 const floor=new Mesh(new PlaneGeometry(240,240),new MeshStandardMaterial({color:'#d7d6d0',roughness:1,metalness:0,transparent:true,opacity:0,depthWrite:false}));floor.rotation.x=-Math.PI/2;floor.position.copy(trajectory.origin).add(new Vector3(0,-.006,-20));floor.renderOrder=-2;group.add(floor);
 const backdrop=new Mesh(new PlaneGeometry(400,300),new MeshBasicMaterial({color:'#080e10',transparent:true,opacity:0,depthWrite:false,fog:false,toneMapped:false}));backdrop.position.copy(trajectory.point([0,15,-75]));backdrop.renderOrder=-9;group.add(backdrop);
 const planes=new Group();group.add(planes);
 const slabs=[[-9,3.5,-22,.18,7,30],[8,2.2,-24,.22,4.4,26],[-1,5,-48,24,10,.16],[5,1.05,-38,9,.14,11],[-4,.12,-32,1,.24,18]];
 const architecture=slabs.slice(0,mobile?3:5).map(([x,y,z,w,h,d],i)=>{const m=new Mesh(new BoxGeometry(w*(mobile?.6:1),h,d*(mobile?.6:1)),new MeshStandardMaterial({color:i===1?'#c5c4ba':i===2?'#e5e2d9':'#d7d4ca',roughness:.94,metalness:.025,transparent:true,opacity:0}));m.position.copy(trajectory.point([x,y,z]));planes.add(m);return m;});
 const seams=new LineSegments(new BufferGeometry().setAttribute('position',new Float32BufferAttribute([-5,.004,-9,-5,.004,-44,5,.004,-14,5,.004,-42,-5,.004,-16,5,.004,-16,-5,.004,-28,5,.004,-28],3)),new LineBasicMaterial({color:'#847762',transparent:true,opacity:0,depthWrite:false}));seams.position.copy(trajectory.origin);seams.scale.set(mobile?.6:1,1,mobile?.6:1);group.add(seams);
 const fragments=[[-.8,0,0,0,.04,-.45,0,.04,-.45,.55,.04,-.6],[-.65,0,0,.1,0,0,.1,0,0,.1,0,-.5,.1,0,-.5,.6,0,-.5],[-.4,0,0,.1,.12,-.2,.1,.12,-.2,.5,0,-.1],[-.12,0,0,.12,0,0,0,-.12,0,0,.12,0]];
 const memories=['#b97870','#8baab9','#cbd5d4','#bca473'].map((color,i)=>{const m=new LineSegments(new BufferGeometry().setAttribute('position',new Float32BufferAttribute(fragments[i],3)),new LineBasicMaterial({color,transparent:true,opacity:0,depthWrite:false}));group.add(m);return m;});
 let debug={};
 return {group,trajectory,update(p:number){
  group.visible=p>0;const warm=ramp(p,.15,.29),settle=ramp(p,.86,.98);backdrop.material.color.set('#080e10').lerp(new Color('#e9e4da'),warm);backdrop.material.opacity=ramp(p,0,.06);
  career.update(p);
  floor.material.opacity=warm;floor.material.color.set('#9f9e94').lerp(new Color('#d7d6d0'),warm);
  architecture.forEach((m,i)=>{m.material.opacity=ramp(p,.13+i*.017,.30+i*.02)*(1-settle*.75);m.position.y=trajectory.origin.y+slabs[i][1]-mix(.4,0,warm);});
  seams.material.opacity=warm*.16*(1-settle*.7);
  memories.forEach((m,i)=>{const convergence=ramp(p,.075,.20),from=trajectory.point([-4.5+i*3,1.8+i%2*.55,2-i*2]),to=trajectory.point([-.6+i*.38,.035,-11-i*.6]);m.position.copy(from).lerp(to,convergence);m.scale.setScalar(mix(1,.14,convergence));m.material.opacity=ramp(p,.02,.07)*(1-ramp(p,.16,.235))*.28;m.visible=m.material.opacity>.001;});
  debug={experienceProgress:p,experienceWarmth:warm,experienceArchitectureCount:architecture.length,experienceArchitectureState:p>=.98?'DORMANT':'ACTIVE',memoryTraceCount:memories.filter(m=>m.visible).length,memoryTracePositions:memories.map(m=>m.position.toArray()),memoryTraceOpacity:memories.map(m=>m.material.opacity),contactOrigin:trajectory.contactOrigin,contactDirection:trajectory.contactDirection,contactCameraStart:trajectory.contactCameraStart,contactAvatarStart:trajectory.contactAvatarStart};
  return trajectory.sample(p);
 },snapshot(){return {...debug,...career.snapshot(),careerArchitectureActive:career.group.visible};},hide(){group.visible=false;},dispose:career.dispose};
}
