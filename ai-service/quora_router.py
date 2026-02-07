from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from quora_test.quora_scrapper import scrape_quora
from quora_test.quora_generate_replies import generate_quora_replies

router = APIRouter(
    prefix="/quora",
    tags=["Quora"]
)

class QuoraRunRequest(BaseModel):
    userId: str
    keywords: List[str]

@router.post("/run")
def run_quora_pipeline(payload: QuoraRunRequest):
    try:
        scrape_quora(payload.userId, payload.keywords)
        generate_quora_replies(payload.userId)

        return {
            "status": "success",
            "message": "Quora scraping and reply generation completed"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
