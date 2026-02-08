import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Send, MousePointer, Filter, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* ================= TYPES ================= */
type LeadRow = {
  name: string;
  platform: string;
  intent: number;
  createdAt: string;
  replyStatus: "Not Sent" | "Sent";
  value: number;
};

type TimelinePoint = {
  time: string;
  comments: number;
  replies: number;
  clicks: number;
};

type ScatterEvent = {
  time: number;
  intent: number;
  type: "comment" | "reply" | "click";
};

const CommentTimeline = () => {
  const [timelineData, setTimelineData] = useState<TimelinePoint[]>([]);
  const [eventData, setEventData] = useState<ScatterEvent[]>([]);
  const [recentEvents, setRecentEvents] = useState<
    {
      author: string;
      platform: string;
      intent: number;
      event: string;
      duration: string;
      time: string;
    }[]
  >([]);

  /* ================= LOAD CSV ================= */
  useEffect(() => {
    const loadCSV = async () => {
      try {
        const res = await fetch("/data/leads.csv");
        const text = await res.text();
        if (text.startsWith("<!doctype html")) return;

        const lines = text.trim().split("\n");
        const headers = lines[0].split(",");

        const rows: LeadRow[] = lines.slice(1).map((line) => {
          const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const row: Record<string, string> = {};
          headers.forEach((h, i) => {
            row[h.trim()] = values[i]?.replace(/^"|"$/g, "").trim() ?? "";
          });

          return {
            name: row.name || "Unknown",
            platform: row.platform || "Platform",
            intent: Number(row.intent) || 0,
            createdAt: row.createdAt || new Date().toISOString(),
            replyStatus: (row.replyStatus as any) || "Not Sent",
            value: Number(row.value) || 0,
          };
        });

        // Grouping for Line Chart
        const grouped: Record<string, TimelinePoint> = {};
        rows.forEach((r) => {
          const date = new Date(r.createdAt);
          const label = `${date.getHours()}:00`;
          if (!grouped[label]) {
            grouped[label] = { time: label, comments: 0, replies: 0, clicks: 0 };
          }
          grouped[label].comments += 1;
          if (r.replyStatus === "Sent") {
            grouped[label].replies += 1;
            grouped[label].clicks += r.value > 0 ? 1 : 0;
          }
        });
        setTimelineData(Object.values(grouped));

        // Individual Events for Scatter
        let t = 1;
        const scatter: ScatterEvent[] = [];
        rows.forEach((r) => {
          scatter.push({ time: t++, intent: r.intent, type: "comment" });
          if (r.replyStatus === "Sent") {
            scatter.push({ time: t++, intent: r.intent, type: "reply" });
            if (r.value > 0) scatter.push({ time: t++, intent: r.intent, type: "click" });
          }
        });
        setEventData(scatter);

        // Recent Sequences
        setRecentEvents(
          rows.slice(-5).reverse().map((r) => ({
            author: r.name,
            platform: r.platform,
            intent: r.intent,
            event: r.replyStatus === "Sent" ? "Comment → Reply → Click" : "Comment Only",
            duration: r.replyStatus === "Sent" ? "8m" : "—",
            time: new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }))
        );
      } catch (err) {
        console.error("Timeline load error:", err);
      }
    };
    loadCSV();
  }, []);

  const getEventColor = (type: ScatterEvent["type"]) => {
    if (type === "comment") return "hsl(var(--primary))";
    if (type === "reply") return "hsl(var(--chart-2))";
    return "hsl(var(--chart-3))";
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Comment Timeline</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Visualize the flow: Comment → Auto Reply → Clicks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="24h">
            <SelectTrigger className="w-[110px] md:w-32 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary" size="sm" className="h-10 md:h-11">
            <Filter className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>
      </div>

      {/* Line Chart */}
      <Card className="p-4 md:p-6 bg-card">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Event Flow Over Time</h3>
        <div className="h-[250px] md:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
              <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Line type="monotone" dataKey="comments" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="replies" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="clicks" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Scatter Chart */}
      <Card className="p-4 md:p-6 bg-card">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Individual Event Distribution</h3>
        <div className="h-[200px] md:h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis type="number" dataKey="time" name="Sequence" hide />
              <YAxis type="number" dataKey="intent" name="Intent" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={eventData}>
                {eventData.map((e, i) => (
                  <Cell key={i} fill={getEventColor(e.type)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Sequence List */}
      <Card className="p-4 md:p-6 bg-card">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Recent Event Sequences</h3>
        <div className="space-y-3">
          {recentEvents.map((e, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 md:p-4 bg-background rounded-lg border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <Badge variant="outline" className="font-bold text-primary">{e.intent}</Badge>
                <div className="min-w-0">
                  <div className="font-semibold text-sm md:text-base truncate">{e.author}</div>
                  <div className="text-[10px] md:text-sm text-muted-foreground truncate">
                    {e.event}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] md:text-sm font-medium flex items-center justify-end">
                  <Clock className="w-3 h-3 mr-1" /> {e.time}
                </div>
                <div className="text-[10px] text-muted-foreground italic">
                  Dur: {e.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CommentTimeline;