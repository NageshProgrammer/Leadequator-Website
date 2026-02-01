import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { predictIntent } from "@/lib/api";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Mail, FileText, Calendar } from "lucide-react";

/* ================= TYPES ================= */

type DataType = "comments" | "leads" | "replies" | "clicks";
type ExportFormat = "csv" | "json" | "excel" | "pdf";

/* ================= COMPONENT ================= */
const handleTestAI = async () => {
  const result = await predictIntent({
    text: "Is this AI book good for beginners?",
    platform: "LinkedIn",
    client_id: "demo-client",
  });

  console.log(result);
};
const Reports = () => {
  /* ---------- Quick Export State ---------- */
  const [dateRange, setDateRange] = useState("7d");
  const [dataType, setDataType] = useState<DataType>("comments");
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [loading, setLoading] = useState(false);

  /* ---------- Static Data (UI) ---------- */

  const scheduledReports = [
    {
      name: "Weekly Performance Summary",
      frequency: "Every Monday, 9:00 AM",
      recipients: "team@acmecorp.com",
      lastSent: "2 days ago",
      status: "Active",
    },
    {
      name: "Monthly Executive Dashboard",
      frequency: "1st of each month",
      recipients: "executives@acmecorp.com",
      lastSent: "15 days ago",
      status: "Active",
    },
    {
      name: "Daily High-Intent Digest",
      frequency: "Daily, 8:00 AM",
      recipients: "sales@acmecorp.com",
      lastSent: "12 hours ago",
      status: "Active",
    },
  ];

  const exportableReports = [
    {
      name: "Comment Export (All Fields)",
      description: "Full dataset with timestamps, intent, sentiment, replies",
      format: "CSV / JSON",
    },
    {
      name: "Lead Tracking Report",
      description: "Leads with click attribution and CRM sync status",
      format: "CSV / Excel",
    },
    {
      name: "Template Performance",
      description: "Auto-reply templates with CTR and conversions",
      format: "CSV",
    },
    {
      name: "Platform Breakdown",
      description: "Comments, replies, and leads by platform",
      format: "PDF / CSV",
    },
  ];

  /* ================= HELPERS ================= */

  const downloadFile = (content: string, fileName: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateContent = (
    type: DataType,
    range: string,
    format: ExportFormat
  ) => {
    const payload = {
      type,
      range,
      generatedAt: new Date().toISOString(),
    };

    if (format === "json") return JSON.stringify(payload, null, 2);
    if (format === "csv")
      return `type,range,generatedAt\n${type},${range},${payload.generatedAt}`;

    return `Report Type: ${type}\nDate Range: ${range}\nGenerated At: ${payload.generatedAt}`;
  };

  /* ================= ACTIONS ================= */

  const handleQuickExport = async () => {
    setLoading(true);

    const content = generateContent(dataType, dateRange, format);
    downloadFile(
      content,
      `${dataType}-${dateRange}.${format}`,
      format === "json" ? "application/json" : "text/plain"
    );

    setLoading(false);
  };

  const exportReport = (name: string) => {
    const content = generateContent("leads", "all", "csv");
    downloadFile(
      content,
      `${name.replace(/\s+/g, "_")}.csv`,
      "text/csv"
    );
  };

  /* ================= UI ================= */

  return (
    <div className="p-8 space-y-8 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports & Exports</h1>
          <p className="text-muted-foreground">
            Generate custom reports and schedule automated summaries
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <FileText className="mr-2 h-4 w-4" />
          Create Custom Report
        </Button>
      </div>

      {/* Quick Export */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6">Quick Export</h3>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Data Type</label>
            <Select
              value={dataType}
              onValueChange={(v) => setDataType(v as DataType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comments">Comments</SelectItem>
                <SelectItem value="leads">Leads</SelectItem>
                <SelectItem value="replies">Auto Replies</SelectItem>
                <SelectItem value="clicks">Link Clicks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Format</label>
            <Select
              value={format}
              onValueChange={(v) => setFormat(v as ExportFormat)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleQuickExport} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            {loading ? "Exporting..." : "Export"}
          </Button>
        </div>
      </Card>

      {/* Scheduled Reports */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6">Scheduled Reports</h3>
        <div className="space-y-4">
          {scheduledReports.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <div className="flex gap-2 items-center mb-1">
                  <h4 className="font-semibold">{r.name}</h4>
                  <Badge className="bg-green-500">{r.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  {r.frequency} · <Mail className="inline h-3 w-3 mr-1" />
                  {r.recipients}
                </p>
              </div>
              <Button size="sm" onClick={() => exportReport(r.name)}>
                Send Now
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Exportable Reports */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6">Exportable Reports</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {exportableReports.map((r, i) => (
            <Card key={i} className="p-4">
              <h4 className="font-semibold">{r.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {r.description}
              </p>
              <div className="flex justify-between">
                <Badge variant="outline">{r.format}</Badge>
                <Button size="sm" onClick={() => exportReport(r.name)}>
                  <Download className="mr-2 h-3 w-3" />
                  Export
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Reports;
