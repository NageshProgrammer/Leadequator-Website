import { useEffect, useState, useRef } from "react";
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
  Loader2,
  X,
  Trash2,
  RefreshCcw,
  Zap
} from "lucide-react";
import Loader from "@/[components]/loader";

// ==========================================
// 🔧 API CONFIGURATION
// ==========================================
const API_BASE = import.meta.env.MODE === "development" 
  ? "http://localhost:5000" 
  : "https://api.leadequator.live"; 

const SettingsIntegrations = () => {
  const { user: clerkUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Local state for the keyword input field
  const [keywordInput, setKeywordInput] = useState("");

  // Form State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    companyName: "",
    phone: "",
    industry: "",
    website: "",
    services: "", 
    keywords: [] as string[],
    platforms: {
      quora: false,
      reddit: false,
      twitter: false, 
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

    setImagePreview(clerkUser.imageUrl);

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
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
            keywords: data.keywords || [],
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
  // 2. IMAGE HANDLERS
  // ==========================================
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large (max 5MB)");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // ==========================================
  // 3. KEYWORD LOGIC
  // ==========================================
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = keywordInput.trim();
      if (trimmed && !profileData.keywords.includes(trimmed)) {
        setProfileData(prev => ({
          ...prev,
          keywords: [...prev.keywords, trimmed]
        }));
        setKeywordInput(""); 
      }
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keywordToRemove)
    }));
  };

  // ==========================================
  // 4. SAVE DATA
  // ==========================================
  const handleSave = async () => {
    if (!clerkUser?.id) return;
    setIsSaving(true);

    try {
      if (imageFile) {
        await clerkUser.setProfileImage({ file: imageFile });
      }

      const payload = {
        userId: clerkUser.id,
        userData: { name: profileData.name },
        companyData: {
          companyName: profileData.companyName || profileData.name + "'s Company",
          phoneNumber: profileData.phone,
          industry: profileData.industry,
          websiteUrl: profileData.website,
          productDescription: profileData.services
        },
        platformsData: profileData.platforms,
        keywords: profileData.keywords 
      };

      const res = await fetch(`${API_BASE}/api/settings/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Profile and settings updated successfully!");
      } else {
        throw new Error("Failed to update database");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const integrations = [
    { name: "HubSpot CRM", icon: Database, status: "Connected", description: "Sync leads and contacts automatically" },
    { name: "Slack", icon: MessageSquare, status: "Connected", description: "Real-time alerts for high-intent comments" },
    { name: "Webhook", icon: Webhook, status: "Configured", description: "Custom event streaming to your endpoint" },
    { name: "Email Notifications", icon: Mail, status: "Active", description: "Daily summaries and weekly reports" },
  ];

  if (isLoading) {
      return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-black/10">
          <Loader/>
          <p className="text-[#fbbf24] font-medium tracking-widest uppercase text-xs mt-4 animate-pulse">Loading Profile...</p>
        </div>
      );
  }

  // REUSABLE STYLES
  const glassCardStyle = "bg-[#050505]/25 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem] p-6 md:p-8";
  const inputStyle = "bg-white/[0.03] border-white/[0.08] text-white focus-visible:ring-[#fbbf24]/30 focus-visible:border-[#fbbf24]/50 rounded-xl h-11 transition-all placeholder:text-zinc-600";
  const labelStyle = "text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1 block";

  return (
    <div className="p-4 md:p-8 rounded-3xl space-y-8 bg-black/10 min-h-screen text-white relative z-10 selection:bg-[#fbbf24]/30 overflow-x-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-[#fbbf24]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-[#fbbf24]/10 rounded-xl border border-[#fbbf24]/20 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.2)]">
            <Settings2 className="h-6 w-6 text-[#fbbf24]" />
          </div>
          Account <span className="text-[#fbbf24] drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">Settings</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400 font-medium ml-1">
          Manage your profile, company details, and lead targeting parameters.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        
        {/* Responsive Tabs List */}
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <TabsList className="flex w-max md:w-full md:grid md:grid-cols-5 bg-[#050505]/25 backdrop-blur-md p-1.5 border border-white/[0.08] rounded-2xl h-auto">
            <TabsTrigger value="profile" className="px-6 py-2.5 rounded-xl text-zinc-400 data-[state=active]:bg-[#fbbf24]/10 data-[state=active]:text-[#fbbf24] data-[state=active]:border data-[state=active]:border-[#fbbf24]/20 font-bold transition-all data-[state=active]:shadow-sm">
              General Profile
            </TabsTrigger>
            {/* Future Tabs can go here */}
          </TabsList>
        </div>

        {/* =======================
            PROFILE TAB
           ======================= */}
        <TabsContent value="profile" className="space-y-6 mt-2 focus-visible:outline-none">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                
                {/* Left Column: User & Company Forms */}
                <div className="xl:col-span-2 space-y-6 md:space-y-8">
                    
                    {/* --- User Profile Card --- */}
                    <Card className={glassCardStyle}>
                        <div className="flex items-center gap-3 mb-8">
                            <User className="h-5 w-5 text-[#fbbf24]" />
                            <h3 className="text-xl font-bold tracking-wide">Personal Details</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Photo Upload Area */}
                            <div className="md:col-span-1 flex flex-col items-center sm:items-start justify-start">
                                <Label className={labelStyle}>Profile Photo</Label>
                                <input 
                                  type="file" 
                                  ref={fileInputRef} 
                                  onChange={handleFileChange} 
                                  className="hidden" 
                                  accept="image/*"
                                />

                                <div className="w-40 h-40 mt-2 rounded-[2rem] border-2 border-dashed border-white/[0.1] bg-white/[0.02] overflow-hidden relative group transition-all hover:border-[#fbbf24]/50 hover:bg-white/[0.05]">
                                    {imagePreview ? (
                                      <>
                                        <img 
                                          src={imagePreview} 
                                          alt="Profile" 
                                          className="w-full h-full object-cover group-hover:opacity-30 transition-opacity duration-300" 
                                        />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                          <Button 
                                            variant="secondary" 
                                            size="sm" 
                                            className="bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 h-8 text-xs font-bold rounded-lg px-4"
                                            onClick={handleImageClick}
                                          >
                                            <RefreshCcw className="w-3 h-3 mr-2" /> Replace
                                          </Button>
                                          <Button 
                                            variant="destructive" 
                                            size="sm" 
                                            className="h-8 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-500/30 rounded-lg px-4"
                                            onClick={handleRemoveImage}
                                          >
                                            <Trash2 className="w-3 h-3 mr-2" /> Remove
                                          </Button>
                                        </div>
                                      </>
                                    ) : (
                                      <div 
                                        className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                                        onClick={handleImageClick}
                                      >
                                        <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#fbbf24]/10 transition-all">
                                            <Upload className="h-5 w-5 text-zinc-400 group-hover:text-[#fbbf24]" />
                                        </div>
                                        <span className="text-xs font-bold text-zinc-400 group-hover:text-white">Upload Photo</span>
                                      </div>
                                    )}
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="md:col-span-2 space-y-5">
                                <div className="space-y-2">
                                    <Label className={labelStyle}>Full Name</Label>
                                    <Input 
                                        className={inputStyle} 
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className={labelStyle}>Email Address <span className="text-zinc-600 normal-case font-medium ml-1">(Read Only)</span></Label>
                                    <Input 
                                        className={`${inputStyle} text-zinc-500 bg-white/[0.01] cursor-not-allowed border-transparent`} 
                                        value={profileData.email} 
                                        disabled 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className={labelStyle}>Phone Number</Label>
                                    <Input 
                                        className={inputStyle} 
                                        placeholder="+1 (555) 000-0000"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* --- Company Details Card --- */}
                    <Card className={glassCardStyle}>
                        <div className="flex items-center gap-3 mb-8">
                             <Briefcase className="h-5 w-5 text-[#fbbf24]" />
                             <h3 className="text-xl font-bold tracking-wide">Company Identity</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div className="space-y-2">
                                <Label className={labelStyle}>Company Name</Label>
                                <Input 
                                    className={inputStyle} 
                                    placeholder="Acme Corp"
                                    value={profileData.companyName}
                                    onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={labelStyle}>Industry</Label>
                                <Input 
                                    className={inputStyle} 
                                    placeholder="e.g. SaaS, FinTech, Agency"
                                    value={profileData.industry}
                                    onChange={(e) => setProfileData({...profileData, industry: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-2 mb-5">
                            <Label className={labelStyle}>Website URL</Label>
                            <div className="relative">
                                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <Input 
                                    className={`${inputStyle} pl-10`} 
                                    placeholder="https://yourcompany.com"
                                    value={profileData.website}
                                    onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className={labelStyle}>Product / Service Description</Label>
                            <Textarea 
                                className={`${inputStyle} min-h-[120px] resize-none pt-4`} 
                                placeholder="Describe what your company does. This helps our AI generate better replies..."
                                value={profileData.services}
                                onChange={(e) => setProfileData({...profileData, services: e.target.value})}
                            />
                        </div>
                    </Card>

                    {/* --- KEYWORDS SECTION --- */}
                    <Card className={glassCardStyle}>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                              <Zap className="h-5 w-5 text-[#fbbf24]" />
                              <h3 className="text-xl font-bold tracking-wide">Target Keywords</h3>
                          </div>
                          <Badge variant="outline" className="bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/20 hidden sm:flex">
                            {profileData.keywords.length} Active
                          </Badge>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className={labelStyle}>Add New Keyword</Label>
                                <Input 
                                    className={inputStyle} 
                                    placeholder="Type keyword & press Enter (e.g. 'cold outreach', 'seo tools')"
                                    value={keywordInput}
                                    onChange={(e) => setKeywordInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <p className="text-xs text-zinc-500 font-medium pl-1">Press <kbd className="bg-white/[0.05] px-1.5 py-0.5 rounded text-zinc-300 mx-1">Enter</kbd> to add. These keywords tell the AI what to look for.</p>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 pt-4 min-h-[60px]">
                                {profileData.keywords.length === 0 && (
                                    <span className="text-zinc-600 text-sm italic py-2">No keywords added yet. Start typing above!</span>
                                )}
                                {profileData.keywords.map((keyword, index) => (
                                    <Badge 
                                        key={index} 
                                        variant="secondary" 
                                        className="px-3 py-1.5 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.08] border border-white/[0.1] flex items-center gap-2 text-sm font-medium transition-all"
                                    >
                                        {keyword}
                                        <button 
                                            onClick={() => removeKeyword(keyword)}
                                            className="p-0.5 rounded-md hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Active Platforms & Save */}
                <div className="space-y-6 md:space-y-8">
                    <Card className={`${glassCardStyle} flex flex-col`}>
                        <h3 className="text-xl font-bold mb-2 text-white tracking-wide">Monitor Sources</h3>
                        <p className="text-sm text-zinc-400 mb-8 font-medium">Select which platforms to scrape for leads.</p>
                        
                        <div className="space-y-3 flex-grow">
                            {[
                                { id: "quora", label: "Quora" },
                                { id: "reddit", label: "Reddit" },
                                { id: "linkedin", label: "LinkedIn", badge: "Pro" },
                                { id: "twitter", label: "Twitter / X", badge: "Pro" },
                            ].map((platform) => (
                                <div key={platform.id} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                                    <div className="flex items-center gap-2">
                                      <span className="text-base font-bold text-zinc-200">{platform.label}</span>
                                      {platform.badge && (
                                        <Badge className="bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/20 text-[9px] px-1.5 py-0 uppercase tracking-widest">{platform.badge}</Badge>
                                      )}
                                    </div>
                                    <Switch 
                                        className="data-[state=checked]:bg-[#fbbf24]"
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
                        
                        <div className="mt-10 pt-6 border-t border-white/[0.08]">
                             <Button 
                                onClick={handleSave} 
                                disabled={isSaving}
                                className="w-full h-14 text-lg bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-bold rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all active:scale-[0.98]"
                            >
                                {isSaving ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving Configuration...</>
                                ) : (
                                    "Save All Changes"
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default SettingsIntegrations;