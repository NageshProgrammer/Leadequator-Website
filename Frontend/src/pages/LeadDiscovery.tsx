import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

type RedditPost = {
  keyword: string;
  title: string;
  url: string;
  score?: number;
  comments?: number;
  subreddit?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function LeadDiscovery() {
  const { getToken, isSignedIn } = useAuth();

  const [keywords, setKeywords] = useState<string[]>([]);
  const [loadingKeywords, setLoadingKeywords] = useState(true);

  const [scraping, setScraping] = useState(false);
  const [redditPosts, setRedditPosts] = useState<RedditPost[]>([]);
  const [error, setError] = useState("");

  /* ===============================
     FETCH KEYWORDS FROM BACKEND
  ================================ */
  const fetchKeywords = async () => {
    if (!isSignedIn) return;

    try {
      setLoadingKeywords(true);
      setError("");

      const token = await getToken();

      const res = await fetch(
        `${API_BASE}/api/lead-discovery/keywords`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to load keywords");
      }

      const data = await res.json();
      setKeywords(data.keywords || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load buyer keywords");
    } finally {
      setLoadingKeywords(false);
    }
  };

  /* ===============================
     SCRAPE REDDIT VIA BACKEND
  ================================ */
  const scrapeReddit = async () => {
    if (!keywords.length || !isSignedIn) {
      setError("No keywords available for scraping");
      return;
    }

    try {
      setScraping(true);
      setError("");
      setRedditPosts([]);

      const token = await getToken();

      const res = await fetch(
        `${API_BASE}/api/lead-discovery/scrape`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ keywords }),
        }
      );

      if (!res.ok) {
        throw new Error("Scraping failed");
      }

      const data = await res.json();
      setRedditPosts(data.posts || []);
    } catch (err) {
      console.error(err);
      setError("Failed to scrape Reddit data");
    } finally {
      setScraping(false);
    }
  };

  /* ===============================
     LOAD ON MOUNT
  ================================ */
  useEffect(() => {
    fetchKeywords();
  }, [isSignedIn]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          🔍 Lead <span className="text-yellow-400">Discovery</span>
        </h1>

        <p className="text-gray-400 mb-8">
          Discover buyer intent using keywords from your onboarding data
        </p>

        {/* KEYWORDS */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">🎯 Buyer Keywords</h2>

          {loadingKeywords ? (
            <p className="text-gray-400">Loading keywords…</p>
          ) : keywords.length === 0 ? (
            <p className="text-red-400">
              No keywords found. Complete onboarding first.
            </p>
          ) : (
            <ul className="list-disc list-inside text-yellow-300 space-y-1">
              {keywords.map((kw) => (
                <li key={kw}>{kw}</li>
              ))}
            </ul>
          )}
        </div>

        {/* SCRAPE BUTTON */}
        <button
          onClick={scrapeReddit}
          disabled={scraping || loadingKeywords || !keywords.length}
          className="w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold hover:bg-yellow-300 transition disabled:opacity-50"
        >
          {scraping ? "Scraping Reddit…" : "Scrape Reddit Data"}
        </button>

        {/* ERROR */}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* RESULTS */}
        {redditPosts.length > 0 && (
          <div className="mt-10 bg-zinc-900 border border-zinc-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">👽 Reddit Leads</h2>

            <ul className="space-y-3 text-sm">
              {redditPosts.map((post, idx) => (
                <li
                  key={idx}
                  className="border border-zinc-700 rounded-lg p-3"
                >
                  <p className="font-medium">{post.title}</p>
                  <p className="text-xs text-gray-400">
                    Keyword: {post.keyword}
                  </p>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 text-xs"
                  >
                    View Post
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
