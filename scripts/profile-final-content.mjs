import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge'}),results=[];
try{for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
 const page=await browser.newPage({viewport}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__glDraws=0;for(const key of ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced']){const original=WebGL2RenderingContext.prototype[key];WebGL2RenderingContext.prototype[key]=function(...args){window.__glDraws++;return original.apply(this,args);};}});
 await page.goto('http://127.0.0.1:4173/?section=work');await page.waitForSelector('.opening[data-ready="true"][data-webgl-ready="true"]');
 for(const mode of ['work','contact']){
  if(mode==='contact')await page.evaluate(()=>window.dispatchEvent(new CustomEvent('portfolio:navigate',{detail:{section:'contact'}})));
  await page.waitForTimeout(350);const before=await page.evaluate(()=>window.__glDraws);
  const sample=await page.evaluate(()=>new Promise(resolve=>{const intervals=[];let previous=performance.now(),started=previous;const tick=now=>{intervals.push(now-previous);previous=now;if(now-started<1200)requestAnimationFrame(tick);else{intervals.sort((a,b)=>a-b);resolve({medianFrameMs:intervals[Math.floor(intervals.length*.5)],p95FrameMs:intervals[Math.floor(intervals.length*.95)],heapBytes:performance.memory?.usedJSHeapSize,images:[...document.querySelectorAll('.selected-work img')].filter(i=>i.complete&&i.naturalWidth>0).length});}};requestAnimationFrame(tick);}));
  const after=await page.evaluate(()=>window.__glDraws);results.push({viewport,mode,...sample,idleWebGLDrawDelta:after-before,canvasCount:await page.locator('canvas').count(),errors});
 }await page.close();
}}finally{await browser.close();}await writeFile('artifacts/final-content/performance.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
