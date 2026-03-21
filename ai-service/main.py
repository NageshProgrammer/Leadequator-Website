from api import app

# ADD THESE IMPORTS
from intent_engine.app.routes import lead_routes, search_routes

# REGISTER ROUTES
app.include_router(lead_routes.router, prefix="/intent")
app.include_router(search_routes.router, prefix="/intent")

if __name__ == "__main__":
    import os
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "80")))