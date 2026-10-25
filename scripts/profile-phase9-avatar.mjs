import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge'}),results=[];
try{for(const viewport of [{width:1440,height:900},{width:390,height:844}])for(const mode of ['proxy','character']){
 const page=await browser.newPage({viewport});
 if(mode==='proxy')await page.route(/\.glb(?:\?|$)/,route=>route.abort());
 await page.addInitScript(()=>{window.__draws=0;for(const name of ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced']){const original=WebGL2RenderingContext.prototype[name];WebGL2RenderingContext.prototype[name]=function(...args){window.__draws++;return original.apply(this,args);};}});
 await page.goto('http://127.0.0.1:4173/?section=contact');await page.waitForSelector(`.opening[data-avatar-status="${mode==='proxy'?'fallback':'ready'}"]`);await page.waitForTimeout(150);
 const idleBefore=await page.evaluate(()=>window.__draws);await page.waitForTimeout(500);const idleAfter=await page.evaluate(()=>window.__draws);
 const result=await page.evaluate(()=>new Promise(resolve=>{
  const frames=[],started=performance.now();let previous=started;const m=innerWidth<=700;
  const tick=now=>{frames.push(now-previous);previous=now;const p=Math.min(1,(now-started)/2400);scrollTo(0,innerHeight*((m?9.2:11.2)+(m?7.2:8.2)*(.25+.55*p)));
   if(p<1)requestAnimationFrame(tick);else{frames.sort((a,b)=>a-b);resolve({samples:frames.length,medianFrameMs:frames[Math.floor(frames.length*.5)],p95FrameMs:frames[Math.floor(frames.length*.95)],framesOver50ms:frames.filter(t=>t>50).length,heapBytes:performance.memory?.usedJSHeapSize,modelRequests:performance.getEntriesByType('resource').filter(e=>e.name.includes('.glb')).map(e=>({durationMs:e.duration,transferBytes:e.transferSize,decodedBytes:e.decodedBodySize}))});}
  };requestAnimationFrame(tick);
 }));
 results.push({viewport,mode,idleDrawCalls:idleAfter-idleBefore,...result});await page.close();
}}finally{await browser.close();}
await writeFile('artifacts/phase9-rigged/performance.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
