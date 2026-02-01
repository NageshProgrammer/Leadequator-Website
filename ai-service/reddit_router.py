from fastapi import APIRouter, HTTPException
from typing import List
import os
import json
import praw

router = APIRouter(prefix="/scrape-reddit", tags=["Reddit"])

USE_MOCK = os.getenv("USE_MOCK_REDDIT", "true").lower() == "true"


def get_reddit_client():
    client_id = os.getenv("REDDIT_CLIENT_ID")
    client_secret = os.getenv("REDDIT_CLIENT_SECRET")

    if not client_id or not client_secret:
        raise RuntimeError("Reddit credentials not set")

    return praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        user_agent="leadequator-ai"
    )


@router.post("/")
def scrape_reddit(keywords: List[str]):
    if not keywords or not isinstance(keywords, list):
        raise HTTPException(status_code=400, detail="Keywords list is empty or invalid")

    # ✅ MOCK MODE (default for local + Azure)
    if USE_MOCK:
        try:
            base_dir = os.path.dirname(__file__)
            mock_path = os.path.join(
                base_dir, "reddit_test", "mock_reddit_posts.json"
            )

            with open(mock_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            return {
                "mode": "mock",
                "count": len(data),
                "posts": data
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ✅ REAL MODE
    try:
        reddit = get_reddit_client()
        subreddit = reddit.subreddit("startups")

        results = []

        for kw in keywords:
            for post in subreddit.search(kw, limit=5):
                results.append({
                    "keyword": kw,
                    "title": post.title,
                    "url": post.url,
                    "score": post.score,
                    "comments": post.num_comments,
                    "subreddit": str(post.subreddit),
                })

        return {
            "mode": "real",
            "count": len(results),
            "posts": results,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
