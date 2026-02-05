import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

type RedditPost = {
  id: string;
  text: string;
  url: string;
  author: string;
  createdAt: string;
};

export default function LeadDiscovery() {
  const [buyerKeywords, setBuyerKeywords] = useState<string[]>([]);
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  /* ===============================
     LOAD KEYWORDS
  ================================ */
  const loadKeywords = async () => {
    const res = await fetch(
      `${API_BASE}/api/lead-discovery/keywords?userId=${userId}`
    );
    const data = await res.json();
    setBuyerKeywords(data.keywords || []);
    setLoading(false);
  };

  /* ===============================
     LOAD REDDIT POSTS
  ================================ */
  const loadPosts = async () => {
    const res = await fetch(
      `${API_BASE}/api/lead-discovery/reddit/posts?userId=${userId}`
    );
    const data = await res.json();
    setPosts(data.posts || []);
  };

  /* ===============================
     RUN SCRAPER
  ================================ */
  const runScraping = async () => {
    setRunning(true);
    setError("");
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

      if (!res.ok) throw new Error();

      setMessage("✅ Reddit scraping started");
      setTimeout(loadPosts, 5000); // wait for AI
    } catch {
      setError("❌ Reddit scraping failed");
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    loadKeywords();
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">
          Lead <span className="text-yellow-400">Discovery</span>
        </h1>

        {/* Keywords */}
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="font-semibold mb-2">Buyer Keywords</h2>
          {loading ? "Loading..." : (
            <ul className="list-disc ml-6 text-yellow-300">
              {buyerKeywords.map(k => <li key={k}>{k}</li>)}
            </ul>
          )}
        </div>

        <button
          onClick={runScraping}
          disabled={running}
          className="w-full bg-yellow-400 text-black py-3 rounded-xl font-bold"
        >
          {running ? "Running…" : "Run Reddit Scraping"}
        </button>

        {message && <p className="text-green-400">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(p => (
            <div key={p.id} className="bg-zinc-900 p-4 rounded-xl">
              <p className="text-sm text-gray-400">u/{p.author}</p>
              <p className="mt-2">{p.text}</p>
              <a
                href={p.url}
                target="_blank"
                className="text-yellow-400 text-sm mt-2 inline-block"
              >
                View on Reddit →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
