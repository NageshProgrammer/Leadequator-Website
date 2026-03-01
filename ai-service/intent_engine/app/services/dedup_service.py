from urllib.parse import urlparse

def normalize_title(title: str):
    return title.strip().lower()

def extract_domain(url: str):
    parsed = urlparse(url)
    return parsed.netloc.replace("www.", "")

def deduplicate_leads(leads):

    seen_urls = set()
    seen_titles = set()

    unique_leads = []

    for lead in leads:

        url = lead.get("link", "")
        title = lead.get("title", "")

        normalized_title = normalize_title(title)

        if url in seen_urls:
            continue

        if normalized_title in seen_titles:
            continue

        seen_urls.add(url)
        seen_titles.add(normalized_title)

        unique_leads.append(lead)

    return unique_leads