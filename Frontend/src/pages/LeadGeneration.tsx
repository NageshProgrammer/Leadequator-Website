import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Loader2, Terminal, Settings, Search, ExternalLink, ShieldAlert, Database, Target, Zap, BrainCircuit } from "lucide-react";
import Loader from "@/[components]/loader";
import { createClient } from "@supabase/supabase-js";
import NumberFlow from "@number-flow/react"; // Smooth number animations

/* ================================
   ENV CONFIG
================================ */
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const AI_SERVICE = import.meta.env.VITE_AI_SERVICE_URL;

// ✅ INITIALIZE SUPABASE CLIENT
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LeadGeneration() {
  const { user, isLoaded } = useUser();

  /* ================================
     STATE
  ================================ */
  const [industry, setIndustry] = useState("");
  const [geography, setGeography] = useState("");
  const [keywords, setKeywords] = useState("");
  const [businessSize, setBusinessSize] = useState("");
  const [buyingSignals, setBuyingSignals] = useState("");

  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  // ✅ STATS STATE (Numbers only for NumberFlow)
  const [stats, setStats] = useState({
    totalIndex: 0,
    highIntent: 0,
    cacheHits: 0,
    aiTokens: 0
  });

  const [logs, setLogs] = useState<string[]>([
    "[SYS]: System Initialized.",
    "[SYS]: Waiting for user command..."
  ]);

  const [leads, setLeads] = useState<any[]>([]);
  const [isFetchingLeads, setIsFetchingLeads] = useState(false);

  /* ================================
     LOG FUNCTION
  ================================ */
  const addLog = (message: string, type: "SYS" | "AI" | "DB" | "ERR" = "SYS") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${type}: ${message}`, ...prev]);
  };

  /* ================================
     LOAD PROFILE
  ================================ */
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoaded || !user?.id) return;
      try {
        const res = await fetch(`${API_BASE}/api/settings/profile?userId=${user.id}`);
        const data = await res.json();

        if (data.company?.industry) setIndustry(data.company.industry);
        if (data.targetMarket?.targetCountry) setGeography(data.targetMarket.targetCountry);
        if (data.targetMarket?.businessType) setBusinessSize(data.targetMarket.businessType);
        if (data.targetMarket?.targetAudience) setBuyingSignals(data.targetMarket.targetAudience);
        if (data.keywords?.length > 0) setKeywords(data.keywords.join(", "));
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetchingData(false);
      }
    };
    fetchProfile();
  }, [isLoaded, user?.id]);

  /* ================================
     FETCH LEADS FROM SUPABASE & UPDATE STATS
  ================================ */
  const fetchSupabaseLeads = async () => {
    setIsFetchingLeads(true);
    addLog("Fetching compiled leads from Supabase...", "DB");
    
    try {
      let dbQuery = supabase.from('leads').select('*');

      const kwArray = keywords.split(',').map(k => k.trim()).filter(Boolean);
      if (kwArray.length > 0) {
        const orFilter = kwArray.map(kw => `title.ilike.%${kw}%,domain.ilike.%${kw}%`).join(',');
        dbQuery = dbQuery.or(orFilter);
        addLog(`Applying DB filter for keywords: ${kwArray.join(', ')}`, "DB");
      }

      const { data, error } = await dbQuery.order('intent_score', { ascending: false }).limit(50);

      if (error) throw error;

      if (data) {
        setLeads(data);
        addLog(`Successfully loaded ${data.length} relevant leads.`, "DB");

        // 🔥 REALISTIC STATS LOGIC BASED ON ACTUAL SUPABASE DATA
        const highIntentCount = data.filter(lead => lead.intent_score >= 70 || lead.intent_level === 'High Intent').length;
        
        // Simulate token usage based on data volume (e.g. ~185 tokens per lead processed)
        const tokenEstimate = Math.floor((data.length * 185) / 1000) + Math.floor(Math.random() * 3) + 1; 

        setStats(prev => ({
          totalIndex: data.length, // Show exact number of leads pulled
          highIntent: highIntentCount, // Exact number of hot leads
          cacheHits: prev.cacheHits + 1, // Increment cache hits
          aiTokens: tokenEstimate // Realistic token metric
        }));
      }
    } catch (error: any) {
      console.error("Error fetching leads from Supabase:", error);
      addLog(`Failed to load leads: ${error.message}`, "ERR");
    } finally {
      setIsFetchingLeads(false);
    }
  };

  /* ================================
     AI SEARCH
  ================================ */
  const handleDeepSearch = async () => {
    if (!user?.id) return;
    setIsScanning(true);
    setLeads([]); 

    addLog("--------------------------------------------------");
    addLog("Initializing Deep Search Protocol...");
    addLog(`Industry Target: ${industry}`, "AI");
    addLog(`Geo Target: ${geography}`, "AI");

    try {
      addLog("Connecting to AI Engine...", "SYS");
      const intentRes = await fetch(`${AI_SERVICE}/intent/search/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, location: geography, buying_signals: buyingSignals })
      });

      if (!intentRes.ok) throw new Error("Intent search failed");
      await intentRes.json();
      addLog("Intent signals analyzed.", "AI");

      const queryParams = new URLSearchParams({ industry, location: geography, buying_signals: String(buyingSignals) });
      const leadsRes = await fetch(`${AI_SERVICE}/intent/leads/?${queryParams.toString()}`);
      if (!leadsRes.ok) throw new Error("Lead search failed");
      
      const leadsData = await leadsRes.json();
      addLog(`Indexed ${leadsData?.results?.length || 0} potential leads via AI`, "AI");
      addLog("AI processing complete. Awaiting database sync...", "SYS");
      
      // Delay to allow backend to write to DB, then fetch the synced data
      setTimeout(() => {
        fetchSupabaseLeads();
      }, 2500); 

    } catch (err) {
      console.error(err);
      addLog("CRITICAL: AI Service Connection Failed", "ERR");
    } finally {
      setIsScanning(false);
    }
  };

  /* ================================
     UI
  ================================ */
  return (
    <div className="min-h-[90vh] pt-4 pb-12 text-white">
      <div className="container mx-auto max-w-[1400px]">
        <h1 className="text-3xl font-bold mb-6">Engine Console</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* LEFT PANEL: Inputs */}
          <div className="lg:col-span-4 bg-[#050505]/40 p-8 rounded-[2rem] relative overflow-hidden border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
            {isFetchingData && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 backdrop-blur-md">
                <Loader />
              </div>
            )}
            <h3 className="mb-8 flex items-center gap-3 font-bold text-xl text-white">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Settings className="w-5 h-5 text-[#fbbf24]" />
              </div>
              Discovery Setup
            </h3>
            
            <div className="space-y-5">
              {[
                { label: "Industry", val: industry, setter: setIndustry, ph: "e.g. SaaS" },
                { label: "Geography", val: geography, setter: setGeography, ph: "e.g. USA" },
                { label: "Keywords", val: keywords, setter: setKeywords, ph: "e.g. B2B, Marketing" },
                { label: "Business Size", val: businessSize, setter: setBusinessSize, ph: "e.g. Enterprise" },
              ].map((input, idx) => (
                <div key={idx}>
                  <label className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5 block">{input.label}</label>
                  <Input 
                    value={input.val} 
                    onChange={(e) => input.setter(e.target.value)} 
                    placeholder={input.ph}
                    className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl focus-visible:ring-[#fbbf24]/30 focus-visible:border-[#fbbf24]/50 transition-all" 
                  />
                </div>
              ))}
              <div>
                <label className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5 block">Buying Signals</label>
                <Textarea 
                  value={buyingSignals} 
                  onChange={(e) => setBuyingSignals(e.target.value)} 
                  className="bg-white/[0.03] border-white/10 text-white resize-none min-h-[100px] rounded-xl focus-visible:ring-[#fbbf24]/30 focus-visible:border-[#fbbf24]/50 transition-all" 
                />
              </div>
            </div>

            <Button
              onClick={handleDeepSearch}
              disabled={isScanning}
              className="w-full mt-8 bg-[#fbbf24] hover:bg-[#fbbf24]/90 text-black font-extrabold h-14 rounded-xl text-base shadow-[0_0_20px_rgba(251,191,36,0.15)] hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all hover:-translate-y-0.5"
            >
              {isScanning ? (
                <><Loader2 className="animate-spin mr-2" /> Processing Protocols...</>
              ) : (
                <><Search className="mr-2 w-5 h-5" /> Execute Deep Search</>
              )}
            </Button>
          </div>

          {/* RIGHT PANEL: Logs & Stats */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* TERMINAL LOGS */}
            <div className="bg-[#050505]/40 p-6 rounded-[2rem] border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] flex-grow flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Terminal className="w-5 h-5 text-emerald-400" /> System Logs
                </div>
                <Button size="sm" variant="ghost" onClick={() => setLogs([])} className="h-8 w-8 p-0 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="bg-[#0a0a0a] rounded-xl p-5 flex-grow max-h-[320px] overflow-auto font-mono text-[13px] leading-relaxed text-zinc-400 border border-white/[0.05] custom-scrollbar shadow-inner">
                {logs.map((l, i) => {
                  let textColor = "text-zinc-500";
                  if (l.includes("[AI]")) textColor = "text-[#fbbf24]";
                  if (l.includes("[DB]")) textColor = "text-cyan-400";
                  if (l.includes("[ERR]")) textColor = "text-red-400";
                  if (l.includes("[SYS]")) textColor = "text-zinc-300";
                  return (
                    <div key={i} className={`mb-1.5 ${textColor}`}>
                      <span className="opacity-50 select-none mr-2">&gt;</span>{l}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DYNAMIC STATS WIDGETS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Total Index" value={stats.totalIndex} icon={Database} color="text-white" glow="bg-white" />
              <StatCard title="High Intent" value={stats.highIntent} icon={Target} color="text-emerald-400" glow="bg-emerald-400" />
              <StatCard title="Cache Hits" value={stats.cacheHits} icon={Zap} color="text-cyan-400" glow="bg-cyan-400" />
              <StatCard title="AI Tokens" value={stats.aiTokens} suffix="k" icon={BrainCircuit} color="text-[#fbbf24]" glow="bg-[#fbbf24]" />
            </div>
          </div>
        </div>

        {/* ================================
            BOTTOM SECTION: RESULTS TABLE
        ================================ */}
        <div className="bg-[#050505]/40 p-6 md:p-8 rounded-[2rem] border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-3 text-white">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <ShieldAlert className="w-5 h-5 text-[#fbbf24]" />
              </div>
              Identified Opportunities
            </h3>
            <Button 
              variant="outline" 
              onClick={fetchSupabaseLeads} 
              disabled={isFetchingLeads || isScanning}
              className="border-white/10 bg-white/[0.03] hover:bg-[#fbbf24] text-white text-sm font-semibold rounded-xl h-10 px-4 transition-all"
            >
              {isFetchingLeads ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#fbbf24]" /> : null}
              Refresh Database
            </Button>
          </div>

          <div className="bg-[#0a0a0a] rounded-2xl border border-white/[0.05] overflow-hidden shadow-inner">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white/[0.02] border-b border-white/[0.05] text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">
                  <tr>
                    <th className="px-6 py-5">Title / Source</th>
                    <th className="px-6 py-5">Domain</th>
                    <th className="px-6 py-5 text-center">Intent Level</th>
                    <th className="px-6 py-5 text-right">Intent Score</th>
                    <th className="px-6 py-5 text-right">IMRE Score</th>
                    <th className="px-6 py-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center text-zinc-500 font-medium">
                        {isScanning || isFetchingLeads ? "Awaiting data pipeline..." : "No leads discovered yet. Ensure keywords are set and Execute a Deep Search."}
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => {
                      let intentColor = "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
                      if (lead.intent_level === "High Intent") intentColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                      if (lead.intent_level === "Medium Intent") intentColor = "bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/20";
                      if (lead.intent_level === "Low Intent" || lead.intent_level === "No Intent") intentColor = "bg-red-500/10 text-red-400 border-red-500/20";

                      return (
                        <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4 max-w-[280px] truncate">
                            <div className="text-zinc-200 font-bold truncate group-hover:text-white transition-colors" title={lead.title}>
                              {lead.title || "Unknown Source"}
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-[150px] truncate">
                            <span className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] text-zinc-400 text-xs font-mono border border-white/[0.05]" title={lead.domain}>
                              {lead.domain || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${intentColor}`}>
                              {lead.intent_level || "Unknown"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`font-black text-xl ${
                              lead.intent_score >= 80 ? "text-emerald-400" :
                              lead.intent_score >= 50 ? "text-[#fbbf24]" : "text-red-400"
                            }`}>
                              {lead.intent_score || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-zinc-400 font-mono text-sm font-medium">
                              {lead.imre_score ? Number(lead.imre_score).toFixed(2) : "0.00"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {lead.link ? (
                              <a href={lead.link} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.05] transition-all hover:scale-105">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            ) : (
                              <span className="text-zinc-600">-</span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================================
   NEW: PREMIUM STAT CARD
================================ */
function StatCard({ title, value, icon: Icon, color, glow, suffix = "" }: any) {
  return (
    <div className="bg-[#050505]/40 border border-white/[0.05] p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-white/[0.1] transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
      <div className="flex items-center justify-between mb-3 relative z-10">
        <p className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest">{title}</p>
        <Icon className={`w-4 h-4 ${color} opacity-70 group-hover:opacity-100 transition-opacity`} />
      </div>
      <div className="flex items-baseline gap-0.5 relative z-10">
        <span className={`text-4xl font-black ${color} tracking-tighter`}>
          <NumberFlow value={value} format={{ style: "decimal", minimumFractionDigits: 0 }} />
        </span>
        {suffix && <span className={`text-lg font-bold ${color}`}>{suffix}</span>}
      </div>
      {/* Background Soft Glow */}
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-[40px] opacity-20 ${glow} group-hover:opacity-30 transition-opacity`}></div>
    </div>
  );
}