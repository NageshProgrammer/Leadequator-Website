import { useEffect, useState, useRef } from "react";
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
  Loader2,
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
import CreditAlert from "@/components/creditalert";

// 👇 IMPORT THE HOOK
import { useCredits } from "@/context/CreditContext";

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

  // 👇 CONSUME CONTEXT TO GET LIVE CREDITS
  const { credits } = useCredits();

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

  /* ================= DERIVED DATA (KPIs) ================= */
  const totalLeads = leads.length;
  const highIntent = leads.filter((l) => l.intent >= 60).length;
  const repliesSent = leads.filter((l) => l.status === "Sent").length;
  const impressions = totalLeads * 3; // Simulated metric
  const engageRate = totalLeads > 0 ? ((highIntent / totalLeads) * 100).toFixed(1) : "0";

  const sentimentData = [
    { name: "Positive", value: highIntent, color: "#FACC15" }, 
    { name: "Neutral", value: Math.max(0, totalLeads - highIntent), color: "#4B5563" },
    { name: "Negative", value: 0, color: "#EF4444" },
  ];

  const platformStats = Object.values(
    leads.reduce<Record<string, { platform: string; threads: number; leads: number }>>((acc, l) => {
      if (!acc[l.platform]) acc[l.platform] = { platform: l.platform, threads: 0, leads: 0 };
      acc[l.platform].threads += 1;
      acc[l.platform].leads += l.intent >= 60 ? 1 : 0;
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
      const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("dashboard-overview.pdf");
    } catch (e) {
      console.error("Failed to export PDF", e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-yellow-400 mx-auto" />
          <p className="text-muted-foreground animate-pulse">Synchronizing live stream data...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="p-4 md:p-8 space-y-6 bg-background min-h-screen">
      
      {/* HEADER WITH CREDIT ALERT */}
      <div>
        {/* 👇 Pass credits prop if your component accepts it, or ensure component uses Context internally */}
        {/* If CreditAlert doesn't accept props yet, see NOTE below */}
        <CreditAlert />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">Real-time analytics and metrics</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={range} onValueChange={(v: any) => setRange(v)}>
            <SelectTrigger className="w-[120px] bg-card border-muted">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7d</SelectItem>
              <SelectItem value="30d">Last 30d</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
            onClick={exportPDF}
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Card className="p-4 md:p-6 bg-card border-muted">
          <h3 className="text-lg font-bold mb-4 text-white">Sentiment Analysis</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={sentimentData} 
                  dataKey="value" 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5}
                >
                  {sentimentData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-card border-muted">
          <h3 className="text-lg font-bold mb-4 text-white">Platform Performance</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis dataKey="platform" fontSize={12} tick={{fill: '#9ca3af'}} />
                <YAxis fontSize={12} tick={{fill: '#9ca3af'}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="threads" name="Total Posts" fill="#FACC15" radius={[4, 4, 0, 0]} />
                <Bar dataKey="leads" name="High Intent" fill="#4B5563" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* RECENT HIGH-INTENT LEADS */}
      <Card className="p-4 md:p-6 bg-card border-muted">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Recent High-Intent Leads</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate("/monitor-stream")} className="text-yellow-400">
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {leads
            .filter((l) => l.intent >= 60)
            .sort((a, b) => b.intent - a.intent)
            .slice(0, 5)
            .map((lead) => (
              <div 
                key={lead._id} 
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-muted bg-background/40 hover:border-yellow-400/50 transition-all"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-yellow-400 text-black font-bold px-2 py-1 rounded text-sm min-w-[35px] text-center">
                    {lead.intent}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate text-white">{lead.name}</div>
                    <div className="text-xs text-muted-foreground">
                      via {lead.platform} • {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/monitor-stream")}
                >
                  Engage
                </Button>
              </div>
            ))}
          {leads.filter(l => l.intent >= 80).length === 0 && (
            <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
              No high-intent leads detected yet. Run the scraper in Monitor Stream to start.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DashboardOverview;