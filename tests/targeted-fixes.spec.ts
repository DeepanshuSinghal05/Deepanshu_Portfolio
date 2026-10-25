import {test,expect,type Page} from '@playwright/test';

const sizes=[{width:1920,height:1080},{width:1440,height:900},{width:1366,height:768},{width:1280,height:720},{width:768,height:1024},{width:390,height:844},{width:375,height:667},{width:320,height:568}];
async function ready(page:Page){await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');}
async function hitTest(page:Page,selector:string){return page.locator(selector).evaluateAll(elements=>elements.every(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth&&[[.15,.5],[.5,.5],[.85,.5]].every(([x,y])=>e.contains(document.elementFromPoint(r.x+r.width*x,r.y+r.height*y)));}));}
async function floats(page:Page){return page.evaluate(()=>{const y=(s:string)=>new DOMMatrix(getComputedStyle(document.querySelector(s)!).transform).m42;return {photo:y('.avatar-image'),cage:y('.face-cage-fallback'),root:getComputedStyle(document.querySelector('.avatar-pose')!).transform};});}

for(const viewport of sizes)test(`hero links and Contact footer remain usable at ${viewport.width}x${viewport.height}`,async({page})=>{
 await page.setViewportSize(viewport);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await ready(page);
 for(const selector of ['.hero-project-action','.contact-link']){await expect(page.locator(selector)).toBeInViewport({ratio:1});expect(await hitTest(page,selector)).toBe(true);}
 await page.locator('.hero-project-action').click();await expect(page.locator('#work-title')).toBeFocused();await expect(page.locator('.opening')).toHaveAttribute('data-navigating','false');await expect(page.getByRole('tab',{selected:true})).toContainText('YatraLok');
 await page.evaluate(()=>scrollTo(0,0));await expect(page.locator('.contact-link')).toBeVisible();await page.locator('.contact-link').click();await expect(page.locator('.opening')).toHaveAttribute('data-navigating','false');await expect(page.locator('.contact-primary')).toBeFocused();
 const layout=await page.evaluate(()=>{const content=document.querySelector('.contact-composition')!.getBoundingClientRect(),footer=document.querySelector('.contact-footer')!.getBoundingClientRect();return {gap:footer.top-content.bottom,footerBottom:footer.bottom,overflow:document.documentElement.scrollWidth>innerWidth};});
 expect(layout.gap).toBeGreaterThanOrEqual(17);expect(layout.footerBottom).toBeLessThanOrEqual(viewport.height);expect(layout.overflow).toBe(false);expect(await hitTest(page,'.contact-actions a')).toBe(true);expect(await hitTest(page,'.contact-footer button')).toBe(true);
 for(const link of await page.locator('.contact-actions a').all())await link.click({trial:true});
 await page.keyboard.press('End');expect(await hitTest(page,'.contact-actions a')).toBe(true);await page.locator('.contact-footer button').click();await expect.poll(()=>page.evaluate(()=>scrollY)).toBeLessThan(2);await expect(page.locator('.contact-overlay')).toBeHidden();expect(await hitTest(page,'.hero-project-action')).toBe(true);expect(await hitTest(page,'.contact-link')).toBe(true);expect(errors).toEqual([]);
});

test('hero actions are visible before fonts, portrait and WebGL finish loading',async({page})=>{
 let release!:()=>void;const gate=new Promise<void>(r=>release=r);
 await page.route(/\.(woff2?|png)(\?|$)|\/src\/scenes\/portraitScene\.ts/,async route=>{await gate;await route.continue();});
 await page.goto('/',{waitUntil:'domcontentloaded'});
 try{for(const selector of ['.hero-project-action','.contact-link']){await expect(page.locator(selector)).toBeVisible();expect(await hitTest(page,selector)).toBe(true);}}finally{release();}
 await ready(page);
});

test('ambient float moves nested visuals only, pauses offscreen and resumes without a reset',async({page})=>{
 await page.goto('/');await ready(page);await expect(page.locator('.opening')).toHaveAttribute('data-webgl-ready','true');const samples=[];
 for(let i=0;i<27;i++){samples.push(await floats(page));await page.waitForTimeout(250);}
 const photo=samples.map(s=>s.photo),relative=samples.map(s=>s.cage-s.photo);expect(Math.max(...photo)-Math.min(...photo)).toBeGreaterThan(10);expect(Math.max(...photo)).toBeLessThanOrEqual(6.01);expect(Math.min(...photo)).toBeGreaterThanOrEqual(-6.01);expect(Math.max(...relative)).toBeLessThanOrEqual(.01);expect(Math.min(...relative)).toBeGreaterThanOrEqual(-10.01);expect(Math.max(...relative)-Math.min(...relative)).toBeGreaterThan(9);
 expect(new Set(samples.map(s=>s.root)).size).toBe(1);
 await page.evaluate(()=>scrollTo(0,innerHeight*3.2*.5));await expect.poll(async()=>(await floats(page)).photo).toBe(0);const settled=await floats(page);await page.waitForTimeout(350);expect(await floats(page)).toEqual(settled);
 await page.evaluate(()=>scrollTo(0,0));await expect.poll(async()=>Math.abs((await floats(page)).photo)).toBeGreaterThan(.01);const before=await floats(page);
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('portfolio:navigate',{detail:{section:'contact'}})));await expect(page.locator('.contact-primary')).toBeFocused();await page.waitForTimeout(700);
 await page.evaluate(()=>scrollTo(0,0));await expect.poll(()=>page.evaluate(()=>document.querySelector('.opening')!.getAttribute('data-progress'))).toBe('0.0000');const after=await floats(page);expect(Math.abs(after.photo-before.photo)).toBeLessThan(1.2);expect(Math.abs(after.cage-before.cage)).toBeLessThan(1.5);await expect(page.locator('canvas')).toHaveCount(1);
});

test('reduced motion keeps both direct actions and stops all decorative float',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:320,height:568});await page.goto('/');await ready(page);const initial=await floats(page);await page.waitForTimeout(500);expect(await floats(page)).toEqual(initial);expect(initial.photo).toBe(0);expect(initial.cage).toBe(0);await expect(page.locator('canvas')).toHaveCount(0);
 await page.locator('.contact-link').focus();await page.keyboard.press('Enter');await expect(page.locator('.contact-primary')).toBeFocused();expect(await hitTest(page,'.contact-actions a')).toBe(true);await page.locator('.contact-footer button').click();await page.locator('.hero-project-action').focus();await page.keyboard.press('Enter');await expect(page.locator('#work-title')).toBeFocused();
});

test('WebGL fallback and contact hash keep navigation and floating registration',async({page})=>{
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type:string,...args:unknown[]){return type==='webgl2'?null:original.apply(this,[type,...args] as never);} as typeof original;});
 await page.goto('/');await ready(page);await expect(page.locator('.face-cage-fallback')).toBeVisible();const a=await floats(page);await page.waitForTimeout(600);const b=await floats(page);expect(b.photo).not.toBe(a.photo);expect(b.cage).not.toBe(a.cage);
 // A direct-entry URL must create a document, not only change the current hash.
 await page.goto('/?entry=direct#contact');await ready(page);expect(await hitTest(page,'.contact-actions a')).toBe(true);
});
