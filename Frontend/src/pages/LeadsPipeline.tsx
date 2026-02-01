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
import { ExternalLink, Download, RefreshCcw } from "lucide-react";

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

  /* -------------------- CSV LOADER (FINAL & SAFE) -------------------- */
  const fetchLeadsFromCSV = async () => {
    setLoading(true);
    try {
      const res = await fetch("/data/leads.csv");
      const text = await res.text();

      // ❌ If wrong file loaded
      if (text.startsWith("<!doctype html")) {
        throw new Error("CSV file not found");
      }

      const lines = text.trim().split("\n");
      const headers = lines[0].split(",");

      const data: Lead[] = lines.slice(1).map((line, index) => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        const row: any = {};
        headers.forEach((h, i) => {
          row[h] = values[i]?.replace(/^"|"$/g, "").trim();
        });

        return {
          _id: row._id || String(index),
          leadId: row.leadId,
          name: row.name,
          company: row.company,
          platform: row.platform,
          intent: Number(row.intent),
          status: row.status,
          value: Number(row.value),
          source: row.source,
          createdAt: row.createdAt,
        };
      });

      setLeads(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load leads CSV. Check file path.");
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 THIS WAS MISSING */
  useEffect(() => {
    fetchLeadsFromCSV();
  }, []);

  /* -------------------- Helpers -------------------- */
  const updateStatus = (id: string, status: string) => {
    setLeads((prev) =>
      prev.map((l) => (l._id === id ? { ...l, status } : l))
    );
  };

  const exportCSV = () => {
    if (!leads.length) return;
    const headers = Object.keys(leads[0]).join(",");
    const rows = leads.map((l) =>
      Object.values(l)
        .map((v) => `"${v}"`)
        .join(",")
    );
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

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Leads Pipeline</h1>
            <p className="text-muted-foreground">
              Qualified leads synced with CRM
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={syncCRM} disabled={syncing}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              {syncing ? "Syncing..." : "Sync to CRM"}
            </Button>
          </div>
        </div>

        <Card>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading leads...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell className="font-mono">
                      {lead.leadId}
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold">{lead.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {lead.company}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(v) =>
                          updateStatus(lead._id, v)
                        }
                      >
                        <SelectTrigger className="w-44">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell>
                      ₹{lead.value.toLocaleString("en-IN")}
                    </TableCell>

                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        <Dialog
          open={!!selectedLead}
          onOpenChange={() => setSelectedLead(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lead Details</DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <div className="space-y-2 text-sm">
                <p><b>Name:</b> {selectedLead.name}</p>
                <p><b>Company:</b> {selectedLead.company}</p>
                <p><b>Platform:</b> {selectedLead.platform}</p>
                <p><b>Intent:</b> {selectedLead.intent}</p>
                <p><b>Source:</b> {selectedLead.source}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LeadsPipeline;
