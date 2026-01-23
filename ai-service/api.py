from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from extractor import router as keyword_router
from extractor import FormData, extract_keywords

import subprocess
import sys
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://leadequator.live",
        "https://www.leadequator.live",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "LeadEquator AI service running"}

app.include_router(keyword_router)


# 🔥 Background runner (IMPORTANT)
def run_quora_scraper():
    """
    Runs Quora scraper as a BACKGROUND TASK.
    This avoids blocking the API.
    """
    try:
        subprocess.Popen([
            sys.executable,
            "quora_test/quora_scrapper.py"
        ])
    except Exception as e:
        print("Quora scraper failed:", e)


@app.post("/start-lidity-discovery")
def start_lidity_discovery(
    data: FormData,
    background_tasks: BackgroundTasks
):
    keyword_response = extract_keywords(data)

    if "error" in keyword_response:
        return keyword_response

    # ✅ Trigger Quora safely (background)
    background_tasks.add_task(run_quora_scraper)

    return {
        "status": "discovery_started",
        "keywords": keyword_response["core_keywords"],
        "quora": "started in background",
        "note": "Quora runs locally / worker only"
    }
