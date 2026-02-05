from typing import Optional
from reddit_test.db.neon import get_cursor
from reddit_test.ai.reply_generator import generate_replies


def generate_reddit_replies(user_id: Optional[str] = None):
    """
    If user_id is provided → generate replies only for that user
    Else → existing global behavior (unchanged)
    """

    cursor = get_cursor()

    # -------------------------------
    # QUERY MODE (SAFE EXTENSION)
    # -------------------------------
    if user_id:
        cursor.execute("""
            SELECT id, text, url, author
            FROM social_posts
            WHERE platform = 'reddit'
              AND user_id = %s
              AND id NOT IN (
                  SELECT post_id FROM ai_replies
              )
            LIMIT 20
        """, (user_id,))
    else:
        # 🔁 EXISTING BEHAVIOR (UNCHANGED)
        cursor.execute("""
            SELECT id, text, url, author
            FROM social_posts
            WHERE platform = 'reddit'
              AND id NOT IN (
                  SELECT post_id FROM ai_replies
              )
            LIMIT 20
        """)

    posts = cursor.fetchall()

    if not posts:
        print("⚠️ No new Reddit posts found for reply generation.")
        return

    for post_id, text, url, author in posts:
        text = (text or "").strip()

        if not text:
            continue

        print("🧠 Generating replies for:", text[:70])

        # Generate 2 AI replies (UNCHANGED)
        replies = generate_replies(
            text=text,
            platform="reddit"
        )

        if not replies or len(replies) < 2:
            print("⚠️ Skipped (AI did not return 2 replies)")
            continue

        # Insert into ai_replies table (UNCHANGED)
        cursor.execute(
            """
            INSERT INTO ai_replies (
                post_id,
                platform,
                post_url,
                reply_option_1,
                reply_option_2,
                approved
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                post_id,
                "reddit",
                url,
                replies[0],
                replies[1],
                False
            )
        )

        print("✅ Stored 2 replies")

    print(f"🎉 Finished generating replies for {len(posts)} Reddit posts")


# ----------------------------------
# LOCAL RUN (UNCHANGED)
# ----------------------------------
if __name__ == "__main__":
    generate_reddit_replies()
