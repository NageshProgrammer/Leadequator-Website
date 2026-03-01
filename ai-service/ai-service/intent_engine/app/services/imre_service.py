import re
from datetime import datetime

def calculate_imre(lead):

    intent_score = lead["intent_analysis"]["intent_score"]
    max_similarity = lead["intent_analysis"].get("max_similarity", 0)

    # Convert similarity to 0-100 scale
    match_strength = max_similarity * 100

    # 🔹 Recency signal (basic version)
    # If lead has a date field in future, we improve later
    recency_score = 50  # default neutral

    # 🔹 Expansion keyword boost
    expansion_keywords = [
        "rfp", "tender", "supplier search",
        "vendor registration", "expansion",
        "new plant", "procurement"
    ]

    content = (lead.get("title", "") + " " + lead.get("snippet", "")).lower()

    expansion_score = 0
    for keyword in expansion_keywords:
        if keyword in content:
            expansion_score = 100
            break

    imre_score = (
        (intent_score * 0.6) +
        (match_strength * 0.2) +
        (recency_score * 0.1) +
        (expansion_score * 0.1)
    )

    return round(imre_score, 2)