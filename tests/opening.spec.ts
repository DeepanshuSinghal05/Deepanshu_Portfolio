import { test, expect, type Page } from '@playwright/test';

async function load(page: Page) {
  await page.goto('/');
  await expect(page.locator('.opening')).toHaveAttribute('data-ready', 'true');
}

async function seek(page: Page, progress: number) {
  await page.evaluate(p => window.scrollTo(0, innerHeight * (matchMedia('(prefers-reduced-motion: reduce)').matches ? 1.2 : innerWidth <= 700 ? 2.7 : 3.2) * p), progress);
  await expect.poll(async () => Number(await page.locator('.opening').getAttribute('data-progress'))).toBeCloseTo(progress, 2);
}

async function offsets(page: Page) {
  return page.locator('.signature path').evaluateAll(paths => paths.map(path => Number.parseFloat(getComputedStyle(path).strokeDashoffset)));
}

test('complete first frame, local assets and fonts, no application errors', async ({ page }) => {
  const issues: string[] = [];
  page.on('pageerror', error => issues.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) { if (!message.text().includes('warning X4122')) issues.push(message.text()); } });
  page.on('response', response => { if (response.status() >= 400) issues.push(`${response.status()} ${response.url()}`); });
  await load(page);
  await expect(page.getByRole('heading', { name: 'Deepanshu Singhal' })).toBeVisible();
  await expect(page.getByAltText('Deepanshu Singhal wearing glasses and a coral shirt')).toBeVisible();
  expect(await page.locator('.editorial-layer img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  expect(await page.evaluate(() => document.fonts.check('16px "Instrument Serif"') && document.fonts.check('16px Manrope'))).toBe(true);
  // The later project decoder is mounted without a source or initial request.
  expect(await page.locator('video[src]').count()).toBe(0);
  expect((await offsets(page)).every(value => value > 250)).toBe(true);
  await seek(page, 1);
  await seek(page, 0);
  expect(issues).toEqual([]);
});

test('signature pen order, exact reversal and aggressive repeated scrolling', async ({ page }) => {
  await load(page);
  const initial = await offsets(page);
  await seek(page, .46);
  const firstStroke = await offsets(page);
  expect(firstStroke[0]).toBeGreaterThan(0);
  expect(firstStroke[0]).toBeLessThan(initial[0]);
  expect(firstStroke.slice(1)).toEqual(initial.slice(1));
  await seek(page, .6);
  const middle = await offsets(page);
  expect(middle[0]).toBe(0);
  expect(middle[1]).toBeGreaterThan(0);
  expect(middle[2]).toBe(initial[2]);
  await seek(page, 1);
  expect(await offsets(page)).toEqual([0, 0, 0]);
  await seek(page, .6);
  const reverse = await offsets(page);
  reverse.forEach((value, index) => expect(value).toBeCloseTo(middle[index], 0));
  for (const progress of [0, 1, .2, .88, .4, 1, 0]) await seek(page, progress);
  expect(await offsets(page)).toEqual(initial);
  await expect(page.locator('[data-name-first]')).toHaveCSS('opacity', '1');
  await expect(page.locator('[data-darkness]')).toHaveCSS('opacity', '0');
});

test('wheel and keyboard scrolling stay synchronized, navigation and replay work', async ({ page }) => {
  await load(page);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(200);
  await page.mouse.wheel(0, -200);
  await page.keyboard.press('End');
  await expect(page.locator('.opening')).toHaveAttribute('data-phase', 'complete');
  await expect(page.locator('.opening')).toHaveAttribute('data-cinematic-phase', 'settled');
  await page.locator('.contact-footer button').click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(2);
  await page.getByRole('button', { name: '02 Identity' }).click();
  await expect(page.locator('.opening')).toHaveAttribute('data-phase', 'complete');
  await expect(page.getByRole('button', { name: '02 Identity' })).toHaveAttribute('aria-current', 'step');
  await page.getByRole('link', { name: 'Deepanshu Singhal, return to opening' }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(2);
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle)).not.toBe('none');
});

for (const viewport of [{ width: 390, height: 844 }, { width: 320, height: 568 }, { width: 768, height: 1024 }, { width: 1280, height: 720 }, { width: 844, height: 390 }]) {
  test(`responsive composition at ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await load(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const portrait = await page.locator('.avatar-image-wrap').boundingBox();
    expect(portrait!.x + portrait!.width / 2).toBeCloseTo(viewport.width / 2, 0);
    expect(portrait!.y).toBeGreaterThan(55);
    // The bust intentionally crops at the stage edge; the face stays fully in view.
    const head = await page.locator('.face-cage-fallback').boundingBox();
    expect(head!.x).toBeGreaterThan(0);
    expect(head!.x + head!.width).toBeLessThan(viewport.width);
    expect(head!.height).toBeLessThan(portrait!.height * .3);
    await expect(page.locator('.portrait-orbit')).toHaveCount(0);
    await seek(page, 1);
    const signature = await page.locator('.signature').boundingBox();
    const caption = await page.locator('.signature-caption').boundingBox();
    const footer = await page.locator('.opening-footer').boundingBox();
    expect(signature!.x).toBeGreaterThan(0);
    expect(signature!.x + signature!.width).toBeLessThan(viewport.width);
    expect(caption!.y + caption!.height).toBeLessThan(footer!.y - 10);
    if (viewport.width <= 700) {
      const progress = await page.locator('.sequence-progress').boundingBox();
      expect(caption!.y + caption!.height).toBeLessThan(progress!.y - 8);
    }
    expect(await offsets(page)).toEqual([0, 0, 0]);
    await page.screenshot({ path: `artifacts/screenshots/verified-${viewport.width}-${viewport.height}-end.png` });
    await seek(page, 0);
    await page.screenshot({ path: `artifacts/screenshots/verified-${viewport.width}-${viewport.height}-opening.png` });
  });
}

test('resize across breakpoints cleans up canvas and preserves the final identity', async ({ page }) => {
  await load(page);
  await seek(page, 1);
  for (const viewport of [{ width: 390, height: 844 }, { width: 1200, height: 800 }, { width: 390, height: 700 }]) {
    await page.setViewportSize(viewport);
    await expect(page.locator('.opening')).toHaveAttribute('data-ready', 'true');
    await page.waitForTimeout(200);
    await seek(page, 1);
    expect(await offsets(page)).toEqual([0, 0, 0]);
    await expect(page.locator('.portrait-webgl canvas')).toHaveCount(1);
  }
  await seek(page, 0);
  await expect(page.locator('[data-name-first]')).toHaveCSS('opacity', '1');
});

test('reduced motion is composed, reversible, and has no WebGL or idle drift', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await load(page);
  expect(await page.locator('canvas').count()).toBe(0);
  const transform = await page.locator('.avatar-image').evaluate(image => getComputedStyle(image).transform);
  await page.waitForTimeout(160);
  expect(await page.locator('.avatar-image').evaluate(image => getComputedStyle(image).transform)).toBe(transform);
  await seek(page, 1);
  expect(await offsets(page)).toEqual([0, 0, 0]);
  await expect(page.locator('.avatar-anchor')).toHaveCSS('opacity', '1');
  await seek(page, 0);
  await expect(page.locator('.avatar-anchor')).toHaveCSS('opacity', '1');
  expect((await offsets(page)).every(value => value > 250)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.opening')).toHaveAttribute('data-webgl-ready', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.portrait-webgl canvas')).toHaveCount(0);
});

test('refresh at the top and at a partial draw restores scroll-owned state', async ({ page }) => {
  await load(page);
  await seek(page, .6);
  const before = await offsets(page);
  await page.reload();
  await expect(page.locator('.opening')).toHaveAttribute('data-ready', 'true');
  await expect.poll(async () => Number(await page.locator('.opening').getAttribute('data-progress'))).toBeCloseTo(.6, 2);
  (await offsets(page)).forEach((value, index) => expect(value).toBeCloseTo(before[index], 0));
  await seek(page, 0);
  await page.reload();
  await expect(page.locator('.opening')).toHaveAttribute('data-ready', 'true');
  expect((await offsets(page)).every(value => value > 250)).toBe(true);
});

test('resize within desktop recomputes the portrait destination without losing the opening', async ({ page }) => {
  await load(page);
  await seek(page, 1);
  await page.setViewportSize({ width: 1150, height: 750 });
  await page.waitForTimeout(300);
  await seek(page, 1);
  const settled = await page.locator('.avatar-image-wrap').boundingBox();
  expect(settled!.x + settled!.width / 2).toBeCloseTo(1150 * .5, 0);
  expect(settled!.y).toBeCloseTo(750 * .26, 0);
  await seek(page, 0);
  await expect(page.locator('[data-name-first]')).toHaveCSS('opacity', '1');
  await expect(page.locator('[data-darkness]')).toHaveCSS('opacity', '0');
  const opening = await page.locator('.avatar-image-wrap').boundingBox();
  expect(opening!.x + opening!.width / 2).toBeCloseTo(575, 0);
  expect(opening!.width).toBeGreaterThan(settled!.width);
});

test('WebGL unavailable keeps the portrait and complete signature usable', async ({ browser }) => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type.includes('webgl')) return null;
      return original.apply(this, [type, ...args] as Parameters<typeof original>);
    } as typeof original;
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5173');
  await expect(page.locator('.opening')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('.face-cage-fallback')).toBeVisible();
  await seek(page, 1);
  expect(await offsets(page)).toEqual([0, 0, 0]);
  await context.close();
});

 test('portrait frame contracts around the centered image while signature overlays it', async ({ page }) => {
  await load(page);
  await expect(page.locator('[data-portrait-window]')).toHaveCSS('clip-path', 'inset(0%)');
  await seek(page, .46);
  const during = await page.locator('.avatar-image-wrap').boundingBox();
  const typeBefore = await page.locator('[data-type-first]').evaluate(el => getComputedStyle(el).transform);
  await seek(page, 1);
  const portrait = await page.locator('.avatar-image-wrap').boundingBox();
  const signature = await page.locator('.signature').boundingBox();
  expect(portrait!.width).toBeLessThan(during!.width);
  expect(signature!.x + signature!.width / 2).toBeCloseTo(portrait!.x + portrait!.width / 2, 0);
  expect(signature!.y + signature!.height / 2).toBeGreaterThan(portrait!.y);
  expect(signature!.y).toBeLessThan(portrait!.y + portrait!.height);
  await expect(page.locator('[data-portrait-window]')).toHaveCSS('clip-path', 'inset(22%)');
  expect(await page.locator('[data-type-first]').evaluate(el => getComputedStyle(el).transform)).not.toBe(typeBefore);
  await seek(page, 0);
  await expect(page.locator('[data-portrait-window]')).toHaveCSS('clip-path', 'inset(0%)');
  await expect(page.locator('.avatar-image')).toHaveCSS('filter', 'saturate(0.79) contrast(0.98) brightness(1)');
});
