from dotenv import load_dotenv
load_dotenv()

import os
import re
import psycopg2
from mistralai import Mistral
from typing import List, Dict, Optional

# ==============================
# ENV
# ==============================

DATABASE_URL = os.getenv("DATABASE_URL")
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL missing in .env")

if not MISTRAL_API_KEY:
    raise ValueError("MISTRAL_API_KEY missing in .env")

# ==============================
# MISTRAL CLIENT
# ==============================

client = Mistral(api_key=MISTRAL_API_KEY)
MODEL = "mistral-small-latest"


# ==============================
# DB CONNECTION
# ==============================

def get_conn():
    return psycopg2.connect(DATABASE_URL)


# ==============================
# NO-VECTOR RAG CONTEXT
# ==============================

def retrieve_context(limit: int = 5) -> str:
    """
    Fetch recent generated replies from DB
    (acts like lightweight RAG)
    """

    try:
        conn = get_conn()
        cur = conn.cursor()

        cur.execute("""
            SELECT generated_reply
            FROM reddit_ai_replies
            ORDER BY id DESC
            LIMIT %s
        """, (limit,))

        rows = cur.fetchall()

        cur.close()
        conn.close()

        if not rows:
            return ""

        return "\n".join([r[0] for r in rows])

    except Exception as e:
        print("⚠️ Context fetch failed:", e)
        return ""


# ==============================
# LLM CALL
# ==============================

def ask_llm(prompt: str):

    response = client.chat.complete(
        model=MODEL,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content


# ==============================
# PROMPT BUILDER
# ==============================

def build_prompt(text, platform, context):

    return f"""
You are a real human replying naturally on {platform}.

Past successful replies (for style reference):
{context}

Current post:
{text}

Rules:
- Human tone
- Helpful
- NOT salesy
- 1–3 lines max
- Sound natural like Reddit user

Generate TWO reply options.

Format EXACTLY:

Option 1: <reply>
Option 2: <reply>
"""


# ==============================
# MAIN FUNCTION
# ==============================

def generate_replies(
    text: str,
    platform: str = "reddit",
    url: Optional[str] = None,
    company_details: Optional[Dict] = None
) -> List[str]:

    if not text:
        return []

    # ⭐ NO-VECTOR CONTEXT
    context = retrieve_context()

    prompt = build_prompt(text, platform, context)

    try:
        raw = ask_llm(prompt)
        print("🧠 Mistral Output:", raw)

    except Exception as e:
        print("❌ Generation error:", e)
        return []

    matches = re.findall(
        r"Option\s*\d+\s*:\s*(.*?)(?=Option\s*\d+\s*:|$)",
        raw,
        re.DOTALL | re.IGNORECASE
    )

    replies = [m.strip() for m in matches if m.strip()]

    if len(replies) == 1:
        replies.append(replies[0])

    return replies[:2]

# from dotenv import load_dotenv
# load_dotenv()

# import os
# import re
# import google.generativeai as genai
# from typing import List, Dict, Optional

# # ==============================
# # GEMINI SETUP
# # ==============================

# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# if not GEMINI_API_KEY:
#     raise ValueError("GEMINI_API_KEY not found in .env")

# genai.configure(api_key=GEMINI_API_KEY)

# model = genai.GenerativeModel("gemini-1.5-flash")


# # ==============================
# # INTENT DETECTION
# # ==============================

# def detect_intent(text: str) -> str:

#     prompt = f"""
# Analyze this social media post and classify intent.

# Post:
# {text}

# Categories:
# - Problem Statement
# - Looking for Recommendation
# - Tool Comparison
# - Advice Seeking
# - Hiring / Opportunity
# - Frustration / Rant
# - General Discussion
# - Not Relevant

# Return ONLY category name.
# """

#     try:
#         response = model.generate_content(prompt)
#         return response.text.strip()
#     except Exception as e:
#         print("⚠️ Intent detection failed:", e)
#         return "General Discussion"


# # ==============================
# # LEAD SCORING
# # ==============================

# def score_lead(intent: str, text: str) -> int:

#     score = 0
#     t = text.lower()

#     if intent in ["Problem Statement", "Looking for Recommendation"]:
#         score += 40

#     if "need" in t or "looking for" in t:
#         score += 20

#     if "help" in t or "solution" in t:
#         score += 15

#     if len(text) > 200:
#         score += 10

#     if "urgent" in t:
#         score += 15

#     return min(score, 100)


# # ==============================
# # PROMPT BUILDER
# # ==============================

# def build_prompt(
#     text: str,
#     platform: str,
#     url: Optional[str],
#     company_details: Dict,
#     intent: str,
#     lead_score: int
# ) -> str:

#     return f"""
# You are a startup founder replying naturally on {platform}.

# Rules:
# - Human tone
# - Professional but natural
# - NOT salesy
# - Short (1-3 lines)
# - Insightful

# Post:
# {text}

# Intent: {intent}
# Lead Score: {lead_score}/100
# URL: {url}

# Generate TWO replies.

# IMPORTANT:
# Return exactly like this:

# Option 1: <reply here>
# Option 2: <reply here>
# """


# # ==============================
# # MAIN GENERATION
# # ==============================

# def generate_replies(
#     text: str,
#     platform: str = "reddit",
#     url: Optional[str] = None,
#     company_details: Optional[Dict] = None
# ) -> List[str]:

#     if not text:
#         return []

#     company_details = company_details or {}

#     intent = detect_intent(text)
#     lead_score = score_lead(intent, text)

#     prompt = build_prompt(
#         text=text,
#         platform=platform,
#         url=url,
#         company_details=company_details,
#         intent=intent,
#         lead_score=lead_score,
#     )

#     try:
#         response = model.generate_content(prompt)
#         raw = response.text.strip()

#         print("🧠 Gemini Raw Output:\n", raw)

#     except Exception as e:
#         print("❌ Gemini generation error:", e)
#         return []

#     # ==============================
#     # SMART PARSING (FIXED)
#     # ==============================

#     replies = []

#     # Extract Option blocks safely
#     matches = re.findall(
#         r"Option\s*\d+\s*:\s*(.*?)(?=Option\s*\d+\s*:|$)",
#         raw,
#         re.IGNORECASE | re.DOTALL,
#     )

#     for m in matches:
#         cleaned = m.strip()
#         if cleaned:
#             replies.append(cleaned)

#     # fallback parsing
#     if len(replies) < 2:
#         parts = [p.strip() for p in raw.split("\n\n") if p.strip()]
#         replies = parts[:2]

#     print("✅ Parsed replies:", replies)

#     return replies
