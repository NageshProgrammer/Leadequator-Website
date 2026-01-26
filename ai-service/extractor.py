from keybert import KeyBERT
from sklearn.feature_extraction.text import TfidfVectorizer

kw_model = None

def get_model():
    global kw_model
    if kw_model is None:
        vectorizer = TfidfVectorizer(stop_words="english")
        kw_model = KeyBERT(model=vectorizer)
    return kw_model
