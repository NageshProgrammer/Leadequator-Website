import json
from pathlib import Path

MOCK_FILE = Path(__file__).parent / "mock_reddit_posts.json"

def scrape_reddit(keywords):
    with open(MOCK_FILE, "r", encoding="utf-8") as f:
        all_posts = json.load(f)

    results = []

    for kw in keywords:
        posts = [p for p in all_posts if kw.lower() in p["keyword"].lower()]
        results.append({
            "keyword": kw,
            "posts": posts
        })

    return results
