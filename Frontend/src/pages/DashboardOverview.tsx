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
import { jsPDF } from "jspdf";
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

  const exportCSV = () => {
    const headers = ["_id","name","platform","intent","status","value","createdAt"];
    const rows = leads.map(l => [l._id, l.name, l.platform, String(l.intent), l.status, String(l.value), l.createdAt].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("dashboard.pdf");
    } catch (e) {
      console.error("Failed to export PDF", e);
    }
  };

  /* ================= LOAD CSV ================= */
  useEffect(() => {
    const loadCSV = async () => {
      try {
        const res = await fetch("/data/leads.csv");
        const text = await res.text();
        if (text.startsWith("<!doctype html") || !text.trim()) return;

        const lines = text.trim().split("\n");
        const headers = lines[0].split(",");

        const parsed: Lead[] = lines.slice(1).map((line, index) => {
          const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const row: CsvRow = {};
          headers.forEach((h, i) => {
            row[h.trim()] = values[i]?.replace(/^"|"$/g, "").trim() ?? "";
          });

          return {
            _id: row._id || String(index),
            name: row.name || "Unknown",
            platform: row.platform || "Direct",
            intent: Number(row.intent) || 0,
            status: row.status || "New",
            value: Number(row.value) || 0,
            createdAt: row.createdAt || new Date().toISOString(),
          };
        });
        setLeads(parsed);
      } catch (err) {
        console.error("Error loading CSV:", err);
      }
    };
    loadCSV();
  }, []);

  /* ================= DERIVED DATA ================= */
  const totalLeads = leads.length;
  const highIntent = leads.filter((l) => l.intent >= 70).length;
  const replies = leads.filter((l) => l.status !== "New").length;
  const clicks = totalLeads * 3;
  const converted = leads.filter((l) => l.status === "Closed Won").length;
  const conversion = totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(1) + "%" : "0%";

  const rangeData = {
    "24h": { engagement: [{ date: "6 AM", engagements: 200, leads: 5 }, { date: "12 PM", engagements: 350, leads: 9 }, { date: "6 PM", engagements: 520, leads: 14 }, { date: "12 AM", engagements: 680, leads: 18 }] },
    "7d": { engagement: [{ date: "Mon", engagements: 420, leads: 6 }, { date: "Tue", engagements: 510, leads: 9 }, { date: "Wed", engagements: 620, leads: 12 }, { date: "Thu", engagements: 700, leads: 15 }, { date: "Fri", engagements: 860, leads: 19 }, { date: "Sat", engagements: 940, leads: 22 }, { date: "Sun", engagements: 1050, leads: 26 }] },
    "30d": { engagement: [{ date: "W1", engagements: 1200, leads: 40 }, { date: "W2", engagements: 1800, leads: 65 }, { date: "W3", engagements: 2400, leads: 90 }, { date: "W4", engagements: 3100, leads: 120 }] },
    "custom": { engagement: [{ date: "D1", engagements: 210, leads: 4 }, { date: "D2", engagements: 340, leads: 7 }, { date: "D3", engagements: 310, leads: 6 }, { date: "D4", engagements: 420, leads: 9 }] },
  };

  const sentimentData = [
    { name: "Positive", value: highIntent, color: "hsl(var(--primary))" },
    { name: "Neutral", value: Math.max(0, totalLeads - highIntent), color: "hsl(var(--muted))" },
    { name: "Negative", value: 0, color: "hsl(var(--destructive))" },
  ];

  const platformData = Object.values(
    leads.reduce<Record<string, { platform: string; threads: number; leads: number }>>((acc, l) => {
      if (!acc[l.platform]) acc[l.platform] = { platform: l.platform, threads: 0, leads: 0 };
      acc[l.platform].threads += 1;
      acc[l.platform].leads += 1;
      return acc;
    }, {})
  );

  const kpiData = [
    { icon: MessageSquare, label: "New Comments", value: totalLeads.toString() },
    { icon: AlertCircle, label: "High-Intent (≥70)", value: highIntent.toString() },
    { icon: ThumbsUp, label: "Auto Replies Sent", value: replies.toString() },
    { icon: Users, label: "Link Clicks", value: clicks.toString() },
    { icon: TrendingUp, label: "Engage→Lead %", value: conversion },
    { icon: Activity, label: "Avg Reply Time", value: "—" },
  ];

  return (
    <div ref={dashboardRef} className="p-4 md:p-8 space-y-6 md:space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Dashboard Overview</h1>
          <p className="text-sm md:text-base text-muted-foreground">Real-time analytics and metrics</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={range} onValueChange={(v: any) => setRange(v)}>
            <SelectTrigger className="w-[120px] bg-card">
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
            <SelectTrigger className="w-[140px] bg-primary text-primary-foreground">
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

      {/* KPI Cards - Stacked on mobile, 6 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Card className="p-4 md:p-6">
          <h3 className="text-lg font-bold mb-4">Engagement & Lead Trend</h3>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rangeData[range].engagement}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="engagements" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="leads" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <h3 className="text-lg font-bold mb-4">Sentiment Analysis</h3>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sentimentData} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={5}>
                  {sentimentData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Card className="p-4 md:p-6">
          <h3 className="text-lg font-bold mb-4">Platform Performance</h3>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="platform" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="threads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="leads" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <h3 className="text-lg font-bold mb-4">Intent Score Distribution</h3>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { range: "0-20", count: leads.filter((l) => l.intent <= 20).length },
                  { range: "21-40", count: leads.filter((l) => l.intent > 20 && l.intent <= 40).length },
                  { range: "41-60", count: leads.filter((l) => l.intent > 40 && l.intent <= 60).length },
                  { range: "61-80", count: leads.filter((l) => l.intent > 60 && l.intent <= 80).length },
                  { range: "81-100", count: leads.filter((l) => l.intent > 80).length },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="range" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent High-Intent Leads */}
      <Card className="p-4 md:p-6">
        <h3 className="text-lg font-bold mb-4">Recent High-Intent Leads</h3>
        <div className="space-y-3">
          {leads
            .filter((l) => l.intent >= 80)
            .slice(0, 3)
            .map((a) => (
              <div
                key={a._id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="h-8 w-10 justify-center">{a.intent}</Badge>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{a.name}</div>
                    <div className="text-xs text-muted-foreground">
                      via {a.platform} • 5 min ago
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full sm:w-auto ml-auto"
                  onClick={() => navigate("/leads-pipeline")}
                >
                  Engage
                </Button>
              </div>
            ))}
            {leads.filter(l => l.intent >= 80).length === 0 && (
              <p className="text-sm text-center text-muted-foreground py-4">No high intent leads found.</p>
            )}
        </div>
      </Card>
    </div>
  );
};

export default DashboardOverview;