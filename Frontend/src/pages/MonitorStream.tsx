import { useEffect, useState, useCallback } from "react";
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
  Filter,
  Sparkles,
  Loader2,
  Clock,
  User,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  RefreshCw
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
  url?: string;
};

// FIX: Ensure this matches the port in server.ts
const API_BASE = "http://localhost:5000/api/lead-discovery";

const MonitorStream = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Thread | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  /* ================= FETCH POSTS ================= */
  const loadPosts = useCallback(async () => {
    // Wait for user to be loaded
    if (!isLoaded || !user) return;

    try {
      setLoading(true);
      setError(null);

      const userId = user.id;

      // Parallel fetch from both endpoints
      const [redditRes, quoraRes] = await Promise.all([
          fetch(`${API_BASE}/reddit/posts?userId=${encodeURIComponent(userId)}`),
          fetch(`${API_BASE}/quora/posts?userId=${encodeURIComponent(userId)}`)
      ]);

      // Handle cases where server might return HTML error or fail
      if (!redditRes.ok || !quoraRes.ok) {
         console.warn("Backend fetch failed. Check if server is running on Port 5000.");
         throw new Error("Could not connect to backend.");
      }

      const redditData = await redditRes.json();
      const quoraData = await quoraRes.json();

      // Combine and map data
      const combined = [
        ...(redditData.posts || []),
        ...(quoraData.posts || []),
      ];

      // Sort by date (newest first)
      combined.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const mapped = combined.map((p: any) => ({
        id: String(p.id),
        platform: p.platform || (p.subreddit ? "Reddit" : "Quora"),
        user: p.author ?? "Unknown",
        intent: 75, // Default intent score if backend doesn't calculate it yet
        sentiment: "Neutral", // Default sentiment
        timestamp: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Just now",
        post: p.text || p.title || p.question || "",
        engagement: { likes: Number(p.likes ?? 0) },
        keywords: [],
        replyStatus: "Not Sent",
        url: p.url
      }));

      setThreads(mapped);
    } catch (err: any) {
      console.error("Load Error:", err);
      setError("Failed to connect to backend. Is the server running on port 5000?");
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user]);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  /* ================= RUN SCRAPER ================= */
  const runScraper = async () => {
    if (!user?.id) return;

    try {
      setRunning(true);
      // Trigger both
      await Promise.all([
        fetch(`${API_BASE}/quora/run`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id }),
        }),
        fetch(`${API_BASE}/reddit/run`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, forceLogin: true }),
        })
      ]);

      toast({
        title: "Scraping Started 🚀",
        description: "Agents are scanning Reddit & Quora for you.",
      });

      // Reload posts after a delay
      setTimeout(loadPosts, 5000);
    } catch (err) {
      toast({
        title: "Scraper Error",
        description: "Could not start scraper agents.",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  const getPlatformColor = (platform: string) => {
      if (platform.toLowerCase() === 'reddit') return "bg-[#FF4500]/10 text-[#FF4500] border-[#FF4500]/20";
      return "bg-red-500/10 text-red-500 border-red-500/20"; // Quora Red
  };

  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white font-sans selection:bg-[#FFD700] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Monitor <span className="text-[#FFD700]">Stream</span>
            </h1>
            <p className="text-zinc-400 text-sm">
              Real-time feed of high-value conversations across platforms.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Button
              onClick={runScraper}
              disabled={running}
              className="flex-1 md:flex-none bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold h-12 rounded-xl"
            >
              {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              {running ? "Scanning..." : "Run Scraper"}
            </Button>

            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="border-zinc-800 text-white bg-zinc-900 h-12 rounded-xl hover:bg-zinc-800">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* MOBILE FILTER PANEL (Conditional) */}
        {showFilters && (
            <Card className="bg-zinc-900 border-zinc-800 p-4 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <Input placeholder="Search keywords..." className="pl-10 bg-black border-zinc-800 text-white" />
                    </div>
                    <Select>
                        <SelectTrigger className="bg-black border-zinc-800 text-white"><SelectValue placeholder="All Platforms" /></SelectTrigger>
                        <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="reddit">Reddit</SelectItem><SelectItem value="quora">Quora</SelectItem></SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="bg-black border-zinc-800 text-white"><SelectValue placeholder="All Intent" /></SelectTrigger>
                        <SelectContent><SelectItem value="high">High Intent</SelectItem></SelectContent>
                    </Select>
                </div>
            </Card>
        )}

        {/* LOADING & ERROR STATES */}
        {loading && (
            <div className="text-center py-20 text-zinc-500 flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#FFD700]" />
                Loading your stream...
            </div>
        )}

        {error && !loading && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5" /> {error}
            </div>
        )}

        {!loading && !error && threads.length === 0 && (
            <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                No active conversations found. Try running the scraper.
            </div>
        )}

        {/* ================= MOBILE VIEW (CARDS) ================= */}
        <div className="md:hidden space-y-4">
            {threads.map((t) => (
                <Card 
                    key={t.id} 
                    onClick={() => setSelected(t)}
                    className="bg-zinc-900/50 border-zinc-800 p-4 active:scale-[0.98] transition-transform"
                >
                    <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className={`${getPlatformColor(t.platform)} bg-transparent`}>
                            {t.platform}
                        </Badge>
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {t.timestamp}
                        </span>
                    </div>
                    
                    <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                            <User className="w-3 h-3 text-[#FFD700]" />
                            <span className="text-sm font-semibold text-zinc-200">{t.user}</span>
                        </div>
                        <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                            {t.post}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
                        <div className="flex gap-2">
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none">{t.intent}% Intent</Badge>
                        </div>
                        <Button size="sm" className="h-8 bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
                            Reply <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>

        {/* ================= DESKTOP VIEW (TABLE) ================= */}
        <div className="hidden md:block">
            <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-900">
                        <TableRow className="border-zinc-800 hover:bg-transparent">
                            <TableHead className="text-zinc-400">Date</TableHead>
                            <TableHead className="text-zinc-400">Platform</TableHead>
                            <TableHead className="text-zinc-400">User</TableHead>
                            <TableHead className="text-zinc-400 w-[40%]">Post Preview</TableHead>
                            <TableHead className="text-zinc-400">Intent</TableHead>
                            <TableHead className="text-right text-zinc-400">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {threads.map((t) => (
                            <TableRow 
                                key={t.id} 
                                className="border-zinc-800 hover:bg-zinc-800/50 cursor-pointer group"
                                onClick={() => setSelected(t)}
                            >
                                <TableCell className="text-zinc-500 text-xs whitespace-nowrap">{t.timestamp}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`${getPlatformColor(t.platform)} bg-transparent`}>
                                        {t.platform}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-zinc-300 font-medium">{t.user}</TableCell>
                                <TableCell className="text-zinc-400 max-w-md truncate group-hover:text-zinc-200 transition-colors">
                                    {t.post}
                                </TableCell>
                                <TableCell>
                                    <Badge className={t.intent > 80 ? "bg-[#FFD700] text-black" : "bg-zinc-700 text-white"}>
                                        {t.intent}%
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="ghost" className="text-[#FFD700] hover:bg-[#FFD700]/10 hover:text-[#FFD700]">
                                        <Sparkles className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>

        {/* DETAIL PANE (Mobile Bottom Sheet / Desktop Modal) */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <div className="relative w-full md:w-[600px] h-[85vh] md:h-[90vh] bg-zinc-950 md:rounded-2xl rounded-t-2xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
                <DetailPane
                    comment={{
                        id: selected.id,
                        platform: selected.platform,
                        user: selected.user,
                        followers: selected.engagement.likes,
                        timestamp: selected.timestamp,
                        content: selected.post,
                        intent: selected.intent,
                        sentiment: selected.sentiment,
                        keywords: selected.keywords,
                        replyStatus: selected.replyStatus,
                        url: selected.url
                    }}
                    onClose={() => setSelected(null)}
                />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitorStream;