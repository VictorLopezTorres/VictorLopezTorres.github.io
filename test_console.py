from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Listen for console logs
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"Browser Page Error: {exc}"))

        page.goto('http://localhost:8080/index.html')
        page.evaluate("window.isMuted = true")
        time.sleep(1)

        # Test FILL_BLANK Mode
        page.locator("#fillBlankModeBtn").click()
        time.sleep(1)
        page.locator("#acceptFillBlankBtn").click()
        time.sleep(1)

        page.evaluate("document.getElementById('gradeLevelSelect').value = 'grade6'")
        page.locator("#startGameBtn").click()
        time.sleep(3)

        browser.close()

if __name__ == '__main__':
    run()
