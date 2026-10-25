import { chromium } from '@playwright/test';
import { mkdir,writeFile } from 'node:fs/promises';
await mkdir('artifacts/worlds',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const results=[];
for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:320,height:568},{width:844,height:390}]){
 const page=await browser.newPage({viewport});page.on('pageerror',e=>console.error(e));await page.goto('http://127.0.0.1:5173/?debug');await page.waitForSelector('.opening[data-ready="true"]');
 for(const [name,p] of [['identity',.15],['tracking',.29],['sos',.38],['journey',.21],['tech-y',.45],['morph',.515],['storefront',.58],['checkout',.707],['payment',.754],['backend',.79],['admin',.845],['product',.646],['resolve',.944],['handoff',1]]){
   await page.evaluate(p=>scrollTo(0,innerHeight*((innerWidth<=700?16.4:19.4)+(innerWidth<=700?18:22)*p)),p);await page.waitForTimeout(1200);
   await page.screenshot({path:`artifacts/worlds/${viewport.width}-${name}.png`});
   results.push({viewport,name,state:JSON.parse(await page.locator('[data-cinematic-world]').getAttribute('data-debug'))});
 }
 await page.close();
}
await browser.close();await writeFile('artifacts/worlds/capture-state.json',JSON.stringify(results,null,2));
