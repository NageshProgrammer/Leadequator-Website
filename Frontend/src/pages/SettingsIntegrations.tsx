import { useState, useEffect } from "react";
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
import { toast } from "sonner"; 
import {
  Webhook, Database, Mail, MessageSquare, Settings2, Lock,
  User, Upload, Globe, Briefcase, Loader2
} from "lucide-react";

const SettingsIntegrations = () => {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 👇 DYNAMIC URL LOGIC
  const API_BASE_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5000"           // Local development URL
    : "https://leadequator.live";       // Production URL

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    industry: "",
    website: "",
    description: "",
    companyName: "",
    keywords: [] as string[],
    platforms: { quora: false, reddit: false }
  });

  const [keywordInput, setKeywordInput] = useState("");

  // 1. FETCH DATA
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 👇 UPDATED FETCH URL
        const res = await fetch(`${API_BASE_URL}/api/settings?userId=${user.id}`);
        
        if (!res.ok) {
            // If new user, just ignore error and let them save new data
            if(res.status === 404) return;
            throw new Error("Failed to fetch");
        }
        
        const data = await res.json();
        
        // Populate state
        setFormData({
          name: data.user?.name || user.fullName || "",
          email: data.user?.email || user.primaryEmailAddress?.emailAddress || "",
          phone: data.company?.phoneNumber || "",
          industry: data.company?.industry || "",
          website: data.company?.websiteUrl || "",
          description: data.company?.productDescription || "",
          companyName: data.company?.companyName || "",
          keywords: data.keywords || [],
          platforms: {
            quora: data.platforms?.quora || false,
            reddit: data.platforms?.reddit || false
          }
        });
      } catch (error) {
        console.error("Failed to fetch settings", error);
        toast.error("Could not load settings.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, isLoaded]);

  // 2. HANDLERS
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlatformToggle = (platform: 'quora' | 'reddit') => {
    setFormData(prev => ({
      ...prev,
      platforms: { ...prev.platforms, [platform]: !prev.platforms[platform] }
    }));
  };

  const addKeyword = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      if (!formData.keywords.includes(keywordInput.trim())) {
        setFormData(prev => ({
          ...prev,
          keywords: [...prev.keywords, keywordInput.trim()]
        }));
      }
      setKeywordInput("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keywordToRemove)
    }));
  };

  // 3. SAVE DATA
  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      // 👇 UPDATED FETCH URL
      const res = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData
        })
      });

      if (res.ok) {
        toast.success("Settings updated successfully!");
      } else {
        toast.error("Failed to update settings.");
      }
    } catch (error) {
      console.error("Save error", error);
      toast.error("Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="animate-spin h-8 w-8 text-[#FFD700]" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-[#FFD700]" />
            Settings <span className="text-[#FFD700]">&</span> Integrations
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your profile, tracking, and company details.
          </p>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-bold min-w-[140px]"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="flex w-max md:w-full md:grid md:grid-cols-5 bg-zinc-900/50 p-1 border border-zinc-800">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
        </div>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-6 mt-4 md:mt-8">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-xl font-bold mb-6 text-[#FFD700]">Profile & Details</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Inputs */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">User Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="username" 
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className="pl-9 bg-background border-zinc-800" 
                        />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          value={formData.email}
                          disabled 
                          className="pl-9 bg-zinc-900/30 border-zinc-800 text-muted-foreground cursor-not-allowed" 
                        />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+91 ..." 
                      className="bg-background border-zinc-800" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input 
                      id="industry" 
                      value={formData.industry}
                      onChange={(e) => handleChange("industry", e.target.value)}
                      placeholder="e.g. SaaS" 
                      className="bg-background border-zinc-800" 
                    />
                  </div>
                </div>

                {/* Photo Upload Placeholder */}
                <div className="md:col-span-1">
                  <Label className="mb-2 block">Profile Photo</Label>
                  <div className="h-full min-h-[200px] border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center bg-zinc-900/30">
                    <div className="p-4 rounded-full bg-zinc-800 mb-3">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">Upload Photo</span>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                 <Label>Interests & Keywords</Label>
                 <Input 
                   value={keywordInput}
                   onChange={(e) => setKeywordInput(e.target.value)}
                   onKeyDown={addKeyword}
                   placeholder="Type keyword & press Enter" 
                   className="bg-zinc-900/50 border-zinc-800" 
                 />
                 <div className="flex flex-wrap gap-2 mt-2">
                   {formData.keywords.map((k, i) => (
                     <Badge key={i} variant="secondary" className="bg-zinc-800 text-zinc-300 pr-1 gap-2 border border-zinc-700">
                       {k} 
                       <span onClick={() => removeKeyword(k)} className="cursor-pointer hover:text-red-400 font-bold px-1">×</span>
                     </Badge>
                   ))}
                 </div>
              </div>

              <Separator className="bg-zinc-800" />

              {/* Company Details */}
              <div className="space-y-4">
                <h4 className="text-[#FFD700] font-semibold flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Company Details
                </h4>
                
                <div className="grid gap-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="website" 
                          value={formData.website}
                          onChange={(e) => handleChange("website", e.target.value)}
                          placeholder="https://..." 
                          className="pl-9 bg-background border-zinc-800" 
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="services">Services / Products</Label>
                    <Textarea 
                        id="services" 
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        placeholder="Describe your services..." 
                        className="bg-background border-zinc-800 min-h-[100px] resize-none" 
                    />
                </div>
              </div>

              {/* Platforms */}
              <div className="space-y-3 pt-2">
                <Label className="text-[#FFD700]">Active Platforms</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div 
                      onClick={() => handlePlatformToggle('quora')}
                      className={`cursor-pointer h-12 flex items-center justify-center rounded-md border transition-all font-medium ${
                        formData.platforms.quora 
                          ? "border-[#FFD700] text-[#FFD700] bg-zinc-900/80" 
                          : "border-zinc-700 hover:border-zinc-500 text-muted-foreground"
                      }`}
                    >
                        Quora
                    </div>
                    <div 
                      onClick={() => handlePlatformToggle('reddit')}
                      className={`cursor-pointer h-12 flex items-center justify-center rounded-md border transition-all font-medium ${
                        formData.platforms.reddit 
                          ? "border-[#FF5700] text-[#FF5700] bg-zinc-900/80" 
                          : "border-zinc-700 hover:border-zinc-500 text-muted-foreground"
                      }`}
                    >
                        Reddit
                    </div>
                </div>
              </div>

            </div>
          </Card>
        </TabsContent>

        {/* OTHER TABS (Placeholder content to keep layout intact) */}
        <TabsContent value="tracking" className="mt-4"><Card className="p-6">Tracking Settings Placeholder</Card></TabsContent>
        <TabsContent value="webhooks" className="mt-4"><Card className="p-6">Webhooks Settings Placeholder</Card></TabsContent>
        <TabsContent value="integrations" className="mt-4"><Card className="p-6">Integrations Settings Placeholder</Card></TabsContent>
        <TabsContent value="security" className="mt-4"><Card className="p-6">Security Settings Placeholder</Card></TabsContent>

      </Tabs>
    </div>
  );
};

export default SettingsIntegrations;