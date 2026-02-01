from playwright.sync_api import sync_playwright
import json
import os

COOKIE_FILE = "quora_cookies.json"

def save_cookies():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()

        print("Opening Quora login page...")
        page.goto("https://www.quora.com")

        print("👉 Log in manually in the browser.")
        print("👉 After login, wait for homepage to load.")
        print("👉 You have 60 seconds.")

        page.wait_for_timeout(60000)  # 60 seconds to login

        cookies = context.cookies()
        with open(COOKIE_FILE, "w", encoding="utf-8") as f:
            json.dump(cookies, f, indent=2)

        print("✅ Cookies saved to", COOKIE_FILE)

        browser.close()

if __name__ == "__main__":
    save_cookies()
