import { Box3, Group, Mesh, SkinnedMesh, Texture, Vector3, type BufferGeometry, type Material, type Skeleton } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import avatarUrl from '../../project_story_assets/new_model.glb?url';
import { CharacterAnimation } from './CharacterAnimation';
import type { AvatarVisual } from './AvatarRig';
import { cinematicConfig } from './config';

export type CharacterVisual = AvatarVisual & {
  kind: 'character';
  animation:CharacterAnimation;
  metadata: { meshes:number; vertices:number; triangles:number; joints:number; clips:number; clipNames:string[]; textures:number; textureSizes:number[][]; sourceHeight:number; normalizedHeight:number; correctionScale:number; localBounds:number[][]; loadMs:number };
};
const textureSize=(texture:Texture)=>{const image=texture.image as {width?:number;height?:number}|undefined;return [image?.width??0,image?.height??0];};

function disposeModel(object:Group) {
  object.removeFromParent();
  const geometries=new Set<BufferGeometry>(),materials=new Set<Material>(),textures=new Set<Texture>(),skeletons=new Set<Skeleton>();
  object.traverse(node=>{
    if(node instanceof Mesh){geometries.add(node.geometry);for(const material of Array.isArray(node.material)?node.material:[node.material]){materials.add(material);for(const value of Object.values(material))if(value instanceof Texture)textures.add(value);}}
    if(node instanceof SkinnedMesh)skeletons.add(node.skeleton);
  });
  skeletons.forEach(s=>s.dispose());textures.forEach(t=>{t.dispose();if(typeof ImageBitmap!=='undefined'&&t.image instanceof ImageBitmap)t.image.close();});
  materials.forEach(m=>m.dispose());geometries.forEach(g=>g.dispose());
}

async function loadCharacter():Promise<CharacterVisual> {
  const started=performance.now();
  const gltf=await new GLTFLoader().loadAsync(avatarUrl);
  try {
    const model=gltf.scene,skinned:SkinnedMesh[]=[],textures=new Set<Texture>();let meshes=0,vertices=0,triangles=0;
    model.traverse(node=>{if(node instanceof SkinnedMesh)node.skeleton.pose();});
    model.updateMatrixWorld(true);
    model.traverse(node=>{
      if(node instanceof Mesh){
        meshes++;vertices+=node.geometry.attributes.position.count;triangles+=(node.geometry.index?.count??node.geometry.attributes.position.count)/3;
        for(const material of Array.isArray(node.material)?node.material:[node.material])for(const value of Object.values(material))if(value instanceof Texture)textures.add(value);
      }
      if(node instanceof SkinnedMesh){
        skinned.push(node);const joints=node.geometry.getAttribute('skinIndex'),weights=node.geometry.getAttribute('skinWeight');
        if(!joints||!weights||!node.skeleton.bones.length||node.skeleton.boneInverses.length!==node.skeleton.bones.length)throw new Error('Incomplete character skin binding.');
        for(let i=0;i<weights.count;i++){
          let total=0;for(let c=0;c<4;c++){const weight=weights.getComponent(i,c),joint=joints.getComponent(i,c);if(!Number.isFinite(weight)||weight<0||joint<0||joint>=node.skeleton.bones.length)throw new Error('Invalid character skin weights or joint index.');total+=weight;}
          if(Math.abs(total-1)>.01)throw new Error('Character weights are not normalized.');
        }
        for(const bone of node.skeleton.bones)if(!bone.isBone||!model.getObjectById(bone.id))throw new Error('Character joint is outside its hierarchy.');
        for(const inverse of node.skeleton.boneInverses)if(!inverse.elements.every(Number.isFinite))throw new Error('Invalid inverse bind matrix.');
        node.skeleton.update();node.computeBoundingBox();node.computeBoundingSphere();
      }
    });
    if(!skinned.length)throw new Error('The supplied character has no skinned mesh.');
    for(const texture of textures)if(textureSize(texture).some(size=>size<=0))throw new Error('A character texture did not decode.');
    const bounds=new Box3().setFromObject(model,true),size=bounds.getSize(new Vector3()),center=bounds.getCenter(new Vector3());
    if(![...bounds.min.toArray(),...bounds.max.toArray()].every(Number.isFinite)||size.y<.01||size.y>100)throw new Error('Invalid character bounds.');
    // Normalize from the bind pose; animation is initialized before visual attachment.
    // The complete armature and original mesh/materials stay together.
    const correction=new Group();correction.name='ModelCorrectionGroup';correction.scale.setScalar(cinematicConfig.avatar.height/size.y);
    correction.position.set(-center.x*correction.scale.x,-bounds.min.y*correction.scale.y,-center.z*correction.scale.z);
    correction.add(model);correction.updateMatrixWorld(true);
    const animation=new CharacterAnimation(model,correction.scale.x,skinned,gltf.animations);
    return {object:correction,kind:'character',animation,metadata:{meshes,vertices,triangles,joints:new Set(skinned.flatMap(m=>m.skeleton.bones)).size,clips:gltf.animations.length,clipNames:gltf.animations.map(c=>c.name),textures:textures.size,textureSizes:[...textures].map(textureSize),sourceHeight:size.y,normalizedHeight:cinematicConfig.avatar.height,correctionScale:correction.scale.x,localBounds:animation.bounds,loadMs:performance.now()-started}};
  }catch(error){disposeModel(gltf.scene);throw error;}
}

// One resource lease for the persistent character. A short teardown grace period
// bridges responsive renderer rebuilding without fetching/decoding a second GLB.
type Entry={users:number;ready:Promise<CharacterVisual>;timer?:ReturnType<typeof setTimeout>};
let cached:Entry|undefined;
export function acquireCharacter(){
  if(!cached)cached={users:0,ready:loadCharacter()};
  const entry=cached;entry.users++;clearTimeout(entry.timer);let released=false;
  return {ready:entry.ready,release(){
    if(released)return;released=true;entry.users--;
    if(entry.users===0)entry.timer=setTimeout(()=>{
      if(entry.users)return;if(cached===entry)cached=undefined;
      void entry.ready.then(visual=>{if(!entry.users){visual.animation.dispose();disposeModel(visual.object);}},()=>{});
    },750);
  }};
}
