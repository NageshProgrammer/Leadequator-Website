from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from extractor import router as keyword_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://leadequator.live",
        "https://www.leadequator.live"
    ],    
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "LeadEquator AI service running"}

# 🔥 mount keyword routes
app.include_router(keyword_router)
