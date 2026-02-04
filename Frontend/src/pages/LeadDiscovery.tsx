import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function LeadDiscovery() {
  const [buyerKeywords, setBuyerKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = localStorage.getItem("userId");

  /* ===============================
     FETCH BUYER KEYWORDS
  =============================== */
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
  =============================== */
  const runRedditScraping = async () => {
    try {
      setRunning(true);
      setError("");
      setSuccess("");

      const res = await fetch(
        `${API_BASE}/api/lead-discovery/reddit/run`,
        { method: "POST" }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Reddit scraping failed");
      }

      setSuccess("✅ Reddit scraping completed successfully");

    } catch (err: any) {
      setError(err.message || "Reddit scraping failed");
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
          <h2 className="font-semibold mb-3">Buyer Keywords</h2>

          {loading ? (
            <p>Loading…</p>
          ) : buyerKeywords.length === 0 ? (
            <p className="text-red-400">No keywords found</p>
          ) : (
            <ul className="list-disc list-inside text-yellow-300">
              {buyerKeywords.map(k => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          )}
        </div>

        {/* BUTTON */}
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
