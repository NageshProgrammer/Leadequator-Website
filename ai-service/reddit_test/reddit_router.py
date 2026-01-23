from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from reddit_scraper import scrape_reddit

router = APIRouter()

class RedditRequest(BaseModel):
    keywords: List[str]

@router.post("/scrape-reddit")
def scrape_reddit_endpoint(data: RedditRequest):
    if not data.keywords:
        return {"error": "No keywords provided"}

    results = scrape_reddit(
        keywords=data.keywords,
        subreddits=("startups",),
        limit=5
    )

    return {
        "platform": "reddit",
        "results": results
    }
