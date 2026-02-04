import { useEffect, useState } from "react";

type RedditPost = {
  id: string;
  text: string;
  url: string;
  author: string | null;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function LeadDiscovery() {
  const [buyerKeywords, setBuyerKeywords] = useState<string[]>([]);
  const [redditPosts, setRedditPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  /* ===============================
     FETCH BUYER KEYWORDS
  ================================ */
  const fetchBuyerKeywords = async () => {
    if (!userId) return;

    const res = await fetch(
      `${API_BASE}/api/lead-discovery/keywords?userId=${userId}`
    );

    const data = await res.json();
    setBuyerKeywords(data.keywords || []);
  };

  /* ===============================
     FETCH REDDIT POSTS 🔥
  ================================ */
  const fetchRedditPosts = async () => {
    if (!userId) return;

    const res = await fetch(
      `${API_BASE}/api/lead-discovery/reddit/posts?userId=${userId}`
    );

    const data = await res.json();
    setRedditPosts(data.posts || []);
  };

  /* ===============================
     RUN REDDIT SCRAPING
  ================================ */
  const runRedditScraping = async () => {
    try {
      setScraping(true);
      setError("");

      const res = await fetch(
        `${API_BASE}/api/lead-discovery/reddit/run`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error();

      // wait a bit for DB insert
      setTimeout(fetchRedditPosts, 3000);
    } catch {
      setError("Reddit scraping failed");
    } finally {
      setScraping(false);
    }
  };

  /* ===============================
     INITIAL LOAD
  ================================ */
  useEffect(() => {
    fetchBuyerKeywords();
    fetchRedditPosts();
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          🔍 Lead <span className="text-yellow-400">Discovery</span>
        </h1>

        {/* BUYER KEYWORDS */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">🎯 Buyer Keywords</h2>

          {loading ? (
            <p className="text-gray-400">Loading…</p>
          ) : (
            <ul className="list-disc list-inside text-yellow-300">
              {buyerKeywords.map((kw) => (
                <li key={kw}>{kw}</li>
              ))}
            </ul>
          )}
        </div>

        {/* RUN BUTTON */}
        <button
          onClick={runRedditScraping}
          disabled={scraping}
          className="w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold"
        >
          {scraping ? "Scraping Reddit…" : "Run Reddit Scraping"}
        </button>

        {error && <p className="mt-4 text-red-500">❌ {error}</p>}

        {/* REDDIT POSTS */}
        {redditPosts.length > 0 && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {redditPosts.map((post) => (
              <div
                key={post.id}
                className="bg-zinc-900 border border-zinc-700 rounded-xl p-5"
              >
                <p className="text-sm text-gray-300 mb-3 line-clamp-4">
                  {post.text}
                </p>

                <a
                  href={post.url}
                  target="_blank"
                  className="text-yellow-400 text-sm underline"
                >
                  View on Reddit →
                </a>

                {post.author && (
                  <p className="text-xs text-gray-500 mt-2">
                    by {post.author}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
