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
  AlertCircle,
  Loader2,
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
};

const API_BASE = "http://localhost:5000/api/lead-discovery";

const MonitorStream = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Thread | null>(null);

  /* ================= FETCH POSTS ================= */
  const loadPosts = useCallback(async () => {
    if (!isLoaded || !user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const userId = user.id;

      console.log("Fetching posts for user:", userId);

      const [redditRes, quoraRes] = await Promise.all([
          fetch(`${API_BASE}/reddit/posts?userId=${encodeURIComponent(userId)}`),
          fetch(`${API_BASE}/quora/posts?userId=${encodeURIComponent(userId)}`)
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

      const mapped = combined.map((p: any) => ({
        id: String(p.id),
        platform: p.platform || (p.subreddit ? "Reddit" : "Quora"),
        user: p.author ?? "Unknown",
        intent: Number(p.intent ?? 50),
        sentiment:
          Number(p.intent ?? 50) >= 80
            ? "Positive"
            : Number(p.intent ?? 50) >= 60
              ? "Neutral"
              : "Negative",
        timestamp: p.createdAt ? new Date(p.createdAt).toLocaleString() : "",
        post: p.title || p.question || p.description || "",
        engagement: { likes: Number(p.likes ?? 0) },
        keywords: Array.isArray(p.keywords) ? p.keywords : [],
        replyStatus: p.replyStatus || "Not Sent",
      }));

      setThreads(mapped);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user?.id]);

  /* ================= INITIAL LOAD ================= */
  // This hook ensures that as soon as the user is loaded, the table is populated
  useEffect(() => {
    if (isLoaded && user?.id) {
      loadPosts();
    }
  }, [isLoaded, user?.id, loadPosts]);
  /* ================= RUN SCRAPER ================= */
  /* ================= RUN SCRAPER (DIRECT HOSTINGER AI SERVICE) ================= */

  /* ================= RUN SCRAPER (CORRECT FLOW) ================= */

  const runScraper = async () => {
    if (!user?.id) return;

    try {
      setRunning(true);

      const response = await fetch(`${API_BASE}/quora/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Scraper failed");
      }

      const data = await response.json();
      console.log("Express → AI response:", data);

      toast({
        title: "Scraping Started 🚀",
        description: "Scraping using your onboarded keywords.",
      });

      setTimeout(() => {
        loadPosts();
      }, 6000);
    } catch (err) {
      console.error("Scraper error:", err);

      toast({
        title: "Scraper Failed",
        description: "Check backend / AI service connection.",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

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
              Real-time feed of high-value conversations across platforms.
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

            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* SEARCH + FILTER UI */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations, keywords, users..."
                className="pl-10"
              />
            </div>

            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="reddit">Reddit</SelectItem>
                <SelectItem value="quora">Quora</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Intent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Intent</SelectItem>
                <SelectItem value="high">High Intent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* TABLE */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Intent</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">
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
                    <TableCell>{t.sentiment}</TableCell>
                    <TableCell>{t.replyStatus}</TableCell>
                    <TableCell>{t.engagement.likes}</TableCell>

                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        className="bg-yellow-400 hover:bg-yellow-500 text-black"
                        onClick={() => setSelected(t)}
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* DETAIL OVERLAY */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full md:w-[600px] lg:w-[40%] h-[90vh] bg-card rounded-xl shadow-2xl overflow-hidden">
            <DetailPane
              comment={{
                ...selected,
                followers: selected.engagement.likes,
              }}
              onClose={() => setSelected(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitorStream;