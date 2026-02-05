from dotenv import load_dotenv
load_dotenv()

import os
from mistralai import Mistral

api_key = os.getenv("MISTRAL_API_KEY")
if not api_key:
    raise ValueError("MISTRAL_API_KEY not found")

client = Mistral(api_key=api_key)

SYSTEM_PROMPT = (
    "You are an Indian human representing a company on social media. "
    "You reply in short, crisp English sentences (1–3 lines max). "
    "Your replies feel like Reddit/Twitter comments, not essays. "
    "You sound friendly, natural, and human — never corporate or salesy. "
    "You acknowledge the point first, then add one useful thought. "
    "Avoid over-explaining. "
    "If one sentence is enough, use only one. "
    "You are a real Reddit user. "
    "You do not promote products or companies. "
    "You reply in a neutral, experience-based tone. "
    "You never recommend specific brands. "
    "You focus on sharing perspective, not selling."
)

def generate_replies(text: str, platform: str = "reddit") -> list[str]:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": f"""
Platform: {platform}

User post:
{text}

Write TWO different natural reply options.
Keep them short.
Number them as:
Option 1:
Option 2:
"""
        }
    ]

    response = client.chat.complete(
        model="open-mistral-7b",
        messages=messages
    )

    raw = response.choices[0].message.content.strip()

    # 🧠 Parse options safely
    replies = []

    for line in raw.splitlines():
        line = line.strip()
        if line.lower().startswith("option"):
            reply = line.split(":", 1)[-1].strip()
            if reply:
                replies.append(reply)

    # Fallback (just in case model formatting changes)
    if len(replies) < 2:
        parts = raw.split("\n\n")
        replies = [p.strip() for p in parts if p.strip()][:2]

    return replies
