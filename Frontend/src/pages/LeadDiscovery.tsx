import { useEffect, useState, useCallback } from "react";
import { Clock, ExternalLink, Hash, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  question: string;
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

  const loadKeywords = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE}/api/lead-discovery/keywords?userId=${userId}`);
      const data = await res.json();
      setBuyerKeywords(data.keywords || []);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadPosts = useCallback(async () => {
    if (!userId) return;
    const res = await fetch(`${API_BASE}/api/lead-discovery/reddit/posts?userId=${userId}`);
    const data = await res.json();
    setPosts(data.posts || []);
  }, [userId]);

  const loadQuoraPosts = useCallback(async () => {
    if (!userId) return;
    const res = await fetch(`${API_BASE}/api/lead-discovery/quora/posts?userId=${userId}`);
    const data = await res.json();
    setQuoraPosts(data.posts || []);
  }, [userId]);

  const runScraping = async () => {
    if (!userId) { setError("User not found"); return; }
    setRunning(true); setError(""); setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/lead-discovery/reddit/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, forceLogin: true }),
      });
      if (!res.ok) throw new Error("Reddit failed");
      setMessage("🔐 Reddit scraping started.");
      setTimeout(loadPosts, 5000);
    } catch (err: any) {
      setError(err.message);
    } finally { setRunning(false); }
  };

  const runQuoraScraping = async () => {
    if (!userId) { setError("User not found"); return; }
    setRunningQuora(true); setError(""); setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/lead-discovery/quora/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Quora failed");
      setMessage("🟢 Quora query executed.");
      setTimeout(loadQuoraPosts, 5000);
    } catch (err: any) {
      setError(err.message);
    } finally { setRunningQuora(false); }
  };

  useEffect(() => {
    loadKeywords();
    loadPosts();
    loadQuoraPosts();
  }, [loadKeywords, loadPosts, loadQuoraPosts]);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold">
            Lead <span className="text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">Discovery</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base">Scrape high-intent leads from social platforms using your keywords.</p>
        </div>

        {/* Keywords Section */}
        <Card className="bg-zinc-900 border-zinc-800 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-5 h-5 text-[#FFD700]" />
            <h2 className="text-lg font-semibold text-white">Target Buyer Keywords</h2>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-zinc-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {buyerKeywords.map((k) => (
                <Badge key={k} className="bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/20 hover:bg-[#FFD700]/20 px-3 py-1 text-xs md:text-sm">
                  {k}
                </Badge>
              ))}
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            onClick={runScraping} 
            disabled={running}
            className="h-14 md:h-16 bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold text-base md:text-lg rounded-xl shadow-[0_4px_15px_rgba(255,215,0,0.2)]"
          >
            {running ? <Loader2 className="mr-2 animate-spin" /> : <Play className="mr-2 w-5 h-5 fill-current" />}
            {running ? "Scraping Reddit..." : "Run Reddit Scraping"}
          </Button>

          <Button 
            onClick={runQuoraScraping} 
            disabled={runningQuora}
            className="h-14 md:h-16 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-base md:text-lg rounded-xl"
          >
            {runningQuora ? <Loader2 className="mr-2 animate-spin" /> : <Play className="mr-2 w-5 h-5 fill-current" />}
            {runningQuora ? "Searching Quora..." : "Run Quora Query"}
          </Button>
        </div>

        {/* Status Messages */}
        {(message || error) && (
          <div className={`p-4 rounded-lg text-sm font-medium ${message ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {message || error}
          </div>
        )}

        {/* Reddit Section */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            Reddit <span className="text-[#FFD700]">Results</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((p) => (
              <Card key={p.id} className="bg-zinc-900 border-zinc-800 p-4 md:p-5 flex flex-col justify-between hover:border-[#FFD700]/30 transition-colors">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] md:text-xs text-zinc-500">
                    <span className="font-medium text-[#FFD700]">u/{p.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-zinc-200 text-sm md:text-base leading-relaxed line-clamp-4">
                    {p.text}
                  </p>
                </div>
                <Button variant="link" className="text-[#FFD700] p-0 h-auto mt-4 w-fit text-sm" onClick={() => window.open(p.url, "_blank")}>
                  View on Reddit <ExternalLink className="ml-1 w-3 h-3" />
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Quora Section */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            Quora <span className="text-emerald-500">Results</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quoraPosts.map((p) => (
              <Card key={p.id} className="bg-zinc-900 border-zinc-800 p-4 md:p-5 flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
                <p className="text-zinc-200 font-medium text-sm md:text-base leading-relaxed line-clamp-3">
                  {p.question}
                </p>
                <Button variant="link" className="text-emerald-500 p-0 h-auto mt-4 w-fit text-sm" onClick={() => window.open(p.url, "_blank")}>
                  View on Quora <ExternalLink className="ml-1 w-3 h-3" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}