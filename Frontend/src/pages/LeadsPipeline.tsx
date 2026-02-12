import { useEffect, useState, useCallback, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  ExternalLink,
  Download,
  RefreshCcw,
  User2,
  Link as LinkIcon,
  Loader2,
  Search,
  Filter,
  Copy,
  CheckCircle2,
  MessageSquareQuote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast"; // Assuming you have this hook

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
  postTitle: string;
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
  const { toast } = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  /* ================= FETCH DATA ================= */
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
        leadId: `LD-${1000 + idx}`,
        name: p.author ?? p.userId ?? "Unknown User",
        platform: p.platform || (p.question ? "Quora" : "Reddit"),
        intent: 50 + (idx % 40),
        status: p.replyStatus === "Sent" ? "Contacted" : "New",
        url: p.url || "#",
        createdAt: p.createdAt || new Date().toISOString(),
        // Capture the content (try common API fields)
        postTitle:
          p.title || p.question || p.body || p.content || "Content unavailable",
      }));

      setLeads(mapped);
    } catch (err) {
      console.error("Pipeline Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user?.id]);

  useEffect(() => {
    fetchLiveLeads();
  }, [fetchLiveLeads]);

  /* ================= HELPERS ================= */
  const updateStatus = (id: string, status: string) => {
    setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({ title: "Copied", description: "Username copied to clipboard" });
  };

  const exportCSV = () => {
    if (!leads.length) return;
    const headers = ["Lead ID", "Username", "Platform", "Status", "Link"];
    const rows = leads.map((l) =>
      [l.leadId, l.name, l.platform, l.status, l.url]
        .map((v) => `"${v}"`)
        .join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads-pipeline.csv";
    a.click();
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.leadId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen pt-8 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-7xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Leads <span className="text-yellow-400">Pipeline</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and convert high-intent leads from your streams.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={exportCSV}
              className="flex-1 md:flex-none"
            >
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
            <Button
              onClick={fetchLiveLeads}
              disabled={loading}
              className="flex-1 md:flex-none bg-yellow-400 text-black hover:bg-yellow-500"
            >
              <RefreshCcw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Syncing..." : "Sync Pipeline"}
            </Button>
          </div>
        </div>

        {/* FILTERS TOOLBAR */}
        <div className="flex flex-col sm:flex-row gap-3 items-center bg-card/50 p-3 rounded-lg border border-border/50">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID or username..."
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="ml-auto text-sm text-muted-foreground hidden sm:block">
            Showing {filteredLeads.length} leads
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4 border rounded-lg border-dashed">
            <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />
            <p className="text-muted-foreground animate-pulse">
              Synchronizing leads...
            </p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center border rounded-lg bg-card/50">
            <p className="text-muted-foreground">
              No leads found matching your filters.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
              }}
              className="text-yellow-400"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            {/* --- DESKTOP VIEW: TABLE --- */}
            <Card className="hidden md:block overflow-hidden border-border bg-card">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead className="w-[250px]">Lead Source</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow
                      key={lead._id}
                      className="group hover:bg-muted/40 transition-colors"
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {lead.leadId}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-yellow-400/10 flex items-center justify-center shrink-0">
                            <User2 className="h-4 w-4 text-yellow-500" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-sm flex items-center gap-1">
                              <span
                                className="truncate max-w-[140px]"
                                title={lead.name}
                              >
                                {lead.name}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <span
                                className={
                                  lead.intent >= 70
                                    ? "text-green-500 font-bold"
                                    : "text-yellow-500"
                                }
                              >
                                {lead.intent}% Intent
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="font-normal capitalize"
                        >
                          {lead.platform}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <a
                          href={lead.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          <LinkIcon className="h-3 w-3" />
                          <span className="hidden lg:inline">View Source</span>
                          <span className="lg:hidden">Link</span>
                        </a>
                      </TableCell>

                      <TableCell>
                        <Select
                          value={lead.status}
                          onValueChange={(v) => updateStatus(lead._id, v)}
                        >
                          <SelectTrigger className="w-[140px] h-8 text-xs bg-background/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedLead(lead)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* --- MOBILE VIEW: CARDS --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredLeads.map((lead) => (
                <Card
                  key={lead._id}
                  className="p-4 space-y-4 border-l-4 border-l-yellow-400"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="text-xs font-mono text-muted-foreground">
                        {lead.leadId}
                      </div>
                      <div className="font-semibold truncate max-w-[200px]">
                        {lead.name}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-yellow-400/10 text-yellow-500 border-yellow-400/20"
                    >
                      {lead.intent}% Intent
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedLead(lead)}
                    >
                      Details
                    </Button>
                    <Select
                      value={lead.status}
                      onValueChange={(v) => updateStatus(lead._id, v)}
                    >
                      <SelectTrigger className="flex-1 h-9 text-xs">
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
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        
        {/* --- LEAD DETAILS MODAL --- */}
        <Dialog
          open={!!selectedLead}
          onOpenChange={() => setSelectedLead(null)}
        >
          <DialogContent className="max-w-md bg-card border border-border p-6 shadow-xl">
            <DialogHeader className="mb-2">
              <DialogTitle className="flex items-center justify-between">
                <span className="text-xl font-bold">Lead Overview</span>
                <Badge
                  variant="outline"
                  className="font-mono text-xs text-muted-foreground"
                >
                  {selectedLead?.leadId}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            {selectedLead && (
              <div className="space-y-5">
                {/* 1. Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-start justify-center p-4 rounded-lg bg-muted/40 border border-border/50 min-h-[90px]">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Intent Score
                    </span>
                    <span className="text-3xl font-bold text-yellow-400">
                      {selectedLead.intent}%
                    </span>
                  </div>
                  <div className="flex flex-col items-start justify-center p-4 rounded-lg bg-muted/40 border border-border/50 min-h-[90px]">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Platform
                    </span>
                    <span className="text-xl font-semibold capitalize text-foreground truncate w-full">
                      {selectedLead.platform}
                    </span>
                  </div>
                </div>

                {/* 2. Post Context (NEW SECTION) */}
                <div className="space-y-2">
                   <span className="text-xs font-semibold text-muted-foreground uppercase block">
                    Post Context
                  </span>
                  <div className="relative p-4 rounded-md bg-muted/30 border border-border/50">
                    <div className="text-sm italic text-foreground/90 leading-relaxed max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                      "{selectedLead.postTitle}"
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* 3. Username Field */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase block">
                      Username / Author
                    </span>
                    <div className="flex items-center gap-2 p-3 rounded-md bg-background border border-input shadow-sm overflow-hidden">
                      <User2 className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm font-mono truncate flex-1 min-w-0">
                        {selectedLead.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:text-yellow-400 shrink-0"
                        onClick={() => copyToClipboard(selectedLead.name)}
                      >
                        {isCopied ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* 4. Source URL Field */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase block">
                      Source URL
                    </span>
                    <a
                      href={selectedLead.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-md bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all group overflow-hidden"
                    >
                      <LinkIcon className="h-4 w-4 text-blue-400 shrink-0" />
                      <span className="text-sm text-blue-400 truncate flex-1 min-w-0 underline-offset-4 group-hover:underline">
                        {selectedLead.url}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-blue-400 opacity-50 group-hover:opacity-100 shrink-0" />
                    </a>
                  </div>
                </div>

                {/* 5. Action Button */}
                <div className="pt-2">
                  <Button className="w-full h-12 text-base font-bold bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg shadow-yellow-400/20 transition-all active:scale-[0.98]">
                    Engage on {selectedLead.platform}
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
