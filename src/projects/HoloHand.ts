import {Group,InstancedMesh,SphereGeometry,MeshBasicMaterial,BufferGeometry,Float32BufferAttribute,LineSegments,LineBasicMaterial,Object3D,Vector3,Color} from 'three';
import {mix} from '../cinematic/config';
// MediaPipe's 21-index topology. This is authored tracking data, never a camera feed.
export const HAND_LINKS=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];
const OPEN=[[0,-2,0],[-.5,-1.6,.05],[-1,-1.05,.12],[-1.35,-.4,.16],[-1.55,.25,.2],[-.65,-.45,0],[-.8,.55,0],[-.85,1.25,.03],[-.85,1.95,.06],[0,-.25,-.06],[0,.85,-.06],[0,1.6,-.03],[0,2.3,0],[.6,-.4,-.02],[.72,.65,-.02],[.78,1.3,.02],[.8,1.95,.04],[1.08,-.7,.04],[1.33,.05,.04],[1.5,.65,.07],[1.6,1.2,.1]];
export function handLandmarks(pinch=0,peace=0,mirror=1){
 const pts=OPEN.map(a=>new Vector3(...a as [number,number,number]));
 for(const [i,t] of [[2,[-.98,-.8,.35]],[3,[-.9,.15,.5]],[4,[-.78,1.05,.45]],[6,[-.75,.6,.15]],[7,[-.76,1.18,.35]],[8,[-.74,1.1,.45]]] as [number,number[]][])pts[i].lerp(new Vector3(...t as [number,number,number]),pinch);
 for(const i of [14,15,16,18,19,20]){pts[i].y=mix(pts[i].y,-.55+(i%4)*.13,peace);pts[i].z+=peace*.5;}
 return pts.map(v=>v.sub(new Vector3(-.76,1.075,.45)).multiply(new Vector3(mirror,1,1)));
}
export function createHoloHand(mirror=1){
 const group=new Group(),dotMaterial=new MeshBasicMaterial({color:'#a4ead6',transparent:true,depthWrite:false}),lineMaterial=new LineBasicMaterial({color:'#72bca9',transparent:true,depthWrite:false});
 const dots=new InstancedMesh(new SphereGeometry(.047,8,6),dotMaterial,21),geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(new Float32Array(HAND_LINKS.length*6),3));
 const lines=new LineSegments(geometry,lineMaterial),dummy=new Object3D();group.add(dots,lines);let points:Vector3[]=[];
 return {group,update(pinch:number,peace:number,reveal:number,gold:number,alpha:number){
  points=handLandmarks(pinch,peace,mirror);group.visible=alpha>.001&&reveal>0;
  dotMaterial.color.set('#a4ead6').lerp(new Color('#e9c880'),gold);lineMaterial.color.set('#72bca9').lerp(new Color('#c99e4f'),gold);dotMaterial.opacity=alpha;lineMaterial.opacity=alpha*.65;
  points.forEach((v,i)=>{dummy.position.copy(v);dummy.scale.setScalar(Math.max(0,Math.min(1,reveal*23-i)));dummy.updateMatrix();dots.setMatrixAt(i,dummy.matrix);});dots.instanceMatrix.needsUpdate=true;dots.computeBoundingSphere();
  const attr=geometry.getAttribute('position');HAND_LINKS.forEach(([a,b],i)=>{const end=points[a].clone().lerp(points[b],Math.max(0,Math.min(1,reveal*23-b)));attr.setXYZ(i*2,...points[a].toArray());attr.setXYZ(i*2+1,...end.toArray());});attr.needsUpdate=true;geometry.computeBoundingSphere();
 },snapshot(){return {id:group.id,visible:group.visible,pinchDistance:points.length?points[4].distanceTo(points[8]):0,position:group.position.toArray(),landmarks:points.map(p=>p.toArray())};}};
}
