import {Group,Mesh,PlaneGeometry,BoxGeometry,MeshStandardMaterial,MeshBasicMaterial,Vector3,Color} from 'three';
import {createContactTrajectory} from './ContactTrajectory';
import {range,smooth} from '../cinematic/config';
export function createContactWorld(mobile:boolean){
 const group=new Group();group.name='open-ending';group.visible=false;const trajectory=createContactTrajectory(mobile),origin=trajectory.origin;
 const floor=new Mesh(new PlaneGeometry(240,240),new MeshStandardMaterial({color:'#d7d6d0',roughness:1,transparent:true,opacity:0,depthWrite:false}));floor.rotation.x=-Math.PI/2;floor.position.copy(origin).add(new Vector3(0,-.005,-18));floor.renderOrder=-2;group.add(floor);
 const backdrop=new Mesh(new PlaneGeometry(400,300),new MeshBasicMaterial({color:'#e9e4da',transparent:true,opacity:0,depthWrite:false,fog:false,toneMapped:false}));backdrop.position.copy(origin).add(new Vector3(0,15,-60));backdrop.renderOrder=-8;group.add(backdrop);
 const path=new Mesh(new PlaneGeometry(mobile?1.05:1.8,mobile?5:8),new MeshBasicMaterial({color:'#c8c4b5',transparent:true,opacity:0,depthWrite:false}));path.rotation.x=-Math.PI/2;path.rotation.z=mobile?-.17:-.18;path.position.copy(origin).add(new Vector3(mobile?.35:.65,.008,mobile?-2:-3.5));group.add(path);
 const distant=new Mesh(new BoxGeometry(20,.12,2),new MeshStandardMaterial({color:'#e1dfd5',roughness:1,transparent:true,opacity:0}));distant.position.copy(origin).add(new Vector3(9,.02,-40));group.add(distant);
 let snapshot={};
 return {group,trajectory,update(p:number){
  group.visible=p>0;const open=smooth(range(p,.08,.58)),arrival=smooth(range(p,.38,.78));
  backdrop.material.opacity=open;backdrop.material.color.set('#e9e4da').lerp(new Color('#f0eee7'),arrival);
  floor.material.opacity=open;floor.material.color.set('#d7d6d0').lerp(new Color('#e0dfd8'),arrival);
  path.material.opacity=smooth(range(p,0,.1))*(1-smooth(range(p,.48,.78)))*.16;path.visible=path.material.opacity>.001;
  distant.material.opacity=arrival*.16;
  const pose=trajectory.sample(p);snapshot={contactProgress:p,contactSettled:p>=.78,contactPathVisible:path.visible,contactCamera:pose.camera.toArray(),contactTarget:pose.target.toArray(),contactAvatar:pose.position.toArray(),contactFinal:{avatar:trajectory.finalPose.position.toArray(),camera:trajectory.finalPose.camera.toArray(),target:trajectory.finalPose.target.toArray(),rotation:trajectory.finalPose.rotation,fov:38},contactSceneState:p>=.78?'STILL':'ARRIVING'};
  return pose;
 },snapshot:()=>snapshot,hide(){group.visible=false;}};
}
