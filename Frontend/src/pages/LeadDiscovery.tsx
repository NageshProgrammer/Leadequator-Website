import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function LeadDiscovery() {
  const [buyerKeywords, setBuyerKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = localStorage.getItem("userId");

  /* =====================================
     FETCH BUYER KEYWORDS
  ===================================== */
  const fetchBuyerKeywords = async () => {
    try {
      if (!userId) {
        setError("User not onboarded");
        return;
      }

      const res = await fetch(
        `${API_BASE}/api/lead-discovery/keywords?userId=${userId}`
      );

      if (!res.ok) throw new Error("Failed to load keywords");

      const data = await res.json();
      setBuyerKeywords(data.keywords || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load buyer keywords");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
     RUN REDDIT SCRAPING
  ===================================== */
  const runRedditScraping = async () => {
    try {
      setRunning(true);
      setError("");
      setSuccess("");

      const res = await fetch(
        `${API_BASE}/api/lead-discovery/reddit/run`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();

      setSuccess("✅ Reddit scraping started successfully");
      console.log("SCRAPE RESPONSE:", data);
    } catch (err) {
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

        {/* KEYWORDS */}
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
          {running ? "Running Reddit Scraping…" : "Run Reddit Scraping"}
        </button>

        {/* STATUS */}
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {success && <p className="mt-4 text-green-400">{success}</p>}
      </div>
    </div>
  );
}
