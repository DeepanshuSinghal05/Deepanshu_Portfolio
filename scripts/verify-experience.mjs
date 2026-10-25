import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('artifacts/experience',{recursive:true});
const browser=await chromium.launch({channel:'msedge'}),report=[];
for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
 const page=await browser.newPage({viewport}),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('request',r=>{if(r.url().includes('/worlds/'))requests.push(r.url());});
 await page.goto('http://127.0.0.1:4173/?section=experience');await page.waitForSelector('.opening[data-ready="true"][data-webgl-ready="true"]');
 const timing=await page.evaluate(async()=>{
  const samples=[],tick=()=>new Promise(requestAnimationFrame);let previous=0;const start=innerWidth<=700?65.36:79.24,length=innerWidth<=700?6:7;
  for(let i=0;i<=420;i++){scrollTo(0,innerHeight*(start+length*(.24+.76*i/420)));const now=await tick();if(previous)samples.push(now-previous);previous=now;}
  samples.sort((a,b)=>a-b);return{median:samples[Math.floor(samples.length*.5)],p95:samples[Math.floor(samples.length*.95)]};
 });
 const production=await page.evaluate(()=>({progress:document.querySelector('.opening').dataset.experienceProgress,canvases:document.querySelectorAll('canvas').length,debug:document.querySelector('[data-cinematic-world]').dataset.debug??null,overflow:document.documentElement.scrollWidth>innerWidth}));
 const directExperienceMedia=[...requests];
 await page.goto('http://127.0.0.1:5173/?debug');await page.waitForSelector('.opening[data-ready="true"][data-webgl-ready="true"]');
 const sweep=await page.evaluate(async()=>{
  const states=[],tick=()=>new Promise(requestAnimationFrame),start=innerWidth<=700?65.36:79.24,length=innerWidth<=700?6:7;
  const seek=async q=>{scrollTo(0,innerHeight*(start+length*q));await tick();await tick();states.push(JSON.parse(document.querySelector('[data-cinematic-world]').dataset.debug));};
  // Slow, normal, fast, reverse and abrupt crossings use the same scroll-derived state.
  for(let i=0;i<=360;i++)await seek(.001+.999*i/360);
  for(let i=120;i>=0;i--)await seek(.001+.999*i/120);
  for(let i=0;i<=18;i++)await seek(.001+.999*i/18);
  for(const q of [.7,.01,1,.45,.16,.925,.085,.29,.7,1])await seek(q);
  const settled=states.at(-1);for(let i=0;i<12;i++)await tick();const idle=JSON.parse(document.querySelector('[data-cinematic-world]').dataset.debug);
  return{states,idleUnchanged:idle.experienceRenders===settled.experienceRenders};
 });
 const experience=sweep.states.filter(s=>s.experienceProgress>=.24),summary={maxCalls:Math.max(...experience.map(s=>s.calls)),maxTriangles:Math.max(...experience.map(s=>s.triangles)),maxProjectTextures:Math.max(...experience.map(s=>s.activeTextureCount)),finite:sweep.states.every(s=>s.avatar.every(Number.isFinite)&&s.camera.every(Number.isFinite)),idleUnchanged:sweep.idleUnchanged,handoff:sweep.states.at(-1)};
 const {contactOrigin,contactDirection,contactCameraStart,contactAvatarStart,camera,target,rotation,scale}=summary.handoff;
 summary.handoff={contactOrigin,contactDirection,contactCameraStart,contactAvatarStart,camera,target,rotation,scale};
 report.push({viewport,timing,production,directExperienceMedia,summary,errors});
 if(errors.length||directExperienceMedia.length||production.progress!=='1.00000'||production.canvases!==1||production.debug||production.overflow||!summary.finite||!summary.idleUnchanged||summary.maxProjectTextures)process.exitCode=1;
 await page.close();
}
await browser.close();await writeFile('artifacts/experience/performance.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
