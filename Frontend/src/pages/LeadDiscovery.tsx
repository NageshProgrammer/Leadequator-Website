import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function LeadDiscovery() {
  const [buyerKeywords, setBuyerKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    fetch(`${API_BASE}/api/lead-discovery/keywords?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setBuyerKeywords(data.keywords || []))
      .finally(() => setLoading(false));
  }, [userId]);

  const runScrape = async () => {
    setRunning(true);
    setStatus("");

    const res = await fetch(
      `${API_BASE}/api/lead-discovery/reddit/run`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }
    );

    const data = await res.json();
    setStatus(res.ok ? "✅ Scraping started" : "❌ Failed");
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl mb-6">Lead Discovery</h1>

      <div className="bg-zinc-900 p-6 rounded mb-6">
        <h2 className="mb-3">Buyer Keywords</h2>
        {loading ? "Loading..." : buyerKeywords.map((k) => <div key={k}>• {k}</div>)}
      </div>

      <button
        onClick={runScrape}
        disabled={running || !buyerKeywords.length}
        className="bg-yellow-400 text-black px-6 py-3 rounded"
      >
        {running ? "Running..." : "Run Reddit Scraping"}
      </button>

      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}
