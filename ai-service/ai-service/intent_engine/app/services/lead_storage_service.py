from supabase import create_client
from urllib.parse import urlparse
import os

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

def extract_domain(url):
    return urlparse(url).netloc.replace("www.", "")

def save_lead(lead):

    try:
        data = {
            "title": lead.get("title"),
            "link": lead.get("link"),
            "domain": extract_domain(lead.get("link", "")),
            "intent_score": lead["intent_analysis"]["intent_score"],
            "intent_level": lead["intent_analysis"]["intent_level"],
            "imre_score": lead.get("imre_score")
        }

        supabase.table("leads").insert(data).execute()

    except Exception:
        # Ignore duplicates (because link is unique)
        pass

def lead_exists(link):
    response = supabase.table("leads").select("id").eq("link", link).execute()
    return len(response.data) > 0