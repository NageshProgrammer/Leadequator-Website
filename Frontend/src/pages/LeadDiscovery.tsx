import { useEffect, useState } from "react";

type ExtractedKeyword = {
  keyword: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const AI_BASE = import.meta.env.VITE_AI_SERVICE_URL;

export default function LeadDiscovery() {
  const [buyerKeywords, setBuyerKeywords] = useState<string[]>([]);
  const [aiKeywords, setAiKeywords] = useState<string[]>([]);
  const [loadingBuyerKeywords, setLoadingBuyerKeywords] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  /* ===============================
     FETCH BUYER KEYWORDS (DB)
  ================================ */
  const fetchBuyerKeywords = async () => {
    if (!userId) {
      setError("User not onboarded yet");
      setLoadingBuyerKeywords(false);
      return;
    }

    try {
      setError("");

      const res = await fetch(
        `${API_BASE}/api/lead-discovery/keywords?userId=${userId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch buyer keywords");
      }

      const data = await res.json();
      setBuyerKeywords(data.keywords || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load buyer keywords");
    } finally {
      setLoadingBuyerKeywords(false);
    }
  };

  /* ===============================
     CALL HOSTINGER AI SERVICE
     /extract-keywords
  ================================ */
  const extractKeywordsFromAI = async () => {
    if (!buyerKeywords.length) {
      setError("No buyer keywords available");
      return;
    }

    try {
      setExtracting(true);
      setError("");
      setAiKeywords([]);

      const res = await fetch(`${AI_BASE}/extract-keywords`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: buyerKeywords,
          userId, // optional but future-proof
        }),
      });

      if (!res.ok) {
        throw new Error("AI keyword extraction failed");
      }

      const data = await res.json();

      // expecting: { keywords: [...] }
      setAiKeywords(data.keywords || []);
    } catch (err) {
      console.error(err);
      setError("Failed to extract keywords using AI service");
    } finally {
      setExtracting(false);
    }
  };

  /* ===============================
     INITIAL LOAD
  ================================ */
  useEffect(() => {
    fetchBuyerKeywords();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          🔍 Lead <span className="text-yellow-400">Discovery</span>
        </h1>

        {/* BUYER KEYWORDS */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">🎯 Buyer Keywords</h2>

          {loadingBuyerKeywords ? (
            <p className="text-gray-400">Loading keywords…</p>
          ) : buyerKeywords.length === 0 ? (
            <p className="text-red-400">No keywords found.</p>
          ) : (
            <ul className="list-disc list-inside text-yellow-300 space-y-1">
              {buyerKeywords.map((kw) => (
                <li key={kw}>{kw}</li>
              ))}
            </ul>
          )}
        </div>

        {/* AI BUTTON */}
        <button
          onClick={extractKeywordsFromAI}
          disabled={extracting || !buyerKeywords.length}
          className="w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {extracting ? "Extracting with AI…" : "Run AI Keyword Extraction"}
        </button>

        {/* ERROR */}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* AI RESULTS */}
        {aiKeywords.length > 0 && (
          <div className="mt-8 bg-zinc-900 border border-zinc-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              🧠 AI-Extracted Keywords
            </h2>

            <ul className="list-disc list-inside text-green-400 space-y-1">
              {aiKeywords.map((kw, index) => (
                <li key={index}>{kw}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
