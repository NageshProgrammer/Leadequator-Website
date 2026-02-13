import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react"; // Assuming you use Clerk hook
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea"; // Make sure you have this component
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Briefcase
} from "lucide-react";
import { toast } from "sonner"; // Or your preferred toast library

const SettingsIntegrations = () => {
  const { user: clerkUser } = useUser();
  const [loading, setLoading] = useState(false);

  // Form State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    industry: "",
    website: "",
    services: "",
    platforms: {
      quora: false,
      reddit: false,
      twitter: false,
      linkedin: false
    }
  });

  // Fetch Data on Mount
  useEffect(() => {
    if (!clerkUser?.id) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/settings/profile?userId=${clerkUser.id}`);
        const data = await res.json();
        
        if (data) {
          setProfileData({
            name: data.user?.name || clerkUser.fullName || "",
            email: data.user?.email || clerkUser.primaryEmailAddress?.emailAddress || "",
            phone: data.company?.phoneNumber || "",
            industry: data.company?.industry || "",
            website: data.company?.websiteUrl || "",
            services: data.company?.productDescription || "",
            platforms: {
              quora: data.platforms?.quora || false,
              reddit: data.platforms?.reddit || false,
              twitter: data.platforms?.twitter || false,
              linkedin: data.platforms?.linkedin || false,
            }
          });
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      }
    };

    fetchProfile();
  }, [clerkUser]);

  // Handle Save
  const handleSave = async () => {
    if (!clerkUser?.id) return;
    setLoading(true);

    try {
      const payload = {
        userId: clerkUser.id,
        userData: { name: profileData.name },
        companyData: {
          phoneNumber: profileData.phone,
          industry: profileData.industry,
          websiteUrl: profileData.website,
          productDescription: profileData.services
        },
        platformsData: profileData.platforms
      };

      const res = await fetch("http://localhost:5000/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const integrations = [
    { name: "HubSpot CRM", icon: Database, status: "Connected", description: "Sync leads and contacts automatically" },
    { name: "Slack", icon: MessageSquare, status: "Connected", description: "Real-time alerts for high-intent comments" },
    { name: "Webhook", icon: Webhook, status: "Configured", description: "Custom event streaming to your endpoint" },
    { name: "Email Notifications", icon: Mail, status: "Active", description: "Daily summaries and weekly reports" },
  ];

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
            <TabsTrigger value="profile" className="px-6 md:px-0 data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">Profile</TabsTrigger>
            <TabsTrigger value="tracking" className="px-6 md:px-0 data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">Tracking</TabsTrigger>
            <TabsTrigger value="webhooks" className="px-6 md:px-0 data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">Webhooks</TabsTrigger>
            <TabsTrigger value="integrations" className="px-6 md:px-0 data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">Integrations</TabsTrigger>
            <TabsTrigger value="security" className="px-6 md:px-0 data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">Security</TabsTrigger>
          </TabsList>
        </div>

        {/* =======================
            PROFILE TAB (NEW)
           ======================= */}
        <TabsContent value="profile" className="space-y-6 mt-4 md:mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: User Profile Form */}
                <div className="lg:col-span-2 space-y-6">
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
                                        className="bg-black/40 border-zinc-800 text-zinc-500" 
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

                            {/* Photo Upload Area */}
                            <div className="h-full">
                                <Label className="text-xs text-zinc-400 mb-2 block">Profile Photo</Label>
                                <div className="border-2 border-dashed border-zinc-800 rounded-lg h-[calc(100%-24px)] flex flex-col items-center justify-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer group">
                                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="h-6 w-6 text-zinc-400 group-hover:text-[#FFD700]" />
                                    </div>
                                    <span className="text-sm text-zinc-500 font-medium">Upload Photo</span>
                                </div>
                            </div>
                        </div>

                        {/* Suggestions / Tags */}
                        <div className="mt-8 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Suggested</Label>
                                <div className="flex flex-wrap gap-2">
                                    {["AI", "Web3", "Healthcare", "Fintech", "Marketing"].map(tag => (
                                        <Badge key={tag} variant="outline" className="cursor-pointer hover:border-[#FFD700] hover:text-[#FFD700] bg-transparent border-zinc-700 text-zinc-400">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-zinc-900/50 border-zinc-800">
                        <h3 className="text-lg font-bold mb-6 text-[#FFD700] flex items-center gap-2">
                             <Briefcase className="h-4 w-4" /> Company Details
                        </h3>
                        <div className="space-y-4">
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
                    <Card className="p-6 bg-zinc-900/50 border-zinc-800 h-full">
                        <h3 className="text-lg font-bold mb-6 text-[#FFD700]">Active Platforms</h3>
                        <div className="space-y-4">
                            <p className="text-xs text-zinc-500 mb-4">Select where you want to be active.</p>
                            
                            {[
                                { id: "quora", label: "Quora" },
                                { id: "reddit", label: "Reddit" },
                                { id: "linkedin", label: "LinkedIn" },
                                { id: "twitter", label: "Twitter/X" },
                            ].map((platform) => (
                                <div key={platform.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-black/40">
                                    <span className="text-sm font-medium">{platform.label}</span>
                                    <Switch 
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
                                disabled={loading}
                                className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-bold"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </TabsContent>

        {/* =======================
            EXISTING TABS (UNCHANGED)
           ======================= */}
        
        {/* Link Tracking */}
        <TabsContent value="tracking" className="space-y-6 mt-4 md:mt-8">
          <Card className="p-4 md:p-6 bg-card border-border">
            <h3 className="text-lg md:text-xl font-bold mb-6 text-[#FFD700]">Link Tracking</h3>
            {/* ... keep your existing tracking code ... */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="short-domain" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Short Domain</Label>
                <Input id="short-domain" defaultValue="lq.link" className="bg-background h-11" />
                <p className="text-[11px] text-muted-foreground italic">Custom short domain for branded links.</p>
              </div>
              <Separator />
              <div className="space-y-4">
                 {/* ... existing UTM inputs ... */}
                 <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Default UTM Parameters</Label>
                 {/* Just rendering a placeholder here to keep it short for the answer, keep your original loop */}
                 <div className="p-4 bg-zinc-900/50 rounded text-sm text-zinc-500">Existing UTM Inputs...</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="space-y-6 mt-4">
          <Card className="p-4 md:p-6 bg-card border-border">
             <h3 className="text-lg md:text-xl font-bold mb-6 text-[#FFD700]">Webhooks</h3>
             {/* ... keep your existing webhooks code ... */}
             <div className="p-4 text-zinc-500">Existing Webhooks UI...</div>
          </Card>
        </TabsContent>

        {/* Integrations Grid */}
        <TabsContent value="integrations" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.name} className="p-4 md:p-6 bg-card border-border flex flex-col justify-between hover:border-[#FFD700]/30 transition-colors">
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
                  <Button variant="secondary" size="sm" className="flex-1 text-xs">Configure</Button>
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
            {/* ... keep your existing security code ... */}
             <Card className="p-4 md:p-6 bg-card border-border">
                 <h3 className="text-lg md:text-xl font-bold mb-6 text-[#FFD700] flex items-center gap-2">
                 <Lock className="h-5 w-5" /> Security & Access
                 </h3>
                 <div className="p-4 text-zinc-500">Existing Security UI...</div>
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsIntegrations;