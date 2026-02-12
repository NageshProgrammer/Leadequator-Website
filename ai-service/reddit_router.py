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
        if not payload.userId:
            raise HTTPException(status_code=400, detail="Missing userId")

        keywords = payload.keywords or []

        if not keywords:
            print("⚠️ No keywords provided for Reddit scraping")
            return {
                "status": "success",
                "message": "No keywords provided. Nothing scraped."
            }

        print(f"🚀 Starting Reddit pipeline for user: {payload.userId}")

        # 1️⃣ Scrape Reddit (should internally limit to 5 posts)
        scrape_reddit(
            user_id=payload.userId,
            keywords=keywords
        )

        # 2️⃣ Generate AI replies automatically
        generate_reddit_replies(
            user_id=payload.userId
        )

        print(f"✅ Reddit pipeline completed for user: {payload.userId}")

        return {
            "status": "success",
            "message": "Reddit scraping and reply generation completed"
        }

    except HTTPException:
        raise

    except Exception as e:
        print("❌ Reddit pipeline error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))