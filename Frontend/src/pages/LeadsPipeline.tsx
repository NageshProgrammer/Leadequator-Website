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
  Search,
  Filter as FilterIcon,
  Copy,
  CheckCircle2,
  X,
  Target,
  MessageSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/[components]/loader";

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

// Helper to color-code status badges
const getStatusColor = (status: string) => {
  switch (status) {
    case "New": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Contacted": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Qualified": return "bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/20";
    case "Closed Won": return "bg-green-500/10 text-green-400 border-green-500/20";
    case "Closed Lost": return "bg-red-500/10 text-red-400 border-red-500/20";
    default: return "bg-white/[0.03] text-zinc-300 border-white/[0.1]";
  }
};

const LeadsPipeline = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // ✅ ENHANCED FILTER STATES
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [minIntent, setMinIntent] = useState("0");

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

      const mapped: Lead[] = combined.map((p: any, idx: number) => {
        const rawPlatform = p.platform || (p.question ? "Quora" : "Reddit");
        const formattedPlatform = rawPlatform.charAt(0).toUpperCase() + rawPlatform.slice(1).toLowerCase();

        return {
          _id: String(p.id),
          leadId: `LD-${1000 + idx}`,
          name: p.author ?? p.userId ?? "Unknown User",
          platform: formattedPlatform,
          intent: 50 + (idx % 40),
          // 👇 Read from the new DB column. Fallback to "New"
          status: p.pipelineStage || "New",
          url: p.url || "#",
          createdAt: p.createdAt || new Date().toISOString(),
          postTitle: p.text || p.question || p.body || p.content || "Content unavailable",
        };
      });

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

  /* ================= DB UPDATE FUNCTION ================= */
  const updateStatus = async (id: string, platform: string, status: string) => {
    // 1. Optimistic UI update (update frontend immediately so it feels fast)
    setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));

    // 2. Background DB Update
    try {
      // 👇 Uses the new, non-colliding URL
      const UPDATE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/pipeline/update-stage`;
      
      const res = await fetch(UPDATE_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: id, platform, stage: status }),
      });

      if (!res.ok) throw new Error("Failed to save to DB");

      toast({ title: "Pipeline Updated", description: `Lead moved to ${status}` });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({ title: "Update Failed", description: "Could not save to database.", variant: "destructive" });
    }
  };

  /* ================= HELPERS & FILTERS ================= */
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({ title: "Copied", description: "Username copied to clipboard" });
  };

  const exportCSV = () => {
    if (!leads.length) return;
    const headers = ["Lead ID", "Username", "Platform", "Status", "Link", "Content"];
    const rows = leads.map((l) =>
      [l.leadId, l.name, l.platform, l.status, l.url, l.postTitle]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`) 
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

  // ✅ ENHANCED FILTER LOGIC
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        lead.name.toLowerCase().includes(searchLower) ||
        lead.leadId.toLowerCase().includes(searchLower) ||
        lead.postTitle.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
      const matchesPlatform = platformFilter === "All" || lead.platform.toLowerCase() === platformFilter.toLowerCase();
      const matchesIntent = lead.intent >= parseInt(minIntent);

      return matchesSearch && matchesStatus && matchesPlatform && matchesIntent;
    });
  }, [leads, searchQuery, statusFilter, platformFilter, minIntent]);

  const clearFilters = () => {
    setSearchQuery("");
    setPlatformFilter("All");
    setStatusFilter("All");
    setMinIntent("0");
  };

  const glassPanelStyle = "bg-[#050505]/30 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem]";
  const filterLabelStyle = "text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-3 block";

  return (
    <div className="min-h-[90vh] rounded-3xl pt-4 pb-12 bg-black/10 text-white selection:bg-[#fbbf24]/30 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-[#fbbf24]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-[1400px] space-y-6 md:space-y-8 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1">
              Leads <span className="text-[#fbbf24] drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">Pipeline</span>
            </h1>
            <p className="text-zinc-400 font-medium text-sm md:text-base">
              Track, manage, and convert high-intent leads.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
             className={`flex-1 md:flex-none border-white/[0.1] text-white  h-11 rounded-xl transition-all ${showFilters ? 'bg-white/[0.1] border-[#fbbf24]/50 ' : 'bg-white/[0.03] hover:bg-[#fbbf24]'}`}
            >
              <FilterIcon className="mr-2 h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            
            <Button
              onClick={exportCSV}
              className="flex-1 md:flex-none bg-white/[0.03] border border-white/[0.1] text-white hover:bg-white/[0.08] hover:text-[#fbbf24] font-bold rounded-xl h-11 transition-all"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>

            <Button
              onClick={fetchLiveLeads}
              disabled={loading}
              className="flex-1 md:flex-none bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-bold rounded-xl h-11 shadow-[0_0_15px_rgba(251,191,36,0.15)] transition-all"
            >
              <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Syncing..." : "Sync Pipeline"}
            </Button>
          </div>
        </div>

        {/* MAIN LAYOUT: SIDEBAR + RESULTS */}
        <div className="flex flex-col lg:flex-row-reverse gap-6 lg:gap-8 items-start">
          
          {/* ================= FILTER SIDEBAR ================= */}
          {showFilters && (
            <div className={`w-full lg:w-[320px] flex-shrink-0 ${glassPanelStyle} p-6 animate-in slide-in-from-right-8 duration-500 lg:sticky lg:top-24`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FilterIcon className="h-4 w-4 text-[#fbbf24]" /> Pipeline Filters
                </h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden text-zinc-400 hover:text-white" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-8">
                {/* Search */}
                <div>
                  <label className={filterLabelStyle}>Search Lead</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input 
                      placeholder="Name, ID, post content..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/[0.02] border-white/[0.08] text-white focus-visible:ring-[#fbbf24]/30 rounded-xl h-11 transition-all" 
                    />
                  </div>
                </div>

                {/* Intent Slider/Select */}
                <div>
                  <label className={filterLabelStyle}>Minimum Intent Score</label>
                  <Select value={minIntent} onValueChange={setMinIntent}>
                    <SelectTrigger className="w-full bg-white/[0.02] border-white/[0.08] text-white rounded-xl h-11">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-[#fbbf24]" />
                        <SelectValue placeholder="Select intent..." />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/[0.1] text-white rounded-xl">
                      <SelectItem value="0" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Any Intent (0%+)</SelectItem>
                      <SelectItem value="50" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Warm Leads (50%+)</SelectItem>
                      <SelectItem value="70" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Hot Leads (70%+)</SelectItem>
                      <SelectItem value="90" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Urgent Buyers (90%+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Pipeline Status */}
                <div>
                  <label className={filterLabelStyle}>Pipeline Stage</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full bg-white/[0.02] border-white/[0.08] text-white rounded-xl h-11">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-[#fbbf24]" />
                        <SelectValue placeholder="Select status..." />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/[0.1] text-white rounded-xl">
                      <SelectItem value="All" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">All Stages</SelectItem>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Platform Pills */}
                <div>
                  <label className={filterLabelStyle}>Lead Source</label>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Reddit", "Quora"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPlatformFilter(p)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${platformFilter === p ? 'bg-[#fbbf24] text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'bg-white/[0.03] text-zinc-400 border border-white/[0.08] hover:bg-white/[0.1] hover:text-white'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Button */}
                <div className="pt-4 border-t border-white/[0.08]">
                  <Button 
                    variant="ghost" 
                    className="w-full text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl h-11"
                    onClick={clearFilters}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ================= MAIN RESULTS AREA ================= */}
          <div className="flex-1 min-w-0 w-full animate-in fade-in duration-700">
            
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-zinc-400 font-medium">
                Found <strong className="text-white">{filteredLeads.length}</strong> leads in pipeline
              </span>
            </div>

            {loading ? (
              <div className={`flex flex-col items-center justify-center h-[400px] ${glassPanelStyle}`}>
                <Loader/>
                <p className="text-[#fbbf24] font-medium tracking-widest uppercase text-xs mt-4 animate-pulse">
                  Synchronizing pipeline...
                </p>
              </div>
            ) : (
              <>
                {/* --- DESKTOP VIEW: TABLE --- */}
                <div className={`hidden md:block overflow-hidden ${glassPanelStyle} !p-0`}>
                  <Table>
                    <TableHeader className="bg-white/[0.02] border-b border-white/[0.05]">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="w-[100px] text-zinc-400 font-bold py-5 pl-6">ID</TableHead>
                        <TableHead className="w-[280px] text-zinc-400 font-bold py-5">Lead Target</TableHead>
                        <TableHead className="text-zinc-400 font-bold py-5">Platform</TableHead>
                        <TableHead className="text-zinc-400 font-bold py-5">Link</TableHead>
                        <TableHead className="text-zinc-400 font-bold py-5">Pipeline Stage</TableHead>
                        <TableHead className="text-right text-zinc-400 font-bold py-5 pr-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-20">
                            <div className="flex flex-col items-center justify-center">
                              <Search className="h-10 w-10 text-zinc-600 mb-4" />
                              <p className="text-zinc-400 text-lg font-medium">No leads found.</p>
                              <p className="text-zinc-500 text-sm mt-1">Try adjusting your filters.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLeads.map((lead) => (
                          <TableRow
                            key={lead._id}
                            className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors"
                          >
                            <TableCell className="font-mono text-xs text-zinc-500 pl-6">
                              {lead.leadId}
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/20 flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.2)]">
                                  <User2 className="h-5 w-5 text-[#fbbf24]" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-sm text-zinc-100 truncate max-w-[180px]" title={lead.name}>
                                    {lead.name}
                                  </div>
                                  <div className="text-xs font-medium mt-0.5">
                                    <span className={lead.intent >= 70 ? "text-green-400 font-bold" : "text-[#fbbf24]"}>
                                      {lead.intent}% Intent Score
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <Badge variant="outline" className="bg-white/[0.03] text-zinc-300 border-white/[0.1] font-semibold capitalize tracking-wide shadow-sm">
                                {lead.platform}
                              </Badge>
                            </TableCell>

                            <TableCell>
                              <a
                                href={lead.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/[0.03] hover:bg-white/[0.1] hover:text-[#fbbf24] text-zinc-400 transition-all"
                                title="View Original Post"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </TableCell>

                            <TableCell>
                              <Select
                                value={lead.status}
                                // 👇 Call updateStatus with DB ID and Platform
                                onValueChange={(v) => updateStatus(lead._id, lead.platform, v)}
                              >
                                <SelectTrigger className={`w-[150px] h-9 text-xs font-semibold rounded-xl transition-all ${getStatusColor(lead.status)}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-950 border-white/[0.1] text-white rounded-xl shadow-2xl">
                                  {STATUSES.map((s) => (
                                    <SelectItem key={s} value={s} className="text-xs focus:bg-white/[0.05] focus:text-white cursor-pointer font-medium">
                                      {s}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>

                            <TableCell className="text-right pr-6">
                              <Button
                                size="sm"
                                className="bg-white/[0.05] hover:bg-[#fbbf24] text-white hover:text-black font-semibold rounded-xl transition-all"
                                onClick={() => setSelectedLead(lead)}
                              >
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* --- MOBILE VIEW: CARDS --- */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {filteredLeads.length === 0 ? (
                    <div className={`p-10 text-center flex flex-col items-center justify-center ${glassPanelStyle}`}>
                      <Search className="h-8 w-8 text-zinc-600 mb-3" />
                      <p className="text-zinc-400 font-medium">No leads found.</p>
                    </div>
                  ) : (
                    filteredLeads.map((lead) => (
                      <div
                        key={lead._id}
                        className="p-5 space-y-5 bg-[#050505]/60 backdrop-blur-xl border border-white/[0.08] shadow-lg rounded-[1.5rem] relative overflow-hidden"
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${lead.intent >= 70 ? 'bg-green-500' : 'bg-[#fbbf24]'}`} />
                        
                        <div className="flex justify-between items-start pl-2">
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-mono font-bold tracking-widest text-zinc-500">
                              {lead.leadId}
                            </div>
                            <div className="font-bold text-white text-lg truncate max-w-[180px]">
                              {lead.name}
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/20 font-black px-2 py-1 shadow-sm">
                            {lead.intent}%
                          </Badge>
                        </div>

                        <div className="flex gap-3 pl-2">
                          <Button
                            variant="outline"
                            className="flex-1 bg-white/[0.03] border-white/[0.1] text-white hover:bg-white/[0.1] rounded-xl h-10"
                            onClick={() => setSelectedLead(lead)}
                          >
                            Details
                          </Button>
                          <Select
                            value={lead.status}
                            // 👇 Call updateStatus with DB ID and Platform
                            onValueChange={(v) => updateStatus(lead._id, lead.platform, v)}
                          >
                            <SelectTrigger className={`flex-1 h-10 text-xs font-bold rounded-xl ${getStatusColor(lead.status)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-white/[0.1] text-white rounded-xl">
                              {STATUSES.map((s) => (
                                <SelectItem key={s} value={s} className="text-xs font-medium focus:bg-white/[0.05] focus:text-white">
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* --- LEAD DETAILS MODAL --- */}
        <Dialog
          open={!!selectedLead}
          onOpenChange={() => setSelectedLead(null)}
        >
          <DialogContent className="max-w-md bg-[#09090b]/95 backdrop-blur-3xl border border-white/[0.1] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem]">
            <DialogHeader className="mb-6">
              <DialogTitle className="flex items-center justify-between text-white">
                <span className="text-2xl font-extrabold tracking-tight">Lead Overview</span>
                <Badge variant="outline" className="font-mono text-xs font-bold tracking-widest text-zinc-500 border-white/[0.1] bg-black/50 px-3 py-1">
                  {selectedLead?.leadId}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            {selectedLead && (
              <div className="space-y-6">
                {/* 1. Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-start justify-center p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] min-h-[100px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                      Intent Score
                    </span>
                    <span className={`text-4xl font-black ${selectedLead.intent >= 70 ? 'text-green-400' : 'text-[#fbbf24]'}`}>
                      {selectedLead.intent}%
                    </span>
                  </div>
                  <div className="flex flex-col items-start justify-center p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] min-h-[100px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                      Platform
                    </span>
                    <span className="text-2xl font-bold capitalize text-white truncate w-full tracking-tight">
                      {selectedLead.platform}
                    </span>
                  </div>
                </div>

                {/* 2. Post Context */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">
                    Post Context
                  </span>
                  <div className="relative p-5 rounded-2xl bg-black/40 border border-white/[0.05] shadow-inner">
                    <div className="text-sm italic text-zinc-300 leading-relaxed max-h-[140px] overflow-y-auto pr-2 custom-scrollbar font-medium">
                      "{selectedLead.postTitle}"
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {/* 3. Username Field */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">
                      Username / Target
                    </span>
                    <div className="flex items-center gap-3 p-2 pl-4 rounded-xl bg-white/[0.03] border border-white/[0.08] shadow-sm overflow-hidden group hover:border-white/[0.15] transition-colors">
                      <User2 className="h-5 w-5 text-[#fbbf24] shrink-0" />
                      <span className="text-base font-bold text-white truncate flex-1 min-w-0">
                        {selectedLead.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0 text-zinc-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-lg mr-1"
                        onClick={() => copyToClipboard(selectedLead.name)}
                      >
                        {isCopied ? (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* 4. Source URL Field */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">
                      Source Link
                    </span>
                    <a
                      href={selectedLead.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl bg-[#fbbf24]/10 border border-[#fbbf24]/20 hover:bg-[#fbbf24]/15 hover:border-[#fbbf24]/30 transition-all group overflow-hidden shadow-[inset_0_1px_0_0_rgba(251,191,36,0.1)]"
                    >
                      <LinkIcon className="h-5 w-5 text-[#fbbf24] shrink-0" />
                      <span className="text-sm font-semibold text-[#fbbf24] truncate flex-1 min-w-0 group-hover:underline underline-offset-4">
                        View Original Post
                      </span>
                      <ExternalLink className="h-4 w-4 text-[#fbbf24] transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </a>
                  </div>
                </div>

                {/* 5. Action Button */}
                <div className="pt-4">
                  <Button className="w-full h-14 text-lg font-bold bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all active:scale-[0.98]">
                    Engage Target on {selectedLead.platform}
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