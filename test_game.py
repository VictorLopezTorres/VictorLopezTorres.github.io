from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.route("**/*", lambda route: route.abort() if route.request.resource_type in ["image", "media", "font"] or "unpkg" in route.request.url or "cdn" in route.request.url or "googleapis" in route.request.url else route.continue_())

        page.goto('http://localhost:8080/index.html')
        page.evaluate("window.isMuted = true")
        time.sleep(1)

        # Select Fill Blank
        page.evaluate("document.getElementById('fillBlankModeBtn').click()")
        time.sleep(1)

        page.evaluate("document.getElementById('acceptFillBlankBtn').click()")
        time.sleep(1)

        page.evaluate("document.getElementById('gradeLevelSelect').value = 'grade6'")
        page.evaluate("document.getElementById('startGameBtn').click()")
        time.sleep(1)

        mode = page.evaluate("gameMode")
        print(f"Current Game Mode: {mode}")

        chips = page.locator('.word-chip').all()
        slots = page.locator('.blank-slot').all()

        print(f"Chips: {len(chips)}, Slots: {len(slots)}")

        for slot in slots:
            chip = page.locator('.word-chip:not([style*="none"])').first
            chip.click()
            slot.click()

        time.sleep(1)
        is_disabled = page.evaluate("document.getElementById('fill-blank-submit').disabled")
        print(f"Submit Disabled: {is_disabled}")

        if not is_disabled:
            page.evaluate("document.getElementById('fill-blank-submit').click()")
            time.sleep(1)
            score = page.evaluate("playerState.score")
            print(f"Score after submit: {score}")

        browser.close()

if __name__ == '__main__':
    run()
