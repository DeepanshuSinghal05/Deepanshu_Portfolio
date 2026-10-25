import {test,expect,type Page} from '@playwright/test';
async function load(page:Page){await page.goto('/?debug');await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');}
async function seek(page:Page,p:number){
  await page.evaluate(p=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,mobile=innerWidth<=700;scrollTo(0,innerHeight*((reduced?4.2:mobile?9.2:11.2)+(reduced?4.2:mobile?7.2:8.2)*p));},p);
  await expect.poll(async()=>Number(await page.locator('.opening').getAttribute('data-story-progress'))).toBeCloseTo(p,3);
}
async function state(page:Page){await expect(page.locator('[data-cinematic-world]')).toHaveAttribute('data-debug',/progress/);return JSON.parse((await page.locator('[data-cinematic-world]').getAttribute('data-debug'))!);}

test('Phase 3 inherits the exact arrival and reveals introduction in order',async({page})=>{
  await load(page);await seek(page,0);const arrival=await state(page);
  await seek(page,.001);const start=await state(page);
  expect(start.avatar).toEqual(arrival.avatar);expect(start.rotation).toEqual(arrival.rotation);expect(start.camera).toEqual(arrival.camera);expect(start.target).toEqual(arrival.target);expect(start.fov).toBe(arrival.fov);
  await seek(page,.045);expect(Number(await page.locator('[data-intro-greeting]').evaluate(e=>getComputedStyle(e).opacity))).toBeGreaterThan(0);
  await expect(page.locator('[data-intro-name]')).toHaveCSS('opacity','0');
  await seek(page,.075);expect(Number(await page.locator('[data-intro-name]').evaluate(e=>getComputedStyle(e).opacity))).toBeGreaterThan(0);await expect(page.locator('[data-intro-copy]')).toHaveCSS('opacity','0');
  await seek(page,.14);const intro=await state(page);expect(intro.avatarState).toBe('IDLE');expect(intro.avatar).toEqual(arrival.avatar);await expect(page.locator('[data-intro-copy]')).toHaveCSS('opacity','1');
  await seek(page,.22);expect((await state(page)).avatarState).toBe('TURNING');expect((await state(page)).avatar).toEqual(arrival.avatar);
  await seek(page,.26);expect((await state(page)).avatarState).toBe('WALKING');
  await seek(page,0);const back=await state(page);expect(back.avatar).toEqual(arrival.avatar);expect(back.camera).toEqual(arrival.camera);
});

test('chapters pause the root, evolve the world and reconstruct under aggressive reversal',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await load(page);
  const samples=new Map();
  for(const [p,id] of [[.31,'foundation'],[.44,'development'],[.57,'full-stack'],[.70,'intelligence'],[.83,'real-products']] as const){
    await seek(page,p);const s=await state(page);samples.set(p,s);
    expect(s.chapter).toBe(id);expect(s.avatarState).toBe('IDLE');expect(s.avatar[1]).toBe(-45);expect(s.story.activeStructures).toBeGreaterThan(0);
    await expect(page.locator(`[data-story-chapter="${id}"]`)).toHaveCSS('opacity','1');
    await seek(page,p+.005);expect((await state(page)).avatar).toEqual(s.avatar);
  }
  for(const p of [1,.44,.01,.7,.26,1,.57,.31,.83]){
    await seek(page,p);if(samples.has(p)){const s=await state(page),before=samples.get(p);expect(s.avatar).toEqual(before.avatar);expect(s.rotation).toEqual(before.rotation);expect(s.camera).toEqual(before.camera);expect(s.story).toEqual(before.story);}
  }
  await seek(page,1);const end=await state(page);
  expect(end.avatar).toEqual([0,-45,-48]);expect(end.rotation).toEqual([0,.25,0]);expect(end.scale).toEqual([1,1,1]);expect(end.avatarState).toBe('IDLE');
  expect(end.camera).toEqual([-2.4,-43,-40]);expect(end.target).toEqual([-2.4,-43.8,-48]);expect(end.fov).toBe(40);expect(end.cameraMode).toBe('PHASE4_HANDOFF');
  expect(end.story.pathState).toBe('COMPLETE');expect(end.story.structures.every((s:{state:string})=>s.state==='DORMANT')).toBe(true);
  await page.waitForTimeout(150);expect((await state(page)).avatar).toEqual(end.avatar);expect((await state(page)).camera).toEqual(end.camera);
  await expect(page.locator('canvas')).toHaveCount(1);expect(errors).toEqual([]);
});

test('small scroll increments keep camera, root and orientation continuous',async({page})=>{
  await load(page);await seek(page,0);await state(page);
  const samples=await page.evaluate(async()=>{
    const states=[];
    for(let i=0;i<=240;i++){
      scrollTo(0,innerHeight*(11.2+8.2*i/240));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
      states.push(JSON.parse(document.querySelector<HTMLElement>('[data-cinematic-world]')!.dataset.debug!));
    }return states;
  });
  const distance=(a:number[],b:number[])=>Math.hypot(...a.map((v,i)=>v-b[i]));
  for(let i=1;i<samples.length;i++){
    expect(distance(samples[i].avatar,samples[i-1].avatar)).toBeLessThan(1.1);
    expect(distance(samples[i].camera,samples[i-1].camera)).toBeLessThan(1.2);
    expect(Math.abs(samples[i].rotation[1]-samples[i-1].rotation[1])).toBeLessThan(.65);
  }
});

for(const viewport of [{width:390,height:844},{width:320,height:568},{width:844,height:390},{width:1440,height:900}]){
  test(`story composition and readable copy ${viewport.width}x${viewport.height}`,async({page})=>{
    await page.setViewportSize(viewport);await load(page);
    for(const p of [.14,.31,.44,.57,.70,.83,1]){
      await seek(page,p);const s=await state(page);
      expect(s.avatarBounds.left).toBeGreaterThan(-1);expect(s.avatarBounds.right).toBeLessThan(1);expect(s.avatarBounds.top).toBeLessThan(1);expect(s.avatarBounds.bottom).toBeGreaterThan(-1);
      const selector=p===.14?'[data-story-introduction]':p===1?'[data-story-handoff]':`[data-story-chapter="${s.chapter}"]`;
      const bounds=await page.locator(selector).boundingBox();expect(bounds!.x).toBeGreaterThanOrEqual(0);expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(viewport.width);expect(bounds!.y+bounds!.height).toBeLessThan(viewport.height);
      if(viewport.width<=700)expect(bounds!.y+bounds!.height).toBeLessThan((1-s.avatarBounds.top)*viewport.height/2);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    }
    await page.screenshot({path:`artifacts/screenshots/story-final-${viewport.width}-${viewport.height}.png`});
  });
}

test('story progress survives reload and responsive reconstruction',async({page})=>{
  await load(page);await seek(page,.57);const before=await state(page);
  await page.reload();await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');await expect.poll(async()=>Number(await page.locator('.opening').getAttribute('data-story-progress'))).toBeCloseTo(.57,3);
  await seek(page,.57);expect((await state(page)).avatar).toEqual(before.avatar);
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');await expect.poll(async()=>Number(await page.locator('.opening').getAttribute('data-story-progress'))).toBeCloseTo(.57,3);
  await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(300);await seek(page,.57);expect((await state(page)).avatar).toEqual(before.avatar);await expect(page.locator('canvas')).toHaveCount(1);
});

test('reduced motion retains every chapter and accessible transcript without WebGL',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await load(page);
  for(const p of [.14,.31,.44,.57,.7,.83,1]){await seek(page,p);await expect(page.locator('canvas')).toHaveCount(0);await expect(page.locator('.story-fallback')).toBeVisible();}
  await expect(page.getByRole('region',{name:"Deepanshu's story"})).toContainText('ABES Institute of Technology');
  await expect(page.getByRole('region',{name:"Deepanshu's story"})).toContainText('RAG systems');
  await expect(page.locator('[data-story-fallback-line]')).toHaveAttribute('stroke-dashoffset','0');
  await page.screenshot({path:'artifacts/screenshots/story-reduced-mobile.png'});
  await seek(page,0);await expect(page.locator('.story-overlay')).toHaveCSS('opacity','0');await expect(page.locator('audio')).toHaveCount(0);
});

test('context loss in the journey retains the story and permits replay',async({page})=>{
  await load(page);await seek(page,.57);
  await page.locator('canvas').evaluate(c=>(c as HTMLCanvasElement).getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext());
  await expect(page.locator('.opening')).toHaveAttribute('data-webgl-ready','false');await expect(page.locator('.story-fallback')).toBeVisible();
  await seek(page,1);await page.locator('.cinematic-replay').click();await expect.poll(()=>page.evaluate(()=>scrollY)).toBeLessThan(2);
});
