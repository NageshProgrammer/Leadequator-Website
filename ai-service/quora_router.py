from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List

from quora_test.quora_scrapper import scrape_quora
from quora_test.quora_generate_replies import generate_quora_replies
from quora_test.db.neon import get_cursor

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
        raise HTTPException(status_code=500, detail=f"Scrape error: {e}")

    try:
        replies_count = generate_quora_replies(payload.userId)
    except Exception as e:
        replies_count = 0
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
    """
    Return quora posts from the database.
    If `userId` is provided filter by it.
    """

    try:
        cursor, conn = get_cursor()

        if userId:
            cursor.execute(
                """
                SELECT p.id,
                       p.user_id,
                       p.platform,
                       p.question,
                       p.url,
                       p.author,
                       p.created_at,
                       r.reply_option_1,
                       r.reply_option_2,
                       r.approved
                FROM quora_posts p
                LEFT JOIN quora_ai_replies r
                       ON r.quora_post_id = p.id
                WHERE p.user_id = %s
                ORDER BY p.created_at DESC
                LIMIT 500
                """,
                (userId,)
            )
        else:
            cursor.execute(
                """
                SELECT p.id,
                       p.user_id,
                       p.platform,
                       p.question,
                       p.url,
                       p.author,
                       p.created_at,
                       r.reply_option_1,
                       r.reply_option_2,
                       r.approved
                FROM quora_posts p
                LEFT JOIN quora_ai_replies r
                       ON r.quora_post_id = p.id
                ORDER BY p.created_at DESC
                LIMIT 500
                """
            )

        rows = cursor.fetchall()

        results = []

        for r in rows:
            results.append({
                "id": str(r[0]) if r[0] is not None else None,
                "userId": r[1],
                "platform": r[2] or "Quora",
                "content": r[3],
                "url": r[4],
                "author": r[5],
                "createdAt": r[6],  # ✅ ADDED
                "replyOption1": r[7],
                "replyOption2": r[8],
                "replyApproved": bool(r[9]) if r[9] is not None else None,
            })

        return {
            "status": "success",
            "data": results
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        try:
            conn.close()
        except Exception:
            pass
