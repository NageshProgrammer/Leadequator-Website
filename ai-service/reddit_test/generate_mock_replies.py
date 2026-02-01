from dotenv import load_dotenv
load_dotenv()


import json

# Import your Mistral reply generator
from ai.reply_generator import generate_reply

# Load mock Reddit posts
with open("mock_posts.json", "r", encoding="utf-8") as f:
    posts = json.load(f)

print("\nGenerating replies using Mistral...\n")

for post in posts:
    text = post["text"]
    url = post["url"]

    # For now we hardcode intent (later this comes from intent model)
    intent = "product interest"

    reply = generate_reply(
        text=text,
        intent=intent,
        platform="reddit"
    )

    print("ORIGINAL POST:")
    print(text)
    print("\nPOST URL:")
    print(url)
    print("\nGENERATED REPLY:")
    print(reply)
    print("=" * 70)
