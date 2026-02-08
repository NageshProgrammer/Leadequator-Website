import { useEffect, useState, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

type RedditPost = {
  id: string;
  text: string;
  url: string;
  author: string;
  createdAt: string;
};

type QuoraPost = {
  id: string;
  content: string;
  url: string;
  author: string | null;
};

export default function LeadDiscovery() {
  const [buyerKeywords, setBuyerKeywords] = useState<string[]>([]);
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [quoraPosts, setQuoraPosts] = useState<QuoraPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [runningQuora, setRunningQuora] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  /* ===============================
     LOAD BUYER KEYWORDS
  ================================ */
  const loadKeywords = useCallback(async () => {
    if (!userId) return;

    const res = await fetch(
      `${API_BASE}/api/lead-discovery/keywords?userId=${userId}`
    );
    const data = await res.json();

    setBuyerKeywords(data.keywords || []);
    setLoading(false);
  }, [userId]);

  /* ===============================
     LOAD REDDIT POSTS
  ================================ */
  const loadPosts = useCallback(async () => {
    if (!userId) return;

    const res = await fetch(
      `${API_BASE}/api/lead-discovery/reddit/posts?userId=${userId}`
    );
    const data = await res.json();

    setPosts(data.posts || []);
  }, [userId]);

  /* ===============================
     LOAD QUORA POSTS
  ================================ */
  const loadQuoraPosts = useCallback(async () => {
    if (!userId) return;

    const res = await fetch(
      `${API_BASE}/quora/posts?userId=${userId}`
    );
    const data = await res.json();

    setQuoraPosts(data.data || []);
  }, [userId]);

  /* ===============================
     RUN REDDIT SCRAPING
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
          body: JSON.stringify({
            userId,
            forceLogin: true,
          }),
        }
      );

      if (!res.ok) throw new Error();

      setMessage("🔐 Reddit scraping started.");

      setTimeout(loadPosts, 5000);
    } catch {
      setError("❌ Reddit scraping failed");
    } finally {
      setRunning(false);
    }
  };

  /* ===============================
     RUN QUORA SCRAPING
  ================================ */
  const runQuoraScraping = async () => {
    setRunningQuora(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        `${API_BASE}/quora/run`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            keywords: buyerKeywords,
          }),
        }
      );

      if (!res.ok) throw new Error();

      setMessage("🟢 Quora query executed successfully.");

      setTimeout(loadQuoraPosts, 3000);
    } catch {
      setError("❌ Quora scraping failed");
    } finally {
      setRunningQuora(false);
    }
  };

  useEffect(() => {
    loadKeywords();
    loadPosts();
    loadQuoraPosts();
  }, [loadKeywords, loadPosts, loadQuoraPosts]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">
          Lead <span className="text-yellow-400">Discovery</span>
        </h1>

        {/* BUYER KEYWORDS */}
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="font-semibold mb-2">Buyer Keywords</h2>
          {loading ? (
            "Loading..."
          ) : (
            <ul className="list-disc ml-6 text-yellow-300">
              {buyerKeywords.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-4">
          <button
            onClick={runScraping}
            disabled={running}
            className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg"
          >
            {running ? "Running…" : "Run Reddit Scraping"}
          </button>

          <button
            onClick={runQuoraScraping}
            disabled={runningQuora}
            className="w-full bg-green-500 text-black py-4 rounded-xl font-bold text-lg"
          >
            {runningQuora ? "Running…" : "Run Quora Query"}
          </button>
        </div>

        {message && <p className="text-green-400">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* REDDIT RESULTS */}
        <h2 className="text-2xl font-bold mt-8">Reddit Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((p) => (
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

        {/* QUORA RESULTS */}
        <h2 className="text-2xl font-bold mt-8">Quora Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quoraPosts.map((p) => (
            <div key={p.id} className="bg-zinc-900 p-4 rounded-xl">
              <p className="mt-2">{p.content}</p>
              <a
                href={p.url}
                target="_blank"
                className="text-green-400 text-sm mt-2 inline-block"
              >
                View on Quora →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
