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
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/lead-discovery/keywords?userId=${userId}`
      );

      const data = await res.json();
      setBuyerKeywords(data.keywords || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load buyer keywords");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     RUN REDDIT SCRAPING
  ================================ */
  const runRedditScraping = async () => {
    if (!userId) return;

    try {
      setRunning(true);
      setError("");
      setMessage("");

      const res = await fetch(
        `${API_BASE}/api/lead-discovery/reddit/run`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Scraping failed");
      }

      setMessage("✅ Reddit scraping started successfully");
    } catch (err: any) {
      console.error(err);
      setError("❌ Reddit scraping failed");
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

        {/* BUYER KEYWORDS */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">🎯 Buyer Keywords</h2>

          {loading ? (
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

        {/* RUN BUTTON */}
        <button
          onClick={runRedditScraping}
          disabled={running || !buyerKeywords.length}
          className="w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {running ? "Running…" : "Run Reddit Scraping"}
        </button>

        {/* STATUS */}
        {message && <p className="mt-4 text-green-400">{message}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}
