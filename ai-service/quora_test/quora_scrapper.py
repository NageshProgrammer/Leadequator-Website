from playwright.sync_api import sync_playwright
from urllib.parse import quote_plus
from pathlib import Path
import json
import re

from quora_test.db.neon import get_cursor

COOKIE_FILE = Path(__file__).parent / "quora_cookies.json"


def scrape_quora(user_id: str, keywords: list[str]):
    cursor, conn = get_cursor()
    inserted = 0

    if not keywords:
        print("⚠️ No keywords provided")
        return 0

    if not COOKIE_FILE.exists():
        print("❌ Login required. Run quora_login.py first.")
        return 0

    search_query = quote_plus(" ".join(keywords))
    search_url = f"https://www.quora.com/search?q={search_query}"

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )

        context = browser.new_context()

        # Load cookies
        with open(COOKIE_FILE, "r", encoding="utf-8") as f:
            cookies = json.load(f)

        context.add_cookies(cookies)

        page = context.new_page()

        print("🔍 Opening:", search_url)
        page.goto(search_url, timeout=60000)
        page.wait_for_timeout(5000)

        print("📄 Page title:", page.title())

        # Scroll slowly
        for _ in range(5):
            page.mouse.wheel(0, 4000)
            page.wait_for_timeout(2000)

        # Better selector for question links
        links = page.locator("a")

        total = links.count()
        print("📊 Total anchor elements found:", total)

        seen = set()

        for i in range(total):
            try:
                link = links.nth(i)

                href = link.get_attribute("href")
                text = (link.inner_text() or "").strip()

                if not href or not text:
                    continue

                # Only question-like URLs
                if not href.startswith("/"):
                    continue

                if "/profile/" in href:
                    continue

                if "/search?" in href:
                    continue

                if len(text) < 30:
                    continue

                # Must contain dash or readable sentence
                if not re.search(r"[A-Za-z]", text):
                    continue

                full_url = "https://www.quora.com" + href

                if full_url in seen:
                    continue

                seen.add(full_url)

                cursor.execute(
                    """
                    INSERT INTO quora_posts
                    (user_id, platform, question, url, author)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (url) DO NOTHING
                    """,
                    (
                        user_id,
                        "quora",
                        text,
                        full_url,
                        None
                    )
                )

                conn.commit()

                if cursor.rowcount > 0:
                    inserted += 1
                    print("✅ INSERTED:", text[:80])

            except Exception as e:
                print("❌ Skip error:", e)

        browser.close()

    try:
        conn.close()
    except Exception:
        pass

    print(f"🎉 Quora scraping finished — inserted {inserted} rows")
    return inserted
