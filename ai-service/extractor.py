from fastapi import APIRouter
from pydantic import BaseModel
from keybert import KeyBERT
import re
from typing import Optional

router = APIRouter()

kw_model = None

def get_model():
    global kw_model
    if kw_model is None:
        kw_model = KeyBERT()
    return kw_model

class FormData(BaseModel):
    industry: Optional[str] = ""
    company_type: Optional[str] = ""
    interests: Optional[str] = ""
    problem: Optional[str] = ""
    location: Optional[str] = ""

def clean_text(text: str):
    return re.sub(r"[^a-zA-Z\s]", "", text.lower())

@router.post("/extract-keywords")
def extract_keywords(data: FormData):
    combined_text = " ".join([
        data.industry,
        data.company_type,
        data.interests,
        data.problem,
        data.location,
    ])

    model = get_model()

    keywords = model.extract_keywords(
        clean_text(combined_text),
        keyphrase_ngram_range=(1, 2),
        stop_words="english",
        top_n=5
    )

    return {
        "core_keywords": [kw for kw, _ in keywords]
    }
