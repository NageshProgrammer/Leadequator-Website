import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner"; // Ensure you have this or use your own toast lib
import {
  Webhook,
  Database,
  Mail,
  MessageSquare,
  Settings2,
  Lock,
  User,
  Upload,
  Globe,
  Briefcase,
  Loader2
} from "lucide-react";

// ==========================================
// 🔧 API CONFIGURATION
// ==========================================
// CHANGE THIS: Replace 'https://api.leadequator.live' with your actual deployed backend URL
const API_BASE = import.meta.env.MODE === "development" 
  ? "http://localhost:5000" 
  : "https://api.leadequator.live"; 

const SettingsIntegrations = () => {
  const { user: clerkUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State matching your DB Schema
  const [profileData, setProfileData] = useState({
    // User Table
    name: "",
    email: "",
    
    // Company Details Table
    companyName: "",
    phone: "",
    industry: "",
    website: "",
    services: "", // maps to product_description
    
    // Platforms Table
    platforms: {
      quora: false,
      reddit: false,
      twitter: false, // Schema has 'twitter', UI might say X
      linkedin: false,
      facebook: false,
      youtube: false
    }
  });

  // ==========================================
  // 1. FETCH DATA ON LOAD
  // ==========================================
  useEffect(() => {
    if (!clerkUser?.id) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // Fetch from our new endpoint
        const res = await fetch(`${API_BASE}/api/settings/profile?userId=${clerkUser.id}`);
        
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        
        if (data) {
          setProfileData({
            name: data.user?.name || clerkUser.fullName || "",
            email: data.user?.email || clerkUser.primaryEmailAddress?.emailAddress || "",
            
            companyName: data.company?.companyName || "",
            phone: data.company?.phoneNumber || "",
            industry: data.company?.industry || "",
            website: data.company?.websiteUrl || "",
            services: data.company?.productDescription || "",
            
            platforms: {
              quora: data.platforms?.quora ?? false,
              reddit: data.platforms?.reddit ?? false,
              twitter: data.platforms?.twitter ?? false,
              linkedin: data.platforms?.linkedin ?? false,
              facebook: data.platforms?.facebook ?? false,
              youtube: data.platforms?.youtube ?? false,
            }
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("Could not load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [clerkUser]);

  // ==========================================
  // 2. SAVE DATA
  // ==========================================
  const handleSave = async () => {
    if (!clerkUser?.id) return;
    setIsSaving(true);

    try {
      // Construct payload matching server.ts expectation
      const payload = {
        userId: clerkUser.id,
        userData: { 
            name: profileData.name 
        },
        companyData: {
          companyName: profileData.companyName || profileData.name + "'s Company", // Fallback if empty
          phoneNumber: profileData.phone,
          industry: profileData.industry,
          websiteUrl: profileData.website,
          productDescription: profileData.services
        },
        platformsData: profileData.platforms
      };

      const res = await fetch(`${API_BASE}/api/settings/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // Static Data for UI
  const integrations = [
    { name: "HubSpot CRM", icon: Database, status: "Connected", description: "Sync leads and contacts automatically" },
    { name: "Slack", icon: MessageSquare, status: "Connected", description: "Real-time alerts for high-intent comments" },
    { name: "Webhook", icon: Webhook, status: "Configured", description: "Custom event streaming to your endpoint" },
    { name: "Email Notifications", icon: Mail, status: "Active", description: "Daily summaries and weekly reports" },
  ];

  if (isLoading) {
      return <div className="min-h-screen bg-black flex items-center justify-center text-[#FFD700]"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-black/95 min-h-screen text-zinc-100">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 text-white">
          <Settings2 className="h-6 w-6 text-[#FFD700]" />
          Settings <span className="text-[#FFD700]">&</span> Integrations
        </h1>
        <p className="text-sm md:text-base text-zinc-400">
          Manage your profile, company details, and system configurations.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        {/* Responsive Tabs List */}
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="flex w-max md:w-full md:grid md:grid-cols-5 bg-zinc-900/50 p-1 border border-zinc-800">
            <TabsTrigger value="profile" className="px-6 md:px-0 data-[state=active]:bg-[#FFD700] data-[state=active]:text-black font-medium">Profile</TabsTrigger>
            <TabsTrigger value="tracking" className="px-6 md:px-0 data-[state=active]:bg-[#FFD700] data-[state=active]:text-black font-medium">Tracking</TabsTrigger>
            <TabsTrigger value="webhooks" className="px-6 md:px-0 data-[state=active]:bg-[#FFD700] data-[state=active]:text-black font-medium">Webhooks</TabsTrigger>
            <TabsTrigger value="integrations" className="px-6 md:px-0 data-[state=active]:bg-[#FFD700] data-[state=active]:text-black font-medium">Integrations</TabsTrigger>
            <TabsTrigger value="security" className="px-6 md:px-0 data-[state=active]:bg-[#FFD700] data-[state=active]:text-black font-medium">Security</TabsTrigger>
          </TabsList>
        </div>

        {/* =======================
            PROFILE TAB
           ======================= */}
        <TabsContent value="profile" className="space-y-6 mt-4 md:mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: User & Company Forms */}
                <div className="lg:col-span-2 space-y-6">
                    {/* User Profile Card */}
                    <Card className="p-6 bg-zinc-900/50 border-zinc-800">
                        <h3 className="text-lg font-bold mb-6 text-[#FFD700] flex items-center gap-2">
                            <User className="h-4 w-4" /> User Profile
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400">User Name</Label>
                                    <Input 
                                        className="bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50" 
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400">Email</Label>
                                    <Input 
                                        className="bg-black/40 border-zinc-800 text-zinc-500 cursor-not-allowed" 
                                        value={profileData.email} 
                                        disabled 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400">Phone Number</Label>
                                    <Input 
                                        className="bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50" 
                                        placeholder="+1 (555) 000-0000"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400">Industry</Label>
                                    <Input 
                                        className="bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50" 
                                        placeholder="e.g. SaaS, Marketing"
                                        value={profileData.industry}
                                        onChange={(e) => setProfileData({...profileData, industry: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Photo Upload Area (Visual Only) */}
                            <div className="h-full">
                                <Label className="text-xs text-zinc-400 mb-2 block">Profile Photo</Label>
                                <div className="border-2 border-dashed border-zinc-800 rounded-lg h-[calc(100%-28px)] flex flex-col items-center justify-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer group">
                                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="h-6 w-6 text-zinc-400 group-hover:text-[#FFD700]" />
                                    </div>
                                    <span className="text-sm text-zinc-500 font-medium">Upload Photo</span>
                                </div>
                            </div>
                        </div>

                        {/* Suggestions Tags */}
                        <div className="mt-8 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Suggested Industries</Label>
                                <div className="flex flex-wrap gap-2">
                                    {["AI", "Web3", "Healthcare", "Fintech", "Marketing"].map(tag => (
                                        <Badge 
                                            key={tag} 
                                            variant="outline" 
                                            className="cursor-pointer hover:border-[#FFD700] hover:text-[#FFD700] bg-transparent border-zinc-700 text-zinc-400"
                                            onClick={() => setProfileData({...profileData, industry: tag})}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Company Details Card */}
                    <Card className="p-6 bg-zinc-900/50 border-zinc-800">
                        <h3 className="text-lg font-bold mb-6 text-[#FFD700] flex items-center gap-2">
                             <Briefcase className="h-4 w-4" /> Company Details
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Company Name</Label>
                                <Input 
                                    className="bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50" 
                                    placeholder="Your Company Name"
                                    value={profileData.companyName}
                                    onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Website</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                    <Input 
                                        className="pl-9 bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50" 
                                        placeholder="https://yourcompany.com"
                                        value={profileData.website}
                                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Services / Products</Label>
                                <Textarea 
                                    className="bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50 min-h-[100px]" 
                                    placeholder="Describe what your company does..."
                                    value={profileData.services}
                                    onChange={(e) => setProfileData({...profileData, services: e.target.value})}
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Active Platforms */}
                <div className="space-y-6">
                    <Card className="p-6 bg-zinc-900/50 border-zinc-800 h-full flex flex-col">
                        <h3 className="text-lg font-bold mb-6 text-[#FFD700]">Active Platforms</h3>
                        <div className="space-y-4 flex-grow">
                            <p className="text-xs text-zinc-500 mb-4">Select where you want to monitor leads.</p>
                            
                            {[
                                { id: "quora", label: "Quora" },
                                { id: "reddit", label: "Reddit" },
                                { id: "linkedin", label: "LinkedIn" },
                                { id: "twitter", label: "Twitter/X" },
                            ].map((platform) => (
                                <div key={platform.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-black/40">
                                    <span className="text-sm font-medium">{platform.label}</span>
                                    <Switch 
                                        className="data-[state=checked]:bg-[#FFD700]"
                                        checked={profileData.platforms[platform.id as keyof typeof profileData.platforms]}
                                        onCheckedChange={(checked) => 
                                            setProfileData({
                                                ...profileData, 
                                                platforms: { ...profileData.platforms, [platform.id]: checked }
                                            })
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-zinc-800">
                             <Button 
                                onClick={handleSave} 
                                disabled={isSaving}
                                className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-bold transition-all"
                            >
                                {isSaving ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </TabsContent>

        {/* =======================
            EXISTING TABS
           ======================= */}
        
        {/* Link Tracking */}
        <TabsContent value="tracking" className="space-y-6 mt-4 md:mt-8">
          <Card className="p-4 md:p-6 bg-card border-border bg-zinc-900/50 border-zinc-800">
            <h3 className="text-lg md:text-xl font-bold mb-6 text-[#FFD700]">Link Tracking</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="short-domain" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Short Domain</Label>
                <Input id="short-domain" defaultValue="lq.link" className="bg-black/40 border-zinc-800 h-11" />
                <p className="text-[11px] text-muted-foreground italic">Custom short domain for branded links.</p>
              </div>
              <Separator className="bg-zinc-800" />
              <div className="space-y-4">
                <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Default UTM Parameters</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["source", "medium", "campaign", "content"].map((utm) => (
                    <div key={utm}>
                      <Label className="text-[10px] text-muted-foreground ml-1 mb-1 block">utm_{utm}</Label>
                      <Input 
                        defaultValue={utm === "content" ? "" : `lq_${utm}`} 
                        placeholder={utm === "content" ? "Auto-filled" : ""}
                        disabled={utm === "content"}
                        className="bg-black/40 border-zinc-800 h-10" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="space-y-6 mt-4">
          <Card className="p-4 md:p-6 bg-card border-border bg-zinc-900/50 border-zinc-800">
            <h3 className="text-lg md:text-xl font-bold mb-6 text-[#FFD700]">Webhooks</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="webhook-url" className="text-xs uppercase font-bold text-muted-foreground">Endpoint URL</Label>
                <Input id="webhook-url" placeholder="https://..." className="bg-black/40 border-zinc-800 h-11" />
              </div>
              <div className="space-y-3">
                <Label className="text-xs uppercase font-bold text-muted-foreground">Events to Stream</Label>
                <div className="grid grid-cols-1 gap-2">
                  {["comment_received", "intent_scored", "reply_sent", "link_clicked"].map((ev) => (
                    <div key={ev} className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-zinc-800">
                      <code className="text-[10px] md:text-xs font-mono text-[#FFD700] uppercase tracking-tighter">{ev}</code>
                      <Switch defaultChecked className="data-[state=checked]:bg-[#FFD700]" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4">
                <Button className="w-full md:w-auto bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-bold px-8">
                  Test Connection
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Integrations Grid */}
        <TabsContent value="integrations" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.name} className="p-4 md:p-6 bg-zinc-900/50 border-zinc-800 flex flex-col justify-between hover:border-[#FFD700]/30 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex items-center justify-center">
                        <integration.icon className="h-5 w-5 text-[#FFD700]" />
                      </div>
                      <h4 className="font-bold text-sm md:text-base">{integration.name}</h4>
                    </div>
                    <Badge variant="outline" className={integration.status === "Connected" ? "bg-emerald-500/10 text-emerald-500 border-none" : ""}>
                      {integration.status}
                    </Badge>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-6 leading-relaxed">
                    {integration.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1 text-xs bg-zinc-800 hover:bg-zinc-700">Configure</Button>
                  {integration.status === "Connected" && (
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/5 text-xs">Disconnect</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-4">
          <Card className="p-4 md:p-6 bg-zinc-900/50 border-zinc-800">
            <h3 className="text-lg md:text-xl font-bold mb-6 text-[#FFD700] flex items-center gap-2">
              <Lock className="h-5 w-5" /> Security & Access
            </h3>
            <div className="space-y-6">
              {[
                { title: "2FA Authentication", desc: "Require code for admin login." },
                { title: "Author Blacklist", desc: "Ignore specific users." },
                { title: "Keywords Filter", desc: "Block replies for specific words." }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm md:text-base font-semibold">{item.title}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-[#FFD700]" />
                </div>
              ))}
              <div className="pt-4">
                <Input placeholder="Add comma separated keywords..." className="bg-black/40 border-zinc-800" />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsIntegrations;