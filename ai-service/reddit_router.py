import sys
from pathlib import Path
from typing import Optional, List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# ------------------------------------------------------------------
# FIX PYTHON PATH (CRITICAL FOR WINDOWS + UVICORN)
# ------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.append(str(BASE_DIR))

# ------------------------------------------------------------------
# IMPORT REDDIT PIPELINE (ALREADY WORKING FILES)
# ------------------------------------------------------------------
from reddit_test.reddit_scrape_test import (
    scrape_reddit,
    manual_login_and_save_session,
)
from reddit_test.reddit_generate_replies import generate_reddit_replies

# ------------------------------------------------------------------
# ROUTER
# ------------------------------------------------------------------
router = APIRouter(
    prefix="/reddit",
    tags=["Reddit"],
)

# ------------------------------------------------------------------
# REQUEST MODEL (OPTIONAL)
# ------------------------------------------------------------------
class RedditRunPayload(BaseModel):
    userId: Optional[str] = None
    keywords: Optional[List[str]] = None
    force_login: Optional[bool] = False


# ------------------------------------------------------------------
# API ENDPOINT (BACKWARD COMPATIBLE)
# ------------------------------------------------------------------
@router.post("/run")
def run_reddit_pipeline(payload: Optional[RedditRunPayload] = None):
    """
    Runs full Reddit pipeline:

    1. (Optional) Manual Reddit login via Playwright
    2. Scrape Reddit posts
       - keyword-based if provided
       - subreddit-based otherwise
    3. Generate AI replies
    """

    try:
        # ---------------------------
        # SAFE PAYLOAD EXTRACTION
        # ---------------------------
        force_login = payload.force_login if payload else False
        user_id = payload.userId if payload else None
        keywords = payload.keywords if payload else None

        # Step 1: Manual login
        if force_login:
            manual_login_and_save_session()

        # Step 2: Scrape Reddit (extended but safe)
        scrape_reddit(
            user_id=user_id,
            keywords=keywords
        )

        # Step 3: Generate replies (extended but safe)
        generate_reddit_replies(user_id=user_id)

        return {
            "status": "success",
            "message": "Reddit scraping and reply generation completed successfully",
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Reddit pipeline failed: {str(e)}",
        )
