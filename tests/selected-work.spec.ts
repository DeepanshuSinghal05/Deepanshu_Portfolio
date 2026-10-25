import {test,expect,type Page} from '@playwright/test';
async function load(page:Page,url='/?debug&section=work'){await page.goto(url);await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');await expect(page.locator('.selected-work')).toBeInViewport();}
test('four projects switch in place with source-qualified content and real imagery',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await load(page);
 for(const [name,id,claim] of [['Prisha Enterprises','prisha','HMAC-SHA256'],['DOJ Virtual Assistant','doj','Ollama is therefore an intended'],['Holo Gesture','holo','Specific original contributions by Deepanshu'],['YatraLok','yatralok','does not dispatch an alert']]){
  await page.getByRole('tab',{name:new RegExp(name)}).click();await expect(page.getByRole('tabpanel')).toContainText(claim);await expect(page.getByRole('tabpanel').getByRole('heading',{level:3})).toHaveText(name);await expect(page).toHaveURL(new RegExp(`#project-${id}$`));await expect(page.getByRole('tab',{selected:true})).toContainText(name);
  for(const img of await page.getByRole('tabpanel').locator('img').all()){await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate(e=>(e as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);}
 }
 expect(errors).toEqual([]);await expect(page.locator('canvas')).toHaveCount(1);
});
test('keyboard selection, panel focus, direct hash and legacy cinematic query coexist',async({page})=>{
 await load(page,'/?debug#project-doj');const tab=page.getByRole('tab',{selected:true});await expect(tab).toContainText('DOJ');await tab.focus();await page.keyboard.press('ArrowDown');await expect(page.getByRole('tab',{selected:true})).toBeFocused();await expect(page.getByRole('tabpanel')).toContainText('Holo Gesture');await page.keyboard.press('Tab');await expect(page.getByRole('tabpanel')).toBeFocused();
 await page.reload();await expect(page.getByRole('tab',{selected:true})).toContainText('Holo');await page.goto('/?debug&project=yatralok');await expect(page.locator('.opening')).toHaveAttribute('data-ready','true');await expect(page.locator('.opening')).toHaveAttribute('data-active-project','yatralok');
});
test('normal DOM scrolling sleeps WebGL and selection survives contact and reverse',async({page})=>{
 await load(page);await expect(page.locator('.opening')).toHaveAttribute('data-webgl-ready','true');await page.getByRole('tab',{name:/Prisha/}).click();await page.evaluate(()=>scrollBy(0,650));await page.waitForTimeout(300);
 const state=()=>page.locator('[data-cinematic-world]').getAttribute('data-debug');const first=await state();await page.mouse.wheel(0,300);await page.waitForTimeout(400);expect(await state()).toBe(first);
 await page.locator('.work-end a').click();await expect(page.locator('.contact-primary')).toBeVisible();await page.evaluate(()=>scrollTo(0,Number(document.querySelector<HTMLElement>('.opening')!.dataset.workStart)));await expect(page.getByRole('tab',{selected:true})).toContainText('Prisha');await expect(page.locator('.contact-overlay')).toBeHidden();
});
for(const width of [320,390,768,1440])test(`responsive project reading and switching at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:width<700?844:1024});await load(page);for(const name of ['YatraLok','Prisha','DOJ','Holo']){await page.getByRole('tab',{name:new RegExp(name)}).click();await expect(page.getByRole('tabpanel')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);const box=await page.getByRole('tabpanel').boundingBox();expect(box!.x).toBeGreaterThanOrEqual(0);expect(box!.x+box!.width).toBeLessThanOrEqual(width);}
});
test('reduced motion keeps normal reading, selection and final links without a canvas',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await load(page);await page.getByRole('tab',{name:/DOJ/}).click();await expect(page.getByRole('tabpanel')).toHaveCSS('animation-name','none');await expect(page.locator('canvas')).toHaveCount(0);await page.locator('.work-end a').click();await expect(page.locator('.contact-primary')).toBeVisible();
});
