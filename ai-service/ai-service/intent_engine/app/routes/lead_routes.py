from fastapi import APIRouter, Query
from supabase import create_client
import os

router = APIRouter(prefix="/leads", tags=["Leads"])

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)


@router.get("/")
def get_leads(
    min_intent: int = Query(0),
    domain: str | None = None,
    limit: int = Query(20)
):
    query = supabase.table("leads").select("*")

    if min_intent > 0:
        query = query.gte("intent_score", min_intent)

    if domain:
        query = query.eq("domain", domain)

    query = query.order("imre_score", desc=True).limit(limit)

    response = query.execute()

    return {
        "count": len(response.data),
        "filters": {
            "min_intent": min_intent,
            "domain": domain,
            "limit": limit
        },
        "leads": response.data
    }