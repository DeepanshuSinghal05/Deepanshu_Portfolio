import { test, expect, type Page } from '@playwright/test';
async function load(page: Page) { await page.goto('/?debug'); await expect(page.locator('.opening')).toHaveAttribute('data-ready','true'); }
async function seek(page: Page, p: number) {
  await page.evaluate(p => { const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,mobile=innerWidth<=700;scrollTo(0,innerHeight*((reduced?1.2:mobile?2.7:3.2)+(reduced?3:mobile?6.5:8)*p)); },p);
  await expect.poll(async()=>Number(await page.locator('.opening').getAttribute('data-cinematic-progress'))).toBeCloseTo(p,3);
  if(p>0&&await page.locator('.opening').getAttribute('data-webgl-ready')==='true')await expect(page.locator('.opening')).toHaveAttribute('data-avatar-status','ready');
}
async function snapshot(page: Page) { await expect(page.locator('[data-cinematic-world]')).toHaveAttribute('data-debug', /progress/); return JSON.parse((await page.locator('[data-cinematic-world]').getAttribute('data-debug'))!); }

test('glass completes radial then branching cracks and holds before staggered failure',async({page})=>{
  await load(page);
  await seek(page,.55);expect((await snapshot(page)).glass.paneVisible).toBe(true);
  await seek(page,.575);const radial=await snapshot(page);
  expect(radial.glass.primaryProgress).toBeGreaterThan(.8);expect(radial.glass.secondaryProgress).toBe(0);
  await seek(page,.588);const branching=await snapshot(page);
  expect(branching.glass.primaryProgress).toBe(1);expect(branching.glass.secondaryProgress).toBeGreaterThan(0);expect(branching.glass.secondaryProgress).toBeLessThan(1);
  await seek(page,.60);const hold=await snapshot(page);
  expect(hold.glass).toMatchObject({stage:'FRACTURED_HOLD',paneVisible:true,primaryProgress:1,secondaryProgress:1,displacedShards:0});
  await page.screenshot({path:'artifacts/screenshots/phase26-fractured-hold.png'});
  await seek(page,.615);expect((await snapshot(page)).shards).toEqual(hold.shards);
  await seek(page,.635);const first=await snapshot(page);
  expect(first.glass.displacedShards).toBeGreaterThan(0);expect(first.glass.displacedShards).toBeLessThan(first.shardCount);
  await seek(page,.71);const broken=await snapshot(page);
  const ys=broken.shards.map((s:{position:number[]})=>s.position[1]),zs=broken.shards.map((s:{position:number[]})=>s.position[2]);
  expect(Math.max(...ys)-Math.min(...ys)).toBeGreaterThan(3);expect(Math.max(...zs)-Math.min(...zs)).toBeGreaterThan(5);
  await page.screenshot({path:'artifacts/screenshots/phase26-shard-depth.png'});
  for(const p of [1,.8,.71,.60])await seek(page,p);
  const reversed=await snapshot(page);expect(reversed.glass).toEqual(hold.glass);expect(reversed.shards).toEqual(hold.shards);
});

test('arrival stays planted while camera reframes and exposes a stable story contract',async({page})=>{
  await load(page);const cameras=[];
  for(const p of [.87,.89,.92,.96,1]){
    await seek(page,p);const s=await snapshot(page);
    expect(s.avatar).toEqual([0,-45,0]);expect(s.rotation).toEqual([0,0,0]);cameras.push(s.camera);
  }
  expect(cameras[0]).not.toEqual(cameras[3]);expect(cameras[3]).toEqual(cameras[4]);
  const state=await snapshot(page);
  expect(state.camera).toEqual([-1.85,-43.35,6.5]);expect(state.target).toEqual([-1.85,-43.9,0]);
  expect(state.storyOrigin).toEqual(state.avatar);expect(state.storyDirection).toEqual([0,0,-1]);
  expect(state.environmentState).toBe('ARRIVAL_IDLE');expect(state.particleState).toBe('LOW_RATE_IDLE');
  await page.waitForTimeout(300);expect((await snapshot(page)).camera).toEqual(state.camera);
});
test('deterministic contact, fracture reconstruction, feet landing and final composition',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await load(page);await seek(page,.56);let state=await snapshot(page);
  expect(state.avatar).toEqual([0,-32,0]);expect(state.normalized.fracture).toBe(0);
  await seek(page,.67);const fracture=await snapshot(page);expect(fracture.normalized.fracture).toBeGreaterThan(.4);expect(fracture.avatar[1]).toBeLessThan(-32);
  await seek(page,.87);expect((await snapshot(page)).avatar[1]).toBe(-45);
  await seek(page,.89);expect((await snapshot(page)).scale[1]).toBeLessThan(1);
  await seek(page,.92);expect((await snapshot(page)).avatar).toEqual([0,-45,0]);
  await seek(page,1);state=await snapshot(page);
  expect(state.avatar).toEqual([0,-45,0]);expect(state.rotation).toEqual([0,0,0]);expect(state.scale).toEqual([1,1,1]);expect(Object.values(state.normalized).every(v=>v===1)).toBe(true);
  await page.waitForTimeout(150);const held=await snapshot(page);for(const key of ['avatar','rotation','scale','camera','target','shards','glass'])expect(held[key]).toEqual(state[key]);
  await seek(page,.67);expect((await snapshot(page)).shards).toEqual(fracture.shards);
  await seek(page,0);await expect(page.locator('.editorial-layer')).toHaveCSS('opacity','1');await expect(page.locator('.portrait-webgl canvas')).toHaveCount(1);
  for(const p of [1,.59,.02,.9,.65,0,1,.67])await seek(page,p);
  expect((await snapshot(page)).shards).toEqual(fracture.shards);expect(errors).toEqual([]);
});
for(const viewport of [{width:390,height:844},{width:320,height:568},{width:844,height:390},{width:1440,height:900}]){
  test(`cinematic framing and single canvas ${viewport.width}x${viewport.height}`,async({page})=>{
    await page.setViewportSize(viewport);await load(page);await expect(page.locator('.opening')).toHaveAttribute('data-webgl-ready','true');
    for(const p of [.08,.35,.58,.67,.87,1]){
      await seek(page,p);await expect(page.locator('canvas')).toHaveCount(1);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await page.screenshot({path:`artifacts/screenshots/cinematic-${viewport.width}-${viewport.height}-${p}.png`});
    }
    const state=await snapshot(page);expect(state.avatar[0]).toBe(0);expect(state.shardCount).toBe(viewport.width<=700?24:42);
    expect(state.avatarBounds.left).toBeGreaterThan(viewport.width<=700&&state.avatarAsset?.kind==='character'?-1:0);expect(state.avatarBounds.right).toBeLessThan(.97);
    expect(state.avatarBounds.top).toBeLessThan(1);expect(state.avatarBounds.bottom).toBeGreaterThan(-1);
    expect(state.avatarState).toBe('IDLE');expect(state.cameraMode).toBe('STORY_READY');expect(state.fov).toBe(38);
    expect(state.tunnelState).toBe('DORMANT');expect(state.glassState).toBe('INACTIVE');expect(state.shardState).toBe('INACTIVE');
  });
}
test('partial fracture survives reload and responsive rebuild',async({page})=>{
  await load(page);await seek(page,.66);const before=await snapshot(page);await page.reload();await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');await seek(page,.66);expect((await snapshot(page)).shards).toEqual(before.shards);
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(250);await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');await expect.poll(async()=>Number(await page.locator('.opening').getAttribute('data-cinematic-progress'))).toBeCloseTo(.66,3);await seek(page,.66);await expect(page.locator('canvas')).toHaveCount(1);
  await page.setViewportSize({width:1300,height:800});await page.waitForTimeout(250);await seek(page,.66);expect((await snapshot(page)).shards).toEqual(before.shards);
});
test('reduced motion tells the sequence without falling camera or WebGL',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await load(page);
  for(const p of [.3,.58,.67,.87,1]){await seek(page,p);await expect(page.locator('canvas')).toHaveCount(0);await expect(page.locator('.cinematic-fallback')).toBeVisible();}
  await expect(page.locator('[data-fallback-proxy]')).toHaveAttribute('transform','translate(220 0)');
  await seek(page,0);await expect(page.locator('.editorial-layer')).toHaveCSS('opacity','1');
});
test('WebGL loss falls back without losing scroll and replay',async({page})=>{
  await load(page);await seek(page,.65);
  await page.locator('canvas').evaluate(canvas=>(canvas as HTMLCanvasElement).getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext());
  await expect(page.locator('.opening')).toHaveAttribute('data-webgl-ready','false');await seek(page,1);await expect(page.locator('.cinematic-fallback')).toBeVisible();await page.locator('.cinematic-replay').click();await expect.poll(()=>page.evaluate(()=>scrollY)).toBeLessThan(2);
});

test('reduced mobile composition stays visible on the right',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await load(page);await seek(page,1);
  const proxy=await page.locator('[data-fallback-proxy]').boundingBox();expect(proxy!.x).toBeGreaterThan(195);expect(proxy!.x+proxy!.width).toBeLessThan(390);
  await page.screenshot({path:'artifacts/screenshots/cinematic-reduced-mobile.png'});
});

test('secondary velocity settles without moving the root, and silent cue hooks do not double fire',async({page})=>{
  await load(page);
  await expect(page.locator('.opening')).toHaveAttribute('data-webgl-ready','true');
  await page.evaluate(async()=>{
    // Use Vite's loaded URL (including its HMR revision) to observe the live bus.
    const path=performance.getEntriesByType('resource').map(e=>e.name).find(name=>name.includes('/src/cinematic/CinematicEvents.ts'))!; const module=await import(path);
    (window as unknown as {cues:unknown[]}).cues=[];
    module.cinematicEvents.addEventListener('cue',(event:CustomEvent)=>(window as unknown as {cues:unknown[]}).cues.push(event.detail));
  });
  await page.evaluate(async()=>{for(let i=0;i<50;i++){scrollTo(0,innerHeight*(3.2+8*(.3+i*.002)));await new Promise(requestAnimationFrame);}});
  const moving=await snapshot(page);expect(moving.velocity).toBeGreaterThan(.02);
  await expect.poll(async()=>(await snapshot(page)).velocity).toBeLessThan(.005);
  const rested=await snapshot(page);expect(rested.avatar).toEqual(moving.avatar);expect(rested.camera).toEqual(moving.camera);
  await seek(page,.555);await seek(page,.57);await page.waitForTimeout(100);
  const cues=await page.evaluate(()=>(window as unknown as {cues:{cue:string;direction:string}[]}).cues);
  expect(cues.filter(c=>c.cue==='contact'&&c.direction==='forward')).toHaveLength(1);
  await seek(page,.55);expect((await page.evaluate(()=>(window as unknown as {cues:{cue:string;direction:string}[]}).cues)).filter(c=>c.cue==='contact'&&c.direction==='reverse')).toHaveLength(1);
  await expect(page.locator('audio')).toHaveCount(0);
});
