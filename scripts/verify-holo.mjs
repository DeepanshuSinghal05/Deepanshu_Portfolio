import {chromium} from '@playwright/test';
import {writeFile,mkdir} from 'node:fs/promises';
await mkdir('artifacts/holo',{recursive:true});const browser=await chromium.launch({channel:'msedge'}),report=[];
for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
 const page=await browser.newPage({viewport}),errors=[],media=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('request',r=>{if(r.url().includes('/worlds/'))media.push(r.url())});
 await page.goto('http://127.0.0.1:4173/?debug');await page.waitForSelector('.opening[data-ready=true][data-webgl-ready=true]');const initialMedia=[...media];
 const timing=await page.evaluate(async()=>{const samples=[];let previous=0;for(let i=0;i<=720;i++){scrollTo(0,innerHeight*((innerWidth<=700?16.4:19.4)+(innerWidth<=700?18:22)*2.72*i/720));const now=await new Promise(requestAnimationFrame);if(previous)samples.push(now-previous);previous=now;}samples.sort((a,b)=>a-b);return{median:samples[Math.floor(samples.length*.5)],p95:samples[Math.floor(samples.length*.95)]};});
 const production=await page.evaluate(()=>({progress:document.querySelector('.opening').dataset.projectProgress,canvases:document.querySelectorAll('canvas').length,video:document.querySelectorAll('video,audio').length,debug:document.querySelector('[data-cinematic-world]').dataset.debug??null,overflow:document.documentElement.scrollWidth>innerWidth}));
 await page.goto('http://127.0.0.1:5173/?debug');await page.waitForSelector('.opening[data-ready=true][data-webgl-ready=true]');
 const sweep=await page.evaluate(async()=>{const states=[],start=innerWidth<=700?16.4:19.4,length=innerWidth<=700?18:22,tick=()=>new Promise(requestAnimationFrame);const seek=async p=>{scrollTo(0,innerHeight*(start+length*p));await tick();await tick();const raw=document.querySelector('[data-cinematic-world]').dataset.debug;if(raw)states.push(JSON.parse(raw));};
  for(let i=0;i<=260;i++)await seek(2.72*i/260);
  for(let i=180;i>=0;i--)await seek(1.64+1.08*i/180);
  for(let i=0;i<=100;i++)await seek(1.64+1.08*(.23+.32*i/100));
  for(const p of [2.71,.15,2.48,1.38,.71,1.52,2.02,1.17,.945,2.48,1.61,2.18,.79,2.71,1.49,1.29,2.72])await seek(p);
  return states;});
 const holo=sweep.filter(s=>s.phase4BProgress>1.7),summary={maxCalls:Math.max(...sweep.map(s=>s.calls??0)),maxTriangles:Math.max(...sweep.map(s=>s.triangles??0)),maxProjectTextures:Math.max(...sweep.map(s=>s.activeTextureCount??0)),holoMaxCalls:Math.max(...holo.map(s=>s.calls)),holoMaxTriangles:Math.max(...holo.map(s=>s.triangles)),holoMaxImageTextures:Math.max(...holo.map(s=>s.activeTextureCount)),finite:sweep.every(s=>s.camera.every(Number.isFinite)&&s.avatar.every(Number.isFinite)),handoff:sweep.at(-1).projectWorldsHandoff};
 report.push({viewport,timing,initialMedia,production,summary,errors,media:[...new Set(media)]});if(errors.length||initialMedia.length||production.progress!=='2.72000'||production.canvases!==1||production.video||production.debug||production.overflow||!summary.finite)process.exitCode=1;
 await page.close();
}
await browser.close();await writeFile('artifacts/holo/performance.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report.map(({media,...r})=>r),null,2));
