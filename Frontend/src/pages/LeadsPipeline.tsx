import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink, Download, RefreshCcw, Building2, User2, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* -------------------- Types -------------------- */
type Lead = {
  _id: string;
  leadId: string;
  name: string;
  company: string;
  platform: string;
  intent: number;
  status: string;
  value: number;
  source: string;
  createdAt: string;
};

const STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Demo Scheduled",
  "Negotiating",
  "Closed Won",
  "Closed Lost",
];

const LeadsPipeline = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchLeadsFromCSV = async () => {
    setLoading(true);
    try {
      const res = await fetch("/data/leads.csv");
      const text = await res.text();
      if (text.startsWith("<!doctype html")) throw new Error("CSV file not found");

      const lines = text.trim().split("\n");
      const headers = lines[0].split(",");

      const data: Lead[] = lines.slice(1).map((line, index) => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const row: any = {};
        headers.forEach((h, i) => {
          row[h.trim()] = values[i]?.replace(/^"|"$/g, "").trim();
        });

        return {
          _id: row._id || String(index),
          leadId: row.leadId || `L-${index}`,
          name: row.name || "Unknown",
          company: row.company || "Unknown Co",
          platform: row.platform || "Direct",
          intent: Number(row.intent) || 0,
          status: row.status || "New",
          value: Number(row.value) || 0,
          source: row.source || "Organic",
          createdAt: row.createdAt || new Date().toISOString(),
        };
      });
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadsFromCSV();
  }, []);

  const updateStatus = (id: string, status: string) => {
    setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
  };

  const exportCSV = () => {
    if (!leads.length) return;
    const headers = Object.keys(leads[0]).join(",");
    const rows = leads.map((l) => Object.values(l).map((v) => `"${v}"`).join(","));
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads-pipeline.csv";
    a.click();
  };

  const syncCRM = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSyncing(false);
    alert("CRM sync completed");
  };

  return (
    <div className="min-h-screen pt-10 md:pt-10 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Leads Pipeline</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Qualified leads synced with CRM
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <Button variant="secondary" onClick={exportCSV} className="flex-1 md:flex-none h-11">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={syncCRM} disabled={syncing} className="flex-1 md:flex-none h-11 bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
              <RefreshCcw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? "Syncing..." : "Sync CRM"}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center text-muted-foreground">Loading leads...</div>
        ) : (
          <>
            {/* MOBILE VIEW: Card List (Visible only on small screens) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {leads.map((lead) => (
                <Card key={lead._id} className="p-4 space-y-4 hover:border-[#FFD700]/50 transition-colors">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-mono text-[10px] text-muted-foreground">{lead.leadId}</span>
                    <Badge variant="outline" className="bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/20">
                      {lead.intent}% Intent
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-muted-foreground"><User2 className="w-3 h-3 mr-1" /> Contact</div>
                      <div className="font-bold text-sm">{lead.name}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-muted-foreground"><Building2 className="w-3 h-3 mr-1" /> Company</div>
                      <div className="font-bold text-sm truncate">{lead.company}</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs text-muted-foreground">Status & Valuation</div>
                    <div className="flex items-center justify-between gap-2">
                      <Select value={lead.status} onValueChange={(v) => updateStatus(lead._id, v)}>
                        <SelectTrigger className="h-9 w-[160px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="font-bold text-[#FFD700] flex items-center">
                        <IndianRupee className="w-3 h-3 mr-0.5" />
                        {lead.value.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setSelectedLead(lead)}>
                    <ExternalLink className="w-3 h-3 mr-2" /> View Full Details
                  </Button>
                </Card>
              ))}
            </div>

            {/* DESKTOP VIEW: Table (Hidden on small screens) */}
            <Card className="hidden md:block overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead._id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs">{lead.leadId}</TableCell>
                      <TableCell>
                        <div className="font-semibold">{lead.name}</div>
                        <div className="text-xs text-muted-foreground">{lead.company}</div>
                      </TableCell>
                      <TableCell>
                        <Select value={lead.status} onValueChange={(v) => updateStatus(lead._id, v)}>
                          <SelectTrigger className="w-40 h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{lead.value.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" onClick={() => setSelectedLead(lead)}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </>
        )}

        {/* Lead Details Dialog */}
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="max-w-[90%] sm:max-w-[425px] rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-[#FFD700]">Lead Details</DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold">Name</p>
                  <p className="text-sm font-semibold">{selectedLead.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold">ID</p>
                  <p className="text-sm font-mono">{selectedLead.leadId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold">Company</p>
                  <p className="text-sm font-semibold">{selectedLead.company}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold">Platform</p>
                  <p className="text-sm">{selectedLead.platform}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold">Intent Score</p>
                  <p className="text-sm font-bold text-[#FFD700]">{selectedLead.intent}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold">Source</p>
                  <p className="text-sm">{selectedLead.source}</p>
                </div>
                <div className="col-span-2 pt-4">
                   <Button className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
                     Open in CRM
                   </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LeadsPipeline;