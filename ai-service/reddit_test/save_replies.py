import json
from ai.reply_generator import generate_reply

# Load mock Reddit posts
with open("mock_posts.json", "r", encoding="utf-8") as f:
    posts = json.load(f)

saved_replies = []

for post in posts:
    text = post["text"]
    url = post["url"]
    author = post["author"]

    # For now, intent is hardcoded
    intent = "product interest"

    reply = generate_reply(
        text=text,
        intent=intent,
        platform="reddit"
    )

    saved_replies.append({
        "platform": "reddit",
        "original_text": text,
        "post_url": url,
        "author": author,
        "intent": intent,
        "generated_reply": reply
    })

# Save to file
with open("replies_output.json", "w", encoding="utf-8") as f:
    json.dump(saved_replies, f, indent=2, ensure_ascii=False)

print("✅ Replies saved to replies_output.json")
