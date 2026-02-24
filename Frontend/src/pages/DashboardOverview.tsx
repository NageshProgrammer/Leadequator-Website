import { useEffect, useState, useRef, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card } from "@/components/ui/card";
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

// 👇 Import the Smart Alert Component
import CreditAlert from "@/components/creditalert";
import Loader from "@/[components]/loader";

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

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const [range, setRange] = useState<"24h" | "7d" | "30d" | "custom">("7d");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH REAL-TIME DATA ================= */
  useEffect(() => {
    const fetchLiveLeads = async () => {
      if (!isLoaded || !user?.id) return;

      try {
        setLoading(true);
        const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/lead-discovery`;

        // Fetch independently
        const [redditRes, quoraRes] = await Promise.all([
          fetch(`${API_BASE}/reddit/posts?userId=${encodeURIComponent(user.id)}`),
          fetch(`${API_BASE}/quora/posts?userId=${encodeURIComponent(user.id)}`),
        ]);

        const redditData = await redditRes.json();
        const quoraData = await quoraRes.json();

        const combined = [
          ...(redditData.posts || []),
          ...(quoraData.posts || []),
        ];

        // Map data using the exact same logic as MonitorStream
        const mapped: Lead[] = combined.map((p: any, idx: number) => {
          const intent = 50 + (idx % 40); 
          return {
            _id: String(p.id),
            name: p.author ?? "Unknown",
            platform: p.platform || (p.question ? "Quora" : "Reddit"),
            intent: intent,
            status: p.replyStatus || "Not Sent",
            value: 0,
            createdAt: p.createdAt || new Date().toISOString(),
          };
        });

        setLeads(mapped);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveLeads();
  }, [isLoaded, user?.id]);

  /* ================= DATE FILTERING LOGIC ================= */
  const filteredLeads = useMemo(() => {
    const now = new Date();
    return leads.filter((lead) => {
      const leadDate = new Date(lead.createdAt);
      const diffHours = (now.getTime() - leadDate.getTime()) / (1000 * 60 * 60);

      if (range === "24h") return diffHours <= 24;
      if (range === "7d") return diffHours <= 24 * 7;
      if (range === "30d") return diffHours <= 24 * 30;
      return true; // Fallback
    });
  }, [leads, range]);

  /* ================= DERIVED DATA (KPIs) ================= */
  // Use filteredLeads instead of leads for all metric calculations
  const totalLeads = filteredLeads.length;
  
  const highIntent = filteredLeads.filter((l) => l.intent >= 80).length;
  const neutralIntent = filteredLeads.filter((l) => l.intent >= 60 && l.intent < 80).length;
  const negativeIntent = filteredLeads.filter((l) => l.intent < 60).length;
  
  const repliesSent = filteredLeads.filter((l) => l.status === "Sent").length;
  const impressions = totalLeads * 3; // Simulated metric
  const engageRate = totalLeads > 0 ? ((highIntent / totalLeads) * 100).toFixed(1) : "0";

  const sentimentData = [
    { name: "Positive", value: highIntent, color: "#fbbf24" }, 
    { name: "Neutral", value: neutralIntent, color: "#52525b" },
    { name: "Negative", value: negativeIntent, color: "#ef4444" },
  ];

  const platformStats = Object.values(
    filteredLeads.reduce<Record<string, { platform: string; threads: number; leads: number }>>((acc, l) => {
      if (!acc[l.platform]) acc[l.platform] = { platform: l.platform, threads: 0, leads: 0 };
      acc[l.platform].threads += 1;
      acc[l.platform].leads += l.intent >= 80 ? 1 : 0;
      return acc;
    }, {})
  );

  const kpiData = [
    { icon: MessageSquare, label: "TOTAL POST", value: totalLeads.toString() },
    { icon: AlertCircle, label: "HIGH-INTENT (60)", value: highIntent.toString() },
    { icon: ThumbsUp, label: "REPLY SENT", value: repliesSent.toString() },
    { icon: Users, label: "IMPRESSIONS", value: impressions.toString() },
    { icon: TrendingUp, label: "ENGAGE→LEAD %", value: `${engageRate}%` },
    { icon: Activity, label: "AVG REPLY TIME", value: "—" },
  ];

  /* ================= EXPORT FUNCTIONS ================= */
  const exportPDF = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, { scale: 2, backgroundColor: "#09090b" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`dashboard-overview-${range}.pdf`);
    } catch (e) {
      console.error("Failed to export PDF", e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center bg-black/10">
        <div className="text-center space-y-4">
          <Loader/>
          <p className="text-[#fbbf24] font-medium tracking-widest uppercase text-xs animate-pulse">Synchronizing live stream data...</p>
        </div>
      </div>
    );
  }

  const glassCardStyle = "bg-[#050505]/20 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem] p-6 md:p-8";

  return (
    <div ref={dashboardRef} className="p-4 md:p-8 space-y-8 bg-black/10 text-white min-h-screen relative z-10 selection:bg-[#fbbf24]/30 rounded-3xl">
      
      {/* HEADER WITH SMART CREDIT ALERT */}
      <div>
        <CreditAlert />
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm md:text-base text-zinc-400 font-medium">Real-time analytics and metric synchronization</p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Select value={range} onValueChange={(v: any) => setRange(v)}>
            <SelectTrigger className="w-[140px] bg-white/[0.03] border-white/[0.08] text-white rounded-xl h-11 focus:ring-[#fbbf24]/30 focus:border-[#fbbf24]/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950/70 border-white/[0.1] text-white rounded-xl">
              <SelectItem value="24h" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Last 24h</SelectItem>
              <SelectItem value="7d" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Last 7d</SelectItem>
              <SelectItem value="30d" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Last 30d</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            className="bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-bold rounded-xl h-11 px-6 shadow-[0_0_15px_rgba(251,191,36,0.15)] hover:shadow-[0_0_25px_rgba(251,191,36,0.3)] transition-all"
            onClick={exportPDF}
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <Card className={glassCardStyle}>
          <h3 className="text-xl font-bold mb-6 text-white tracking-wide">Sentiment Analysis</h3>
          <div className="h-[300px] w-full ">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={sentimentData} 
                  dataKey="value" 
                  innerRadius={80} 
                  outerRadius={100} 
                  paddingAngle={5}
                  stroke="none"
                >
                  {sentimentData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={glassCardStyle}>
          <h3 className="text-xl font-bold mb-6 text-white tracking-wide">Platform Performance</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="platform" fontSize={12} tick={{fill: '#a1a1aa'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis fontSize={12} tick={{fill: '#a1a1aa'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="threads" name="Total Posts" fill="#3f3f46" radius={[6, 6, 0, 0]} barSize={30} />
                <Bar dataKey="leads" name="High Intent" fill="#fbbf24" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* RECENT HIGH-INTENT LEADS */}
      <Card className={`${glassCardStyle} animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300`}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-white tracking-wide">Recent High-Intent Leads</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/monitor-stream")} 
            className="text-[#fbbf24] hover:text-[#fbbf24]/80 hover:bg-[#fbbf24]/10 rounded-xl px-4"
          >
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {filteredLeads
            .filter((l) => l.intent >= 60)
            .sort((a, b) => b.intent - a.intent)
            .slice(0, 5)
            .map((lead) => (
              <div 
                key={lead._id} 
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-[1.25rem] border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] hover:border-[#fbbf24]/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-5 flex-1">
                  {/* Intent Score Badge */}
                  <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/20 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.2)] text-[#fbbf24] font-black px-3 py-2 rounded-xl text-base min-w-[45px] text-center group-hover:scale-105 transition-transform">
                    {lead.intent}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold truncate text-zinc-100 text-lg group-hover:text-white transition-colors">{lead.name}</div>
                    <div className="text-sm text-zinc-500 font-medium mt-1">
                      via <span className="text-zinc-300">{lead.platform}</span> • {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full sm:w-auto bg-white/[0.05] text-white hover:bg-[#fbbf24] hover:text-black border border-white/[0.1] hover:border-[#fbbf24] font-bold rounded-xl h-11 px-6 shadow-sm transition-all"
                  onClick={() => navigate("/monitor-stream")}
                >
                  Engage
                </Button>
              </div>
            ))}

          {filteredLeads.filter(l => l.intent >= 60).length === 0 && (
            <div className="text-center py-12 text-zinc-500 border border-dashed border-white/[0.1] rounded-[1.5rem] bg-white/[0.01] font-medium">
              No high-intent leads detected in this timeframe. Adjust your filter or run the scraper in Monitor Stream.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DashboardOverview;