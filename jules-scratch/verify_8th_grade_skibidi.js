const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/../index.html');

  // Start the game in 8th Grade Skibidi Mode, Unit 1
  await page.click('#skibidiModeBtn');
  await page.click('#acceptSkibidiBtn');
  await page.selectOption('#gradeLevelSelect', 'grade8');
  await page.click('#startGameBtn');
  await page.click('button[data-unit="1"]');

  // Wait for the game to start and take a screenshot
  await page.waitForSelector('#gameArea');
  await page.screenshot({ path: 'jules-scratch/8th_grade_skibidi_fix.png' });

  await browser.close();
})();
