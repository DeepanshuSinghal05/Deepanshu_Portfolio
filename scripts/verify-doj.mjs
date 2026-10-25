import {chromium} from '@playwright/test';
import {writeFile,mkdir} from 'node:fs/promises';
await mkdir('artifacts/doj',{recursive:true});const browser=await chromium.launch({channel:'msedge'}),report=[];
for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
 const page=await browser.newPage({viewport}),errors=[],media=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('request',r=>{if(r.url().includes('/worlds/'))media.push(r.url())});
 await page.goto('http://127.0.0.1:4173/?debug');await page.waitForSelector('.opening[data-ready=true][data-webgl-ready=true]');const initialMedia=[...media];
 const timing=await page.evaluate(async()=>{const samples=[];let previous=0;for(let i=0;i<=600;i++){scrollTo(0,innerHeight*((innerWidth<=700?16.4:19.4)+(innerWidth<=700?18:22)*1.64*i/600));const now=await new Promise(requestAnimationFrame);if(previous)samples.push(now-previous);previous=now;}samples.sort((a,b)=>a-b);return{median:samples[Math.floor(samples.length*.5)],p95:samples[Math.floor(samples.length*.95)]};});
 const production=await page.evaluate(()=>({progress:document.querySelector('.opening').dataset.projectProgress,canvases:document.querySelectorAll('canvas').length,video:document.querySelectorAll('video').length,debug:document.querySelector('[data-cinematic-world]').dataset.debug??null,overflow:document.documentElement.scrollWidth>innerWidth}));
 await page.goto('http://127.0.0.1:5173/?debug');await page.waitForSelector('.opening[data-ready=true][data-webgl-ready=true]');
 const sweep=await page.evaluate(async()=>{const states=[];const start=innerWidth<=700?16.4:19.4,length=innerWidth<=700?18:22;const tick=()=>new Promise(requestAnimationFrame);const seek=async p=>{scrollTo(0,innerHeight*(start+length*p));await tick();await tick();const raw=document.querySelector('[data-cinematic-world]').dataset.debug;if(raw)states.push(JSON.parse(raw));};
  for(let i=0;i<=240;i++)await seek(1.64*i/240);
  for(let i=120;i>=0;i--)await seek(1+.64*i/120);
  for(let i=0;i<=100;i++)await seek(1+.64*(.41+.18*i/100));
  for(const p of [1.63,.15,1.38,.71,1.52,.3,1.17,.945,1.02,1.61,.79,1.49,1.29,1.64])await seek(p);
  return states;});
 const finals=sweep.at(-1),summary={maxCalls:Math.max(...sweep.map(s=>s.calls??0)),maxTriangles:Math.max(...sweep.map(s=>s.triangles??0)),maxProjectTextures:Math.max(...sweep.map(s=>s.activeTextureCount??0)),dojMaxCalls:Math.max(...sweep.filter(s=>s.phase4BProgress>1.1).map(s=>s.calls)),dojMaxTriangles:Math.max(...sweep.filter(s=>s.phase4BProgress>1.1).map(s=>s.triangles)),finite:sweep.every(s=>s.camera.every(Number.isFinite)&&s.avatar.every(Number.isFinite)),finalOrigin:finals.project04Origin,finalDirection:finals.project04Direction,finalCamera:finals.project04CameraStart,finalAvatar:finals.project04AvatarStart};
 report.push({viewport,timing,initialMedia,production,summary,errors,media:[...new Set(media)]});if(errors.length||initialMedia.length||production.progress!=='1.64000'||production.canvases!==1||production.video||production.debug||production.overflow||!summary.finite)process.exitCode=1;
 await page.close();
}
await browser.close();await writeFile('artifacts/doj/performance.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report.map(({media,...r})=>r),null,2));
