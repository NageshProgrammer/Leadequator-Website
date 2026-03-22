from api import app

# 🔥 ADD CORS HERE (IMPORTANT)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://www.leadequator.live",
        "https://leadequator.live",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 IMPORT ROUTES
from intent_engine.app.routes import lead_routes, search_routes

# 🔥 REGISTER ROUTES
app.include_router(lead_routes.router, prefix="/intent")
app.include_router(search_routes.router, prefix="/intent")

# 🔥 OPTIONAL HEALTH CHECK (GOOD PRACTICE)
@app.get("/health")
def health():
    return {"status": "AI service running"}

# 🔥 RUN SERVER
if __name__ == "__main__":
    import os
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=False
    )
