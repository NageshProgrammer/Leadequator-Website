from typing import Optional
from reddit_test.db.neon import get_cursor
from reddit_test.ai.reply_generator import generate_replies


def generate_reddit_replies(user_id: Optional[str] = None):
    cursor = get_cursor()

    if user_id:
        cursor.execute("""
            SELECT id, text, url
            FROM reddit_posts
            WHERE user_id = %s
              AND id NOT IN (
                  SELECT reddit_post_id FROM reddit_ai_replies
              )
            LIMIT 20
        """, (user_id,))
    else:
        cursor.execute("""
            SELECT id, text, url
            FROM reddit_posts
            WHERE id NOT IN (
                SELECT reddit_post_id FROM reddit_ai_replies
            )
            LIMIT 20
        """)

    posts = cursor.fetchall()

    if not posts:
        print("⚠️ No new Reddit posts found.")
        return

    for post_id, text, url in posts:
        text = (text or "").strip()
        if not text:
            continue

        print("🧠 Generating reply for:", text[:70])

        replies = generate_replies(
            text=text,
            platform="reddit"
        )

        if not replies:
            continue

        # Save each reply separately
        for reply in replies:
            cursor.execute(
                """
                INSERT INTO reddit_ai_replies
                (reddit_post_id, intent, generated_reply)
                VALUES (%s, %s, %s)
                """,
                (
                    post_id,
                    "lead_generation",
                    reply
                )
            )

        print("✅ Replies stored")

    print("🎉 Reddit reply generation complete")
