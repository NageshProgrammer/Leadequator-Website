import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  Loader2, 
  Terminal, 
  Settings, 
  Search, 
  Database, 
  Cpu,
  Zap,
  Activity
} from "lucide-react";
import Loader from "@/[components]/loader";

export default function LeadGeneration() {
  const { user, isLoaded } = useUser();

  // 👉 1. Setup State for Discovery Parameters
  const [industry, setIndustry] = useState("");
  const [geography, setGeography] = useState("");
  const [keywords, setKeywords] = useState("");
  const [businessSize, setBusinessSize] = useState("");
  const [buyingSignals, setBuyingSignals] = useState("");
  const [isFetchingData, setIsFetchingData] = useState(true);

  const [logs] = useState(`[6:34:32 PM] SYS: Initializing IBIDBA™ Engine...
[6:34:32 PM] REDIS: Checking intent cache... [OK]
[6:34:33 PM] WDOCETM: Initiating global web crawl...
[6:34:33 PM] TARGET: Syncing keyword matrices...
[6:34:33 PM] WDOCETM: Crawl aborted: API key not valid.
[6:34:34 PM] SYS: Awaiting user parameter override...`);

  // 👉 2. Fetch data from your backend profile endpoint
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isLoaded || !user?.id) return;
      
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/settings/profile?userId=${user.id}`
        );
        const data = await response.json();

        // 👉 3. Map the DB columns to the UI states
        if (data.company?.industry) setIndustry(data.company.industry);
        if (data.targetMarket?.targetCountry) setGeography(data.targetMarket.targetCountry);
        if (data.targetMarket?.businessType) setBusinessSize(data.targetMarket.businessType);
        if (data.targetMarket?.targetAudience) setBuyingSignals(data.targetMarket.targetAudience);
        if (data.keywords?.length > 0) setKeywords(data.keywords.join(", "));
        
      } catch (error) {
        console.error("Failed to fetch discovery parameters:", error);
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchProfileData();
  }, [isLoaded, user?.id]);

  // REUSABLE STYLES
  const glassPanelStyle = "bg-[#050505]/30 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem] p-6 md:p-8";
  const inputStyle = "bg-white/[0.02] border-white/[0.08] text-white focus-visible:ring-[#fbbf24]/30 focus-visible:border-[#fbbf24]/50 rounded-xl h-12 transition-all placeholder:text-zinc-600";
  const labelStyle = "text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-2 block ml-1";

  return (
    <div className="min-h-[90vh] pt-4 pb-12 bg-black/10 text-white rounded-3xl selection:bg-[#fbbf24]/30 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-[#fbbf24]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-[1400px] relative z-10">
        
        {/* HEADER */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Engine <span className="text-[#fbbf24] drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">Console</span>
          </h1>
          <p className="text-zinc-400 font-medium text-sm md:text-base">
            Configure discovery parameters and monitor real-time scraper logs.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
        >
          {/* ================= LEFT PANEL (PARAMETERS) ================= */}
          <div className="lg:col-span-4 relative flex flex-col h-full">
            <div className={`${glassPanelStyle} flex-grow relative overflow-hidden flex flex-col`}>
              
              {/* Loading overlay for the panel */}
              {isFetchingData && (
                <div className="absolute inset-0 z-20 bg-[#050505]/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2rem]">
                  <Loader/>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#fbbf24] animate-pulse">Syncing Profile...</span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-[#fbbf24]/10 border border-[#fbbf24]/20 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.2)]">
                  <Settings className="h-5 w-5 text-[#fbbf24]" />
                </div>
                <h3 className="text-xl font-bold tracking-wide">Discovery Setup</h3>
              </div>

              <div className="space-y-5 flex-grow">
                <div>
                  <label className={labelStyle}>Industry Target</label>
                  <Input 
                    value={industry} 
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Cloud Security" 
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Geography</label>
                  <Input 
                    value={geography} 
                    onChange={(e) => setGeography(e.target.value)}
                    placeholder="e.g. United States, UK" 
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Tracked Keywords</label>
                  <Input 
                    value={keywords} 
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. Zero Trust, SOC, SIEM" 
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Business Size</label>
                  <Input 
                    value={businessSize} 
                    onChange={(e) => setBusinessSize(e.target.value)}
                    placeholder="e.g. Medium (100-500)" 
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Buying Signals / Triggers</label>
                  <Textarea
                    value={buyingSignals}
                    onChange={(e) => setBuyingSignals(e.target.value)}
                    placeholder="e.g. Hiring security leads, recent funding, complaining about current tool..."
                    className={`${inputStyle} min-h-[100px] resize-none pt-4`}
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.08]">
                <Button className="w-full h-14 text-base bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-bold rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all active:scale-[0.98]">
                  <Search className="mr-2 h-5 w-5" />
                  Execute Deep Search
                </Button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL (LOGS & STATS) ================= */}
          <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
            
            {/* Console Logs */}
            <div className={`${glassPanelStyle} flex-grow flex flex-col`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Terminal className="h-5 w-5 text-zinc-400" />
                  <h3 className="text-lg font-bold tracking-wide">System Logs</h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Badges */}
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-none font-mono text-[10px] tracking-widest uppercase">
                    <Database className="w-3 h-3 mr-1.5 inline" /> DB OK
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-none font-mono text-[10px] tracking-widest uppercase">
                    <Activity className="w-3 h-3 mr-1.5 inline" /> REDIS OK
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-none font-mono text-[10px] tracking-widest uppercase">
                    <Cpu className="w-3 h-3 mr-1.5 inline" /> AI IDLE
                  </Badge>

                  <div className="w-px h-6 bg-white/[0.1] mx-2 hidden sm:block"></div>

                  <Button size="sm" variant="destructive" className="h-8 text-xs font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg">
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    PURGE CACHE
                  </Button>
                </div>
              </div>

              {/* Terminal Window */}
              <div className="flex-grow bg-[#050505] rounded-xl p-5 border border-white/[0.05] shadow-inner relative overflow-hidden min-h-[250px]">
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-20"></div>
                
                <div className="h-full overflow-auto font-mono text-xs sm:text-sm whitespace-pre-wrap leading-loose custom-scrollbar relative z-10">
                  {/* Color coding specific lines for realism */}
                  {logs.split('\n').map((line, i) => {
                    let colorClass = "text-zinc-400";
                    if (line.includes("[OK]")) colorClass = "text-emerald-400";
                    if (line.includes("aborted") || line.includes("not valid")) colorClass = "text-red-400 font-semibold";
                    if (line.includes("SYS:")) colorClass = "text-[#fbbf24]";
                    
                    return (
                      <div key={i} className={colorClass}>
                        {line}
                      </div>
                    );
                  })}
                  <div className="animate-pulse text-zinc-500 mt-2">_</div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
              <div className="bg-[#050505]/60 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 shadow-lg flex flex-col justify-center items-center text-center group hover:border-white/[0.15] transition-colors">
                <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1">Total Index</p>
                <p className="text-3xl font-black text-white group-hover:scale-105 transition-transform">0</p>
              </div>

              <div className="bg-[#050505]/60 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 shadow-lg flex flex-col justify-center items-center text-center group hover:border-white/[0.15] transition-colors">
                <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Zap className="w-3 h-3 text-[#fbbf24]"/> High Intent</p>
                <p className="text-3xl font-black text-white group-hover:scale-105 transition-transform">0</p>
              </div>

              <div className="bg-[#050505]/60 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 shadow-lg flex flex-col justify-center items-center text-center group hover:border-white/[0.15] transition-colors">
                <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1">Cache Hits</p>
                <p className="text-3xl font-black text-[#fbbf24] group-hover:scale-105 transition-transform drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">2</p>
              </div>

              <div className="bg-[#050505]/60 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 shadow-lg flex flex-col justify-center items-center text-center group hover:border-white/[0.15] transition-colors">
                <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1">AI Tokens</p>
                <p className="text-3xl font-black text-emerald-400 group-hover:scale-105 transition-transform drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">4.2k</p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}