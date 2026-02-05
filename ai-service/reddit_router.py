import sys
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException

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
# API ENDPOINT
# ------------------------------------------------------------------
@router.post("/run")
def run_reddit_pipeline(
    force_login: Optional[bool] = False
):
    """
    Runs full Reddit pipeline:

    1. (Optional) Manual Reddit login via Playwright
    2. Scrape Reddit posts (stores in NeonDB)
    3. Generate AI replies (stores in NeonDB)
    """

    try:
        # Step 1: Manual login (only when explicitly requested)
        if force_login:
            manual_login_and_save_session()

        # Step 2: Scrape Reddit posts (DB insert happens inside)
        scrape_reddit()

        # Step 3: Generate AI replies (DB insert happens inside)
        generate_reddit_replies()

        return {
            "status": "success",
            "message": "Reddit scraping and reply generation completed successfully",
        }

    except Exception as e:
        # IMPORTANT: expose real error for debugging (local)
        raise HTTPException(
            status_code=500,
            detail=f"Reddit pipeline failed: {str(e)}",
        )
