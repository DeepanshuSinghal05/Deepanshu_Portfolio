const {chromium}=require('@playwright/test'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true}),report=[];
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport}),errors=[],warnings=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});
  await page.goto('http://127.0.0.1:4173/?debug');await page.waitForSelector('[data-ready="true"]');await page.waitForSelector('[data-webgl-ready="true"]');
  const frames=await page.evaluate(async()=>{
   const samples=[];let previous=performance.now();
   for(let i=0;i<=360;i++){
    scrollTo(0,innerHeight*((innerWidth<=700?9.2:11.2)+(innerWidth<=700?7.2:8.2)*i/360));
    const now=await new Promise(requestAnimationFrame);if(i>0)samples.push(now-previous);previous=now;
   }
   samples.sort((a,b)=>a-b);return{median:samples[180],p95:samples[342]};
  });
  await page.waitForTimeout(100);await page.screenshot({path:`artifacts/screenshots/story-production-${viewport.width}.png`});
  const state=await page.evaluate(()=>({storyProgress:Number(document.querySelector('.opening').dataset.storyProgress),phase:document.querySelector('.opening').dataset.storyPhase,canvasCount:document.querySelectorAll('canvas').length,debug:document.querySelector('[data-cinematic-world]').dataset.debug??null,overflow:document.documentElement.scrollWidth>innerWidth}));
  if(errors.length||state.storyProgress!==1||state.canvasCount!==1||state.debug!==null||state.overflow)process.exitCode=1;
  report.push({viewport,frames,...state,errors,warnings});await page.close();
 }
 fs.writeFileSync('artifacts/story-production.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
