from playwright.sync_api import sync_playwright
from pathlib import Path
import json

COOKIE_FILE = Path(__file__).parent / "quora_cookies.json"

def save_cookies():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()

        print("🔐 Opening Quora login page...")
        page.goto("https://www.quora.com/login", timeout=60000)

        print("👉 Login manually in browser.")
        input("✅ After login completes, press ENTER here...")

        cookies = context.cookies()

        with open(COOKIE_FILE, "w", encoding="utf-8") as f:
            json.dump(cookies, f, indent=2)

        print(f"✅ Cookies saved to {COOKIE_FILE}")

        browser.close()

if __name__ == "__main__":
    save_cookies()
