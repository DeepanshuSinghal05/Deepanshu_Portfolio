import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const dir='artifacts/final-content';await mkdir(dir,{recursive:true});const browser=await chromium.launch({channel:'msedge'});const results=[];
for(const [width,height] of [[1440,900],[390,844],[320,568],[768,1024],[844,390]]){
 const page=await browser.newPage({viewport:{width,height}});await page.goto('http://127.0.0.1:5173/?debug');await page.waitForSelector('.opening[data-ready="true"]');
 for(const [name,q] of [['colorbar',.45],['acmegrade',.7],['work',-1],['contact',-2]]){
  await page.evaluate(q=>{const root=document.querySelector('.opening');scrollTo(0,q===-2?Number(root.dataset.contactStart)+Number(root.dataset.contactDistance):q===-1?Number(root.dataset.workStart):innerHeight*((innerWidth<=700?65.36:79.24)+(innerWidth<=700?6:7)*q));},q);await page.waitForTimeout(350);await page.screenshot({path:`${dir}/${width}-${name}.png`});
  results.push({width,name,scroll:await page.evaluate(()=>scrollY),state:JSON.parse(await page.locator('[data-cinematic-world]').getAttribute('data-debug')||'{}')});
 }await page.close();
}await browser.close();await writeFile(`${dir}/states.json`,JSON.stringify(results,null,2));
