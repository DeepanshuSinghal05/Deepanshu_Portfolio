import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge'}),report=[];
for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:320,height:568}]){
 const page=await browser.newPage({viewport});await page.goto('http://127.0.0.1:5173/?debug');await page.waitForSelector('.opening[data-ready=true]');
 for(const [name,p]of [['identity',.15],['checkout',.707],['portal',.79],['operations',.845]]){
  await page.evaluate(p=>scrollTo(0,innerHeight*((innerWidth<=700?16.4:19.4)+(innerWidth<=700?18:22)*p)),p);await page.waitForTimeout(800);await page.screenshot({path:`artifacts/worlds/final-${viewport.width}-${name}.png`});report.push({viewport,name,p,state:JSON.parse(await page.locator('[data-cinematic-world]').getAttribute('data-debug'))});
 }
 if(viewport.width===1440){const poses=await page.evaluate(async()=>{const {createProjectTrajectory}=await import('/src/projects/ProjectTrajectory.ts');return [false,true].map(mobile=>({mobile,poses:[0,.08,.47,.56,.95,1].map(p=>{const s=createProjectTrajectory(mobile).sample(p);return {p,avatar:s.position.toArray(),rotation:s.rotation,camera:s.camera.toArray(),target:s.target.toArray(),fov:s.fov,state:s.state};})}));});await writeFile('artifacts/worlds/handoff-transforms.json',JSON.stringify(poses,null,2));}
 await page.close();
}
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await page.goto('http://127.0.0.1:5173/?debug');await page.waitForSelector('.opening[data-ready=true]');await page.evaluate(()=>scrollTo(0,innerHeight*(8.4+12*.845)));await page.waitForTimeout(800);await page.screenshot({path:'artifacts/worlds/final-reduced.png'});
await browser.close();await writeFile('artifacts/worlds/framing-audit.json',JSON.stringify(report,null,2));console.log(report.map(r=>({width:r.viewport.width,name:r.name,bounds:r.state.surfaceBounds})));
