import { useEffect, useState, useCallback, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter as FilterIcon,
  Sparkles,
  Loader2,
  ExternalLink,
  Bot,
  X,
  Target,
  MessageSquare
} from "lucide-react";
import { DetailPane } from "@/components/dashboard/DetailPane";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/[components]/loader";

/* ================= TYPES ================= */
type Thread = {
  id: string;
  platform: string;
  user: string;
  intent: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  timestamp: string;
  post: string;
  engagement: { likes: number };
  keywords: string[];
  replyStatus: "Not Sent" | "Sent";
  url: string;
  replyOption1?: string | null;
  replyOption2?: string | null;
};

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/lead-discovery`;

/* ================= COMPONENT ================= */

const MonitorStream = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Thread | null>(null);
  
  // FILTER STATES
  const [showFilters, setShowFilters] = useState(false); 
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [minIntent, setMinIntent] = useState("0");

  /* ================= FETCH POSTS ================= */
  const loadPosts = useCallback(async () => {
    if (!isLoaded || !user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const [redditRes, quoraRes] = await Promise.all([
        fetch(`${API_BASE}/reddit/posts?userId=${encodeURIComponent(user.id)}`),
        fetch(`${API_BASE}/quora/posts?userId=${encodeURIComponent(user.id)}`),
      ]);

      if (!redditRes.ok || !quoraRes.ok) throw new Error("Failed to fetch posts");

      const redditData = await redditRes.json();
      const quoraData = await quoraRes.json();

      const combined = [...(redditData.posts || []), ...(quoraData.posts || [])];

      const mapped: Thread[] = combined.map((p: any, idx: number) => {
        const intent = 50 + (idx % 40);
        
        // ✅ FIX 1: Safely determine the platform and FORCE capitalization so filters match exactly
        const rawPlatform = p.platform || (p.question ? "Quora" : "Reddit");
        const formattedPlatform = rawPlatform.charAt(0).toUpperCase() + rawPlatform.slice(1).toLowerCase();

        return {
          id: String(p.id),
          platform: formattedPlatform,
          user: p.userId ?? "Unknown",
          intent,
          sentiment: intent >= 80 ? "Positive" : intent >= 60 ? "Neutral" : "Negative",
          timestamp: p.createdAt ? new Date(p.createdAt).toLocaleString() : "—",
          post: p.text || p.question || p.content || "",
          engagement: { likes: 0 },
          keywords: Array.isArray(p.keywords) ? p.keywords : [],
          replyStatus: p.replyStatus || "Not Sent",
          url: p.url,
          replyOption1: p.replyOption1 || p.replies?.[0] || null,
          replyOption2: p.replyOption2 || p.replies?.[1] || null,
        };
      });

      setThreads(mapped);
    } catch (err: any) {
      setError(err.message);
      toast({ title: "Failed to load posts", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user?.id, toast]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  /* ================= RUN SCRAPER ================= */
  const runScraper = async () => {
    if (!user?.id) return;
    try {
      setRunning(true);
      const response = await fetch(`${API_BASE}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) throw new Error(await response.text() || "Scraper failed");

      toast({ title: "Scraping Started 🚀", description: "Reddit and Quora scraping in progress." });
      setTimeout(loadPosts, 6000);
    } catch (err: any) {
      toast({ title: "Scraper Failed", description: err.message || "Check backend / AI service.", variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  /* ================= EXTENDED FILTER LOGIC ================= */
  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        t.user.toLowerCase().includes(searchLower) ||
        t.post.toLowerCase().includes(searchLower);

      // ✅ FIX 2: Case-insensitive check just to be totally bulletproof
      const matchesPlatform = platformFilter === "All" || t.platform.toLowerCase() === platformFilter.toLowerCase();
      
      const matchesSentiment = sentimentFilter === "All" || t.sentiment === sentimentFilter;
      const matchesStatus = statusFilter === "All" || t.replyStatus === statusFilter;
      const matchesIntent = t.intent >= parseInt(minIntent);

      return matchesSearch && matchesPlatform && matchesSentiment && matchesStatus && matchesIntent;
    });
  }, [threads, searchQuery, platformFilter, sentimentFilter, statusFilter, minIntent]);

  const clearFilters = () => {
    setSearchQuery("");
    setPlatformFilter("All");
    setSentimentFilter("All");
    setStatusFilter("All");
    setMinIntent("0");
  };

  /* ================= HELPERS & STYLES ================= */
  const getSentimentBadge = (sentiment: Thread["sentiment"]) => {
    switch (sentiment) {
      case "Positive": return <Badge className="bg-green-500/10 text-green-400 border-green-500/20 shadow-none font-semibold">Positive</Badge>;
      case "Negative": return <Badge className="bg-red-500/10 text-red-400 border-red-500/20 shadow-none font-semibold">Negative</Badge>;
      default: return <Badge className="bg-zinc-500/10 text-zinc-300 border-zinc-500/20 shadow-none font-semibold">Neutral</Badge>;
    }
  };

  const handleSendReply = (id: string) => {
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, replyStatus: "Sent" } : t)));
  };

  const glassPanelStyle = "bg-[#050505]/60 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem]";
  const filterLabelStyle = "text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-3 block";

  return (
    <div className="min-h-[90vh] pt-4 pb-12 bg-black/10 text-white selection:bg-[#fbbf24]/30 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-[#fbbf24]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-[1400px] space-y-6 md:space-y-8 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1">
              Monitor <span className="text-[#fbbf24] drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">Stream</span>
            </h1>
            <p className="text-zinc-400 font-medium text-sm md:text-base">
              Real-time feed of high-value conversations.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 md:flex-none border-white/[0.1] text-white hover:text-[#fbbf24] h-11 rounded-xl transition-all ${showFilters ? 'bg-white/[0.1] border-[#fbbf24]/50' : 'bg-white/[0.03] hover:bg-white/[0.08]'}`}
            >
              <FilterIcon className="mr-2 h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            
            <Button
              onClick={runScraper}
              disabled={running}
              className="flex-1 md:flex-none bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-bold rounded-xl h-11 shadow-[0_0_15px_rgba(251,191,36,0.15)] transition-all"
            >
              {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              {running ? "Scanning..." : "Run Scraper"}
            </Button>
          </div>
        </div>

        {/* MAIN LAYOUT: SIDEBAR + RESULTS */}
        <div className="flex flex-col lg:flex-row-reverse gap-6 lg:gap-8 items-start">
          
          {/* ================= FILTER SIDEBAR (RIGHT) ================= */}
          {showFilters && (
            <div className={`w-full lg:w-[320px] flex-shrink-0 ${glassPanelStyle} p-6 animate-in slide-in-from-right-8 duration-500 lg:sticky lg:top-24`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FilterIcon className="h-4 w-4 text-[#fbbf24]" /> Analytics Filters
                </h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden text-zinc-400 hover:text-white" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-8">
                {/* Search */}
                <div>
                  <label className={filterLabelStyle}>Search Keyword</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input 
                      placeholder="Username, brand, text..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/[0.02] border-white/[0.08] text-white focus-visible:ring-[#fbbf24]/30 rounded-xl h-11 transition-all" 
                    />
                  </div>
                </div>

                {/* Intent Slider/Select */}
                <div>
                  <label className={filterLabelStyle}>Minimum Intent Score</label>
                  <Select value={minIntent} onValueChange={setMinIntent}>
                    <SelectTrigger className="w-full bg-white/[0.02] border-white/[0.08] text-white rounded-xl h-11">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-[#fbbf24]" />
                        <SelectValue placeholder="Select intent..." />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/[0.1] text-white rounded-xl">
                      <SelectItem value="0" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Any Intent (0%+)</SelectItem>
                      <SelectItem value="50" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Warm Leads (50%+)</SelectItem>
                      <SelectItem value="70" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Hot Leads (70%+)</SelectItem>
                      <SelectItem value="90" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Urgent Buyers (90%+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Dropdown */}
                <div>
                  <label className={filterLabelStyle}>Engagement Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full bg-white/[0.02] border-white/[0.08] text-white rounded-xl h-11">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-[#fbbf24]" />
                        <SelectValue placeholder="Select status..." />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/[0.1] text-white rounded-xl">
                      <SelectItem value="All" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">All Statuses</SelectItem>
                      <SelectItem value="Not Sent" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">New / Unengaged</SelectItem>
                      <SelectItem value="Sent" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Reply Sent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Platform Pills */}
                <div>
                  <label className={filterLabelStyle}>Platform</label>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Reddit", "Quora"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPlatformFilter(p)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${platformFilter === p ? 'bg-[#fbbf24] text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'bg-white/[0.03] text-zinc-400 border border-white/[0.08] hover:bg-white/[0.1] hover:text-white'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sentiment Pills */}
                <div>
                  <label className={filterLabelStyle}>Sentiment</label>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Positive", "Neutral", "Negative"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSentimentFilter(s)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${sentimentFilter === s ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-white/[0.03] text-zinc-400 border border-white/[0.08] hover:bg-white/[0.1] hover:text-white'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Button */}
                <div className="pt-4 border-t border-white/[0.08]">
                  <Button 
                    variant="ghost" 
                    className="w-full text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl h-11"
                    onClick={clearFilters}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ================= MAIN RESULTS AREA ================= */}
          <div className="flex-1 min-w-0 w-full animate-in fade-in duration-700">
            
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-zinc-400 font-medium">
                Found <strong className="text-white">{filteredThreads.length}</strong> conversations
              </span>
            </div>

            {loading ? (
              <div className={`flex flex-col items-center justify-center h-[400px] ${glassPanelStyle}`}>
                <Loader />
                <p className="text-[#fbbf24] font-medium tracking-widest uppercase text-xs mt-4 animate-pulse">
                  Synchronizing streams...
                </p>
              </div>
            ) : (
              <>
                {/* --- DESKTOP VIEW: TABLE --- */}
                <div className={`hidden md:block overflow-hidden ${glassPanelStyle} !p-0`}>
                  <Table>
                    <TableHeader className="bg-white/[0.02] border-b border-white/[0.05]">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="text-zinc-400 font-bold py-5 pl-6 whitespace-nowrap">Platform</TableHead>
                        <TableHead className="text-zinc-400 font-bold py-5">Target</TableHead>
                        <TableHead className="text-zinc-400 font-bold py-5 w-[35%]">Post Content</TableHead>
                        <TableHead className="text-zinc-400 font-bold py-5">Intent</TableHead>
                        <TableHead className="text-zinc-400 font-bold py-5">Status</TableHead>
                        <TableHead className="text-right text-zinc-400 font-bold py-5 pr-6">Action</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredThreads.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-20">
                            <div className="flex flex-col items-center justify-center">
                              <Search className="h-10 w-10 text-zinc-600 mb-4" />
                              <p className="text-zinc-400 text-lg font-medium">No results found.</p>
                              <p className="text-zinc-500 text-sm mt-1">Try adjusting your filters or search term.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredThreads.map((t) => (
                          <TableRow 
                            key={t.id}
                            className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors cursor-pointer group"
                            onClick={() => setSelected(t)}
                          >
                            <TableCell className="pl-6">
                              <Badge variant="outline" className="bg-white/[0.03] text-zinc-300 border-white/[0.1] font-semibold capitalize tracking-wide shadow-sm mb-1.5">
                                {t.platform}
                              </Badge>
                              <div className="flex flex-col">
                                <span className="text-zinc-400 text-xs font-medium">{t.timestamp.split(',')[0]}</span>
                                <span className="text-zinc-500 text-[10px] tracking-wide">{t.timestamp.split(',')[1]}</span>
                              </div>
                            </TableCell>
                            
                            <TableCell className="font-medium text-zinc-200 truncate max-w-[120px]">
                              {t.user}
                            </TableCell>
                            
                            <TableCell>
                              <p className="text-sm text-zinc-400 max-w-md truncate italic group-hover:text-zinc-300 transition-colors">
                                "{t.post}"
                              </p>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex flex-col gap-1.5 items-start">
                                <span className={`font-black text-lg ${t.intent >= 70 ? 'text-green-400' : 'text-[#fbbf24]'}`}>
                                  {t.intent}%
                                </span>
                                {getSentimentBadge(t.sentiment)}
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <span className={`text-xs font-bold uppercase tracking-wider ${t.replyStatus === 'Sent' ? 'text-blue-400' : 'text-zinc-500'}`}>
                                {t.replyStatus}
                              </span>
                            </TableCell>
                            
                            <TableCell className="text-right pr-6">
                              <Button 
                                size="sm" 
                                className="bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20 hover:bg-[#fbbf24] hover:text-black font-bold rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  setSelected(t);
                                }}
                              >
                                <Sparkles className="h-3.5 w-3.5 mr-1.5" /> AI Engage
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* --- MOBILE VIEW: CARDS --- */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {filteredThreads.length === 0 ? (
                    <div className={`p-10 text-center flex flex-col items-center justify-center ${glassPanelStyle}`}>
                      <Search className="h-8 w-8 text-zinc-600 mb-3" />
                      <p className="text-zinc-400 font-medium">No results found.</p>
                    </div>
                  ) : (
                    filteredThreads.map((t) => (
                      <div 
                        key={t.id} 
                        className="p-5 flex flex-col gap-4 bg-[#050505]/60 backdrop-blur-xl border border-white/[0.08] shadow-lg rounded-[1.5rem] relative overflow-hidden"
                        onClick={() => setSelected(t)}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${t.intent >= 70 ? 'bg-green-500' : 'bg-[#fbbf24]'}`} />
                        
                        <div className="flex justify-between items-start pl-2">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-white/[0.03] text-zinc-300 border-white/[0.1] text-[10px] px-1.5 py-0">
                                {t.platform}
                              </Badge>
                              <span className="text-[10px] text-zinc-400 font-medium">
                                {t.timestamp.split(',')[0]} <span className="text-zinc-600">{t.timestamp.split(',')[1]}</span>
                              </span>
                            </div>
                            <span className="font-bold text-white text-base truncate max-w-[160px]">{t.user}</span>
                          </div>
                          
                          <div className="flex flex-col items-end gap-1.5">
                            <span className={`font-black text-lg leading-none ${t.intent >= 70 ? 'text-green-400' : 'text-[#fbbf24]'}`}>
                              {t.intent}%
                            </span>
                            {getSentimentBadge(t.sentiment)}
                          </div>
                        </div>

                        <div className="pl-2">
                          <p className="text-sm text-zinc-400 italic line-clamp-3 leading-relaxed">
                            "{t.post}"
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-3 mt-1 border-t border-white/[0.05] pl-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${t.replyStatus === 'Sent' ? 'text-blue-400' : 'text-zinc-500'}`}>
                            Status: {t.replyStatus}
                          </span>
                          <Button 
                            size="sm" 
                            className="bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20 hover:bg-[#fbbf24] hover:text-black font-bold rounded-lg transition-all h-8 text-xs"
                            onClick={(e) => {
                              e.stopPropagation(); 
                              setSelected(t);
                            }}
                          >
                            <Sparkles className="h-3 w-3 mr-1.5" /> Engage
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* DETAIL OVERLAY (MODAL) */}
        {selected && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setSelected(null)} 
          >
            <div 
              className="w-full max-w-4xl max-h-[90vh] bg-[#09090b]/95 backdrop-blur-3xl rounded-[2rem] border border-white/[0.1] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()} 
            >
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <DetailPane
                  comment={{
                    ...selected,
                    followers: selected.engagement.likes,
                    replyOption1: selected.replyOption1,
                    replyOption2: selected.replyOption2,
                  }}
                  onClose={() => setSelected(null)}
                  onSend={handleSendReply}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitorStream;