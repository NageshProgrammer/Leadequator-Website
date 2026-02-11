// import { useEffect, useState, useRef, useCallback } from "react";
// import { useUser } from "@clerk/clerk-react";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { KPICard } from "@/components/dashboard/KPICard";
// import {
//   Activity,
//   TrendingUp,
//   Users,
//   MessageSquare,
//   ThumbsUp,
//   AlertCircle,
//   Download,
// } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { useNavigate } from "react-router-dom";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";

// /* ================= TYPES ================= */
// // Define the shape of data coming from your API
// type DashboardLead = {
//   id: string;
//   platform: string;
//   user: string;
//   intent: number;
//   sentiment: string;
//   timestamp: string; // ISO string from DB
//   status: string;    // derived from replyStatus
//   content: string;
// };

// // Ensure this matches the port in your server.ts (5000)
// const API_BASE = "http://localhost:5000/api/lead-discovery";

// const DashboardOverview = () => {
//   const { user, isLoaded } = useUser();
//   const navigate = useNavigate();
//   const dashboardRef = useRef<HTMLDivElement>(null);

//   const [range, setRange] = useState<"24h" | "7d" | "30d" | "custom">("7d");
//   const [leads, setLeads] = useState<DashboardLead[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH LIVE DATA ================= */
//   const fetchData = useCallback(async () => {
//     if (!isLoaded || !user?.id) return;

//     try {
//       setLoading(true);
//       const userId = user.id;

//       // 1. Fetch Reddit & Quora posts in parallel
//       const [redditRes, quoraRes] = await Promise.all([
//         fetch(`${API_BASE}/reddit/posts?userId=${encodeURIComponent(userId)}`),
//         fetch(`${API_BASE}/quora/posts?userId=${encodeURIComponent(userId)}`),
//       ]);

//       const redditData = await redditRes.json();
//       const quoraData = await quoraRes.json();

//       // 2. Merge Data
//       const combined = [
//         ...(redditData.posts || []),
//         ...(quoraData.posts || []),
//       ];

//       // 3. Map to Dashboard Lead format
//       const mapped: DashboardLead[] = combined.map((p: any) => ({
//         id: String(p.id),
//         platform: p.platform || (p.subreddit ? "Reddit" : "Quora"),
//         user: p.author ?? "Unknown",
//         intent: Number(p.intent ?? 50),
//         // Calculate sentiment if missing
//         sentiment:
//           Number(p.intent ?? 50) >= 80
//             ? "Positive"
//             : Number(p.intent ?? 50) >= 60
//             ? "Neutral"
//             : "Negative",
//         timestamp: p.createdAt || new Date().toISOString(),
//         status: p.replyStatus === "Sent" ? "Engaged" : "New",
//         content: p.title || p.question || p.text || "",
//       }));

//       // Sort by newest first
//       mapped.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

//       setLeads(mapped);
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [isLoaded, user]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   /* ================= CALCULATE METRICS ================= */
//   const totalComments = leads.length;
//   const highIntentCount = leads.filter((l) => l.intent >= 70).length;
//   const sentReplies = leads.filter((l) => l.status === "Engaged").length;
  
//   // Mock clicks logic (e.g., 50% of replies usually get clicks) or fetch from DB if available
//   const clicks = Math.ceil(sentReplies * 1.5); 

//   const conversionRate =
//     highIntentCount > 0
//       ? ((sentReplies / highIntentCount) * 100).toFixed(1) + "%"
//       : "0%";

//   /* ================= CHART DATA GENERATORS ================= */
  
//   // 1. Engagement Trend (Line Chart)
//   // Group leads by date (MM-DD)
//   const trendMap = leads.reduce((acc: any, curr) => {
//     const date = new Date(curr.timestamp).toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
//     if (!acc[date]) acc[date] = { date, engagements: 0, leads: 0 };
//     acc[date].engagements += 1;
//     if (curr.intent >= 70) acc[date].leads += 1;
//     return acc;
//   }, {});
  
//   // Convert object to array and reverse to show timeline correctly
//   let engagementTrend = Object.values(trendMap).reverse();
  
//   // If empty, provide placeholder data so chart isn't blank
//   if (engagementTrend.length === 0) {
//       engagementTrend = [
//           { date: "Day 1", engagements: 0, leads: 0 },
//           { date: "Day 2", engagements: 0, leads: 0 },
//           { date: "Day 3", engagements: 0, leads: 0 },
//           { date: "Today", engagements: 0, leads: 0 },
//       ];
//   }

//   // 2. Sentiment (Pie Chart)
//   const sentimentData = [
//     { name: "Positive", value: leads.filter(l => l.sentiment === "Positive").length, color: "hsl(var(--primary))" }, // Uses theme color (usually gold/yellow)
//     { name: "Neutral", value: leads.filter(l => l.sentiment === "Neutral").length, color: "hsl(var(--muted))" },
//     { name: "Negative", value: leads.filter(l => l.sentiment === "Negative").length, color: "hsl(var(--destructive))" },
//   ];

//   // 3. Platform Distribution (Bar Chart)
//   const platformCounts = leads.reduce((acc: any, curr) => {
//     const key = curr.platform || "Unknown";
//     acc[key] = (acc[key] || 0) + 1;
//     return acc;
//   }, {});
//   const platformChartData = Object.keys(platformCounts).map(k => ({ platform: k, threads: platformCounts[k] }));

//   // 4. Intent Score Distribution (Bar Chart)
//   const intentBuckets = [
//     { range: "0-20", count: leads.filter(l => l.intent <= 20).length },
//     { range: "21-40", count: leads.filter(l => l.intent > 20 && l.intent <= 40).length },
//     { range: "41-60", count: leads.filter(l => l.intent > 40 && l.intent <= 60).length },
//     { range: "61-80", count: leads.filter(l => l.intent > 60 && l.intent <= 80).length },
//     { range: "81-100", count: leads.filter(l => l.intent > 80).length },
//   ];

//   /* ================= EXPORT ================= */
//   const exportCSV = () => {
//     const headers = ["ID", "Platform", "User", "Intent", "Status", "Date"];
//     const rows = leads.map(l => [l.id, l.platform, l.user, l.intent, l.status, l.timestamp].join(","));
//     const csv = [headers.join(","), ...rows].join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "dashboard_leads.csv";
//     a.click();
//   };

//   const exportPDF = async () => {
//     if (!dashboardRef.current) return;
//     const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save("dashboard.pdf");
//   };

//   const kpiData = [
//     { icon: MessageSquare, label: "Total Comments", value: totalComments.toString() },
//     { icon: AlertCircle, label: "High-Intent (≥70)", value: highIntentCount.toString() },
//     { icon: ThumbsUp, label: "Auto Replies Sent", value: sentReplies.toString() },
//     { icon: Users, label: "Link Clicks", value: clicks.toString() },
//     { icon: TrendingUp, label: "Engage→Lead %", value: conversionRate },
//     { icon: Activity, label: "Avg Reply Time", value: "2m 30s" },
//   ];

//   return (
//     <div ref={dashboardRef} className="p-4 md:p-8 space-y-6 md:space-y-8 bg-background min-h-screen">
//       {/* Header */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold mb-1">Dashboard Overview</h1>
//           <p className="text-sm md:text-base text-muted-foreground">Real-time analytics from Reddit & Quora</p>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <Select value={range} onValueChange={(v: any) => setRange(v)}>
//             <SelectTrigger className="w-[120px] bg-card">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="24h">Last 24h</SelectItem>
//               <SelectItem value="7d">Last 7d</SelectItem>
//               <SelectItem value="30d">Last 30d</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select onValueChange={(v) => (v === "csv" ? exportCSV() : exportPDF())}>
//             <SelectTrigger className="w-[140px] bg-primary text-primary-foreground">
//               <Download className="mr-2 h-4 w-4" />
//               <SelectValue placeholder="Export" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="csv">Export CSV</SelectItem>
//               <SelectItem value="pdf">Export PDF</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
//         {kpiData.map((kpi, index) => (
//           <KPICard key={index} {...kpi} />
//         ))}
//       </div>

//       {/* Charts Row 1 */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
//         <Card className="p-4 md:p-6">
//           <h3 className="text-lg font-bold mb-4">Engagement & Lead Trend</h3>
//           <div className="h-[250px] md:h-[300px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={engagementTrend as any[]}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                 <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
//                 <YAxis fontSize={12} tickLine={false} axisLine={false} />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="engagements" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Comments" />
//                 <Line type="monotone" dataKey="leads" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} name="High Intent" />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </Card>

//         <Card className="p-4 md:p-6">
//           <h3 className="text-lg font-bold mb-4">Sentiment Analysis</h3>
//           <div className="h-[250px] md:h-[300px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie data={sentimentData} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={5}>
//                   {sentimentData.map((e, i) => (
//                     <Cell key={i} fill={e.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </Card>
//       </div>

//       {/* Charts Row 2 */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
//         <Card className="p-4 md:p-6">
//           <h3 className="text-lg font-bold mb-4">Platform Performance</h3>
//           <div className="h-[250px] md:h-[300px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={platformChartData}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                 <XAxis dataKey="platform" fontSize={12} />
//                 <YAxis fontSize={12} />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="threads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Total Posts" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </Card>

//         <Card className="p-4 md:p-6">
//           <h3 className="text-lg font-bold mb-4">Intent Score Distribution</h3>
//           <div className="h-[250px] md:h-[300px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={intentBuckets}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                 <XAxis dataKey="range" fontSize={12} />
//                 <YAxis fontSize={12} />
//                 <Tooltip />
//                 <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Leads" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </Card>
//       </div>

//       {/* Recent High-Intent Leads */}
//       <Card className="p-4 md:p-6">
//         <h3 className="text-lg font-bold mb-4">Recent High-Intent Leads (≥70)</h3>
//         <div className="space-y-3">
//           {loading ? (
//              <div className="text-center py-4 text-muted-foreground">Loading leads...</div>
//           ) : leads.filter(l => l.intent >= 70).length === 0 ? (
//              <div className="text-center py-4 text-muted-foreground">No high intent leads found yet.</div>
//           ) : (
//              leads.filter(l => l.intent >= 70).slice(0, 3).map((a) => (
//               <div key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border hover:border-primary/50 transition-colors">
//                 <div className="flex items-center gap-3 w-full">
//                   <Badge variant="default" className="h-8 w-12 justify-center text-sm">{a.intent}</Badge>
//                   <div className="flex-1 min-w-0">
//                     <div className="font-semibold truncate">{a.user}</div>
//                     <div className="text-xs text-muted-foreground flex items-center gap-2">
//                       <span className="capitalize">{a.platform}</span>
//                       <span>•</span>
//                       <span>{new Date(a.timestamp).toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <Button 
//                     size="sm" 
//                     variant="secondary" 
//                     className="w-full sm:w-auto ml-auto"
//                     onClick={() => navigate("/monitor-stream")}
//                 >
//                   Engage
//                 </Button>
//               </div>
//             ))
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default DashboardOverview;
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
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/* ================= TYPES ================= */
type RealLead = {
  id: string;
  platform: string;
  user: string;
  intent: number;
  sentiment: string;
  timestamp: string;
  replyStatus: string;
};

// TARGETING PORT 5000
const API_BASE = "http://localhost:5000/api/lead-discovery";

const DashboardOverview = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const [leads, setLeads] = useState<RealLead[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH LIVE DATA ================= */
  const fetchData = useCallback(async () => {
    if (!isLoaded || !user?.id) return;

    try {
      setLoading(true);
      const userId = user.id;

      // Safe fetch
      const [redditRes, quoraRes] = await Promise.allSettled([
        fetch(`${API_BASE}/reddit/posts?userId=${encodeURIComponent(userId)}`),
        fetch(`${API_BASE}/quora/posts?userId=${encodeURIComponent(userId)}`),
      ]);

      let combined: any[] = [];
      if (redditRes.status === "fulfilled" && redditRes.value.ok) {
          const d = await redditRes.value.json();
          if (d.posts) combined.push(...d.posts);
      }
      if (quoraRes.status === "fulfilled" && quoraRes.value.ok) {
          const d = await quoraRes.value.json();
          if (d.posts) combined.push(...d.posts);
      }

      const mapped: RealLead[] = combined.map((p: any) => ({
        id: String(p.id),
        platform: p.platform || "Unknown",
        user: p.author || "Unknown",
        intent: Number(p.intent ?? 50),
        sentiment: "Neutral",
        timestamp: p.createdAt || new Date().toISOString(),
        replyStatus: p.replyOption1 ? "Sent" : "New",
      }));

      // Sort newest
      mapped.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
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

  /* ================= METRICS ================= */
  const totalComments = leads.length;
  const highIntentCount = leads.filter((l) => l.intent >= 70).length;
  const sentReplies = leads.filter((l) => l.replyStatus === "Sent").length;
  const conversion = highIntentCount > 0 ? ((sentReplies / highIntentCount) * 100).toFixed(1) + "%" : "0%";

  /* ================= CHART DATA ================= */
  const platformData = Object.entries(leads.reduce((acc: any, cur) => {
      acc[cur.platform] = (acc[cur.platform] || 0) + 1;
      return acc;
  }, {})).map(([key, val]) => ({ platform: key, count: val }));

  const intentData = [
      { name: "Low", value: leads.filter(l => l.intent < 40).length, color: "#ef4444" },
      { name: "Med", value: leads.filter(l => l.intent >= 40 && l.intent < 70).length, color: "#fbbf24" },
      { name: "High", value: leads.filter(l => l.intent >= 70).length, color: "#10b981" },
  ];

  const exportPDF = async () => {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, w, h);
    pdf.save("dashboard.pdf");
  };

  const kpiData = [
    { icon: MessageSquare, label: "Total Comments", value: totalComments.toString() },
    { icon: AlertCircle, label: "High Intent", value: highIntentCount.toString() },
    { icon: ThumbsUp, label: "Replies Sent", value: sentReplies.toString() },
    { icon: TrendingUp, label: "Conversion", value: conversion },
  ];

  return (
    <div ref={dashboardRef} className="p-4 md:p-8 space-y-6 bg-black min-h-screen text-white font-sans selection:bg-[#FFD700] selection:text-black">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold">Dashboard <span className="text-[#FFD700]">Overview</span></h1>
            <p className="text-zinc-400">Live analytics</p>
        </div>
        <Button onClick={exportPDF} className="bg-[#FFD700] text-black font-bold hover:bg-[#FFD700]/90">
            <Download className="mr-2 h-4 w-4" /> Export PDF
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, i) => (
            <KPICard key={i} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h3 className="text-lg font-bold mb-4 text-white">Platform Distribution</h3>
            <div className="h-[250px] w-full">
                <ResponsiveContainer>
                    <BarChart data={platformData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                        <XAxis dataKey="platform" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{ backgroundColor: "#000", border: "1px solid #333" }} />
                        <Bar dataKey="count" fill="#FFD700" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>

        <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h3 className="text-lg font-bold mb-4 text-white">Intent Analysis</h3>
            <div className="h-[250px] w-full">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={intentData} dataKey="value" innerRadius={60} outerRadius={80} stroke="none">
                            {intentData.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#000", border: "1px solid #333" }} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;