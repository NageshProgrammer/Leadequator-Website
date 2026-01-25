import uvicorn
from api import app

# Azure uses gunicorn, not uvicorn.run
if __name__ == "__main__":
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=False
    )
