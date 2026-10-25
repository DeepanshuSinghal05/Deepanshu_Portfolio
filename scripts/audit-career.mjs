import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('artifacts/phase61/captures',{recursive:true});
const browser=await chromium.launch({channel:'msedge'}),results=[];
for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:320,height:568},{width:844,height:390}]){
 const page=await browser.newPage({viewport});await page.goto('http://127.0.0.1:5173/?debug');await page.waitForSelector('.opening[data-ready="true"][data-webgl-ready="true"]');
 for(const [name,q]of [['inherited',.001],['traces',.085],['finale',.16],['intro',.285],['colorbar',.45],['acmegrade',.7],['resolution',.925],['handoff',1]]){
  await page.evaluate(q=>scrollTo(0,innerHeight*((innerWidth<=700?65.36:79.24)+(innerWidth<=700?6:7)*q)),q);await page.waitForTimeout(200);
  await page.screenshot({path:`artifacts/phase61/captures/${viewport.width}-${name}.png`});
  results.push({width:viewport.width,name,...JSON.parse(await page.locator('[data-cinematic-world]').getAttribute('data-debug'))});
 }
 await page.close();
}
await browser.close();await writeFile('artifacts/phase61/captures.json',JSON.stringify(results,null,2));
