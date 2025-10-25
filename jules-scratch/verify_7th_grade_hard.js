const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/../index.html');

  // Start the game in 7th Grade Hard Mode
  await page.click('#hardModeBtn');
  await page.selectOption('#gradeLevelSelect', 'grade7');
  await page.click('#startGameBtn');

  // Wait for the game to start and take a screenshot
  await page.waitForSelector('#gameArea');
  await page.screenshot({ path: 'jules-scratch/7th_grade_hard_regression.png' });

  await browser.close();
})();
