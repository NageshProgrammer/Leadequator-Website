import requests
from bs4 import BeautifulSoup

def scrape_content(url):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")

        # Remove scripts and styles
        for script in soup(["script", "style"]):
            script.decompose()

        text = soup.get_text(separator=" ")
        clean_text = " ".join(text.split())

        return clean_text[:5000]  # limit size for Gemini

    except Exception as e:
        return ""