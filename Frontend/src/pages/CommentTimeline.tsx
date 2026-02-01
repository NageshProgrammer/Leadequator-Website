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
import { MessageSquare, Send, MousePointer, Filter } from "lucide-react";
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

/* ================= COMPONENT ================= */

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
      const res = await fetch("/data/leads.csv");
      const text = await res.text();
      if (text.startsWith("<!doctype html")) return;

      const lines = text.trim().split("\n");
      const headers = lines[0].split(",");

      const rows: LeadRow[] = lines.slice(1).map((line) => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const row: Record<string, string> = {};

        headers.forEach((h, i) => {
          row[h] = values[i]?.replace(/^"|"$/g, "").trim() ?? "";
        });

        return {
          name: row.name,
          platform: row.platform,
          intent: Number(row.intent),
          createdAt: row.createdAt,
          replyStatus: (row.replyStatus as "Sent" | "Not Sent") ?? "Not Sent",
          value: Number(row.value),
        };
      });

      /* ================= LINE CHART ================= */

      const grouped: Record<string, TimelinePoint> = {};

      rows.forEach((r) => {
        const hour = new Date(r.createdAt).getHours();
        const label = `${hour}:00`;

        if (!grouped[label]) {
          grouped[label] = {
            time: label,
            comments: 0,
            replies: 0,
            clicks: 0,
          };
        }

        grouped[label].comments += 1;

        if (r.replyStatus === "Sent") {
          grouped[label].replies += 1;
          grouped[label].clicks += r.value > 0 ? 1 : 0;
        }
      });

      setTimelineData(Object.values(grouped));

      /* ================= SCATTER EVENTS ================= */

      let t = 1;
      const scatter: ScatterEvent[] = [];

      rows.forEach((r) => {
        scatter.push({ time: t++, intent: r.intent, type: "comment" });

        if (r.replyStatus === "Sent") {
          scatter.push({ time: t++, intent: r.intent, type: "reply" });

          if (r.value > 0) {
            scatter.push({ time: t++, intent: r.intent, type: "click" });
          }
        }
      });

      setEventData(scatter);

      /* ================= RECENT EVENTS ================= */

      setRecentEvents(
        rows.slice(-5).map((r) => ({
          author: r.name,
          platform: r.platform,
          intent: r.intent,
          event:
            r.replyStatus === "Sent"
              ? "Comment → Reply → Click"
              : "Comment",
          duration: r.replyStatus === "Sent" ? "8 minutes" : "—",
          time: new Date(r.createdAt).toLocaleTimeString(),
        }))
      );
    };

    loadCSV();
  }, []);

  /* ================= HELPERS ================= */

  const getEventColor = (type: ScatterEvent["type"]) => {
    if (type === "comment") return "hsl(var(--primary))";
    if (type === "reply") return "hsl(var(--chart-2))";
    return "hsl(var(--chart-3))";
  };

  /* ================= UI ================= */

  return (
    <div className="p-8 space-y-8 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Comment Timeline</h1>
          <p className="text-muted-foreground">
            Visualize the flow: Comment → Auto Reply → Link Clicks
          </p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="24h">
            <SelectTrigger className="w-32 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7d</SelectItem>
              <SelectItem value="30d">Last 30d</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Line Chart */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-xl font-bold mb-6">Event Flow Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="comments" stroke="hsl(var(--primary))" />
            <Line dataKey="replies" stroke="hsl(var(--chart-2))" />
            <Line dataKey="clicks" stroke="hsl(var(--chart-3))" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Scatter */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-xl font-bold mb-6">Individual Event Timeline</h3>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis dataKey="intent" />
            <Tooltip />
            <Scatter data={eventData}>
              {eventData.map((e, i) => (
                <Cell key={i} fill={getEventColor(e.type)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-xl font-bold mb-6">Recent Event Sequences</h3>
        <div className="space-y-4">
          {recentEvents.map((e, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-background rounded-lg border"
            >
              <div className="flex items-center gap-4">
                <Badge>{e.intent}</Badge>
                <div>
                  <div className="font-semibold">{e.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {e.event}
                  </div>
                </div>
              </div>
              <div className="text-right text-sm">{e.duration}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CommentTimeline;
