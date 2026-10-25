import {chromium} from '@playwright/test';
import {writeFile,mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge'}),report=[];
for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:320,height:568}]){
 const page=await browser.newPage({viewport});await page.goto('http://127.0.0.1:5173/?debug');await page.waitForSelector('.opening[data-ready=true]');
 for(const [name,p]of [['identity',.15],['tracking',.29],['sos',.38],['storefront',.599],['checkout',.713],['backend',.807],['admin',.877],['resolve',.947]]){
  await page.evaluate(p=>scrollTo(0,innerHeight*((innerWidth<=700?16.4:19.4)+(innerWidth<=700?18:22)*p)),p);await page.waitForTimeout(1200);await page.waitForFunction(()=>JSON.parse(document.querySelector("[data-cinematic-world]").dataset.debug).pendingTextures===0);await page.waitForTimeout(150);await page.screenshot({path:`artifacts/phase4b1/${viewport.width}-${name}.png`});report.push({viewport,name,p,state:JSON.parse(await page.locator('[data-cinematic-world]').getAttribute('data-debug'))});
 }
 await page.close();
}
await browser.close();await writeFile('artifacts/phase4b1/framing.json',JSON.stringify(report,null,2));
console.log(report.map(r=>({width:r.viewport.width,name:r.name,bounds:r.state.surfaceBounds})));
