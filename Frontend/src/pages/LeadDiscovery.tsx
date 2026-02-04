import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function LeadDiscovery() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");

  /* ===============================
     LOAD BUYER KEYWORDS
  ================================ */
  useEffect(() => {
    if (!userId) return;

    fetch(`${API_BASE}/api/lead-discovery/keywords?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setKeywords(data.keywords || []);
        setLoading(false);
      })
      .catch(() => {
        setMessage("Failed to load keywords");
        setLoading(false);
      });
  }, []);

  /* ===============================
     RUN REDDIT SCRAPING
  ================================ */
  const runRedditScraping = async () => {
    if (!userId) return;

    setRunning(true);
    setMessage("");

    try {
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
      setMessage("❌ Reddit scraping failed");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          🔍 Lead <span className="text-yellow-400">Discovery</span>
        </h1>

        <div className="bg-zinc-900 p-6 rounded-xl mb-6">
          <h2 className="font-semibold mb-3">Buyer Keywords</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="list-disc list-inside text-yellow-300">
              {keywords.map(k => <li key={k}>{k}</li>)}
            </ul>
          )}
        </div>

        <button
          onClick={runRedditScraping}
          disabled={running || !keywords.length}
          className="w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold"
        >
          {running ? "Running…" : "Run Reddit Scraping"}
        </button>

        {message && (
          <p className="mt-4 text-green-400">{message}</p>
        )}
      </div>
    </div>
  );
}
