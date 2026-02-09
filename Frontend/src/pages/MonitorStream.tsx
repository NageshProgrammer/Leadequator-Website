import { useEffect, useState } from "react";
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
import { Search, Filter, Sparkles, ExternalLink, Clock, User, MessageSquare } from "lucide-react";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
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
  id: number;
  platform: string;
  user: string;
  intent: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  timestamp: string;
  content: string;
  engagement: { likes: number };
  keywords: string[];
  url?: string;
  replyOption1?: string | null;
  replyOption2?: string | null;
  replyStatus: "Not Sent" | "Sent";
};

/* ================= COMPONENT ================= */

const MonitorStream = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Thread | null>(null);
  const { toast } = useToast();

  /* ================= LOAD DATA (Fixed Logic) ================= */

  useEffect(() => {
    const loadQuora = async () => {
      setLoading(true);
      setError(null);

      type BackendPost = Record<string, unknown>;

      // FIX: Changed argument from 'items' (array) to 'item' (single object)
      const mapItems = (item: BackendPost, idx: number): Thread => {
        const rawIntent = item["intent"] as number | undefined;
        // Mock intent calculation if missing, to ensure UI has data
        const intent = Number(rawIntent ?? 50 + (idx % 50));

        return {
          id: Number((item["id"] as number) ?? idx + 1),
          platform: (item["platform"] as string) ?? "Quora",
          user: (item["author"] as string) ?? (item["userId"] as string) ?? "unknown",
          intent,
          sentiment: intent >= 80 ? "Positive" : intent >= 60 ? "Neutral" : "Negative",
          timestamp: (item["timestamp"] as string) ?? new Date().toLocaleDateString(),
          content: (item["content"] as string) ?? (item["question"] as string) ?? (item["title"] as string) ?? "",
          url: (item["url"] as string | undefined),
          replyOption1: (item["replyOption1"] as string) ?? null,
          replyOption2: (item["replyOption2"] as string) ?? null,
          engagement: { likes: Number((item["likes"] as number) ?? 0) },
          keywords: (item["keywords"] as string[]) ?? [],
          replyStatus: (item["replyStatus"] as "Not Sent" | "Sent") ?? "Not Sent",
        };
      };

      const tryFetch = async (url: string): Promise<BackendPost[]> => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return json;
      };

      try {
        let body: any = null;
        try {
          body = await tryFetch("/api/quora/posts");
        } catch {
          body = await tryFetch("http://localhost:8000/quora/posts");
        }

        const itemsRaw = (body as { data?: BackendPost[] })?.data ?? body;
        const items = (itemsRaw ?? []) as BackendPost[];
        
        // Pass single item to mapItems
        const data = items.map((item, idx) => mapItems(item, idx));
        setThreads(data);
      } catch (e: unknown) {
        console.error("Failed to load posts", e);
        const msg = (e as Error)?.message ?? String(e);
        setError(msg);
        toast({ 
            title: "Failed to load posts", 
            description: msg,
            variant: "destructive" 
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuora();
  }, [toast]);

  /* ================= HELPERS (Themed) ================= */

  const getIntentColor = (intent: number) => {
    if (intent >= 85) return "bg-[#FFD700] text-black hover:bg-[#FFD700]/80"; // Gold
    if (intent >= 70) return "bg-emerald-500 text-white hover:bg-emerald-600";
    return "bg-zinc-800 text-zinc-400 hover:bg-zinc-700";
  };

  const getSentimentColor = (sentiment: Thread["sentiment"]) => {
    if (sentiment === "Positive") return "text-emerald-400";
    if (sentiment === "Negative") return "text-red-400";
    return "text-zinc-400";
  };

  const openExternalLink = (platform: string, url?: string) => {
    if (url) {
      window.open(url, "_blank");
      return;
    }
    const links: Record<string, string> = {
      LinkedIn: "https://linkedin.com",
      Reddit: "https://reddit.com",
      "X (Twitter)": "https://x.com",
      Quora: "https://quora.com",
    };
    window.open(links[platform] || `https://google.com/search?q=${platform}`, "_blank");
  };

  const handleSendReply = (id: string) => {
    const nid = Number(id);
    setThreads((prev) =>
      prev.map((t) =>
        t.id === nid ? { ...t, replyStatus: "Sent" } : t
      )
    );
    setSelected((prev) =>
      prev && prev.id === nid ? { ...prev, replyStatus: "Sent" } : prev
    );
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-background text-white p-4 md:p-8 font-sans">
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto">
        
        {/* Filter Panel (Desktop Drawer) */}
        {showFilters && (
          <div className="w-full lg:w-80 flex-shrink-0 mb-4 lg:mb-0">
            <FilterPanel onClose={() => setShowFilters(false)} />
          </div>
        )}

        <div className="flex-1 space-y-6 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Monitor <span className="text-[#FFD700]">Stream</span>
              </h1>
              <p className="text-zinc-400 text-sm">
                Real-time feed of high-value conversations across platforms.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-[#FFD700]"
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? "Hide Filters" : "Filters"}
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="p-4 bg-zinc-900 border-zinc-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  placeholder="Search conversations, keywords, users..."
                  className="pl-10 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus-visible:ring-[#FFD700]"
                />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-40 bg-black border-zinc-700 text-white">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="quora">Quora</SelectItem>
                    <SelectItem value="reddit">Reddit</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="high">
                  <SelectTrigger className="w-full md:w-40 bg-black border-zinc-700 text-white">
                    <SelectValue placeholder="Intent Score" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="high">High Intent</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* ================= MOBILE VIEW (Cards) ================= */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {loading ? (
               <div className="text-center py-10 text-zinc-500">Loading stream...</div>
            ) : threads.length === 0 ? (
               <div className="text-center py-10 text-zinc-500">No active threads found.</div>
            ) : (
               threads.map((t) => (
                 <Card 
                   key={t.id} 
                   onClick={() => setSelected(t)}
                   className="bg-zinc-900 border-zinc-800 p-4 space-y-4 active:scale-[0.99] transition-transform"
                 >
                   <div className="flex justify-between items-start">
                     <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="border-zinc-700 text-zinc-300 bg-black">{t.platform}</Badge>
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                           <Clock className="w-3 h-3" /> {t.timestamp}
                        </span>
                     </div>
                     <Badge className={getIntentColor(t.intent)}>{t.intent}%</Badge>
                   </div>

                   <div className="space-y-2">
                      <div className="text-sm font-semibold text-[#FFD700] flex items-center gap-2">
                         <User className="w-3 h-3" /> {t.user}
                      </div>
                      <p className="text-sm text-zinc-300 line-clamp-3 leading-relaxed">
                         "{t.content}"
                      </p>
                   </div>

                   <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
                      <div className={`text-xs font-medium ${getSentimentColor(t.sentiment)} flex items-center gap-2`}>
                         <MessageSquare className="w-3 h-3" /> {t.sentiment}
                      </div>
                      <div className="flex gap-2">
                         <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white" onClick={(e) => { e.stopPropagation(); openExternalLink(t.platform, t.url) }}>
                            <ExternalLink className="w-4 h-4" />
                         </Button>
                         <Button size="sm" className="h-8 bg-[#FFD700] text-black hover:bg-[#FFD700]/80 font-bold">
                            <Sparkles className="w-3 h-3 mr-1" /> Reply
                         </Button>
                      </div>
                   </div>
                 </Card>
               ))
            )}
          </div>

          {/* ================= DESKTOP VIEW (Table) ================= */}
          <Card className="hidden md:block bg-zinc-900 border-zinc-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-black/50">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Time</TableHead>
                  <TableHead className="text-zinc-400">Platform</TableHead>
                  <TableHead className="text-zinc-400">Author</TableHead>
                  <TableHead className="text-zinc-400 w-[30%]">Comment</TableHead>
                  <TableHead className="text-zinc-400">Intent</TableHead>
                  <TableHead className="text-zinc-400">Sentiment</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-400 text-center">Likes</TableHead>
                  <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-10 text-zinc-500">Loading posts...</TableCell></TableRow>
                ) : error ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-10 text-red-400">{error}</TableCell></TableRow>
                ) : threads.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-10 text-zinc-500">No posts available.</TableCell></TableRow>
                ) : (
                  threads.map((t) => (
                    <TableRow
                      key={t.id}
                      className="cursor-pointer border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                      onClick={() => setSelected(t)}
                    >
                      <TableCell className="text-xs text-zinc-500 whitespace-nowrap">{t.timestamp}</TableCell>
                      <TableCell><Badge variant="outline" className="border-zinc-700 text-zinc-300 bg-black">{t.platform}</Badge></TableCell>
                      <TableCell className="font-medium text-sm text-[#FFD700]">{t.user}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-zinc-300">{t.content}</TableCell>
                      <TableCell><Badge className={getIntentColor(t.intent)}>{t.intent}</Badge></TableCell>
                      <TableCell className={`text-sm ${getSentimentColor(t.sentiment)}`}>{t.sentiment}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={t.replyStatus === "Sent" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "text-zinc-500 border-zinc-700"}
                        >
                          {t.replyStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-zinc-400">{t.engagement?.likes ?? 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={(e) => {
                              e.stopPropagation();
                              openExternalLink(t.platform, t.url);
                            }}>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button size="sm" className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80" onClick={(e) => {
                              e.stopPropagation();
                              setSelected(t);
                            }}>
                            <Sparkles className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* DETAIL MODAL (Responsive) */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />

            <div className="relative w-full md:w-[600px] lg:w-[40%] h-[85vh] md:h-full max-h-[800px] bg-zinc-950 md:rounded-xl rounded-t-2xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
                <div className="h-full overflow-y-auto custom-scrollbar p-1">
                  <DetailPane
                    comment={{
                      id: String(selected.id),
                      platform: selected.platform,
                      user: selected.user,
                      followers: selected.engagement.likes,
                      timestamp: selected.timestamp,
                      content: selected.content,
                      intent: selected.intent,
                      sentiment: selected.sentiment,
                      keywords: selected.keywords,
                      replyStatus: selected.replyStatus,
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