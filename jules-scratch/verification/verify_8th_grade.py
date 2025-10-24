import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        html_file_path = os.path.abspath('index.html')
        await page.goto(f'file://{html_file_path}')

        # 1. Wait for the difficulty modal to be visible, then click Easy Mode
        await page.wait_for_selector('div#difficultyModal', state='visible')
        await asyncio.sleep(1) # Add a small delay
        await page.click('div#easyModeBtn')

        # 2. Wait for the grade modal to be visible
        await page.wait_for_selector('div#gradeModal', state='visible')

        # 3. Now select the 8th Grade option
        await page.select_option('select#gradeLevelSelect', 'grade8')

        # 4. Click the "Start Game!" button
        await page.click('button#startGameBtn')

        # 5. Wait for the unit modal to be visible
        await page.wait_for_selector('div#unitModal', state='visible')

        # 6. Take a screenshot of the unit modal
        await page.screenshot(path='jules-scratch/verification/unit_selection.png')

        # 7. Click the first unit button
        await page.click('button.unit-btn[data-unit="1"]')

        # 8. Wait for the game area to be visible
        await page.wait_for_selector('section#gameArea', state='visible')

        # 9. Take a screenshot of the game screen
        await page.screenshot(path='jules-scratch/verification/game_screen.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
