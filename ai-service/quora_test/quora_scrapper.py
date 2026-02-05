from playwright.sync_api import sync_playwright
import json
import time
from pathlib import Path
from db.neon import get_cursor

COOKIE_FILE = "quora_cookies.json"
OUTPUT_FILE = "quora_real_posts.json"

def scrape_quora_with_cookies():
    cursor = get_cursor()  # ✅ DB cursor

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()

        # Load cookies
        cookies = json.load(open(COOKIE_FILE, "r", encoding="utf-8"))
        context.add_cookies(cookies)

        page = context.new_page()

        print("Opening Quora search page with cookies...")
        page.goto("https://www.quora.com/search?q=startup%20crm", timeout=60000)

        time.sleep(5)

        # Scroll to load content
        for _ in range(4):
            page.mouse.wheel(0, 4000)
            time.sleep(2)

        posts = []

        # Grab all links
        links = page.query_selector_all("a")

        for link in links:
            try:
                text = link.inner_text().strip()
                href = link.get_attribute("href")

                if not text or not href:
                    continue

                if href.startswith("/"):
                    href = "https://www.quora.com" + href

                # Heuristic for question URLs
                if "quora.com/" in href and len(text) > 20:
                    post = {
                        "platform": "quora",
                        "text": text,
                        "url": href,
                        "author": None
                    }

                    posts.append(post)

                    # ✅ INSERT INTO NEON DB (RIGHT PLACE)
                    cursor.execute(
                        """
                        INSERT INTO social_posts (platform, text, url, author)
                        VALUES (%s, %s, %s, %s)
                        ON CONFLICT (url) DO NOTHING
                        """,
                        ("quora", text, href, None)
                    )

                    print("INSERTED:", text[:50])

            except Exception as e:
                print("Error parsing link:", e)

        browser.close()

    # Deduplicate for JSON backup
    unique = {p["url"]: p for p in posts}
    posts = list(unique.values())

    # ✅ JSON backup (optional but good)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

    print(f"✅ Saved {len(posts)} posts to DB and {OUTPUT_FILE}")

if __name__ == "__main__":
    scrape_quora_with_cookies()
