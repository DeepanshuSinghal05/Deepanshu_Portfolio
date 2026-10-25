const {chromium}=require('@playwright/test');
const fs=require('node:fs');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const report=[];
  for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
    const context=await browser.newContext({viewport,recordVideo:{dir:'artifacts/review',size:viewport}});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:5173/?debug');
    await page.waitForSelector('[data-ready="true"]');
    await page.waitForSelector('[data-webgl-ready="true"]');
    const frames=await page.evaluate(async()=>{
      const total=innerHeight*(innerWidth<=700?9.2:11.2),samples=[];
      let before=performance.now();
      for(let i=0;i<=720;i++){
        scrollTo(0,total*i/720);
        const now=await new Promise(requestAnimationFrame);
        if(i>0)samples.push(now-before);
        before=now;
      }
      samples.sort((a,b)=>a-b);
      return {median:samples[360],p95:samples[684]};
    });
    await page.screenshot({path:`artifacts/screenshots/phase26-arrival-${viewport.width}.png`});
    const final=JSON.parse(await page.locator('[data-cinematic-world]').getAttribute('data-debug'));
    await page.evaluate(async()=>{
      const total=innerHeight*(innerWidth<=700?9.2:11.2);
      for(let i=480;i>=0;i--){scrollTo(0,total*i/480);await new Promise(requestAnimationFrame);}
    });
    for(const p of [.4,.53,.567,.588,.609,.635,.71,.8,.87,.92,1]){
      await page.evaluate(p=>scrollTo(0,innerHeight*((innerWidth<=700?2.7:3.2)+(innerWidth<=700?6.5:8)*p)),p);
      await page.waitForTimeout(100);
      await page.screenshot({path:`artifacts/screenshots/phase26-${viewport.width}-${p}.png`});
    }
    report.push({viewport,frames,errors,final});
    const video=page.video();
    await context.close();
    await video.saveAs(`artifacts/review/phase26-${viewport.width}.webm`);
    console.log(JSON.stringify({viewport,frames,errors}));
  }
  fs.writeFileSync('artifacts/phase26-review.json',JSON.stringify(report,null,2));
  await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1});
