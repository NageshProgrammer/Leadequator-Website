# ai-service/api.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from extractor import router as keyword_router
from reddit_router import router as reddit_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://leadequator.live",
        "https://www.leadequator.live",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "AI service running"}

app.include_router(keyword_router)
app.include_router(reddit_router)
