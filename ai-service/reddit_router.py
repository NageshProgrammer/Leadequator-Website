from fastapi import APIRouter
import os
import praw

router = APIRouter(prefix="/scrape-reddit", tags=["Reddit"])

def get_reddit_client():
    return praw.Reddit(
        client_id=os.getenv("REDDIT_CLIENT_ID"),
        client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
        user_agent="leadequator-ai"
    )

@router.post("/")
def scrape_reddit(keywords: list[str]):
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
                "subreddit": str(post.subreddit)
            })

    return {
        "count": len(results),
        "posts": results
    }
