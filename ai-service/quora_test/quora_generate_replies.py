import json
from ai.reply_generator import generate_reply

INPUT_FILE = "quora_real_posts.json"
OUTPUT_FILE = "quora_replies_output.json"

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    posts = json.load(f)

replies = []

for post in posts:
    text = post.get("text", "").strip()
    url = post.get("url")
    author = post.get("author")

    if not text or not url:
        continue

    # Intent can be improved later — keep simple for now
    intent = "information seeking"

    reply = generate_reply(
        text=text,
        intent=intent,
        platform="quora"
    )

    replies.append({
    "platform": "quora",
    "original_text": text,
    "post_url": url,
    "author": author,
    "intent": intent,
    "generated_reply": reply,
    "ready_to_post": False
})

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(replies, f, indent=2, ensure_ascii=False)

print(f"✅ Generated {len(replies)} replies → {OUTPUT_FILE}")
