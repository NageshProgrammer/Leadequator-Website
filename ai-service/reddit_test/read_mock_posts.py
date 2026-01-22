import json

# Load mock Reddit posts
with open("mock_posts.json", "r", encoding="utf-8") as f:
    posts = json.load(f)

print("Loaded posts:\n")

for post in posts:
    print("POST TEXT:", post["text"])
    print("POST URL :", post["url"])
    print("AUTHOR   :", post["author"])
    print("-" * 50)
    