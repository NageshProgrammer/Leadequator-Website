import praw
import os

# Make sure these environment variables are set
# REDDIT_CLIENT_ID
# REDDIT_CLIENT_SECRET
# REDDIT_USERNAME
# REDDIT_PASSWORD

reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    username=os.getenv("REDDIT_USERNAME"),
    password=os.getenv("REDDIT_PASSWORD"),
    user_agent="reddit-test-script"
)

print("✅ Logged into Reddit as:", reddit.user.me())

subreddit = reddit.subreddit("startups")

print("\nFetching 5 posts from r/startups:\n")

for post in subreddit.hot(limit=5):
    print("TITLE:", post.title)
    print("URL:", post.url)
    print("-" * 50)
