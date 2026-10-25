import {test,expect,type Page} from '@playwright/test';
async function load(page:Page){await page.goto('/?debug');await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');await expect(page.locator('.opening')).toHaveAttribute('data-webgl-ready','true');}
async function seek(page:Page,p:number){await page.evaluate(p=>{const r=matchMedia('(prefers-reduced-motion: reduce)').matches,m=innerWidth<=700;scrollTo(0,innerHeight*((r?8.4:m?16.4:19.4)+(r?12:m?18:22)*p));},p);await expect.poll(async()=>Number(await page.locator('.opening').getAttribute('data-project-progress'))).toBeCloseTo(p,3);await page.evaluate(()=>new Promise(requestAnimationFrame));}
async function state(page:Page){return JSON.parse((await page.locator('[data-cinematic-world]').getAttribute('data-debug'))!);}

test('direct Phase 3 handoff retains the approved root and camera; old interlude is absent',async({page})=>{
 await load(page);await seek(page,0);const a=await state(page);await seek(page,.02);const b=await state(page);
 for(const k of ['avatar','rotation','camera','target','fov'])expect(b[k]).toEqual(a[k]);
 expect(a.avatar).toEqual([0,-45,-48]);await expect(page.locator('[data-work-overlay]')).toHaveCount(0);await expect(page.locator('.project-mast,.project-flow,.project-evidence')).toHaveCount(0);
 await seek(page,.15);expect((await state(page)).storyBeat).toBe('identity');await expect(page.locator('canvas')).toHaveCount(1);
});

test('world-specific evidence and conceptual signals follow the narrative',async({page})=>{
 await load(page);
 for(const [p,world,beat,asset]of [[.15,'yatralok','identity','yatralok/identity'],[.29,'yatralok','tracking','yatralok/route-concept'],[.38,'yatralok','sos','yatralok/sos'],[.58,'prisha-enterprises','storefront','prisha/storefront'],[.646,'prisha-enterprises','catalogue','prisha/product'],[.707,'prisha-enterprises','checkout','prisha/checkout'],[.79,'prisha-enterprises','backend','prisha/payment'],[.877,'prisha-enterprises','operations','prisha/distribution']] as const){
  await seek(page,p);await expect.poll(async()=>(await state(page)).activeUISurfaces).toContain(asset);const s=await state(page);expect(s.activeProject).toBe(world);expect(s.storyBeat).toBe(beat);expect(s.avatar[1]).toBe(-45);
 }
 await seek(page,.38);expect((await state(page)).sosPulseVisible).toBe(true);await expect(page.locator('[data-project-note]')).toContainText('conceptual');
 await seek(page,.754);expect((await state(page)).verificationPulse).toBeGreaterThan(0);await expect(page.locator('[data-project-note]')).toContainText('not a recorded payment');
 await seek(page,.995);expect((await state(page)).avatarState).toBe('IDLE');await expect(page.locator('.project-handoff')).toContainText('DOJ Chatbot');
});

test('reverse, large jumps and repeated world crossings reconstruct exact spatial state',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await load(page);const samples=new Map();
 const keys=['avatar','rotation','camera','target','fov','networkMorph','transactionProgress','transactionPosition','routeProgress','sosProgress','trackedLocation','yatraLighting','prishaLighting','backendLayers'];
 for(const p of [.15,.29,.38,.49,.52,.58,.646,.707,.754,.79,.845,.944,1]){await seek(page,p);samples.set(p,await state(page));}
 for(const p of [.29,.944,.15,.845,.52,.754,.38,.58,.646,.79,.707,.49,1]){await seek(page,p);const s=await state(page);for(const key of keys)expect(s[key]).toEqual(samples.get(p)[key]);await expect.poll(async()=>(await state(page)).pendingTextures).toBe(0);expect((await state(page)).failedTextures).toEqual([]);}
 await seek(page,0);await expect(page.locator('[data-project-overlay]')).toHaveCSS('opacity','0');await expect(page.locator('[data-story-handoff]')).toBeVisible();expect(errors).toEqual([]);
});

test('asset namespaces load lazily, prefetch only the next world, and release on exit',async({page})=>{
 const requests:string[]=[];page.on('request',r=>{if(r.url().includes('/worlds/'))requests.push(r.url());});await load(page);expect(requests).toEqual([]);
 await page.evaluate(()=>scrollTo(0,innerHeight*(11.2+8.2*.93)));await expect.poll(()=>requests.filter(u=>u.includes('/yatralok/')).length).toBe(8);expect(requests.some(u=>u.includes('/prisha/'))).toBe(false);
 await seek(page,.44);await expect.poll(()=>requests.filter(u=>u.includes('/prisha/')).length).toBe(11);expect((await state(page)).activeTextureCount).toBeLessThanOrEqual(19);
 await seek(page,.80);await expect.poll(async()=>(await state(page)).loadedTextures.every((s:string)=>s.startsWith('prisha/'))).toBe(true);
 await seek(page,.15);await expect.poll(async()=>(await state(page)).loadedTextures.length).toBe(8);expect((await state(page)).loadedTextures.every((s:string)=>s.startsWith('yatralok/'))).toBe(true);
 expect(requests.some(u=>/doj|holo|mp4/.test(u))).toBe(false);await expect(page.locator('video')).toHaveCount(0);
});

test('transaction remains one physical signal through checkout, verification and operations; links wait for resolution',async({page})=>{
 await load(page);const tokenPositions=[];let signalId:number|undefined;for(const p of [.65,.69,.754,.79,.877]){await seek(page,p);const s=await state(page);expect(s.transactionSignalVisible).toBe(true);signalId??=s.transactionSignalId;expect(s.transactionSignalId).toBe(signalId);tokenPositions.push(s.transactionPosition);await expect(page.getByRole('link',{name:'Visit live project'})).not.toBeVisible();}
 for(let i=1;i<tokenPositions.length;i++)expect(tokenPositions[i][2]).toBeLessThan(tokenPositions[i-1][2]);
 await seek(page,.944);const live=page.getByRole('link',{name:'Visit live project'});await expect(live).toHaveAttribute('href','https://prishaent.in');await expect(live).toBeVisible();await live.focus();await expect(live).toBeFocused();await expect(page.getByRole('link',{name:'View source'})).toHaveAttribute('href','https://github.com/DeepanshuSinghal05/Prisha_Enterprises');
});

for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:320,height:568},{width:844,height:390}])test(`responsive worlds remain usable ${viewport.width}x${viewport.height}`,async({page})=>{
 await page.setViewportSize(viewport);await load(page);for(const p of [.15,.29,.38,.58,.646,.707,.79,.845,.944]){
  await seek(page,p);await expect.poll(async()=>(await state(page)).activeUISurfaces.length).toBeGreaterThan(0);await expect.poll(async()=>(await state(page)).pendingTextures).toBe(0);const s=await state(page);expect(s.failedTextures).toEqual([]);expect(s.camera.every(Number.isFinite)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const copy=page.locator(p===.58?'.project-title-block':'[data-project-semantic]');const b=await copy.boundingBox();expect(b!.x).toBeGreaterThanOrEqual(0);expect(b!.x+b!.width).toBeLessThanOrEqual(viewport.width);expect(b!.y+b!.height).toBeLessThan(viewport.height);
 }
});

test('refresh and breakpoint reconstruction retain progress; reduced motion keeps sequential content',async({page})=>{
 await load(page);await seek(page,.845);await page.reload();await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');await expect.poll(async()=>Number(await page.locator('.opening').getAttribute('data-project-progress'))).toBeCloseTo(.845,3);
 await page.setViewportSize({width:390,height:844});await expect.poll(async()=>Number(await page.locator('.opening').getAttribute('data-project-progress'))).toBeCloseTo(.845,3);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('canvas')).toHaveCount(0);
 for(const p of [.15,.29,.38,.58,.707,.79,.845]){await seek(page,p);await expect(page.locator('[data-project-poster]')).toBeVisible();await expect.poll(()=>page.locator('[data-project-poster]').evaluate(e=>(e as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);}
 await seek(page,.944);await expect(page.getByRole('link',{name:'Visit live project'})).toBeVisible();await expect(page.getByRole('region',{name:'Project story transcript'})).toContainText('signature verification');
});

test('context loss preserves readable project evidence and final replay',async({page})=>{
 await load(page);await seek(page,.845);await page.locator('canvas').evaluate(c=>(c as HTMLCanvasElement).getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext());await expect(page.locator('.opening')).toHaveAttribute('data-webgl-ready','false');await expect(page.locator('[data-project-poster]')).toBeVisible();await expect.poll(()=>page.locator('[data-project-poster]').evaluate(e=>(e as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 await seek(page,2.72);await page.locator('.cinematic-replay').click();await expect.poll(()=>page.evaluate(()=>scrollY)).toBeLessThan(2);
});

test('camera and orientation have no discontinuities; read holds do not animate in time',async({page})=>{
 await load(page);await seek(page,.15);const states=await page.evaluate(async()=>{const {createProjectTrajectory}=await import('/src/projects/ProjectTrajectory.ts');const t=createProjectTrajectory(false);return Array.from({length:1001},(_,i)=>{const s=t.sample(i/1000);return {camera:s.camera.toArray(),avatar:s.position.toArray(),rotation:s.rotation};});});
 const distance=(a:number[],b:number[])=>Math.hypot(...a.map((v,i)=>v-b[i]));for(let i=1;i<states.length;i++){expect(distance(states[i].camera,states[i-1].camera)).toBeLessThan(1.8);expect(distance(states[i].avatar,states[i-1].avatar)).toBeLessThan(.6);expect(Math.abs(states[i].rotation-states[i-1].rotation)).toBeLessThan(.3);}
 await seek(page,.707);const a=await state(page);await page.waitForTimeout(250);const b=await state(page);for(const key of ['camera','avatar','productPosition','transactionProgress'])expect(b[key]).toEqual(a[key]);
});


test('review URLs target the requested project while a normal visit keeps the original opening',async({page})=>{
 await page.goto('/?project=prisha-enterprises&debug');await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');await expect.poll(async()=>Number(await page.locator('.opening').getAttribute('data-project-progress'))).toBeCloseTo(.59,3);await expect(page.locator('[data-project-title]')).toHaveText('Prisha Enterprises');
 await page.goto('/');await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');await expect(page.locator('.opening')).toHaveAttribute('data-project-progress','0.00000');
});
for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:320,height:568}])test(`essential evidence fits the camera ${viewport.width}`,async({page})=>{
 await page.setViewportSize(viewport);await load(page);
 for(const [p,key]of [[.15,'yatralok/identity'],[.707,'prisha/checkout'],[.877,'prisha/distribution']] as const){await seek(page,p);await expect.poll(async()=>(await state(page)).surfaceBounds[key]).toBeDefined();const b=(await state(page)).surfaceBounds[key];expect(b.left).toBeGreaterThan(-1);expect(b.right).toBeLessThan(1);expect(b.bottom).toBeGreaterThan(-1);expect(b.top).toBeLessThan(1);}
});

test('tracked location becomes emergency location and backend reveals in sequence',async({page})=>{
 await load(page);await seek(page,.29);const tracking=await state(page);await seek(page,.38);const sos=await state(page);expect(sos.trackedLocationId).toBe(tracking.trackedLocationId);expect(sos.trackedLocation).toEqual(sos.emergencyLocation);
 await seek(page,.79);const api=await state(page);expect(api.backendLayers[0]).toBe(1);expect(api.backendLayers[2]).toBe(0);expect(api.adminRevealProgress).toBe(0);
 await seek(page,.827);const data=await state(page);expect(data.backendLayers[1]).toBe(1);expect(data.adminRevealProgress).toBe(0);await seek(page,.877);expect((await state(page)).adminRevealProgress).toBe(1);
});

