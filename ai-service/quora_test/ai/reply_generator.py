from dotenv import load_dotenv
load_dotenv()

import os
from mistralai import Mistral

api_key = os.getenv("MISTRAL_API_KEY")
if not api_key:
    raise ValueError("MISTRAL_API_KEY not found")

client = Mistral(api_key=api_key)

SYSTEM_PROMPT = (
    "You are a real human answering questions on Quora. "
    "Your answers are thoughtful, experience-based, and educational. "
    "You write 2–4 short paragraphs, not bullet points. "
    "You often start with personal framing like "
    "'In my experience', 'What I’ve noticed', or 'When I worked with similar teams'. "
    "You do NOT promote products or companies. "
    "You do NOT include calls to action, links, or suggestions to contact anyone. "
    "You focus on explaining the reasoning behind decisions, not giving direct advice. "
    "Your tone is neutral, helpful, and non-commercial."
)

def generate_replies(text, platform="quora"):
    messages = [
        {
            "role": "system",
            "content": (
                "You are a human replying on social media. "
                "Replies must be short (1–2 lines), natural, non-promotional."
            )
        },
        {
            "role": "user",
            "content": (
                f"Post:\n{text}\n\n"
                "Write exactly two reply options.\n"
                "Format strictly like this:\n"
                "1. <reply one>\n"
                "2. <reply two>\n"
                "Do not add anything else."
            )
        }
    ]

    response = client.chat.complete(
        model="open-mistral-7b",
        messages=messages,
        temperature=0.7
    )

    raw = response.choices[0].message.content.strip()

    replies = []
    for line in raw.split("\n"):
        if line.strip().startswith(("1.", "2.")):
            replies.append(line.split(".", 1)[1].strip())

    # Safety fallback
    if len(replies) < 2:
        replies = [r.strip() for r in raw.split("\n") if r.strip()][:2]

    return replies

