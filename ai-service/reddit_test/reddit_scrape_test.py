import sys
import time
from pathlib import Path
from typing import List, Optional

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT_DIR))

from playwright.sync_api import sync_playwright
from reddit_test.db.neon import get_cursor

SUBREDDIT = "startups"
SESSION_FILE = Path(__file__).parent / "auth" / "reddit_state.json"


# --------------------------------------------------
# MANUAL LOGIN (UNCHANGED)
# --------------------------------------------------
def manual_login_and_save_session():
    print("🔐 Manual Reddit login required")

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu"
            ]
        )
        context = browser.new_context()
        page = context.new_page()

        page.goto("https://www.reddit.com/login", timeout=60000)
        print("👉 Login manually, wait 25 seconds...")
        time.sleep(25)

        SESSION_FILE.parent.mkdir(parents=True, exist_ok=True)
        context.storage_state(path=SESSION_FILE)

        browser.close()

    print("✅ Reddit session saved")


# --------------------------------------------------
# SCRAPER (EXTENDED, NOT REPLACED)
# --------------------------------------------------
def scrape_reddit(
    user_id: Optional[str] = None,
    keywords: Optional[List[str]] = None
):
    """
    If keywords are provided → search-based scraping
    Else → subreddit scraping (existing behavior)
    """

    cursor = get_cursor()
    inserted = 0

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=False)

        context = browser.new_context(
            storage_state=SESSION_FILE,
            viewport={"width": 1280, "height": 800},
        )

        page = context.new_page()

        # 🔁 MODE SELECTION (SAFE)
        if keywords:
            query = " OR ".join(keywords)
            url = f"https://www.reddit.com/search/?q={query}&sort=new"
            print(f"🔍 Searching Reddit for keywords: {keywords}")
        else:
            url = f"https://www.reddit.com/r/{SUBREDDIT}/"
            print(f"📂 Scraping subreddit: r/{SUBREDDIT}")

        page.goto(url, timeout=60000)

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

                # 🧠 SAFE INSERT (user_id optional)
                cursor.execute(
                    """
                    INSERT INTO social_posts (platform, text, url, author, user_id)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (url) DO NOTHING
                    """,
                    (
                        "reddit",
                        title.strip(),
                        post_url,
                        username,
                        user_id
                    )
                )

                inserted += 1
                print("✅ INSERT OK")

            except Exception as e:
                print("❌ INSERT FAILED:", e)

        browser.close()

    print(f"🎉 Reddit scraping finished — inserted {inserted} rows")


# --------------------------------------------------
# LOCAL RUN (UNCHANGED)
# --------------------------------------------------
if __name__ == "__main__":
    if not SESSION_FILE.exists():
        manual_login_and_save_session()

    scrape_reddit()
