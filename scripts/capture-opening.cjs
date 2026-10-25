const { chromium } = require('@playwright/test');
const fs = require('node:fs');

(async () => {
  fs.mkdirSync('artifacts/screenshots', { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    page.on('pageerror', error => console.error(error.message));
    page.on('console', message => { if (['error', 'warning'].includes(message.type())) console.log(message.type(), message.text()); });
    await page.goto('http://127.0.0.1:5173');
    await page.waitForSelector('[data-ready="true"]');
    await page.screenshot({ path: `artifacts/screenshots/${viewport.width}-opening.png` });
    for (const progress of [.3, .6, 1]) {
      await page.evaluate(p => window.scrollTo(0, innerHeight * (matchMedia('(prefers-reduced-motion: reduce)').matches ? 1.2 : innerWidth <= 700 ? 2.7 : 3.2) * p), progress);
      await page.waitForTimeout(250);
      await page.screenshot({ path: `artifacts/screenshots/${viewport.width}-${progress}.png` });
    }
    console.log(JSON.stringify(await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, phase: document.querySelector('.opening').dataset, paths: [...document.querySelectorAll('.signature path')].map(p => getComputedStyle(p).strokeDashoffset) }))));
    await page.close();
  }
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
