import {test,expect,type Page} from '@playwright/test';
async function load(page:Page){await page.goto('/?debug');await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');if(!await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches))await expect(page.locator('.opening')).toHaveAttribute('data-webgl-ready','true');}
async function seek(page:Page,q:number){const p=1+.64*q;await page.evaluate(p=>{const r=matchMedia('(prefers-reduced-motion: reduce)').matches,m=innerWidth<=700;scrollTo(0,innerHeight*((r?8.4:m?16.4:19.4)+(r?12:m?18:22)*p));},p);await expect.poll(async()=>Number(await page.locator('.opening').getAttribute('data-project-progress'))).toBeCloseTo(p,3);await page.evaluate(()=>new Promise(requestAnimationFrame));}
async function state(page:Page){return JSON.parse((await page.locator('[data-cinematic-world]').getAttribute('data-debug'))??'{}');}

test('DOJ completes a question, selective retrieval, local model and response loop',async({page})=>{
 await load(page);await seek(page,.28);const query=await state(page);expect(query.dojStage).toBe('QUESTION');expect(query.questionVisible).toBe(true);expect(query.responseVisible).toBe(false);await expect.poll(async()=>(await state(page)).activeUISurfaces).toContain('doj/chat_interface');
 await seek(page,.45);expect((await state(page)).selectedCount).toBe(0);await seek(page,.56);const retrieval=await state(page);expect(retrieval.questionId).toBe(query.questionId);expect(retrieval.selectedCount).toBe(3);expect(retrieval.chunkCount).toBe(27);expect(retrieval.selectedCount).toBeLessThan(retrieval.chunkCount);
 await seek(page,.64);const context=await state(page);expect(context.contextProgress).toBeGreaterThan(.8);await seek(page,.715);expect((await state(page)).generationProgress).toBeGreaterThan(0);await expect(page.locator('[data-project-note]')).toContainText('Intended local');
 await seek(page,.79);expect((await state(page)).responseVisible).toBe(true);await seek(page,.88);expect((await state(page)).activeUISurfaces).toContain('doj/response');await expect(page.locator('[data-project-note]')).toContainText('Not verified against the current corpus');await expect(page.locator('canvas')).toHaveCount(1);
});

test('DOJ reverse and rapid world crossings preserve exact information and lighting state',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await load(page);const saved=new Map();
 const keys=['avatar','rotation','camera','target','questionId','questionPosition','selectedCount','selectedChunkPositions','contextProgress','generationProgress','responsePosition','dojLighting'];
 const points=[.08,.165,.28,.375,.45,.55,.64,.715,.79,.88,.96,1];for(const p of points){await seek(page,p);saved.set(p,await state(page));}
 for(const p of [1,.28,.88,.45,.715,.165,.79,.375,.96,.55,.08,.64]){await seek(page,p);const s=await state(page);for(const k of keys)expect(s[k]).toEqual(saved.get(p)[k]);}
 await seek(page,-.8);await expect.poll(async()=>(await state(page)).loadedTextures.every((k:string)=>!k.startsWith('doj/'))).toBe(true);await seek(page,.55);expect((await state(page)).selectedCount).toBe(3);expect((await state(page)).transactionSignalVisible).toBe(false);expect(errors).toEqual([]);
});

test('DOJ media is prepared late and evicts commerce; no next-project assets',async({page})=>{
 const requested:string[]=[];page.on('request',r=>{if(r.url().includes('/worlds/'))requested.push(r.url());});await load(page);expect(requested).toEqual([]);await seek(page,-.2);expect(requested.some(k=>k.includes('/doj/'))).toBe(false);await seek(page,-.08);await expect.poll(()=>requested.filter(k=>k.includes('/doj/')).length).toBe(3);
 await seek(page,.28);await expect.poll(async()=>(await state(page)).loadedTextures).toEqual(['doj/homepage','doj/chat_interface','doj/response']);expect((await state(page)).worldLifecycle.prisha).toBe('DORMANT');expect(requested.some(k=>/holo|mp4/.test(k))).toBe(false);
});

for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:320,height:568},{width:844,height:390}])test(`DOJ product evidence and retrieval remain framed ${viewport.width}`,async({page})=>{
 await page.setViewportSize(viewport);await load(page);for(const [q,key] of [[.165,'doj/homepage'],[.28,'doj/chat_interface'],[.88,'doj/response']] as const){await seek(page,q);await expect.poll(async()=>(await state(page)).surfaceBounds[key]).toBeDefined();const b=(await state(page)).surfaceBounds[key];for(const n of [b.left,b.bottom])expect(n).toBeGreaterThan(-1);for(const n of [b.right,b.top])expect(n).toBeLessThan(1);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await seek(page,.55);const s=await state(page);expect(s.selectedCount).toBe(3);expect(s.chunkCount).toBe(viewport.width<=700?18:27);await expect(page.locator('[data-project-semantic]')).toHaveText('Find what matters.');
});

test('reduced motion keeps the knowledge sequence without a WebGL canvas',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});await load(page);await expect(page.locator('canvas')).toHaveCount(0);
 await seek(page,.28);await expect(page.locator('[data-project-poster]')).toBeVisible();for(const q of [.375,.45,.55,.64,.715,.79]){await seek(page,q);await expect(page.locator('.doj-knowledge-fallback')).toBeVisible();await expect(page.locator('.project-media-fallback')).not.toBeVisible();}await seek(page,.88);await expect(page.locator('[data-project-poster]')).toBeVisible();await expect(page.locator('[data-project-poster]')).toHaveAttribute('src',/doj\/response-mobile/);
 await expect(page.getByRole('region',{name:'Project story transcript'})).toContainText('earlier cloud prototype');
});

test('DOJ restoration, context loss and Project 04 handoff are stable',async({page})=>{
 await load(page);await seek(page,.55);await page.reload();await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');await expect.poll(async()=>(await state(page)).dojProgress).toBeCloseTo(.55,3);await page.setViewportSize({width:390,height:844});await expect.poll(async()=>(await state(page)).dojProgress).toBeCloseTo(.55,3);
 await seek(page,1);const s=await state(page);s.avatar.forEach((v:number,i:number)=>expect(v).toBeCloseTo(s.project04AvatarStart.position[i],3));s.camera.forEach((v:number,i:number)=>expect(v).toBeCloseTo(s.project04CameraStart.position[i],2));expect(s.holoSeed).toBeGreaterThan(.99);await expect(page.locator('.cinematic-replay')).not.toBeVisible();
 await seek(page,.55);await page.locator('canvas').evaluate(c=>(c as HTMLCanvasElement).getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext());await expect(page.locator('.opening')).toHaveAttribute('data-webgl-ready','false');await expect(page.locator('.doj-knowledge-fallback')).toBeVisible();
});

test('DOJ joins the exact frozen pose and contains no camera cuts',async({page})=>{
 await load(page);const result=await page.evaluate(async()=>{const {createProjectTrajectory}=await import('/src/projects/ProjectTrajectory.ts');const {createDOJTrajectory}=await import('/src/projects/DOJTrajectory.ts');return [false,true].map(mobile=>{const end=createProjectTrajectory(mobile).sample(1),t=createDOJTrajectory(mobile,end),start=t.sample(0);let last=start,maxCamera=0,maxAvatar=0;for(let i=1;i<=1000;i++){const s=t.sample(i/1000);maxCamera=Math.max(maxCamera,s.camera.distanceTo(last.camera));maxAvatar=Math.max(maxAvatar,s.position.distanceTo(last.position));last=s;}return{sameCamera:start.camera.equals(end.camera),sameAvatar:start.position.equals(end.position),maxCamera,maxAvatar};});});for(const r of result){expect(r.sameCamera&&r.sameAvatar).toBe(true);expect(r.maxCamera).toBeLessThan(2.1);expect(r.maxAvatar).toBeLessThan(1);}
});



