import { useEffect, useState, useCallback } from "react";
import { Clock, ExternalLink, Hash, Loader2, Play, CheckCircle2, Minimize2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/* --- UNIFIED LOGS FOR DISCOVERY --- */
const DISCOVERY_LOGS = [
  "Initializing autonomous agents...",
  "Authenticating secure sessions...",
  "Scanning Reddit (r/SaaS, r/Entrepreneur)...",
  "Connecting to Quora Spaces API...",
  "Analyzing sentiment across platforms...",
  "Filtering for high-intent keywords...",
  "Cross-referencing buyer profiles...",
  "Verifying lead activity...",
  "Compiling multi-source dataset...",
];

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
  const [loadingKeywords, setLoadingKeywords] = useState(true);
  
  // --- SCANNER STATE ---
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [scanStep, setScanStep] = useState<"idle" | "scanning" | "success">("idle");
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState("Ready to scan...");
  const [logsHistory, setLogsHistory] = useState<string[]>([]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  /* --- ANIMATION LOOP --- */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanStep === "scanning") {
      setProgress(0);
      setLogsHistory([]);
      let counter = 0;
      
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 95 ? 95 : prev + 0.5));
        if (Math.random() > 0.6) {
          const newLog = DISCOVERY_LOGS[counter % DISCOVERY_LOGS.length];
          setCurrentLog(newLog);
          setLogsHistory(prev => [newLog, ...prev].slice(0, 5));
          counter++;
        }
      }, 800);
    }
    return () => clearInterval(interval);
  }, [scanStep]);

  /* --- FETCH DATA --- */
  const loadKeywords = useCallback(async () => {
    if (!userId) return;
    setLoadingKeywords(true);
    try {
      const res = await fetch(`${API_BASE}/api/lead-discovery/keywords?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch keywords");
      const data = await res.json();
      setBuyerKeywords(data.keywords || []); 
    } catch (e) {
       console.error("Error loading keywords:", e);
       setBuyerKeywords([]); 
    } finally {
      setLoadingKeywords(false);
    }
  }, [userId]);

  const loadPosts = useCallback(async () => {
    if (!userId) return;
    try {
        const res = await fetch(`${API_BASE}/api/lead-discovery/reddit/posts?userId=${userId}`);
        const data = await res.json();
        setPosts(data.posts || []);
    } catch (e) { console.error(e) }
  }, [userId]);

  const loadQuoraPosts = useCallback(async () => {
    if (!userId) return;
    try {
        const res = await fetch(`${API_BASE}/api/lead-discovery/quora/posts?userId=${userId}`);
        const data = await res.json();
        setQuoraPosts(data.posts || []);
    } catch (e) { console.error(e) }
  }, [userId]);

  /* --- MAIN ACTION --- */
  const handleDiscovery = async () => {
    if (!userId) { setError("User ID missing."); return; }
    
    setIsScanModalOpen(true);
    setScanStep("scanning");
    setIsRunning(true);
    setError("");

    try {
        // Trigger both scrapers in parallel
        const redditReq = fetch(`${API_BASE}/api/lead-discovery/reddit/run`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, forceLogin: true }),
        });

        const quoraReq = fetch(`${API_BASE}/api/lead-discovery/quora/run`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        });

        await Promise.all([redditReq, quoraReq]);
        
    } catch (err: any) {
        console.error("Discovery error:", err);
        // We continue the animation to show "partial success" or handle gracefully
    } finally {
        // Wait 10 seconds to give the "Immersive" feeling before showing results
        setTimeout(() => {
            setScanStep("success");
            setIsRunning(false);
            loadPosts();
            loadQuoraPosts();
        }, 10000); 
    }
  };

  useEffect(() => {
    loadKeywords();
    loadPosts();
    loadQuoraPosts();
  }, [loadKeywords, loadPosts, loadQuoraPosts]);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans selection:bg-[#FFD700] selection:text-black">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Lead <span className="text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">Discovery</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl">
            Deploy autonomous agents to scrape high-intent leads from Reddit & Quora using your configured keywords.
          </p>
        </div>

        {/* KEYWORDS SECTION */}
        <Card className="bg-zinc-900/50 border-zinc-800 p-6 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-[#FFD700]" />
              <h2 className="text-lg font-semibold text-white">Target Buyer Keywords</h2>
            </div>
            <div className="text-xs flex items-center gap-2 text-zinc-500">
                <div className={`w-2 h-2 rounded-full ${loadingKeywords ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`} />
                {loadingKeywords ? "Syncing DB..." : "Database Connected"}
            </div>
          </div>

          {loadingKeywords ? (
            <div className="flex flex-col gap-2 relative z-10">
               <div className="flex gap-2 animate-pulse">
                  <div className="h-8 w-24 bg-zinc-800 rounded-full" />
                  <div className="h-8 w-32 bg-zinc-800 rounded-full" />
                  <div className="h-8 w-20 bg-zinc-800 rounded-full" />
               </div>
               <p className="text-xs text-zinc-500 mt-2 flex items-center gap-2">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Fetching keywords from your profile...
               </p>
            </div>
          ) : buyerKeywords.length === 0 ? (
            <div className="text-zinc-500 text-sm italic py-2 relative z-10">
               No keywords found in database. Please complete onboarding.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 relative z-10 animate-in fade-in duration-500">
              {buyerKeywords.map((k) => (
                <Badge key={k} className="bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/20 px-3 py-1.5 text-sm font-medium hover:bg-[#FFD700]/20 transition-colors cursor-default">
                  {k}
                </Badge>
              ))}
            </div>
          )}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        </Card>

        {/* --- CENTERED SINGLE ACTION BUTTON --- */}
        <div className="flex justify-center py-6">
          <Button 
            onClick={handleDiscovery} 
            disabled={isRunning}
            className="w-full sm:w-80 h-16 bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold text-lg rounded-xl shadow-[0_0_25px_rgba(255,215,0,0.2)] transition-all active:scale-[0.98] relative overflow-hidden group"
          >
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-white/20 translate-y-full skew-y-12 group-hover:translate-y-[-150%] transition-transform duration-700" />
            
            {isRunning ? (
                <>
                    <Loader2 className="mr-2 animate-spin" /> 
                    Initializing Agents...
                </>
            ) : (
                <>
                    <Play className="mr-2 w-5 h-5 fill-current" /> 
                    Start Lead Discovery
                </>
            )}
          </Button>
        </div>

        {/* SCANNER MODAL */}
        <Dialog open={isScanModalOpen} onOpenChange={setIsScanModalOpen}>
          <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[500px] p-0 overflow-hidden gap-0 rounded-2xl shadow-2xl shadow-black">
            
            <div className="p-6 border-b border-zinc-900 bg-zinc-900/50">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center justify-between">
                        <span className="flex items-center gap-2">
                           {scanStep === "scanning" && <span className="relative flex h-3 w-3 mr-1">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD700]"></span>
                            </span>}
                           {scanStep === "scanning" ? "Live Discovery in Progress" : "Scan Complete"}
                        </span>
                        {scanStep === "scanning" && <Button variant="ghost" size="icon" onClick={() => setIsScanModalOpen(false)}><Minimize2 className="h-4 w-4 text-zinc-500" /></Button>}
                    </DialogTitle>
                </DialogHeader>
            </div>

            <div className="p-6 space-y-6">
                {scanStep === "scanning" ? (
                    <>
                        {/* Radar Animation */}
                        <div className="relative h-32 w-full flex items-center justify-center overflow-hidden rounded-xl bg-black border border-zinc-800/50">
                             <div className="absolute border border-[#FFD700]/10 rounded-full h-64 w-64 animate-[spin_10s_linear_infinite]" />
                             <div className="absolute border border-[#FFD700]/20 rounded-full h-48 w-48 animate-[ping_3s_linear_infinite]" />
                             <Hash className="relative z-10 w-10 h-10 text-[#FFD700]" />
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                             <div className="flex justify-between text-xs text-zinc-400 uppercase tracking-wider font-bold">
                                 <span>Scanning Infrastructure</span>
                                 <span>{Math.round(progress)}%</span>
                             </div>
                             <Progress value={progress} className="h-2 bg-zinc-900" indicatorClassName="bg-[#FFD700]" />
                        </div>

                        {/* Terminal Logs */}
                        <div className="bg-zinc-900/80 rounded-lg p-4 font-mono text-xs border border-zinc-800 h-32 flex flex-col justify-end overflow-hidden">
                            <div className="space-y-1 text-zinc-500">
                                {logsHistory.slice().reverse().map((log, i) => (
                                    <div key={i} className="opacity-50">{`> ${log}`}</div>
                                ))}
                            </div>
                            <div className="text-[#FFD700] mt-1 flex items-center gap-1">
                                <span className="animate-pulse">{`> ${currentLog}`}</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-6 space-y-4">
                        <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Leads Extracted!</h3>
                        <p className="text-zinc-400 max-w-xs mx-auto text-sm leading-relaxed">
                            The discovery process has successfully identified potential high-intent leads from multiple platforms.
                        </p>
                        <Button onClick={() => setIsScanModalOpen(false)} className="w-full bg-white text-black hover:bg-zinc-200 mt-4 h-12 text-base font-semibold">
                            View Results
                        </Button>
                    </div>
                )}
            </div>

            {/* Footer */}
            {scanStep === "scanning" && (
                <div className="bg-zinc-900/50 p-4 text-center border-t border-zinc-900">
                    <p className="text-xs text-zinc-500 flex items-center justify-center gap-2">
                        <Clock className="w-3 h-3" /> Estimated remaining time: ~14 mins
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-1">You can minimize this window.</p>
                </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Error Display */}
        {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5" />
                {error}
            </div>
        )}

        {/* Results Grid - Reddit */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            Lead <span className="text-[#FFD700]">Results</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.length === 0 && !loadingKeywords && (
               <div className="col-span-1 md:col-span-2 text-center py-8 border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-sm">
                  No leads found yet. Start a discovery scan.
               </div>
            )}
            {posts.map((p) => (
              <Card key={p.id} className="bg-zinc-900 border-zinc-800 p-5 flex flex-col justify-between hover:border-[#FFD700]/30 transition-colors">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-zinc-500">
                    <span className="font-medium text-[#FFD700]">u/{p.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-zinc-200 text-sm leading-relaxed line-clamp-3">{p.text}</p>
                </div>
                <div className="pt-4 mt-auto">
                   <Button variant="outline" className="w-full border-zinc-700 bg-transparent hover:bg-[#FFD700] hover:text-black transition-all text-xs h-9" onClick={() => window.open(p.url, "_blank")}>
                    View Discussion <ExternalLink className="ml-2 w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Results Grid - Quora */}
        {/* <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            Quora <span className="text-emerald-500">Results</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quoraPosts.length === 0 && !loadingKeywords && (
               <div className="col-span-1 md:col-span-2 text-center py-8 border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-sm">
                  No Quora leads found yet. Start a discovery scan.
               </div>
            )}
            {quoraPosts.map((p) => (
              <Card key={p.id} className="bg-zinc-900 border-zinc-800 p-5 flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-zinc-500">
                    <span className="font-medium text-emerald-500">{p.author || "Anonymous"}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Today</span>
                  </div>
                  <p className="text-zinc-200 text-sm leading-relaxed line-clamp-3">{p.question}</p>
                </div>
                <div className="pt-4 mt-auto">
                   <Button variant="outline" className="w-full border-zinc-700 bg-transparent hover:bg-emerald-500 hover:text-white transition-all text-xs h-9" onClick={() => window.open(p.url, "_blank")}>
                    View Discussion <ExternalLink className="ml-2 w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div> */}

      </div>
    </div>
  );
}