const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  console.log("Loading page...");
  await page.goto('http://localhost:8080/#/jumm', { waitUntil: 'networkidle0' });
  
  console.log("Taking screenshot of home...");
  await page.screenshot({ path: '/Users/jakkapatmac/.gemini/antigravity-ide/brain/a2288d2d-d59a-4cad-814a-ea44c6d376c0/new_pack_design_home.jpg', type: 'jpeg', quality: 90 });
  
  console.log("Clicking JUMM nav button...");
  await page.evaluate(() => document.querySelector('#tcg-nav-jumm').click());
  
  console.log("Waiting for tear scene to appear...");
  await page.waitForSelector('.tcg-tear-scene', { visible: true, timeout: 5000 });
  await new Promise(r => setTimeout(r, 1000)); // Wait for animation
  
  console.log("Taking screenshot of tear scene...");
  await page.screenshot({ path: '/Users/jakkapatmac/.gemini/antigravity-ide/brain/a2288d2d-d59a-4cad-814a-ea44c6d376c0/new_pack_design_tear.jpg', type: 'jpeg', quality: 90 });
  
  await browser.close();
  console.log("Done.");
})();
