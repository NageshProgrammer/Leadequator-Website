from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from reddit_test.reddit_scrape_test import scrape_reddit
from reddit_test.reddit_generate_replies import generate_reddit_replies

router = APIRouter(
    prefix="/reddit",
    tags=["Reddit"]
)

class RedditRunRequest(BaseModel):
    userId: str
    keywords: Optional[List[str]] = None


@router.post("/run")
def run_reddit_pipeline(payload: RedditRunRequest):
    try:
        scrape_reddit(
            user_id=payload.userId,
            keywords=payload.keywords
        )

        generate_reddit_replies(user_id=payload.userId)

        return {
            "status": "success",
            "message": "Reddit scraping and reply generation completed"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
