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
  RefreshCw,
  Loader2,
  ExternalLink,
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
  const [showFilters, setShowFilters] = useState(false);

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

      if (!redditRes.ok || !quoraRes.ok) {
        throw new Error("Failed to fetch posts");
      }

      const redditData = await redditRes.json();
      const quoraData = await quoraRes.json();

      const combined = [
        ...(redditData.posts || []),
        ...(quoraData.posts || []),
      ];

      const mapped: Thread[] = combined.map((p: any, idx: number) => {
        const intent = 50 + (idx % 40);

        return {
          id: String(p.id),
          platform: p.platform || "Quora",
          user: p.userId ?? "Unknown",
          intent,
          sentiment:
            intent >= 80 ? "Positive" : intent >= 60 ? "Neutral" : "Negative",
          timestamp: p.createdAt ? new Date(p.createdAt).toLocaleString() : "—",
          post: p.question || p.content || "",
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
      toast({
        title: "Failed to load posts",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user?.id, toast]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Scraper failed");
      }

      toast({
        title: "Scraping Started 🚀",
        description: "Reddit and Quora scraping in progress.",
      });

      // wait a bit then reload
      setTimeout(loadPosts, 6000);
    } catch (err: any) {
      toast({
        title: "Scraper Failed",
        description: err.message || "Check backend / AI service.",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  const getSentimentColor = (sentiment: Thread["sentiment"]) => {
    if (sentiment === "Positive") return "text-green-500";
    if (sentiment === "Negative") return "text-destructive";
    return "text-muted-foreground";
  };

  const handleSendReply = (id: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, replyStatus: "Sent" } : t)),
    );
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Monitor <span className="text-yellow-400">Stream</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time feed of high-value conversations.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={runScraper}
              disabled={running}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
            >
              {running && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Run Scraper
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* SEARCH */}
        <Card className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </div>
        </Card>

        {/* TABLE */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Intent</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                threads.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.timestamp}</TableCell>
                    <TableCell>
                      <Badge>{t.platform}</Badge>
                    </TableCell>
                    <TableCell>{t.user}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {t.post}
                    </TableCell>
                    <TableCell>{t.intent}</TableCell>
                    <TableCell className={getSentimentColor(t.sentiment)}>
                      {t.sentiment}
                    </TableCell>
                    <TableCell>{t.replyStatus}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => setSelected(t)}>
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* DETAIL OVERLAY */}
        {/* DETAIL MODAL */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-[50vw] h-[100vh] flex items-center justify-center">
              <div className="w-full h-full overflow-y-auto bg-background rounded-lg shadow-xl">
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
