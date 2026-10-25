import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto('http://127.0.0.1:5173/?debug');await page.waitForSelector('.opening[data-ready="true"]');
const states=await page.evaluate(async()=>{const states=[];for(let i=0;i<=240;i++){scrollTo(0,innerHeight*(19.4+22*i/240));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);const s=JSON.parse(document.querySelector('[data-cinematic-world]').dataset.debug);states.push(s);}return states;});
const dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const steps=states.slice(1).map((s,i)=>({p:s.phase4BProgress,previous:states[i].phase4BProgress,camera:dist(s.camera,states[i].camera),avatar:dist(s.avatar,states[i].avatar)})).sort((a,b)=>b.camera-a.camera);
const summary={maxCalls:Math.max(...states.map(s=>s.calls)),maxTriangles:Math.max(...states.map(s=>s.triangles)),maxTextures:Math.max(...states.map(s=>s.activeTextureCount??0)),largestSteps:steps.slice(0,8)};
console.log(JSON.stringify(summary));await writeFile('artifacts/worlds/profile.json',JSON.stringify({summary,states},null,2));await browser.close();
