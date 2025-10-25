const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/../index.html');

  // Start the game in 8th Grade Easy Mode, Unit 2
  await page.click('#easyModeBtn');
  await page.selectOption('#gradeLevelSelect', 'grade8');
  await page.click('#startGameBtn');
  await page.click('button[data-unit="2"]');

  // Wait for the game to start and take a screenshot
  await page.waitForSelector('#gameArea');
  await page.screenshot({ path: 'jules-scratch/8th_grade_easy_regression.png' });

  await browser.close();
})();
