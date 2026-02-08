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
import { Search, Filter, Sparkles, ExternalLink } from "lucide-react";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { DetailPane, DetailComment } from "@/components/dashboard/DetailPane";
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

  /* ================= LOAD CSV ================= */

  useEffect(() => {
    // Fetch Quora posts from ai-service and map to Thread[]
    const loadQuora = async () => {
      setLoading(true);
      setError(null);

      type BackendPost = Record<string, unknown>;

      const mapItems = (items: BackendPost[]): Thread[] =>
        items.map((it: BackendPost, idx: number) => {
          const rawIntent = it.intent as number | undefined;
          const intent = Number(rawIntent ?? 50 + (idx % 50));

          return {
            id: Number((it.id as number) ?? idx + 1),
            platform: (it.platform as string) ?? "Quora",
            user: (it.author as string) ?? (it.userId as string) ?? "unknown",
            intent,
            sentiment: intent >= 80 ? "Positive" : intent >= 60 ? "Neutral" : "Negative",
            timestamp: (it.timestamp as string) ?? new Date().toLocaleString(),
            content: (it.content as string) ?? (it.question as string) ?? (it.title as string) ?? "",
            url: (it.url as string | undefined),
            replyOption1: (it.replyOption1 as string) ?? null,
            replyOption2: (it.replyOption2 as string) ?? null,
            engagement: { likes: Number((it.likes as number) ?? 0) },
            keywords: (it.keywords as string[]) ?? [],
            replyStatus: (it.replyStatus as "Not Sent" | "Sent") ?? "Not Sent",
          };
        });

      const tryFetch = async (url: string): Promise<BackendPost[]> => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return json;
      };

      try {
        // First attempt: use dev proxy path; fallback to direct backend
        let body = null;
        try {
          body = await tryFetch("/api/quora/posts");
        } catch {
          body = await tryFetch("http://localhost:8000/quora/posts");
        }

        const itemsRaw = (body as { data?: BackendPost[] })?.data ?? body;
        const items = (itemsRaw ?? []) as BackendPost[];
        const data = mapItems(items);
        setThreads(data);
      } catch (e: unknown) {
        console.error("Failed to load quora posts", e);
        const msg = (e as Error)?.message ?? String(e);
        setError(msg);
        toast({ title: "Failed to load posts", description: msg });
      } finally {
        setLoading(false);
      }
    };

    loadQuora();
  }, [toast]);

  /* ================= HELPERS ================= */

  const getIntentColor = (intent: number) => {
    if (intent >= 85) return "bg-primary text-primary-foreground";
    if (intent >= 70) return "bg-chart-2 text-foreground";
    return "bg-muted text-muted-foreground";
  };

  const getSentimentColor = (sentiment: Thread["sentiment"]) => {
    if (sentiment === "Positive") return "text-green-500";
    if (sentiment === "Negative") return "text-destructive";
    return "text-muted-foreground";
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
      Website: "https://google.com",
    };
    window.open(links[platform] || "#", "_blank");
  };

  /* ================= SEND HANDLER ================= */

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
    <div className="p-8 bg-background">
      <div className="flex gap-6">
        {showFilters && (
          <div className="w-80 flex-shrink-0">
            <FilterPanel onClose={() => setShowFilters(false)} />
          </div>
        )}

        {/* TABLE */}
        <div className="flex-1 space-y-6 min-w-[900px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Monitor Stream</h1>
              <p className="text-muted-foreground">
                Real-time feed of high-value conversations across platforms
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>

          <Card className="p-4 bg-card border-border">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations, keywords, users..."
                  className="pl-10 bg-background"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-48 bg-background">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="high">
                <SelectTrigger className="w-48 bg-background">
                  <SelectValue placeholder="Intent Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="bg-card border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Intent</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Reply</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-6">
                      Loading posts...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-sm text-destructive py-6">
                      Error loading posts: {error}
                    </TableCell>
                  </TableRow>
                ) : threads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-6">
                      No posts available.
                    </TableCell>
                  </TableRow>
                ) : (
                  threads.map((t) => (
                    <TableRow
                      key={t.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelected(t)}
                    >
                      <TableCell className="text-xs text-muted-foreground">
                        {t.timestamp}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{t.platform}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {t.user}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm">
                        {t.content}
                      </TableCell>
                      <TableCell>
                        <Badge className={getIntentColor(t.intent)}>
                          {t.intent}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-sm ${getSentimentColor(t.sentiment)}`}
                      >
                        {t.sentiment}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={t.replyStatus === "Sent" ? "default" : "secondary"}
                          className={
                            t.replyStatus === "Sent" ? "bg-green-500" : ""
                          }
                        >
                          {t.replyStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{t.engagement?.likes ?? 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Open post URL in new tab so user can manually paste/post the suggested reply
                              if (t.url) {
                                openExternalLink(t.platform, t.url);
                                toast({
                                  title: "Opened post",
                                  description: "The original post was opened in a new tab. Paste your reply there to post manually.",
                                });
                              } else {
                                // Fallback to platform homepage if no specific URL is stored
                                openExternalLink(t.platform);
                                toast({
                                  title: "No post URL",
                                  description: "No direct post URL is available; opened platform instead.",
                                });
                              }
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(t);
                            }}
                          >
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

        {/* DETAIL MODAL (replaces right-side pane) */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setSelected(null)}
            />

            <div className="relative w-[40%] h-screen mx-4">
                <div className="bg-card rounded-lg shadow-lg overflow-hidden h-full">
                  <div className="h-full overflow-y-auto">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitorStream;
