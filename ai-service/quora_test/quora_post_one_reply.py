from playwright.sync_api import sync_playwright
import json
import time

COOKIE_FILE = "quora_cookies.json"
REPLIES_FILE = "quora_replies_output.json"

def post_one_reply():
    # Load generated replies
    with open(REPLIES_FILE, "r", encoding="utf-8") as f:
        replies = json.load(f)

    # Pick the first reply that is not posted yet
    target = None
    for r in replies:
        if not r.get("ready_to_post", False):
            target = r
            break

    if not target:
        print("No pending replies to post.")
        return

    print("Posting on:", target["post_url"])

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()

        # Load saved Quora cookies
        with open(COOKIE_FILE, "r", encoding="utf-8") as f:
            cookies = json.load(f)
        context.add_cookies(cookies)

        page = context.new_page()

        # Open the Quora question
        page.goto(target["post_url"], timeout=60000)
        time.sleep(8)  # behave like a human

        # STEP 1: Click the "Answer" button
        time.sleep(12)  # after page load
        page.click("text=Answer")
        time.sleep(8)   # before typing

        # STEP 2: Focus the editor using keyboard (MOST RELIABLE)
        # Quora editor focus is flaky via selectors
        page.keyboard.press("Tab")
        time.sleep(1)
        page.keyboard.press("Tab")
        time.sleep(1)

        # STEP 3: Type the reply slowly (human-like)
        page.keyboard.type(target["generated_reply"], delay=35)
        time.sleep(2)

        # STEP 4: Submit the answer
        page.keyboard.press("Enter")

        # Wait a bit to ensure submission
        time.sleep(6)

        browser.close()

    # Mark reply as posted
    target["ready_to_post"] = True

    with open(REPLIES_FILE, "w", encoding="utf-8") as f:
        json.dump(replies, f, indent=2, ensure_ascii=False)

    print("✅ One Quora reply posted successfully and marked as done.")

if __name__ == "__main__":
    post_one_reply()
