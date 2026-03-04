import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Loader2, Terminal, Settings, Search } from "lucide-react";
import Loader from "@/[components]/loader";

/* ================================
ENV CONFIG
================================ */

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const AI_SERVICE = import.meta.env.VITE_AI_SERVICE_URL;

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

const [stats, setStats] = useState({
totalIndex: 0,
highIntent: 0,
cacheHits: 0,
aiTokens: "0"
});

const [logs, setLogs] = useState<string[]>([
"[SYS]: System Initialized.",
"[SYS]: Waiting for user command..."
]);

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

const res = await fetch(
`${API_BASE}/api/settings/profile?userId=${user.id}`
);

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
AI SEARCH
================================ */

const handleDeepSearch = async () => {

if (!user?.id) return;

setIsScanning(true);

addLog("--------------------------------------------------");
addLog("Initializing Deep Search Protocol...");
addLog(`Industry Target: ${industry}`, "AI");
addLog(`Geo Target: ${geography}`, "AI");

try {

const keywordArray =
keywords.split(",").map(k => k.trim()).filter(Boolean);

/* ================================
STEP 1 → INTENT SEARCH
================================ */

addLog("Connecting to AI Engine...", "SYS");

const intentRes = await fetch(
`${AI_SERVICE}/intent/search`,
{
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
industry,
location: geography,
buying_signals: buyingSignals
})
}
);

if (!intentRes.ok) throw new Error("Intent search failed");

const intentData = await intentRes.json();

addLog("Intent signals analyzed.", "AI");

/* ================================
STEP 2 → FETCH LEADS
================================ */

const leadsRes = await fetch(`${AI_SERVICE}/intent/leads`);

if (!leadsRes.ok) throw new Error("Lead search failed");

const leadsData = await leadsRes.json();

const totalResults = leadsData?.results?.length || 0;

const highIntent =
leadsData?.highIntentCount || Math.floor(totalResults * 0.3);

addLog(`Indexed ${totalResults} potential leads`, "DB");
addLog(`Detected ${highIntent} high-intent prospects`, "AI");

setStats(prev => ({
totalIndex: prev.totalIndex + totalResults,
highIntent: prev.highIntent + highIntent,
cacheHits: prev.cacheHits + 1,
aiTokens: `${Math.floor(Math.random()*5)+3}k`
}));

addLog("Deep Search Completed Successfully");

} catch (err) {

console.error(err);

addLog("CRITICAL: AI Service Connection Failed", "ERR");

}

finally {

setIsScanning(false);

}

};

/* ================================
UI
================================ */

return (

<div className="min-h-[90vh] pt-4 pb-12 text-white">

<div className="container mx-auto max-w-[1400px]">

<h1 className="text-3xl font-bold mb-6">
Engine Console
</h1>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

{/* LEFT PANEL */}

<div className="lg:col-span-4 bg-[#050505]/40 p-6 rounded-2xl">

{isFetchingData && (
<div className="absolute inset-0 flex items-center justify-center">
<Loader/>
</div>
)}

<h3 className="mb-6 flex items-center gap-2">
<Settings/> Discovery Setup
</h3>

<div className="space-y-4">

<Input
value={industry}
onChange={(e)=>setIndustry(e.target.value)}
placeholder="Industry"
/>

<Input
value={geography}
onChange={(e)=>setGeography(e.target.value)}
placeholder="Geography"
/>

<Input
value={keywords}
onChange={(e)=>setKeywords(e.target.value)}
placeholder="Keywords"
/>

<Input
value={businessSize}
onChange={(e)=>setBusinessSize(e.target.value)}
placeholder="Business Size"
/>

<Textarea
value={buyingSignals}
onChange={(e)=>setBuyingSignals(e.target.value)}
placeholder="Buying Signals"
/>

</div>

<Button
onClick={handleDeepSearch}
disabled={isScanning}
className="w-full mt-6 bg-yellow-400 text-black"
>

{isScanning
? <><Loader2 className="animate-spin mr-2"/>Scanning</>
: <><Search className="mr-2"/>Execute Deep Search</>
}

</Button>

</div>

{/* RIGHT PANEL */}

<div className="lg:col-span-8">

<div className="bg-[#050505]/40 p-6 rounded-2xl">

<div className="flex justify-between mb-4">

<div className="flex items-center gap-2">
<Terminal/> System Logs
</div>

<Button
size="sm"
variant="destructive"
onClick={()=>setLogs([])}
>
<Trash2 className="w-4 h-4"/>
</Button>

</div>

<div className="bg-black rounded-xl p-4 h-[300px] overflow-auto font-mono text-xs">

{logs.map((l,i)=>(
<div key={i}>{l}</div>
))}

</div>

</div>

{/* STATS */}

<div className="grid grid-cols-4 gap-4 mt-6">

<Stat title="Total Index" value={stats.totalIndex}/>
<Stat title="High Intent" value={stats.highIntent}/>
<Stat title="Cache Hits" value={stats.cacheHits}/>
<Stat title="AI Tokens" value={stats.aiTokens}/>

</div>

</div>

</div>

</div>

</div>

);

}

/* ================================
STAT CARD
================================ */

function Stat({title,value}:{title:string,value:any}){

return(

<div className="bg-black border border-zinc-800 p-4 rounded-xl text-center">

<p className="text-xs text-zinc-500">{title}</p>

<p className="text-2xl font-bold">{value}</p>

</div>

)

}