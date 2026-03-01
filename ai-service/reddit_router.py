from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from reddit_test.reddit_scrape_test import scrape_reddit
from reddit_test.reddit_generate_replies import generate_reddit_replies
from reddit_test.db.neon import get_cursor
from reddit_test.ai.reply_generator import generate_replies

router = APIRouter(
    prefix="/reddit",
    tags=["Reddit"]
)

# ==============================
# REQUEST MODELS
# ==============================

class RedditRunRequest(BaseModel):
    userId: str
    keywords: Optional[List[str]] = None


# ⭐ UPDATED (postText fallback added)
class GenerateRequest(BaseModel):
    postId: str
    postText: Optional[str] = None


# ==============================
# FULL PIPELINE
# ==============================

@router.post("/run")
def run_reddit_pipeline(payload: RedditRunRequest):

    try:

        if not payload.userId:
            raise HTTPException(
                status_code=400,
                detail="Missing userId"
            )

        keywords = payload.keywords or []

        if not keywords:
            print("⚠️ No keywords provided for Reddit scraping")
            return {
                "status": "success",
                "message": "No keywords provided. Nothing scraped."
            }

        print(f"🚀 Starting Reddit pipeline for user: {payload.userId}")

        # 1️⃣ SCRAPE
        inserted = scrape_reddit(
            user_id=payload.userId,
            keywords=keywords
        )

        print(f"📥 Scraped posts inserted: {inserted}")

        # 2️⃣ GENERATE
        generate_reddit_replies(
            user_id=payload.userId
        )

        print(f"✅ Pipeline completed for user: {payload.userId}")

        return {
            "status": "success",
            "message": "Reddit scraping and reply generation completed"
        }

    except HTTPException:
        raise

    except Exception as e:
        print("❌ Pipeline error:", str(e))
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ==============================
# SINGLE GENERATE (BUTTON)
# ==============================

@router.post("/generate")
def generate_single_reply(payload: GenerateRequest):

    cursor, conn = get_cursor()

    try:

        text = None
        url = None

        # ==============================
        # FETCH POST FROM DB USING ID
        # ==============================

        cursor.execute(
            """
            SELECT text, url
            FROM reddit_posts
            WHERE id = %s
            """,
            (payload.postId,)
        )

        post = cursor.fetchone()

        # ==============================
        # FALLBACK → USE FRONTEND TEXT
        # ==============================

        if post:
            text, url = post
        elif payload.postText:
            print("⚠️ Post ID not found, using frontend text fallback")
            text = payload.postText
            url = None
        else:
            raise HTTPException(
                status_code=404,
                detail="Post not found"
            )

        text = (text or "").strip()

        if not text:
            raise HTTPException(
                status_code=400,
                detail="Empty post text"
            )

        print("🧠 Generating replies for post:", payload.postId)

        # ==============================
        # GENERATE USING AI
        # ==============================

        replies = generate_replies(
            text=text,
            platform="reddit",
            url=url,
            company_details={}
        )

        if not replies:
            raise HTTPException(
                status_code=500,
                detail="Reply generation failed"
            )

        if len(replies) == 1:
            replies.append(replies[0])

        print("✅ Generated replies:", replies)

        return {
            "option1": replies[0],
            "option2": replies[1]
        }

    except HTTPException:
        raise

    except Exception as e:
        print("❌ Generate error:", str(e))
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        cursor.close()
        conn.close()