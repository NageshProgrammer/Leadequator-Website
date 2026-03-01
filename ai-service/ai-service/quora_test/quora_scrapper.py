import os
import requests
from urllib.parse import quote_plus
from quora_test.db.neon import get_cursor


SERPAPI_KEY = os.getenv("SERPAPI_KEY")


def scrape_quora(user_id: str, keywords: list[str]):
    if not SERPAPI_KEY:
        raise RuntimeError("SERPAPI_KEY not set in environment")

    cursor, conn = get_cursor()
    inserted = 0

    if not keywords:
        print("⚠️ No keywords provided")
        return 0

    query = "site:quora.com " + " ".join(keywords)

    params = {
        "engine": "google",
        "q": query,
        "api_key": SERPAPI_KEY,
        "num": 20
    }

    print("🔎 Fetching Quora results via SerpAPI...")

    response = requests.get("https://serpapi.com/search", params=params)

    if response.status_code != 200:
        print("❌ SerpAPI request failed:", response.text)
        return 0

    data = response.json()

    results = data.get("organic_results", [])

    if not results:
        print("⚠️ No results returned from SerpAPI")
        return 0

    for result in results:
        try:
            url = result.get("link")
            title = result.get("title")

            if not url or not title:
                continue

            if "quora.com" not in url:
                continue

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
                    title,
                    url,
                    None
                )
            )

            conn.commit()

            if cursor.rowcount > 0:
                inserted += 1
                print("✅ INSERTED:", title)

        except Exception as e:
            print("❌ Insert error:", e)

    try:
        conn.close()
    except Exception:
        pass

    print(f"🎉 Quora fetch finished — inserted {inserted} rows")
    return inserted
