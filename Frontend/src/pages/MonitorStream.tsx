// import { useEffect, useState, useCallback } from "react";
// import { useUser } from "@clerk/clerk-react";
// import { useToast } from "@/hooks/use-toast";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Search,
//   Filter,
//   Sparkles,
//   RefreshCw,
//   Loader2,
//   ExternalLink,
// } from "lucide-react";
// import { DetailPane } from "@/components/dashboard/DetailPane";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// /* ================= TYPES ================= */
// type Thread = {
//   id: string;
//   platform: string;
//   user: string;
//   intent: number;
//   sentiment: "Positive" | "Neutral" | "Negative";
//   timestamp: string;
//   post: string;
//   engagement: { likes: number };
//   keywords: string[];
//   replyStatus: "Not Sent" | "Sent";
//   url: string;
//   replyOption1?: string | null;
//   replyOption2?: string | null;
// };

// const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/lead-discovery`;

// /* ================= COMPONENT ================= */

// const MonitorStream = () => {
//   const { user, isLoaded } = useUser();
//   const { toast } = useToast();

//   const [threads, setThreads] = useState<Thread[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [running, setRunning] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selected, setSelected] = useState<Thread | null>(null);
//   const [showFilters, setShowFilters] = useState(false);

//   /* ================= FETCH POSTS ================= */

//   const loadPosts = useCallback(async () => {
//     if (!isLoaded || !user?.id) return;

//     try {
//       setLoading(true);
//       setError(null);

//       const [redditRes, quoraRes] = await Promise.all([
//         fetch(`${API_BASE}/reddit/posts?userId=${encodeURIComponent(user.id)}`),
//         fetch(`${API_BASE}/quora/posts?userId=${encodeURIComponent(user.id)}`),
//       ]);

//       if (!redditRes.ok || !quoraRes.ok) {
//         throw new Error("Failed to fetch posts");
//       }

//       const redditData = await redditRes.json();
//       const quoraData = await quoraRes.json();

//       const combined = [
//         ...(redditData.posts || []),
//         ...(quoraData.posts || []),
//       ];

//       const mapped: Thread[] = combined.map((p: any, idx: number) => {
//         const intent = 50 + (idx % 40);

//         return {
//           id: String(p.id),
//           platform: p.platform || "Quora",
//           user: p.author ?? "Unknown",
//           intent,
//           sentiment:
//             intent >= 80 ? "Positive" : intent >= 60 ? "Neutral" : "Negative",
//           timestamp: p.createdAt ? new Date(p.createdAt).toLocaleString() : "—",
//           post: p.question || p.content || "",
//           engagement: { likes: 0 },
//           keywords: Array.isArray(p.keywords) ? p.keywords : [],
//           replyStatus: p.replyStatus || "Not Sent",
//           url: p.url,
//           replyOption1: p.replyOption1 || null,
//           replyOption2: p.replyOption2 || null,
//         };
//       });

//       setThreads(mapped);
//     } catch (err: any) {
//       setError(err.message);
//       toast({
//         title: "Failed to load posts",
//         description: err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [isLoaded, user?.id, toast]);

//   useEffect(() => {
//     loadPosts();
//   }, [loadPosts]);

//   /* ================= RUN SCRAPER ================= */

//   const runScraper = async () => {
//     if (!user?.id) return;

//     try {
//       setRunning(true);

//       const response = await fetch(`${API_BASE}/quora/run`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: user.id }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText || "Scraper failed");
//       }

//       toast({
//         title: "Scraping Started 🚀",
//         description: "Scraping using your onboarded keywords.",
//       });

//       setTimeout(loadPosts, 6000);
//     } catch {
//       toast({
//         title: "Scraper Failed",
//         description: "Check backend / AI service connection.",
//         variant: "destructive",
//       });
//     } finally {
//       setRunning(false);
//     }
//   };

//   const getSentimentColor = (sentiment: Thread["sentiment"]) => {
//     if (sentiment === "Positive") return "text-green-500";
//     if (sentiment === "Negative") return "text-destructive";
//     return "text-muted-foreground";
//   };

//   const handleSendReply = (id: string) => {
//     setThreads((prev) =>
//       prev.map((t) => (t.id === id ? { ...t, replyStatus: "Sent" } : t)),
//     );
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-4 md:p-8 bg-background min-h-screen">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* HEADER */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold">
//               Monitor <span className="text-yellow-400">Stream</span>
//             </h1>
//             <p className="text-sm text-muted-foreground">
//               Real-time feed of high-value conversations.
//             </p>
//           </div>

//           <div className="flex gap-3">
//             <Button
//               onClick={runScraper}
//               disabled={running}
//               className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
//             >
//               {running && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Run Scraper
//             </Button>

//             <Button
//               variant="outline"
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               <Filter className="mr-2 h-4 w-4" />
//               Filters
//             </Button>
//           </div>
//         </div>

//         {/* SEARCH */}
//         <Card className="p-4">
//           <div className="flex gap-3">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
//               <Input placeholder="Search conversations..." className="pl-10" />
//             </div>
//           </div>
//         </Card>

//         {/* TABLE */}
//         <Card>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Time</TableHead>
//                 <TableHead>Platform</TableHead>
//                 <TableHead>Author</TableHead>
//                 <TableHead>Post</TableHead>
//                 <TableHead>Intent</TableHead>
//                 <TableHead>Sentiment</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={8} className="text-center py-10">
//                     Loading...
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 threads.map((t) => (
//                   <TableRow key={t.id}>
//                     <TableCell>{t.timestamp}</TableCell>
//                     <TableCell>
//                       <Badge>{t.platform}</Badge>
//                     </TableCell>
//                     <TableCell>{t.user}</TableCell>
//                     <TableCell className="max-w-xs truncate">
//                       {t.post}
//                     </TableCell>
//                     <TableCell>{t.intent}</TableCell>
//                     <TableCell className={getSentimentColor(t.sentiment)}>
//                       {t.sentiment}
//                     </TableCell>
//                     <TableCell>{t.replyStatus}</TableCell>
//                     <TableCell>
//                       <Button size="sm" onClick={() => setSelected(t)}>
//                         <Sparkles className="h-4 w-4" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </Card>

//         {/* DETAIL OVERLAY */}
//         {/* DETAIL MODAL */}
//         {selected && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//             <div className="w-[50vw] h-[100vh] flex items-center justify-center">
//               <div className="w-full h-full overflow-y-auto bg-background rounded-lg shadow-xl">
//                 <DetailPane
//                   comment={{
//                     ...selected,
//                     followers: selected.engagement.likes,
//                     replyOption1: selected.replyOption1,
//                     replyOption2: selected.replyOption2,
//                   }}
//                   onClose={() => setSelected(null)}
//                   onSend={handleSendReply}
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MonitorStream;

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
  RefreshCw,
  AlertCircle
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
  replyOption1?: string;
  replyOption2?: string;
};

// TARGETING PORT 5000 AS PER YOUR SERVER.TS
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
    if (!isLoaded || !user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const userId = user.id;

      // Fetch from both endpoints safely
      const [redditRes, quoraRes] = await Promise.allSettled([
          fetch(`${API_BASE}/reddit/posts?userId=${encodeURIComponent(userId)}`),
          fetch(`${API_BASE}/quora/posts?userId=${encodeURIComponent(userId)}`)
      ]);

      let combined: any[] = [];

      // Handle Reddit Result
      if (redditRes.status === "fulfilled" && redditRes.value.ok) {
          const data = await redditRes.value.json();
          if (data.posts) combined = [...combined, ...data.posts];
      }

      // Handle Quora Result
      if (quoraRes.status === "fulfilled" && quoraRes.value.ok) {
          const data = await quoraRes.value.json();
          if (data.posts) combined = [...combined, ...data.posts];
      }

      // If both failed completely
      if (redditRes.status === "rejected" && quoraRes.status === "rejected") {
          throw new Error("Could not connect to backend.");
      }

      // Sort by date (newest first)
      combined.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const mapped = combined.map((p: any) => ({
        id: String(p.id),
        platform: p.platform || (p.subreddit ? "Reddit" : "Quora"),
        user: p.author ?? "Unknown",
        intent: Number(p.intent ?? 50),
        sentiment: "Neutral", // Logic to determine sentiment if missing
        timestamp: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Just now",
        post: p.text || p.title || p.question || "",
        engagement: { likes: Number(p.likes ?? 0) },
        keywords: [],
        replyStatus: p.replyOption1 ? "Sent" : "Not Sent", // Basic check
        url: p.url,
        replyOption1: p.replyOption1,
        replyOption2: p.replyOption2
      }));

      setThreads(mapped);
    } catch (err: any) {
      console.error("Load Error:", err);
      setError("Unable to connect to server on Port 5000. Please ensure Backend is running.");
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  /* ================= RUN SCRAPER ================= */
  const runScraper = async () => {
    if (!user?.id) return;

    try {
      setRunning(true);
      
      // We run both, but don't block UI if one fails
      await Promise.allSettled([
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
        title: "Scraping Initiated 🚀",
        description: "Agents are scanning for new leads. Results will appear shortly.",
      });

      // Reload posts after 6 seconds to give backend time
      setTimeout(loadPosts, 6000);
    } catch (err) {
      toast({
        title: "Connection Error",
        description: "Could not reach the scraping service.",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  const getPlatformColor = (platform: string) => {
      if (platform.toLowerCase() === 'reddit') return "bg-[#FF4500]/10 text-[#FF4500] border-[#FF4500]/20";
      return "bg-red-500/10 text-red-500 border-red-500/20"; 
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
              Real-time feed of high-value conversations.
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
                        post: selected.post,
                        intent: selected.intent,
                        sentiment: selected.sentiment,
                        keywords: selected.keywords,
                        replyStatus: selected.replyStatus,
                        url: selected.url,
                        replyOption1: selected.replyOption1 || null,
                        replyOption2: selected.replyOption2 || null
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