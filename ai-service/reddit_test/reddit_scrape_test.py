import requests
from typing import List, Optional
from datetime import datetime
from reddit_test.db.neon import get_cursor
import time

# ----------------------------------------
# CONFIG
# ----------------------------------------

MAX_POSTS_PER_RUN = 5

HEADERS = {
    "User-Agent": "LeadEquatorApp/1.0 by NageshY"
}

# ----------------------------------------
# MAIN SCRAPER
# ----------------------------------------

def scrape_reddit(
    user_id: str,
    keywords: Optional[List[str]] = None
):
    cursor = get_cursor()
    inserted = 0

    if not keywords:
        print("⚠️ No keywords provided.")
        return

    collected_urls = set()

    for keyword in keywords:
        if inserted >= MAX_POSTS_PER_RUN:
            break

        params = {
            "q": keyword,
            "sort": "new",
            "limit": 25
        }

        try:
            response = requests.get(
                "https://www.reddit.com/search.json",
                headers=HEADERS,
                params=params,
                timeout=10
            )

            if response.status_code != 200:
                print("❌ Reddit API error:", response.status_code)
                continue

            data = response.json()

            for item in data["data"]["children"]:
                if inserted >= MAX_POSTS_PER_RUN:
                    break

                post = item["data"]

                title = post.get("title")
                permalink = post.get("permalink")
                author = post.get("author")

                if not title or not permalink:
                    continue

                full_url = "https://www.reddit.com" + permalink

                # Avoid duplicate inserts in same run
                if full_url in collected_urls:
                    continue

                collected_urls.add(full_url)

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

            time.sleep(1)  # rate limiting

        except Exception as e:
            print("❌ Reddit request error:", e)

    print(f"🎉 Reddit scraping finished — inserted {inserted} posts (MAX {MAX_POSTS_PER_RUN})")