const {chromium}=require('@playwright/test'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true}),states=[];
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport});page.on('pageerror',e=>console.log(e.message));
  await page.goto('http://127.0.0.1:5173/?debug');await page.waitForSelector('[data-ready="true"]');await page.waitForSelector('[data-webgl-ready="true"]');
  for(const p of [0,.14,.22,.31,.44,.57,.70,.83,1]){
   await page.evaluate(p=>scrollTo(0,innerHeight*((innerWidth<=700?9.2:11.2)+(innerWidth<=700?7.2:8.2)*p)),p);
   await page.waitForTimeout(150);
   await page.screenshot({path:`artifacts/screenshots/story-${viewport.width}-${p}.png`});
   states.push({width:viewport.width,p,state:JSON.parse(await page.locator('[data-cinematic-world]').getAttribute('data-debug'))});
  }await page.close();
 }fs.writeFileSync('artifacts/story-states.json',JSON.stringify(states,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
