import { useEffect, useState } from "react";

type RedditPost = {
  keyword: string;
  title: string;
  url: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const AI_BASE = import.meta.env.VITE_AI_SERVICE_URL;

export default function LeadDiscovery() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loadingKeywords, setLoadingKeywords] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [redditPosts, setRedditPosts] = useState<RedditPost[]>([]);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  /* ===============================
     FETCH KEYWORDS
  ================================ */
  const fetchKeywords = async () => {
    if (!userId) {
      setError("User not onboarded yet");
      setLoadingKeywords(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/lead-discovery/keywords?userId=${userId}`,
      );

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setKeywords(data.keywords || []);
    } catch {
      setError("Failed to load buyer keywords");
    } finally {
      setLoadingKeywords(false);
    }
  };

  /* ===============================
     SCRAPE REDDIT
  ================================ */
  const scrapeReddit = async () => {
    if (!keywords.length || !userId) {
      setError("User not onboarded yet");
      return;
    }

    try {
      setScraping(true);
      setRedditPosts([]);

      const res = await fetch(`${AI_BASE}/scrape-reddit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(keywords), // AI expects ONLY array
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setRedditPosts(data.posts || []);
    } catch {
      setError("Failed to scrape Reddit data");
    } finally {
      setScraping(false);
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          🔍 Lead <span className="text-yellow-400">Discovery</span>
        </h1>

        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">🎯 Buyer Keywords</h2>

          {loadingKeywords ? (
            <p className="text-gray-400">Loading keywords…</p>
          ) : keywords.length === 0 ? (
            <p className="text-red-400">No keywords found.</p>
          ) : (
            <ul className="list-disc list-inside text-yellow-300">
              {keywords.map((kw) => (
                <li key={kw}>{kw}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={scrapeReddit}
          disabled={scraping || !keywords.length}
          className="w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold"
        >
          {scraping ? "Scraping…" : "Scrape Reddit Data"}
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}
