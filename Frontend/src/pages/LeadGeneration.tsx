import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react"; // 👇 Added Clerk hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Loader2 } from "lucide-react";

export default function LeadGeneration() {
  const { user, isLoaded } = useUser();

  // 👉 1. Setup State for Discovery Parameters
  const [industry, setIndustry] = useState("");
  const [geography, setGeography] = useState("");
  const [keywords, setKeywords] = useState("");
  const [businessSize, setBusinessSize] = useState("");
  const [buyingSignals, setBuyingSignals] = useState("");
  const [isFetchingData, setIsFetchingData] = useState(true);

  const [logs] = useState(`
[6:34:32 PM] REDIS: Checking intent cache...
[6:34:33 PM] WDOCETM: Initiating global web crawl...
[6:34:33 PM] WDOCETM: Crawl aborted: API key not valid.
`);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* ================= LEFT PANEL ================= */}
      <Card className="lg:col-span-1 bg-card border border-border shadow-xl relative overflow-hidden">
        {/* Loading overlay for the panel */}
        {isFetchingData && (
          <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm flex items-center justify-center">
             <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-xs tracking-widest text-primary">
            DISCOVERY PARAMETERS
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Industry</label>
            <Input 
              value={industry} 
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Cloud Security" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Geography</label>
            <Input 
              value={geography} 
              onChange={(e) => setGeography(e.target.value)}
              placeholder="e.g. USA" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Keywords</label>
            <Input 
              value={keywords} 
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. Zero Trust, SOC, SIEM" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">
              Business Size
            </label>
            <Input 
              value={businessSize} 
              onChange={(e) => setBusinessSize(e.target.value)}
              placeholder="e.g. Medium (100-500)" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">
              Buying Signals (Target Audience)
            </label>
            <Textarea
              value={buyingSignals}
              onChange={(e) => setBuyingSignals(e.target.value)}
              placeholder="e.g. Hiring security leads, recent funding"
              className="min-h-[80px]"
            />
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90">
            EXECUTE SEARCH
          </Button>
        </CardContent>
      </Card>

      {/* ================= RIGHT PANEL ================= */}
      <div className="lg:col-span-2 space-y-6">
        {/* Console Logs */}
        <Card className="bg-card border border-border shadow-xl">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-semibold">
              IBIDBA™ CORE LOGS
            </CardTitle>

            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-400">DB</Badge>
              <Badge className="bg-green-500/20 text-green-400">REDIS</Badge>
              <Badge className="bg-green-500/20 text-green-400">AI</Badge>

              <Button size="sm" variant="destructive" className="ml-3 gap-1">
                <Trash2 className="h-3 w-3" />
                PURGE DB
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="bg-background rounded-md p-4 h-[220px] overflow-auto font-mono text-xs whitespace-pre text-muted-foreground">
              {logs}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">TOTAL INDEX</p>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">HIGH INTENT</p>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">CACHE HITS</p>
              <p className="text-2xl font-bold text-yellow-400">2</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">AI TOKENS</p>
              <p className="text-2xl font-bold text-green-400">4.2k</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}