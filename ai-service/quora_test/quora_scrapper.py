from playwright.sync_api import sync_playwright
from urllib.parse import quote_plus
from pathlib import Path
import json

from quora_test.db.neon import get_cursor

COOKIE_FILE = Path(__file__).parent / "quora_cookies.json"


def scrape_quora(user_id: str, keywords: list[str]):
    cursor, conn = get_cursor()
    inserted = 0

    if not keywords:
        print("⚠️ No keywords provided")
        try:
            conn.close()
        except Exception:
            pass
        return 0

    if not COOKIE_FILE.exists():
        print("❌ Login required. Run quora_login.py first.")
        return

    search_query = quote_plus(" ".join(keywords))
    search_url = f"https://www.quora.com/search?q={search_query}"

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )

        context = browser.new_context()

        # Load saved cookies
        with open(COOKIE_FILE, "r", encoding="utf-8") as f:
            cookies = json.load(f)

        context.add_cookies(cookies)

        page = context.new_page()

        print("🔍 Opening:", search_url)
        page.goto(search_url, timeout=60000)
        page.wait_for_timeout(8000)

        # Scroll
        for _ in range(8):
            page.mouse.wheel(0, 6000)
            page.wait_for_timeout(3000)

        question_links = page.locator("a[href*='/']")

        total = question_links.count()
        print("📊 Total anchor elements found:", total)

        seen = set()

        for i in range(min(total, 50)):
            try:
                link = question_links.nth(i)

                href = link.get_attribute("href")
                text = (link.inner_text() or "").strip()

                if not href or not text:
                    continue

                if "/profile/" in href:
                    continue
                if "/search?" in href:
                    continue
                if len(text) < 40:
                    continue
                if "?" in href:
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

                # Count only actual inserts (ON CONFLICT DO NOTHING may skip)
                try:
                    if cursor.rowcount and cursor.rowcount > 0:
                        inserted += 1
                        print("✅ INSERTED:", text[:80])
                    else:
                        print("⚠️ Skipped (exists):", text[:80])
                except Exception:
                    # Some psycopg2 drivers may not set rowcount reliably for
                    # certain servers; assume success if no exception
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
