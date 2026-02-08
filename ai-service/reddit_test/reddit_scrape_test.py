from playwright.sync_api import sync_playwright
from typing import List, Optional
from pathlib import Path
from urllib.parse import quote_plus
from reddit_test.db.neon import get_cursor
import time

# ----------------------------------------
# CONFIG
# ----------------------------------------

SESSION_FILE = Path(__file__).parent / "auth" / "reddit_state.json"
SUBREDDIT = "startups"

# ----------------------------------------
# MAIN SCRAPER
# ----------------------------------------

def scrape_reddit(
    user_id: str,
    keywords: Optional[List[str]] = None
):
    cursor = get_cursor()
    inserted = 0

    if not SESSION_FILE.exists():
        print("❌ reddit_state.json not found. Login first.")
        return

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)

        # ✅ Load saved session
        context = browser.new_context(
            storage_state=str(SESSION_FILE),
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )

        page = context.new_page()

        # ----------------------------------------
        # BUILD SEARCH URL
        # ----------------------------------------

        if keywords:
            query = quote_plus(" ".join(keywords))
            url = f"https://www.reddit.com/search/?q={query}&sort=new"
            print("🔍 Searching Reddit:", keywords)
        else:
            url = f"https://www.reddit.com/r/{SUBREDDIT}/"
            print("📂 Scraping subreddit:", SUBREDDIT)

        page.goto(url, timeout=60000)

        time.sleep(5)

        print("Current URL:", page.url)
        print("Page title:", page.title())

        # ----------------------------------------
        # WAIT FOR POSTS
        # ----------------------------------------

        try:
            page.wait_for_selector("shreddit-post", timeout=15000)
        except:
            print("⚠️ No shreddit-post found. Possibly blocked or not logged in.")
            browser.close()
            return

        posts = page.locator("shreddit-post")
        total = posts.count()

        print("📊 Found shreddit-post elements:", total)

        # ----------------------------------------
        # LOOP POSTS
        # ----------------------------------------

        for i in range(min(total, 20)):
            try:
                post = posts.nth(i)

                title = post.get_attribute("post-title")
                permalink = post.get_attribute("permalink")
                author = post.get_attribute("author")

                if not title or not permalink:
                    continue

                full_url = f"https://www.reddit.com{permalink}"

                cursor.execute(
                    """
                    INSERT INTO reddit_posts
                    (user_id, platform, text, url, author)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (url) DO NOTHING
                    """,
                    (
                        user_id,
                        "reddit",
                        title.strip(),
                        full_url,
                        author
                    )
                )

                inserted += 1
                print("✅ INSERTED:", title[:80])

            except Exception as e:
                print("❌ Insert error:", e)

        browser.close()

    print(f"🎉 Reddit scraping finished — inserted {inserted} rows")
