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
    if not payload.userId:
        raise HTTPException(status_code=400, detail="Missing userId")

    keywords = payload.keywords or []

    if not keywords:
        keywords = ["startup", "crm", "lead", "generation"]

    try:
        print(f"🚀 Starting Quora pipeline for user: {payload.userId}")

        # 1️⃣ Scrape (must internally limit to 5)
        inserted_count = scrape_quora(payload.userId, keywords)

        # 2️⃣ Auto generate replies
        replies_count = generate_quora_replies(payload.userId)

        print(f"✅ Quora pipeline completed for user: {payload.userId}")

        return {
            "status": "success",
            "message": "Quora scrape completed",
            "insertedPosts": int(inserted_count or 0),
            "generatedReplies": int(replies_count or 0),
            "aiError": None,
        }

    except Exception as e:
        print("❌ Quora pipeline error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/posts")
def get_quora_posts(userId: str | None = Query(None)):
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
                "createdAt": r[6],
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