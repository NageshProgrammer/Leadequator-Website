import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Mail, FileText, Calendar, Clock, Loader2, BarChart4, Send } from "lucide-react";

/* ================= TYPES ================= */
type DataType = "comments" | "leads" | "replies";
type ExportFormat = "csv"; // Restricted to CSV for the branded export

const Reports = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();

  const [dateRange, setDateRange] = useState("7d");
  const [dataType, setDataType] = useState<DataType>("leads");
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [loading, setLoading] = useState(false);

  const scheduledReports = [
    { name: "Weekly Performance Summary", frequency: "Mondays, 9:00 AM", recipients: "team@leadequator.com", lastSent: "2d ago", status: "Active" },
    { name: "Monthly Executive Dashboard", frequency: "1st of month", recipients: "execs@leadequator.com", lastSent: "15d ago", status: "Active" },
    { name: "Daily High-Intent Digest", frequency: "Daily, 8:00 AM", recipients: "sales@leadequator.com", lastSent: "12h ago", status: "Active" },
  ];

  const exportableReports = [
    { name: "Comment Export (All)", description: "Full dataset with timestamps, intent, and sentiment.", format: "CSV" },
    { name: "Lead Tracking Report", description: "Leads with click attribution and CRM status.", format: "CSV" },
    { name: "Template Performance", description: "Auto-reply templates with CTR metrics.", format: "CSV" },
    { name: "Platform Breakdown", description: "Volume metrics by social platform.", format: "CSV" },
  ];

  // Helper to trigger file download
  const downloadFile = (content: string, fileName: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to safely escape CSV values
  const escapeCSV = (value: any) => {
    if (value === null || value === undefined) return '""';
    const stringValue = String(value);
    // Escape quotes and wrap in quotes
    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  /* ================= FETCH & EXPORT DATA ================= */
  const handleQuickExport = async () => {
    if (!isLoaded || !user?.id) {
      toast({ title: "Error", description: "User not authenticated.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/lead-discovery`;

      // Fetch from both sources
      const [redditRes, quoraRes] = await Promise.all([
        fetch(`${API_BASE}/reddit/posts?userId=${encodeURIComponent(user.id)}`),
        fetch(`${API_BASE}/quora/posts?userId=${encodeURIComponent(user.id)}`),
      ]);

      if (!redditRes.ok || !quoraRes.ok) throw new Error("Failed to fetch data from database.");

      const redditData = await redditRes.json();
      const quoraData = await quoraRes.json();
      const combined = [...(redditData.posts || []), ...(quoraData.posts || [])];

      // 1. Filter by Date Range
      const now = new Date().getTime();
      let timeLimit = now;
      if (dateRange === "24h") timeLimit = now - 24 * 60 * 60 * 1000;
      else if (dateRange === "7d") timeLimit = now - 7 * 24 * 60 * 60 * 1000;
      else if (dateRange === "30d") timeLimit = now - 30 * 24 * 60 * 60 * 1000;

      const filteredData = combined.filter((item: any) => {
        const itemDate = new Date(item.createdAt || now).getTime();
        return itemDate >= timeLimit;
      });

      if (filteredData.length === 0) {
        toast({ title: "No Data", description: `No records found for the last ${dateRange}.` });
        setLoading(false);
        return;
      }

      // 2. Build the CSV Header / Leadequator Watermark
      const brandingHeader = [
        `"======================================================"`,
        `"             LEADEQUATOR - DATA REPORT                "`,
        `"======================================================"`,
        `"Report Type:","${dataType.toUpperCase()}"`,
        `"Date Range:","Last ${dateRange}"`,
        `"Generated At:","${new Date().toLocaleString()}"`,
        `"Total Records:","${filteredData.length}"`,
        `""` // Empty line before actual headers
      ];

      // 3. Format rows based on data type
      let csvHeaders: string[] = [];
      let csvRows: string[] = [];

      filteredData.forEach((item: any, idx: number) => {
        const platform = item.platform || (item.question ? "Quora" : "Reddit");
        const author = item.author || item.userId || "Unknown";
        const content = item.text || item.question || item.content || "";
        const date = item.createdAt ? new Date(item.createdAt).toLocaleString() : "—";
        const url = item.url || "";
        
        // Synthetic intent for demonstration, matching pipeline logic
        const intent = 50 + (idx % 40); 

        if (dataType === "leads") {
          if (idx === 0) csvHeaders = ["Lead ID", "Platform", "Author", "Intent Score", "Status", "Content snippet", "URL", "Date Found"];
          const snippet = content.length > 50 ? content.substring(0, 50) + "..." : content;
          const status = item.replyStatus === "Sent" ? "Contacted" : "New";
          
          csvRows.push([
            escapeCSV(`LD-${1000 + idx}`),
            escapeCSV(platform),
            escapeCSV(author),
            escapeCSV(`${intent}%`),
            escapeCSV(status),
            escapeCSV(snippet),
            escapeCSV(url),
            escapeCSV(date)
          ].join(","));
        } 
        else if (dataType === "comments") {
          if (idx === 0) csvHeaders = ["Platform", "Author", "Full Content", "URL", "Date Found"];
          csvRows.push([
            escapeCSV(platform),
            escapeCSV(author),
            escapeCSV(content),
            escapeCSV(url),
            escapeCSV(date)
          ].join(","));
        }
        else if (dataType === "replies") {
          if (idx === 0) csvHeaders = ["Platform", "Original Post", "Reply Option 1", "Reply Option 2", "Approval Status", "Date"];
          const reply1 = item.replyOption1 || item.replies?.[0] || "No AI reply generated";
          const reply2 = item.replyOption2 || item.replies?.[1] || "";
          const approved = item.replyStatus === "Sent" ? "Yes" : "No";

          csvRows.push([
            escapeCSV(platform),
            escapeCSV(content),
            escapeCSV(reply1),
            escapeCSV(reply2),
            escapeCSV(approved),
            escapeCSV(date)
          ].join(","));
        }
      });

      // Assemble final CSV
      const finalCSV = [
        ...brandingHeader,
        csvHeaders.map(escapeCSV).join(","), // Column headers
        ...csvRows // Data
      ].join("\n");

      // Download
      downloadFile(finalCSV, `Leadequator_${dataType}_${dateRange}.csv`, "text/csv");
      toast({ title: "Success", description: "Report exported successfully." });

    } catch (err: any) {
      console.error("Export Error:", err);
      toast({ title: "Export Failed", description: err.message || "Could not generate report.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI REUSABLES ================= */
  const glassPanelStyle = "bg-[#050505]/30 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem] p-6 md:p-8";
  const filterLabelStyle = "text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-3 block";
  const selectTriggerStyle = "w-full bg-white/[0.02] border-white/[0.08] text-white focus:ring-[#fbbf24]/30 rounded-xl h-12";
  const selectContentStyle = "bg-zinc-950 border-white/[0.1] text-white rounded-xl shadow-2xl";
  const selectItemStyle = "focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer py-2.5";

  return (
    <div className="min-h-[90vh] pt-4 pb-12 bg-black/10 rounded-3xl text-white selection:bg-[#fbbf24]/30 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-[#fbbf24]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-[1200px] space-y-8 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
              Reports & <span className="text-[#fbbf24] drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">Exports</span>
            </h1>
            <p className="text-zinc-400 font-medium text-sm md:text-base">
              Generate and schedule data extracts backed by Leadequator analytics.
            </p>
          </div>
          <Button className="w-full md:w-auto bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-bold rounded-xl h-12 px-6 shadow-[0_0_15px_rgba(251,191,36,0.15)] transition-all">
            <FileText className="mr-2 h-4 w-4" />
            New Custom Report
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* QUICK EXPORT FORM (Left Side) */}
          <div className="lg:col-span-5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <Card className={`${glassPanelStyle} flex flex-col h-full`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-[#fbbf24]/10 border border-[#fbbf24]/20 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.2)]">
                  <Download className="h-5 w-5 text-[#fbbf24]" />
                </div>
                <h3 className="text-xl font-bold tracking-wide">Quick CSV Export</h3>
              </div>

              <div className="space-y-6 flex-grow">
                <div>
                  <label className={filterLabelStyle}>Date Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className={selectTriggerStyle}><SelectValue /></SelectTrigger>
                    <SelectContent className={selectContentStyle}>
                      <SelectItem value="24h" className={selectItemStyle}>Last 24 hours</SelectItem>
                      <SelectItem value="7d" className={selectItemStyle}>Last 7 days</SelectItem>
                      <SelectItem value="30d" className={selectItemStyle}>Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={filterLabelStyle}>Data Type</label>
                  <Select value={dataType} onValueChange={(v) => setDataType(v as DataType)}>
                    <SelectTrigger className={selectTriggerStyle}><SelectValue /></SelectTrigger>
                    <SelectContent className={selectContentStyle}>
                      <SelectItem value="leads" className={selectItemStyle}>Leads / Prospects</SelectItem>
                      <SelectItem value="comments" className={selectItemStyle}>Raw Posts / Comments</SelectItem>
                      <SelectItem value="replies" className={selectItemStyle}>AI Generated Replies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={filterLabelStyle}>Format</label>
                  <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)} disabled>
                    <SelectTrigger className={`${selectTriggerStyle} opacity-70 cursor-not-allowed`}><SelectValue /></SelectTrigger>
                    <SelectContent className={selectContentStyle}>
                      <SelectItem value="csv" className={selectItemStyle}>Branded CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-8 mt-4 border-t border-white/[0.08]">
                <Button 
                  onClick={handleQuickExport} 
                  disabled={loading} 
                  className="w-full h-14 bg-white/[0.05] border border-white/[0.1] text-white hover:bg-[#fbbf24] hover:text-black hover:border-[#fbbf24] font-bold rounded-xl transition-all shadow-sm group"
                >
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5 text-zinc-400 group-hover:text-black transition-colors" />}
                  {loading ? "Exporting Data..." : "Export Data Now"}
                </Button>
              </div>
            </Card>
          </div>

          {/* SCHEDULED REPORTS LIST (Right Side) */}
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <Card className={`${glassPanelStyle} flex flex-col h-full`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] shadow-inner">
                  <BarChart4 className="h-5 w-5 text-zinc-300" />
                </div>
                <h3 className="text-xl font-bold tracking-wide">Scheduled Reports</h3>
              </div>

              <div className="space-y-4">
                {scheduledReports.map((r, i) => (
                  <div 
                    key={i} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-[1.5rem] border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.1] transition-all gap-5 group"
                  >
                    <div className="min-w-0">
                      <div className="flex gap-3 items-center mb-2">
                        <h4 className="font-bold text-base text-zinc-100 truncate tracking-wide">{r.name}</h4>
                        <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] tracking-widest uppercase shadow-none px-2 py-0">
                          {r.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-400 font-medium">
                        <span className="flex items-center bg-black/40 px-2.5 py-1 rounded-md border border-white/[0.03]">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-zinc-500" /> 
                          {r.frequency}
                        </span>
                        <span className="flex items-center bg-black/40 px-2.5 py-1 rounded-md border border-white/[0.03]">
                          <Mail className="h-3.5 w-3.5 mr-1.5 text-zinc-500" /> 
                          {r.recipients}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="w-full sm:w-auto text-xs h-10 px-5 bg-white/[0.05] border border-white/[0.1] text-zinc-300 hover:text-white hover:bg-white/[0.1] rounded-xl font-bold transition-all"
                    >
                      <Send className="h-3 w-3 mr-2 text-zinc-500 group-hover:text-white transition-colors" />
                      Send Now
                    </Button>
                  </div>
                ))}
              </div>

              {/* Styled Exportable Reports Grid (Commented Out but styled properly) */}
              {/* <div className="mt-10 pt-8 border-t border-white/[0.08]">
                <h3 className="text-sm font-extrabold text-zinc-500 uppercase tracking-widest mb-6">Report Library</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exportableReports.map((r, i) => (
                    <div key={i} className="p-5 flex flex-col justify-between bg-white/[0.02] border border-white/[0.05] rounded-[1.5rem] hover:border-[#fbbf24]/30 hover:bg-white/[0.04] transition-colors group">
                      <div>
                        <h4 className="font-bold text-sm text-zinc-200 mb-1">{r.name}</h4>
                        <p className="text-xs text-zinc-500 mb-5 leading-relaxed">{r.description}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tight bg-black/50 border-white/[0.1] text-zinc-400">{r.format}</Badge>
                        <Button size="sm" variant="ghost" className="text-[#fbbf24] hover:text-[#fbbf24] hover:bg-[#fbbf24]/10 h-8 text-xs rounded-lg px-3 opacity-0 group-hover:opacity-100 transition-all" onClick={handleQuickExport}>
                          <Download className="mr-2 h-3.5 w-3.5" />
                          Export
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div> 
              */}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;