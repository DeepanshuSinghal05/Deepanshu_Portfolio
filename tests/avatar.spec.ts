import {test,expect,type Page} from '@playwright/test';
async function ready(page:Page){await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');}
async function character(page:Page){await expect(page.locator('.opening')).toHaveAttribute('data-avatar-status','ready',{timeout:20000});}
async function state(page:Page){return page.locator('[data-cinematic-world]').evaluate(e=>JSON.parse((e as HTMLElement).dataset.debug!));}
async function seek(page:Page,phase:string,p:number){
 await page.evaluate(({phase,p})=>{const m=innerWidth<=700,h=innerHeight,r=document.querySelector<HTMLElement>('.opening')!;scrollTo(0,phase==='entry'?h*((m?2.7:3.2)+(m?6.5:8)*p):phase==='story'?h*((m?9.2:11.2)+(m?7.2:8.2)*p):phase==='project'?h*((m?16.4:19.4)+(m?18:22)*p):phase==='experience'?h*((m?65.36:79.24)+(m?6:7)*p):Number(r.dataset.contactStart)+Number(r.dataset.contactDistance)*p);},{phase,p});
 await page.waitForTimeout(100);
}
async function bones(page:Page){return page.evaluate(async()=>{
 const {acquireCharacter}=await import(performance.getEntriesByType('resource').find(r=>r.name.includes('/src/cinematic/CharacterAsset.ts'))!.name);const lease=acquireCharacter();
 try{const visual=await lease.ready,result:unknown[]=[];visual.object.traverse((o:any)=>{if(o.isBone)result.push([o.name,o.position.toArray(),o.quaternion.toArray(),o.scale.toArray()]);});return result;}finally{lease.release();}
});}

test('real GLB remains lazy on hero, validates its rig and initializes four clips before reveal',async({page})=>{
 const models:string[]=[];page.on('request',r=>{if(r.resourceType()==='fetch'&&r.url().includes('.glb'))models.push(r.url());});
 await page.goto('/?debug');await ready(page);await page.waitForTimeout(200);expect(models).toEqual([]);
 await seek(page,'entry',.1);await character(page);await expect.poll(async()=>(await state(page)).avatarAsset.kind).toBe('character');
 const s=await state(page);expect(s.avatarAsset).toMatchObject({meshes:1,vertices:40267,triangles:54523,joints:65,clips:4,textures:3,normalizedHeight:2.1});expect(models).toHaveLength(1);
 const rest=await bones(page);expect(rest).toHaveLength(65);expect(s.avatarAsset.clipNames).toEqual(['walk.001','Create a realistic, natural, full-body walking animation for th','idle.001','turn.001']);await seek(page,'experience',.6);expect(await bones(page)).not.toEqual(rest);expect((await state(page)).experienceWalk).toEqual([]);
 await seek(page,'contact',1);expect((await state(page)).avatarAsset.animation.state).toBe('IDLE');await expect(page.locator('canvas')).toHaveCount(1);
});

for(const viewport of [{width:1440,height:900},{width:390,height:844}])test(`real avatar forward, reverse and fast scene crossings are deterministic at ${viewport.width}`,async({page})=>{
 await page.setViewportSize(viewport);await page.goto('/?debug&section=contact');await ready(page);await character(page);
 const points:[string,number][]=[['entry',.1],['entry',.36],['entry',.61],['entry',.71],['entry',.9],['entry',1],['story',.14],['story',.315],['story',.44],['story',.57],['story',.7],['story',.83],['project',.23],['project',.76],['project',1.32],['project',2.18],['experience',.15],['experience',.45],['experience',.7],['contact',.3],['contact',1]];
 const poses=new Map();for(const [phase,p]of points){await seek(page,phase,p);const s=await state(page);poses.set(`${phase}:${p}`,s);expect(s.avatarAsset.kind).toBe('character');if(phase!=='entry'||p>=.87)expect(Math.abs(s.avatarAsset.worldBounds[0][1]-s.avatar[1])).toBeLessThan(.02);if(phase==='story'){expect(s.avatarBounds.left).toBeGreaterThan(-1);expect(s.avatarBounds.right).toBeLessThan(1);}}
 for(const [phase,p]of [...points].reverse().concat([points[2],points[17],points[6],points[13]])){await seek(page,phase,p);const s=await state(page),old=poses.get(`${phase}:${p}`);for(const key of ['avatar','rotation','scale','camera','target'])expect(s[key],`${phase}:${p}/${key}`).toEqual(old[key]);}
 await seek(page,'contact',1);const stopped=await state(page);await page.waitForTimeout(250);expect((await state(page)).contactRenders-stopped.contactRenders).toBeLessThanOrEqual(12);expect((await state(page)).contactRenders).toBeGreaterThan(stopped.contactRenders);
});

for(const viewport of [{width:1920,height:1080},{width:1440,height:900},{width:1366,height:768},{width:768,height:1024},{width:390,height:844},{width:375,height:667},{width:320,height:568}])test(`real character Contact silhouette and links fit ${viewport.width}`,async({page})=>{
 await page.setViewportSize(viewport);await page.goto('/?debug&section=contact');await ready(page);await character(page);await expect.poll(async()=>(await state(page)).avatarAsset.kind).toBe('character');
 const s=await state(page);expect(s.avatarBounds.left).toBeGreaterThan(-1);expect(s.avatarBounds.right).toBeLessThan(1);expect(s.avatarBounds.top).toBeLessThan(1);expect(s.avatarBounds.bottom).toBeGreaterThan(-1);
 const a=await page.locator('.contact-actions').boundingBox(),footer=await page.locator('.contact-footer').boundingBox(),composition=await page.locator('.contact-composition').boundingBox();expect(footer!.y-composition!.y-composition!.height).toBeGreaterThanOrEqual(17);expect((s.avatarBounds.left+1)/2*viewport.width).toBeGreaterThan(a!.x+a!.width);expect((1-s.avatarBounds.bottom)/2*viewport.height).toBeLessThan(footer!.y);
 for(const link of await page.locator('.contact-actions a').all())await link.click({trial:true});
});

test('responsive rebuilding reuses the character resource without duplicate requests or skeletons',async({page})=>{
 let requests=0;page.on('request',r=>{if(r.resourceType()==='fetch'&&r.url().includes('.glb'))requests++;});await page.goto('/?debug&section=contact');await ready(page);await character(page);
 for(const viewport of [{width:390,height:844},{width:1440,height:900},{width:375,height:667}]){await page.setViewportSize(viewport);await ready(page);await character(page);await expect.poll(async()=>(await state(page)).avatarAsset.kind).toBe('character');await expect(page.locator('canvas')).toHaveCount(1);expect(await bones(page)).toHaveLength(65);}
 expect(requests).toBe(1);
});

test('a failed model download keeps the proxy, Contact links and replay functional',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.route(/\.glb(?:\?|$)/,route=>route.request().resourceType()==='fetch'?route.abort():route.continue());await page.goto('/?debug&section=contact');await ready(page);await expect(page.locator('.opening')).toHaveAttribute('data-avatar-status','fallback');expect((await state(page)).avatarAsset.kind).toBe('proxy');await page.locator('.contact-primary').click({trial:true});await page.locator('.contact-footer button').click();await expect.poll(()=>page.evaluate(()=>scrollY)).toBeLessThan(2);expect(errors).toEqual([]);
});

test('reduced motion downloads no character and keeps direct navigation usable',async({page})=>{
 let requests=0;page.on('request',r=>{if(r.url().includes('.glb'))requests++;});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await ready(page);await page.locator('.contact-link').click();await expect(page.locator('.contact-primary')).toBeFocused();await expect(page.locator('canvas')).toHaveCount(0);expect(requests).toBe(0);
});

// Exercise the real mixer, including unchanged-time PropertyMixer caching, without
// wall-clock idle motion. These checks would catch a bind-pose flash or accumulated overlay.
test('skeletal poses reconstruct after arbitrary seeks and never expose a T-pose',async({page})=>{
 await page.goto('/?debug&section=contact');await ready(page);await character(page);
 const result=await page.evaluate(async()=>{
  const {acquireCharacter}=await import(performance.getEntriesByType('resource').find(r=>r.name.includes('/src/cinematic/CharacterAsset.ts'))!.name);const lease=acquireCharacter(),v=await lease.ready;
  try{
   const frames=[...Array.from({length:101},(_,i)=>({section:'cinematic',progress:i/100})),{section:'story',progress:.2125,turnProgress:.5},{section:'story',progress:.27,distance:4,walkWeight:1},{section:'story',progress:.31,distance:6,walkWeight:0}];
   const boneList:any[]=[];v.object.traverse((o:any)=>{if(o.isBone)boneList.push(o);});
   const bone=(name:string)=>boneList.find(o=>o.name===`mixamorig${name}`);
   const positions=()=>{const p=(n:string)=>{const b=bone(n);return b.getWorldPosition(b.position.clone());};return {leftDrop:p('LeftArm').y-p('LeftHand').y,rightDrop:p('RightArm').y-p('RightHand').y};};
   const pose=()=>boneList.map(o=>[...o.position.toArray(),...o.quaternion.toArray(),...o.scale.toArray()]).flat();
   const saved=frames.map(f=>{v.animation.evaluate(f as any,0);return {pose:pose(),...positions(),state:v.animation.snapshot()};});
   let maxError=0;for(const i of [...frames.keys()].reverse()){v.animation.evaluate(frames[i] as any,0);pose().forEach((n,j)=>maxError=Math.max(maxError,Math.abs(n-saved[i].pose[j])));}
   const frozen=[];for(let i=0;i<10;i++){v.animation.evaluate({section:'cinematic',progress:.36},i);frozen.push(pose());}
   return {maxError,minArmDrop:Math.min(...saved.flatMap(s=>[s.leftDrop,s.rightDrop])),states:saved.map(s=>s.state),frozen};
  }finally{lease.release();}
 });
 expect(result.maxError).toBeLessThan(1e-6);expect(result.minArmDrop).toBeGreaterThan(.2);expect(result.frozen.every(p=>JSON.stringify(p)===JSON.stringify(result.frozen[0]))).toBe(true);
 expect(result.states[36]).toMatchObject({state:'FALLING',walkWeight:0,fallWeight:1});expect(result.states[58].impactWeight).toBeGreaterThan(.9);expect(result.states[96].fallWeight).toBe(0);expect(result.states[101].state).toBe('TURNING');expect(result.states[102].state).toBe('WALKING');
});

test('gait follows route distance, reverses, and holds when scrolling stops',async({page})=>{
 await page.goto('/?debug&section=contact');await ready(page);await character(page);
 const points=[.25,.26,.27,.28],saved=[];for(const p of points){await seek(page,'story',p);saved.push((await state(page)).avatarAsset.animation);}
 for(let i=1;i<saved.length;i++)expect(saved[i].distance).toBeGreaterThan(saved[i-1].distance);
 for(let i=points.length-1;i>=0;i--){await seek(page,'story',points[i]);const a=(await state(page)).avatarAsset.animation;expect(a.gaitTime).toBe(saved[i].gaitTime);expect(a.walkWeight).toBe(saved[i].walkWeight);}
 const a=await bones(page);await page.waitForTimeout(250);expect(await bones(page)).toEqual(a);
 await seek(page,'contact',1);const idle=await bones(page);await page.waitForTimeout(350);expect(await bones(page)).not.toEqual(idle);
});

test('slow GLB loading holds the existing cover until a valid pose is ready',async({page})=>{
 let release!:()=>void;const gate=new Promise<void>(r=>release=r);
 await page.route(/\.glb(?:\?|$)/,async route=>{if(route.request().resourceType()==='fetch')await gate;await route.continue();});
 await page.goto('/?debug&section=contact');await ready(page);await expect(page.locator('.opening')).toHaveAttribute('data-avatar-loading-visible','true');
 await expect(page.locator('[data-navigation-cover]')).toBeVisible();release();await character(page);await expect(page.locator('.opening')).toHaveAttribute('data-avatar-loading-visible','false');expect((await state(page)).avatarAsset.animation.state).toBe('IDLE');
});

test('direct static Selected Work does not fetch the character until a cinematic section is visited',async({page})=>{
 let requests=0;page.on('request',r=>{if(r.resourceType()==='fetch'&&r.url().includes('.glb'))requests++;});
 await page.goto('/?debug&section=work');await ready(page);await page.waitForTimeout(200);expect(requests).toBe(0);
 await seek(page,'contact',1);await character(page);expect(requests).toBe(1);
});
