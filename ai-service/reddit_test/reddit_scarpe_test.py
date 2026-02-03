import sys
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT_DIR))

from playwright.sync_api import sync_playwright
from db.neon import get_cursor

SUBREDDIT = "startups"
SESSION_FILE = Path(__file__).parent / "auth" / "reddit_state.json"


def manual_login_and_save_session():
    print("🔐 Manual Reddit login required")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()

        page.goto("https://www.reddit.com/login", timeout=60000)
        print("👉 Login manually, wait 25 seconds...")
        time.sleep(25)

        SESSION_FILE.parent.mkdir(parents=True, exist_ok=True)
        context.storage_state(path=SESSION_FILE)

        browser.close()

    print("✅ Reddit session saved")


def scrape_reddit():
    cursor = get_cursor()
    inserted = 0

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=False)

        context = browser.new_context(
            storage_state=SESSION_FILE,
            viewport={"width": 1280, "height": 800},
        )

        page = context.new_page()
        page.goto(f"https://www.reddit.com/r/{SUBREDDIT}/", timeout=60000)

        page.wait_for_timeout(8000)
        page.mouse.wheel(0, 4000)
        page.wait_for_timeout(3000)

        cards = page.locator("shreddit-post")
        total = cards.count()

        print(f"📌 Found Reddit posts: {total}")

        for i in range(min(total, 20)):  # safety limit
            try:
                card = cards.nth(i)

                title = card.get_attribute("post-title") or ""
                username = card.get_attribute("author") or "unknown"
                permalink = card.get_attribute("permalink") or ""

                if not title.strip() or not permalink:
                    continue

                post_url = f"https://www.reddit.com{permalink}"

                print("➡️ INSERTING:", title[:70])

                cursor.execute(
                    """
                    INSERT INTO social_posts (platform, text, url, author)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (url) DO NOTHING
                    """,
                    (
                        "reddit",
                        title.strip(),
                        post_url,
                        username
                    )
                )

                inserted += 1
                print("✅ INSERT OK")

            except Exception as e:
                print("❌ INSERT FAILED:", e)

        browser.close()

    print(f"🎉 Reddit scraping finished — inserted {inserted} rows")


if __name__ == "__main__":
    if not SESSION_FILE.exists():
        manual_login_and_save_session()

    scrape_reddit()
