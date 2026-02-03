from fastapi import APIRouter, HTTPException
from typing import Optional

# Reddit pipeline functions (DO NOT MODIFY THEM)
from reddit_test.reddit_scrape_test import scrape_reddit, manual_login_and_save_session
from reddit_test.reddit_generate_replies import generate_reddit_replies

router = APIRouter(
    prefix="/reddit",
    tags=["Reddit"]
)


@router.post("/run")
def run_reddit_pipeline(force_login: Optional[bool] = False):
    """
    Runs full Reddit pipeline:
    1. Manual login (only if session missing or forced)
    2. Scrape Reddit posts
    3. Generate AI replies
    """

    try:
        # Step 1: Ensure login session exists
        if force_login:
            manual_login_and_save_session()

        # Step 2: Scrape Reddit (inserts into DB)
        scrape_reddit()

        # Step 3: Generate replies (reads from DB)
        generate_reddit_replies()

        return {
            "status": "success",
            "message": "Reddit scraping + reply generation completed"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
