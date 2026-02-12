import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
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
import { ExternalLink, Download, RefreshCcw, User2, Link as LinkIcon, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* -------------------- Types -------------------- */
type Lead = {
  _id: string;
  leadId: string;
  name: string;
  platform: string;
  intent: number;
  status: string;
  url: string; 
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
  const { user, isLoaded } = useUser();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  /* ================= FETCH LIVE DATA FROM MONITOR STREAM ================= */
  const fetchLiveLeads = useCallback(async () => {
    if (!isLoaded || !user?.id) return;
    
    setLoading(true);
    try {
      const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/lead-discovery`;
      
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

      const mapped: Lead[] = combined.map((p: any, idx: number) => ({
        _id: String(p.id),
        leadId: `LD-${idx + 100}`, 
        name: p.author ?? "Unknown User",
        platform: p.platform || (p.question ? "Quora" : "Reddit"),
        intent: 50 + (idx % 40),
        status: p.replyStatus === "Sent" ? "Contacted" : "New",
        url: p.url || "#",
        createdAt: p.createdAt || new Date().toISOString(),
      }));

      setLeads(mapped);
    } catch (err) {
      console.error("Pipeline Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user?.id]);

  useEffect(() => {
    fetchLiveLeads();
  }, [fetchLiveLeads]);

  const updateStatus = (id: string, status: string) => {
    setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
  };

  const exportCSV = () => {
    if (!leads.length) return;
    const headers = ["Lead ID", "User Name", "Platform", "Status", "Link"];
    const rows = leads.map((l) => [l.leadId, l.name, l.platform, l.status, l.url].map(v => `"${v}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads-pipeline.csv";
    a.click();
  };

  return (
    <div className="min-h-screen pt-10 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Leads <span className="text-[#FFD700]">Pipeline</span></h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Qualified leads managed from real-time social streams
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <Button variant="secondary" onClick={exportCSV} className="flex-1 md:flex-none h-11">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
                onClick={fetchLiveLeads} 
                disabled={loading} 
                className="flex-1 md:flex-none h-11 bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? "Syncing..." : "Refresh Pipeline"}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
             <Loader2 className="h-10 w-10 animate-spin text-[#FFD700]" />
             <p className="text-muted-foreground">Fetching leads from monitor stream...</p>
          </div>
        ) : (
          <Card className="overflow-hidden border-muted bg-card">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[120px]">Lead ID</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>User Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead._id} className="hover:bg-muted/30 transition-colors">
                    {/* 1. Lead ID */}
                    <TableCell className="font-mono text-xs text-[#FFD700]">
                      {lead.leadId}
                    </TableCell>

                    {/* 2. User Name */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <User2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="font-semibold">{lead.name}</div>
                      </div>
                    </TableCell>

                    {/* 3. User Link */}
                    <TableCell>
                      <a 
                        href={lead.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm"
                      >
                        <LinkIcon className="h-3 w-3 mr-1" />
                        View on {lead.platform}
                      </a>
                    </TableCell>

                    {/* 4. Status */}
                    <TableCell>
                      <Select value={lead.status} onValueChange={(v) => updateStatus(lead._id, v)}>
                        <SelectTrigger className="w-36 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* 5. Action */}
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="hover:text-[#FFD700]"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {leads.length === 0 && (
                <div className="p-10 text-center text-muted-foreground">
                    No leads found. Use "Monitor Stream" to discover new leads.
                </div>
            )}
          </Card>
        )}

        {/* Lead Details Dialog */}
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-[#FFD700]">Lead Details</DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Platform</p>
                    <Badge variant="outline">{selectedLead.platform}</Badge>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Intent Score</p>
                    <p className="text-sm font-bold text-[#FFD700]">{selectedLead.intent}%</p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Creation Date</p>
                  <p className="text-xs">{new Date(selectedLead.createdAt).toLocaleString()}</p>
                </div>
                <Button className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-bold">
                  Open in External CRM
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LeadsPipeline;