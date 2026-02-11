import { useEffect, useState, useRef, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
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
type RealLead = {
  id: string;
  platform: string;
  user: string;
  intent: number;
  sentiment: string;
  timestamp: string;
  content: string;
  replyStatus: string;
};

// Ensure this matches your backend port (5000)
const API_BASE = "http://localhost:5000/api/lead-discovery";

const DashboardOverview = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const [range, setRange] = useState<"24h" | "7d" | "30d" | "custom">("7d");
  const [leads, setLeads] = useState<RealLead[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH REAL DATA ================= */
  const fetchData = useCallback(async () => {
    if (!isLoaded || !user?.id) return;

    try {
      setLoading(true);
      const userId = user.id;

      // 1. Fetch from both sources
      const [redditRes, quoraRes] = await Promise.all([
        fetch(`${API_BASE}/reddit/posts?userId=${encodeURIComponent(userId)}`),
        fetch(`${API_BASE}/quora/posts?userId=${encodeURIComponent(userId)}`),
      ]);

      const redditData = await redditRes.json();
      const quoraData = await quoraRes.json();

      // 2. Combine and Normalize
      const combined = [
        ...(redditData.posts || []),
        ...(quoraData.posts || []),
      ];

      const mapped: RealLead[] = combined.map((p: any) => ({
        id: String(p.id),
        platform: p.platform || (p.subreddit ? "Reddit" : "Quora"),
        user: p.author ?? "Unknown",
        intent: Number(p.intent ?? 50), // Default 50 if analysis not run
        sentiment:
          Number(p.intent ?? 50) >= 80
            ? "Positive"
            : Number(p.intent ?? 50) >= 60
            ? "Neutral"
            : "Negative",
        timestamp: p.createdAt || new Date().toISOString(),
        content: p.title || p.question || p.text || "",
        replyStatus: p.replyStatus || "Not Sent",
      }));

      // Sort by newest
      mapped.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setLeads(mapped);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ================= DERIVED METRICS ================= */
  const totalComments = leads.length;
  const highIntentCount = leads.filter((l) => l.intent >= 70).length;
  const sentReplies = leads.filter((l) => l.replyStatus === "Sent").length;
  // Estimated clicks (e.g. 80% of replies get clicked)
  const clicks = Math.floor(sentReplies * 0.8); 
  
  // Calculate Conversion % (Replies Sent / High Intent Leads found)
  const conversionRate =
    highIntentCount > 0
      ? ((sentReplies / highIntentCount) * 100).toFixed(1) + "%"
      : "0%";

  /* ================= CHART DATA PREP ================= */
  
  // 1. Platform Distribution
  const platformCounts = leads.reduce((acc: any, curr) => {
    acc[curr.platform] = (acc[curr.platform] || 0) + 1;
    return acc;
  }, {});
  
  const platformChartData = Object.keys(platformCounts).map((key) => ({
    platform: key,
    leads: platformCounts[key],
  }));

  // 2. Intent Distribution
  const intentBuckets = [
    { range: "0-20", count: 0 },
    { range: "21-40", count: 0 },
    { range: "41-60", count: 0 },
    { range: "61-80", count: 0 },
    { range: "81-100", count: 0 },
  ];

  leads.forEach((l) => {
    if (l.intent <= 20) intentBuckets[0].count++;
    else if (l.intent <= 40) intentBuckets[1].count++;
    else if (l.intent <= 60) intentBuckets[2].count++;
    else if (l.intent <= 80) intentBuckets[3].count++;
    else intentBuckets[4].count++;
  });

  // 3. Sentiment Pie Data
  const sentimentData = [
    { name: "Positive", value: leads.filter(l => l.sentiment === "Positive").length, color: "hsl(var(--primary))" }, // Gold
    { name: "Neutral", value: leads.filter(l => l.sentiment === "Neutral").length, color: "hsl(var(--muted))" },
    { name: "Negative", value: leads.filter(l => l.sentiment === "Negative").length, color: "hsl(var(--destructive))" },
  ];

  // 4. Engagement Trend (Group by Date)
  // This aggregates your actual leads by date to show real activity
  const trendMap = leads.reduce((acc: any, curr) => {
    const date = new Date(curr.timestamp).toLocaleDateString(undefined, { weekday: 'short' }); // e.g., "Mon"
    if (!acc[date]) acc[date] = { date, engagements: 0, leads: 0 };
    acc[date].engagements += 1;
    if (curr.intent >= 70) acc[date].leads += 1;
    return acc;
  }, {});

  // Convert to array and reverse to show oldest -> newest left to right if sorted by date
  // For simplicity here, we just take the values. In a real app, you'd sort by actual date.
  let engagementTrend = Object.values(trendMap);
  
  // Fallback if no data, show empty chart structure
  if (engagementTrend.length === 0) {
      engagementTrend = [
        { date: "Mon", engagements: 0, leads: 0 },
        { date: "Tue", engagements: 0, leads: 0 },
        { date: "Wed", engagements: 0, leads: 0 },
        { date: "Thu", engagements: 0, leads: 0 },
        { date: "Fri", engagements: 0, leads: 0 },
      ];
  }

  /* ================= EXPORT ================= */
  const exportCSV = () => {
    const headers = ["ID", "Platform", "User", "Intent", "ReplyStatus", "Date"];
    const rows = leads.map((l) =>
      [l.id, l.platform, l.user, l.intent, l.replyStatus, l.timestamp].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard_data.csv";
    a.click();
  };

  const exportPDF = async () => {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("dashboard.pdf");
  };

  const kpiData = [
    { icon: MessageSquare, label: "Total Comments", value: totalComments.toString() }, // CHANGED LABEL
    { icon: AlertCircle, label: "High-Intent (≥70)", value: highIntentCount.toString() },
    { icon: ThumbsUp, label: "Auto Replies Sent", value: sentReplies.toString() },
    { icon: Users, label: "Link Clicks", value: clicks.toString() },
    { icon: TrendingUp, label: "Engage→Lead %", value: conversionRate },
    { icon: Activity, label: "Avg Reply Time", value: "2m 30s" }, // Mock or calc from DB
  ];

  return (
    <div ref={dashboardRef} className="p-4 md:p-8 space-y-6 md:space-y-8 bg-background min-h-screen text-white font-sans selection:bg-[#FFD700] selection:text-black">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Dashboard <span className="text-[#FFD700]">Overview</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-400">
            Real-time analytics from Reddit & Quora streams
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={range} onValueChange={(v: any) => setRange(v)}>
            <SelectTrigger className="w-[120px] bg-zinc-900 border-zinc-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7d</SelectItem>
              <SelectItem value="30d">Last 30d</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => (v === "csv" ? exportCSV() : exportPDF())}>
            <SelectTrigger className="w-[140px] bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-bold border-none">
              <Download className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
              <SelectItem value="csv">Export CSV</SelectItem>
              <SelectItem value="pdf">Export PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Card className="p-4 md:p-6 bg-zinc-900/50 border-zinc-800">
          <h3 className="text-lg font-bold mb-4 text-white">Engagement Trend</h3>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementTrend as any[]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} stroke="#888" />
                <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#888" />
                <Tooltip 
                    contentStyle={{ backgroundColor: "#000", border: "1px solid #333", color: "#fff" }}
                />
                <Legend />
                <Line type="monotone" dataKey="engagements" stroke="#FFD700" strokeWidth={2} dot={false} name="Total Comments" />
                <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} dot={false} name="High Intent" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-zinc-900/50 border-zinc-800">
          <h3 className="text-lg font-bold mb-4 text-white">Sentiment Analysis</h3>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                    data={sentimentData} 
                    dataKey="value" 
                    innerRadius={60} 
                    outerRadius={80} 
                    paddingAngle={5}
                    stroke="none"
                >
                  {sentimentData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#000", border: "1px solid #333", borderRadius: "8px" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Card className="p-4 md:p-6 bg-zinc-900/50 border-zinc-800">
          <h3 className="text-lg font-bold mb-4 text-white">Platform Distribution</h3>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="platform" fontSize={12} stroke="#888" />
                <YAxis fontSize={12} stroke="#888" />
                <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{ backgroundColor: "#000", border: "1px solid #333" }} />
                <Bar dataKey="leads" fill="#FFD700" radius={[4, 4, 0, 0]} name="Total Posts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-zinc-900/50 border-zinc-800">
          <h3 className="text-lg font-bold mb-4 text-white">Intent Score Distribution</h3>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intentBuckets}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="range" fontSize={12} stroke="#888" />
                <YAxis fontSize={12} stroke="#888" />
                <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{ backgroundColor: "#000", border: "1px solid #333" }} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent High-Intent Leads */}
      <Card className="p-4 md:p-6 bg-zinc-900/50 border-zinc-800">
        <h3 className="text-lg font-bold mb-4 text-white">Recent High-Intent Leads (≥70)</h3>
        <div className="space-y-3">
          {loading ? (
             <div className="text-center py-4 text-zinc-500">Loading leads...</div>
          ) : leads.filter((l) => l.intent >= 70).length === 0 ? (
             <div className="text-center py-4 text-zinc-500">No high intent leads found yet.</div>
          ) : (
             leads
            .filter((l) => l.intent >= 70)
            .slice(0, 3)
            .map((a) => (
              <div
                key={a.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-black/40 hover:border-[#FFD700]/50 transition-colors"
              >
                <div className="flex items-center gap-3 w-full">
                  <Badge className="h-8 w-12 justify-center bg-[#FFD700] text-black font-bold text-sm">
                    {a.intent}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-zinc-200 truncate">{a.user}</div>
                    <div className="text-xs text-zinc-500 flex items-center gap-2">
                      <span className="capitalize">{a.platform}</span>
                      <span>•</span>
                      <span>{new Date(a.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-full sm:w-auto ml-auto bg-zinc-800 text-white hover:bg-zinc-700 hover:text-[#FFD700]"
                  onClick={() => navigate("/monitor-stream")}
                >
                  Engage
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default DashboardOverview;