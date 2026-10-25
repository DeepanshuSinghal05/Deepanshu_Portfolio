import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createGlassSystem } from './GlassSystem';
import { createLandingEnvironment } from './LandingEnvironment';
import { Scene, AmbientLight, DirectionalLight, Fog, Color, type WebGLRenderer, Mesh, InstancedMesh, LineSegments, Points, HemisphereLight, PMREMGenerator, PointLight, Box3, Vector3 } from 'three';
import { createTunnelSystem } from './TunnelSystem';
import { AvatarRig } from './AvatarRig';
import { CameraRig } from './CameraRig';
import { progressAt, cinematicConfig as C, range, smooth, mix } from './config';
import { createOuterEnvironment } from './OuterEnvironment';
import { emitCinematicCrossings } from './CinematicEvents';
import { createAtmosphericBackdrop } from './AtmosphericBackdrop';
import { createStoryWorld } from '../story/StoryWorld';
import type { StoryPose } from '../story/StoryTrajectory';
import { createProjectWorld } from '../projects/ProjectWorld';
import { createExperienceWorld } from '../experience/ExperienceWorld';
import { createExperienceWalk } from '../experience/ExperienceWalk';
import { createProjectFinale } from '../experience/ProjectFinale';
import { createContactWorld } from '../contact/ContactWorld';
import { createContactTransition } from '../contact/ContactTransition';
import { createCharacterMotion, faceTravel } from './CharacterMotion';
import type { CharacterFrame } from './CharacterAnimation';
import type { CharacterVisual, acquireCharacter } from './CharacterAsset';

export function createCinematicWorld(renderer: WebGLRenderer, mobile: boolean, root:HTMLElement) {
  const scene = new Scene(); scene.background = new Color('#151a20'); scene.fog = new Fog('#151a20', C.atmosphere.fogNear, C.atmosphere.fogFar);
  const pmrem = new PMREMGenerator(renderer), room = new RoomEnvironment();
  const env = pmrem.fromScene(room); scene.environment = env.texture; scene.environmentIntensity = .35; room.dispose(); pmrem.dispose();
  const glass = createGlassSystem(mobile), landing = createLandingEnvironment(mobile); scene.add(glass.group, landing.group);
  const backdrop=createAtmosphericBackdrop();scene.add(backdrop.mesh);
  const storyOrigin=new Vector3(...C.storyOrigin),storyDirection=new Vector3(...C.storyDirection);
  const rig = new AvatarRig(), camera = new CameraRig();
  const experienceWalk=createExperienceWalk(rig.visual.object);
  const updateWalk=(distance:number,weight:number)=>{if(rig.visual.kind==='proxy')experienceWalk.update(distance,weight);};
  const resetWalk=()=>{if(rig.visual.kind==='proxy')experienceWalk.reset();};
  const story=createStoryWorld(mobile);scene.add(story.group);
  const projects=createProjectWorld(mobile,root);scene.add(projects.group);
  const finale=createProjectFinale(projects.group);
  let experience:ReturnType<typeof createExperienceWorld>|undefined;
  let contact:ReturnType<typeof createContactWorld>|undefined,contactTransition:ReturnType<typeof createContactTransition>|undefined;
  let contactActive=false,lastContact=-1,contactRenders=0,contactExperienceSamples=0;
  let lastExperience=0,experienceFrozen=false,experienceProjectsReleased=false,experienceProjectUpdates=0,experienceRenders=0;
  let lastProject=0;
  let lastStory=0,storyPose:StoryPose|undefined;
  const tunnel = createTunnelSystem(mobile); scene.add(tunnel.group);
  const outer = createOuterEnvironment(mobile); scene.add(outer.group);
  const lowerLight = new PointLight('#e2cfab', 0, 22, 1.5); lowerLight.position.set(0,C.impactPoint[1]-2,1); scene.add(lowerLight);
  scene.add(rig.root, new AmbientLight('#e8e0d2', .4), new HemisphereLight('#fff2df', '#343c43', 1.1));
  const key = new DirectionalLight('#fff1db', 1.8); key.position.set(4, 8, 5); scene.add(key, key.target);
  const rim = new DirectionalLight('#d9e5ee', 1.1); rim.position.set(-5, 2, -3); scene.add(rim, rim.target);
  let last = -1, previousProgress = -1, previousTime = 0, velocity = 0, lastAtmosphereTime=-1;
  let disposed=false,avatarRequested=false,character:CharacterVisual|undefined,characterLease:ReturnType<typeof acquireCharacter>|undefined;
  root.dataset.avatarStatus='proxy';
  let motion:ReturnType<typeof createCharacterMotion>|undefined,lastCharacterFrame=-1;
  const animate=(section:CharacterFrame['section'],p:number,time:number,pose?:StoryPose)=>{
    if(!character&&root.dataset.workActive==='true')return;
    motion??=createCharacterMotion(mobile);const frame=motion(section,p);
    if(pose){faceTravel(pose,frame);rig.root.rotation.y=pose.rotation;}
    character?.animation.evaluate(frame,time);lastCharacterFrame=time;
  };
  const idleFrame=(time:number)=>!!character?.animation.needsIdleFrame&&time-lastCharacterFrame>=1/24;
  const prepareAvatar=()=>{
    if(avatarRequested||disposed)return;avatarRequested=true;root.dataset.avatarStatus='loading';
    void import('./CharacterAsset').then(async({acquireCharacter})=>{
      if(disposed)return;characterLease=acquireCharacter();const visual=await characterLease.ready;if(disposed)return;
      // Compile for this renderer and its existing lights before replacing the proxy.
      await renderer.compileAsync(visual.object,camera.camera,scene);if(disposed)return;
      rig.replaceVisual(visual);character=visual;root.dataset.avatarStatus='ready';root.dataset.avatarLoadingVisible='false';
      last=-1;lastStory=-1;lastProject=-1;lastExperience=-1;lastContact=-1;lastAtmosphereTime=-1;
    }).catch(error=>{
      if(disposed)return;root.dataset.avatarStatus='fallback';root.dataset.avatarLoadingVisible='false';root.querySelector('[data-navigation-status]')!.textContent='The 3D character could not load. A simplified figure is shown; all portfolio content remains available.';characterLease?.release();characterLease=undefined;
      if(import.meta.env.DEV)console.warn('[Avatar] Character validation/loading failed; retaining proxy.',error);
    });
  };
  const frameMobileCharacter=(weight=1)=>{
    if(!mobile||!character||weight<=0)return;
    // Use a stable animated envelope. A small, reversible dolly
    // around its foot anchor prevents mobile hand clipping; root paths stay exact.
    rig.root.updateMatrixWorld(true);camera.camera.updateMatrixWorld(true);
    const bounds=new Box3(new Vector3().fromArray(character.metadata.localBounds[0]),new Vector3().fromArray(character.metadata.localBounds[1])).applyMatrix4(rig.root.matrixWorld),center=rig.root.position.clone().project(camera.camera).x;
    weight*=1-smooth(range(Math.abs(center),.75,1.05));if(weight<=0)return;
    const corners:Vector3[]=[];for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z])corners.push(new Vector3(x,y,z));
    let fit=1;
    for(let i=0;i<3;i++){
      const xs=corners.map(v=>v.clone().project(camera.camera).x),needed=Math.max(1,(center-Math.min(...xs))/Math.max(.05,center+.94),(Math.max(...xs)-center)/Math.max(.05,.94-center));
      if(needed<=1.001)break;const factor=Math.min(needed*1.015,2.5/fit);fit*=factor;
      camera.camera.position.sub(rig.root.position).multiplyScalar(factor).add(rig.root.position);camera.target.sub(rig.root.position).multiplyScalar(factor).add(rig.root.position);camera.camera.lookAt(camera.target);camera.camera.updateMatrixWorld(true);
    }
    if(weight<1){const factor=mix(1,fit,weight)/fit;camera.camera.position.sub(rig.root.position).multiplyScalar(factor).add(rig.root.position);camera.target.sub(rig.root.position).multiplyScalar(factor).add(rig.root.position);camera.camera.lookAt(camera.target);camera.camera.updateMatrixWorld(true);}
  };
  return {
    storyOrigin,storyDirection,prepareAvatar,
    resize(w: number, h: number) { camera.resize(w, h); last = -1;lastExperience=-1;lastContact=-1; },
    render(p: number, time = 0, storyProgress=0,experienceProgress=0,projectProgress=0,contactProgress=0) {
      if(root.dataset.workActive!=='true')prepareAvatar();
      root.dataset.avatarLoadingVisible=String(root.dataset.avatarStatus==='loading'&&root.dataset.workActive!=='true');
      // Keep environments and the absolute scroll state current under the cover.
      if(contactProgress>.001){
        if(lastContact===contactProgress){if(idleFrame(time)){animate('contact',contactProgress,time);contactRenders++;renderer.render(scene,camera.camera);}return;}
        if(!contact){contact=createContactWorld(mobile);scene.add(contact.group);}
        contact.trajectory.setAspect(camera.camera.aspect);
        contact.trajectory.setCharacterBounds(character?.metadata.localBounds);
        if(!contactActive){
          if(!experience){experience=createExperienceWorld(mobile);scene.add(experience.group);}
          experience.update(1);contactExperienceSamples++;contactTransition??=createContactTransition(experience.group);
          finale.restore();projects.hide();experienceFrozen=true;experienceProjectsReleased=true;contactActive=true;
        }
        contactTransition!.fade(1-smooth(range(contactProgress,.08,.58)));
        tunnel.group.visible=false;outer.group.visible=false;glass.group.visible=false;story.group.visible=false;
        storyPose=contact.update(contactProgress);rig.updateStory(storyPose);updateWalk(storyPose.distance,contact.trajectory.walkWeight(contactProgress));animate('contact',contactProgress,time,storyPose);camera.updateStory(storyPose);
        landing.update(1,rig.root.position.x,rig.root.position.z,1);landing.projectGround(rig.root.position.z);landing.spatialMood(1/ .9);
        const arrived=smooth(range(contactProgress,.38,.78));
        (scene.background as Color).set('#e9e4da').lerp(new Color('#f0eee7'),arrived);(scene.fog as Fog).color.copy(scene.background as Color);(scene.fog as Fog).near=9;(scene.fog as Fog).far=115;
        key.color.set('#f5f1e7');key.intensity=mix(1.3,1.25,arrived);rim.color.set('#e6dfd3');rim.intensity=.5;lowerLight.intensity=0;
        key.position.copy(rig.root.position).add(new Vector3(4,6,5));key.target.position.copy(rig.root.position);rim.position.copy(rig.root.position).add(new Vector3(-5,2,-3));rim.target.position.copy(rig.root.position);
        lastContact=contactProgress;lastExperience=1;lastStory=1;lastProject=2.72;last=p;previousProgress=p;previousTime=time;velocity=0;
        contactRenders++;renderer.render(scene,camera.camera);return;
      }
      if(contactActive){contactTransition?.restore();contact?.hide();resetWalk();contactActive=false;lastContact=-1;lastExperience=-1;}
      if(experienceProgress>0){
        if(lastExperience===experienceProgress){if(idleFrame(time)){animate('experience',experienceProgress,time);experienceRenders++;renderer.render(scene,camera.camera);}return;}
        if(!experience){experience=createExperienceWorld(mobile);scene.add(experience.group);}
        // Sample Holo only when its remnants can be seen; direct experience entry needs no project media.
        if(experienceProgress<.16){
          if(!experienceFrozen||experienceProjectsReleased){finale.restore();projects.update(2.72);experienceProjectUpdates++;experienceProjectsReleased=false;}
          finale.fade(1-smooth(range(experienceProgress,.025,.16)));
        }else if(!experienceFrozen||!experienceProjectsReleased){finale.restore();projects.hide();experienceProjectsReleased=true;}
        experienceFrozen=true;
        tunnel.group.visible=false;outer.group.visible=false;glass.group.visible=false;story.group.visible=false;
        experience.trajectory.setAspect(camera.camera.aspect);
        storyPose=experience.update(experienceProgress);rig.updateStory(storyPose);updateWalk(storyPose.distance,experience.trajectory.walkWeight(experienceProgress));animate('experience',experienceProgress,time,storyPose);camera.updateStory(storyPose);
        const warm=smooth(range(experienceProgress,.15,.29));
        landing.update(1,rig.root.position.x,rig.root.position.z,1);landing.projectGround(rig.root.position.z);landing.spatialMood(1+warm/9);
        backdrop.update(1,1);backdrop.mesh.position.z=Math.min(-95,rig.root.position.z-55);
        (scene.background as Color).set('#080e10').lerp(new Color('#e9e4da'),warm);(scene.fog as Fog).color.copy(scene.background as Color);(scene.fog as Fog).near=9;(scene.fog as Fog).far=115;
        key.intensity=mix(2.05,1.3,warm);rim.intensity=mix(1.4,.5,warm);lowerLight.intensity=0;
        key.color.set('#e3edf2').lerp(new Color('#f5f1e7'),warm);rim.color.set('#b9cedc').lerp(new Color('#e6dfd3'),warm);
        key.position.copy(rig.root.position).add(new Vector3(4,6,5));key.target.position.copy(rig.root.position);rim.position.copy(rig.root.position).add(new Vector3(-5,2,-3));rim.target.position.copy(rig.root.position);
        lastExperience=experienceProgress;lastProject=2.72;lastStory=1;last=p;previousProgress=p;previousTime=time;velocity=0;
        experienceRenders++;renderer.render(scene,camera.camera);return;
      }
      if(experienceFrozen){resetWalk();finale.restore();experience?.hide();experienceFrozen=false;experienceProjectsReleased=false;lastExperience=0;last=-1;lastAtmosphereTime=-1;}
      if(projectProgress>0){
        if(lastProject===projectProgress&&time-lastAtmosphereTime<1/30)return;
        const changed=lastProject!==projectProgress;lastAtmosphereTime=time;
        lastProject=projectProgress;lastStory=1;last=p;previousProgress=p;velocity=0;
        if(changed){tunnel.update(1);outer.update(1);glass.update(1);story.update(1);story.setWorkDormancy(projectProgress*3);story.group.visible=projectProgress<.12;}
        storyPose=projects.update(projectProgress);rig.updateStory(storyPose);animate('project',projectProgress,time,storyPose);camera.updateStory(storyPose);frameMobileCharacter(1-smooth(range(projectProgress,0,.12)));projects.projectLabels(camera.camera);
        landing.update(1,rig.root.position.x,rig.root.position.z,1);landing.projectGround(rig.root.position.z*smooth(range(projectProgress,.025,.12)));landing.animate(time);backdrop.update(1);backdrop.mesh.position.z=mix(-95,Math.min(-95,rig.root.position.z-55),smooth(range(projectProgress,.025,.12)));
        const emerge=smooth(range(projectProgress,.025,.12)),commerce=smooth(range(projectProgress,.47,.56));
        key.intensity=mix(1.8,2.05,smooth(range(projectProgress,.025,.12)));rim.intensity=mix(1.0725,1.4,smooth(range(projectProgress,.025,.12)));lowerLight.intensity=0;key.color.set('#fff1db').lerp(new Color('#e4eef1'),emerge*(1-commerce));rim.color.set('#d9e5ee').lerp(new Color('#8ac2ce'),emerge).lerp(new Color('#a7b4dc'),commerce);
        const institution=smooth(range(projectProgress,1,1.075));key.color.lerp(new Color('#e3edf2'),institution);rim.color.lerp(new Color('#b9cedc'),institution);
        const spatial=smooth(range(projectProgress,1.64,1.72));landing.spatialMood(spatial);backdrop.update(1,spatial);(scene.background as Color).set('#151a20').lerp(new Color('#080e10'),spatial);(scene.fog as Fog).color.set('#151a20').lerp(new Color('#080e10'),spatial);
        key.position.copy(rig.root.position).add(new Vector3(4,6,5));key.target.position.copy(rig.root.position);rim.position.copy(rig.root.position).add(new Vector3(-5,2,-3));rim.target.position.copy(rig.root.position);
        (scene.fog as Fog).near=9;(scene.fog as Fog).far=mix(58,115,smooth(range(projectProgress,.025,.15)));
        renderer.render(scene,camera.camera);return;
      }
      if(lastProject>0){lastProject=0;last=-1;projects.hide();landing.projectGround(0);backdrop.mesh.position.z=-95;(scene.background as Color).set('#151a20');(scene.fog as Fog).color.set('#151a20');key.color.set('#fff1db');rim.color.set('#d9e5ee');}

      if(storyProgress>.90)projects.prepare();
      if(storyProgress>0){
        if(last===p && lastStory===storyProgress){
          if(time-lastAtmosphereTime<.05)return;
          animate('story',storyProgress,time);landing.animate(time);lastAtmosphereTime=time;renderer.render(scene,camera.camera);return;
        }
        emitCinematicCrossings(previousProgress,p);previousProgress=p;previousTime=time;last=p;lastStory=storyProgress;velocity=0;
        tunnel.update(1);outer.update(1);glass.update(1);
        storyPose=story.update(storyProgress);rig.updateStory(storyPose);animate('story',storyProgress,time,storyPose);camera.updateStory(storyPose);frameMobileCharacter();
        landing.update(1,rig.root.position.x,rig.root.position.z,storyProgress);landing.animate(time);backdrop.update(1);
        key.intensity=mix(C.lighting.settled,1.8,smooth(range(storyProgress,.8,1)));rim.intensity=1.65*.65;lowerLight.intensity=0;
        key.position.copy(rig.root.position).add(new Vector3(4,6,5));key.target.position.copy(rig.root.position);
        rim.position.copy(rig.root.position).add(new Vector3(-5,2,-3));rim.target.position.copy(rig.root.position);
        (scene.fog as Fog).near=9;(scene.fog as Fog).far=mix(42,58,smooth(range(storyProgress,.8,1)));
        lastAtmosphereTime=time;renderer.render(scene,camera.camera);return;
      }
      if(lastStory>0){last=-1;lastStory=0;storyPose=undefined;story.group.visible=false;}
      const previousVelocity=velocity;
      const dt = Math.min(.067, Math.max(.016, time-previousTime)); previousTime=time;
      const delta=previousProgress<0?0:p-previousProgress;
      const target=p>.2 && p<.535 && Math.abs(delta)<.1?Math.min(C.atmosphere.velocityMax,Math.abs(delta)/dt*5):0;
      velocity += (target-velocity)*(1-Math.exp(-C.atmosphere.velocityDamping*dt));
      if(velocity<.002 || p>=.76)velocity=0;
      emitCinematicCrossings(previousProgress,p); previousProgress=p;
      // The existing ticker owns this low-rate idle pass; static systems sleep.
      if (last === p && velocity===0 && previousVelocity===0) {
        if(p<.9 || time-lastAtmosphereTime<.05)return;
        lastAtmosphereTime=time;animate('cinematic',p,time);landing.animate(time);renderer.render(scene,camera.camera);return;
      }
      last = p;
      tunnel.update(p,velocity); outer.update(p); rig.update(p, mobile);animate('cinematic',p,time); camera.update(p, rig.root.position.y, mobile);frameMobileCharacter(smooth(range(p,.76,.96)));
      const deep=smooth(range(p,.24,.4)), lower=smooth(range(p,.43,.54)), calm=smooth(range(p,.84,.97));
      key.intensity=mix(mix(C.lighting.upper,C.lighting.deep,deep),C.lighting.lower,lower);
      key.intensity=mix(key.intensity,C.lighting.settled,calm);
      rim.intensity=mix(1.1,1.65,lower)*(1-calm*.35);
      lowerLight.intensity=C.lighting.lowerSource*smooth(range(p,.36,.55))*(1-smooth(range(p,.66,.81)));
      (scene.fog as Fog).near=mix(C.atmosphere.fogNear,9,calm); (scene.fog as Fog).far=mix(C.atmosphere.fogFar,42,calm);
      key.position.set(4,rig.root.position.y+6,5);key.target.position.set(0,rig.root.position.y,0);
      rim.position.set(-5,rig.root.position.y+2,-3);rim.target.position.set(0,rig.root.position.y,0);
      glass.update(p); landing.update(p, rig.root.position.x);backdrop.update(p);landing.animate(time);lastAtmosphereTime=time;
      renderer.render(scene, camera.camera);
    },
    snapshot(p: number) {
      const bounds=new Box3().setFromObject(rig.root,true), corners=[];
      for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z])corners.push(new Vector3(x,y,z).project(camera.camera));
      const avatarBounds={left:Math.min(...corners.map(v=>v.x)),right:Math.max(...corners.map(v=>v.x)),top:Math.max(...corners.map(v=>v.y)),bottom:Math.min(...corners.map(v=>v.y))};
      const avatarAsset={status:root.dataset.avatarStatus,kind:rig.visual.kind,...character?.metadata,animation:character?.animation.snapshot(),worldBounds:[bounds.min.toArray(),bounds.max.toArray()]};
      if(lastStory>0&&storyPose)return {
        workWorldProgress:0,phase4AProgress:0,activeWorkMode:'DORMANT',projectWorldActive:false,qualityTier:mobile?'MOBILE':'DESKTOP',
        ...(lastProject>0?projects.snapshot():{}),progress:p,storyProgress:lastStory,chapter:storyPose.chapter,avatarBounds,avatarAsset,
        avatar:rig.root.position.toArray(),rotation:rig.root.rotation.toArray().slice(0,3),scale:rig.root.scale.toArray(),avatarState:storyPose.state,
        camera:camera.camera.position.toArray(),target:camera.target.toArray(),fov:camera.camera.fov,cameraMode:camera.mode,
        storyOrigin:storyOrigin.toArray(),storyDirection:storyDirection.toArray(),walkDirection:storyPose.direction.toArray(),lookTarget:storyPose.lookTarget.toArray(),
        story:story.snapshot(),handoff23:range(lastStory,0,.035),handoff34:range(lastStory,.95,.985),
        tunnelState:'DORMANT',glassState:'INACTIVE',shardState:'INACTIVE',environmentState:lastProject>0?'PROJECT_WORLD':lastStory>=.985?'PHASE4_READY':'STORY',
        calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,
        ...(experienceFrozen?{...experience?.snapshot(),projectWorldActive:false,activeUISurfaces:[],worldLifecycle:{yatralok:'DORMANT',prisha:'DORMANT',doj:'DORMANT',holo:'DORMANT'},environmentState:'EXPERIENCE',experienceProjectUpdates,experienceRenders,experienceWalk:character?[]:experienceWalk.snapshot(),projectRemnantsVisible:projects.group.visible,projectMediaReleased:experienceProjectsReleased}:{}),
        ...(contactActive?{...contact?.snapshot(),environmentState:'CONTACT',contactRenders,contactExperienceSamples,experienceVisible:experience?.group.visible,careerArchitectureActive:false,workMemoryActive:[],memoryTraceCount:0}:{}),
      };
      return { avatarBounds, avatarAsset, progress: p, normalized: progressAt(p), zone: Object.entries(C.zones).find(([,v])=>p>=v[0]&&p<v[1])?.[0]??'arrival', avatarState:p>=.96?'IDLE':p>=.87?'RECOVERY':p>=.76?'LANDING':'FALL', cameraMode:camera.mode, fov:camera.camera.fov, velocity, tunnelState:tunnel.group.visible?'ACTIVE':'DORMANT', environmentState:p>=.96?'ARRIVAL_IDLE':outer.group.visible?'DEPTH':'ARRIVAL', glassState:glass.group.visible?'ACTIVE':'INACTIVE', glass:glass.diagnostics(p), shardState:p>C.timing.fracture[0]&&p<.87?'ACTIVE':'INACTIVE', particleState:p>=.96?'LOW_RATE_IDLE':'SCROLL', arrivalParticles:landing.particleCount, storyOrigin:storyOrigin.toArray(), storyDirection:storyDirection.toArray(), outerInstances:outer.count, avatar: rig.root.position.toArray(), rotation: rig.root.rotation.toArray().slice(0, 3), scale: rig.root.scale.toArray(), camera: camera.camera.position.toArray(), target: camera.target.toArray(), shards: glass.snapshot(), shardCount: glass.count, calls: renderer.info.render.calls, triangles: renderer.info.render.triangles }; },
    dispose() {
      disposed=true;root.dataset.avatarLoadingVisible='false';
      if(character)rig.root.remove(character.object);
      characterLease?.release();
      contactTransition?.restore();
      experience?.dispose();
      finale.restore();
      projects.dispose();
      const geometries = new Set<import('three').BufferGeometry>(), materials = new Set<import('three').Material>();
      scene.traverse(object => { if (object instanceof InstancedMesh) object.dispose(); if (object instanceof Mesh || object instanceof LineSegments || object instanceof Points) { geometries.add(object.geometry); (Array.isArray(object.material) ? object.material : [object.material]).forEach(m => materials.add(m)); } });
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); landing.dispose(); env.dispose(); scene.clear();
    },
  };
}

