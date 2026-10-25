import { Group, Mesh, PlaneGeometry, CircleGeometry, MeshBasicMaterial, TextureLoader, SRGBColorSpace, DoubleSide, BoxGeometry, CylinderGeometry, MeshStandardMaterial, type Texture } from 'three';
type Entry={texture?:Texture;status:'loading'|'ready'|'failed';generation:number};
/** Only the current and upcoming namespaces are resident. Late callbacks cannot revive evicted assets. */
export function createProjectAssetCache(mobile:boolean){
 const entries=new Map<string,Entry>(),loader=new TextureLoader();let generation=0,disposed=false;
 return {
  get(key:string){return entries.get(key)?.texture;},
  prepare(keys:string[]){for(const key of keys){if(entries.has(key)||disposed)continue;const entry:Entry={status:'loading',generation:++generation};entries.set(key,entry);
   loader.load(`/worlds/${key}-${mobile?'mobile':'desktop'}.webp`,texture=>{if(disposed||entries.get(key)!==entry){texture.dispose();return;}texture.colorSpace=SRGBColorSpace;texture.anisotropy=mobile?2:4;entry.texture=texture;entry.status='ready';},undefined,()=>{if(entries.get(key)===entry)entry.status='failed';});
  }},
  release(prefix:string){for(const [key,e]of entries)if(key.startsWith(prefix)){e.texture?.dispose();entries.delete(key);}},
  snapshot(){return {loadedTextures:[...entries].filter(([,e])=>e.status==='ready').map(([k])=>k),activeTextureCount:[...entries.values()].filter(e=>e.texture).length,pendingTextures:[...entries.values()].filter(e=>e.status==='loading').length,failedTextures:[...entries].filter(([,e])=>e.status==='failed').map(([k])=>k)};},
  dispose(){disposed=true;for(const e of entries.values())e.texture?.dispose();entries.clear();}
 };
}
export type AssetCache=ReturnType<typeof createProjectAssetCache>;
export function createAssetSurface(cache:AssetCache,key:string,width:number,height:number,circle=false){
 const group=new Group(),material=new MeshBasicMaterial({transparent:true,opacity:0,side:DoubleSide,toneMapped:false,depthWrite:true});
 const mesh=new Mesh(circle?new CircleGeometry(.5,48):new PlaneGeometry(1,1),material);mesh.scale.set(width,height,1);group.add(mesh);group.name=key;
 // Thin opaque substrate: the source UI remains unlit and readable, its edge receives world light.
 const backing=new Mesh(circle?new CylinderGeometry(.5,.5,.06,48):new BoxGeometry(1,1,.06),new MeshStandardMaterial({color:'#27343b',roughness:.72,metalness:.12,emissive:'#859aab',emissiveIntensity:.12,transparent:true,depthWrite:false}));
 if(circle)backing.geometry.rotateX(Math.PI/2);
 backing.position.z=-.038;group.add(backing);let physical=true;
 return {group,mesh,key,projection(){physical=false;backing.visible=false;},show(alpha:number){const texture=cache.get(key);if(material.map!==texture){material.map=texture??null;material.needsUpdate=true;}group.visible=alpha>.001&&Boolean(texture);material.opacity=alpha;backing.visible=physical;backing.scale.set(mesh.scale.x+.025,mesh.scale.y+.025,1);backing.material.opacity=alpha;},clear(){material.map=null;material.needsUpdate=true;group.visible=false;}};
}
/** Feather a geographic projection into its procedural surroundings. */
export function featherSurface(surface:ReturnType<typeof createAssetSurface>){
 surface.projection();
 surface.mesh.material.onBeforeCompile=shader=>{
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   vec2 edgeUV=abs(vMapUv-0.5)*2.0;
   float edge=1.0-smoothstep(0.64,1.0,max(edgeUV.x,edgeUV.y));
   diffuseColor.a*=edge;
   if(diffuseColor.a<0.01)discard;`);
 };surface.mesh.material.customProgramCacheKey=()=> 'feathered-geographic-projection';
}
export type AssetSurface=ReturnType<typeof createAssetSurface>;
