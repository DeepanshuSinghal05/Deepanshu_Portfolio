import { chromium } from '@playwright/test';
import { writeFile,mkdir } from 'node:fs/promises';
await mkdir('artifacts/worlds',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true}),report=[];
for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
 const page=await browser.newPage({viewport}),errors=[],warnings=[],media=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});page.on('request',r=>{if(new URL(r.url()).pathname.startsWith('/worlds/'))media.push(r.url());});page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.goto('http://127.0.0.1:4173/?debug');await page.waitForSelector('[data-ready="true"]');await page.waitForSelector('[data-webgl-ready="true"]');const initialMedia=[...media];
 const frames=await page.evaluate(async()=>{const frames=[];let previous;for(let i=0;i<=480;i++){scrollTo(0,innerHeight*((innerWidth<=700?16.4:19.4)+(innerWidth<=700?18:22)*i/480));const now=await new Promise(requestAnimationFrame);if(previous)frames.push(now-previous);previous=now;}frames.sort((a,b)=>a-b);return{median:frames[Math.floor(frames.length*.5)],p95:frames[Math.floor(frames.length*.95)]};});
 await page.waitForTimeout(150);const state=await page.evaluate(()=>({progress:Number(document.querySelector('.opening').dataset.projectProgress),canvasCount:document.querySelectorAll('canvas').length,decoderCount:document.querySelectorAll('video').length,worldDebug:document.querySelector('[data-cinematic-world]').dataset.debug??null,projectDebug:document.querySelector('.opening').dataset.projectDebug??null,overflow:document.documentElement.scrollWidth>innerWidth}));
 await page.screenshot({path:`artifacts/worlds/production-${viewport.width}.png`});report.push({viewport,frames,initialMedia,...state,requestedProjectAssets:[...new Set(media)],errors,warnings});
 if(errors.length||initialMedia.length||state.progress!==1||state.canvasCount!==1||state.decoderCount!==0||state.worldDebug||state.projectDebug||state.overflow)process.exitCode=1;await page.close();
}
await browser.close();await writeFile('artifacts/worlds/production.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
