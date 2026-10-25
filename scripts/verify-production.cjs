const { chromium } = require('@playwright/test');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = [];
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const issues = [];
    page.on('pageerror', error => issues.push(error.message));
    page.on('console', message => { if (['error', 'warning'].includes(message.type())) issues.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) issues.push(`${response.status()} ${response.url()}`); });
    await page.goto('http://127.0.0.1:4173');
    await page.waitForSelector('[data-ready="true"]');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `artifacts/screenshots/production-${viewport.width}-opening.png` });
    const frames = await page.evaluate(async () => {
      const samples = [];
      let previous = performance.now();
      await new Promise(resolve => {
        let frame = 0;
        const sample = now => {
          if (frame > 0) samples.push(now - previous);
          previous = now;
          window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * Math.min(1, frame / 140));
          if (++frame <= 145) requestAnimationFrame(sample); else resolve();
        };
        requestAnimationFrame(sample);
      });
      samples.sort((a, b) => a - b);
      return { medianFrameMs: samples[Math.floor(samples.length / 2)], p95FrameMs: samples[Math.floor(samples.length * .95)], frames: samples.length };
    });
    const state = await page.evaluate(() => ({
      phase: document.querySelector('.opening').dataset.phase,
      signatureOffsets: [...document.querySelectorAll('.signature path')].map(path => getComputedStyle(path).strokeDashoffset),
      canvases: document.querySelectorAll('canvas').length,
      webgl: document.querySelector('.opening').dataset.webglReady,
      overflow: document.documentElement.scrollWidth > innerWidth,
      fcpMs: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      fetchedThree: performance.getEntriesByType('resource').some(resource => /three-.*\.js/.test(resource.name)),
      fontsLoaded: document.fonts.status,
    }));
    await page.screenshot({ path: `artifacts/screenshots/production-${viewport.width}-end.png` });
    results.push({ viewport, issues, ...frames, ...state });
    if (issues.length || state.overflow || state.phase !== 'complete' || state.signatureOffsets.some(value => value !== '0px')) process.exitCode = 1;
    await page.close();
  }
  fs.writeFileSync('artifacts/production-check.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
