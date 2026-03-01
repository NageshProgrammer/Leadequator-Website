from dotenv import load_dotenv
load_dotenv()

from supabase import create_client, Client
from sentence_transformers import SentenceTransformer
import os
from collections import Counter

# =========================
# CONFIG
# =========================

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# =========================
# LOAD MODEL ON STARTUP (CACHED)
# =========================

print("Loading embedding model...")
model = SentenceTransformer("all-MiniLM-L6-v2")
print("Model loaded successfully.")

# =========================
# VECTOR SEARCH FUNCTION
# =========================

def search_similar_intents(embedding, match_count=10):
    response = supabase.rpc(
        "match_intent_examples",
        {
            "query_embedding": embedding,
            "match_count": match_count
        }
    ).execute()

    return response.data


# =========================
# MAIN INTENT ANALYSIS
# =========================

def analyze_intent(text: str):

    if not text or len(text.strip()) < 20:
        return {
            "buying_intent": False,
            "intent_score": 0,
            "reason": "Insufficient content"
        }

    query_embedding = model.encode(text).tolist()
    results = search_similar_intents(query_embedding, match_count=20)

    if not results:
        return {
            "buying_intent": False,
            "intent_score": 0,
            "reason": "No similarity matches found"
        }

    from collections import Counter

    bucket_counter = Counter()
    weighted_score = 0
    total_similarity = 0
    max_similarity = 0

    for item in results:
        bucket = item["bucket"]
        similarity = item["similarity"]
        intent_weight = item["intent_weight"]

        if similarity > max_similarity:
            max_similarity = similarity

        bucket_counter[bucket] += 1
        weighted_score += intent_weight * similarity
        total_similarity += similarity

    if total_similarity == 0:
        final_score = 0
    else:
        final_score = (weighted_score / total_similarity) * 100

    final_score = round(final_score)
    dominant_bucket = bucket_counter.most_common(1)[0][0]

    if final_score >= 85 and dominant_bucket == "data1":
        buying_intent = True
        level = "High Intent"
    elif final_score >= 60:
        buying_intent = True
        level = "Medium Intent"
    elif final_score >= 35:
        buying_intent = False
        level = "Low Intent"
    else:
        buying_intent = False
        level = "No Intent"

    return {
        "buying_intent": buying_intent,
        "intent_score": final_score,
        "intent_level": level,
        "bucket_distribution": dict(bucket_counter),
        "dominant_bucket": dominant_bucket,
        "max_similarity": round(max_similarity, 3)
    }