from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.route("**/*", lambda route: route.abort() if route.request.resource_type in ["image", "media", "font"] or "unpkg" in route.request.url or "googleapis" in route.request.url else route.continue_())

        # Test FILL_BLANK Mode
        page.goto('http://localhost:8080/index.html')
        page.evaluate("window.isMuted = true")
        time.sleep(1)

        page.locator('#fillBlankModeBtn').click()
        time.sleep(1)
        page.locator('#acceptFillBlankBtn').click()
        time.sleep(1)

        page.evaluate("document.getElementById('gradeLevelSelect').value = 'grade6'")
        page.locator('#startGameBtn').click()
        time.sleep(1)

        chips = page.locator('.word-chip').all()
        slots = page.locator('.blank-slot').all()
        print(f"Fill Blank Game Mode: Chips: {len(chips)}, Slots: {len(slots)}")

        for i, slot in enumerate(slots):
            # Click a chip strictly from the word bank
            chip = page.locator('#fill-blank-wordbank .word-chip').first
            chip.click()
            time.sleep(0.5)
            slot.click()
            time.sleep(0.5)

        time.sleep(1)
        is_disabled = page.evaluate("document.getElementById('fill-blank-submit').disabled")
        print(f"Submit Disabled: {is_disabled}")

        if not is_disabled:
            page.locator('#fill-blank-submit').click()
            time.sleep(1)
            score = page.evaluate("playerState.score")
            print(f"Score after submit: {score}")

        browser.close()

if __name__ == '__main__':
    run()
