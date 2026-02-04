import { useEffect, useState } from "react";

/* ===============================
   TYPES
================================ */
type RedditPost = {
  keyword: string;
  title: string;
  url: string;
};

/* ===============================
   ENV
================================ */
const API_BASE = import.meta.env.VITE_API_BASE_URL;        // Node backend
const AI_BASE = import.meta.env.VITE_AI_SERVICE_URL;       // Hostinger AI service

export default function LeadDiscovery() {
  const userId = localStorage.getItem("userId");

  /* ===============================
     STATE
  ================================ */
  const [buyerKeywords, setBuyerKeywords] = useState<string[]>([]);
  const [aiKeywords, setAiKeywords] = useState<string[]>([]);
  const [redditPosts, setRedditPosts] = useState<RedditPost[]>([]);

  const [loadingKeywords, setLoadingKeywords] = useState(true);
  const [extractingAI, setExtractingAI] = useState(false);
  const [scrapingReddit, setScrapingReddit] = useState(false);
  const [error, setError] = useState("");

  /* ===============================
     1️⃣ FETCH BUYER KEYWORDS (DB)
  ================================ */
  const fetchBuyerKeywords = async () => {
    if (!userId) {
      setError("User not onboarded yet");
      setLoadingKeywords(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/lead-discovery/keywords?userId=${userId}`
      );

      if (!res.ok) throw new Error("Failed to fetch keywords");

      const data = await res.json();
      setBuyerKeywords(data.keywords || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load buyer keywords");
    } finally {
      setLoadingKeywords(false);
    }
  };

  /* ===============================
     2️⃣ RUN AI KEYWORD EXTRACTION
     (Hostinger AI Service)
  ================================ */
  const runAIExtraction = async () => {
    if (!buyerKeywords.length) {
      setError("No buyer keywords available");
      return;
    }

    try {
      setExtractingAI(true);
      setError("");
      setAiKeywords([]);

      const res = await fetch(`${AI_BASE}/extract-keywords`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: buyerKeywords.join(" "),
          industry: "SaaS",
          company_type: "startup",
          location: "India",
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt);
      }

      const data = await res.json();
      setAiKeywords(data.core_keywords || []);
    } catch (err) {
      console.error(err);
      setError("AI keyword extraction failed");
    } finally {
      setExtractingAI(false);
    }
  };

  /* ===============================
     3️⃣ RUN REDDIT SCRAPING
     (Backend → AI Reddit Pipeline)
  ================================ */
  const runRedditScraping = async () => {
    if (!aiKeywords.length) {
      setError("Run AI extraction before Reddit scraping");
      return;
    }

    try {
      setScrapingReddit(true);
      setError("");
      setRedditPosts([]);

      const res = await fetch(
        `${API_BASE}/api/lead-discovery/scrape`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keywords: aiKeywords }),
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt);
      }

      const data = await res.json();
      setRedditPosts(data.posts || []);
    } catch (err) {
      console.error(err);
      setError("Reddit scraping failed");
    } finally {
      setScrapingReddit(false);
    }
  };

  /* ===============================
     INITIAL LOAD
  ================================ */
  useEffect(() => {
    fetchBuyerKeywords();
  }, []);

  /* ===============================
     UI
  ================================ */
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">
          🔍 Lead <span className="text-yellow-400">Discovery</span>
        </h1>

        {/* BUYER KEYWORDS */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-3">🎯 Buyer Keywords</h2>

          {loadingKeywords ? (
            <p className="text-gray-400">Loading…</p>
          ) : buyerKeywords.length === 0 ? (
            <p className="text-red-400">No keywords found</p>
          ) : (
            <ul className="list-disc list-inside text-yellow-300 space-y-1">
              {buyerKeywords.map((kw) => (
                <li key={kw}>{kw}</li>
              ))}
            </ul>
          )}
        </div>

        {/* AI BUTTON */}
        <button
          onClick={runAIExtraction}
          disabled={extractingAI || !buyerKeywords.length}
          className="w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {extractingAI ? "Running AI Extraction…" : "Run AI Keyword Extraction"}
        </button>

        {/* AI KEYWORDS */}
        {aiKeywords.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3">
              🧠 AI-Extracted Keywords
            </h2>
            <ul className="list-disc list-inside text-green-400 space-y-1">
              {aiKeywords.map((kw, i) => (
                <li key={i}>{kw}</li>
              ))}
            </ul>
          </div>
        )}

        {/* REDDIT BUTTON */}
        <button
          onClick={runRedditScraping}
          disabled={scrapingReddit || !aiKeywords.length}
          className="w-full bg-blue-500 text-black py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {scrapingReddit ? "Scraping Reddit…" : "Run Reddit Scraping"}
        </button>

        {/* REDDIT RESULTS */}
        {redditPosts.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3">
              📌 Reddit Leads
            </h2>
            <ul className="space-y-2">
              {redditPosts.map((post, i) => (
                <li key={i}>
                  <a
                    href={post.url}
                    target="_blank"
                    className="text-blue-400 underline"
                  >
                    {post.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
