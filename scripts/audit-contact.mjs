import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('artifacts/contact/captures',{recursive:true});const browser=await chromium.launch({channel:'msedge'}),states=[];
for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:320,height:568},{width:844,height:390}]){
 const page=await browser.newPage({viewport});await page.goto('http://127.0.0.1:5173/?debug&section=contact');await page.waitForSelector('.opening[data-ready="true"][data-webgl-ready="true"]');
 for(const [name,p]of [['inherited',.02],['opening',.32],['actions',.65],['final',1]]){
  await page.evaluate(p=>scrollTo(0,innerHeight*((innerWidth<=700?71.36:86.24)+(innerWidth<=700?3.4:3)*p)),p);await page.waitForTimeout(150);await page.screenshot({path:`artifacts/contact/captures/${viewport.width}-${name}.png`});states.push({width:viewport.width,name,...JSON.parse(await page.locator('[data-cinematic-world]').getAttribute('data-debug'))});
 }await page.close();
}
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await page.goto('http://127.0.0.1:5173/?section=contact');await page.waitForSelector('.opening[data-ready="true"][data-contact-settled="true"]');await page.screenshot({path:'artifacts/contact/captures/390-reduced.png'});await browser.close();await writeFile('artifacts/contact/captures.json',JSON.stringify(states,null,2));
