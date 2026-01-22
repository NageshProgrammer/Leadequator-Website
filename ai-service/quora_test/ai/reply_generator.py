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

def generate_reply(text: str, intent: str, platform: str = "reddit") -> str:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": f"""
Platform: {platform}
Detected intent: {intent}

User post:
{text}

Write a natural reply.
"""
        }
    ]

    response = client.chat.complete(
        model="open-mistral-7b",
        messages=messages
    )

    return response.choices[0].message.content.strip()
