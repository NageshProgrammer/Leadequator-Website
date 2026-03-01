from playwright.sync_api import sync_playwright
from pathlib import Path
import time

SESSION_FILE = Path(__file__).parent / "reddit_state.json"

def save_session():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()

        page.goto("https://www.reddit.com/login", timeout=60000)

        print("👉 Login manually.")
        print("👉 After homepage loads, wait 40 seconds.")

        time.sleep(40)

        context.storage_state(path=SESSION_FILE)
        print("✅ Session saved to reddit_state.json")

        browser.close()

if __name__ == "__main__":
    save_session()
