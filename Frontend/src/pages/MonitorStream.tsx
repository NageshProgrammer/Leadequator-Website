import { useEffect, useState, useCallback } from "react";
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
import { DetailPane } from "@/components/dashboard/DetailPane";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/* ================= TYPES ================= */

type RedditPost = {
  id: string;
  text: string;
  url: string;
  author: string;
  createdAt: string;
};

type Thread = {
  id: string;
  platform: string;
  user: string;
  intent: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  timestamp: string;
  content: string;
  engagement: { likes: number };
  keywords: string[];
  replyStatus: "Not Sent" | "Sent";
  url: string;
};

/* ================= COMPONENT ================= */

const MonitorStream = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState<Thread | null>(null);
  const [search, setSearch] = useState("");

  const userId = localStorage.getItem("userId");

  /* ================= LOAD STREAM ================= */

  const loadThreads = useCallback(async () => {
    if (!userId) return;

    const res = await fetch(
      `${API_BASE}/api/lead-discovery/reddit/posts?userId=${userId}`
    );
    const data = await res.json();
    const posts: RedditPost[] = data.posts || [];

    const mapped: Thread[] = posts.map((p) => {
      const intent = Math.floor(60 + Math.random() * 40);

      return {
        id: p.id,
        platform: "Reddit",
        user: p.author || "unknown",
        intent,
        sentiment:
          intent >= 80 ? "Positive" : intent >= 65 ? "Neutral" : "Negative",
        timestamp: new Date(p.createdAt).toLocaleString(),
        content: p.text,
        engagement: { likes: Math.floor(Math.random() * 100) },
        keywords: [],
        replyStatus: "Not Sent",
        url: p.url,
      };
    });

    setThreads(mapped);
  }, [userId]);

  /* ================= STREAM ================= */

  useEffect(() => {
    loadThreads();
    const interval = setInterval(loadThreads, 8000);
    return () => clearInterval(interval);
  }, [loadThreads]);

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

  const openExternalLink = (url: string) => {
    window.open(url, "_blank");
  };

  /* ================= SEND ================= */

  const handleSendReply = (id: string) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, replyStatus: "Sent" } : t
      )
    );

    setSelected((prev) =>
      prev && prev.id === id ? { ...prev, replyStatus: "Sent" } : prev
    );
  };

  const filteredThreads = threads.filter((t) =>
    t.content.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <div className="p-8 bg-background">
      <div className={`flex gap-6 ${selected ? "overflow-x-auto" : ""}`}>
        {showFilters && (
          <div className="w-80 flex-shrink-0">
            <FilterPanel onClose={() => setShowFilters(false)} />
          </div>
        )}

        <div className="flex-1 space-y-6 min-w-[900px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Monitor Stream</h1>
              <p className="text-muted-foreground">
                Live Reddit conversations based on your keywords
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select defaultValue="reddit">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reddit">Reddit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Intent</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Reply</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredThreads.map((t) => (
                  <TableRow
                    key={t.id}
                    onClick={() => setSelected(t)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>{t.timestamp}</TableCell>
                    <TableCell>
                      <Badge>{t.platform}</Badge>
                    </TableCell>
                    <TableCell>u/{t.user}</TableCell>
                    <TableCell className="truncate max-w-xs">
                      {t.content}
                    </TableCell>
                    <TableCell>
                      <Badge className={getIntentColor(t.intent)}>
                        {t.intent}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={getSentimentColor(t.sentiment)}
                    >
                      {t.sentiment}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          t.replyStatus === "Sent" ? "bg-green-500" : ""
                        }
                      >
                        {t.replyStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            openExternalLink(t.url);
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
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
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {selected && (
          <div className="w-[600px] flex-shrink-0">
            <DetailPane
              comment={{
                id: selected.id,
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
        )}
      </div>
    </div>
  );
};

export default MonitorStream;
