import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const dir='artifacts/targeted-fixes';await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'msedge'}),results=[],issues=[];
try{for(const [width,height] of [[1920,1080],[1440,900],[1366,768],[1280,720],[768,1024],[390,844],[375,667],[320,568]]){
 const page=await browser.newPage({viewport:{width,height}});
 page.on('pageerror',e=>issues.push({width,type:'runtime',text:e.message}));
 page.on('console',e=>{if(['error','warning'].includes(e.type()))issues.push({width,type:e.type(),text:e.text()});});
 page.on('response',r=>{if(r.status()>=400)issues.push({width,type:'http',url:r.url(),status:r.status()});});
 await page.goto('http://127.0.0.1:5173/');await page.waitForSelector('.opening[data-ready="true"][data-webgl-ready="true"]');
 await page.screenshot({path:`${dir}/hero-${width}.png`});await page.waitForTimeout(1500);await page.screenshot({path:`${dir}/hero-float-${width}.png`});
 await page.locator('.contact-link').click();await page.waitForSelector('.opening[data-navigating="false"]');await page.screenshot({path:`${dir}/contact-${width}.png`});
 results.push({width,height,...await page.evaluate(()=>{const content=document.querySelector('.contact-composition').getBoundingClientRect(),footer=document.querySelector('.contact-footer').getBoundingClientRect();return {content:content.toJSON(),footer:footer.toJSON(),gap:footer.top-content.bottom,links:[...document.querySelectorAll('.contact-actions a')].map(e=>{const r=e.getBoundingClientRect();return {text:e.textContent,rect:r.toJSON(),hit:e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))};})};})});
 await page.close();
}}finally{await browser.close();}
await writeFile(`${dir}/after.json`,JSON.stringify(results,null,2));await writeFile(`${dir}/console.json`,JSON.stringify(issues,null,2));console.log(JSON.stringify({viewports:results.length,gaps:results.map(r=>[r.width,r.gap]),issues:issues.map(e=>({...e,text:e.text?.slice(0,180)}))},null,2));
