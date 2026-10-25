import {test,expect,type Page} from '@playwright/test';
async function load(page:Page,url='/?debug'){
 await page.goto(url);await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');
 if(!await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches))await expect(page.locator('.opening')).toHaveAttribute('data-webgl-ready','true');
}
async function seek(page:Page,q:number){
 await page.evaluate(q=>{const r=matchMedia('(prefers-reduced-motion: reduce)').matches,m=innerWidth<=700;scrollTo(0,innerHeight*((r?41.04:m?65.36:79.24)+(r?4.2:m?6:7)*q));},q);
 await expect.poll(async()=>Number(await page.locator('.opening').getAttribute('data-experience-progress'))).toBeCloseTo(Math.max(0,q),3);
 if(!await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)&&await page.locator('.opening').getAttribute('data-webgl-ready')==='true')await expect(page.locator('.opening')).toHaveAttribute('data-avatar-status','ready');
 await page.evaluate(()=>new Promise(requestAnimationFrame));
}
async function state(page:Page){return JSON.parse(await page.locator('[data-cinematic-world]').getAttribute('data-debug')??'{}');}
test('finale inherits exact Holo pose and both trajectories remain continuous',async({page})=>{
 await load(page);const paths=await page.evaluate(async()=>{
  const {createExperienceTrajectory,projectWorldsExit}=await import('/src/experience/ExperienceTrajectory.ts');
  return [false,true].map(m=>{const t=createExperienceTrajectory(m),start=t.sample(0),h=projectWorldsExit(m);let last=start,maxCamera=0,maxAvatar=0;for(let i=1;i<=2000;i++){const next=t.sample(i/2000);maxCamera=Math.max(maxCamera,next.camera.distanceTo(last.camera));maxAvatar=Math.max(maxAvatar,next.position.distanceTo(last.position));last=next;}return {same:start.camera.equals(h.camera)&&start.target.equals(h.target)&&start.position.equals(h.position)&&start.rotation===h.rotation&&start.fov===h.fov,maxCamera,maxAvatar};});
 });for(const p of paths){expect(p.same).toBe(true);expect(p.maxCamera).toBeLessThan(.25);expect(p.maxAvatar).toBeLessThan(.16);}
 await seek(page,.04);const inherited=await state(page);expect(inherited.projectRemnantsVisible).toBe(true);expect(inherited.holoHand.visible).toBe(false);expect(inherited.holoSecondHand.visible).toBe(false);
 await seek(page,.085);const traces=await state(page);expect(traces.memoryTraceCount).toBe(4);expect(Math.max(...traces.memoryTraceOpacity)).toBeLessThan(.3);
 await seek(page,.2);const converged=await state(page);expect(converged.memoryTracePositions.every((p:number[])=>p[2]<converged.avatar[2])).toBe(true);
 await seek(page,.3);expect((await state(page)).memoryTraceCount).toBe(0);
});
test('only verified jobs appear in order with a single readable marker',async({page})=>{
 await load(page);await seek(page,.16);await expect(page.locator('[data-experience-finale]')).toBeVisible();
 await seek(page,.29);await expect(page.locator('[data-experience-intro]')).toContainText('Building beyondthe classroom.');
 await seek(page,.45);const colorbar=page.locator('[data-experience-marker="colorbar"]');await expect(colorbar).toBeVisible();await expect(colorbar).toContainText('Full-Stack & Backend Developer Intern');await expect(colorbar).toContainText('Sep 2025 — Oct 2025');await expect(colorbar).toContainText('live loyalty ERP');await expect(page.locator('[data-experience-marker="acmegrade"]')).toBeHidden();
 await seek(page,.7);const acmegrade=page.locator('[data-experience-marker="acmegrade"]');await expect(acmegrade).toBeVisible();await expect(acmegrade).toContainText('Web Developer Intern');await expect(acmegrade).toContainText('May 2025 — Jun 2025');await expect(colorbar).toBeHidden();
 await expect(page.locator('[data-experience-overlay] a,[data-experience-overlay] form')).toHaveCount(0);
 await seek(page,.925);await expect(page.locator('[data-experience-ending]')).toHaveText('Still building.');
 await seek(page,1);const end=await state(page);expect(end.avatar).toEqual(end.contactOrigin);expect(end.camera).toEqual(end.contactCameraStart.position);expect(end.target).toEqual(end.contactCameraStart.target);expect(end.avatarState).toBe('IDLE');expect(end.experienceArchitectureState).toBe('DORMANT');expect(end.contactDirection).toEqual([0,0,-1]);await expect(page.locator('.cinematic-replay')).toBeVisible();
});
test('reverse, fast jumps and rapid direction changes reconstruct the same scene',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await load(page);const points=[.01,.085,.16,.29,.45,.57,.7,.84,.925,1],saved=new Map();
 const keys=['camera','target','avatar','rotation','experienceWalk','memoryTracePositions','memoryTraceOpacity','experienceWarmth','projectRemnantsVisible','projectMediaReleased'];
 for(const q of points){await seek(page,q);saved.set(q,await state(page));}
 for(const q of [...points].reverse().concat([.7,.01,1,.16,.925,.085,.45])){await seek(page,q);const s=await state(page);for(const k of keys)expect(s[k],`${q}: ${k}`).toEqual(saved.get(q)[k]);}
 await seek(page,-.4);expect((await state(page)).environmentState).toBe('PROJECT_WORLD');expect((await state(page)).projectWorldActive).toBe(true);await seek(page,.7);expect((await state(page)).camera).toEqual(saved.get(.7).camera);expect(errors).toEqual([]);
});
test('project media releases, dormant worlds stop updating and moving experience holds its scrubbed pose',async({page})=>{
 await load(page);await seek(page,.085);await seek(page,.45);const a=await state(page);expect(a.activeTextureCount).toBe(0);expect(a.loadedTextures).toEqual([]);expect(a.projectMediaReleased).toBe(true);expect(a.projectWorldActive).toBe(false);expect(a.projectRemnantsVisible).toBe(false);
 await page.waitForTimeout(220);const idle=await state(page);expect(idle.experienceRenders).toBe(a.experienceRenders);
 await seek(page,.7);const b=await state(page);expect(b.experienceProjectUpdates).toBe(a.experienceProjectUpdates);expect(b.activeUISurfaces).toEqual([]);expect(b.calls).toBeLessThan(30);await expect(page.locator('canvas')).toHaveCount(1);await expect(page.locator('video,audio,iframe')).toHaveCount(0);
 await page.setViewportSize({width:1300,height:800});await expect.poll(async()=>(await state(page)).experienceRenders).toBeGreaterThan(b.experienceRenders);
});
for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:320,height:568},{width:768,height:1024},{width:844,height:390}])test(`editorial text and avatar stay within ${viewport.width} viewport`,async({page})=>{
 await page.setViewportSize(viewport);await load(page);for(const [q,id]of [[.45,'colorbar'],[.7,'acmegrade']] as const){await seek(page,q);const box=await page.locator(`[data-experience-marker="${id}"]`).boundingBox();expect(box).not.toBeNull();expect(box!.x).toBeGreaterThanOrEqual(0);expect(box!.x+box!.width).toBeLessThanOrEqual(viewport.width);expect(box!.y+box!.height).toBeLessThan(viewport.height);const a=(await state(page)).avatarBounds;expect(a.left).toBeGreaterThan(-1);expect(a.right).toBeLessThan(1);expect(a.top).toBeLessThan(1);expect(a.bottom).toBeGreaterThan(-1);if(viewport.width<=700)expect(box!.y+box!.height).toBeLessThan((1-a.top)/2*viewport.height);}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('reduced motion tells the same story through static composition without WebGL',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});await load(page);await expect(page.locator('canvas')).toHaveCount(0);
 for(const q of [.16,.29,.45,.7,.925,1,.45]){await seek(page,q);await expect(page.locator('.experience-fallback')).toBeVisible();await expect(page.locator('.project-overlay')).toBeHidden();}
 await page.screenshot({path:'artifacts/experience/captures/390-reduced.png'});await expect(page.locator('[data-experience-marker="colorbar"]')).toHaveCSS('transform','matrix(1, 0, 0, 1, 0, 0)');
});
test('reload, breakpoint changes, context loss and keyboard replay remain usable',async({page})=>{
 await load(page);await seek(page,.7);await page.reload();await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');await expect.poll(async()=>(await state(page)).experienceProgress).toBeCloseTo(.7,3);
 await page.setViewportSize({width:390,height:844});await expect.poll(async()=>(await state(page)).experienceProgress).toBeCloseTo(.7,3);
 await page.locator('canvas').evaluate(c=>(c as HTMLCanvasElement).getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext());await expect(page.locator('.opening')).toHaveAttribute('data-webgl-ready','false');await expect(page.locator('.experience-fallback')).toBeVisible();await expect(page.locator('[data-experience-marker="acmegrade"]')).toBeVisible();
 await page.keyboard.press('End');await expect(page.locator('.opening')).toHaveAttribute('data-contact-settled','true');await expect(page.locator('.contact-footer button')).toBeVisible();await page.locator('.contact-footer button').focus();await page.keyboard.press('Enter');await expect.poll(()=>page.evaluate(()=>scrollY)).toBeLessThan(2);await expect(page.locator('.opening')).toHaveAttribute('data-experience-active','false');
});
test('review links land at experience without downloading dormant project media',async({page})=>{const requests:string[]=[];page.on('request',r=>{if(r.url().includes('/worlds/'))requests.push(r.url());});await load(page,'/?debug&section=experience');await expect(page.locator('[data-experience-marker="colorbar"]')).toBeVisible();await expect.poll(async()=>(await state(page)).experienceProgress).toBeCloseTo(.4,3);expect(requests).toEqual([]);expect((await state(page)).experienceProjectUpdates).toBe(0);});
