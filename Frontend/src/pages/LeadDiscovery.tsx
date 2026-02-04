import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function LeadDiscovery() {
  const [buyerKeywords, setBuyerKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  /* ===============================
     FETCH BUYER KEYWORDS
  ================================ */
  const fetchBuyerKeywords = async () => {
    if (!userId) {
      setError("User not onboarded");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/lead-discovery/keywords?userId=${userId}`
      );

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setBuyerKeywords(data.keywords || []);
    } catch {
      setError("Failed to load keywords");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     RUN REDDIT SCRAPING
  ================================ */
  const runRedditScraping = async () => {
    try {
      setRunning(true);
      setError("");
      setMessage("");

      const res = await fetch(
        `${API_BASE}/api/lead-discovery/reddit/run`,
        { method: "POST" }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      setMessage(data.message || "Reddit scraping completed");
    } catch (err) {
      console.error(err);
      setError("Reddit scraping failed");
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    fetchBuyerKeywords();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          🔍 Lead <span className="text-yellow-400">Discovery</span>
        </h1>

        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">🎯 Buyer Keywords</h2>

          {loading ? (
            <p className="text-gray-400">Loading…</p>
          ) : buyerKeywords.length === 0 ? (
            <p className="text-red-400">No keywords found</p>
          ) : (
            <ul className="list-disc list-inside text-yellow-300">
              {buyerKeywords.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={runRedditScraping}
          disabled={running}
          className="w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {running ? "Scraping Reddit…" : "Run Reddit Scraping"}
        </button>

        {message && <p className="mt-4 text-green-400">{message}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}
