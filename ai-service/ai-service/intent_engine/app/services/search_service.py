import requests
from intent_engine.app.config import SERPER_API_KEY

def search_web(query):
    url = "https://google.serper.dev/search"

    headers = {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "q": query,
        "num": 5
    }

    response = requests.post(url, headers=headers, json=payload)
    data = response.json()

    results = []

    if "organic" in data:
        for item in data["organic"]:
            results.append({
                "title": item.get("title"),
                "link": item.get("link"),
                "snippet": item.get("snippet")
            })

    return results