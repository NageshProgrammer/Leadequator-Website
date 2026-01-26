from fastapi import APIRouter
from pydantic import BaseModel
from keybert import KeyBERT
from sklearn.feature_extraction.text import CountVectorizer
import re
from typing import Optional

router = APIRouter()

kw_model = None

def get_model():
    global kw_model
    if kw_model is None:
        print("Loading KeyBERT (CPU-safe, sklearn backend)...")
        vectorizer = CountVectorizer(stop_words="english")
        kw_model = KeyBERT(model=vectorizer)
    return kw_model
