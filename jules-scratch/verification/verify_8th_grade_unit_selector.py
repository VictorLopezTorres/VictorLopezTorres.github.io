
from playwright.sync_api import sync_playwright
import os

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the local index.html file
        file_path = os.path.abspath('index.html')
        page.goto(f'file://{file_path}')

        # Click the "Easy" mode button to proceed
        page.click('#easyModeBtn')

        # Wait for the grade modal to be visible and select 8th grade
        page.wait_for_selector('#gradeModal', state='visible')
        page.select_option('#gradeLevelSelect', 'grade8')

        # Click the "Start Game" button
        page.click('#startGameBtn')

        # Wait for the unit modal to be visible
        page.wait_for_selector('#unitModal', state='visible')

        # Take a screenshot of the unit selection modal
        page.screenshot(path='jules-scratch/verification/verification.png')

        browser.close()

if __name__ == "__main__":
    run_verification()
