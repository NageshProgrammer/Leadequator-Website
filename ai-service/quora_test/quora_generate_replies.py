from db.neon import get_cursor
from ai.reply_generator import generate_replies

def generate_quora_replies():
    cursor = get_cursor()

    # Fetch Quora posts that do NOT yet have replies
    cursor.execute("""
        SELECT id, text, url, author
        FROM social_posts
        WHERE platform = 'quora'
          AND id NOT IN (
              SELECT post_id FROM ai_replies
          )
        LIMIT 20
    """)

    posts = cursor.fetchall()

    if not posts:
        print("⚠️ No new Quora posts found for reply generation.")
        return

    for post_id, text, url, author in posts:
        text = (text or "").strip()

        if not text:
            continue

        print("Generating replies for:", text[:60])

        # Generate 2 AI reply options
        replies = generate_replies(text, platform="quora")

        if len(replies) < 2:
            print("⚠️ Skipping (less than 2 replies generated)")
            continue

        # Store replies in Neon DB
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
        "quora",
        url,
        replies[0],
        replies[1],
        False
    )
)


        print("✅ Stored 2 replies")

    print(f"🎉 Finished generating replies for {len(posts)} Quora posts")

if __name__ == "__main__":
    generate_quora_replies()
