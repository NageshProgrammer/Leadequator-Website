from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from quora_test.quora_scrapper import scrape_quora
from quora_test.quora_generate_replies import generate_quora_replies
from quora_test.db.neon import get_cursor
from fastapi import Query

router = APIRouter(
    prefix="/quora",
    tags=["Quora"]
)

class QuoraRunRequest(BaseModel):
    userId: str
    keywords: List[str]

@router.post("/run")
def run_quora_pipeline(payload: QuoraRunRequest):
    # Use provided keywords; fall back to sensible defaults if empty
    keywords = payload.keywords or []
    if not keywords:
        keywords = ["startup", "crm", "lead", "generation"]

    try:
        inserted_count = scrape_quora(payload.userId, keywords)
    except Exception as e:
        # If scraping fails, surface the error
        raise HTTPException(status_code=500, detail=f"Scrape error: {e}")

    # Try to generate replies, but don't fail the whole request if AI is misconfigured
    try:
        replies_count = generate_quora_replies(payload.userId)
    except Exception as e:
        replies_count = 0
        # Log the AI error to return in the response
        ai_error = str(e)
    else:
        ai_error = None

    return {
        "status": "success",
        "message": "Quora scrape completed",
        "insertedPosts": int(inserted_count or 0),
        "generatedReplies": int(replies_count or 0),
        "aiError": ai_error,
    }


@router.get("/posts")
def get_quora_posts(userId: str | None = Query(None)):
    """Return quora posts from the database. If `userId` is provided filter by it."""
    try:
        cursor, conn = get_cursor()

        # Join with quora_ai_replies to include generated reply options when available
        if userId:
            cursor.execute(
                """
                SELECT p.id, p.user_id, p.platform, p.question, p.url, p.author,
                       r.reply_option_1, r.reply_option_2, r.approved
                FROM quora_posts p
                LEFT JOIN quora_ai_replies r ON r.quora_post_id = p.id
                WHERE p.user_id = %s
                ORDER BY p.id DESC
                LIMIT 500
                """,
                (userId,)
            )
        else:
            cursor.execute(
                """
                SELECT p.id, p.user_id, p.platform, p.question, p.url, p.author,
                       r.reply_option_1, r.reply_option_2, r.approved
                FROM quora_posts p
                LEFT JOIN quora_ai_replies r ON r.quora_post_id = p.id
                ORDER BY p.id DESC
                LIMIT 500
                """
            )

        rows = cursor.fetchall()

        results = []
        for r in rows:
            # Ensure values like UUIDs are converted to serializable types
            results.append({
                "id": str(r[0]) if r[0] is not None else None,
                "userId": r[1],
                "platform": r[2] or "Quora",
                "content": r[3],
                "url": r[4],
                "author": r[5],
                "replyOption1": r[6],
                "replyOption2": r[7],
                "replyApproved": bool(r[8]) if r[8] is not None else None,
            })

        return {"status": "success", "data": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        try:
            conn.close()
        except Exception:
            pass
