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
    "If one sentence is enough, use only one."
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
