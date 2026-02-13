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
    "You sound friendly, natural, and human — never corporate."
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

    replies = []

    for line in raw.splitlines():
        line = line.strip()
        if line.lower().startswith("option"):
            reply = line.split(":", 1)[-1].strip()
            if reply:
                replies.append(reply)

    if len(replies) < 2:
        parts = raw.split("\n\n")
        replies = [p.strip() for p in parts if p.strip()][:2]

    return replies
