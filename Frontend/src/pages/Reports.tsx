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
import { Download, Mail, FileText, Calendar, Clock, Loader2 } from "lucide-react";

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

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Reports & Exports</h1>
          <p className="text-sm text-muted-foreground">Generate data extracts backed by Leadequator analytics</p>
        </div>
        <Button className="w-full sm:w-auto bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-bold">
          <FileText className="mr-2 h-4 w-4" />
          New Custom Report
        </Button>
      </div>

      {/* Quick Export Form */}
      <Card className="p-4 md:p-6 bg-card border-border">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Quick CSV Export</h3>
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="w-full md:flex-1">
            <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Date Range</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:flex-1">
            <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Data Type</label>
            <Select value={dataType} onValueChange={(v) => setDataType(v as DataType)}>
              <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="leads">Leads / Prospects</SelectItem>
                <SelectItem value="comments">Raw Posts / Comments</SelectItem>
                <SelectItem value="replies">AI Generated Replies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:flex-1">
            <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Format</label>
            <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)} disabled>
              <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">Branded CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleQuickExport} 
            disabled={loading} 
            className="w-full md:w-auto h-11 bg-[#FFD700] text-black hover:bg-[#FFD700]/90 px-8"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {loading ? "Exporting..." : "Export Data"}
          </Button>
        </div>
      </Card>

      {/* Scheduled Reports List */}
      <Card className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Scheduled Reports</h3>
        <div className="space-y-3 md:space-y-4">
          {scheduledReports.map((r, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl bg-background/50 gap-4">
              <div className="min-w-0">
                <div className="flex gap-2 items-center mb-1">
                  <h4 className="font-semibold text-sm md:text-base truncate">{r.name}</h4>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px]">Active</Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] md:text-sm text-muted-foreground">
                  <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {r.frequency}</span>
                  <span className="flex items-center"><Mail className="h-3 w-3 mr-1" /> {r.recipients}</span>
                </div>
              </div>
              <Button size="sm" variant="secondary" className="w-full sm:w-auto text-xs h-9">
                Send Now
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Exportable Reports Grid */}
      <div className="space-y-4">
        <h3 className="text-lg md:text-xl font-bold">Library</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportableReports.map((r, i) => (
            <Card key={i} className="p-4 flex flex-col justify-between hover:border-[#FFD700]/30 transition-colors">
              <div>
                <h4 className="font-semibold text-sm md:text-base">{r.name}</h4>
                <p className="text-xs md:text-sm text-muted-foreground mb-4">{r.description}</p>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tight">{r.format}</Badge>
                <Button size="sm" variant="ghost" className="text-[#FFD700] hover:text-[#FFD700] hover:bg-[#FFD700]/10" onClick={handleQuickExport}>
                  <Download className="mr-2 h-3 w-3" />
                  Export
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;