import {chromium} from '@playwright/test';
import {writeFile,mkdir} from 'node:fs/promises';
await mkdir('artifacts/doj',{recursive:true});const browser=await chromium.launch({channel:'msedge'}),report=[];
for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:320,height:568},{width:844,height:390}]){
 const page=await browser.newPage({viewport}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:5173/?debug');await page.waitForSelector('.opening[data-ready=true]');
 for(const [name,q]of [['entry',.085],['homepage',.165],['question',.28],['embedding',.375],['knowledge',.45],['retrieval',.55],['context',.625],['model',.715],['return',.79],['response',.88],['resolution',.96],['handoff',1]]){
  await page.evaluate(q=>scrollTo(0,innerHeight*((innerWidth<=700?16.4:19.4)+(innerWidth<=700?18:22)*(1+.64*q))),q);await page.waitForTimeout(1000);await page.waitForFunction(()=>JSON.parse(document.querySelector('[data-cinematic-world]').dataset.debug).pendingTextures===0);await page.waitForTimeout(100);await page.screenshot({path:`artifacts/doj/${viewport.width}-${name}.png`});report.push({viewport,name,q,errors:[...errors],state:JSON.parse(await page.locator('[data-cinematic-world]').getAttribute('data-debug'))});
 }
 await page.close();
}
await browser.close();await writeFile('artifacts/doj/framing.json',JSON.stringify(report,null,2));console.log(report.map(r=>({width:r.viewport.width,name:r.name,progress:r.state.dojProgress,assets:r.state.activeUISurfaces,errors:r.errors})));
