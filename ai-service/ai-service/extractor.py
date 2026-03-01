from fastapi import APIRouter
from pydantic import BaseModel
from keybert import KeyBERT
from sklearn.feature_extraction.text import TfidfVectorizer
import re
from typing import Optional, List

router = APIRouter()

kw_model = None

def get_model():
    global kw_model
    if kw_model is None:
        vectorizer = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),
            max_features=5000
        )
        kw_model = KeyBERT(model=vectorizer)
    return kw_model


class KeywordInput(BaseModel):
    # onboarding / form based
    industry: Optional[str] = ""
    company_type: Optional[str] = ""
    interests: Optional[str] = ""
    problem: Optional[str] = ""
    location: Optional[str] = ""

    # DB based (IMPORTANT)
    keywords: Optional[List[str]] = []


def clean_text(text: str):
    return re.sub(r"[^a-zA-Z\s]", "", text.lower())


@router.post("/extract-keywords")
def extract_keywords(data: KeywordInput):
    # ✅ SUPPORT BOTH INPUT STYLES
    if data.keywords:
        combined_text = " ".join(data.keywords)
    else:
        combined_text = " ".join([
            data.industry or "",
            data.company_type or "",
            data.interests or "",
            data.problem or "",
            data.location or "",
        ])

    cleaned_text = clean_text(combined_text)

    if not cleaned_text.strip():
        return {"error": "Empty input"}

    model = get_model()

    keywords = model.extract_keywords(
        cleaned_text,
        top_n=5
    )

    return {
        "core_keywords": [kw for kw, _ in keywords]
    }
