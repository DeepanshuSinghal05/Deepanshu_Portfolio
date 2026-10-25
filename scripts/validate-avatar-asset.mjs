import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from '@playwright/test';

const source='project_story_assets/new_model.glb',dir='artifacts/final-animated';
const bytes=await readFile(source);
if(bytes.toString('utf8',0,4)!=='glTF'||bytes.readUInt32LE(4)!==2||bytes.readUInt32LE(8)!==bytes.length)throw new Error('Invalid GLB 2 header');
const jsonLength=bytes.readUInt32LE(12),gltf=JSON.parse(bytes.toString('utf8',20,20+jsonLength));
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'msedge'}),issues=[];
try{
 const page=await browser.newPage({viewport:{width:1000,height:1000}});
 page.on('pageerror',e=>issues.push({type:'runtime',text:e.message}));
 page.on('console',e=>{if(['error','warning'].includes(e.type()))issues.push({type:e.type(),text:e.text()});});
 page.on('response',r=>{if(r.status()>=400)issues.push({type:'http',url:r.url(),status:r.status()});});
 await page.goto('http://127.0.0.1:5173/scripts/inspect-avatar.html');await page.waitForFunction(()=>document.body.dataset.ready,{timeout:60000});
 const audit=await page.evaluate(()=>window.audit);
 if(audit.error)throw new Error(audit.error);
 for(const [name,angle] of [['front',0],['side',Math.PI/2],['back',Math.PI]]){await page.evaluate(a=>window.view(a),angle);await page.screenshot({path:`${dir}/model-${name}.png`});}
 const result={source,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,skins:gltf.skins?.length||0,animations:gltf.animations?.length||0,audit,issues};
 await writeFile(`${dir}/browser-validation.json`,JSON.stringify(result,null,2));
 const eligible=result.skins>0&&audit.meshes.some(m=>m.skinned&&m.hasJoints&&m.hasWeights)&&result.animations===4;
 console.log(JSON.stringify({staticRender:'PASS',animatedIntegration:eligible?'FOUR_CLIPS_LOADED_SEE_ANIMATION_TESTS':'BLOCKED',skins:result.skins,clips:result.animations,triangles:audit.render.triangles,issues},null,2));
}finally{await browser.close();}
