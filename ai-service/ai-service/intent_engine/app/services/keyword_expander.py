def expand_keywords(industry, buying_signals):
    base_keywords = [
        industry,
        buying_signals,
        f"{industry} procurement",
        f"{industry} RFP",
        f"{industry} supplier search",
        f"{industry} expansion news",
    ]
    return list(set(base_keywords))