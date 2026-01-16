import { useEffect, useState } from "react";
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
  replyStatus: "Not Sent" | "Sent";
};

/* ================= COMPONENT ================= */

const MonitorStream = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState<Thread | null>(null);

  /* ================= LOAD CSV ================= */

  useEffect(() => {
    const loadCSV = async () => {
      const res = await fetch("/data/leads.csv");
      const text = await res.text();
      if (text.startsWith("<!doctype html")) return;

      const lines = text.trim().split("\n");
      const headers = lines[0].split(",");

      const data: Thread[] = lines.slice(1).map((line, index) => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const row: Record<string, string> = {};

        headers.forEach((h, i) => {
          row[h] = values[i]?.replace(/^"|"$/g, "").trim() ?? "";
        });

        const intent = Number(row.intent);

        return {
          id: index + 1,
          platform: row.platform,
          user: row.name,
          intent,
          sentiment:
            intent >= 80 ? "Positive" : intent >= 60 ? "Neutral" : "Negative",
          timestamp: new Date(row.createdAt).toLocaleString(),
          content: `Looking for solutions related to ${row.company} via ${row.platform}`,
          engagement: { likes: Math.floor(Number(row.value) / 1000) },
          keywords: [row.company, row.platform],
          replyStatus: "Not Sent",
        };
      });

      setThreads(data);
    };

    loadCSV();
  }, []);

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

  const openExternalLink = (platform: string) => {
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

  const handleSendReply = (id: number) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, replyStatus: "Sent" } : t
      )
    );

    setSelected((prev) =>
      prev && prev.id === id ? { ...prev, replyStatus: "Sent" } : prev
    );
  };

  /* ================= UI ================= */

  return (
    <div className="p-8 bg-background">
      <div
        className={`flex gap-6 ${
          selected ? "overflow-x-auto" : "overflow-x-hidden"
        }`}
      >
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
                {threads.map((t) => (
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
                    <TableCell className="text-center">0</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            openExternalLink(t.platform);
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
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* DETAIL PANE */}
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
