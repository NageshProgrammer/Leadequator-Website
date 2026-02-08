import { useState } from "react";
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
import { Download, Mail, FileText, Calendar, Clock } from "lucide-react";

/* ================= TYPES ================= */
type DataType = "comments" | "leads" | "replies" | "clicks";
type ExportFormat = "csv" | "json" | "excel" | "pdf";

const Reports = () => {
  const [dateRange, setDateRange] = useState("7d");
  const [dataType, setDataType] = useState<DataType>("comments");
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [loading, setLoading] = useState(false);

  const scheduledReports = [
    { name: "Weekly Performance Summary", frequency: "Mondays, 9:00 AM", recipients: "team@acme.com", lastSent: "2d ago", status: "Active" },
    { name: "Monthly Executive Dashboard", frequency: "1st of month", recipients: "execs@acme.com", lastSent: "15d ago", status: "Active" },
    { name: "Daily High-Intent Digest", frequency: "Daily, 8:00 AM", recipients: "sales@acme.com", lastSent: "12h ago", status: "Active" },
  ];

  const exportableReports = [
    { name: "Comment Export (All)", description: "Full dataset with timestamps, intent, and sentiment.", format: "CSV / JSON" },
    { name: "Lead Tracking Report", description: "Leads with click attribution and CRM status.", format: "CSV / Excel" },
    { name: "Template Performance", description: "Auto-reply templates with CTR metrics.", format: "CSV" },
    { name: "Platform Breakdown", description: "Volume metrics by social platform.", format: "PDF / CSV" },
  ];

  const downloadFile = (content: string, fileName: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateContent = (type: DataType, range: string, format: ExportFormat) => {
    const payload = { type, range, generatedAt: new Date().toISOString() };
    if (format === "json") return JSON.stringify(payload, null, 2);
    return `type,range,generatedAt\n${type},${range},${payload.generatedAt}`;
  };

  const handleQuickExport = async () => {
    setLoading(true);
    const content = generateContent(dataType, dateRange, format);
    downloadFile(content, `${dataType}-${dateRange}.${format}`, format === "json" ? "application/json" : "text/csv");
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Reports & Exports</h1>
          <p className="text-sm text-muted-foreground">Custom data generation and automation</p>
        </div>
        <Button className="w-full sm:w-auto bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-bold">
          <FileText className="mr-2 h-4 w-4" />
          New Custom Report
        </Button>
      </div>

      {/* Quick Export Form */}
      <Card className="p-4 md:p-6 bg-card border-border">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Quick Export</h3>
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
                <SelectItem value="comments">Comments</SelectItem>
                <SelectItem value="leads">Leads</SelectItem>
                <SelectItem value="replies">Auto Replies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:flex-1">
            <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Format</label>
            <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleQuickExport} 
            disabled={loading} 
            className="w-full md:w-auto h-11 bg-[#FFD700] text-black hover:bg-[#FFD700]/90 px-8"
          >
            <Download className="mr-2 h-4 w-4" />
            {loading ? "Exporting..." : "Export"}
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
                <Button size="sm" variant="ghost" className="text-[#FFD700] hover:text-[#FFD700] hover:bg-[#FFD700]/10">
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