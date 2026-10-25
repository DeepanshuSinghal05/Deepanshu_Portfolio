const {chromium}=require('@playwright/test'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true}),report=[];
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const context=await browser.newContext({viewport,recordVideo:{dir:'artifacts/review',size:viewport}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173/?debug');await page.waitForSelector('[data-ready="true"]');await page.waitForSelector('[data-webgl-ready="true"]');
  await page.evaluate(async()=>{const total=innerHeight*(innerWidth<=700?16.4:19.4);for(let i=0;i<=1200;i++){scrollTo(0,total*i/1200);await new Promise(requestAnimationFrame);}});
  await page.waitForTimeout(150);const final=JSON.parse(await page.locator('[data-cinematic-world]').getAttribute('data-debug'));
  await page.evaluate(async()=>{const total=innerHeight*(innerWidth<=700?16.4:19.4);for(let i=720;i>=0;i--){scrollTo(0,total*i/720);await new Promise(requestAnimationFrame);}});
  report.push({viewport,final,errors});const video=page.video();await context.close();await video.saveAs(`artifacts/review/phase1-through-story-${viewport.width}.webm`);
  console.log(JSON.stringify({viewport,errors,finalAvatar:final.avatar,finalCamera:final.camera,calls:final.calls,triangles:final.triangles}));
 }
 fs.writeFileSync('artifacts/story-review.json',JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
