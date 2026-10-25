import { createHoloTrajectory } from './HoloTrajectory';
import { createHoloEnvironment, HOLO_ASSETS } from './HoloEnvironment';
import { createDOJTrajectory } from './DOJTrajectory';
import { createDOJEnvironment, DOJ_ASSETS } from './DOJEnvironment';
import { Group, Vector3, Mesh, Light, type Material, type PerspectiveCamera } from 'three';
import { createProjectTrajectory } from './ProjectTrajectory';
import { createProjectAssetCache } from './ProjectAssetSurface';
import { createYatraLokEnvironment, createPrishaEnvironment, YATRA_ASSETS, PRISHA_ASSETS, makePath } from './ProjectEnvironment';
import { createProjectTransition } from './ProjectTransition';
import { projectState } from './projectConfig';
import { range,smooth } from '../cinematic/config';

/** Persistent-scene director. Worlds own different geometry/choreography and share only lifecycle and assets. */
export function createProjectWorld(mobile:boolean,_root:HTMLElement){
 const group=new Group();group.visible=false;
 const trajectory=createProjectTrajectory(mobile),cache=createProjectAssetCache(mobile);
 const yatra=createYatraLokEnvironment(cache,trajectory.point,mobile),prisha=createPrishaEnvironment(cache,trajectory.point,mobile),transition=createProjectTransition(trajectory.point,mobile,yatra.route.curve);
 group.add(yatra.group,prisha.group,transition.group);
 const dojTrajectory=createDOJTrajectory(mobile,trajectory.sample(1));
 const holoTrajectory=createHoloTrajectory(mobile,dojTrajectory.sample(1));
 let holo:ReturnType<typeof createHoloEnvironment>|undefined;
 const holoProgress=(p:number)=>range(p,1.64,2.72);
 let doj:ReturnType<typeof createDOJEnvironment>|undefined;
 const dojProgress=(p:number)=>range(p,1,1.64);
 const allSurfaces=()=>[...yatra.surfaces,...prisha.surfaces,...(doj?.surfaces??[]),...(holo?.surfaces??[])];
 const fadedMaterials=new Map<Material,{opacity:number;transparent:boolean}>();
 const restorePrisha=()=>{fadedMaterials.forEach((v,m)=>{m.opacity=v.opacity;m.transparent=v.transparent;});fadedMaterials.clear();};
 const freezeFade=(alpha:number)=>{prisha.group.traverse(o=>{if(o instanceof Mesh){for(const m of Array.isArray(o.material)?o.material:[o.material]){if(!fadedMaterials.has(m))fadedMaterials.set(m,{opacity:m.opacity,transparent:m.transparent});m.transparent=true;m.opacity=fadedMaterials.get(m)!.opacity*alpha;}}else if(o instanceof Light)o.intensity*=alpha;});};
 const portal=makePath([[0,.04,0],[-2,.05,-4],[-5,.05,-10]].map(trajectory.point),'#d6c5a4',.026);group.add(portal.mesh);
 let surfaceBounds:Record<string,{left:number;right:number;top:number;bottom:number}>={};
 let holoObjectBounds={};
 let progress=0,details={},transitionDetails={},lifecycle={yatralok:'DORMANT',prisha:'DORMANT',doj:'DORMANT',holo:'DORMANT'},preload='NONE';
 const prepare=(p:number)=>{
  if(p<.57){cache.prepare(YATRA_ASSETS);lifecycle.yatralok=p<.04?'PREPARED':'ACTIVE';}else {yatra.clear();cache.release('yatralok/');lifecycle.yatralok='DORMANT';}
  if(p>.42&&p<1.075){cache.prepare(PRISHA_ASSETS);lifecycle.prisha=p<.525?'PREPARED':p>.97?'DORMANT':'ACTIVE';preload='PRISHA_PREPARED';}else{prisha.clear();cache.release('prisha/');lifecycle.prisha='DORMANT';preload=p<.42?'YATRALOK_PREPARED':'NONE';}
  if(p>.925&&p<1.69){cache.prepare(DOJ_ASSETS);if(!doj){doj=createDOJEnvironment(cache,dojTrajectory.point,mobile);group.add(doj.group);}lifecycle.doj=p<1?'PREPARED':p>=1.64?'DORMANT':'ACTIVE';preload='DOJ_PREPARED';}else {doj?.clear();cache.release('doj/');lifecycle.doj='DORMANT';}
  if(p>1.59){cache.prepare(HOLO_ASSETS);if(!holo){holo=createHoloEnvironment(cache,holoTrajectory.origin,mobile);group.add(holo.group);}lifecycle.holo=p<1.64?'PREPARED':p>=2.72?'DORMANT':'ACTIVE';preload='HOLO_PREPARED';}else{holo?.clear();cache.release('holo/');lifecycle.holo='DORMANT';}
 };
 return {group,trajectory,prepare(){cache.prepare(YATRA_ASSETS);},update(p:number){
  progress=p;prepare(p);group.visible=p>0;portal.reveal(smooth(range(p,.047,.085)));portal.material.opacity=(1-smooth(range(p,.10,.20)))*.8;
  if(p<=1&&fadedMaterials.size)restorePrisha();
  const pose=p>1.64?holoTrajectory.sample(holoProgress(p)):p>1?dojTrajectory.sample(dojProgress(p)):trajectory.sample(p);
  const yatraState=yatra.update(Math.min(p,1),pose.position),prishaState=prisha.update(Math.min(p,1));
  if(p>1){freezeFade(1-smooth(range(p,1,1.075)));prisha.group.visible=p<1.075;}
  const dojState=doj?.update(dojProgress(p))??{};if(doj)doj.group.visible=p>1&&p<1.64;
  const holoState=holo?.update(holoProgress(p),smooth(range(p,1.615,1.64))*(1-smooth(range(p,1.64,1.68))))??{};if(holo)holo.group.visible=p>1.615;
  details={...yatraState,...prishaState,...dojState,...holoState,projectWorldsHandoff:holoTrajectory.handoff,...(p>1.075?{transactionSignalVisible:false}:{}),project04Origin:dojTrajectory.project04Origin,project04Direction:dojTrajectory.project04Direction,project04CameraStart:dojTrajectory.project04CameraStart,project04AvatarStart:dojTrajectory.project04AvatarStart};transitionDetails=transition.update(Math.min(p,1));transition.group.visible=p<1.06;

  return pose;
 },projectLabels(camera:PerspectiveCamera){
  if(!import.meta.env.DEV)return;camera.updateMatrixWorld();group.updateWorldMatrix(true,true);surfaceBounds={};holoObjectBounds=holo?.framing(camera)??{};
  for(const s of allSurfaces())if(s.group.visible){const points=[];for(const x of [-.5,.5])for(const y of [-.5,.5])points.push(new Vector3(x,y,0).applyMatrix4(s.mesh.matrixWorld).project(camera));surfaceBounds[s.key]={left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),top:Math.max(...points.map(p=>p.y)),bottom:Math.min(...points.map(p=>p.y))};}
 },hide(){group.visible=false;progress=0;yatra.clear();prisha.clear();cache.release('yatralok/');cache.release('prisha/');doj?.clear();cache.release('doj/');holo?.clear();cache.release('holo/');restorePrisha();},snapshot(){const s=projectState(progress);return {
  phase4BProgress:progress,holoObjectBounds,projectWorldActive:progress>0,activeProject:progress<.08?'entry':progress>2.69?'handoff':progress>.967&&progress<1?'handoff':s.project.id,projectProgress:s.local,storyBeat:s.beat.id,
  surfaceBounds,activeUISurfaces:[...(progress<1?yatra.active():[]),...(progress<1.075?prisha.active():[]),...(doj?.active()??[]),...(holo?.active()??[])],surfaceDiagnostics:allSurfaces().filter(s=>s.group.visible).map(s=>({key:s.key,position:s.group.position.toArray(),scale:s.mesh.scale.toArray(),opacity:s.mesh.material.opacity})),...cache.snapshot(),worldLifecycle:lifecycle,nextWorldPreload:preload,avatarConceptualState:progress<.047?'SETTLED':progress<.085||s.transition>0&&s.transition<1?'TRANSITIONING':s.beat.id==='resolution'?'SETTLED':(progress>1.64?holoTrajectory.sample(holoProgress(progress)):progress>1?dojTrajectory.sample(dojProgress(progress)):trajectory.sample(progress)).state==='WALKING'?'MOVING':'OBSERVING',qualityTier:mobile?'MOBILE':'DESKTOP',reducedMotion:false,
  ...details,...transitionDetails,projectHandoffProgress:s.handoff,transitionProgress:s.transition,
 };},dispose(){cache.dispose();prisha.dispose();holo?.dispose();}};
}
