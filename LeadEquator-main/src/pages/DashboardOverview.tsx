import { useEffect, useState, useRef } from "react";
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
import { KPICard } from "@/components/dashboard/KPICard";
import {
  Activity,
  TrendingUp,
  Users,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ================= TYPES ================= */
type Lead = {
  _id: string;
  name: string;
  platform: string;
  intent: number;
  status: string;
  value: number;
  createdAt: string;
};

type CsvRow = Record<string, string>;

const DashboardOverview = () => {
  const navigate = useNavigate();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const [range, setRange] = useState<"24h" | "7d" | "30d" | "custom">("7d");
  const [leads, setLeads] = useState<Lead[]>([]);

  /* ================= LOAD CSV ================= */
  useEffect(() => {
    const loadCSV = async () => {
      const res = await fetch("/data/leads.csv");
      const text = await res.text();
      if (text.startsWith("<!doctype html")) return;

      const lines = text.trim().split("\n");
      const headers = lines[0].split(",");

      const parsed: Lead[] = lines.slice(1).map((line, index) => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const row: CsvRow = {};

        headers.forEach((h, i) => {
          row[h] = values[i]?.replace(/^"|"$/g, "").trim() ?? "";
        });

        return {
          _id: row._id || String(index),
          name: row.name,
          platform: row.platform,
          intent: Number(row.intent),
          status: row.status,
          value: Number(row.value),
          createdAt: row.createdAt,
        };
      });

      setLeads(parsed);
    };

    loadCSV();
  }, []);

  /* ================= DERIVED DATA ================= */
  const totalLeads = leads.length;
  const highIntent = leads.filter((l) => l.intent >= 70).length;
  const replies = leads.filter((l) => l.status !== "New").length;
  const clicks = totalLeads * 3;
  const converted = leads.filter((l) => l.status === "Closed Won").length;
  const conversion =
    totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(1) + "%" : "0%";

  const rangeData = {
    "24h": {
      kpi: {
        comments: totalLeads.toString(),
        highIntent: highIntent.toString(),
        replies: replies.toString(),
        clicks: clicks.toString(),
        conversion,
        replyTime: "—",
      },
      engagement: [
        { date: "6 AM", engagements: 200, leads: 5 },
        { date: "12 PM", engagements: 350, leads: 9 },
        { date: "6 PM", engagements: 520, leads: 14 },
        { date: "12 AM", engagements: 680, leads: 18 },
      ],
    },
    "7d": {
      kpi: {
        comments: totalLeads.toString(),
        highIntent: highIntent.toString(),
        replies: replies.toString(),
        clicks: clicks.toString(),
        conversion,
        replyTime: "—",
      },
      engagement: [
        { date: "Mon", engagements: 420, leads: 6 },
        { date: "Tue", engagements: 510, leads: 9 },
        { date: "Wed", engagements: 620, leads: 12 },
        { date: "Thu", engagements: 700, leads: 15 },
        { date: "Fri", engagements: 860, leads: 19 },
        { date: "Sat", engagements: 940, leads: 22 },
        { date: "Sun", engagements: 1050, leads: 26 },
      ],
    },
    "30d": {
      kpi: {
        comments: totalLeads.toString(),
        highIntent: highIntent.toString(),
        replies: replies.toString(),
        clicks: clicks.toString(),
        conversion,
        replyTime: "—",
      },
      engagement: [
        { date: "W1", engagements: 1200, leads: 40 },
        { date: "W2", engagements: 1800, leads: 65 },
        { date: "W3", engagements: 2400, leads: 90 },
        { date: "W4", engagements: 3100, leads: 120 },
      ],
    },
    custom: {
      kpi: {
        comments: totalLeads.toString(),
        highIntent: highIntent.toString(),
        replies: replies.toString(),
        clicks: clicks.toString(),
        conversion,
        replyTime: "—",
      },
      engagement: [
        { date: "D1", engagements: 210, leads: 4 },
        { date: "D2", engagements: 340, leads: 7 },
        { date: "D3", engagements: 310, leads: 6 },
        { date: "D4", engagements: 420, leads: 9 },
      ],
    },
  };

  const sentimentData = [
    { name: "Positive", value: highIntent, color: "hsl(var(--primary))" },
    { name: "Neutral", value: totalLeads - highIntent, color: "hsl(var(--muted))" },
    { name: "Negative", value: 0, color: "hsl(var(--destructive))" },
  ];

  const platformData = Object.values(
    leads.reduce<Record<string, { platform: string; threads: number; leads: number }>>(
      (acc, l) => {
        if (!acc[l.platform]) {
          acc[l.platform] = { platform: l.platform, threads: 0, leads: 0 };
        }
        acc[l.platform].threads += 1;
        acc[l.platform].leads += 1;
        return acc;
      },
      {}
    )
  );

  const kpiData = [
    { icon: MessageSquare, label: "New Comments", value: rangeData[range].kpi.comments },
    { icon: AlertCircle, label: "High-Intent (≥70)", value: rangeData[range].kpi.highIntent },
    { icon: ThumbsUp, label: "Auto Replies Sent", value: rangeData[range].kpi.replies },
    { icon: Users, label: "Link Clicks", value: rangeData[range].kpi.clicks },
    { icon: TrendingUp, label: "Engagement→Lead %", value: rangeData[range].kpi.conversion },
    { icon: Activity, label: "Avg Reply Time", value: rangeData[range].kpi.replyTime },
  ];

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    const rows: string[][] = [];

    rows.push(["Metric", "Value"]);
    kpiData.forEach((k) => rows.push([k.label, k.value]));
    rows.push([]);

    rows.push(["Sentiment", "Count"]);
    sentimentData.forEach((s) => rows.push([s.name, String(s.value)]));
    rows.push([]);

    rows.push(["Platform", "Threads", "Leads"]);
    platformData.forEach((p) =>
      rows.push([p.platform, String(p.threads), String(p.leads)])
    );
    rows.push([]);

    rows.push(["Recent High Intent Leads"]);
    rows.push(["Name", "Platform", "Intent"]);
    leads
      .filter((l) => l.intent >= 80)
      .slice(0, 5)
      .forEach((l) =>
        rows.push([l.name, l.platform, String(l.intent)])
      );

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-${range}.csv`;
    a.click();
  };

  /* ================= EXPORT PDF ================= */
  const exportPDF = async () => {
    if (!dashboardRef.current) return;

    const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`dashboard-${range}.pdf`);
  };

  const minutesAgo = (m: number) => `${m} min ago`;

  /* ================= UI ================= */
  return (
    <div ref={dashboardRef} className="p-8 space-y-8 bg-background">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Real-time analytics and performance metrics
          </p>
        </div>

        <div className="flex gap-3">
          <Select value={range} onValueChange={(v) => setRange(v as any)}>
            <SelectTrigger className="w-32 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7d</SelectItem>
              <SelectItem value="30d">Last 30d</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => (v === "csv" ? exportCSV() : exportPDF())}>
            <SelectTrigger className="w-40 bg-primary text-primary-foreground">
              <Download className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">Export CSV</SelectItem>
              <SelectItem value="pdf">Export PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Engagement & Lead Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rangeData[range].engagement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="engagements" stroke="hsl(var(--primary))" />
              <Line dataKey="leads" stroke="hsl(var(--chart-2))" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Sentiment Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={sentimentData} dataKey="value" outerRadius={100}>
                {sentimentData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Platform Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="threads" fill="hsl(var(--primary))" />
              <Bar dataKey="leads" fill="hsl(var(--chart-2))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Intent Score Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { range: "0-20", count: leads.filter((l) => l.intent <= 20).length },
                { range: "21-40", count: leads.filter((l) => l.intent > 20 && l.intent <= 40).length },
                { range: "41-60", count: leads.filter((l) => l.intent > 40 && l.intent <= 60).length },
                { range: "61-80", count: leads.filter((l) => l.intent > 60 && l.intent <= 80).length },
                { range: "81-100", count: leads.filter((l) => l.intent > 80).length },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6">Recent High-Intent Leads</h3>
        {leads
          .filter((l) => l.intent >= 80)
          .slice(0, 3)
          .map((a) => (
            <div
              key={a._id}
              className="flex items-start gap-4 p-4 rounded-lg border hover:border-primary/50"
            >
              <Badge>{a.intent}</Badge>
              <div className="flex-1">
                <div className="font-semibold">{a.name}</div>
                <div className="text-xs text-muted-foreground">
                  via {a.platform} • {minutesAgo(5)}
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => navigate("/leads-pipeline")}>
                Engage
              </Button>
            </div>
          ))}
      </Card>
    </div>
  );
};

export default DashboardOverview;
