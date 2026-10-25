import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('artifacts/holo/captures',{recursive:true});
const browser=await chromium.launch({channel:'msedge'}),report=[];
for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
 const page=await browser.newPage({viewport}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:5173/?debug');await page.waitForSelector('.opening[data-ready=true][data-webgl-ready=true]');
 for(const [name,q]of [['handoff',-.008],['sensor',.075],['normal',.16],['pinch',.266],['drag',.31],['throw',.37],['stretch',.45],['separation',.505],['recombine',.57],['note',.61],['reader',.67],['summary',.715],['space',.765],['reset',.805],['jarvis',.866],['technical',.915],['resolution',.945],['final',1]]){
  await page.evaluate(q=>scrollTo(0,innerHeight*((innerWidth<=700?16.4:19.4)+(innerWidth<=700?18:22)*(1.64+1.08*q))),q);await page.waitForTimeout(500);await page.screenshot({path:`artifacts/holo/captures/${viewport.width}-${name}.png`});
  const state=JSON.parse(await page.locator('[data-cinematic-world]').getAttribute('data-debug'));report.push({viewport,name,q,state,errors});
 }
 await page.close();
}
await browser.close();await writeFile('artifacts/holo/framing.json',JSON.stringify(report,null,2));console.log(report.map(r=>({viewport:r.viewport.width,name:r.name,bounds:r.state.surfaceBounds,errors:r.errors})));


