from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Construct the full path to the HTML file
            base_dir = os.getcwd()
            file_path = os.path.join(base_dir, 'index.html')

            # Use 'file://' prefix for local files
            page.goto(f'file://{file_path}')

            # 1. Choose "Easy Mode"
            print("Clicking Easy Mode button...")
            page.click('#easyModeBtn')

            # 2. Select "6th Grade" from the dropdown
            print("Waiting for grade modal...")
            page.wait_for_selector('#gradeModal', state='visible')
            print("Selecting 6th grade...")
            page.select_option('#gradeLevelSelect', 'grade6')

            # 3. Click "Start Game!"
            print("Clicking Start Game button...")
            page.click('#startGameBtn')

            # 4. Wait for the unit selection modal to appear
            print("Waiting for unit modal...")
            page.wait_for_selector('#unitModal', state='visible')

            # 5. Click the "Unit 1" button
            print("Clicking Unit 1 button...")
            page.click('button[data-unit="1"]')

            # 6. Verify that the game area is now visible
            print("Waiting for game area...")
            page.wait_for_selector('#gameArea', state='visible')

            # 7. Take a screenshot to confirm the final state
            screenshot_path = 'jules-scratch/verification/unit_selection_success.png'
            page.screenshot(path=screenshot_path)
            print(f"Verification successful! Screenshot saved to {screenshot_path}")

        except Exception as e:
            print(f"An error occurred: {e}")
            page.screenshot(path='jules-scratch/verification/error_screenshot.png')
            print("Error screenshot saved.")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
