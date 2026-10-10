const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  console.log("Loading page...");
  await page.goto('http://localhost:8080/#/jumm', { waitUntil: 'networkidle0' });
  
  console.log("Taking screenshot of home...");
  await page.screenshot({ path: '/Users/jakkapatmac/.gemini/antigravity-ide/brain/a2288d2d-d59a-4cad-814a-ea44c6d376c0/tear_screenshot_1_home.jpg', type: 'jpeg', quality: 90 });
  
  console.log("Clicking JUMM nav button...");
  await page.evaluate(() => document.querySelector('#tcg-nav-jumm').click());
  
  console.log("Waiting for tear scene to appear...");
  await page.waitForSelector('.tcg-tear-scene', { visible: true, timeout: 5000 });
  await new Promise(r => setTimeout(r, 1000)); // Wait for animation
  
  console.log("Taking screenshot of tear scene...");
  await page.screenshot({ path: '/Users/jakkapatmac/.gemini/antigravity-ide/brain/a2288d2d-d59a-4cad-814a-ea44c6d376c0/tear_screenshot_2_scene.jpg', type: 'jpeg', quality: 90 });
  
  // Simulate drag on the pack
  console.log("Simulating drag to tear...");
  const pack = await page.$('#tear-pack');
  if (pack) {
    const box = await pack.boundingBox();
    const startX = box.x + box.width / 2;
    const startY = box.y + 20; // Top of the pack
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    
    // Move down 50 pixels (halfway)
    await page.mouse.move(startX, startY + 50, { steps: 10 });
    await new Promise(r => setTimeout(r, 500));
    console.log("Taking screenshot of tearing progress...");
    await page.screenshot({ path: '/Users/jakkapatmac/.gemini/antigravity-ide/brain/a2288d2d-d59a-4cad-814a-ea44c6d376c0/tear_screenshot_3_tearing.jpg', type: 'jpeg', quality: 90 });
    
    // Complete tear
    await page.mouse.move(startX, startY + 120, { steps: 10 });
    await page.mouse.up();
    
    console.log("Waiting for results...");
    await page.waitForSelector('.tear-result', { visible: true, timeout: 5000 });
    await new Promise(r => setTimeout(r, 2000)); // Wait for fan out animation
    
    console.log("Taking screenshot of result...");
    await page.screenshot({ path: '/Users/jakkapatmac/.gemini/antigravity-ide/brain/a2288d2d-d59a-4cad-814a-ea44c6d376c0/tear_screenshot_4_result.jpg', type: 'jpeg', quality: 90 });
  } else {
    console.log("Could not find #tear-pack");
  }

  await browser.close();
  console.log("Done.");
})();
