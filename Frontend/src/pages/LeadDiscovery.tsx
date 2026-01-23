import { useState } from "react";

const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL;

export default function LeadDiscovery() {
  const [form, setForm] = useState({
    industry: "",
    company_type: "",
    interests: "",
    problem: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);

  const [result, setResult] = useState<any>(null);
  const [redditData, setRedditData] = useState<any>(null);

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Step 1: Keyword Discovery
  const runDiscovery = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setRedditData(null);

    try {
      const res = await fetch(`${AI_BASE_URL}/extract-keywords`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("AI failed");
      }

      setResult(data);
    } catch (err) {
      setError("AI service not reachable");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Step 2: Scrape Reddit using extracted keywords
  const scrapeReddit = async () => {
    if (!result?.core_keywords?.length) {
      setError("No keywords available for scraping");
      return;
    }

    setScraping(true);
    setError("");

    try {
      const res = await fetch(`${AI_BASE_URL}/scrape-reddit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: result.core_keywords,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Reddit scraping failed");
      }

      setRedditData(data);
    } catch (err) {
      setError("Failed to scrape Reddit data");
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          🔍 Lead <span className="text-yellow-400">Discovery</span>
        </h1>
        <p className="text-gray-400 mb-10">
          Discover organic buyer intent using AI-powered keyword intelligence
        </p>

        {/* FORM */}
        <div className="grid gap-4">
          {["industry", "company_type", "interests", "problem", "location"].map(
            (field) => (
              <input
                key={field}
                name={field}
                placeholder={field.replace("_", " ").toUpperCase()}
                value={(form as any)[field]}
                onChange={handleChange}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm"
              />
            )
          )}
        </div>

        {/* DISCOVERY BUTTON */}
        <button
          onClick={runDiscovery}
          disabled={loading}
          className="mt-6 w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold hover:bg-yellow-300 transition"
        >
          {loading ? "Analyzing..." : "Start Lead Discovery"}
        </button>

        {/* SCRAPE BUTTON */}
        {result && (
          <button
            onClick={scrapeReddit}
            disabled={scraping}
            className="mt-4 w-full bg-zinc-800 border border-zinc-600 py-3 rounded-xl font-semibold hover:bg-zinc-700 transition"
          >
            {scraping ? "Scraping Reddit..." : "Scrape Real Data"}
          </button>
        )}

        {/* ERROR */}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* KEYWORD RESULTS */}
        {result && (
          <div className="mt-10 bg-zinc-900 border border-zinc-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">🎯 Core Keywords</h2>
            <ul className="list-disc list-inside text-yellow-300 space-y-1">
              {result.core_keywords.map((kw: string) => (
                <li key={kw}>{kw}</li>
              ))}
            </ul>
          </div>
        )}

        {/* REDDIT RESULTS */}
        {redditData && (
          <div className="mt-10 bg-zinc-900 border border-zinc-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">👽 Reddit Leads</h2>

            {redditData.results.map((group: any) => (
              <div key={group.keyword} className="mb-6">
                <h3 className="text-yellow-400 font-semibold mb-2">
                  Keyword: {group.keyword}
                </h3>

                <ul className="space-y-2 text-sm">
                  {group.posts.map((post: any, idx: number) => (
                    <li
                      key={idx}
                      className="border border-zinc-700 rounded-lg p-3"
                    >
                      <p className="font-medium">{post.title}</p>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
