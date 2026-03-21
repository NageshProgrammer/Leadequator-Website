from quora_test.db.neon import get_cursor
from quora_test.ai.reply_generator import generate_replies

MAX_REPLIES_PER_RUN = 5  # 🔥 match scraper limit


def generate_quora_replies(user_id: str):
    cursor, conn = get_cursor()
    inserted_replies = 0

    try:
        cursor.execute("""
            SELECT id, question, url, author
            FROM quora_posts
            WHERE user_id = %s
              AND id NOT IN (
                  SELECT quora_post_id FROM quora_ai_replies
              )
            ORDER BY created_at DESC
            LIMIT %s
        """, (user_id, MAX_REPLIES_PER_RUN))

        posts = cursor.fetchall()

        if not posts:
            print("⚠️ No new Quora posts found.")
            return 0

        for post_id, question, url, author in posts:
            question = (question or "").strip()

            if not question:
                continue

            print("🧠 Generating replies for:", question[:70])

            replies = generate_replies(
                text=question,
                platform="quora"
            )

            if not replies or len(replies) < 2:
                print("⚠️ AI did not return enough replies")
                continue

            cursor.execute(
                """
                INSERT INTO quora_ai_replies
                (quora_post_id, reply_option_1, reply_option_2, approved)
                VALUES (%s, %s, %s, %s)
                """,
                (
                    post_id,
                    replies[0],
                    replies[1],
                    False
                )
            )

            try:
                if cursor.rowcount and cursor.rowcount > 0:
                    inserted_replies += 1
                else:
                    inserted_replies += 1
            except Exception:
                inserted_replies += 1

            print("✅ Replies stored")

    finally:
        try:
            conn.close()
        except Exception:
            pass

    print(f"🎉 Quora reply generation complete — inserted {inserted_replies} replies (MAX {MAX_REPLIES_PER_RUN})")
    return inserted_replies