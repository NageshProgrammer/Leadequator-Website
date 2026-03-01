import time
import logging
from fastapi import APIRouter, Query
from pydantic import BaseModel
from intent_engine.app.services.keyword_expander import expand_keywords
from intent_engine.app.services.intent_service import analyze_intent
from intent_engine.app.services.search_service import search_web
from intent_engine.app.services.scraper_service import scrape_content
from intent_engine.app.services.imre_service import calculate_imre
from intent_engine.app.services.dedup_service import deduplicate_leads
from intent_engine.app.services.lead_storage_service import save_lead
from intent_engine.app.services.lead_storage_service import lead_exists


router = APIRouter(prefix="/search", tags=["Search"])

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SearchRequest(BaseModel):
    industry: str
    location: str | None = None
    buying_signals: str


@router.post("/")
def search_leads(
    request: SearchRequest,
    min_intent: int = Query(0)
):

    start_time = time.time()   # ✅ moved inside function

    expanded_keywords = expand_keywords(
        request.industry,
        request.buying_signals
    )

    all_results = []

    total_results_found = 0
    new_leads_processed = 0
    skipped_existing = 0

    high_intent = 0
    medium_intent = 0
    low_intent = 0
    no_intent = 0

    for keyword in expanded_keywords:
        results = search_web(keyword)
        total_results_found += len(results)

        for result in results:

            if lead_exists(result["link"]):
                skipped_existing += 1
                continue

            content = scrape_content(result["link"])
            if not content:
                continue

            intent = analyze_intent(content)
            result["intent_analysis"] = intent
            result["imre_score"] = calculate_imre(result)

            save_lead(result)
            new_leads_processed += 1

            level = intent.get("intent_level", "No Intent")

            if level == "High Intent":
                high_intent += 1
            elif level == "Medium Intent":
                medium_intent += 1
            elif level == "Low Intent":
                low_intent += 1
            else:
                no_intent += 1

            all_results.append(result)

    all_results = deduplicate_leads(all_results)

    all_results = sorted(
        all_results,
        key=lambda x: x.get("imre_score", 0),
        reverse=True
    )

    if min_intent > 0:
        all_results = [
            lead for lead in all_results
            if lead["intent_analysis"]["intent_score"] >= min_intent
        ]

    end_time = time.time()
    processing_time = round(end_time - start_time, 2)

    # ✅ Log once, clean summary
    logger.info(
        f"Search completed | Results: {total_results_found} | "
        f"New: {new_leads_processed} | Skipped: {skipped_existing} | "
        f"High: {high_intent} | Medium: {medium_intent} | "
        f"Low: {low_intent} | Time: {processing_time}s"
    )

    return {
        "processing_time_seconds": processing_time,
        "stats": {
            "total_keywords": len(expanded_keywords),
            "total_results_found": total_results_found,
            "new_leads_processed": new_leads_processed,
            "skipped_existing": skipped_existing,
            "high_intent": high_intent,
            "medium_intent": medium_intent,
            "low_intent": low_intent,
            "no_intent": no_intent
        },
        "keywords_used": expanded_keywords,
        "leads": all_results
    }