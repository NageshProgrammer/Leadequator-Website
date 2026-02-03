from db.neon import get_cursor
from ai.reply_generator import generate_replies

def generate_reddit_replies():
    cursor = get_cursor()

    # Fetch Reddit posts that do NOT yet have replies
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

        # Generate 2 AI replies
        replies = generate_replies(
            text=text,
            platform="reddit"
        )

        if not replies or len(replies) < 2:
            print("⚠️ Skipped (AI did not return 2 replies)")
            continue

        # Insert into ai_replies table
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


if __name__ == "__main__":
    generate_reddit_replies()
